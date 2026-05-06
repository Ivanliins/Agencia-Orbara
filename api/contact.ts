import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nome, email, whatsapp, site, servico, faturamento } = req.body ?? {};

  if (!nome || !email || !servico || !faturamento) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend não configurado." });
  }

  const resend = new Resend(apiKey);

  const html = `
    <h2>Novo contato via site da Orbara</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td><strong>Nome</strong></td><td>${nome}</td></tr>
      <tr><td><strong>E-mail</strong></td><td>${email}</td></tr>
      <tr><td><strong>WhatsApp</strong></td><td>${whatsapp}</td></tr>
      <tr><td><strong>Site atual</strong></td><td>${site || "—"}</td></tr>
      <tr><td><strong>Serviço/produto</strong></td><td>${servico}</td></tr>
      <tr><td><strong>Faturamento</strong></td><td>${faturamento}</td></tr>
    </table>
  `;

  try {
    await resend.emails.send({
      from: "Orbara <contato@orbara.com.br>",
      to: ["contato@orbara.com.br"],
      replyTo: email,
      subject: `Novo contato: ${nome}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Erro ao enviar e-mail." });
  }
}
