// N1 · gli schermi bassi mentre la voce suona e con il messaggio d'errore: dove stanno la bolla, la riunione, il comando e il messaggio nello schermo, con la foto.
// Uso: PLAYWRIGHT=… node bassi.mjs <cartella-sito> <uscita> <motore> <WxH[,WxH…]> <stato> [--percorso=it/non-ancora/] [--da=chiusura|fondo]
// Stati: riposo (la chiusura com'è appena si arriva), suona (premuto «Ascolta», dopo 1,6 s), errore (il suono che non parte, dopo 1,5 s)
// Esito: una riga JSON per misura con le posizioni; «insieme» è vero se, nello schermo e sotto la barra (8 px di margine), stanno insieme la bolla e il comando
// (stato suona) o la bolla, il comando e il messaggio (stato errore).
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misure, stato, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const da = opz.find(o => o.startsWith('--da='))?.split('=')[1] || 'chiusura';
const senzaFoto = opz.includes('--senza-foto');
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const righe = [];
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: opz.includes('--ridotto') ? 'reduce' : 'no-preference', ...tocco(motore, W <= 760)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  const ritardo = +(opz.find(o => o.startsWith('--ritardo='))?.split('=')[1] || 0);   // quanto tarda l'errore ad arrivare (ms): arriva mentre lo scorrimento del gesto è in corso, o dopo
  if (stato === 'errore') await p.route(/\/voce\/giulia-1\.(mp3|opus)$/, async r => { if (ritardo) await new Promise(x => setTimeout(x, ritardo)); await r.fulfill({status: 200, contentType: 'audio/mpeg', body: 'questo non è un suono'}); });
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(600); await assesta(p);
  if (da === 'fondo') await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); else await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView({block: 'start'}));
  await p.waitForTimeout(1800); await assesta(p);
  if (stato !== 'riposo') { await p.click('.ascolta-ferma'); await p.waitForTimeout((stato === 'errore' ? 1700 : 1900) + ritardo); await assesta(p); }
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s), rc = e => { if (!e) return null; const r = e.getBoundingClientRect(); return {top: Math.round(r.top * 10) / 10, bottom: Math.round(r.bottom * 10) / 10}; };
    const barra = q('.barra').getBoundingClientRect().bottom;
    return {altezza: innerHeight, barra: Math.round(barra), y: Math.round(scrollY), bolla: rc(q('.bolla-chiusa')), cornice: rc(q('.tavolo-cornice')), comando: rc(q('.ascolta-ferma')), nota: rc(q('.errore-ascolto')),
      altezzaCornice: Math.round(q('.tavolo-cornice').getBoundingClientRect().height), etichetta: [...document.querySelectorAll('.ascolta-ferma .etichette > span')].find(s => getComputedStyle(s).visibility === 'visible')?.textContent.trim()};
  });
  const alto = r.barra + 8, basso = r.altezza - 8, fondo = stato === 'errore' && r.nota ? r.nota.bottom : r.comando.bottom;
  const insieme = r.bolla.top >= alto - 1 && fondo <= basso + 1 && r.comando.bottom <= basso + 1;
  const notaInVista = stato !== 'errore' || (!!r.nota && r.nota.top >= r.barra - 1 && r.nota.bottom <= basso + 1);   // il messaggio d'errore sta intero nello schermo, sotto la barra
  const riga = {misura: m, stato, da, ...r, richiesto: Math.round((fondo - r.bolla.top) * 10) / 10, disponibile: basso - alto, insieme, notaInVista};
  righe.push(riga); console.log(JSON.stringify(riga));
  if (!senzaFoto) await p.screenshot({path: `${uscita}/${stato}-${m}.png`});
  await ctx.close();
}
writeFileSync(`${uscita}/bassi-${stato}-${motore}-${da}.json`, JSON.stringify(righe, null, 1));
await b.close(); server.close();
// esito: mentre suona la bolla e il comando stanno insieme; con l'errore il messaggio sta sempre intero nello schermo (e la bolla con lui dove l'altezza lo consente)
const male = righe.filter(r => r.stato === 'errore' ? !r.notaInVista : !r.insieme);
console.log(male.length ? `NO   ${male.length} misure: ${male.map(r => r.misura).join(', ')}` : `ok   ${righe.length} misure, stato ${stato}`);
process.exit(male.length ? 1 : 0);
