// Punto 1 · aprire e chiudere il menu, o portare il fuoco nella barra, non muove la pagina (in Chromium la faceva salire di 23-461 px: il fuoco dentro la barra sticky,
// con html { scroll-padding-top } più grande della barra, per lui «sta sotto il bordo» e centra la pagina). Con input veri (mouse, tocco, tastiera), non con i click di
// Playwright (che scorrono da sé l'elemento in vista prima di premere). Per ogni pagina, misura e scorrimento:
//   · apri con il mouse · Esc · apri con il tocco (dove c'è) · chiudi premendo di nuovo «Menu» · apri con la tastiera (fuoco su «Menu», Invio) · Esc
//   · Maiusc+Tab dalla pagina fino alla barra: ogni passo che porta il fuoco DENTRO la barra non deve muovere la pagina.
// Uso: node salto-menu.mjs <cartella-sito> <motore> <percorso[,percorso…]> <WxH[,WxH…]> [--y=600,1500]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, motore, percorsi, misure, ...opz] = process.argv.slice(2);
const ys = (opz.find(o => o.startsWith('--y='))?.split('=')[1] || '600,1500').split(',').map(Number);
const RITMO = +(process.env.RITMO ?? 220);   // la pausa fra un Maiusc+Tab e il successivo: 220 ms è il passo di una persona, 0 il più rapido
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const sy = p => p.evaluate(() => Math.round(scrollY * 10) / 10);
let casi = 0, male = 0; const peggiori = [];
for (const perc of percorsi.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 1, ...tocco(motore, true)}); const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + perc, {waitUntil: 'load'}); await p.waitForTimeout(1800); await assesta(p);
  const conTocco = motore !== 'firefox';
  const haMenu = await p.evaluate(() => { const pm = document.querySelector('.pulsante-menu'); return !!pm && getComputedStyle(pm).display !== 'none'; });
  const passi = [];
  let ultimo = 0;   // ogni passo si confronta con il precedente (un salto si conta una volta, non a ogni passo dopo)
  const conferma = (nome, y0, y1) => { casi++; const d = Math.round((y1 - ultimo) * 10) / 10; ultimo = y1; if (Math.abs(d) > 1) { male++; passi.push(`${nome} ${d > 0 ? '+' : ''}${d}`); peggiori.push(Math.abs(d)); } };
  const massimo = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const yRich of ys) {
    const y = Math.min(yRich, Math.max(0, massimo - 4)); if (y < 60) continue;
    await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(700); const y0 = await sy(p); ultimo = y0;
    if (haMenu) {
      const r = await p.locator('.pulsante-menu').boundingBox(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      await p.mouse.click(cx, cy); await p.waitForTimeout(600); conferma(`mouse apre da ${y0}`, y0, await sy(p));
      await p.keyboard.press('Escape'); await p.waitForTimeout(500); conferma(`Esc chiude da ${y0}`, y0, await sy(p));
      if (conTocco) { await p.touchscreen.tap(cx, cy); await p.waitForTimeout(600); conferma(`tocco apre da ${y0}`, y0, await sy(p)); await p.touchscreen.tap(cx, cy); await p.waitForTimeout(500); conferma(`tocco richiude da ${y0}`, y0, await sy(p)); }
      await p.evaluate(() => document.querySelector('.pulsante-menu').focus({preventScroll: true})); await p.keyboard.press('Enter'); await p.waitForTimeout(600); conferma(`Invio apre da ${y0}`, y0, await sy(p));
      await p.keyboard.press('Escape'); await p.waitForTimeout(500); conferma(`Esc dopo Invio da ${y0}`, y0, await sy(p));
    }
    // Maiusc+Tab dalla pagina verso la barra: i passi che entrano nella barra non muovono la pagina
    await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(500); ultimo = await sy(p);
    await p.evaluate(() => { const l = [...document.querySelectorAll('main a, main button, main summary, footer a')].filter(e => e.offsetParent).find(e => { const r = e.getBoundingClientRect(); return r.top > 200 && r.bottom < innerHeight - 20; }); (l || document.body).focus({preventScroll: true}); });
    let guardia = 0;
    for (let i = 0; i < 60 && guardia < 6; i++) {
      const prima = await sy(p), eraNellaBarra = await p.evaluate(() => !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('.barra')));
      await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(RITMO);
      const ora = await p.evaluate(() => { const e = document.activeElement; return {inBarra: !!(e && e.closest && e.closest('.barra')), nome: e ? (e.className && e.className.toString().split(' ')[0]) || e.tagName : '', y: Math.round(scrollY * 10) / 10}; });
      ultimo = prima;
      if (ora.inBarra) { guardia++; conferma(`Maiusc+Tab entra in «${ora.nome}» da ${prima}`, prima, ora.y); } else ultimo = ora.y;
      if (ora.nome === 'salta') break;
    }
  }
  if (errori.length) passi.push(`errori: ${errori.slice(0, 2).join(' | ')}`);
  console.log(`${passi.length ? 'NO  ' : 'ok  '}${motore} ${perc} ${m}${haMenu ? '' : ' (nessun pulsante Menu)'}${passi.length ? ': ' + passi.join(' · ') : ''}`);
  await ctx.close();
}
await b.close(); server.close();
console.log(`${male ? 'NO  ' : 'ok  '}${motore}: ${casi} controlli, ${male} in cui la pagina si muove${male ? ` (fino a ${Math.max(...peggiori)} px)` : ''}`);
process.exit(male ? 1 : 0);
