const { chromium } = require("/opt/node-tools/node_modules/playwright");
const path = require("path");
const NAMES = { 1: "leads-no-celular", 2: "topo-do-google", 3: "site-3-a-5-dias", 4: "orbita" };
const FMT = { land: "google-1200x628", sq: "quadrado-1080x1080", port: "feed-1080x1350", story: "stories-1080x1920" };
const only = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 2000 } });
  for (const c of [1, 2, 3, 4]) for (const f of Object.keys(FMT)) {
    if (only && only !== `${c}-${f}` && only !== String(c)) continue;
    await p.goto("file://" + path.join(__dirname, "criativo.html") + `?c=${c}&f=${f}`);
    await p.evaluate(() => document.fonts.ready); await p.waitForFunction(() => document.body.dataset.ready === "1"); await p.waitForTimeout(150);
    await p.locator("#art").screenshot({ path: path.join(__dirname, "../out", `${c}-${NAMES[c]}-${FMT[f]}.jpg`), type: "jpeg", quality: 92 });
  }
  await b.close();
})();
