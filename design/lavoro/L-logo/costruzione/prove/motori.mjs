// Il segno nella barra e la forma piccola nei tre motori (Chromium, Firefox, WebKit, senza finestra): il fronte a 0, 31 e 62, e piccola.svg a 16 e 32 px.
// Controlla che ogni motore disegni il segno (i ritagli annidati e il tratteggio) come Chromium: pixel diversi nell'area del segno rispetto a Chromium.
// Uso: node motori.mjs <home del sito costruito> <cartella di uscita>
import {mkdirSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const {avvia} = await import(pathToFileURL(process.env.SKILL + '/scripts/lib/comune.mjs').href);   // Firefox e WebKit con le librerie di prepara-motori.sh (senza root)
const [url, cart] = process.argv.slice(2);
mkdirSync(cart, {recursive: true});
const POS = [0, 31, 62];
const risultati = {};
for (const nome of ['chromium', 'firefox', 'webkit']) {
  let b;
  try { b = await avvia(nome); } catch (e) { risultati[nome] = {errore: e.message.split('\n')[0]}; continue; }
  try {
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 3});
    const p = await ctx.newPage();
    const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
    await p.goto(url, {waitUntil: 'load'}); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const s = document.querySelector('.barra .m-segno').getBoundingClientRect(); return {x: s.x, y: s.y, w: s.width, h: s.height}; });
    risultati[nome] = {versione: b.version(), segno: r, errori: err, foto: {}};
    for (const x of POS) {
      await p.evaluate(x => document.querySelectorAll('.barra .m-fronte').forEach(f => f.setAttribute('transform', `translate(${x} 0)`)), x);
      const png = await p.screenshot({clip: {x: r.x - 4, y: r.y - 4, width: r.w + 8, height: r.h + 8}});
      writeFileSync(`${cart}/${nome}-fronte${x}.png`, png); risultati[nome].foto[x] = `${nome}-fronte${x}.png`;
    }
    // la forma piccola come immagine, a 16 e 32 px, su chiaro e su scuro (la scheda del browser la disegna così)
    for (const n of [16, 32]) {
      const base = new URL('../design-system/marchio/piccola.svg', url).href;
      await p.setContent(`<body style="margin:0"><div style="display:flex;gap:16px;padding:8px"><div style="background:#fafafb;padding:8px"><img src="${base}" width="${n}" height="${n}"></div><div style="background:#222226;padding:8px"><img src="${base}" width="${n}" height="${n}"></div></div>`);
      await p.waitForTimeout(500);
      writeFileSync(`${cart}/${nome}-piccola-${n}.png`, await p.screenshot({clip: {x: 0, y: 0, width: 2 * (n + 16) + 32, height: n + 32}}));
    }
  } catch (e) { risultati[nome] = {...(risultati[nome] || {}), errore: e.message.split('\n')[0]}; }
  await b.close();
}
writeFileSync(cart + '/motori.json', JSON.stringify(risultati, null, 1));
for (const [n, r] of Object.entries(risultati)) console.log(n, r.errore ? 'NON PARTE: ' + r.errore : `${r.versione} · segno ${r.segno.w}×${r.segno.h} · errori in console: ${r.errori.length}${r.errori.length ? ' ' + r.errori.join(' | ') : ''}`);
