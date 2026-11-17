// I byte che scarica la pagina italiana: a riposo (senza scorrere), poi in fondo, poi con la scelta della barra aperta.
// Uso: node byte-italiano.mjs <sito costruito> [--porta 8807] [--pagina it/]
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [sito] = process.argv.slice(2);
const server = await servi(sito, {porta: +arg('--porta', 8807), fresco: true});
const b = await avvia('chromium');
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  const caratteri = []; p.on('response', async r => { if (/\.woff2$/.test(r.url())) { let n = 0; try { n = (await r.body()).length; } catch {} caratteri.push([r.url().split('/').slice(-2).join('/'), n]); } });
  const somma = () => caratteri.reduce((s, [, n]) => s + n, 0);
  await p.goto(`http://127.0.0.1:${server.address().port}/${arg('--pagina', 'it/')}`, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(3000);
  console.log(`${w}x${h} a riposo: ${caratteri.length} file, ${somma()} byte: ${caratteri.map(c => c.join(' ')).join(', ')}`);
  const n0 = caratteri.length;
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(2500);
  console.log(`${w}x${h} in fondo: +${caratteri.length - n0} file: ${caratteri.slice(n0).map(c => c.join(' ')).join(', ')}`);
  await ctx.close();
}
await b.close(); server.close();
