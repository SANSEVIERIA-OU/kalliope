// L3 · la pagina della scelta della lingua: (1) il nome «Kalliope» a riposo ha il colore del testo, non un rosa spento (la luce dipinta sopra di lui); (2) la barra si comporta come
// quella delle altre pagine: a riposo non ha fondo (il pixel della barra è quello della pagina, non una fascia scura), scorrendo (dove la pagina scorre) si riempie. Dove il
// browser non lega le animazioni allo scorrimento (animation-timeline) resta piena come senza script: il ripiego, dichiarato.
// Uso: node scelta-barra.mjs <cartella-sito> <motore> <WxH[,WxH…]>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, misure, ...opz] = process.argv.slice(2);
const senzaJs = opz.includes('--senzajs');   // senza JavaScript la barra segue solo il foglio di stile: dove c'è animation-timeline si riempie scorrendo, altrove resta piena
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let male = 0;
// i pixel: letti dalla foto nella pagina stessa (nessuna libreria)
const pixel = async (p, png, punti) => p.evaluate(async ([png, punti]) => { const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode(); const k = document.createElement('canvas'); k.width = im.width; k.height = im.height; const g = k.getContext('2d', {willReadFrequently: true}); g.drawImage(im, 0, 0); return punti.map(([x, y]) => [...g.getImageData(x, y, 1, 1).data].slice(0, 3)); }, [png.toString('base64'), punti]);
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, locale: 'en-GB', deviceScaleFactor: 1, javaScriptEnabled: !senzaJs, ...tocco(motore, W <= 760)}); const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(3600); await assesta(p);
  const info = await p.evaluate(() => { const h = document.querySelector('.scelta-titolo').getBoundingClientRect(), bar = document.querySelector('.barra').getBoundingClientRect(); return {titolo: [h.left, h.top, h.right, h.bottom].map(Math.round), barra: Math.round(bar.bottom), scorre: document.documentElement.scrollHeight - innerHeight, timeline: CSS.supports('animation-timeline', 'scroll()')}; });
  const foto = await p.screenshot({scale: 'css'});
  // (1) il pixel più chiaro del titolo: il colore del testo è 255 237 239
  const cima = await p.evaluate(async ([png, t]) => { const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode(); const k = document.createElement('canvas'); k.width = im.width; k.height = im.height; const g = k.getContext('2d', {willReadFrequently: true}); g.drawImage(im, 0, 0); const d = g.getImageData(t[0], t[1], t[2] - t[0], t[3] - t[1]).data; let best = [0, 0, 0], s = -1; for (let i = 0; i < d.length; i += 4) { const v = d[i] + d[i + 1] + d[i + 2]; if (v > s) { s = v; best = [d[i], d[i + 1], d[i + 2]]; } } return best; }, [foto.toString('base64'), info.titolo]);
  const titoloOk = Math.abs(cima[0] - 255) <= 6 && Math.abs(cima[1] - 237) <= 8 && Math.abs(cima[2] - 239) <= 8;
  // (2) la barra a riposo: il suo pixel (a metà barra, lontano dal marchio) contro quello della pagina subito sotto
  const x = Math.round(W * 0.8), yBarra = Math.round(info.barra / 2), ySotto = info.barra + 3;
  const [inBarra, sotto] = await pixel(p, foto, [[x, yBarra], [x, ySotto]]);
  const diff = Math.max(...inBarra.map((v, i) => Math.abs(v - sotto[i])));
  const trasparente = diff <= 12;
  let scorso = null;
  if (info.scorre > 0) { await p.evaluate(() => scrollTo(0, 120)); await p.waitForTimeout(800); const f2 = await p.screenshot({scale: 'css'}); [scorso] = await pixel(p, f2, [[x, yBarra]]); }
  const pieno = scorso ? Math.max(...scorso.map((v, i) => Math.abs(v - [46, 0, 16][i]))) <= 6 : null;
  // con JavaScript (la riga in lingue.html): trasparente a riposo e piena scorrendo in ogni motore; senza JavaScript: come il foglio di stile, e dove manca animation-timeline piena (il ripiego)
  const atteso = !senzaJs ? (trasparente && (pieno === null || pieno)) : info.timeline ? (trasparente && (pieno === null || pieno)) : !trasparente;
  const ok = titoloOk && atteso; if (!ok) male++;
  console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${m}: titolo ${cima.join(' ')} (${titoloOk ? 'colore del testo' : 'SPENTO'}) · barra a riposo ${inBarra.join(' ')} contro pagina ${sotto.join(' ')} (${trasparente ? 'senza fondo' : 'FASCIA PIENA'}) · scorrendo ${scorso ? scorso.join(' ') + (pieno ? ' piena' : ' NON piena') : 'la pagina non scorre'} · ${senzaJs ? 'SENZA JavaScript · ' : ''}animation-timeline ${info.timeline ? 'sì' : 'no' + (senzaJs ? ' (ripiego: piena)' : '')} · errori ${errori.length}`);
  await ctx.close();
}
await b.close(); server.close(); process.exit(male ? 1 : 0);
