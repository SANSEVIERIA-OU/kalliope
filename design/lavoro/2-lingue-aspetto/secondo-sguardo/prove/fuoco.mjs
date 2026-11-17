// Firefox 390×844: Tab fino in fondo, ogni sosta nel piede è nello schermo? Chromium 844×390 e 326×326 (con tocco): menu aperto,
// Tab dentro l'elenco delle lingue: la pagina sotto si muove?
const pw = await import(process.env.PLAYWRIGHT);
const [vero, dieci] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
{
  const b = await pw.firefox.launch({headless: true}); const p = await b.newPage({viewport: {width: 390, height: 844}});
  await p.goto(dieci + '/it/non-ancora/', {waitUntil: 'load'}); await sleep(1500);
  const soste = [];
  for (let i = 0; i < 80; i++) { await p.keyboard.press('Tab'); await sleep(120);
    const s = await p.evaluate(() => { const a = document.activeElement; if (!a || !a.closest('.piede')) return null; const r = a.getBoundingClientRect(); return {t: a.textContent.trim().slice(0, 16), dentro: r.top >= 0 && r.bottom <= innerHeight, b: Math.round(r.bottom), ih: innerHeight}; });
    if (s) soste.push(s); else if (soste.length) break; }
  console.log(`Firefox 390×844 piede: ${soste.filter(s => s.dentro).length}/${soste.length} soste nello schermo · ${soste.filter(s => !s.dentro).map(s => s.t + ' ' + s.b + '/' + s.ih).join(', ')}`);
  await b.close();
}
{
  const b = await pw.chromium.launch({headless: true});
  for (const [w, h] of [[844, 390], [326, 326], [390, 844]]) {
    const ctx = await b.newContext({viewport: {width: w, height: h}, isMobile: true, hasTouch: true}); const p = await ctx.newPage();
    await p.goto(dieci + '/it/non-ancora/', {waitUntil: 'load'}); await sleep(1500);
    await p.evaluate(() => scrollTo(0, 600)); await sleep(500);
    const y0 = await p.evaluate(() => scrollY);
    await p.tap('.pulsante-menu'); await sleep(500);
    let ok = false; for (let i = 0; i < 12 && !ok; i++) { await p.keyboard.press('Tab'); await sleep(100); ok = await p.evaluate(() => document.activeElement?.tagName === 'SUMMARY'); }
    await p.keyboard.press('Enter'); await sleep(600);
    for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); await sleep(150); }
    const y1 = await p.evaluate(() => scrollY); const f = await p.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return document.activeElement.textContent.trim() + ' ' + (r.top >= 0 && r.bottom <= innerHeight ? 'in vista' : 'FUORI'); });
    await p.screenshot({path: `/tmp/lavoro-2s-foto/ritagli/menu-fuoco-${w}x${h}.png`});
    console.log(`Chromium ${w}×${h}: pagina sotto ${y0} → ${y1} (${y1 - y0} px), fuoco su ${f}`);
    await ctx.close();
  }
  await b.close();
}
