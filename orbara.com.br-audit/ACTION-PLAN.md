# Plano de Ação SEO — orbara.com.br

Health Score atual: **48/100** · Meta após Fases 1–2: **~75/100**

Legenda de esforço: 🟢 < 1h · 🟡 meio dia · 🔴 1–3 dias

---

## Fase 1 — Correções críticas (Semana 1)

| # | Ação | Prioridade | Esforço | Arquivo |
|---|---|---|---|---|
| 1.1 | Criar `public/robots.txt` (conteúdo abaixo) | Critical | 🟢 | `artifacts/orbara/public/robots.txt` |
| 1.2 | Criar `public/sitemap.xml` com home + 3 cases | Critical | 🟢 | `artifacts/orbara/public/sitemap.xml` |
| 1.3 | Comprimir `hero-bg.jpg` (1,9 MB → ~150 KB WebP) | Critical | 🟢 | `public/hero-bg.*` + `Hero.tsx` |
| 1.4 | Corrigir `og:image`/`twitter:image` para `/opengraph.jpg` | High | 🟢 | `index.html` |
| 1.5 | Completar JSON-LD (telefone, areaServed, logo PNG, WebSite, Services, Offers, VideoObject) | High | 🟡 | `index.html` |
| 1.6 | Remover `maximum-scale=1` do viewport | Medium | 🟢 | `index.html` |
| 1.7 | Remover pré-carregamento da fonte Inter e carregar Onest no `<head>` só com os pesos usados | High | 🟢 | `index.html`, `index.css` |
| 1.8 | Trocar link `replit.dev` do case Voltari pela URL real | Medium | 🟢 | `CaseDetail.tsx` |

**1.1 robots.txt**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://orbara.com.br/sitemap.xml
```

**1.2 sitemap.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://orbara.com.br/</loc></url>
  <url><loc>https://orbara.com.br/cases/casa-voltari</loc></url>
  <url><loc>https://orbara.com.br/cases/camila-nogueira</loc></url>
  <url><loc>https://orbara.com.br/cases/central-park</loc></url>
</urlset>
```

