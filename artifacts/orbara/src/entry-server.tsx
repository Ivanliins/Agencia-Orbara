import { prerenderToNodeStream } from "react-dom/static";
import App from "./App";

export { ROUTES, NOT_FOUND, metaFor, imageOf, canonicalOf } from "./seo/routes";

/** Renderiza uma rota para HTML estático (usado por scripts/prerender.mjs). */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(<App ssrPath={url} />);
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}
