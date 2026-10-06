# Technical SEO — orbara.com.br

**Score: 45/100**
Fonte: build de produção local (`vite build --config vite.vercel.config.ts`) servido com fallback SPA idêntico ao `vercel.json` (`/(.*) → /index.html`). O domínio ao vivo estava bloqueado pela rede do ambiente.

## O que funciona
- HTTPS e domínio canônico definidos (`<link rel="canonical" href="https://orbara.com.br/">`)
- `lang="pt-BR"`, meta robots `index, follow`, title e meta description presentes na home
- Rotas limpas e legíveis (`/cases/casa-voltari`, `/cases/camila-nogueira`, `/cases/central-park`)
- Nenhum bloqueio de indexação; CLS baixo (0,008 mobile)

## Findings

### 🔴 Critical — Não existe robots.txt nem sitemap.xml (e as URLs devolvem HTML)
- `GET /robots.txt` → **200 text/html** (a página inteira do site, por causa do rewrite SPA)
- `GET /sitemap.xml` → **200 text/html**
- Lighthouse: "robots.txt is not valid — Syntax not understood" em todas as linhas
- Impacto: o Google não recebe sitemap, os cases não são descobertos por sitemap e o robots.txt é lido como lixo.
- **Fix:** criar `artifacts/orbara/public/robots.txt` e `public/sitemap.xml` (arquivos estáticos têm prioridade sobre o rewrite na Vercel).

### 🟠 High — Páginas de case canonizadas para a home e com title/description duplicados
- `/cases/casa-voltari`, `/cases/camila-nogueira`, `/cases/central-park` têm **o mesmo title, description e `canonical=https://orbara.com.br/`** da home (vêm do `index.html` estático; nada é atualizado por rota).
- Impacto: o Google trata os cases como duplicatas da home → não ranqueiam para "case SEO advogado", "agência tráfego mobilidade elétrica" etc.
- **Fix:** title/description/canonical/OG por rota (ex.: `react-helmet-async` ou hook que atualiza `document.head` no `CaseDetail`) e, idealmente, pré-renderização (ver item abaixo).

### 🟠 High — Conteúdo 100% renderizado no cliente (CSR)
- O HTML entregue tem apenas `<div id="root"></div>`; todo o texto (2.523 palavras na home) depende de JavaScript.
- Googlebot renderiza JS (com atraso), mas **GPTBot, ClaudeBot, PerplexityBot e parte dos crawlers de redes sociais não executam JS** → enxergam uma página vazia.
- **Fix:** pré-renderizar as rotas no build (SSG). Para Vite + React: `vite-react-ssg`, `vite-plugin-prerender` ou script com Playwright que gera `dist/index.html` e `dist/cases/*/index.html` com o HTML final.

### 🟡 Medium — Soft 404
- `/pagina-inexistente` → **HTTP 200**, sem H1, canonical apontando para a home.
- **Fix:** com pré-renderização, gerar `404.html` (a Vercel serve com status 404); no mínimo, `<meta name="robots" content="noindex">` na página NotFound.

### 🟡 Medium — Navegação feita com `<button>` em vez de links
- A home tem **58 `<button>`** e apenas **3 links internos `<a href>`** (os cases). Menu, rodapé e CTAs usam `scrollIntoView` via JS.
- Crawlers não seguem botões; a estrutura de seções não é descoberta como links e não há âncoras compartilháveis.
- **Fix:** trocar por `<a href="#servicos">` etc. (mantendo o scroll suave via `onClick` + `preventDefault`).

### 🟡 Medium — Viewport bloqueia zoom
- `maximum-scale=1` no `<meta name="viewport">` (Lighthouse: falha de acessibilidade `meta-viewport`).
- **Fix:** `width=device-width, initial-scale=1`.

### 🟡 Medium — Link para ambiente de desenvolvimento
- O case Voltari tem link externo para `https://73b8d9f6-...worf.replit.dev/` (URL de dev da Replit).
- **Fix:** trocar pela URL real do site do cliente ou remover.

### 🔵 Low — Sem headers de segurança explícitos
- `vercel.json` não define `headers` (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). A Vercel já aplica HSTS, mas o resto fica no padrão.
- **Fix:** adicionar bloco `headers` no `vercel.json`.

### 🔵 Low — Fonte "Inter" pré-carregada mas não usada
- `index.html` faz `preload` + stylesheet da Inter; o site usa **Onest** (importada via `@import` no CSS). Uma requisição render-blocking desperdiçada.
