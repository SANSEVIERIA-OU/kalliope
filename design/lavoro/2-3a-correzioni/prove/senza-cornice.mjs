// Punto 9 · se website/cornice.js non si carica (rete, 404, estensione che lo blocca, un errore nello script), la pagina si legge lo stesso: ciò che sparisce deve essere
// ciò che sparisce senza JavaScript (la costruzione di riferimento), niente di più. Si confrontano gli elementi con testo (o un'immagine) invisibili per opacità, visibilità
// o dimensione zero, in tre pagine: (a) senza JavaScript (il riferimento), (b) con cornice.js bloccato, (c) normale (a pagina intera scorsa: tutto deve poter comparire).
// Esito NO se (b) nasconde qualcosa che (a) mostra. La rete di sicurezza ha 4 s: si aspettano 5,5 s.
// Uso: node senza-cornice.mjs <cartella-sito> <motore> <percorso[,percorso…]> [WxH]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, percorsi, misura = '1440x900'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const invisibili = () => {
  const out = [];
  const nascosto = el => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none') return null; if (s.visibility === 'hidden' || Number(s.opacity) < 0.05) return true; } return false; };
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('script, style, noscript, [hidden], [inert], .solo-lettori, canvas, audio, .etichette, .vuoto')) continue;   // .etichette e .vuoto: le riserve (le etichette del pulsante: una sola si vede, le altre danno la larghezza; la risposta di «Copia» che non c'è: dà il posto a quella che compare)
    const proprio = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
    if (!proprio && !/^(img|svg)$/i.test(el.tagName)) continue;
    if (el.closest('svg') && !/^svg$/i.test(el.tagName)) continue;
    const n = nascosto(el); if (n === true) out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} «${(proprio || '').replace(/\s+/g, ' ').slice(0, 40)}»`);
  }
  return out;
};
let male = 0;
for (const perc of percorsi.split(',')) {
  const aprire = async (js, blocca) => {
    const ctx = await b.newContext({viewport: {width: W, height: H}, javaScriptEnabled: js, ...tocco(motore, W <= 760)});
    const errori = []; const p = pagina(await ctx.newPage(), errori);
    if (blocca) await p.route(/\/cornice\.js(\?.*)?$/, r => r.abort());
    await p.goto(base + perc, {waitUntil: 'load'}); await p.waitForTimeout(5500);
    const classeJs = await p.evaluate(() => document.documentElement.classList.contains('js'));
    const lista = await p.evaluate(invisibili); await ctx.close(); return {lista, classeJs, errori};
  };
  const a = await aprire(false, false), c = await aprire(true, true);
  const inPiu = c.lista.filter(x => !a.lista.includes(x));
  const ok = inPiu.length === 0; if (!ok) male++;
  console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${perc} ${misura}: senza JavaScript ${a.lista.length} invisibili; con cornice.js bloccato ${c.lista.length} (classe js ${c.classeJs ? 'RESTA' : 'tolta'})${ok ? '' : ` → in più: ${inPiu.slice(0, 8).join(' | ')}${inPiu.length > 8 ? ` … (+${inPiu.length - 8})` : ''}`}`);
}
await b.close(); server.close(); process.exit(male ? 1 : 0);
