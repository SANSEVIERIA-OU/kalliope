const pw = await import(process.env.PLAYWRIGHT);
const [dieci, pagina = '/it/non-ancora/'] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
for (const [w, h] of [[844, 390], [390, 844]]) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, isMobile: true, hasTouch: true}); const p = await ctx.newPage();
  await p.goto(dieci + pagina, {waitUntil: 'load'}); await sleep(1500);
  await p.evaluate(() => scrollTo(0, 600)); await sleep(600);
  const st = async n => console.log(`  ${w}×${h} ${n}: y=${await p.evaluate(() => Math.round(scrollY))} fuoco=${await p.evaluate(() => { const a = document.activeElement; return a.tagName + '«' + a.textContent.trim().slice(0, 14) + '» menu=' + document.getElementById('menu').classList.contains('aperto'); })}`);
  await st('scorsa');
  await p.tap('.pulsante-menu'); await sleep(500); await st('menu toccato');
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); await sleep(150); await st('Tab ' + (i + 1)); if (await p.evaluate(() => document.activeElement?.tagName === 'SUMMARY')) break; }
  await p.keyboard.press('Enter'); await sleep(600); await st('Invio');
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Tab'); await sleep(150); await st('Tab elenco ' + (i + 1)); }
  await ctx.close();
}
await b.close();
