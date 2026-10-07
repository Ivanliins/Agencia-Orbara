# Auditoria Google Ads — Agência Orbara (464-582-6023)

**Execução:** `2026-10-07-google-orbara` · **Fonte:** API do Google Ads v22, somente leitura, consultada em 07/10/2026 · **Situação:** parcial

**Escopo:** 1 campanha de Pesquisa, "[PESQUISA] - Captação de Leads - Orbara", no ar desde 02/09/2026.

**Limitações:**
- A API não mostra o status de verificação e pagamento de contas pré-pagas.
- Não havia conversões medidas até hoje, por isso não há nota de saúde.

## Por que a campanha está parada

### 1) De 11 a 18/09: o dinheiro pré-pago acabou (confirmado)

| Data | Limite aprovado | Gasto acumulado | O que aconteceu |
|---|---|---|---|
| 02/09 | R$ 50 | R$ 50,00 em 03/09 | Esgotou no 2º dia; sem anúncios de 04 a 06/09 |
| 07/09 | R$ 90 (+40) | R$ 89,48 em 10/09 | Esgotou de novo; parou em 11/09 |
| 18/09 | R$ 130 (+40) | R$ 89,48 | Restam **R$ 40,52**, mas não voltou |

### 2) De 19/09 até hoje: bloqueio que a API não mostra (provável)

Pela API, campanha, grupos, anúncios e palavras-chave aparecem **"Qualificados"**, sem nenhum motivo de bloqueio. Mesmo assim, desde 19/09 a campanha **não participa de nenhum leilão**: nenhum dia tem dados de parcela de impressões. Isso continua mesmo depois de:
- o grupo G01 ter sido reativado em 21/09;
- o teto de CPC ter subido para R$ 3,00 em 22/09.

Falta de lance alto ou de volume de busca não explica esse quadro: nesses casos ainda apareceriam leilões perdidos. O que costuma causar isso numa conta nova pré-paga é um **bloqueio de conta**: verificação de pagamento ou de anunciante, pagamento em análise, ou aviso de política. Não consegui confirmar qual, porque a API de verificação só funciona para contas com faturamento mensal.

**Onde ver, em 2 minutos:**
1. O **sino de notificações** e a **faixa vermelha** no topo do Google Ads.
2. **Faturamento → Resumo:** procure aviso de pagamento pendente, em análise ou recusado.
3. **Administrador → Verificação do anunciante.**
4. Na lista de campanhas, passe o mouse na coluna **Status**.
5. **Ferramentas → Solução de problemas → Visualização e diagnóstico de anúncios:** busque "criação de sites" em São Paulo. A ferramenta diz o motivo exato.

Além disso, **R$ 40 duram cerca de 4 dias** com orçamento de R$ 10/dia. A conta já parou duas vezes por saldo, então recarregue antes de zerar.

## Linha do tempo das alterações

| Data | Alteração | Quem |
|---|---|---|
| 09/09 21:50 | Grupo G02 pausado | Você (interface) |
| 13/09 | Teto de CPC de R$ 4,50 para **R$ 0,99** | Você |
| 18/09 03:42 | Recarga para R$ 130 | Pagamento |
| 18/09 04:15 | **5 palavras-chave removidas** pela aplicação automática de recomendações | Google |
| 18/09 | Teto de CPC para R$ 1,70 | Você |
| 20/09 | **AI Max**, automação de textos e expansão de URL ligados; teto R$ 2,50 | Você |
| 21/09 | Grupo G02 reativado | Você |
| 22/09 | Teto de CPC para R$ 3,00 | Você |

## O que aconteceu enquanto rodou (02 a 10/09)

- 482 impressões, 29 cliques, R$ 89,48 gastos, CPC médio de cerca de R$ 3,05 e 0 conversões medidas (não havia medição).
- Só o **G01 (Criação de Sites)** rodou. O **G02 (SEO técnico) nunca teve impressão**.
- 68% do gasto foi no celular.
- 36% das impressões vieram de pessoas fora de SP e Guarulhos, apenas "interessadas" nessas cidades.

**Para onde foi o dinheiro:** dos R$ 60,56 com termo visível, **só R$ 7,41 (12%)** foram em buscas de quem quer contratar. O resto foi em buscas informativas ou genéricas:

