// Il passaggio del puntatore sul marchio, visto con la lente: la pagina vera dentro lente.html, ingrandita, e il puntatore
// portato sul marchio con il mouse vero (gli eventi attraversano la cornice e l'ingrandimento). Fotogrammi a tempi dati, foglio
// e video, come sequenza.mjs (che non sa puntare dentro una cornice). Uso:
//   node gesto-lente.mjs <indirizzo della lente> <cartella> --misura 1200x216 --punto 90,108 --istanti 0,0.1,… --nome puntatore
import {mkdirSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const a = process.argv.slice(2), opz = {}; const pos = [];
for (let i = 0; i < a.length; i++) if (a[i].startsWith('--')) opz[a[i].slice(2)] = a[++i]; else pos.push(a[i]);
const [url, cart] = pos, [w, h] = opz.misura.split('x').map(Number), [px, py] = opz.punto.split(',').map(Number);
const ist = opz.istanti.split(',').map(Number), nome = opz.nome || 'puntatore', uscita = resolve(cart);
mkdirSync(join(uscita, 'fotogrammi'), {recursive: true});
const b = await chromium.launch({headless: true});
const ctx = await b.newContext({viewport: {width: w, height: h}, recordVideo: {dir: uscita, size: {width: w, height: h}}, reducedMotion: opz.ridotto ? 'reduce' : 'no-preference'});
const p = await ctx.newPage();
await p.mouse.move(w - 2, h - 2);
await p.goto(url.replaceAll('{U}', process.env.ANTEPRIMA || ''), {waitUntil: 'load'});
await p.waitForTimeout(+(opz.attesa || 2500));
await p.mouse.move(px, py, {steps: 4});
const t0 = Date.now(), fot = [];
for (const [i, s] of ist.entries()) {
  const manca = t0 + s * 1000 - Date.now(); if (manca > 0) await p.waitForTimeout(manca);
  const file = `${nome}-${w}x${h}-f${String(i + 1).padStart(2, '0')}.jpg`;
  await p.screenshot({path: join(uscita, 'fotogrammi', file), type: 'jpeg', quality: 85});
  fot.push({file, chiesto: s, scattato: +((Date.now() - t0) / 1000).toFixed(2)});
}
await p.waitForTimeout(600);
const v = p.video(); await ctx.close(); const vf = `${nome}-${w}x${h}.webm`; renameSync(await v.path(), join(uscita, vf));
const pag = await b.newPage();
const col = 3, lar = 520;
await pag.setViewportSize({width: col * lar + 8 * (col + 1), height: 100});
const fileFoglio = join(uscita, `.foglio-${nome}.html`);
writeFileSync(fileFoglio, `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#1c1c1c;font:14px sans-serif;color:#fff}h1{font-size:15px;margin:0;padding:8px 8px 0}.g{display:grid;grid-template-columns:repeat(${col},${lar}px);gap:8px;padding:8px}figure{margin:0}img{width:100%;display:block}</style>
  <h1>${nome} · ${w}×${h} · il puntatore sul marchio (lente)${opz.ridotto ? ' · movimento ridotto' : ''}</h1><div class="g">${fot.map(f => `<figure><figcaption>${String(f.chiesto).replace('.', ',')} s</figcaption><img src="${pathToFileURL(join(uscita, 'fotogrammi', f.file)).href}"></figure>`).join('')}</div>`);
await pag.goto(pathToFileURL(fileFoglio).href, {waitUntil: 'load'}); rmSync(fileFoglio);
await pag.screenshot({path: join(uscita, `${nome}-${w}x${h}-foglio.jpg`), type: 'jpeg', quality: 80, fullPage: true});
writeFileSync(join(uscita, `${nome}-${w}x${h}.json`), JSON.stringify({pagina: url, punto: [px, py], fotogrammi: fot, video: vf, misurato: new Date().toISOString()}, null, 1));
await b.close();
console.log(`GESTO ${nome} ${w}×${h}: ${fot.length} fotogrammi · video ${vf}`);
