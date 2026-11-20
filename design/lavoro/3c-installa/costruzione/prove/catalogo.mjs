// Il catalogo vivo, sezione «Pagina «installa»»: si apre senza errori, si contano le schede e le prove, si provano i comandi (anche quelli che premono i comandi veri dei
// riquadri), si fotografano le schede. Uso: node catalogo.mjs <cartella-sito> <uscita> <motore> <WxH>     (PORTA=… per la porta)
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina, assesta, tocco} = await import(SKILL + '/scripts/lib/comune.mjs');
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore = 'chromium', misura = '1440x900'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
// una finestra stretta, non il telefono: l'indice del catalogo di prima ha una tabella di 1014 px (catalogo.js a 548a6f2) e con l'emulazione del telefono la pagina si rimpicciolisce per farla stare
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, false)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
const esiti = []; const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
await p.goto(base + 'design-system/catalogo/', {waitUntil: 'load'});
await p.waitForFunction(() => window.__catalogoInstalla, null, {timeout: 60000});
await p.waitForTimeout(1500);
const stato = await p.evaluate(() => ({cat: window.__catalogo && {errori: window.__catalogo.errori}, pagine: window.__catalogoPagine, stato: window.__catalogoStato, installa: window.__catalogoInstalla, testo: document.querySelector('#stato-catalogo').textContent}));
ok('il catalogo principale si costruisce senza errori', stato.cat && stato.cat.errori.length === 0, JSON.stringify(stato.cat));
ok('le pagine interne e «stato» si costruiscono senza errori', stato.pagine && stato.pagine.errori.length === 0 && stato.stato && stato.stato.errori.length === 0, JSON.stringify({pagine: stato.pagine, stato: stato.stato && stato.stato.errori}));
ok('la sezione «installa» si costruisce senza errori', stato.installa && stato.installa.errori.length === 0, JSON.stringify(stato.installa));
const n = await p.evaluate(() => ({schede: document.querySelectorAll('#pagina-installa .cat-scheda').length, prove: document.querySelectorAll('#pagina-installa .cat-prova').length, viva: document.querySelectorAll('#pagina-installa iframe').length,
  indice: [...document.querySelectorAll('#indice a')].map(a => a.textContent).join(' | '), titoli: [...document.querySelectorAll('#pagina-installa .cat-scheda > h3')].map(h => h.textContent),
  dopo: document.querySelector('#pagina-stato').nextElementSibling && document.querySelector('#pagina-stato').nextElementSibling.id}));
