// Il telefono che gira con la pagina già scorsa (l'azione in barra): da 390×844 a 844×390 e ritorno, senza tornare in cima.
// L'azione non deve coprire il marchio (disegno e parola) né «Menu». Uso: node barra-gira.mjs <sito> [--lingue de,en-XA] [--porta 8802] [--foto prefisso]
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const sito = process.argv[2], lingue = arg('--lingue', 'it,de,el,bg,fi,ar,ur,en-XA').split(','), foto = arg('--foto', '');
const server = await servi(sito, {porta: +arg('--porta', 8802), fresco: true});
const b = await avvia('chromium'); let rotte = 0, prove = 0;
const misura = p => p.evaluate(() => {
  const r = e => { if (!e) return null; const q = e.getBoundingClientRect(); return q.width && q.height && +getComputedStyle(e).opacity > 0.05 ? q : null; };
  const sovr = (u, v) => u && v && u.left < v.right - 1 && v.left < u.right - 1 && u.top < v.bottom - 1 && v.top < u.bottom - 1;
  const az = document.querySelector('.barra').classList.contains('con-azione') ? r(document.querySelector('.barra-azione')) : null;
  const d = [];
  if (sovr(az, r(document.querySelector('.marchio svg'))) || sovr(az, r(document.querySelector('.marchio span')))) d.push('azione sul marchio');
  if (sovr(az, r(document.querySelector('.pulsante-menu')))) d.push('azione su «Menu»');
  return {conAzione: !!az, difetti: d};
});
for (const l of lingue) for (const [da, a] of [[[390, 844], [844, 390]], [[844, 390], [390, 844]]]) {
  const ctx = await b.newContext({viewport: {width: da[0], height: da[1]}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${server.address().port}/${l}/`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  await p.mouse.move(da[0] / 2, da[1] / 2); await p.mouse.wheel(0, 1300); await p.waitForTimeout(900);
  await p.setViewportSize({width: a[0], height: a[1]}); await p.waitForTimeout(1200);
  const m = await misura(p); prove++; if (m.difetti.length) rotte++;
  console.log(`${l} ${da.join('×')} → ${a.join('×')}: ${m.conAzione ? 'azione in barra' : 'senza azione'}${m.difetti.length ? ', ' + m.difetti.join(', ') : ', a posto'}`);
  if (foto) await p.screenshot({path: `${foto}-${l}-${a.join('x')}.png`, clip: {x: 0, y: 0, width: a[0], height: 76}});
  await ctx.close();
}
console.log(`in tutto ${prove} prove, ${rotte} rotte`);
await b.close(); server.close();
