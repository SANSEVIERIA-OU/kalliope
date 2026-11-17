// 8 · il fuoco sul piede: con Tab fino a «In riunione» e «Aiuto» (la seconda riga del piede) il comando deve stare nello schermo, in ogni motore.
// Uso: PLAYWRIGHT=… node piede-fuoco.mjs <cartella-sito> <motore> <WxH> [--percorso=it/non-ancora/] [--foto=cartella]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, motore, misura, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const foto = opz.find(o => o.startsWith('--foto='))?.split('=')[1];
const [W, H] = misura.split('x').map(Number);
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(1500); await assesta(p);
let esito = 0; const righe = [], viste = new Set();
const sosta = () => p.evaluate(() => {
  const e = document.activeElement; if (!e || e === document.body) return null;
  const r = e.getBoundingClientRect(), lin = document.querySelector('.piede .lingue');
  return {nome: (e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 28), bottom: Math.round(r.bottom * 10) / 10, top: Math.round(r.top * 10) / 10, vh: innerHeight, y: Math.round(scrollY), max: document.documentElement.scrollHeight - innerHeight,
    nelPiede: !!e.closest('.piede'), lingue: lin ? {top: Math.round(lin.getBoundingClientRect().top), h: Math.round(lin.getBoundingClientRect().height), cv: getComputedStyle(lin).contentVisibility} : null};
});
for (let k = 0; k < 90; k++) {
  await p.keyboard.press('Tab'); await p.waitForTimeout(260);
  const s = await sosta(); if (!s) continue;
  if (s.nelPiede) {
    if (viste.has(s.nome + s.top)) break;   // il giro è ricominciato
    viste.add(s.nome + s.top);
    const dentro = s.bottom <= s.vh + 0.5 && s.top >= -0.5;
    righe.push({...s, dentro});
    console.log(`${dentro ? 'ok  ' : 'NO  '} ${s.nome} · top ${s.top} bottom ${s.bottom} / ${s.vh} · scorrimento ${s.y}/${s.max} · lingue ${JSON.stringify(s.lingue)}`);
    if (foto) await p.screenshot({path: `${foto}/piede-${motore}-${misura}-${String(k).padStart(2, '0')}.png`});
    if (!dentro) esito = 1;
  }
}
console.log(righe.length ? `${righe.filter(r => r.dentro).length}/${righe.length} soste nel piede dentro lo schermo` : 'nessuna sosta nel piede');
if (!righe.length) esito = 1;
await b.close(); server.close(); process.exit(esito);
