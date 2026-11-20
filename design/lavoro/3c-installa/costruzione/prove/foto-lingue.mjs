// Le schermate chiave di «installa» in una lingua a una misura (con «riduci movimento», perché le foto siano ferme): il primo schermo, il file e l'impronta, i comandi con la cartella, la finestra con una frase premuta,
// il microfono, la ripresa e l'indirizzo. In più misura che i comandi, i nomi dei file e le impronte si leggano da sinistra a destra (direction e allineamento), e che nulla esca dai bordi.
// Uso: node foto-lingue.mjs <cartella-sito> <uscita> <porta> <lingua[,lingua…]> <WxH[,WxH…]>
const {servi} = await import(process.env.SKILL + '/scripts/lib/servi.mjs');
import {mkdirSync, writeFileSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, uscita, porta, lingue, misure] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch();
const esiti = [];
for (const L of lingue.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...(W <= 760 ? {hasTouch: true, isMobile: true, deviceScaleFactor: 1} : {})});
  const p = await ctx.newPage(); const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', c => { if (c.type() === 'error' && !/favicon/.test(c.text())) err.push(c.text()); });
  await p.goto(`http://127.0.0.1:${porta}/${L}/installa/`, {waitUntil: 'networkidle'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  const scatta = async (nome, prepara) => { await p.evaluate(prepara); await p.waitForTimeout(900); await p.screenshot({path: `${uscita}/${L}-${m}-${nome}.png`}); };
  await scatta('1-primo', () => scrollTo(0, 0));
  await scatta('2-impronta', () => document.querySelector('#passo-controlla').scrollIntoView({block: 'center', behavior: 'instant'}));
  await scatta('3-installa', () => document.querySelector('#installa .installa-comandi').scrollIntoView({block: 'start', behavior: 'instant'}));
  await p.click('label[for=sistema-tar]'); await p.waitForTimeout(500);
  await scatta('4-installa-archivio', () => document.querySelector('#installa .installa-comandi').scrollIntoView({block: 'start', behavior: 'instant'}));
  await p.click('label[for=sistema-deb]'); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(500);
  await p.locator('.frase-bottone[data-stato=impronta]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=impronta]'); await p.waitForTimeout(1400); await p.screenshot({path: `${uscita}/${L}-${m}-5-frase.png`});
  await scatta('6-microfono', () => document.querySelector('.microfono-scena').scrollIntoView({block: 'center', behavior: 'instant'}));
  await scatta('7-ripresa', () => document.querySelector('#ripresa').scrollIntoView({block: 'start', behavior: 'instant'}));
  // i comandi, le impronte, i nomi dei file e il contenuto dei terminali restano da sinistra a destra, qualunque sia il verso della pagina
  const verso = await p.evaluate(() => {
    const sel = '.comando pre, .comando code, .t-corpo, .t-confronto, .file, .cartella-file, .cartelle-nome, .cartelle-file, .pacco, .inoltra-indirizzo span, .passo-file-nome .file';
    const male = [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length && getComputedStyle(e).direction !== 'ltr').map(e => e.className.slice(0, 20) || e.tagName);
    const dentro = [...document.querySelectorAll('.t-impronta, .comando-numero code')].filter(e => e.getClientRects().length).map(e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return cs.direction === 'ltr' || cs.unicodeBidi === 'isolate'; });
    const esce = [...document.querySelectorAll('.comando, .terminale, .cartella, .cartelle, .finestra.avvio, .bolla-indirizzo')].filter(e => e.getClientRects().length).filter(e => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(e => e.className.slice(0, 20));
    return {dir: document.documentElement.dir, male, dentro: dentro.every(Boolean), esce, largo: document.documentElement.scrollWidth, vh: innerWidth};
  });
  const buono = verso.male.length === 0 && verso.dentro && verso.esce.length === 0 && verso.largo <= verso.vh && err.length === 0;
  esiti.push({lingua: L, misura: m, buono, ...verso, errori: err});
  console.log(`${L} ${m} dir=${verso.dir}`, buono ? 'ok' : 'NO', JSON.stringify({male: verso.male, esce: verso.esce, largo: `${verso.largo}/${verso.vh}`, errori: err}));
  await ctx.close();
}
writeFileSync(`${uscita}/esiti-lingue.json`, JSON.stringify(esiti, null, 1));
await b.close(); server.close();
