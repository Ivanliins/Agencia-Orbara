import { useEffect } from "react";
import { metaFor, imageOf, canonicalOf } from "./routes";

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Atualiza title, description, canonical, OG e JSON-LD da página ao navegar no cliente. */
export function useSeo(path: string) {
  useEffect(() => {
    const m = metaFor(path);
    const canonical = canonicalOf(m);
    const image = imageOf(m);

    document.title = m.title;
    setMeta('meta[name="description"]', "name", "description", m.description);
    setMeta('meta[name="robots"]', "name", "robots", m.noindex ? "noindex, follow" : "index, follow");
    setMeta('meta[property="og:title"]', "property", "og:title", m.title);
    setMeta('meta[property="og:description"]', "property", "og:description", m.description);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", m.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", m.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
      setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    } else link?.remove();

    document.getElementById("route-jsonld")?.remove();
    if (m.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "route-jsonld";
      s.textContent = JSON.stringify(m.jsonLd);
      document.head.appendChild(s);
    }
  }, [path]);
}
