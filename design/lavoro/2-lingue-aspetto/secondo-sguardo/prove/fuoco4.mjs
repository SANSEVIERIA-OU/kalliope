const pw = await import(process.env.PLAYWRIGHT);
const [base] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const motore of ['firefox', 'chromium']) {
  const b = await pw[motore].launch({headless: true});
  for (const pagina of ['/it/', '/it/non-ancora/']) {
    const ctx = await b.newContext({viewport: {width: 390, height: 844}}); const p = await ctx.newPage();
    await p.goto(base + pagina, {waitUntil: 'load'}); await sleep(1500);
    await p.evaluate(() => scrollTo(0, 1500)); await sleep(800);
    const y0 = await p.evaluate(() => scrollY);
    const r = await p.locator('.pulsante-menu').boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await sleep(700);
    const y1 = await p.evaluate(() => scrollY); const f1 = await p.evaluate(() => document.activeElement.textContent.trim().slice(0, 12));
    await p.mouse.click(200, 800); await sleep(500); const y2 = await p.evaluate(() => scrollY);
    await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await sleep(700);
    await p.keyboard.press('Escape'); await sleep(500); const y3 = await p.evaluate(() => scrollY);
    const css = await p.evaluate(() => ({barra: getComputedStyle(document.querySelector('.barra')).position, sp: getComputedStyle(document.documentElement).scrollPaddingTop, menu: getComputedStyle(document.getElementById('menu')).position}));
    console.log(`${motore} ${pagina}: da ${y0} → menu aperto ${y1} (fuoco «${f1}») → clic fuori ${y2} → riaperto ed Esc ${y3} · ${JSON.stringify(css)}`);
    await ctx.close();
  }
  await b.close();
}
