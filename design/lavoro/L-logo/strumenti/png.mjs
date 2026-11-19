// Rende un SVG in PNG a più grandezze, con il fondo trasparente, nel Chromium senza finestra (lo stesso motore che disegna le
// pagine di prova). Serve a provare come verrebbero ICO e ICNS. Uso: node png.mjs <file.svg> <cartella> 16,24,32
import {mkdirSync, readFileSync} from 'node:fs';
import {join, resolve, basename} from 'node:path';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [svg, cart, mis] = process.argv.slice(2); mkdirSync(cart, {recursive: true});
const b = await chromium.launch({headless: true});
for (const s of mis.split(',').map(Number)) {
  const p = await b.newPage({viewport: {width: s, height: s}});
  await p.setContent(`<style>html,body{margin:0;background:transparent}img{display:block;width:${s}px;height:${s}px}</style><img src="data:image/svg+xml;base64,${readFileSync(svg).toString('base64')}">`);
  await p.waitForTimeout(100);
  await p.screenshot({path: join(resolve(cart), `${basename(svg, '.svg')}-${s}.png`), omitBackground: true});
  await p.close();
}
await b.close(); console.log('png', svg, mis);
