// N5 e N3 · l'elenco delle versioni di «non ancora», visto come lo vede una persona.
//  N5: premuto «Copia l'indirizzo» il posto tratteggiato si accende (il bordo passa dal tratteggio alla voce e torna), nella pagina viva.
//  N3: mentre l'elenco si apre, in nessun istante il tratteggio del posto si vede dentro la riga della versione (si fermano le animazioni a ogni istante
//      da 0 a 2,6 s e si guardano i pixel dentro la riga, con il suo testo reso trasparente: dev'esserci solo il suo fondo).
// Uso: PLAYWRIGHT=… node versioni.mjs <cartella-sito> <uscita> <motore> <WxH> [--percorso=it/non-ancora/]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misura, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const esiti = [];
const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
const apri = async (extra = {}) => {
  const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760), ...extra});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(800); await assesta(p);
  return {ctx, p, errori};
};
// la luminosità massima dei pixel di una striscia di una foto (si legge con un canvas nella pagina)
const luce = (p, png, ritaglio) => p.evaluate(async ([b64, r]) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(img, 0, 0);
  const k = img.width / innerWidth, d = x.getImageData(Math.round(r.x * k), Math.round(r.y * k), Math.max(1, Math.round(r.w * k)), Math.max(1, Math.round(r.h * k))).data;
  let max = 0, somma = 0, n = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; if (l > max) max = l; somma += l; n++; }
  return {max: Math.round(max), media: Math.round(somma / n * 10) / 10};
}, [png.toString('base64'), ritaglio]);

