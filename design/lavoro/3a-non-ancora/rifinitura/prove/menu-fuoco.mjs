// Il fuoco nel menu del telefono non fa scorrere la pagina (punto in più dell'incarico, dal lavoro sulle lingue): si apre il menu, si apre l'elenco delle lingue,
// si percorrono le voci con Tab: la pagina deve restare ferma (scrollY invariato). Con il sito di prova a più lingue.
// Uso: PLAYWRIGHT=… node menu-fuoco.mjs <cartella-sito> <motore> <WxH[,WxH…]> [--percorso=it/non-ancora/]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, misure, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let rosse = 0;
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, locale: 'it-IT', ...tocco(motore, true)}); const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(1500); await assesta(p);
  const y0 = await p.evaluate(() => scrollY);
  await p.click('.pulsante-menu'); await p.waitForTimeout(500);
  const y1 = await p.evaluate(() => scrollY);
  await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(600);
  const y2 = await p.evaluate(() => scrollY);
  const passi = [];
  await p.focus('details.lingua-scelta > summary');
  for (let i = 0; i < 40; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(40); const f = await p.evaluate(() => { const e = document.activeElement; return {inLista: !!(e && e.closest('.lingue-elenco')), y: scrollY}; }); if (!f.inLista) break; passi.push(f.y); }
  const massimo = Math.max(y0, y1, y2, ...passi), ok = massimo === y0 && passi.length > 0;
  if (!ok) rosse++;
  console.log(`${ok ? 'ok   ' : 'NO   '}${motore} ${m} · la pagina resta ferma con il fuoco nel menu: scrollY ${y0} → menu ${y1} → elenco ${y2} → ${passi.length} voci con Tab, massimo ${massimo}`);
  await ctx.close();
}
await b.close(); server.close(); process.exit(rosse ? 1 : 0);
