/**
 * Metadados de SEO por rota. Usados em dois lugares:
 * - no build, pelo script de pré-renderização (scripts/prerender.mjs), que escreve
 *   title/description/canonical/OG/JSON-LD direto no HTML de cada página;
 * - no navegador, pelo hook useSeo, ao navegar entre páginas sem recarregar.
 */
import { SERVICE_PAGES, type ServicePage } from "@/content/servicePages";

export const SITE_URL = "https://orbara.com.br";

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  /** JSON-LD extra da página (além do @graph global do index.html). */
  jsonLd?: Record<string, unknown>;
};

const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;

const HOME: RouteMeta = {
  path: "/",
  title: "Orbara — Criação de Sites de Alta Performance e SEO",
  description:
    "Agência especializada em Criação de Sites e Auditoria SEO Técnica. Transforme sua presença digital e domine as buscas com a Orbara.",
};

type CaseSeo = { slug: string; client: string; title: string; description: string; image: string; headline: string };

export const CASE_SEO: CaseSeo[] = [
  {
    slug: "casa-voltari",
    client: "Voltari",
    title: "Case Voltari: +138% em vendas online com site e tráfego pago | Orbara",
    description:
      "Como a Orbara posicionou a Voltari como referência em mobilidade elétrica: site focado em conversão, SEO por categoria e tráfego pago segmentado. +138% em vendas online em 3 meses.",
    image: `${SITE_URL}/case-voltari.jpg`,
    headline: "Do nicho ao mainstream da mobilidade elétrica",
  },
  {
    slug: "camila-nogueira",
    client: "Dra. Camila Nogueira — Advocacia",
    title: "Case Advocacia: +91% de novos clientes com SEO local e OAB | Orbara",
    description:
      "Site de autoridade, blog jurídico, SEO local e Google Ads dentro das normas da OAB para o escritório da Dra. Camila Nogueira. +91% em novos clientes por mês em 3 meses.",
    image: `${SITE_URL}/case-camila.jpg`,
    headline: "Autoridade digital dentro das normas da OAB",
  },
  {
    slug: "central-park",
    client: "Estacionamento Central Park",
    title: "Case Estacionamento: +68% de ocupação com Google Maps | Orbara",
    description:
      "Google Meu Negócio otimizado, campanhas geolocalizadas num raio de 3 km e conteúdo local levaram o Estacionamento Central Park a +68% de ocupação mensal em 2 meses.",
    image: `${SITE_URL}/case-central-park.jpg`,
    headline: "Do desconhecido ao ponto de referência da região",
  },
];

const caseMeta = (c: CaseSeo): RouteMeta => ({
  path: `/cases/${c.slug}`,
  title: c.title,
  description: c.description,
  image: c.image,
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.headline,
        description: c.description,
        image: c.image,
        inLanguage: "pt-BR",
        about: { "@type": "Organization", name: c.client },
        author: { "@id": `${SITE_URL}/#org` },
        publisher: { "@id": `${SITE_URL}/#org` },
        mainEntityOfPage: `${SITE_URL}/cases/${c.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Cases", item: `${SITE_URL}/#cases` },
          { "@type": "ListItem", position: 3, name: c.client, item: `${SITE_URL}/cases/${c.slug}` },
        ],
      },
    ],
  },
});

export const NOT_FOUND: RouteMeta = {
  path: "/404",
  title: "Página não encontrada | Orbara",
  description: "Esta página não existe. Conheça os serviços, cases e planos da Orbara.",
  noindex: true,
};

/** Página de obrigado do formulário: fora do Google (noindex) e fora do sitemap. */
export const THANKS: RouteMeta = {
  path: "/obrigado",
  title: "Recebemos seu contato | Orbara",
  description: "Obrigado pelo contato. Um especialista da Orbara responde em até 24h úteis.",
  noindex: true,
};

/** Páginas de serviço: destino dos grupos de anúncios e páginas indexáveis para cada serviço. */
const PLAN_OFFERS = [
  { name: "Essencial", price: "1490" },
  { name: "Aceleração", price: "2995" },
];

const serviceMeta = (s: ServicePage): RouteMeta => ({
  path: `/${s.slug}`,
  title: s.seoTitle,
  description: s.seoDescription,
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/${s.slug}#service`,
        name: s.name,
        serviceType: s.serviceType,
        description: s.seoDescription,
        url: `${SITE_URL}/${s.slug}`,
        provider: { "@id": `${SITE_URL}/#org` },
        areaServed: { "@type": "Country", name: "Brasil" },
        ...(s.slug === "criacao-de-sites"
          ? { offers: PLAN_OFFERS.map((o) => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: "BRL" })) }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/${s.slug}` },
        ],
      },
    ],
  },
});

export const ROUTES: RouteMeta[] = [HOME, ...SERVICE_PAGES.map(serviceMeta), ...CASE_SEO.map(caseMeta), THANKS];

export function metaFor(path: string): RouteMeta {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return ROUTES.find((r) => r.path === clean) ?? NOT_FOUND;
}

export const imageOf = (m: RouteMeta) => m.image ?? DEFAULT_IMAGE;
export const canonicalOf = (m: RouteMeta) => (m.noindex ? undefined : `${SITE_URL}${m.path === "/" ? "/" : m.path}`);
