import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clientIp, rateLimiter } from "./_lib/http";
import { FetchBlockedError, parseTargetUrl } from "./_lib/safeFetch";

const allow = rateLimiter(6, 60 * 1000);

/**
 * Velocidade no celular pela API oficial do Google PageSpeed Insights.
 * Quem busca a página é o Google; aqui só repassamos o resultado.
 * Com PAGESPEED_API_KEY configurada na Vercel a cota é bem maior.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!allow(clientIp(req))) return res.status(429).json({ ok: false, error: "Muitas medições seguidas." });

  let target: URL;
  try {
    target = parseTargetUrl(String(req.query.url ?? ""));
  } catch (err) {
    return res.status(200).json({ ok: false, error: err instanceof FetchBlockedError ? err.message : "Endereço inválido." });
  }

  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", target.toString());
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 50_000);
  try {
    const r = await fetch(api, { signal: ctrl.signal });
    if (!r.ok) return res.status(200).json({ ok: false, error: r.status === 429 ? "Limite de medições do Google atingido. Tente mais tarde." : "O Google não conseguiu medir agora." });
    const data = (await r.json()) as any;
    const audits = data?.lighthouseResult?.audits ?? {};
    const score = data?.lighthouseResult?.categories?.performance?.score;
    const num = (k: string) => (typeof audits[k]?.numericValue === "number" ? Math.round(audits[k].numericValue) : null);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      ok: typeof score === "number",
      performance: typeof score === "number" ? Math.round(score * 100) : null,
      lcpMs: num("largest-contentful-paint"),
      tbtMs: num("total-blocking-time"),
      cls: typeof audits["cumulative-layout-shift"]?.numericValue === "number" ? Number(audits["cumulative-layout-shift"].numericValue.toFixed(3)) : null,
      fcpMs: num("first-contentful-paint"),
    });
  } catch {
    return res.status(200).json({ ok: false, error: "A medição de velocidade demorou demais." });
  } finally {
    clearTimeout(timer);
  }
}
