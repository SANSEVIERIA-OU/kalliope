// Il primo schermo: dove stanno il comando principale, lo stato e la didascalia (M3), con la foto.
// Uso: PLAYWRIGHT=… node primo.mjs <cartella-sito> <uscita> <motore> <WxH[,WxH…]> [--percorso=it/non-ancora/] [--attendi=ms]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misure, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const attendi = +(opz.find(o => o.startsWith('--attendi='))?.split('=')[1] || 4800);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const righe = [];
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(attendi); await assesta(p);
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s), rc = e => { if (!e) return null; const r = e.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width)}; };
    const dida = q('.scena-pagina .didascalia'), righeDida = dida ? Math.round(dida.getBoundingClientRect().height / parseFloat(getComputedStyle(dida).lineHeight)) : 0;
    return {altezza: innerHeight, didascalia: rc(dida), righeDidascalia: righeDida, testoDidascalia: dida && dida.innerText.trim().replace(/\s+/g, ' '), comando: rc(q('#comandi-apertura .pillola')), stato: rc(q('.scena-pagina .stato')), palco: rc(q('.scena-pagina .palco'))};
  });
  const frase = /non compare fra i microfoni/.test(r.testoDidascalia || '');   // M3: la frase che dice che cos'è la scena si legge, anche al telefono
  const riga = {misura: m, ...r, comandoNelloSchermo: r.comando.bottom <= r.altezza, statoNelloSchermo: r.stato.bottom <= r.altezza, fraseDellaScena: frase, errori: errori.length};
  righe.push(riga); console.log(JSON.stringify(riga));
  await p.screenshot({path: `${uscita}/primo-${m}.png`}); await ctx.close();
}
writeFileSync(`${uscita}/primo-${motore}.json`, JSON.stringify(righe, null, 1));
await b.close(); server.close();
const male = righe.filter(r => !r.fraseDellaScena || !r.comandoNelloSchermo);
console.log(male.length ? `NO   ${male.length} misure senza la frase della scena o con il comando fuori dallo schermo: ${male.map(r => r.misura).join(', ')}` : `ok   ${righe.length} misure: la frase della scena si legge e il comando principale è nello schermo`);
process.exit(male.length ? 1 : 0);
