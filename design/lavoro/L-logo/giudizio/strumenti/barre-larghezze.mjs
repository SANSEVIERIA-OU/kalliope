// La barra a più larghezze, a riposo: node barre-larghezze.mjs <url> <prefisso uscita>
const pw = (await import(process.env.PLAYWRIGHT)).default;
const [url, out] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
for (const w of [320, 600, 1024, 1280]) {
  const p = await b.newPage({viewport: {width: w, height: 700}, deviceScaleFactor: 2, reducedMotion: 'reduce'});
  await p.goto(url, {waitUntil: 'load'}); await p.waitForTimeout(800);
  const m = await p.evaluate(() => { const a = document.querySelector('.marchio'); const r = a.getBoundingClientRect(); const s = (a.querySelector('svg,img') || a).getBoundingClientRect();
    return {sw: document.documentElement.scrollWidth, x: r.x, w: r.width, h: r.height, sx: s.x, sw2: s.width}; });
  await p.screenshot({path: `${out}-${w}.png`, clip: {x: 0, y: 0, width: w, height: 70}});
  console.log(w, `scroll ${m.sw > w ? 'SI' : 'no'}`, `marchio ${Math.round(m.w)}x${Math.round(m.h)} disegno ${Math.round(m.sw2)}`);
  await p.close();
}
await b.close();
