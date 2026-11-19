// Fotogrammi ravvicinati della barra (marchio + nome) dall'arrivo: node barra-da-vicino.mjs <url> <cartella> <w> <h> <clip x,y,w,h> <secondi> <passo ms> [ridotto] [punta:x,y@s]
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = (await import(process.env.PLAYWRIGHT)).default;
const [url, out, w, h, clip, sec, passo, ridotto, punta] = process.argv.slice(2);
const [cx, cy, cw, ch] = clip.split(',').map(Number);
mkdirSync(out, {recursive: true});
const b = await pw.chromium.launch({headless: true});
const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: 3, reducedMotion: ridotto === 'ridotto' ? 'reduce' : 'no-preference'});
const errori = []; p.on('pageerror', e => errori.push(String(e)));
await p.goto(url, {waitUntil: 'commit'});
const t0 = Date.now(); const log = [];
let i = 0, puntato = false;
const [pxy, ps] = (punta || '').split('@');
while (Date.now() - t0 < +sec * 1000) {
  const t = (Date.now() - t0) / 1000;
  if (pxy && !puntato && t >= +ps) { const [x, y] = pxy.split(',').map(Number); await p.mouse.move(x, y); puntato = true; log.push(`punta a ${t.toFixed(2)} s`); }
  const f = `${out}/f${String(i).padStart(3, '0')}.png`;
  try { await p.screenshot({path: f, clip: {x: cx, y: cy, width: cw, height: ch}}); log.push(`${f.split('/').pop()} ${t.toFixed(2)}`); i++; } catch (e) {}
  const resto = +passo - ((Date.now() - t0) % +passo); await p.waitForTimeout(resto);
}
writeFileSync(`${out}/tempi.txt`, log.join('\n') + '\n' + (errori.length ? 'ERRORI ' + errori.join(' | ') : 'nessun errore') + '\n');
console.log(out, i, 'fotogrammi', errori.length ? 'ERRORI' : 'nessun errore');
await b.close();
