// Renderiza commercial.html quadro a quadro com Playwright e codifica em MP4 com ffmpeg.
// Uso:
//   node render.cjs h out/video-16x9.mp4            -> vídeo completo 1920x1080
//   node render.cjs v out/video-9x16.mp4            -> vídeo completo 1080x1920
//   node render.cjs h out/frames --stills 2,6,11    -> apenas quadros PNG nos segundos indicados
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const [, , fmt = "h", out = "out/video.mp4", flag, list] = process.argv;
const FPS = 30;
const [W, H] = fmt === "v" ? [1080, 1920] : [1920, 1080];
const url = "file://" + path.join(__dirname, "commercial.html") + "?f=" + fmt;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => window.READY);
  const duration = await page.evaluate(() => window.DURATION);

  if (flag === "--stills") {
    fs.mkdirSync(out, { recursive: true });
    for (const t of list.split(",").map(Number)) {
      await page.evaluate((t) => { window.TL.seek(t, false); }, t);
      await page.screenshot({ path: path.join(out, `${fmt}-${String(t).replace(".", "_")}s.png`) });
    }
    await browser.close();
    return;
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });

  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => { window.TL.seek(t, false); }, i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 150 === 0) process.stdout.write(`${fmt}: ${i}/${total}\n`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  console.log(`✓ ${out}`);
})();
