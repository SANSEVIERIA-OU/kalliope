// Apre il catalogo del sistema nel sito costruito, controlla «Il marchio» (0 errori in console, 0 richieste fallite, le parti che devono esserci) e
// fotografa la sezione. Uso: node catalogo.mjs <indirizzo del catalogo> <cartella delle foto> [larghezza=1440]
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [url, cart, w = '1440'] = process.argv.slice(2);
mkdirSync(cart, {recursive: true});
const b = await chromium.launch({headless: true});
const p = await b.newPage({viewport: {width: +w, height: 900}});
const console_ = [], falliti = [];
p.on('console', m => { if (m.type() === 'error') console_.push(m.text()); });
p.on('pageerror', e => console_.push('pageerror: ' + e.message));
p.on('requestfailed', r => falliti.push(r.url() + ' ' + r.failure()?.errorText));
p.on('response', r => { if (r.status() >= 400) falliti.push(r.url() + ' ' + r.status()); });
await p.goto(url, {waitUntil: 'load'});
await p.waitForFunction(() => window.__catalogoMarchio, null, {timeout: 30000});
await p.waitForTimeout(2500);
const info = await p.evaluate(() => ({
  marchio: window.__catalogoMarchio, catalogo: window.__catalogo && {token: window.__catalogo.token, errori: window.__catalogo.errori},
  sezione: !!document.querySelector('#marchio'), indice: !!document.querySelector('#indice a[href="#marchio"]'),
  dopo: document.querySelector('#marchio').previousElementSibling && document.querySelector('#marchio').previousElementSibling.id,
  immagini: [...document.querySelectorAll('#marchio img')].map(i => i.complete && i.naturalWidth > 0),
  segni: document.querySelectorAll('#marchio .m-segno').length,
  idDoppi: (() => { const ids = [...document.querySelectorAll('#marchio [id]')].map(e => e.id); return ids.length - new Set(ids).size; })(),
  specchio: [...document.querySelectorAll('#marchio iframe[data-specchio]')].map(f => JSON.parse(f.dataset.specchio)),
  tabelle: document.querySelectorAll('#marchio table').length,
  // fuori dallo schermo: ciò che sta in «Il marchio» e non sta dentro un riquadro che scorre (il catalogo ha altre sezioni, di altri incarichi, più larghe dello schermo stretto)
  orizzontale: (() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('#marchio *')].filter(e => { const q = e.getBoundingClientRect(); return q.width > 0 && q.right > W + 1 && !e.closest('.cm-scorre'); }).length; })(),
  paginaLarga: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}));
console.log(JSON.stringify(info));
const errori = [], note = [];
// difetti trovati guardando: il testo su un fondo chiaro o scuro di prova non si leggeva (colore del fondo della pagina), e la barra «con l'azione» al telefono non era scesa abbastanza
const leggibilita = await p.evaluate(() => {
  const lum = c => { const v = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const brutti = [];
  for (const f of document.querySelectorAll('#marchio [class*="cm-fondo-"]')) for (const t of f.querySelectorAll('.cat-et, figcaption, .cm-et')) {
    const a = lum(getComputedStyle(t).color), b = lum(getComputedStyle(f).backgroundColor), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (r < 3) brutti.push(`${t.className || t.tagName} su ${f.className}: ${r.toFixed(1)}:1`);
  }
  return brutti;
});
if (leggibilita.length) errori.push('testo che non si legge: ' + leggibilita.slice(0, 3).join(' · '));
await p.locator('#marchio iframe[title*="con l\'azione"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(4000);   // le anteprime si caricano quando arrivano in vista
const conAzione = await p.evaluate(() => { const f = [...document.querySelectorAll('#marchio iframe')].find(i => /con l'azione/.test(i.title)); try { return !!f.contentDocument.querySelector('.barra.con-azione'); } catch (e) { return null; } });
if (conAzione !== true) errori.push('la barra «con l\'azione» al telefono non ha preso l\'azione');
if (!info.sezione || !info.indice) errori.push('manca la sezione o la voce dell\'indice');
if (info.marchio.errori.length) errori.push('errori del catalogo del marchio: ' + info.marchio.errori.join(' · '));
if (info.catalogo.errori.length) errori.push('errori del catalogo: ' + info.catalogo.errori.join(' · '));
if (info.immagini.some(x => !x)) errori.push(`${info.immagini.filter(x => !x).length} immagini non caricate`);
if (info.idDoppi) errori.push(`${info.idDoppi} identificatori doppi nella sezione (i ritagli di due segni si confonderebbero)`);
if (info.segni < 20) errori.push(`pochi segni in linea (${info.segni})`);
if (info.specchio.length !== 2 || info.specchio.some(s => s.matrice !== 'none')) errori.push('le pagine da destra a sinistra non dicono «non specchiato»: ' + JSON.stringify(info.specchio));
else if (info.specchio.find(s => s.dir === 'rtl').inizio !== 'destra' || info.specchio.find(s => s.dir === 'ltr').inizio !== 'sinistra') errori.push('il segno non sta all\'inizio della riga nei due versi');
if (info.orizzontale) errori.push(`${info.orizzontale} elementi di «Il marchio» escono dallo schermo`);
if (info.paginaLarga) note.push('la pagina del catalogo è più larga dello schermo (altre sezioni: «Le scritture»)');
const sez = p.locator('#marchio');
await sez.scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
await sez.screenshot({path: `${cart}/marchio-${w}.png`});
// il movimento: «Riproduci» e «Ferma»
const riga = p.locator('#marchio .cm-effetto');
await riga.scrollIntoViewIfNeeded();
const pos = () => p.evaluate(() => parseFloat((document.querySelector('#marchio .cm-dati').textContent.match(/fronte ([\d,]+)/) || [0, '0'])[1].replace(',', '.')));
const x0 = await pos();
await p.click('#marchio .cat-controlli button:has-text("Riproduci")');
await p.waitForTimeout(3500);
const x1 = await pos();
await riga.screenshot({path: `${cart}/movimento-${w}-riproduci.png`});
await p.click('#marchio .cat-controlli button:has-text("Ferma")');
await p.waitForTimeout(1600);
const x2 = await pos();
await p.check('#cm-ridotto');
await p.click('#marchio .cat-controlli button:has-text("Riproduci")');
await p.waitForTimeout(2500);
const x3 = await pos();
console.log(`fronte: a riposo ${x0} · dopo 3,5 s di «Riproduci» ${x1} · dopo «Ferma» ${x2} · con «riduci movimento» e «Riproduci» ${x3}`);
if (!(x0 === 0 && x1 > 10 && x2 < 0.5 && x3 < 0.5)) errori.push('il movimento non risponde: riposo→frase→ferma→ridotto');
await b.close();
console.log('console: ' + (console_.length ? console_.join(' | ') : '0 errori') + ' · richieste fallite: ' + (falliti.length ? falliti.join(' | ') : '0'));
if (console_.length) errori.push('errori in console');
if (falliti.length) errori.push('richieste fallite');
if (errori.length) { console.log('NON TORNA:\n  ' + errori.join('\n  ')); process.exit(1); }
console.log('torna' + (note.length ? ' · nota, non di «Il marchio»: ' + note.join(' · ') : ''));
