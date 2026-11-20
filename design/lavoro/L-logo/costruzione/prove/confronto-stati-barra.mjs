// Il segno nella barra, in ogni posizione del fronte, nella direzione scelta (la copia della prova L-1) e nella pagina di adesso: pixel diversi nell'area del segno.
// Uso: node confronto-stati-barra.mjs <home della scelta> <home di adesso> <cartella di uscita> [larghezze=1440,390]
import {mkdirSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [scelta, adesso, cart, larg = '1440,390'] = process.argv.slice(2);
mkdirSync(cart, {recursive: true});
const b = await chromium.launch({headless: true});
const POSIZIONI = [-60, -30, 0, 10, 31, 46, 62];
const out = [];
for (const w of larg.split(',').map(Number)) {
  const foto = {};
  for (const [nome, url] of [['scelta', scelta], ['adesso', adesso]]) {
    const ctx = await b.newContext({viewport: {width: w, height: 800}, deviceScaleFactor: 3});
    const p = await ctx.newPage();
    await p.goto(url, {waitUntil: 'load'}); await p.waitForTimeout(1800);
    foto[nome] = [];
    for (const x of POSIZIONI) {
      await p.evaluate(x => document.querySelectorAll('.barra .m-fronte').forEach(f => f.setAttribute('transform', `translate(${x} 0)`)), x);
      const r = await p.evaluate(() => { const s = document.querySelector('.barra .m-segno').getBoundingClientRect(); return {x: s.x, y: s.y, w: s.width, h: s.height}; });
      foto[nome].push({x, r, png: await p.screenshot({clip: {x: r.x - 4, y: r.y - 4, width: r.w + 8, height: r.h + 8}})});
    }
    await ctx.close();
  }
  for (let i = 0; i < POSIZIONI.length; i++) {
    const A = foto.scelta[i], B = foto.adesso[i];
    const diff = await b.newPage();
    const n = await diff.evaluate(async ([a, c]) => {
      const carica = s => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([carica(a), carica(c)]);
      const cv = document.createElement('canvas'); cv.width = ia.width; cv.height = ia.height; const x = cv.getContext('2d', {willReadFrequently: true});
      x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, cv.width, cv.height).data; x.clearRect(0, 0, cv.width, cv.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, cv.width, cv.height).data;
      let k = 0; for (let j = 0; j < da.length; j += 4) if (Math.max(Math.abs(da[j] - db[j]), Math.abs(da[j + 1] - db[j + 1]), Math.abs(da[j + 2] - db[j + 2])) > 2) k++;
      return {diversi: k, totale: da.length / 4, stessaMisura: ia.width === ib.width && ia.height === ib.height};
    }, [A.png.toString('base64'), B.png.toString('base64')]);
    await diff.close();
    out.push({larghezza: w, fronte: POSIZIONI[i], misuraScelta: A.r, misuraAdesso: B.r, ...n});
    writeFileSync(`${cart}/${w}-fronte${POSIZIONI[i]}-scelta.png`, A.png); writeFileSync(`${cart}/${w}-fronte${POSIZIONI[i]}-adesso.png`, B.png);
  }
}
await b.close();
writeFileSync(cart + '/confronto-stati-barra.json', JSON.stringify(out, null, 1));
let no = 0;
for (const r of out) { const bad = r.diversi > 0 || !r.stessaMisura; if (bad) no++; console.log(`${r.larghezza} fronte ${String(r.fronte).padStart(3)}: ${r.stessaMisura ? '' : 'MISURA DIVERSA '}${r.diversi} pixel diversi su ${r.totale}`); }
process.exit(no ? 1 : 0);