**1.5 JSON-LD sugerido** (substitui o bloco atual; ajustar dados marcados com `TODO`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://orbara.com.br/#org",
      "name": "Orbara",
      "url": "https://orbara.com.br/",
      "logo": "https://orbara.com.br/logo-512.png",
      "image": "https://orbara.com.br/opengraph.jpg",
      "description": "Agência de criação de sites, SEO, Google Ads e motion graphics.",
      "telephone": "+55-11-98168-0809",
      "areaServed": { "@type": "Country", "name": "Brasil" },
      "priceRange": "R$ 1.490 – sob consulta",
      "sameAs": ["https://www.instagram.com/agenciaorbara"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Planos",
        "itemListElement": [
          { "@type": "Offer", "name": "Essencial", "price": "1490", "priceCurrency": "BRL" },
          { "@type": "Offer", "name": "Aceleração", "price": "2995", "priceCurrency": "BRL" }
        ]
      }
    },
    { "@type": "WebSite", "@id": "https://orbara.com.br/#website", "url": "https://orbara.com.br/", "name": "Orbara", "inLanguage": "pt-BR", "publisher": { "@id": "https://orbara.com.br/#org" } },
    { "@type": "Service", "name": "Criação de sites", "provider": { "@id": "https://orbara.com.br/#org" }, "areaServed": "BR" },
    { "@type": "Service", "name": "Gestão de Google Ads", "provider": { "@id": "https://orbara.com.br/#org" }, "areaServed": "BR" },
    { "@type": "Service", "name": "SEO", "provider": { "@id": "https://orbara.com.br/#org" }, "areaServed": "BR" },
    { "@type": "Service", "name": "Motion Graphics", "provider": { "@id": "https://orbara.com.br/#org" }, "areaServed": "BR" },
    {
      "@type": "VideoObject",
      "name": "Manifesto Orbara Studio",
      "description": "Toda marca tem uma história. Poucas sabem colocar ela em movimento.",
      "thumbnailUrl": "https://orbara.com.br/motion/orbara-studio-16x9.jpg",
      "contentUrl": "https://orbara.com.br/motion/orbara-studio-16x9.mp4",
      "uploadDate": "2026-10-06",
      "duration": "PT32S"
    }
  ]
}
```
(Repetir `VideoObject` para os 2 comerciais do Clube do Med; `uploadDate` = data real de publicação.)

---

## Fase 2 — Alto impacto (Semanas 2–3)

| # | Ação | Prioridade | Esforço |
|---|---|---|---|
| 2.1 | **Pré-renderizar** home e cases no build (SSG) para que Google e crawlers de IA recebam HTML completo | High | 🔴 |
| 2.2 | Title, description, canonical e OG **por rota** nos cases (+ `Article` e `BreadcrumbList`) | High | 🟡 |
| 2.3 | Substituir fotos de banco dos cases por prints reais (ou retirar as legendas de "evidência") | High | 🟡 |
| 2.4 | Reduzir JS inicial: remover framer-motion onde já há GSAP, `React.lazy` nas seções abaixo da dobra, pausar loops fora da tela | High | 🔴 |
| 2.5 | Menu, rodapé e CTAs como `<a href="#secao">` (links rastreáveis) | Medium | 🟡 |
| 2.6 | 404 real (status 404 ou `noindex`) com links úteis | Medium | 🟢 |
| 2.7 | Corrigir `aria-label` do SplitText e contraste de rótulos | Medium | 🟢 |
| 2.8 | Headers de segurança no `vercel.json` | Low | 🟢 |

## Fase 3 — Conteúdo e autoridade (Mês 2)

| # | Ação | Prioridade |
|---|---|---|
| 3.1 | Seção/página "Quem somos": responsáveis, foto, experiência, CNPJ e cidade | High |
| 3.2 | Páginas de serviço indexáveis: `/criacao-de-sites`, `/seo`, `/google-ads`, `/motion-graphics` | High |
| 3.3 | Fontes nas estatísticas e metodologia das médias internas | Medium |
| 3.4 | Hub de conteúdo: 6–10 artigos ligados aos nichos dos cases | Medium |
| 3.5 | Perfil da Empresa no Google + avaliações reais; `sameAs` com LinkedIn, YouTube, GBP | Medium |
| 3.6 | Publicar os vídeos de motion no YouTube e incorporar (sinal de entidade + tráfego de vídeo) | Medium |
| 3.7 | `llms.txt` com resumo de serviços, preços, cases e contato | Low |

## Fase 4 — Monitoramento (contínuo)

- Configurar Google Search Console (enviar sitemap, acompanhar indexação dos cases) e GA4 (hoje só existe a tag de Google Ads `AW-18424280462`)
- Medir Core Web Vitals de campo (CrUX/Search Console) após as correções de performance
- Rodar `/seo drift` antes/depois de cada deploy grande para pegar regressões (títulos, canonical, schema)
- Reauditar em 60 dias

---

## Status

**Fase 1 aplicada em 06/10/2026** (itens 1.1 a 1.8, mais correções de acessibilidade do item 2.7):
robots.txt, sitemap.xml (com vídeos), hero 1,9 MB → 51 KB WebP (29 KB no celular), og:image corrigida,
JSON-LD em @graph (ProfessionalService + WebSite + 4 Services + Offers + 3 VideoObjects, logo PNG),
viewport sem bloqueio de zoom, fonte Inter removida e Onest no `<head>`, link replit.dev removido.

Lighthouse mobile (build local): SEO 92 → **100**, Acessibilidade 85 → **91+**, peso 2,4 MB → **1,1 MB**.
Performance segue em 43: o gargalo agora é o JavaScript (TBT) — itens 2.1 e 2.4.
