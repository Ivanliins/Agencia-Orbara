const { chromium } = require("/opt/node-tools/node_modules/playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2600, height: 1500 } });
  await p.goto("file://" + path.join(__dirname, "kit.html")); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const out = path.join(__dirname, "../out");
  const items = [
    ["banner", "banner-2560x1440.png"],
    ["avatar", "perfil-800x800.png"],
    ["watermark", "marca-dagua-150x150.png", true],
    ["thumb-gads", "miniatura-google-ads-1280x720.jpg"],
    ["thumb-impacto", "miniatura-orbara-impacto-1280x720.jpg"],
  ];
  for (const [id, f, transparent] of items) {
    // a marca-d'água precisa de fundo transparente: tira o fundo escuro da página só nela
    await p.evaluate((t) => { document.body.style.background = t ? "transparent" : ""; }, !!transparent);
    const opts = { path: path.join(out, f), omitBackground: !!transparent };
    if (f.endsWith("jpg")) Object.assign(opts, { type: "jpeg", quality: 90 });
    await p.locator("#" + id).screenshot(opts);
  }
  await b.close();
})();
