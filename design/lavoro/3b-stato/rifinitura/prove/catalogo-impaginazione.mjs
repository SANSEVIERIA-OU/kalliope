// Gli esemplari della sezione «Pagina «stato»» del catalogo si leggono a ogni larghezza, come nella pagina? Per ogni larghezza: le colonne di testo della tappa (paragrafi dei fatti e dei dettagli) non
// sono più strette del 45% di quelle della stessa tappa nella pagina vera a quella finestra (l'esemplare sta dentro un quadro con i suoi margini) né a meno di 12 caratteri per riga (una parola per riga); una fonte non va su più di due righe; niente esce dallo schermo. Segnala l'esemplare (la sua didascalia).
// Uso: node catalogo-impaginazione.mjs <cartella-sito> <porta> <W,W,…> [--foto=<cartella> --motore=chromium]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, porta, larghezze, ...opz] = process.argv.slice(2);
const foto = opz.find(o => o.startsWith('--foto='))?.split('=')[1], motore = opz.find(o => o.startsWith('--motore='))?.split('=')[1] || 'chromium';
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await avvia(motore);
let male = 0; const righe = [];
for (const W of larghezze.split(',').map(Number)) {
  const ctx = await b.newContext({viewport: {width: W, height: 900}, reducedMotion: 'reduce'});   // senza l'emulazione del telefono: con quella la pagina del catalogo (che scorre di lato al telefono) prende una finestra più larga e le regole da 760 px non valgono
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(`http://127.0.0.1:${porta}/design-system/catalogo/`, {waitUntil: 'load'});
  await p.waitForFunction(() => window.__catalogoStato, null, {timeout: 40000}); await p.waitForTimeout(1500);
  // il riferimento: la stessa tappa nella pagina vera, a quella finestra (larghezza delle colonne dei fatti, righe delle fonti)
  const pr = await ctx.newPage(); await pr.goto(`http://127.0.0.1:${porta}/it/stato/`, {waitUntil: 'load'}); await pr.waitForTimeout(1200);
  const rif = await pr.evaluate(() => { const righe = e => { const cs = getComputedStyle(e); return Math.round(e.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3)); };
    const ps = [...document.querySelectorAll('.anello .anello-fatti > p, .anello .anello-dettagli > p')].filter(e => e.getClientRects().length && e.textContent.trim().length > 60);
    return {colonna: Math.round(Math.min(...ps.map(e => e.getBoundingClientRect().width))), fonteRighe: Math.max(...[...document.querySelectorAll('.anello .fonte')].filter(e => e.getClientRects().length).map(righe))}; });
  await pr.close();
  const r = await p.evaluate((rif) => {
    const out = [], sez = document.querySelector('#pagina-stato');
    const dida = e => { const c = e.closest('.cat-prova'); return c ? c.querySelector('.cat-et').textContent.slice(0, 60) : '?'; };
    const righeDi = e => { const cs = getComputedStyle(e); return Math.round(e.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3)); };
    for (const e of sez.querySelectorAll('.cat-quadro .anello-fatti > p:not(.riscrive), .cat-quadro .anello-dettagli > p')) {
      const w = e.getBoundingClientRect().width, n = righeDi(e), c = e.textContent.trim().length;
      if (e.getClientRects().length && w > 0 && c > 60 && (w < 0.45 * rif.colonna || c / Math.max(1, n) < 12)) out.push(`colonna di ${Math.round(w)} px (nella pagina ${rif.colonna}), ${Math.round(c / Math.max(1, n))} caratteri per riga: «${e.textContent.trim().slice(0, 26)}» in «${dida(e)}»`);
    }
    for (const e of sez.querySelectorAll('.cat-quadro .anello .fonte')) { if (!e.getClientRects().length || innerWidth <= 760) continue;   // al telefono la pagina ha i dettagli chiusi: la sua fonte da confrontare non c'è
      if (/testo più lungo/.test(dida(e))) continue;   // l'esemplare con il testo allungato apposta
      const n = righeDi(e); if (n > Math.max(2, rif.fonteRighe)) out.push(`fonte su ${n} righe (nella pagina ${rif.fonteRighe}) «${e.textContent.trim().slice(0, 30)}» in «${dida(e)}»`); }
    for (const e of sez.querySelectorAll('.cat-quadro *, .cat-prova > .cat-et')) { if (e.closest('iframe, svg, .luce-tratto') || e.classList.contains('luce-tratto') || !e.getClientRects().length) continue; const r = e.getBoundingClientRect(); if (r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.cap-schermo') && !e.closest('[style*="overflow"]')) { out.push(`esce dallo schermo di ${Math.round(r.right - innerWidth)} px: ${e.tagName.toLowerCase()}.${String(e.className).slice(0, 20)} in «${dida(e)}»`); break; } }
    return {out, sezioneLarga: sez.scrollWidth, finestra: innerWidth, anelli: sez.querySelectorAll('.cat-quadro .anello').length};
  }, rif);
  const brutte = r.out.length; if (brutte) male++;
  righe.push(`${brutte ? 'NO  ' : 'ok  '}${W}: ${r.anelli} tappe negli esemplari${brutte ? `, ${brutte} cose: ${[...new Set(r.out)].slice(0, 6).join(' | ')}` : ', tutto si legge'}${r.sezioneLarga > r.finestra + 1 ? ` · la sezione scorre di lato (${r.sezioneLarga} contro ${r.finestra})` : ''}${errori.length ? ' · ERRORI ' + errori.join(' | ') : ''}`);
  if (foto) { const q = p.locator('#pagina-stato .cat-prova').filter({has: p.locator('.cat-coppia')}); const n = await q.count(); for (let i = 0; i < n; i++) { await q.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await q.nth(i).screenshot({path: `${foto}/coppia-${i + 1}-${motore}-${W}.png`}); } }
  await ctx.close();
}
console.log(righe.join('\n')); console.log(`\n${righe.length - male}/${righe.length} larghezze in cui ogni esemplare si legge`);
await b.close(); server.close(); process.exit(male ? 1 : 0);
