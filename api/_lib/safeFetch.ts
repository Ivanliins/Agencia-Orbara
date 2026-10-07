import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";
import { lookup } from "node:dns/promises";
import type { LookupFunction } from "node:net";

/**
 * Busca segura de uma página informada pelo visitante (auditoria do site).
 *
 * - Só http/https nas portas 80 e 443, sem usuário/senha na URL.
 * - Resolve o DNS antes, recusa qualquer endereço que não seja público (rede interna,
 *   loopback, link-local, metadados de nuvem, faixas reservadas) e fixa a conexão no IP
 *   validado, para o DNS não "trocar" de endereço entre a checagem e a conexão.
 * - Valida de novo cada redirecionamento, limita tempo, tamanho e número de saltos.
 */
export class FetchBlockedError extends Error {}

export type SafeResponse = {
  finalUrl: string;
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
  bytes: number;
  elapsedMs: number;
  redirects: number;
};

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;
const USER_AGENT = "Mozilla/5.0 (compatible; OrbaraDiagnostico/1.0; +https://orbara.com.br)";

function ipv4ToInt(ip: string) {
  return ip.split(".").reduce((acc, p) => (acc << 8) + Number(p), 0) >>> 0;
}

const BLOCKED_V4: Array<[string, number]> = [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
];

function isPublicV4(ip: string) {
  const n = ipv4ToInt(ip);
  return !BLOCKED_V4.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (ipv4ToInt(base) & mask);
  });
}

function expandV6(ip: string): number[] | null {
  let addr = ip.toLowerCase();
  const v4 = addr.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) {
    const n = ipv4ToInt(v4[1]);
    addr = addr.replace(v4[1], `${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`);
  }
  const [head, tail] = addr.split("::");
  const h = head ? head.split(":") : [];
  const t = tail !== undefined ? (tail ? tail.split(":") : []) : [];
  const fill = addr.includes("::") ? new Array(8 - h.length - t.length).fill("0") : [];
  const parts = [...h, ...fill, ...t].map((x) => parseInt(x || "0", 16));
  return parts.length === 8 && parts.every((x) => x >= 0 && x <= 0xffff) ? parts : null;
}

function isPublicV6(ip: string) {
  const p = expandV6(ip);
  if (!p) return false;
  // IPv4 mapeado (::ffff:a.b.c.d) ou NAT64 (64:ff9b::/96): checa o IPv4 embutido
  const embedded = `${p[6] >> 8}.${p[6] & 255}.${p[7] >> 8}.${p[7] & 255}`;
  if (p.slice(0, 5).every((x) => x === 0) && p[5] === 0xffff) return isPublicV4(embedded);
  if (p[0] === 0x64 && p[1] === 0xff9b && p.slice(2, 6).every((x) => x === 0)) return isPublicV4(embedded);
  // Só unicast global (2000::/3), fora da faixa de documentação 2001:db8::/32
  if ((p[0] & 0xe000) !== 0x2000) return false;
  if (p[0] === 0x2001 && p[1] === 0x0db8) return false;
  return true;
}

export function isPublicAddress(ip: string) {
  const v = net.isIP(ip);
  if (v === 4) return isPublicV4(ip);
  if (v === 6) return isPublicV6(ip);
  return false;
}

export function parseTargetUrl(raw: string, allowPrivate = false): URL {
  let value = String(raw ?? "").trim();
  if (!value) throw new FetchBlockedError("Informe o endereço do site.");
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new FetchBlockedError("Endereço inválido.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new FetchBlockedError("Use um endereço http ou https.");
  if (url.username || url.password) throw new FetchBlockedError("Endereço com usuário/senha não é aceito.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new FetchBlockedError("Só analisamos sites nas portas padrão.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!allowPrivate && net.isIP(host) && !isPublicAddress(host)) throw new FetchBlockedError("Esse endereço não é público.");
  if (!allowPrivate && !net.isIP(host) && !host.includes(".")) throw new FetchBlockedError("Informe um domínio completo, como seusite.com.br.");
  if (!allowPrivate && /(^|\.)(localhost|local|internal|intranet|lan|home|corp)$/i.test(host)) throw new FetchBlockedError("Esse endereço não é público.");
  url.hash = "";
  return url;
}

async function resolvePublic(host: string, allowPrivate: boolean): Promise<{ address: string; family: 4 | 6 }> {
  const bare = host.replace(/^\[|\]$/g, "");
  const literal = net.isIP(bare);
  const answers = literal ? [{ address: bare, family: literal as 4 | 6 }] : await lookup(bare, { all: true, verbatim: true });
  if (!answers.length) throw new FetchBlockedError("Não encontramos esse domínio.");
  if (!allowPrivate && answers.some((a) => !isPublicAddress(a.address))) {
    throw new FetchBlockedError("Esse domínio aponta para um endereço que não é público.");
  }
  const pick = answers.find((a) => a.family === 4) ?? answers[0];
  return { address: pick.address, family: pick.family as 4 | 6 };
}

function requestOnce(url: URL, pinned: { address: string; family: 4 | 6 }, deadline: number): Promise<SafeResponse & { location?: string }> {
  const started = Date.now();
  const pinnedLookup: LookupFunction = (_host, opts, cb) => {
    if ((opts as { all?: boolean })?.all) (cb as unknown as (e: null, a: Array<{ address: string; family: number }>) => void)(null, [pinned]);
    else cb(null, pinned.address, pinned.family);
  };
  const lib = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: pinnedLookup,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "pt-BR,pt;q=0.9",
        },
        timeout: Math.max(1000, deadline - Date.now()),
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          return resolve({ finalUrl: url.toString(), status, headers: res.headers, body: "", bytes: 0, elapsedMs: Date.now() - started, redirects: 0, location: res.headers.location });
        }
        const enc = String(res.headers["content-encoding"] ?? "").toLowerCase();
        const stream =
          enc === "gzip" ? res.pipe(zlib.createGunzip()) : enc === "br" ? res.pipe(zlib.createBrotliDecompress()) : enc === "deflate" ? res.pipe(zlib.createInflate()) : res;
        const chunks: Buffer[] = [];
        let size = 0;
        stream.on("data", (c: Buffer) => {
          size += c.length;
          if (size > MAX_BYTES) {
            req.destroy();
            stream.destroy();
            resolve({ finalUrl: url.toString(), status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), bytes: size, elapsedMs: Date.now() - started, redirects: 0 });
            return;
          }
          chunks.push(c);
        });
        stream.on("end", () =>
          resolve({ finalUrl: url.toString(), status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), bytes: size, elapsedMs: Date.now() - started, redirects: 0 }),
        );
        stream.on("error", reject);
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

/** `allowPrivate` existe só para testes locais; o endpoint público nunca o usa. */
export async function safeFetch(raw: string, opts: { timeoutMs?: number; allowPrivate?: boolean } = {}): Promise<SafeResponse> {
  const deadline = Date.now() + (opts.timeoutMs ?? 8000);
  let url = parseTargetUrl(raw, opts.allowPrivate);
  const started = Date.now();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (Date.now() > deadline) throw new Error("timeout");
    const pinned = await resolvePublic(url.hostname, !!opts.allowPrivate);
    const res = await requestOnce(url, pinned, deadline);
    if (!res.location) return { ...res, elapsedMs: Date.now() - started, redirects: hop };
    url = parseTargetUrl(new URL(res.location, url).toString(), opts.allowPrivate);
  }
  throw new FetchBlockedError("Redirecionamentos demais.");
}
