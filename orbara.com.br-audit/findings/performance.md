# Performance (Core Web Vitals) — orbara.com.br

**Score: 40/100**
Medição: Lighthouse 12 (mobile, throttling simulado padrão) contra o build de produção local. Sem dados de campo (CrUX/Search Console não configurados). Valores de laboratório servem para priorizar, não substituem dados reais de usuários.

| Métrica | Valor | Meta | Status |
|---|---|---|---|
| Performance score | **43** | ≥ 90 | 🔴 |
| LCP | **5,8 s** | ≤ 2,5 s | 🔴 |
| FCP | 3,2 s | ≤ 1,8 s | 🔴 |
| TBT (proxy de INP) | **1.280 ms** | ≤ 200 ms | 🔴 |
| CLS | 0,008 | ≤ 0,1 | 🟢 |
| Speed Index | 6,2 s | ≤ 3,4 s | 🔴 |
| Peso total | 2,4 MB | < 1,6 MB | 🟠 |

## Findings

### 🔴 Critical — `hero-bg.jpg` de 1,9 MB
- É o poster do vídeo do hero, carregado acima da dobra em toda visita. Sozinho representa **~80% do peso da página**.
- Lighthouse estima 1,8–1,9 MB de economia (compressão + WebP/AVIF).
- **Fix:** exportar em WebP/AVIF ~1600px (~120–200 KB) e uma versão mobile ~800px; `fetchpriority="high"` no poster.

### 🟠 High — JavaScript pesado no main thread (TBT 1,28 s)
- Bootup: `index.js` 2,0 s de scripting, `Home.js` 0,8 s. 134 KB de JS não usado no carregamento inicial (`proxy-*.js` é 89% não usado — framer-motion carregado só para poucos componentes).
- `mainthread-work-breakdown`: 4,1 s em Style & Layout — muitas animações iniciando ao mesmo tempo + 2.410 elementos no DOM.
- **Fix:** remover framer-motion das partes já migradas para GSAP; carregar seções abaixo da dobra com `React.lazy`; desligar animações de loop (marquees, órbitas) até a seção entrar na tela; reduzir DOM (ex.: depoimentos duplicados 4× para o carrossel → 2×).

### 🟠 High — CSS e fontes render-blocking (~1,1 s)
- Onest vem por `@import` dentro do CSS (cadeia CSS → CSS → fonte) e importa **7 pesos** (300–900).
- Inter é pré-carregada sem uso.
- **Fix:** `<link rel="preconnect">` + `<link rel="stylesheet">` da Onest direto no `<head>` com só os pesos usados (400, 500, 600, 700, 800, 900 → avaliar), remover Inter, ou self-host com `font-display: swap`.

### 🟡 Medium — Vídeo do hero hospedado em CDN externa sem controle
- `cloudfront.net/...mp4` de terceiro: sem garantia de cache/compressão; não testável aqui.
- **Fix:** hospedar no próprio projeto (como os vídeos de motion, já comprimidos) e carregar após o LCP.

### 🔵 Low — Posters de motion em JPG
- 4 posters de 44–58 KB; WebP economiza ~45%.
