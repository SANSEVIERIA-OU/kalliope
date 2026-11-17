// Il cinese va a capo fra un carattere e l'altro: è giusto, e il controllo «SPEZZATA» dell'esame (che cerca parole spezzate con gli spazi) lo segnala a ogni riga.
// Qui si guarda ciò che nel cinese conta: nessuna riga comincia con un segno che non può stare all'inizio («，。、；：！？）」』》〕】…»), nessuna finisce con uno che non può stare in
// fondo («（「『《〔【»), e un pezzo latino dentro il testo (Linux, PipeWire, 0.1-rc.1, x86_64) non va a capo a metà. Su ogni testo con almeno otto caratteri cinesi.
// Uso: node cinese.mjs <sito> [--pagina ""] [--misure 320x900,390x844,…] [--motore chromium] [--porta 0]
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, pagina, tocco} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const server = await servi(process.argv[2], {porta: +arg('--porta', 0), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const misure = arg('--misure', '320x900,360x640,390x844,600x900,761x900,1000x900,1180x900,1440x900').split(',').map(m => m.split('x').map(Number)), motore = arg('--motore', 'chromium');
const b = await avvia(motore);
let testi = 0, righeViste = 0; const guai = [];
for (const [w, h] of misure) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, locale: 'it-IT', reducedMotion: 'reduce', ...(w < 500 ? tocco(motore, true) : {})});
  // controprova: DIFETTO_CSS='body *{word-break:break-all !important}' rompe i pezzi latini e la prova deve dire NO (senza toccare i file)
  if (process.env.DIFETTO_CSS) await ctx.addInitScript(css => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); }), process.env.DIFETTO_CSS);
  const p = pagina(await ctx.newPage(), []);
  await p.goto(`${base}zh/${arg('--pagina', '')}`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  // con la pagina in fondo le scene sono entrate: i testi si rivelano scorrendo
  await p.evaluate(async () => { for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const NO_INIZIO = new Set([...'，。、；：！？）」』》〕】…—·％,.;:!?)]}']), NO_FINE = new Set([...'（「『《〔【([{']);
    const cjk = c => /[㐀-鿿＀-￯　-〿]/.test(c);
    const out = {testi: 0, righe: 0, guai: []};
    for (const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); w.nextNode();) {
      const n = w.currentNode, t = n.textContent, el = n.parentElement;
      if (!el || ['SCRIPT', 'STYLE', 'TEMPLATE'].includes(el.tagName) || el.closest('[hidden], .solo-lettori')) continue;
      if ((t.match(/[㐀-鿿]/g) || []).length < 8) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      // la riga di ogni carattere
      const righe = []; let ultima = null;
      for (let i = 0; i < t.length; i++) {
        const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1); const q = [...rg.getClientRects()].find(x => x.width > 0.5 && x.height > 0.5); if (!q) continue;
        const riga = Math.round(q.top / 4);
        if (ultima === null || Math.abs(riga - ultima) > 2) righe.push([]);
        righe.at(-1).push({c: t[i], i}); ultima = riga;
      }
      if (righe.length < 2) continue;
      out.testi++; out.righe += righe.length;
      for (let k = 1; k < righe.length; k++) {
        const prima = righe[k - 1].at(-1), dopo = righe[k][0];
        if (NO_INIZIO.has(dopo.c)) out.guai.push(`la riga comincia con «${dopo.c}»: …${t.slice(Math.max(0, dopo.i - 6), dopo.i + 4)}`);
        if (NO_FINE.has(prima.c)) out.guai.push(`la riga finisce con «${prima.c}»: …${t.slice(Math.max(0, prima.i - 4), prima.i + 6)}`);
        // un pezzo latino (lettere, cifre, punti, trattini, trattino basso) spezzato a metà
        if (dopo.i === prima.i + 1 && /[A-Za-z0-9_.\-]/.test(prima.c) && /[A-Za-z0-9_.\-]/.test(dopo.c)) out.guai.push(`un pezzo latino va a capo a metà: «${t.slice(Math.max(0, prima.i - 6), dopo.i + 6)}»`);
      }
    }
    return out;
  });
  testi += r.testi; righeViste += r.righe;
  for (const g of r.guai) guai.push(`${w}×${h}: ${g}`);
  await ctx.close();
}
console.log(`${motore}: ${testi} testi cinesi su più righe, ${righeViste} righe, in ${misure.length} larghezze: ${guai.length} segni fuori posto`);
for (const g of [...new Set(guai)].slice(0, 20)) console.log('  ' + g);
await b.close(); server.close();
process.exit(guai.length ? 1 : 0);
