# Schema / Structured Data — orbara.com.br

**Score: 35/100**

## Implementação atual
Um único bloco JSON-LD no `index.html` (presente em todas as rotas):

```json
{ "@type": "ProfessionalService", "name": "Orbara", "url": "https://orbara.com.br/",
  "logo": "https://orbara.com.br/favicon.svg", "description": "...",
  "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "availableLanguage": "Portuguese" },
  "sameAs": ["https://www.instagram.com/agenciaorbara"] }
```
JSON válido. ✅

## Findings

### 🟠 High — Entidade incompleta
- Falta `telephone` (o WhatsApp 11 98168-0809 está no site), `email`, `areaServed` ("BR"), `priceRange`, `address` (ou ao menos `addressLocality/addressRegion`), `foundingDate`.
- `logo` aponta para um **SVG**; o Google pede imagem raster (PNG/JPG, ≥112×112) para logo.
- `contactPoint` sem `telephone` não é elegível.

### 🟡 Medium — Faltam tipos com conteúdo já existente no site
| Tipo | Onde | Benefício |
|---|---|---|
| `WebSite` (com `name`, `inLanguage`) | home | nome do site na SERP |
| `Service` × 4 (Sites, Google Ads, SEO, Motion Graphics) com `provider` = Orbara | home | entidades de serviço claras para IA |
| `OfferCatalog` / `Offer` (Essencial R$ 1.490, Aceleração R$ 2.995) | planos | preço explícito legível por máquina |
| `FAQPage` | FAQ | rich result restrito a gov/saúde desde 2023, **mas** segue útil para motores de IA |
| `VideoObject` × 3 (Orbara Studio, Clube do Med 1 e 2) com `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl` | cases de motion | elegível a resultados de vídeo |
| `Article`/`CreativeWork` + `BreadcrumbList` | `/cases/*` | contexto e breadcrumb na SERP |

### 🔵 Low — Depoimentos
- Não marcar os depoimentos como `Review`/`AggregateRating` do próprio negócio: o Google trata como self-serving e não exibe estrelas (e pode considerar enganoso).

Um bloco pronto para colar está em `ACTION-PLAN.md` (item 1.5).
