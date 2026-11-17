// P1 · «Copia l'indirizzo di questa pagina»: il pannello delle versioni non si muove né cambia altezza quando compare la risposta («Copiato: …» o l'errore). Si misura la
// posizione e l'altezza del pannello (.versioni) e di ciò che gli sta sotto (la nota del feed) prima, subito dopo (60 ms: la risposta compare dopo 60 ms) e a 1,5 s.
// Uso: node copia-posto.mjs <cartella-sito> <motore> <percorso[,percorso…]> <WxH[,WxH…]>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, percorsi, misure] = process.argv.slice(2);
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let male = 0, casi = 0, nonVerificati = 0;
const leggi = p => p.evaluate(() => { const v = document.querySelector('.versioni'), n = document.querySelector('.coppia-nota'), r = v.getBoundingClientRect(), q = n && n.getBoundingClientRect(); const fatto = document.querySelector('.copia-fatto'), errore = document.querySelector('.copia-errore'); const vede = e => e && !e.hidden && getComputedStyle(e).visibility !== 'hidden'; return {top: Math.round((r.top + scrollY) * 10) / 10, h: Math.round(r.height * 10) / 10, nota: q ? Math.round((q.top + scrollY) * 10) / 10 : null, risposta: vede(fatto) ? 'fatto' : vede(errore) ? 'errore' : '—', pulsante: !document.querySelector('.copia-indirizzo').hidden}; });
for (const perc of percorsi.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 1, reducedMotion: 'reduce', ...tocco(motore, W <= 760)});
  if (motore === 'chromium') await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + perc, {waitUntil: 'load'}); await p.waitForTimeout(1500); await assesta(p);
  await p.evaluate(() => document.querySelector('.versioni').scrollIntoView({block: 'center'})); await p.waitForTimeout(2500); await assesta(p);
  const prima = await leggi(p);
  if (!prima.pulsante) { console.log(`--  ${motore} ${perc} ${m}: il pulsante «Copia» non c'è (appunti non disponibili): non verificato`); nonVerificati++; await ctx.close(); continue; }
  const r = await p.locator('.copia-indirizzo').boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2);
  const serie = []; for (const ms of [20, 90, 200, 700, 1500]) { await p.waitForTimeout(ms - (serie.at(-1)?.ms ?? 0)); serie.push({ms, ...(await leggi(p))}); }
  const dopo = serie.at(-1);
  casi++;
  const dTop = Math.max(...serie.map(s => Math.abs(s.top - prima.top))), dH = Math.max(...serie.map(s => Math.abs(s.h - prima.h))), dNota = prima.nota === null ? 0 : Math.max(...serie.map(s => Math.abs(s.nota - prima.nota)));
  const ok = dTop <= 0.5 && dH <= 0.5 && dNota <= 0.5 && dopo.risposta !== '—';
  if (!ok) male++;
  console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${perc} ${m}: pannello alto ${prima.h} px, sopra a ${prima.top}; dopo «Copia» (risposta: ${dopo.risposta}) scarto massimo: posizione ${dTop} px, altezza ${dH} px, nota sotto ${dNota} px · errori ${errori.length}`);
  await ctx.close();
}
await b.close(); server.close();
console.log(`${male ? 'NO  ' : 'ok  '}${motore}: ${casi} casi, ${male} in cui il pannello si muove o cambia altezza${nonVerificati ? `, ${nonVerificati} non verificati` : ''}`);
process.exit(male ? 1 : 0);
