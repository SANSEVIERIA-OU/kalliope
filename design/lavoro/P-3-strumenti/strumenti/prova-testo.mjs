// Fotografa ogni blocco di prova-testo.py (prima e dopo) e li confronta pixel per pixel, in un motore alla volta.
// Uso: PLAYWRIGHT=… node prova-testo.mjs <cartella della pagina> <uscita> [--motori chromium,firefox,webkit] [--porta 8977]
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const SKILL = process.env.SKILL;
const {avvia} = await import(`${SKILL}/scripts/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/scripts/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [cartella, uscita] = process.argv.slice(2);
const motori = arg('--motori', 'chromium,firefox,webkit').split(',');
const server = await servi(cartella, {porta: +arg('--porta', 8977), fresco: true});
const esiti = {};
try {
  for (const motore of motori) {
    const dir = join(uscita, motore); mkdirSync(dir, {recursive: true});
    const b = await avvia(motore);
    try {
      const p = await (await b.newContext({viewport: {width: 1000, height: 800}, deviceScaleFactor: 1})).newPage();
      await p.goto(`http://127.0.0.1:${server.address().port}/index.html`, {waitUntil: 'load'});
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
      const blocchi = await p.$$('section.b');
      const mappa = {}; const caricati = await p.evaluate(() => [...document.fonts].map(f => f.family + ':' + f.status));
      for (const el of blocchi) {
        const [scr, peso, quando] = await el.evaluate(e => [e.dataset.scr, e.dataset.peso, e.dataset.quando]);
        const buf = await el.screenshot({path: join(dir, `${scr}-${peso}-${quando}.png`)});
        (mappa[`${scr}-${peso}`] ||= {})[quando] = createHash('sha256').update(buf).digest('hex');
      }
      const uguali = Object.entries(mappa).filter(([, v]) => v.prima === v.dopo).length;
      esiti[motore] = {blocchi: Object.keys(mappa).length, uguali, diversi: Object.entries(mappa).filter(([, v]) => v.prima !== v.dopo).map(([k]) => k), caricati: caricati.filter(c => !c.endsWith('loaded')).slice(0, 5), nonCaricati: caricati.filter(c => !/loaded$/.test(c)).length};
      console.log(motore, JSON.stringify(esiti[motore]));
    } finally { await b.close().catch(() => {}); }
  }
} finally { server.close(); }
writeFileSync(join(uscita, 'esiti.json'), JSON.stringify(esiti, null, 1));
