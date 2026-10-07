import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeHtml } from "./_lib/analyzeHtml";
import { clientIp, rateLimiter } from "./_lib/http";
import { FetchBlockedError, safeFetch } from "./_lib/safeFetch";

const allow = rateLimiter(8, 60 * 1000); // 8 análises por minuto por IP

/** Diagnóstico gratuito do site: baixa o HTML com segurança e roda checagens reais. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!allow(clientIp(req))) return res.status(429).json({ error: "Muitas análises seguidas. Aguarde um minuto e tente de novo." });

  const raw = String(req.query.url ?? "");
  try {
    const page = await safeFetch(raw, { timeoutMs: 8000 });
    const type = String(page.headers["content-type"] ?? "");
    if (page.status >= 400) {
      return res.status(200).json({ ok: false, error: `O site respondeu com erro ${page.status}. Confira se o endereço abre no navegador.` });
    }
    if (type && !/html/i.test(type)) {
      return res.status(200).json({ ok: false, error: "Esse endereço não é uma página da web (não devolveu HTML)." });
    }
    const result = analyzeHtml({ finalUrl: page.finalUrl, status: page.status, elapsedMs: page.elapsedMs, bytes: page.bytes, html: page.body });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, url: page.finalUrl, redirects: page.redirects, ...result, analyzedAt: new Date().toISOString() });
  } catch (err) {
    if (err instanceof FetchBlockedError) return res.status(200).json({ ok: false, error: err.message });
    const msg = String((err as Error)?.message ?? "");
    const friendly = /timeout/i.test(msg)
      ? "O site demorou demais para responder (mais de 8 s)."
      : /ENOTFOUND|EAI_AGAIN/i.test(msg)
        ? "Não encontramos esse domínio. Confira se está escrito certo."
        : /certificate|SSL|TLS/i.test(msg)
          ? "O certificado de segurança (HTTPS) do site apresentou erro."
          : "Não conseguimos acessar esse site agora.";
    return res.status(200).json({ ok: false, error: friendly });
  }
}
