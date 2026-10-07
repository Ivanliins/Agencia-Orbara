import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { clientIp, escapeHtml, rateLimiter } from "./_lib/http";

const allow = rateLimiter(5, 10 * 60 * 1000); // 5 envios a cada 10 min por IP
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body ?? {};
  // Armadilha para robôs: o campo "website" é invisível no formulário. Se veio preenchido,
  // respondemos como sucesso (para não ensinar o robô) e não enviamos nada.
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  if (!allow(clientIp(req))) {
    return res.status(429).json({ error: "Muitos envios em pouco tempo. Tente novamente em alguns minutos." });
  }

  const nome = clean(body.nome, 120);
  const email = clean(body.email, 160);
  const whatsapp = clean(body.whatsapp, 30);
  const site = clean(body.site, 200);
  const servico = clean(body.servico, 2000);
  const faturamento = clean(body.faturamento, 40);
  const digits = whatsapp.replace(/\D/g, "");

  if (!nome || !servico || !faturamento) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
  }
  if (digits.length < 10 || digits.length > 13) {
    return res.status(400).json({ error: "WhatsApp inválido." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend não configurado." });
  }

  const resend = new Resend(apiKey);
  const row = (label: string, value: string) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value) || "—"}</td></tr>`;
  const html = `
    <h2>Novo contato via site da Orbara</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;">
      ${row("Nome", nome)}
      ${row("E-mail", email)}
      ${row("WhatsApp", whatsapp)}
      ${row("Site atual", site)}
      ${row("Serviço/produto", servico).replace(/\n/g, "<br>")}
      ${row("Faturamento", faturamento)}
    </table>
  `;

  try {
    await resend.emails.send({
      from: "Orbara <contato@orbara.com.br>",
      to: ["contato@orbara.com.br"],
      replyTo: email,
      subject: `Novo contato: ${nome.replace(/[\r\n]+/g, " ")}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Erro ao enviar e-mail." });
  }
}
