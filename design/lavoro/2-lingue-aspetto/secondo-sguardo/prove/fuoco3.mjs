const pw = await import(process.env.PLAYWRIGHT);
const [base, pagina] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
for (const modo of ['tap', 'click', 'mouse']) for (const y of [600, 1500]) {
  const ctx = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}); const p = await ctx.newPage();
  await p.goto(base + pagina, {waitUntil: 'load'}); await sleep(1500);
  await p.evaluate(y => scrollTo(0, y), y); await sleep(800);
  const y0 = await p.evaluate(() => scrollY);
  if (modo === 'tap') await p.tap('.pulsante-menu'); else if (modo === 'click') await p.click('.pulsante-menu'); else { const r = await p.locator('.pulsante-menu').boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
  await sleep(600);
  const y1 = await p.evaluate(() => scrollY);
  await p.keyboard.press('Escape'); await sleep(400);
  const y2 = await p.evaluate(() => scrollY);
  console.log(`${pagina} ${modo} da ${y0}: menu aperto y=${y1}, chiuso y=${y2}`);
  await ctx.close();
}
await b.close();
