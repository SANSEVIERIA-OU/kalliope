// Foto di pagine in un Chromium senza finestra, uno solo per tutte le foto di un elenco.
// Uso: node scatta.mjs elenco.json   (elenco: [{url, w, h, out, dpr?, attesa?, pieno?, clip?:{x,y,width,height}, prima?:"js", ridotto?, tema?}])
// «{U}» nell'indirizzo diventa ANTEPRIMA (con-server.mjs).
import {readFileSync, mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href);
const chromium = pw.chromium || pw.default.chromium;
const elenco = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const b = await chromium.launch({headless: true});
try {
  for (const f of elenco) {
    const ctx = await b.newContext({viewport: {width: f.w, height: f.h}, deviceScaleFactor: f.dpr || 1,
      reducedMotion: f.ridotto ? 'reduce' : 'no-preference', colorScheme: f.tema || 'light'});
    const p = await ctx.newPage();
    p.on('pageerror', e => console.error('errore della pagina', f.out, e.message));
    await p.goto(f.url.replaceAll('{U}', process.env.ANTEPRIMA || ''), {waitUntil: 'load'});
    if (f.prima) await p.evaluate(f.prima);
    await p.waitForTimeout(f.attesa ?? 600);
    mkdirSync(dirname(f.out), {recursive: true});
    await p.screenshot({path: f.out, fullPage: !!f.pieno, ...(f.clip ? {clip: f.clip} : {})});
    console.log('foto', f.out);
    await ctx.close();
  }
} finally { await b.close(); }
