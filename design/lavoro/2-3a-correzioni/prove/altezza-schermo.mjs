// Punto 7 · l'altezza dello schermo che si vede (--altezza-schermo): con svh dove il browser lo conosce, con vh come ripiego; le misure della riunione che la usano non diventano
// «non valide» (un'unità sconosciuta in un token le farebbe cadere su «auto»). Si guardano: il valore del token, e l'altezza (px) della riunione della chiusura di «non ancora»,
// della riunione della home, della fila della pagina della scelta e la sua altezza minima, a più misure, nel sito vero (svh), in una copia con il ripiego (vh: il blocco @supports
// tolto, come in un browser senza svh) e in una copia rotta apposta (un'unità che non esiste: la prova deve vederlo). Dove svh e vh coincidono (ogni simulazione senza la barra del
// browser che si ritrae) le due copie devono dare gli stessi numeri; la differenza su un telefono vero non si vede qui.
// Uso: node altezza-schermo.mjs <sito svh> <sito vh> <sito rotto> <motore> <WxH[,WxH…]>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [svh, vh, rotto, motore, misure] = process.argv.slice(2);
const b = await avvia(motore);
const leggi = async (cartella, W, H) => {
  const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
  const ctx = await b.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 1, reducedMotion: 'reduce', ...tocco(motore, W <= 760)}); const p = pagina(await ctx.newPage(), []);
  const out = {};
  const sonda = () => { const e = document.createElement('div'); e.style.cssText = 'position:absolute;visibility:hidden;height:var(--altezza-schermo)'; document.body.append(e); const h = Math.round(e.getBoundingClientRect().height * 10) / 10; e.remove(); return {token: getComputedStyle(document.documentElement).getPropertyValue('--altezza-schermo').trim(), sonda: h, ih: innerHeight, svh: CSS.supports('height', '100svh')}; };
  await p.goto(base + 'it/non-ancora/', {waitUntil: 'load'}); await p.waitForTimeout(1200); await assesta(p);
  Object.assign(out, await p.evaluate(sonda));
  out.chiusura = await p.evaluate(() => Math.round(document.querySelector('.chiusura .tavolo-cornice').getBoundingClientRect().height * 10) / 10);
  await p.goto(base + 'it/', {waitUntil: 'load'}); await p.waitForTimeout(1200); await assesta(p);
  out.chiamata = await p.evaluate(() => Math.round(document.querySelector('.chiamata').getBoundingClientRect().height * 10) / 10);
  await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(1200); await assesta(p);
  out.scelta = await p.evaluate(() => ({fila: Math.round(document.querySelector('.scelta-tavolo .tavolo-cornice').getBoundingClientRect().height * 10) / 10, minima: Math.round(document.querySelector('.scelta-lingua').getBoundingClientRect().height * 10) / 10}));
  await ctx.close(); server.close(); return out;
};
let male = 0;
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const a = await leggi(svh, W, H), c = await leggi(vh, W, H), r = await leggi(rotto, W, H);
  const uguali = JSON.stringify([a.chiusura, a.chiamata, a.scelta]) === JSON.stringify([c.chiusura, c.chiamata, c.scelta]);
  const valido = a.sonda === a.ih && c.sonda === c.ih;
  const rottoVisto = r.sonda !== r.ih;   // la copia rotta deve dare un'altezza che non è quella dello schermo
  const ok = uguali && valido && rottoVisto && (!a.svh || /svh/.test(a.token)) && /vh/.test(c.token) && !/svh/.test(c.token);
  if (!ok) male++;
  console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${m}: svh ${a.svh ? 'conosciuto' : 'NON conosciuto'}; token «${a.token}» → ${a.sonda} px (innerHeight ${a.ih}); ripiego «${c.token}» → ${c.sonda} px; riunione di «non ancora» ${a.chiusura} / ${c.chiusura}, della home ${a.chiamata} / ${c.chiamata}, fila della scelta ${a.scelta.fila} / ${c.scelta.fila}, scelta intera ${a.scelta.minima} / ${c.scelta.minima}; copia rotta: ${r.sonda} px (${rottoVisto ? 'la prova la vede' : 'LA PROVA NON LA VEDE'})`);
}
await b.close(); process.exit(male ? 1 : 0);