// ---------- N5: la copia accende il posto ----------
{
  const {ctx, p, errori} = await apri();
  await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); });
  await p.evaluate(() => document.querySelector('#quando').scrollIntoView({block: 'start'})); await p.waitForTimeout(3600); await assesta(p);
  const posto = () => p.evaluate(() => { const e = document.querySelector('.versione.prossima'), s = getComputedStyle(e, '::before'), r = e.getBoundingClientRect(); return {nome: s.animationName, colore: s.borderTopColor, opacita: s.opacity, x: r.left, y: r.top, w: r.width, h: r.height}; });
  const prima = await posto();
  const striscia = r => ({x: r.x + 24, y: r.y - 1, w: r.w - 48, h: 4});   // il bordo di sopra, dentro le due curve
  const fotoPrima = await p.screenshot(); const lPrima = await luce(p, fotoPrima, striscia(prima));
  await p.locator('.copia-indirizzo').click();
  // la risposta del posto si ferma a ogni istante (da 0 a 900 ms): il bordo dev'essere quello del tratteggio, della voce al picco (30%) e di nuovo del tratteggio
  const risposte = await p.evaluate(() => { const a = document.getAnimations().filter(x => x.animationName === 'ricorda'); a.forEach(x => x.pause()); return a.length; });
  const serie = [];
  for (const t of [0, 135, 270, 450, 899]) {
    await p.evaluate(t0 => document.getAnimations().filter(x => x.animationName === 'ricorda').forEach(x => { x.currentTime = t0; }), t);
    const s = await posto(); const f = await p.screenshot(); s.luce = (await luce(p, f, striscia(s))).max; s.t = t; serie.push(s);
    if (t === 270) writeFileSync(`${uscita}/copia-posto-${motore}-${misura}.png`, await p.screenshot({clip: {x: Math.max(0, prima.x - 30), y: Math.max(0, prima.y - 40), width: Math.min(W, prima.w + 60), height: 150}}));
  }
  console.log('   serie', JSON.stringify(serie.map(s => ({t: s.t, nome: s.nome, colore: s.colore, luce: s.luce}))), 'prima', JSON.stringify({nome: prima.nome, colore: prima.colore, luce: lPrima.max}), 'animazioni «ricorda»', risposte);
  await p.evaluate(() => document.getAnimations().filter(x => x.animationName === 'ricorda').forEach(x => x.play()));
  await p.waitForTimeout(1200); const dopo = await posto();
  ok('N5 · dopo «Copia» il posto tratteggiato parte con la sua risposta («ricorda»)', risposte === 1 && serie.every(s => s.nome === 'ricorda'), `${risposte} animazioni · ${serie.map(s => s.nome).join(' · ')}`);
  ok('N5 · il bordo del posto si accende (colore della voce, e più luminoso dei pixel di prima)', serie.some(s => s.t === 270 && /rgb\(255, 219, 225\)/.test(s.colore) && s.luce > lPrima.max + 25), `luce di prima ${lPrima.max}, massima dopo ${Math.max(...serie.map(s => s.luce))}, al picco ${serie.find(s => s.t === 270)?.colore}`);
  const attive = await p.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && /ricorda|posto-si-apre/.test(a.animationName || '')).length);
  ok('N5 · poi torna com\'era (tratteggio quieto, aperto, nessuna animazione in corso)', dopo.colore === prima.colore && dopo.opacita === prima.opacita && attive === 0, `${dopo.colore} opacità ${dopo.opacita} / prima ${prima.colore} ${prima.opacita}, animazioni in corso ${attive}`);
  ok('console pulita', errori.length === 0, errori.join(' | '));
  await ctx.close();
}
// ---------- N3: nessun istante con il tratteggio dentro la riga della versione ----------
{
  const {ctx, p, errori} = await apri();
  await p.evaluate(() => { const s = document.createElement('style'); s.textContent = '.versione.ultima > * { color: transparent !important; text-decoration-color: transparent !important; }'; document.head.append(s); });
  await p.evaluate(() => document.querySelector('#quando').scrollIntoView({block: 'start'})); await p.waitForTimeout(250);
  // l'elenco è già «visto» (arrivato nello schermo): si ferma ogni animazione e si porta a ogni istante
  const anim = await p.evaluate(() => { const v = document.querySelector('.versioni'); v.classList.remove('visto'); void v.offsetWidth; v.classList.add('visto'); return v.getAnimations({subtree: true}).length; });
  await p.evaluate(() => { document.querySelectorAll('.versioni').forEach(v => v.getAnimations({subtree: true}).forEach(a => a.pause())); });
  const istanti = []; for (let t = 0; t <= 2700; t += 25) istanti.push(t);
  const visti = []; let primo = null;
  for (const t of istanti) {
    await p.evaluate(t0 => document.querySelectorAll('.versioni').forEach(v => v.getAnimations({subtree: true}).forEach(a => { a.currentTime = t0; })), t);
    const m = await p.evaluate(() => { const u = document.querySelector('.versione.ultima'), pr = document.querySelector('.versione.prossima'), r = u.getBoundingClientRect(), pb = getComputedStyle(pr, '::before'); return {x: r.left, y: r.top, w: r.width, h: r.height, op: +getComputedStyle(u).opacity, tratteggio: +pb.opacity}; });
    if (m.op < 0.5 || m.tratteggio < 0.02) { visti.push({t, ...m, max: 0, saltato: true}); continue; }
    const f = await p.screenshot(); const l = await luce(p, f, {x: m.x + 10, y: m.y + 8, w: m.w - 20, h: m.h - 16});
    visti.push({t, ...m, max: l.max});
  }
  const fondo = Math.min(...visti.filter(v => !v.saltato).map(v => v.max));
  const peggiore = visti.filter(v => !v.saltato).sort((a, b) => b.max - a.max)[0];
  const sopra = visti.filter(v => !v.saltato && v.max > fondo + 12);
  console.log(`   istanti guardati ${visti.filter(v => !v.saltato).length} su ${visti.length} (gli altri: la riga non c'è ancora o il tratteggio non c'è ancora) · fondo della riga ${fondo} · il più luminoso ${peggiore ? peggiore.max + ' a ' + peggiore.t + ' ms' : '—'}`);
  ok('N3 · in nessun istante il tratteggio si vede dentro la riga della versione', sopra.length === 0 && visti.some(v => !v.saltato), sopra.length ? `${sopra.length} istanti, da ${sopra[0].t} a ${sopra.at(-1).t} ms (luce ${sopra.map(s => s.max).join(',')})` : `${visti.filter(v => !v.saltato).length} istanti puliti`);
  if (sopra.length) { await p.evaluate(t0 => document.querySelectorAll('.versioni').forEach(v => v.getAnimations({subtree: true}).forEach(a => { a.currentTime = t0; })), sopra[0].t); await p.evaluate(() => document.querySelectorAll('.versione.ultima > *').forEach(e => { e.style.setProperty('color', '', 'important'); })); }
  // la foto dell'istante peggiore, con il testo vero
  await p.evaluate(() => document.querySelector('style:last-of-type').remove());
  for (const tf of [1750, 1875, 2000]) {   // gli stessi istanti prima e dopo: la foto dell'elenco con il testo vero
    await p.evaluate(t0 => document.querySelectorAll('.versioni').forEach(v => v.getAnimations({subtree: true}).forEach(a => { a.currentTime = t0; })), tf);
    const bx = await p.evaluate(() => { const r = document.querySelector('.versioni').getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: Math.min(r.height, 300)}; });
    await p.screenshot({path: `${uscita}/versioni-${tf}ms-${motore}-${misura}.png`, clip: {x: Math.max(0, bx.x - 12), y: Math.max(0, bx.y - 12), width: Math.min(W, bx.w + 24), height: bx.h + 24}});
  }
  ok('console pulita', errori.length === 0, errori.join(' | '));
  await ctx.close();
}
await b.close(); server.close();
writeFileSync(`${uscita}/versioni-${motore}-${misura}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
