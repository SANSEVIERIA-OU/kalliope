// Le altezze dei pezzi della pagina «installa» ogni volta che la si apre (e dopo che si è assestata): chi cambia da una volta all'altra? Serve a trovare ciò che fa variare l'altezza della pagina.
// Uso: PORTA=… node altezze-sezioni.mjs <cartella-sito> <motore> <WxH> <ancora> <volte>
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, motore = 'firefox', misura = '390x844', ancora = 'passo-4', volte = '10'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let prima = null;
for (let i = 1; i <= +volte; i++) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'no-preference'});
  const p = pagina(await ctx.newPage(), []);
  await p.goto(base + 'it/installa/#' + ancora, {waitUntil: 'load'});
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => { const o = {pagina: document.documentElement.scrollHeight, y: Math.round(scrollY)};
    for (const e of document.querySelectorAll('body > *, main > *, main > * > *, .scena-pagina > *')) { const id = (e.id ? '#' + e.id : '') + '.' + String(e.className).split(' ')[0]; const k = e.tagName.toLowerCase() + id; o[k] = Math.round(e.getBoundingClientRect().height); }
    return o; });
  const diff = prima ? Object.keys(r).filter(k => r[k] !== prima[k]).map(k => `${k}: ${prima[k]} -> ${r[k]}`) : [];
  console.log(`prova ${i}: pagina ${r.pagina}, scrollY ${r.y}${diff.length ? ' · cambia: ' + diff.join(' ; ') : ''}`);
  if (!prima) prima = r;
  await ctx.close();
}
await b.close(); server.close();
