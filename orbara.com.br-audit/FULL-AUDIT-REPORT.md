# Auditoria SEO Completa — orbara.com.br

**Data:** 06/10/2026 · **Ferramenta:** claude-seo v2.4.2 + Lighthouse 12
**Escopo:** home + 3 páginas de case + 404 (todas as URLs do site)
**Tipo de negócio:** agência de marketing digital / serviços profissionais (sites, SEO, Google Ads, motion graphics), atendimento remoto em todo o Brasil

> **Limitação:** o domínio `orbara.com.br` estava bloqueado pela rede do ambiente de análise. A auditoria foi feita sobre o **build de produção gerado a partir do código do repositório** (mesmo `index.html`, mesmos assets e mesma regra de rewrite do `vercel.json`). Itens que dependem do servidor real (headers HTTP da Vercel, compressão, cache, dados de campo do Google) não foram medidos.

---

## SEO Health Score: **48 / 100**

| Categoria | Peso | Score |
|---|---|---|
| Technical SEO | 22% | 45 |
| Content Quality | 23% | 60 |
| On-Page SEO | 20% | 55 |
| Schema / Structured Data | 10% | 35 |
| Performance (CWV) | 10% | 40 |
| AI Search Readiness | 10% | 35 |
| Images | 5% | 55 |

Lighthouse (mobile): **Performance 43 · Acessibilidade 85 · Boas práticas 96 · SEO 92**

---

## Resumo executivo

O site tem **ótimo conteúdo comercial** (proposta clara, preços, FAQ, cases, depoimentos) e design forte, mas a **base técnica impede que esse conteúdo seja encontrado**: não há robots.txt nem sitemap, os cases estão canonizados para a home, o HTML chega vazio para crawlers que não rodam JavaScript e a home pesa 2,4 MB por causa de uma única imagem.

### Top 5 problemas
1. 🔴 **Sem robots.txt e sitemap.xml** — as duas URLs devolvem o HTML do site.
2. 🔴 **Conteúdo só existe após o JavaScript** — ChatGPT, Claude, Perplexity e redes sociais enxergam uma página vazia.
3. 🔴 **`hero-bg.jpg` com 1,9 MB** — LCP de 5,8 s no mobile.
4. 🟠 **Cases com canonical, title e description da home** — o Google os trata como duplicatas.
5. 🟠 **Fotos de banco de imagens apresentadas como "evidências"** nos cases — risco de confiança (E-E-A-T).

### Top 5 quick wins (todos < 1 hora)
1. Criar `robots.txt` e `sitemap.xml` estáticos.
2. Corrigir `og:image` para `/opengraph.jpg` (hoje os links compartilhados saem sem imagem).
3. Comprimir `hero-bg.jpg` para WebP (~ -1,8 MB).
4. Remover a fonte Inter não utilizada e o `maximum-scale=1` do viewport.
5. Completar o JSON-LD com telefone, área atendida, preços e os vídeos.

---

## Technical SEO — 45
- 🔴 robots.txt e sitemap.xml inexistentes (servem HTML)
- 🟠 Cases com `canonical` apontando para a home e meta duplicada
- 🟠 Renderização 100% no cliente (CSR)
- 🟡 Soft 404 (status 200 para URLs inexistentes)
- 🟡 Navegação feita com 58 `<button>` e só 3 links internos
- 🟡 `maximum-scale=1` bloqueia zoom
- 🟡 Link para URL de desenvolvimento `replit.dev` no case Voltari
- 🔵 Sem headers de segurança explícitos; fonte Inter carregada sem uso

Detalhes: [findings/technical.md](findings/technical.md)

## Content Quality — 60
- ✅ ~2.500 palavras, FAQ real, preços, cases estruturados
- 🟠 Fotos do Unsplash com legendas de resultados ("Posição #1 no Google", "94 avaliações")
- 🟠 Estatísticas sem fonte (+180%, -40%, 83%, 68%)
- 🟠 Sem "Quem somos", equipe, CNPJ ou cidade
- 🟡 Nenhum conteúdo editorial para capturar buscas informacionais

Detalhes: [findings/content.md](findings/content.md)

## On-Page SEO — 55
- ✅ Title (51 car.) e description (133 car.) bons na home; 1 H1 por página
- 🟠 `og:image` quebrada (`/og-image.jpg` não existe)
- 🟠 Title/description iguais em todas as rotas
- 🟡 H1 "Sites que orbitam resultado." sem palavra-chave
- 🟡 Linkagem interna mínima

Detalhes: [findings/on-page.md](findings/on-page.md)

## Schema — 35
- ✅ `ProfessionalService` válido
- 🟠 Sem telefone, área atendida, preço; logo em SVG
- 🟡 Oportunidades: `WebSite`, `Service` ×4, `Offer` (planos), `VideoObject` ×3, `Article` + `BreadcrumbList` nos cases

Detalhes e bloco pronto: [findings/schema.md](findings/schema.md), [ACTION-PLAN.md](ACTION-PLAN.md)

## Performance — 40
| LCP | FCP | TBT | CLS | Peso |
|---|---|---|---|---|
| 5,8 s 🔴 | 3,2 s 🔴 | 1.280 ms 🔴 | 0,008 🟢 | 2,4 MB 🟠 |

- 🔴 `hero-bg.jpg` 1,9 MB
- 🟠 2,9 s de execução de JS; 134 KB de JS não usado; 4,1 s de style/layout (animações simultâneas, 2.410 nós no DOM)
- 🟠 CSS + fontes render-blocking (~1,1 s)

Detalhes: [findings/performance.md](findings/performance.md)

## Images — 55
- ✅ Todas as imagens com `alt` descritivo e lazy loading
- 🔴 Poster do hero com 1,9 MB; 🟡 sem `width/height`; 🟡 sem WebP/AVIF; 🟠 imagens dos cases são do Unsplash

Detalhes: [findings/images.md](findings/images.md)

## AI Search Readiness — 35
- ✅ FAQ e preços em formato citável
- 🔴 HTML vazio para crawlers de IA (sem SSR/SSG)
- 🟠 Sem robots.txt; 🟡 sem llms.txt; 🟡 `sameAs` só com Instagram
- 🟡 `aria-label` indevidos gerados pela animação de texto (SplitText) e contraste baixo em rótulos

Detalhes: [findings/ai-search-readiness.md](findings/ai-search-readiness.md) · Local/SXO: [findings/local-sxo.md](findings/local-sxo.md)

---

## Plano de ação
Ver [ACTION-PLAN.md](ACTION-PLAN.md) — 4 fases, com os arquivos exatos a alterar e os blocos de código prontos.

## Não avaliado (exige acesso/credenciais)
- Dados de campo de Core Web Vitals (CrUX), indexação e consultas (Search Console), tráfego orgânico (GA4)
- Backlinks e autoridade de domínio (Moz/Bing/DataForSEO)
- Headers HTTP reais da Vercel e screenshots do site no ar
