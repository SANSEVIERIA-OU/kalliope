// Il catalogo vivo a una misura stretta: che cosa è più largo della finestra, che cosa esce dal suo quadro, che cosa copre il pulsante «Copia» di una prova.
// Uso: PORTA=… node catalogo-largo.mjs <cartella-sito> <uscita> <motore> <WxH>
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina, assesta, tocco} = await import(SKILL + '/scripts/lib/comune.mjs');
import {mkdirSync} from 'node:fs';
const [cartella, uscita, motore = 'chromium', misura = '390x844'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + 'design-system/catalogo/', {waitUntil: 'load'});
await p.waitForFunction(() => window.__catalogoInstalla, null, {timeout: 60000});
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const dsc = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')).slice(0, 70);
  const vw = document.documentElement.clientWidth;
  const larghi = [...document.querySelectorAll('body *')].map(e => ({e, r: e.getBoundingClientRect()})).filter(x => x.r.width > 0 && x.r.right > vw + 1).sort((a, b) => b.r.right - a.r.right).slice(0, 14)
    .map(x => `${dsc(x.e)} destra ${Math.round(x.r.right)} largo ${Math.round(x.r.width)} · ${(x.e.closest('section, .cat-scheda') || {id: '-'}).id || (x.e.closest('.cat-scheda') ? 'scheda' : '-')}`);
  const fuori = [...document.querySelectorAll('.cat-quadro')].filter(q => q.scrollWidth > q.clientWidth + 2).map(q => `${(q.previousElementSibling ? q.previousElementSibling.textContent : '').slice(0, 60)} · scrollWidth ${q.scrollWidth} clientWidth ${q.clientWidth}`);
  // dentro ogni quadro che trabocca: gli elementi che escono dal suo bordo
  const dentro = [...document.querySelectorAll('#pagina-installa .cat-quadro')].filter(q => q.scrollWidth > q.clientWidth + 2).map(q => {
    const qr = q.getBoundingClientRect(), lim = qr.right - parseFloat(getComputedStyle(q).paddingRight);
    return (q.previousElementSibling ? q.previousElementSibling.textContent : '').slice(0, 40) + ' => ' + [...q.querySelectorAll('*')].map(e => ({e, r: e.getBoundingClientRect()})).filter(x => x.r.width > 0 && x.r.right > lim + 1).sort((a, b) => b.r.right - a.r.right).slice(0, 5).map(x => `${dsc(x.e)} destra ${Math.round(x.r.right)} (limite ${Math.round(lim)}) largo ${Math.round(x.r.width)}`).join(' ; ');
  });
  // nella sezione «installa» di tutto il catalogo: che cosa esce dalla finestra (quel che sta in altre sezioni è del catalogo di prima)
  const nellaSezione = [...document.querySelectorAll('#pagina-installa *')].map(e => ({e, r: e.getBoundingClientRect()})).filter(x => x.r.width > 0 && x.r.right > vw + 1 && !x.e.closest('.cat-quadro')).slice(0, 8).map(x => `${dsc(x.e)} destra ${Math.round(x.r.right)}`);
  return {vw, innerWidth, scrollWidth: document.documentElement.scrollWidth, larghi: larghi.slice(0, 3), fuori, dentro, nellaSezione};
});
console.log(JSON.stringify(r, null, 1));
const prova = p.locator('#pagina-installa .cat-prova').filter({hasText: 'dal vivo: premi «Copia» (la risposta è la stessa'});
await prova.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
const cop = await p.evaluate(() => {
  const dsc = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')).slice(0, 80);
  const pr = [...document.querySelectorAll('#pagina-installa .cat-prova')].find(x => /dal vivo: premi «Copia» \(la risposta è la stessa/.test(x.textContent));
  const b = pr.querySelector('.copia'), r = b.getBoundingClientRect(), pr_r = pr.getBoundingClientRect();
  const cima = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {bottone: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], prova: [Math.round(pr_r.left), Math.round(pr_r.top), Math.round(pr_r.width), Math.round(pr_r.height)], vh: innerHeight, vw: document.documentElement.clientWidth, incima: cima && dsc(cima), incimaDentro: cima && !!cima.closest('.cat-prova') && cima.closest('.cat-prova') === pr};
});
console.log('Copia della prova dal vivo:', JSON.stringify(cop));
await prova.screenshot({path: `${uscita}/prova-copia-${motore}-${misura}.png`});
await p.screenshot({path: `${uscita}/catalogo-installa-${motore}-${misura}.png`, fullPage: false});
await b.close(); server.close();
