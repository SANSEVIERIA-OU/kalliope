// Prova del movimento del segno nella barra (incarico L-3): i difetti noti del giudizio, come controlli che falliscono sulla copia di prima.
//   1. all'arrivo il segno non è mai una bolla vuota: il fronte non va mai sotto il riposo (translate 0), dal primo istante;
//   2. a fine frase torna a riposo: non resta tutta piena per secondi (al massimo SOSTA_MAX di fila) e dopo l'ultima sosta è a riposo entro RITORNO_MAX;
//   3. a riposo alla fine.
// Uso: node movimento.mjs <indirizzo della home> [secondi=22] [larghezza=1440] [altezza=900]    (esce 1 se un controllo non torna)
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [url, sec = '22', w = '1440', h = '900'] = process.argv.slice(2);
const SOSTA_MAX = 1.5, RITORNO_MAX = 1.5, PIENO = 60;
const b = await chromium.launch({headless: true});
const p = await b.newPage({viewport: {width: +w, height: +h}});
await p.addInitScript(() => {
  window.__pos = [];
  const campiona = () => { const f = document.querySelector('.barra .m-fronte'); const m = f && /translate\(([-\d.]+)/.exec(f.getAttribute('transform') || ''); window.__pos.push([performance.now() / 1000, f ? (m ? +m[1] : 0) : null]); };
  const avvia = () => { campiona(); setInterval(campiona, 40); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', avvia) : avvia();
});
await p.goto(url, {waitUntil: 'load'});
await p.waitForTimeout(+sec * 1000);
const pos = (await p.evaluate(() => window.__pos)).filter(([, x]) => x !== null);
await b.close();
const errori = [];
if (!pos.length) errori.push('il segno della barra non c\'è');
const minimo = Math.min(...pos.map(x => x[1])), massimo = Math.max(...pos.map(x => x[1]));
if (minimo < -0.01) errori.push(`il fronte va a ${minimo.toFixed(1)}: sotto il riposo, la bolla si svuota (all'arrivo non deve mai essere vuota)`);
if (pos[0][1] !== 0) errori.push(`al primo istante il fronte è a ${pos[0][1]}, non a riposo`);
// le soste: i tratti di fila con il segno tutto pieno
let sosta = 0, inizio = null, ultimaFine = null;
for (const [t, x] of pos) {
  if (x >= PIENO) { if (inizio === null) inizio = t; sosta = Math.max(sosta, t - inizio); ultimaFine = t; } else inizio = null;
}
if (massimo >= PIENO && sosta > SOSTA_MAX) errori.push(`tutta piena per ${sosta.toFixed(2)} s di fila (al massimo ${SOSTA_MAX}): una bolla piena qualunque`);
if (massimo >= PIENO) {
  const riposo = pos.find(([t, x]) => t > ultimaFine && x < 0.5);
  if (!riposo) errori.push('dopo essere stato pieno non torna a riposo');
  else if (riposo[0] - ultimaFine > RITORNO_MAX) errori.push(`dopo la sosta ci mette ${(riposo[0] - ultimaFine).toFixed(2)} s a tornare a riposo (al massimo ${RITORNO_MAX})`);
} else errori.push(`in ${sec} s il segno non si è mai riempito (massimo ${massimo}): la voce non lo muove`);
if (pos[pos.length - 1][1] > 0.5) errori.push(`alla fine è a ${pos[pos.length - 1][1].toFixed(1)}, non a riposo`);
console.log(`${url} · ${pos.length} campioni · fronte da ${minimo.toFixed(1)} a ${massimo.toFixed(1)} · la sosta piena più lunga ${sosta.toFixed(2)} s`);
if (errori.length) { console.log('NON TORNA:\n  ' + errori.join('\n  ')); process.exit(1); }
console.log('torna: mai vuoto, a riposo dall\'inizio, a fine frase torna a riposo');
