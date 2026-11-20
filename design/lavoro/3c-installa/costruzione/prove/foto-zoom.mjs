// Le foto del testo grande sotto i 320 px (lo zoom del 150 e del 200% a 360×760 dà una finestra di 240 e di 180 px): la scelta della distribuzione e il pulsante del file, come li vede la persona.
// Uso: PORTA=… node foto-zoom.mjs <cartella-sito> <uscita> <percorso> <WxH>[,WxH…]
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
import {mkdirSync} from 'node:fs';
const [cartella, uscita, percorso = 'it/installa/', misure = '288x608,240x507,180x380'] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium');
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce'});
  const p = pagina(await ctx.newPage(), []);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  const nome = percorso.replace(/\W+/g, '-').replace(/^-|-$/g, '');
  await p.screenshot({path: `${uscita}/${nome}-${W}x${H}-in-cima.png`});
  const ok = await p.evaluate(() => { const e = document.querySelector('#distribuzione, .sistemi-scelta, .scelta-sistema'); if (!e) return false; e.scrollIntoView({block: 'start'}); window.scrollBy(0, -80); return true; });
  if (ok) { await p.waitForTimeout(400); await p.screenshot({path: `${uscita}/${nome}-${W}x${H}-la-scelta.png`}); }
  await ctx.close();
}
await b.close(); server.close();
