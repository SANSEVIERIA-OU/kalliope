// Le schermate chiave di «stato» in una lingua a una misura (con «riduci movimento», perché le foto siano ferme): il primo schermo, la tappa della voce e quella del microfono, le
// domande con una risposta aperta, il varco allo scarico, il messaggio da inoltrare. Uso: node foto-lingue.mjs <cartella-sito> <uscita> <porta> <lingua[,lingua…]> <WxH[,WxH…]>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, uscita, porta, lingue, misure] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch();
for (const L of lingue.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...(W <= 760 ? {hasTouch: true, isMobile: true, deviceScaleFactor: 1} : {})});
  const p = await ctx.newPage(); const err = []; p.on('pageerror', e => err.push(e.message));
  await p.goto(`http://127.0.0.1:${porta}/${L}/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(1500);
  const scatta = async (nome, prepara) => { await p.evaluate(prepara); await p.waitForTimeout(900); await p.screenshot({path: `${uscita}/${L}-${m}-${nome}.png`}); };
  await scatta('1-primo', () => scrollTo(0, 0));
  await scatta('2-voce', () => document.querySelector('.anello[data-anello=voce]').scrollIntoView({block: 'center', behavior: 'instant'}));
  await scatta('3-microfono', () => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center', behavior: 'instant'}));
  await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(500);
  await p.click('#d-chi .domanda-bottone'); await p.waitForTimeout(1200); await p.screenshot({path: `${uscita}/${L}-${m}-4-domanda.png`});
  await scatta('5-varco', () => document.querySelector('.varco-passo[data-passo=scarico]').scrollIntoView({block: 'center', behavior: 'instant'}));
  await scatta('6-inoltra', () => document.querySelector('#inoltra').scrollIntoView({block: 'start', behavior: 'instant'}));
  if (err.length) console.log(L, m, 'ERRORI', err.join(' | '));
  await ctx.close();
}
await b.close(); server.close();
