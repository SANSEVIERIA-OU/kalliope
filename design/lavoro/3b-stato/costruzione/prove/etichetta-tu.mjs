// M11 · L'etichetta di «Tu» nel primo schermo: una riga, con i caratteri del sito e senza (se non si caricano). Per ogni misura e motore: righe dell'etichetta
// (nodi di testo), classe «nome-corto», se tocca le barre della voce. Uso: node etichetta-tu.mjs <cartella-sito> <motore> <WxH[,WxH…]> [percorso=it/stato/]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, misure, percorso = 'it/stato/'] = process.argv.slice(2);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let male = 0;
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  for (const senza of [false, true]) {
    const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...tocco(motore, W <= 760)});
    if (senza) await ctx.route(/\.(woff2?|ttf|otf)(\?|$)/, r => r.abort());
    const errori = []; const p = pagina(await ctx.newPage(), errori);
    await p.goto(`${base}${percorso}`, {waitUntil: 'load'}); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const n = document.querySelector('.riquadro.tu .nome'), r = n.closest('.riquadro'), barre = r.querySelector('.barre');
      const corpo = parseFloat(getComputedStyle(n).fontSize), linee = new Set();
      for (const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); w.nextNode();) { if (!w.currentNode.textContent.trim()) continue; const q = document.createRange(); q.selectNodeContents(w.currentNode); for (const x of q.getClientRects()) if (x.width > 1) linee.add(Math.round(x.top / (corpo * 0.6))); }
      const rn = n.getBoundingClientRect(), rb = barre.getBoundingClientRect();
      const lungo = n.querySelector('.nome-lungo');
      return {righe: linee.size, corto: r.classList.contains('nome-corto'), lungoVisibile: !!lungo && getComputedStyle(lungo).display !== 'none', testo: n.textContent.trim(), larghezza: Math.round(rn.width), altezza: Math.round(rn.height),
        tocca: !(rn.right < rb.left || rn.left > rb.right || rn.bottom < rb.top || rn.top > rb.bottom), carattere: getComputedStyle(n).fontFamily.slice(0, 40), caricati: document.fonts ? [...document.fonts].filter(f => f.status === 'loaded').length : -1};
    });
    const ok = r.righe === 1; if (!ok) male++;
    console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${m} ${senza ? 'SENZA caratteri' : 'con i caratteri '} · ${r.righe} riga/e, ${r.corto ? 'corto' : 'lungo'} (${r.testo.slice(0, 40)}), ${r.larghezza}×${r.altezza}, tocca le barre: ${r.tocca}, font caricati: ${r.caricati}`);
    await ctx.close();
  }
}
await b.close(); server.close(); process.exit(male ? 1 : 0);
