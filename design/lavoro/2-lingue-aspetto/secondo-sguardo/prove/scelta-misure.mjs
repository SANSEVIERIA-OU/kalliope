const pw = await import(process.env.PLAYWRIGHT);
const [base, uscita] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
for (const [w, h] of [[1440,900],[1280,720],[390,844],[844,390],[915,412],[740,360],[667,375],[568,320],[326,326],[360,640],[320,568]]) {
  const tel = w < 900 || h < 500;
  const ctx = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 1, locale: 'it-IT', ...(tel ? {isMobile: true, hasTouch: true} : {})});
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(String(e)));
  await p.goto(base, {waitUntil: 'load'}); await new Promise(r => setTimeout(r, 4500));
  const m = await p.evaluate(() => {
    const bar = document.querySelector('.barra'), cs = getComputedStyle(bar);
    const t = document.querySelector('.scelta-tavolo .tavolo-cornice')?.getBoundingClientRect();
    const bo = document.querySelector('.bolla-lingue')?.getBoundingClientRect();
    return {sh: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, ih: innerHeight, iw: innerWidth, barra: bar.className, fondo: cs.backgroundColor + ' ' + cs.backgroundImage.slice(0,40),
      bolla: bo && [Math.round(bo.top), Math.round(bo.bottom)], riunione: t && [Math.round(t.top), Math.round(t.bottom)], prima: document.querySelector('.lingue-in-bolla a')?.textContent};
  });
  if (uscita) await p.screenshot({path: `${uscita}-${w}x${h}.png`});
  console.log(`${w}x${h} altezza=${m.sh}/${m.ih} ${m.sh > m.ih ? 'SCORRE ' + (m.sh - m.ih) : 'sta'} lato=${m.sw > m.iw} bolla=${m.bolla} riunione=${m.riunione} barra="${m.barra}" fondo=${m.fondo} prima=${m.prima} errori=${err.length}`);
  await ctx.close();
}
await b.close();
