// Le pillole (.pillola: l'azione della barra, «Ascolta», i comandi) in ogni lingua a ogni larghezza: il testo sta dentro il suo fondo, la pillola sta nello schermo e
// non esce di lato, il testo va a capo in righe pari quando non ci sta (a-capo, componenti.js) e non resta una pillola in una riga che ne taglia il testo.
// Uso: node pillole.mjs <sito> --lingue ar,ur,… --misure 320x900,… [--porta 8845] [--motore chromium] [--pagina ""]
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, pagina, tocco} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const server = await servi(process.argv[2], {porta: +arg('--porta', 8845), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const lingue = arg('--lingue', 'ar,ur,hi,bn,zh,el,de,fi,en-XA,ar-XB').split(','), misure = arg('--misure', '390x844,1440x900').split(',').map(m => m.split('x').map(Number)), motore = arg('--motore', 'chromium'), pg = arg('--pagina', '');
const b = await avvia(motore);
let pillole = 0, rotte = 0; const guai = [];
for (const [w, h] of misure) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, locale: 'it-IT', reducedMotion: 'reduce', ...(w < 500 ? tocco(motore, true) : {})});
  // controprova: DIFETTO_CSS='.pillola{max-width:90px;white-space:nowrap}' mette il difetto nelle pagine senza toccare i file, e la prova deve dire NO
  if (process.env.DIFETTO_CSS) await ctx.addInitScript(css => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); }), process.env.DIFETTO_CSS);
  for (const L of lingue) {
    const errori = []; const p = pagina(await ctx.newPage(), errori);
    await p.goto(`${base}${L}/${pg}`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    // le pillole che si vedono a riposo, e poi dopo aver scorso (la barra con l'azione) e con la scheda dell'ascolto aperta
    for (const fase of ['riposo', 'scorsa']) {
      if (fase === 'scorsa') { await p.evaluate(() => scrollTo(0, 1400)); await p.waitForTimeout(900); }
      const r = await p.evaluate(() => {
        const out = [];
        for (const q of document.querySelectorAll('.pillola')) {
          const cs = getComputedStyle(q), r = q.getBoundingClientRect();
          if (!r.width || cs.visibility === 'hidden' || +cs.opacity === 0 || q.closest('[hidden]')) continue;
          const testo = document.createRange(); testo.selectNodeContents(q); const t = testo.getBoundingClientRect();
          // le righe del testo (soltanto i nodi di testo: il tondo decorativo non è una riga)
          const fs = parseFloat(cs.fontSize) || 16, linee = new Set();
          for (const w = document.createTreeWalker(q, NodeFilter.SHOW_TEXT); w.nextNode();) { const n = w.currentNode; if (!n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const rc of rg.getClientRects()) if (rc.width > 1) linee.add(Math.round(rc.top / (fs * 0.6))); }
          const righe = linee.size;
          const pad = ['Left', 'Right', 'Top', 'Bottom'].map(l => parseFloat(cs['padding' + l]));
          out.push({testo: q.textContent.trim().slice(0, 28), l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), W: innerWidth,
            fuoriFondo: t.left < r.left - 0.5 || t.right > r.right + 0.5 || t.top < r.top - 0.5 || t.bottom > r.bottom + 0.5, righe, aCapo: q.classList.contains('a-capo'), taglia: q.scrollWidth > q.clientWidth + 1 || q.scrollHeight > q.clientHeight + 1, classe: q.className.slice(0, 40)});
        }
        return out;
      });
      for (const x of r) {
        pillole++;
        const male = x.fuoriFondo || x.taglia || x.l < -0.5 || x.r > x.W + 0.5 || (x.righe > 1 && !x.aCapo && !/barra-azione/.test(x.classe)) || x.righe > 3;
        if (male) { rotte++; guai.push(`${L} ${w}×${h} ${fase}: «${x.testo}» ${JSON.stringify({l: x.l, r: x.r, W: x.W, righe: x.righe, aCapo: x.aCapo, fuoriFondo: x.fuoriFondo, taglia: x.taglia})}`); }
      }
    }
    if (errori.length) guai.push(`${L} ${w}×${h}: errori ${errori[0]}`);
    await p.close();
  }
  await ctx.close();
}
console.log(`${motore}: ${pillole} pillole viste in ${lingue.length} lingue × ${misure.length} larghezze (a riposo e dopo lo scorrimento): ${rotte} fuori posto`);
for (const g of guai.slice(0, 40)) console.log('  ' + g);
await b.close(); server.close();
process.exit(rotte || guai.length ? 1 : 0);
