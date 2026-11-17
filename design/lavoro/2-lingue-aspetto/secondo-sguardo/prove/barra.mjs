// La barra dopo la rotella vera, a ogni larghezza: voci fuori dallo schermo, sopra il marchio, sotto l'azione, su due righe;
// l'azione sopra il marchio o sopra «Menu». Uso: node barra.mjs <base> <pagine nome=percorso;...> <da> <a> <passo> [uscita foto]
import {mkdirSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [base, pagineArg, da, a, passo, uscita] = process.argv.slice(2);
if (uscita) mkdirSync(uscita, {recursive: true});
const b = await pw.chromium.launch({headless: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let rotte = 0, totale = 0;
for (const [nome, percorso] of pagineArg.split(';').map(x => x.split('='))) {
  const ctx = await b.newContext({viewport: {width: +a, height: 800}, deviceScaleFactor: 1});
  const p = await ctx.newPage();
  await p.goto(base + percorso, {waitUntil: 'load'}); await sleep(2500);
  const male = [];
  for (let w = +da; w <= +a; w += +passo) {
    await p.setViewportSize({width: w, height: 800}); await sleep(150);
    await p.evaluate(() => scrollTo(0, 0)); await sleep(100);
    await p.mouse.move(w / 2, 400);
    for (let i = 0; i < 8; i++) { await p.mouse.wheel(0, 200); await sleep(40); }
    await sleep(700);
    const r = await p.evaluate(() => {
      const q = e => e ? e.getBoundingClientRect() : null, vis = e => e && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1;
      const bar = document.querySelector('.barra'), marchio = q(bar.querySelector('.marchio svg')), parola = bar.querySelector('.marchio span');
      const az = bar.querySelector('.barra-azione'), pm = bar.querySelector('.pulsante-menu');
      const voci = [...bar.querySelectorAll('#menu > ul > li > a, #menu summary')].filter(vis);
      const errori = [];
      const sopra = (x, y) => x && y && x.left < y.right - 1 && x.right > y.left + 1 && x.top < y.bottom - 1 && x.bottom > y.top + 1;
      const ra = vis(az) ? q(az) : null, rp = vis(pm) ? q(pm) : null, rw = vis(parola) ? q(parola) : null;
      for (const v of voci) { const x = q(v), t = v.textContent.trim().slice(0, 14);
        if (x.left < 0 || x.right > innerWidth) errori.push(`fuori «${t}»`);
        if (sopra(x, marchio) || sopra(x, rw)) errori.push(`sul marchio «${t}»`);
        if (sopra(x, ra)) errori.push(`sotto l'azione «${t}»`);
        if (v.getClientRects().length > 1 || x.height > 2.2 * parseFloat(getComputedStyle(v).fontSize) + 24) errori.push(`due righe «${t}»`); }
      if (ra && (sopra(ra, marchio) || sopra(ra, rw))) errori.push('azione sul marchio');
      if (ra && sopra(ra, rp)) errori.push('azione su Menu');
      if (ra && (ra.left < 0 || ra.right > innerWidth)) errori.push('azione fuori');
      return {classi: bar.className, voci: voci.length, azione: !!ra, menu: !!rp, errori, lato: document.documentElement.scrollWidth > innerWidth};
    });
    totale++;
    if (r.errori.length || r.lato) { rotte++; male.push(`${w}: ${r.errori.join(', ')}${r.lato ? ' SCORRE DI LATO' : ''} [${r.classi}]`); if (uscita) await p.screenshot({path: `${uscita}/${nome}-${w}.png`, clip: {x: 0, y: 0, width: w, height: 120}}); }
  }
  console.log(`${nome}: ${male.length ? male.length + ' rotte\n  ' + male.join('\n  ') : 'nessuna rotta'}`);
  await ctx.close();
}
await b.close();
console.log(`TOTALE ${rotte} rotte su ${totale}`);
