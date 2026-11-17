// L'azione in barra («Scarica e installa») al telefono e sul tablet, in ogni lingua, a ogni larghezza, dopo uno scorrimento vero: sta dentro l'altezza della barra,
// non copre il marchio (disegno e parola) né «Menu», non esce dallo schermo, e ha al massimo due righe finché la parola del marchio c'è (se ne ha di più, la parola sparisce).
// Come barra-larghezze.mjs dell'incarico 2, con in più l'altezza. Uso: node barra-azione.mjs <sito> <uscita.json> [--lingue it,de,…] [--da 320] [--a 960] [--passo 10] [--porta 8845] [--pagina non-ancora/] [--foto cartella]
import {writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, tocco} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [sito, uscita] = process.argv.slice(2);
const lingue = arg('--lingue', 'it,de,fi,el,bg,ar,ur,hi,bn,zh,en-XA,ar-XB').split(','), da = +arg('--da', 320), a = +arg('--a', 960), passo = +arg('--passo', 10), fotoDir = arg('--foto', '');
if (fotoDir) mkdirSync(fotoDir, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8845), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium');
const esiti = []; let rotte = 0, prove = 0;
for (const lingua of lingue) {
  const ctx = await b.newContext({viewport: {width: a, height: 800}, reducedMotion: 'reduce', ...tocco('chromium', true)});
  const p = await ctx.newPage();
  await p.goto(`${base}${lingua}/${arg('--pagina', '')}`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const larghezze = []; for (let w = da; w <= a; w += passo) larghezze.push(w); if (larghezze.at(-1) !== a) larghezze.push(a);
  for (const w of larghezze) {
    await p.setViewportSize({width: w, height: 800});
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(150);
    await p.mouse.move(w / 2, 400); await p.mouse.wheel(0, 1300); await p.waitForTimeout(800);
    const m = await p.evaluate(() => {
      const r = e => { if (!e) return null; const q = e.getBoundingClientRect(); return q.width && q.height && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.05 ? {x0: q.left, x1: q.right, y0: q.top, y1: q.bottom} : null; };
      const sovr = (u, v) => u && v && u.x0 < v.x1 - 1 && v.x0 < u.x1 - 1 && u.y0 < v.y1 - 1 && v.y0 < u.y1 - 1;
      const barra = document.querySelector('.barra'), W = innerWidth, B = barra.getBoundingClientRect();
      const icona = r(document.querySelector('.marchio svg')), parola = r(document.querySelector('.marchio span'));
      const az = document.querySelector('.barra-azione'), azione = barra.classList.contains('con-azione') ? r(az) : null;
      const pm = r(document.querySelector('.pulsante-menu'));
      let righe = 0;
      if (azione) { const corpo = parseFloat(getComputedStyle(az).fontSize) || 14, linee = new Set(); for (const w = document.createTreeWalker(az, NodeFilter.SHOW_TEXT); w.nextNode();) { if (!w.currentNode.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(w.currentNode); for (const q of rg.getClientRects()) if (q.width > 1) linee.add(Math.round(q.top / (corpo * 0.6))); } righe = linee.size; }
      const difetti = [];
      if (azione && (sovr(azione, icona) || sovr(azione, parola))) difetti.push('l\'azione sul marchio');
      if (azione && sovr(azione, pm)) difetti.push('l\'azione su «Menu»');
      if (azione && (azione.x0 < -1 || azione.x1 > W + 1)) difetti.push('l\'azione fuori dallo schermo');
      if (azione && (azione.y0 < B.top - 1 || azione.y1 > B.bottom + 1)) difetti.push(`l'azione esce dalla barra (${Math.round(azione.y0)}–${Math.round(azione.y1)} su ${Math.round(B.top)}–${Math.round(B.bottom)}, ${righe} righe)`);
      if (azione && parola && righe > 2) difetti.push(`l'azione ha ${righe} righe con la parola del marchio ancora in barra`);
      return {conAzione: !!azione, classi: barra.className, righe, difetti};
    });
    prove++; if (m.difetti.length) rotte++;
    esiti.push({lingua, w, ...m});
    if (fotoDir && m.difetti.length) await p.screenshot({path: join(fotoDir, `${lingua}-${w}.png`), clip: {x: 0, y: 0, width: w, height: 110}});
  }
  await ctx.close();
}
await b.close(); server.close();
writeFileSync(uscita, JSON.stringify(esiti, null, 1));
const perLingua = {};
for (const e of esiti) { const k = perLingua[e.lingua] ||= {prove: 0, rotte: [], senzaAzione: 0, massimoRighe: 0}; k.prove++; if (e.difetti.length) k.rotte.push(e.w); if (!e.conAzione) k.senzaAzione++; k.massimoRighe = Math.max(k.massimoRighe, e.righe); }
for (const [l, k] of Object.entries(perLingua)) console.log(`${l}: ${k.prove} larghezze, ${k.rotte.length} rotte${k.rotte.length ? ' (' + k.rotte.slice(0, 14).join(', ') + (k.rotte.length > 14 ? '…' : '') + ')' : ''}, al massimo ${k.massimoRighe} righe${k.senzaAzione ? `, ${k.senzaAzione} senza azione in barra` : ''}`);
console.log(`in tutto ${prove} prove, ${rotte} rotte`);
process.exit(rotte ? 1 : 0);
