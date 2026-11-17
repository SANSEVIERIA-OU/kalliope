// «non ancora» al telefono sotto il primo schermo: la didascalia su due righe (M3) sposta tutto di 17 px; guardato lo spostamento, il resto è uguale?
// Foto della stessa schermata (le sezioni della pagina, scorse alla loro posizione + lo spostamento) nel sito di prima e in quello di adesso, con «riduci movimento»,
// e quota di pixel diversi (scarto sopra 8 su 255). Uso: node confronta17.mjs <prima> <adesso> <uscita> <WxH> <sposta>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [prima, adesso, uscita, misura, sposta = '17'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number); mkdirSync(uscita, {recursive: true});
const b = await avvia('chromium');
async function foto(cartella, sezioni, extra) {
  const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...tocco('chromium', W <= 760)}); const p = pagina(await ctx.newPage(), []);
  await p.goto(base + 'it/non-ancora/', {waitUntil: 'load'}); await p.waitForTimeout(2500);
  const out = [];
  for (const s of sezioni) { const y = await p.evaluate(sel => Math.round(document.querySelector(sel).getBoundingClientRect().top + scrollY), s); await p.evaluate(v => scrollTo({top: v, behavior: 'instant'}), y + extra); await p.waitForTimeout(1200); await assesta(p); out.push(await p.screenshot()); }
  await ctx.close(); server.close(); return out;
}
const sezioni = ['#perche', '#quando', '#ascolta'];
const A = await foto(prima, sezioni, 0), B = await foto(adesso, sezioni, +sposta);
const ctx = await b.newContext({viewport: {width: W, height: H}}); const p = await ctx.newPage(); await p.goto('about:blank');
for (let i = 0; i < sezioni.length; i++) {
  const r = await p.evaluate(async ([a, c]) => { const carica = async x => { const im = new Image(); im.src = 'data:image/png;base64,' + x; await im.decode(); const k = document.createElement('canvas'); k.width = im.width; k.height = im.height; const g = k.getContext('2d', {willReadFrequently: true}); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height).data; };
    const da = await carica(a), db = await carica(c); let n = 0, t = da.length / 4; for (let j = 0; j < da.length; j += 4) if (Math.abs(da[j] - db[j]) > 8 || Math.abs(da[j + 1] - db[j + 1]) > 8 || Math.abs(da[j + 2] - db[j + 2]) > 8) n++; return {diversi: n, totale: t}; }, [A[i].toString('base64'), B[i].toString('base64')]);
  console.log(`${misura} ${sezioni[i]}: ${r.diversi} pixel diversi su ${r.totale} (${(100 * r.diversi / r.totale).toFixed(3)}%)`);
}
await b.close();
