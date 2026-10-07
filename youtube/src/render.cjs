const { chromium } = require("/opt/node-tools/node_modules/playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2600, height: 1500 } });
  await p.goto("file://" + path.join(__dirname, "kit.html")); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const out = path.join(__dirname, "../out");
  for (const [id, f, omit] of [["banner","banner-2560x1440.png"],["avatar","perfil-800x800.png"],["watermark","marca-dagua-150x150.png",true],["thumb-gads","miniatura-google-ads-1280x720.jpg"],["thumb-impacto","miniatura-orbara-impacto-1280x720.jpg"]])
    await p.locator("#"+id).screenshot({ path: path.join(out, f), omitBackground: !!omit, ...(f.endsWith("jpg") ? { type: "jpeg", quality: 90 } : {}) });
  await b.close();
})();