| Termo | Gasto | Leitura |
|---|---|---|
| o que é desenvolvimento de sites | R$ 4,88 | Informativa |
| especialista em criação de sites | R$ 4,45 | ✅ Compra |
| como montar um site de vendas | R$ 3,78 | Faça você mesmo (já está negativada) |
| landing / landing page | R$ 7,20 | Genérica |
| website as a service / site com carrossel / parallax site | R$ 9,37 | Genérica |
| como abrir uma loja virtual / modelo de site | R$ 6,73 | Faça você mesmo |
| site / website / websites / site online | R$ 10,97 | Genérica (parte já negativada) |
| google meu negócio / google negócios | R$ 5,41 | ⚠️ Pode ser SEO local: decidir antes de negativar |
| empresa que faz site profissional | R$ 2,96 | ✅ Compra |

A causa é a combinação de 5 palavras-chave em **correspondência ampla**, lance **"Maximizar cliques"** e nenhuma conversão medida. Nessa situação o Google procura cliques baratos, não clientes. O **AI Max**, ligado em 20/09, amplia isso ainda mais.

## Achados

| # | Controle | Status | Gravidade | Achado |
|---|---|---|---|---|
| 1 | DELIV-01 | ❌ | Crítica | Parada desde 11/09: saldo esgotado e, depois de 18/09, provável bloqueio de conta |
| 2 | G16 | ❌ | Alta | 88% do gasto visível em buscas sem intenção de compra |
| 3 | G17 | ❌ | Alta | Correspondência ampla sem sinal de conversão |
| 4 | AIMAX-01 | ❌ | Alta | AI Max e expansão de URL ligados sem dados (podem levar a /obrigado) |
| 5 | AUTOAPPLY-01 | ❌ | Média | O Google removeu sozinho 5 palavras-chave, 2 delas de "orçamento" |
| 6 | G03 | ❌ | Média | G02 com jargão técnico; 7 de 11 palavras-chave com pouco volume; nunca rodou |
| 7 | G36 | ❌ | Média | Teto de CPC mexido 4 vezes; R$ 3,00 fica no limite do CPC real; R$ 10/dia ≈ 3 cliques |
| 8 | G11 | ❔ | Baixa | Geografia confusa (SP e Guarulhos + "interesse"); inglês e espanhol sem necessidade |
| 9 | G42 | ✅ | Alta | Conversões de lead e WhatsApp configuradas hoje |
| 10 | G50 | ✅ | Baixa | 6 sitelinks e 4 frases de destaque (faltam ligação, snippets, imagens, logo) |
| 11 | G29 | ✅ | Baixa | 1 anúncio responsivo por grupo, força "Boa", aprovado |

Os detalhes e as evidências de cada item estão em `findings/*.json`.

## Plano de ação

| Prioridade | Ação | Quem | Como medir |
|---|---|---|---|
| **0 — hoje** | Ver o motivo do bloqueio nos 5 lugares acima e resolver (verificação ou pagamento) | Você, na interface | Campanha volta a ter impressões em até 24 h |
| **0 — hoje** | Recarregar antes de zerar os R$ 40 | Você | Sem novas paradas por saldo |
| 1 | Desligar AI Max e expansão de URL até ter conversões | Posso aplicar pela API com sua aprovação | Termos de pesquisa mais próximos das palavras-chave |
| 1 | Pausar as 5 palavras-chave amplas; ficar com frase e exata | Posso aplicar | Menos gasto em termos genéricos |
| 1 | Desligar a aplicação automática de recomendações | Você (Recomendações → Aplicação automática) | Nenhuma alteração "GOOGLE_ADS_RECOMMENDATIONS" no histórico |
| 1 | Revisar a tabela de termos e decidir negativas (atenção a "google meu negócio") | Você + eu | Gasto em termos irrelevantes abaixo de 30% |
| 2 | Teto de CPC para R$ 3,50–4,00 enquanto não há conversões | Posso aplicar | Parcela de impressões |
| 2 | G02: reescrever na linguagem de quem compra SEO, com página de destino própria, ou pausar e concentrar o orçamento no G01 | Eu proponho, você aprova | Impressões no G02 |
| 2 | Geografia: "Presença" em SP e Guarulhos ou Brasil todo; tirar inglês e espanhol | Você decide, eu aplico | — |
| 3 | Depois de ~15–30 conversões: avaliar "Maximizar conversões" e conversões otimizadas | Eu | Custo por lead |
| 3 | Recursos: ligação/WhatsApp, snippets estruturados, imagens, logo; 2º anúncio por grupo | Eu | Taxa de cliques (CTR) |

**Como desfazer:** todas as mudanças de campanha propostas são reversíveis (ligar de novo, reativar, mudar o teto de volta). Nada foi alterado nesta auditoria.
