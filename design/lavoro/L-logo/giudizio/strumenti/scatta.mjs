// Foto di una pagina (file o indirizzo) senza finestra: node scatta.mjs <pagina> <uscita.png> [larghezza] [altezza] [scala] [intera:1|0]
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const pw = (await import(process.env.PLAYWRIGHT)).default;
const [pagina, uscita, w = 1440, h = 900, scala = 1, intera = '1'] = process.argv.slice(2);
const url = /^https?:/.test(pagina) ? pagina : pathToFileURL(resolve(pagina)).href;
const b = await pw.chromium.launch({headless: true});
const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: +scala});
const errori = [];
p.on('pageerror', e => errori.push(String(e))); p.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
await p.goto(url, {waitUntil: 'load'});
await p.waitForTimeout(+(process.env.ATTESA || 600));
await p.screenshot({path: uscita, fullPage: intera === '1'});
console.log(uscita, errori.length ? 'ERRORI: ' + errori.join(' | ') : 'nessun errore');
await b.close();
