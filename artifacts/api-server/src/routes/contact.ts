import { Router } from "express";
import { getUncachableResendClient } from "../lib/resend.js";

const contactRouter = Router();

contactRouter.post("/contact", async (req, res) => {
  const { nome, email, whatsapp, site, servico, faturamento } = req.body ?? {};

  if (!nome || !email || !servico || !faturamento) {
    res.status(400).json({ error: "Campos obrigatórios ausentes." });
    return;
  }

  try {
    const { client } = await getUncachableResendClient();

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

    const result = await client.emails.send({
      from: "Orbara <contato@orbara.com.br>",
      to: ["contato@orbara.com.br"],
      replyTo: email,
      subject: `Novo contato: ${nome}`,
      html,
    });

    req.log.info({ resendId: result.data?.id }, "contact email sent");
    res.json({ ok: true });
  } catch (err: any) {
    req.log.error({ err }, "failed to send contact email");
    res.status(500).json({ error: "Erro ao enviar e-mail." });
  }
});

export default contactRouter;
