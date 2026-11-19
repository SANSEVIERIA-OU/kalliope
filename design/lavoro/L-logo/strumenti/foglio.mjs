// Rifà il foglio di una sequenza di gesto-lente.mjs dai fotogrammi già scattati (senza registrare di nuovo).
// Uso: node foglio.mjs <cartella> <nome-misura>   (legge <nome-misura>.json)
import {readFileSync, writeFileSync, rmSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [cart, base] = process.argv.slice(2), u = resolve(cart), j = JSON.parse(readFileSync(join(u, `${base}.json`), 'utf8'));
const col = 3, lar = 520, f = join(u, `.foglio-${base}.html`);
writeFileSync(f, `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#1c1c1c;font:14px sans-serif;color:#fff}h1{font-size:15px;margin:0;padding:8px 8px 0}.g{display:grid;grid-template-columns:repeat(${col},${lar}px);gap:8px;padding:8px}figure{margin:0}img{width:100%;display:block}</style>
<h1>${base} · il puntatore sul marchio (lente)</h1><div class="g">${j.fotogrammi.map(x => `<figure><figcaption>${String(x.chiesto).replace('.', ',')} s</figcaption><img src="fotogrammi/${x.file}"></figure>`).join('')}</div>`);
const b = await chromium.launch({headless: true}), p = await b.newPage();
await p.setViewportSize({width: col * lar + 8 * (col + 1), height: 100});
await p.goto(pathToFileURL(f).href, {waitUntil: 'load'}); rmSync(f);
await p.screenshot({path: join(u, `${base}-foglio.jpg`), type: 'jpeg', quality: 80, fullPage: true});
await b.close(); console.log('foglio', base);
