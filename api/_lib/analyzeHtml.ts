/**
 * Checagens reais e verificáveis sobre o HTML entregue pelo site (sem JavaScript).
 * Cada item diz o que foi encontrado; a nota é a média ponderada dos itens.
 */
export type CheckStatus = "ok" | "warn" | "fail";
export type Check = { id: string; label: string; status: CheckStatus; detail: string; weight: number };

type PageInfo = { finalUrl: string; status: number; elapsedMs: number; bytes: number; html: string };

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (s: string) => decode(s.replace(/<[^>]*>/g, " "));

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[1] ?? m[2] ?? m[3] ?? "") : null;
}

function metaContent(tags: string[], key: string): string | null {
  const tag = tags.find((t) => (attr(t, "name") ?? attr(t, "property") ?? "").toLowerCase() === key);
  return tag ? attr(tag, "content") : null;
}

function schemaTypes(html: string): string[] {
  const types = new Set<string>();
  const blocks = html.match(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      const t = (node as Record<string, unknown>)["@type"];
      if (typeof t === "string") types.add(t);
      if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
      Object.values(node as Record<string, unknown>).forEach(walk);
    }
  };
  for (const b of blocks) {
    try {
      walk(JSON.parse(b.replace(/^<script[^>]*>|<\/script>$/gi, "")));
    } catch {
      types.add("(JSON-LD inválido)");
    }
  }
  return [...types];
}

const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

export function analyzeHtml(page: PageInfo): { checks: Check[]; score: number; title: string | null } {
  const { html, finalUrl, elapsedMs, bytes } = page;
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html;
  const metas = head.match(/<meta\b[^>]*>/gi) ?? [];
  const links = head.match(/<link\b[^>]*>/gi) ?? [];
  const title = (() => {
    const m = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? stripTags(m[1]) : null;
  })();
  const description = metaContent(metas, "description");
  const viewport = metaContent(metas, "viewport");
  const robots = (metaContent(metas, "robots") ?? "").toLowerCase();
  const ogTitle = metaContent(metas, "og:title");
  const ogImage = metaContent(metas, "og:image");
  const canonical = links.find((l) => (attr(l, "rel") ?? "").toLowerCase().split(/\s+/).includes("canonical"));
  const lang = html.match(/<html\b[^>]*>/i)?.[0];
  const htmlLang = lang ? attr(lang, "lang") : null;
  const h1s = (html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? []).map(stripTags).filter(Boolean);
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const noAlt = imgs.filter((t) => attr(t, "alt") === null).length;
  const types = schemaTypes(html);
  const https = finalUrl.startsWith("https://");

  const checks: Check[] = [];
  const add = (id: string, label: string, status: CheckStatus, detail: string, weight = 1) => checks.push({ id, label, status, detail, weight });

  add("https", "Conexão segura (HTTPS)", https ? "ok" : "fail", https ? "A página abre em HTTPS." : "A página abre sem HTTPS: navegadores mostram 'Não seguro'.", 1.5);

  const secs = (elapsedMs / 1000).toFixed(1).replace(".", ",");
  add(
    "tempo",
    "Tempo de resposta do servidor",
    elapsedMs <= 1200 ? "ok" : elapsedMs <= 2500 ? "warn" : "fail",
    `O HTML levou ${secs} s para chegar ao nosso servidor de análise (medido agora).`,
  );

  if (!title) add("title", "Título da página", "fail", "Não há <title>: é o texto azul que aparece no Google.", 1.5);
  else
    add(
      "title",
      "Título da página",
      title.length >= 15 && title.length <= 65 ? "ok" : "warn",
      `"${title.slice(0, 90)}" (${title.length} caracteres; o ideal é entre 15 e 65).`,
      1.5,
    );

  if (!description) add("description", "Descrição para o Google", "fail", "Não há meta description: o Google escolhe um trecho qualquer da página.", 1.2);
  else
    add(
      "description",
      "Descrição para o Google",
      description.length >= 70 && description.length <= 165 ? "ok" : "warn",
      `${description.length} caracteres (o ideal é entre 70 e 165).`,
      1.2,
    );

  if (h1s.length === 1) add("h1", "Título principal (H1)", "ok", `"${h1s[0].slice(0, 80)}"`, 1.2);
  else if (h1s.length === 0)
    add("h1", "Título principal (H1)", "fail", "Nenhum H1 no HTML entregue. Sites que montam o conteúdo só com JavaScript também caem aqui.", 1.2);
  else add("h1", "Título principal (H1)", "warn", `${h1s.length} H1 na página; o recomendado é um só, com o assunto principal.`, 1.2);

  add(
    "mobile",
    "Preparado para celular",
    viewport && /width\s*=\s*device-width/i.test(viewport) ? "ok" : "fail",
    viewport ? `Meta viewport: "${viewport.slice(0, 80)}".` : "Sem meta viewport: no celular a página aparece encolhida.",
    1.5,
  );

  const business = types.filter((t) => /Organization|LocalBusiness|ProfessionalService|Store|Restaurant|Dentist|Physician|Attorney|LegalService|MedicalBusiness/i.test(t) || /Business$/.test(t));
  if (!types.length) add("schema", "Dados estruturados (Schema)", "fail", "Nenhum JSON-LD: o Google e as IAs não recebem nome, contato e serviços de forma estruturada.", 1.2);
  else
    add(
      "schema",
      "Dados estruturados (Schema)",
      business.length ? "ok" : "warn",
      `Tipos encontrados: ${types.slice(0, 6).join(", ")}.${business.length ? "" : " Falta um tipo de empresa (Organization/LocalBusiness)."}`,
      1.2,
    );

  add(
    "social",
    "Prévia em redes sociais",
    ogTitle && ogImage ? "ok" : ogTitle || ogImage ? "warn" : "fail",
    ogTitle && ogImage ? "Tem og:title e og:image: o link aparece com imagem no WhatsApp e redes." : `Falta ${[!ogTitle && "og:title", !ogImage && "og:image"].filter(Boolean).join(" e ")}: o link compartilhado no WhatsApp sai sem imagem/título.`,
    0.8,
  );

  add("canonical", "URL canônica", canonical ? "ok" : "warn", canonical ? "Tem link canonical." : "Sem link canonical: versões duplicadas da página podem dividir a relevância.", 0.6);
  add("lang", "Idioma declarado", htmlLang ? "ok" : "warn", htmlLang ? `lang="${htmlLang}".` : "Sem atributo lang no <html>.", 0.4);

  if (imgs.length)
    add(
      "alt",
      "Texto alternativo das imagens",
      noAlt === 0 ? "ok" : noAlt / imgs.length <= 0.2 ? "warn" : "fail",
      noAlt === 0 ? `Todas as ${imgs.length} imagens do HTML têm alt.` : `${plural(noAlt, "imagem", "imagens")} de ${imgs.length} sem alt.`,
      0.6,
    );

  if (/noindex/.test(robots)) add("index", "Liberado para o Google", "fail", "A página tem meta robots noindex: o Google não vai mostrá-la.", 2);

  const kb = Math.round(bytes / 1024);
  add("peso", "Tamanho do HTML", kb <= 400 ? "ok" : kb <= 1200 ? "warn" : "fail", `${kb} KB de HTML (sem contar imagens e scripts).`, 0.6);

  const total = checks.reduce((a, c) => a + c.weight, 0);
  const got = checks.reduce((a, c) => a + c.weight * (c.status === "ok" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  return { checks, score: Math.round((got / total) * 100), title };
}
