// Pré-renderiza as rotas do site em HTML estático depois do build.
// Assim Google, crawlers de IA e prévias de redes sociais recebem o conteúdo
// completo e os metadados certos de cada página, sem depender de JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const { render, ROUTES, NOT_FOUND, imageOf, canonicalOf } = await import(pathToFileURL(ssrEntry).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setTag(html, regex, replacement) {
  if (!regex.test(html)) throw new Error(`Tag não encontrada no template: ${regex}`);
  return html.replace(regex, replacement);
}

function applyHead(html, meta) {
  const canonical = canonicalOf(meta);
  const image = imageOf(meta);
  const title = esc(meta.title);
  const desc = esc(meta.description);
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`);
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow"}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, canonical ? `<link rel="canonical" href="${canonical}" />` : "");
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, canonical ? `<meta property="og:url" content="${canonical}" />` : "");
  html = setTag(html, /<meta name="twitter:url" content="[^"]*" \/>/, canonical ? `<meta name="twitter:url" content="${canonical}" />` : "");
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  // O preload da imagem do hero só faz sentido na home
  if (meta.path !== "/") html = html.replace(/\s*<link rel="preload" as="image" href="\/hero-bg[^>]*>/g, "");
  if (meta.jsonLd) {
    html = html.replace("</head>", `  <script type="application/ld+json" id="route-jsonld">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>\n  </head>`);
  }
  return html;
}

async function build(urlPath, meta, outFile) {
  const app = await render(urlPath);
  let html = applyHead(template, meta);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${app}</div>`);
  const file = path.join(dist, outFile);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`✓ ${urlPath.padEnd(28)} → dist/${outFile} (${Math.round(html.length / 1024)} KB)`);
}

for (const meta of ROUTES) {
  const out = meta.path === "/" ? "index.html" : `${meta.path.slice(1)}/index.html`;
  await build(meta.path, meta, out);
}
// Página 404 (a Vercel serve dist/404.html com status 404 para URLs inexistentes)
await build("/404", NOT_FOUND, "404.html");

fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
