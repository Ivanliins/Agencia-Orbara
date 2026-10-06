# On-Page SEO — orbara.com.br

**Score: 55/100**

## O que funciona
- Title da home com palavra-chave principal: "Orbara — Criação de Sites de Alta Performance e SEO" (51 caracteres)
- Meta description com 133 caracteres, dentro do ideal
- 1 único H1 por página; hierarquia H2 → H3 consistente na home
- Âncoras dos cases descritivas ("Ver case completo" + slug semântico)

## Findings

### 🟠 High — Imagem de compartilhamento (OG/Twitter) quebrada
- `og:image` e `twitter:image` apontam para `https://orbara.com.br/og-image.jpg`, **que não existe** (a URL devolve o HTML do site).
- O arquivo real é `/opengraph.jpg`. Resultado: links compartilhados no WhatsApp, LinkedIn, Instagram e Facebook aparecem **sem imagem**.
- **Fix:** trocar para `/opengraph.jpg` (e garantir 1200×630).

### 🟠 High — Title/description iguais em todas as rotas
- Os 3 cases e a 404 herdam o title e a description da home. Ver `technical.md`.
- Sugestões:
  - `/cases/casa-voltari` → "Case Voltari: +138% em vendas online com site e tráfego pago | Orbara"
  - `/cases/camila-nogueira` → "Case Advocacia: +91% de novos clientes com SEO local e OAB | Orbara"
  - `/cases/central-park` → "Case Estacionamento: +68% de ocupação com Google Maps | Orbara"

### 🟡 Medium — H1 sem palavra-chave
- H1 atual: "Sites que orbitam resultado." — forte como marca, fraco como sinal de relevância (não menciona agência, criação de sites, SEO ou Google Ads).
- **Fix (mantendo o visual):** manter a frase de impacto e incluir a palavra-chave no subtítulo como parte do H1 ou num H2 logo abaixo, ex.: "Agência de criação de sites, SEO e Google Ads".

### 🟡 Medium — Linkagem interna fraca
- Só 3 `<a href>` internos na home; menu, rodapé e CTAs são `<button>`. Os cases não linkam entre si nem para serviços/planos.
- **Fix:** menus com `<a href="#...">`; nos cases, bloco "Outros cases" + link para o serviço correspondente.

### 🔵 Low — Ordem de headings
- Lighthouse aponta `<h4>` (nome do cliente no card do case principal) sem H3 anterior no bloco. Trocar por `<p>` estilizado.

### 🔵 Low — Twitter/OG description divergentes do title
- Pequena inconsistência entre `og:title` ("Criação de Sites e SEO") e o title. Unificar mensagens.
