// Il pulsante del comando e lo stato «Oggi:» nel primo schermo, in ogni lingua del sito di prova, a più misure: stampa il fondo (e il bordo dello schermo).
// Uso: node primo-lingue.mjs <url-base> <lingue,…> <misure,…> [pagina=installa/]
const {chromium} = await import(process.env.PLAYWRIGHT);
const [base, lingue, misure, pagina = 'installa/'] = process.argv.slice(2);
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const riga = [];
  for (const l of lingue.split(',')) {
    const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: 'reduce'});
    await p.goto(`${base}${l}/${pagina}`, {waitUntil: 'networkidle'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const q = s => { const e = [...document.querySelectorAll(s)].find(x => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden'); return e ? Math.round(e.getBoundingClientRect().bottom) : null; }; return {c: q('#comandi-apertura .scarica'), s: q('.stato'), h1: q('h1')}; });
    riga.push(`${l}: ${r.c}${r.c > h ? '!!' : ''}/${r.s}`);
    await p.close();
  }
  console.log(`${m}  ${riga.join('  ')}`);
}
await b.close();
