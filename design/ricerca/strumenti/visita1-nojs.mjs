/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Perche' la pagina senza JavaScript e' vuota: elementi a tutto schermo e testo con opacita' 0 (un solo browser, nessun posto passo).
const [url, nome] = process.argv.slice(2);
const {chromium} = await import(process.env.PLAYWRIGHT);
const b = await chromium.launch({channel: 'chromium', headless: true});
const c = await b.newContext({viewport: {width: 1440, height: 900}, javaScriptEnabled: false});
const p = await c.newPage();
await p.goto(url, {waitUntil: 'load', timeout: 60000}).catch(() => {});
await new Promise(r => setTimeout(r, 2500));
const r = await p.evaluate(() => {
  const els = [...document.querySelectorAll('body *')];
  const pieni = els.filter(e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'absolute') && r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.9; }).map(e => `${e.tagName}#${e.id}.${String(e.className).slice(0, 40)} z=${getComputedStyle(e).zIndex} bg=${getComputedStyle(e).backgroundColor} op=${getComputedStyle(e).opacity}`).slice(0, 5);
  const testoNascosto = els.filter(e => e.children.length === 0 && e.innerText && e.innerText.trim().length > 10).map(e => { let n = e, minOp = 1, hid = false; while (n && n !== document.body) { const s = getComputedStyle(n); minOp = Math.min(minOp, parseFloat(s.opacity)); if (s.visibility === 'hidden' || s.display === 'none') hid = true; n = n.parentElement; } return {t: e.innerText.trim().slice(0, 24), op: minOp, hid}; });
  return {pieni, testiConTesto: testoNascosto.length, conOpacita0: testoNascosto.filter(x => x.op === 0).length, nascostiDisplay: testoNascosto.filter(x => x.hid).length, esempi: testoNascosto.slice(0, 6), bodyBg: getComputedStyle(document.body).backgroundColor};
});
console.log(nome, JSON.stringify(r));
await b.close();