ok('quattro schede: la scelta del sistema, il comando, il terminale, l\'installazione', n.schede === 4, `${n.schede} schede, ${n.prove} prove, ${n.viva} pagine vive: ${n.titoli.join(' | ')}`);
ok('la sezione sta nell\'indice e dopo quella di «stato»', /Pagina «installa»/.test(n.indice) && n.dopo === 'pagina-installa', n.dopo);
const completa = await p.evaluate(() => [...document.querySelectorAll('#pagina-installa .cat-scheda')].map(s => ({dt: [...s.querySelectorAll('dt')].map(x => x.textContent).join(','), prove: s.querySelectorAll('.cat-prova').length})));
ok('ogni scheda ha le sette voci (con movimento e verifica) e almeno cinque prove', completa.every(c => c.dt === 'Identificatore,Regola d\'uso,Non si usa,Persona e compito,Provenienza,Movimento,Verifica' && c.prove >= 5), JSON.stringify(completa.map(c => c.prove)));
await p.locator('#pagina-installa').scrollIntoViewIfNeeded();
const largo = await p.evaluate(() => { const s = document.querySelector('#pagina-installa'); return {sezione: s.scrollWidth, finestra: document.documentElement.clientWidth, sporgono: [...s.querySelectorAll('*')].filter(e => !e.closest('.cat-quadro') && e.getClientRects().length && e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).length}; });
ok('la sezione «installa» del catalogo non scorre di lato', largo.sezione <= largo.finestra && largo.sporgono === 0, JSON.stringify(largo));
// niente è vuoto o fuori dal suo quadro: ogni prova ha un contenuto che si vede
const vuote = await p.evaluate(() => [...document.querySelectorAll('#pagina-installa .cat-prova:not(.intero) .cat-quadro, #pagina-installa .cat-prova.intero:not(:has(iframe)) .cat-quadro')].filter(q => { const r = q.getBoundingClientRect(); return r.height < 24 || r.width < 24; }).map(q => q.previousElementSibling.textContent.slice(0, 60)));
ok('nessun quadro di prova è vuoto', vuote.length === 0, vuote.join(' | '));
const fuori = await p.evaluate(() => [...document.querySelectorAll('#pagina-installa .cat-quadro')].filter(q => q.scrollWidth > q.clientWidth + 2).map(q => q.previousElementSibling.textContent.slice(0, 70)));
ok('nessun contenuto esce dal suo quadro', fuori.length === 0, fuori.join(' | '));
// foto di ogni scheda
const schede = p.locator('#pagina-installa .cat-scheda');
for (let i = 0; i < await schede.count(); i++) {
  await schede.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(3500); await assesta(p);
  await schede.nth(i).screenshot({path: `${uscita}/scheda-${i + 1}-${motore}-${misura}.png`});
}
// la scelta: le quattro scelte inerti mostrano la voce piena giusta, e i comandi cambiano con il sistema
const voci = await p.evaluate(() => [...document.querySelectorAll('#pagina-installa .cat-scheda:nth-of-type(1) .sistemi')].slice(0, 4).map(f => [...f.querySelectorAll('.sistema-voce')].filter(r => r.checked).map(r => r.value).join()));
ok('la scelta: le prime quattro prove hanno scelta una voce ciascuna (deb, rpm, arch, tar)', voci.join(',') === 'deb,rpm,arch,tar', voci.join(','));
const visti = await p.evaluate(() => [...document.querySelectorAll('#pagina-installa .cat-sistemi-pagina')].slice(0, 4).map(x => [...x.querySelectorAll('.cat-comandi-sistema .comando')].filter(c => getComputedStyle(c).display !== 'none').length));
ok('ciò che dipende dalla scelta: 1 comando per Debian e per Fedora, 3 per Arch e per le altre (:has, dal foglio di stile)', visti.join(',') === '1,1,3,3', visti.join(','));
// i comandi del catalogo premono i comandi veri: «Fedora» nel riquadro cambia comando e pulsante
const riq = p.locator('#pagina-installa .cat-prova.intero').filter({hasText: 'il primo schermo dal vivo: premi una distribuzione'});
await riq.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000);
await riq.getByRole('button', {name: '«Fedora»'}).click();
const frame = await riq.locator('iframe').elementHandle().then(h => h.contentFrame());
let dentro = null;
for (let k = 0; k < 40; k++) { dentro = await frame.evaluate(() => ({scelta: document.querySelector('.sistema-voce:checked').value, pulsante: [...document.querySelectorAll('#comandi-apertura .scarica')].filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent.trim()).join('|')})); if (dentro.scelta === 'rpm') break; await p.waitForTimeout(250); }
ok('il comando del catalogo preme la scelta vera nel riquadro: Fedora, e il pulsante diventa quello del .rpm', dentro.scelta === 'rpm' && /\.rpm/.test(dentro.pulsante), JSON.stringify(dentro));
// «Copia» dal vivo (nella copia del catalogo): premuto, l'etichetta dice «Copiato» e poi torna
const copia = p.locator('#pagina-installa .cat-prova').filter({hasText: 'dal vivo: premi «Copia» (la risposta è la stessa'});
await copia.scrollIntoViewIfNeeded(); await copia.locator('.copia').click(); await p.waitForTimeout(300);
const copiato = await copia.evaluate(e => e.querySelector('.comando').classList.contains('copiato'));
await p.waitForTimeout(2200);
const tornato = await copia.evaluate(e => !e.querySelector('.comando').classList.contains('copiato'));
ok('«Copia» dal vivo: «Copiato» e poi torna «Copia»', copiato && tornato, `copiato ${copiato}, tornato ${tornato}`);
// il terminale dal vivo: Riproduci accende tutti i gruppi dell'impronta, e scrive il comando
const imp = p.locator('#pagina-installa .cat-prova').filter({hasText: 'dal vivo: premi Riproduci (le stesse fasi e gli stessi tempi della pagina: il comando e la risposta'});
await imp.scrollIntoViewIfNeeded(); await imp.getByRole('button', {name: 'Riproduci'}).click(); await p.waitForTimeout(500);
const meta = await imp.evaluate(e => ({uguali: e.querySelectorAll('.t-gruppo.uguale').length, gruppi: e.querySelectorAll('.t-gruppo').length}));
await p.waitForTimeout(3500);
const fine = await imp.evaluate(e => ({uguali: e.querySelectorAll('.t-gruppo.uguale').length, gruppi: e.querySelectorAll('.t-gruppo').length, attesa: e.querySelector('.terminale').classList.contains('in-attesa')}));
ok('«Riproduci» dell\'impronta: i gruppi si accendono uno alla volta, alla fine tutti e 16', meta.uguali < meta.gruppi && fine.uguali === 16 && fine.gruppi === 16 && !fine.attesa, JSON.stringify({meta, fine}));
const scr = p.locator('#pagina-installa .cat-prova').filter({hasText: 'il comando che si scrive, lettera per lettera'});
await scr.scrollIntoViewIfNeeded(); await scr.getByRole('button', {name: 'Riproduci'}).click(); await p.waitForTimeout(110);
const mezzo = await scr.evaluate(e => { const t = e.querySelector('.t-scrive'); return {fatto: (t.querySelector('.t-fatto') || {textContent: ''}).textContent.length, intero: t.textContent.length, cursore: !!t.querySelector('.t-cursore')}; });
await p.waitForTimeout(2500);
const scritto = await scr.evaluate(e => { const t = e.querySelector('.t-scrive'); return {testo: t.textContent, cursore: !!t.querySelector('.t-cursore')}; });
ok('«Riproduci» del comando: lettera per lettera (a metà c\'è il cursore e ne manca un pezzo), alla fine il comando intero', mezzo.cursore && mezzo.fatto > 0 && mezzo.fatto < mezzo.intero && scritto.testo === 'makepkg -si' && !scritto.cursore, JSON.stringify({mezzo, scritto}));
const veri = errori.filter(e => !/Failed to load resource.*(favicon|\.opus|\.mp3)/.test(e));
ok('console pulita', veri.length === 0, veri.join(' | '));
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-catalogo-${motore}-${misura}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
