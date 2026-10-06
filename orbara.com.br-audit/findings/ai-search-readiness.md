# AI Search Readiness (GEO + Agentic) — orbara.com.br

**Score: 35/100**

## O que funciona
- FAQ com respostas diretas e autocontidas (formato ideal para citação em AI Overviews/ChatGPT/Perplexity)
- Preços e prazos explícitos ("Entrega em até 5 dias", "R$ 2.995 em até 6x")
- Botões com nome acessível (0 botões sem rótulo), formulário de contato com labels (5/6 campos rotulados)

## Findings

### 🔴 Critical — Crawlers de IA veem uma página vazia
- HTML inicial = `<div id="root"></div>`. GPTBot, ClaudeBot, PerplexityBot, CCBot e Google-Extended (para treino) **não executam JavaScript**. Para eles, a Orbara não tem conteúdo, serviços, preços nem FAQ.
- **Fix:** pré-renderização (SSG) das rotas — é o item de maior impacto para visibilidade em respostas de IA.

### 🟠 High — Sem robots.txt (política para agentes de IA indefinida)
- Recomendado:
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://orbara.com.br/sitemap.xml
```
(Sem bloqueios a GPTBot/ClaudeBot/PerplexityBot: a Orbara quer ser citada.)

### 🟡 Medium — Sem `llms.txt`
- Opcional (ignorado pelo Google Search), mas usado por alguns agentes. Um resumo Markdown com serviços, preços, cases e contato custa pouco.

### 🟡 Medium — Entidade da marca fraca fora do site
- `sameAs` só tem Instagram. Faltam LinkedIn da empresa, Perfil da Empresa no Google, YouTube (os vídeos de motion são ótimos ativos para isso), Behance/Dribbble.

### 🟡 Medium — Acessibilidade introduzida pelas animações
- `SplitText` adiciona `aria-label` em `<span>`/`<p>` (Lighthouse: `aria-prohibited-attr`) — leitores de tela e agentes que usam a árvore de acessibilidade podem ler o texto de forma estranha.
- Contraste insuficiente em textos decorativos (marquee, rótulos com opacidade 35–60%).
- **Fix:** `SplitText.create(el, { aria: "hidden" ... })` ou envolver o original com `aria-label` no elemento pai suportado; subir opacidade dos rótulos.
