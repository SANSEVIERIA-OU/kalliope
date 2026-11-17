// 7 · il selettore della lingua nella barra di «non ancora»: si apre, porta alla stessa pagina nell'altra lingua, si chiude con Esc e con un clic fuori;
// al telefono sta nel menu. Con il sito di prova a più lingue (prove/costruisci-lingue.py) e con quello a una lingua sola (niente selettore).
// Uso: PLAYWRIGHT=… node lingua-barra.mjs <cartella-sito> <uscita> <motore> <WxH[,WxH…]> [--una] [--percorso=non-ancora/]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misure, ...opz] = process.argv.slice(2);
const una = opz.includes('--una'), pag = opz.includes('--home') ? '' : (opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'non-ancora/');
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ALTRA = process.env.LINGUA_ALTRA || 'en', NLINGUE = +(process.env.N_LINGUE || 4);   // l'altra lingua verso cui si va, e quante lingue ha il sito di prova
const esiti = [];
const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number), tel = W <= 959;
  console.log(`\n== ${motore} ${m}${una ? ' (una lingua sola)' : ''}`);
  const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + 'it/' + pag, {waitUntil: 'load'}); await p.waitForTimeout(1500); await assesta(p);
  const barra = await p.evaluate(() => ({selettore: !!document.querySelector('.barra details.lingua-scelta'), vecchia: !!document.querySelector('.barra a[href="#lingue"]'), nome: document.querySelector('.barra .lingua-scelta > summary > span')?.textContent, vociMenu: [...document.querySelectorAll('.barra .menu > ul > li')].length, link: document.querySelector('link[href*="lingue.css"]') ? 'lingue.css' : null, script: [...document.scripts].some(s => /lingua\.js/.test(s.src))}));
  if (una) {
    ok('con una lingua sola nella barra non c\'è né il selettore né la voce di prima', !barra.selettore && !barra.vecchia && !barra.nome, JSON.stringify(barra));
    await p.screenshot({path: `${uscita}/barra-una-${motore}-${m}.png`, clip: {x: 0, y: 0, width: W, height: Math.min(H, 120)}});
    await ctx.close(); continue;
  }
  ok('la barra ha il selettore nuovo (details.lingua-scelta), non la voce di prima', barra.selettore && !barra.vecchia && barra.nome === 'Italiano', JSON.stringify(barra));
  ok('la pagina porta lingue.css e lingua.js (come la home)', barra.link === 'lingue.css' && barra.script);
  const menuAperto = () => p.evaluate(() => document.querySelector('#menu').classList.contains('aperto'));
  const apriMenu = async () => { if (tel && !await menuAperto()) { await p.click('.pulsante-menu'); await p.waitForTimeout(600); } };
  await apriMenu();
  const sommario = p.locator('.barra details.lingua-scelta > summary');
  await sommario.click(); await p.waitForTimeout(700); await assesta(p);
  const aperto = await p.evaluate(() => { const d = document.querySelector('.barra details.lingua-scelta'), ul = d.querySelector('.lingue-elenco'), r = ul.getBoundingClientRect(); return {aperto: d.open, voci: [...ul.querySelectorAll('a')].map(a => ({testo: a.textContent.trim(), href: a.getAttribute('href'), lang: a.lang})), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), vh: innerHeight, vw: innerWidth}; });
  ok('si apre e mostra le lingue del sito', aperto.aperto && aperto.voci.length === NLINGUE, JSON.stringify(aperto.voci));
  ok('l\'elenco sta nello schermo', aperto.bottom <= aperto.vh && aperto.top >= 0 && aperto.left >= 0 && aperto.right <= aperto.vw, JSON.stringify({t: aperto.top, b: aperto.bottom, l: aperto.left, r: aperto.right}));
  await p.screenshot({path: `${uscita}/barra-aperta-${motore}-${m}.png`});
  const link = aperto.voci.find(v => v.lang === ALTRA);
  ok('il collegamento di una lingua porta alla stessa pagina in quella lingua', link && new URL(link.href, base + 'it/' + pag).pathname === '/' + ALTRA + '/' + pag, link ? `${link.href} → ${new URL(link.href, base + 'it/' + pag).pathname}` : 'manca');
  // Esc chiude e riporta il fuoco sul nome (al telefono il menu si chiude insieme all'elenco, come nella home: il fuoco va su «Menu»); un clic fuori chiude
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  ok('Esc chiude l\'elenco' + (tel ? ' (il menu può restare aperto o chiudersi: lo decide lo script della scelta, lo stesso della home)' : ' e il fuoco torna sul nome della lingua'), await p.evaluate(t => !document.querySelector('.barra details.lingua-scelta').open && (t ? true : document.activeElement && document.activeElement.tagName === 'SUMMARY'), tel));
  await apriMenu();
  await sommario.click(); await p.waitForTimeout(300);
  await p.mouse.click(5, H - 5); await p.waitForTimeout(400);
  ok('un clic fuori chiude l\'elenco', await p.evaluate(() => !document.querySelector('.barra details.lingua-scelta').open));
  await apriMenu();
  // andare davvero: il clic porta a en/non-ancora/, la barra lì dice «English…», il selettore c'è anche lì e porta indietro
  await sommario.click(); await p.waitForTimeout(300);
  await Promise.all([p.waitForURL('**/' + ALTRA + '/' + pag), p.locator(`.barra .lingue-elenco a[lang="${ALTRA}"]`).click()]);
  await p.waitForTimeout(1200); await assesta(p);
  const en = await p.evaluate(() => ({lang: document.documentElement.lang, dir: document.documentElement.dir, nome: document.querySelector('.barra .lingua-scelta > summary > span')?.textContent, ritorno: [...document.querySelectorAll('.barra .lingue-elenco a')].map(a => a.getAttribute('href')), titolo: document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)}));
  ok('arrivati nell\'altra lingua: stessa pagina, lang giusto, il selettore dice la lingua di adesso', en.lang === ALTRA, JSON.stringify(en));
  ok('e riporta alla pagina italiana', en.ritorno.some(h => new URL(h, base + 'en/' + pag).pathname === '/it/' + pag), JSON.stringify(en.ritorno));
  await p.screenshot({path: `${uscita}/barra-en-${motore}-${m}.png`, clip: {x: 0, y: 0, width: W, height: Math.min(H, 160)}});
  // in arabo: da destra a sinistra, il selettore a sinistra della barra e l'elenco dentro lo schermo
  await p.goto(base + 'ar/' + pag, {waitUntil: 'load'}); await p.waitForTimeout(1200);
  if (tel) { await p.click('.pulsante-menu'); await p.waitForTimeout(600); }
  await p.locator('.barra details.lingua-scelta > summary').click(); await p.waitForTimeout(700); await assesta(p);
  const ar = await p.evaluate(() => { const ul = document.querySelector('.barra .lingue-elenco').getBoundingClientRect(); return {dir: document.documentElement.dir, left: Math.round(ul.left), right: Math.round(ul.right), top: Math.round(ul.top), bottom: Math.round(ul.bottom), vw: innerWidth, vh: innerHeight}; });
  ok('in arabo (da destra a sinistra) l\'elenco sta nello schermo', ar.dir === 'rtl' && ar.left >= 0 && ar.right <= ar.vw && ar.bottom <= ar.vh, JSON.stringify(ar));
  await p.screenshot({path: `${uscita}/barra-ar-${motore}-${m}.png`});
  const veri = errori.filter(e => !/Failed to load resource|404/.test(e));
  ok('console pulita', veri.length === 0, veri.join(' | '));
  await ctx.close();
}
await b.close(); server.close();
writeFileSync(`${uscita}/lingua-barra-${motore}${una ? '-una' : ''}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
