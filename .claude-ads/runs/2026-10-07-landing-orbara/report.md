# Auditoria da landing page — orbara.com.br (Google Ads)

**Execução:** `2026-10-07-landing-orbara` · **Escopo:** página de destino (home) · **Situação:** parcial

**Base da análise:**
- código publicado (commit `6adb758`) e build de produção rodando localmente;
- Lighthouse mobile em 3 rodadas, mais medições com Playwright em 390×844 e 1440×900;
- políticas do Google Ads e o CDC, conferidos em fonte oficial ou resumo de busca, com data de consulta em 07/10/2026.

**Limitações:**
- **Sem verificação ao vivo:** a rede deste ambiente bloqueia o domínio, então não conferi redirecionamentos, resposta ao AdsBot nem cabeçalhos de produção.
- **Sem dados da conta:** não recebi anúncios, palavras-chave nem conversões. Por isso **não há nota de saúde da conta** e a comparação entre anúncio e página ficou como "desconhecida".
- **Desempenho:** os números são de laboratório, sem o gtag e sem o vídeo de fundo externo. Dados de campo ainda precisam ser coletados.
- **Pontos jurídicos:** a LGPD e o art. 38 do CDC não foram conferidos no texto oficial, então esses itens são provisórios.

---

## Resumo

A primeira tela funciona: a proposta é clara, o CTA aparece logo, o layout não se mexe durante o carregamento (CLS 0) e os dados estruturados estão completos. Os problemas que custam dinheiro em anúncio estão em outro lugar:

1. **O Google Ads não mede nenhum lead.** A tag está instalada, mas não existe evento de conversão no formulário nem nos 6 botões de WhatsApp.
2. **A "Auditoria instantânea" mostra um diagnóstico que não existe.** A nota sai do tamanho da URL e as "falhas detectadas" são sempre as mesmas. Isso é risco de reprovação no Google Ads (deturpação) e de publicidade enganosa (CDC art. 37).
3. **O caminho até o lead é longo.** No celular, o formulário fica a cerca de 31 telas de rolagem e tem 7 campos.

## Achados

| # | Controle | Status | Gravidade | Confiança | Achado |
|---|---|---|---|---|---|
| 1 | G42 | ❌ falha | Crítica | Alta | Nenhuma conversão medida (formulário e WhatsApp) |
| 2 | LP-POLICY-01 | ❌ falha | Crítica | Alta | Auditoria instantânea com nota e falhas simuladas |
| 3 | G59 | ❌ falha | Alta | Média | Celular: Performance mediana 62, LCP 3,5 s, TBT 1,6 s, vídeo de 1,9 MB baixado no início |
| 4 | LP-PRIV-01 | ❌ falha | Alta | Média | Sem Política de Privacidade; formulário e tag sem aviso (provisório) |
| 5 | G60 | ❔ desconhecido | Alta | — | Mensagem do anúncio × página: faltam anúncios e palavras-chave |
| 6 | LP-FORM-01 | ❌ falha | Média | Média | Formulário a ~26.600 px no celular, 7 campos, erro via `alert()` |
| 7 | LP-TRUST-01 | ❌ falha | Média | Média | Sem CNPJ/empresa/"Quem somos"; números sem comprovação visível |
| 8 | LP-WA-01 | ❌ falha | Média | Alta | 5 de 6 links de WhatsApp sem mensagem pronta (origem do lead perdida) |
| 9 | LP-SEC-01 | ❌ falha | Média | Alta | `api/contact.ts` sem escape de HTML e sem proteção contra spam |
| 10 | LP-LIVE-01 | ❔ desconhecido | Média | — | Verificação ao vivo bloqueada pela rede do ambiente |
| 11 | G61 | ✅ ok | Baixa | Alta | JSON-LD completo |
| 12 | LP-FOLD-01 | ✅ ok | Baixa | Alta | CTA na primeira tela (celular e desktop), WhatsApp flutuante, acessibilidade 95 |

Os detalhes e as evidências de cada item estão em `findings/*.json`.

## Plano de ação (em ordem)

| Prioridade | Ação | Responsável | Prazo | Como medir |
|---|---|---|---|---|
| 1 | Criar as ações de conversão "Lead — formulário" e "Clique no WhatsApp" no Google Ads e disparar `gtag('event','conversion')` no envio bem-sucedido e nos links wa.me | Orbara (dev + gestor de Ads) | Esta semana | Tag Assistant mostra o evento; conversões aparecem em até 24–48 h |
| 2 | Tirar do ar a nota e as "falhas detectadas" simuladas. Ou a auditoria passa a ser real (PageSpeed API + checagem de title/H1/JSON-LD), ou vira "Peça um pré-diagnóstico" | Orbara (dev) | Antes de ativar ou escalar campanhas | Nenhum texto afirma uma análise que não aconteceu |
| 3 | Publicar `/privacidade`, linkar no rodapé e no formulário; avaliar com o jurídico o aviso de cookies | Orbara + jurídico | 1–2 semanas | Link presente; texto revisado |
| 4 | Ajustar o formulário: escapar HTML, honeypot e limite por IP | Orbara (dev) | Junto com a ação 1 | E-mails sem HTML injetado; spam bloqueado |
| 5 | Desempenho: `preload="none"` nos vídeos dos cases, hero sem depender do JS para pintar o texto, seções abaixo da dobra carregadas sob demanda | Orbara (dev) | 1–2 semanas | Lighthouse mobile: LCP ≤ 2,5 s; depois, dados de campo no Search Console |
| 6 | Teste A/B: CTA da hero abrindo o WhatsApp com mensagem pronta + formulário curto (3 campos) logo depois da hero, contra a versão atual | Orbara (gestor de Ads) | Depois das ações 1 e 2 | Conversões por sessão vinda de anúncio, mínimo de 2–4 semanas ou volume suficiente |
| 7 | Confiança: CNPJ, razão social e cidade no rodapé; "Quem somos"; dossiê de comprovação dos números e autorização dos depoimentos | Orbara | 2–4 semanas | Itens publicados; comprovantes guardados |
| 8 | Mensagem pronta em cada link de WhatsApp, com a origem | Orbara (dev) | Junto com a ação 1 | Conversas identificam a página ou o serviço |
| 9 | Mandar a exportação de anúncios e palavras-chave para avaliar a mensagem do anúncio × página (G60) e decidir sobre landings por serviço | Orbara → eu | Quando possível | Uma landing por grupo de anúncio com H1 alinhado |

**Como desfazer:** todas as ações são mudanças de código no site e voltam atrás com um revert do PR. A ação 1 cria conversões novas no Google Ads; antes de usá-las como meta de lances, deixe-as como secundárias por cerca de 2 semanas para conferir se os números batem com a realidade.

## Fontes

- [Google Ads — Track clicks on your website as conversions](https://support.google.com/google-ads/answer/6331304) (consultado em 07/10/2026)
- [Google Ads — Use the Google tag for conversion tracking](https://support.google.com/google-ads/answer/7548399) (07/10/2026)
- [Políticas — Misrepresentation](https://support.google.com/adspolicy/answer/6020955) e [Misleading representation](https://support.google.com/adspolicy/answer/15936666) (07/10/2026)
- [Políticas — Destination requirements](https://support.google.com/adspolicy/answer/6368661) (07/10/2026)
- CDC (Lei 8.078/1990), art. 37 — conteúdo confirmado por fontes secundárias; ler o [texto oficial](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)
