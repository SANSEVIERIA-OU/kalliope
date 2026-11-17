// La barra con l'azione, in ogni lingua, a ogni larghezza: dopo uno scorrimento vero (la rotella), quando l'azione è entrata,
// nessuna voce del menu esce dallo schermo, copre il marchio (disegno e parola) o l'azione, e l'azione non copre il marchio né «Menu».
// Uso: node barra-larghezze.mjs <sito costruito> <uscita.json> [--lingue it,de,…] [--da 761] [--a 1440] [--passo 10] [--porta 8802]
//        [--pagina non-ancora/] (dopo la cartella della lingua)  [--larghezze 960,1024] (invece di da/a/passo)  [--foto cartella] (una foto della barra a ogni larghezza rotta, e a 960, 1024, 1100, 1280, 1440)
import {writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [sito, uscita] = process.argv.slice(2);
const lingue = arg('--lingue', 'it,de,fi,el,bg,ar,ur,hi,bn,zh,en-XA,ar-XB').split(',');
const da = +arg('--da', 761), a = +arg('--a', 1440), passo = +arg('--passo', 10), fotoDir = arg('--foto', '');
if (fotoDir) mkdirSync(fotoDir, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8802), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium');
const esiti = []; let rotte = 0, prove = 0;
for (const lingua of lingue) {
  const ctx = await b.newContext({viewport: {width: a, height: 800}, reducedMotion: 'reduce'});
  const p = await ctx.newPage();
  await p.goto(`${base}${lingua}/${arg('--pagina', '')}`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const larghezze = []; if (arg('--larghezze')) larghezze.push(...arg('--larghezze').split(',').map(Number)); else { for (let w = da; w <= a; w += passo) larghezze.push(w); if (larghezze.at(-1) !== a) larghezze.push(a); }
  for (const w of larghezze) {
    await p.setViewportSize({width: w, height: 800});
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(150);
    await p.mouse.move(w / 2, 400); await p.mouse.wheel(0, 1300); await p.waitForTimeout(700);
    const m = await p.evaluate(() => {
      const r = e => { if (!e) return null; const q = e.getBoundingClientRect(); return q.width && q.height && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.05 ? {x0: q.left, x1: q.right, y0: q.top, y1: q.bottom} : null; };
      const sovr = (u, v) => u && v && u.x0 < v.x1 - 1 && v.x0 < u.x1 - 1 && u.y0 < v.y1 - 1 && v.y0 < u.y1 - 1;
      const barra = document.querySelector('.barra'), W = innerWidth;
      const icona = r(document.querySelector('.marchio svg')), parola = r(document.querySelector('.marchio span'));
      const azione = barra.classList.contains('con-azione') ? r(document.querySelector('.barra-azione')) : null;
      const pm = r(document.querySelector('.pulsante-menu'));
      // «va a capo»: due scatole del testo che non si toccano in altezza (non due altezze diverse: il nastaliq ha la scatola più alta)
      const voci = [...document.querySelectorAll('.menu > ul > li > a, .menu > ul > li > details > summary')].map(e => { const rr = document.createRange(); rr.selectNodeContents(e); const qq = [...rr.getClientRects()].filter(q => q.width > 1 && q.height > 1); return {t: e.textContent.trim().slice(0, 18), q: r(e), alto: qq.some(u => qq.some(v => v.top >= u.bottom - 2))}; }).filter(v => v.q);
      const difetti = [];
      for (const v of voci) {
        if (v.alto) difetti.push(`«${v.t}» va a capo`);
        if (v.q.x0 < -1 || v.q.x1 > W + 1) difetti.push(`«${v.t}» fuori dallo schermo`);
        if (sovr(v.q, icona) || sovr(v.q, parola)) difetti.push(`«${v.t}» sul marchio`);
        if (sovr(v.q, azione)) difetti.push(`«${v.t}» sotto l'azione`);
      }
      if (azione && (sovr(azione, icona) || sovr(azione, parola))) difetti.push('l\'azione sul marchio');
      if (azione && sovr(azione, pm)) difetti.push('l\'azione su «Menu»');
      if (azione && (azione.x0 < -1 || azione.x1 > W + 1)) difetti.push('l\'azione fuori dallo schermo');
      return {conAzione: !!azione, classi: barra.className, voci: voci.length, menuBottone: !!pm, difetti};
    });
    prove++; if (m.difetti.length) rotte++;
    esiti.push({lingua, w, ...m});
    if (fotoDir && (m.difetti.length || [960, 1024, 1100, 1280, 1440].includes(w))) await p.screenshot({path: join(fotoDir, `${lingua}-${w}.png`), clip: {x: 0, y: 0, width: w, height: 80}});
  }
  await ctx.close();
}
await b.close(); server.close();
writeFileSync(uscita, JSON.stringify(esiti, null, 1));
const perLingua = {};
for (const e of esiti) { const k = perLingua[e.lingua] ||= {prove: 0, rotte: [], senzaAzione: 0}; k.prove++; if (e.difetti.length) k.rotte.push(e.w); if (!e.conAzione) k.senzaAzione++; }
for (const [l, k] of Object.entries(perLingua)) console.log(`${l}: ${k.prove} larghezze, ${k.rotte.length} rotte${k.rotte.length ? ' (' + k.rotte.slice(0, 12).join(', ') + (k.rotte.length > 12 ? '…' : '') + ')' : ''}${k.senzaAzione ? `, ${k.senzaAzione} senza azione in barra` : ''}`);
console.log(`in tutto ${prove} prove, ${rotte} rotte`);
