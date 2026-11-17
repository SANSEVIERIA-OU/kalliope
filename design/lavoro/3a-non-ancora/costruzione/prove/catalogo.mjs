// Il catalogo vivo delle pagine interne: si apre, si guardano le sezioni nuove, si provano i comandi e si fotografano le schede.
// Uso: PLAYWRIGHT=… node catalogo.mjs <cartella-sito> <uscita> <motore> <WxH>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore = 'chromium', misura = '1440x900'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
const esiti = []; const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
await p.goto(base + 'design-system/catalogo/', {waitUntil: 'load'});
await p.waitForFunction(() => window.__catalogoPagine, null, {timeout: 30000});
await p.waitForTimeout(1500);
const stato = await p.evaluate(() => ({cat: window.__catalogo && {token: window.__catalogo.token, errori: window.__catalogo.errori}, pagine: window.__catalogoPagine, stato: document.querySelector('#stato-catalogo').textContent}));
ok('il catalogo principale si costruisce senza errori', stato.cat && stato.cat.errori.length === 0, JSON.stringify(stato.cat));
ok('le sezioni delle pagine interne si costruiscono senza errori', stato.pagine && stato.pagine.errori.length === 0, JSON.stringify(stato.pagine));
const n = await p.evaluate(() => ({schede: document.querySelectorAll('#pagine-interne .cat-scheda').length, prove: document.querySelectorAll('#pagine-interne .cat-prova').length, viva: document.querySelectorAll('#pagine-interne iframe').length, indice: [...document.querySelectorAll('#indice a')].map(a => a.textContent).join(' | ')}));
ok('cinque schede (cornice, riunione ferma, strada ferma, versioni, ascolto)', n.schede === 5, `${n.schede} schede, ${n.prove} prove, ${n.viva} pagine vive`);
ok('la sezione sta nell\'indice', /Pagine interne/.test(n.indice), n.indice);
// le sei misure e i loro numeri
const sezione = p.locator('#pagine-interne');
await sezione.scrollIntoViewIfNeeded();
await p.locator('#pagine-interne .cat-tabella').first().scrollIntoViewIfNeeded();
await p.waitForTimeout(14000);
console.log('   errori pagine:', JSON.stringify(await p.evaluate(() => window.__catalogoPagine.errori)));
const tab = await p.evaluate(() => [...document.querySelectorAll('#pagine-interne .cat-tabella tbody tr')].map(r => [...r.cells].map(c => c.textContent)));
ok('la tabella misurata nella pagina viva si riempie (6 misure)', tab.length === 6 && tab.every(r => !r.includes('…')), JSON.stringify(tab));
tab.forEach(r => console.log('   ', r.join(' | ')));
// foto delle schede
const schede = p.locator('#pagine-interne .cat-scheda');
for (let i = 0; i < await schede.count(); i++) {
  await schede.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await assesta(p);
  await schede.nth(i).screenshot({path: `${uscita}/scheda-${i + 1}-${motore}-${misura}.png`});
}
// i comandi del catalogo: Riproduci, la misura
const bottoni = await p.evaluate(() => [...document.querySelectorAll('#pagine-interne .cat-controlli button')].map(x => x.textContent));
ok('i comandi «Riproduci» ci sono', bottoni.filter(x => x === 'Riproduci').length >= 8, `${bottoni.length} comandi`);
await p.locator('.cat-misure button').nth(1).click(); await p.waitForTimeout(500);
ok('la scelta della misura cambia il riquadro', await p.evaluate(() => /390×667/.test(document.querySelector('#pagine-interne .cat-misure + div .cat-et').textContent)));
const veri = errori.filter(e => !/Failed to load resource.*(favicon|\.opus|\.mp3)/.test(e));
ok('console pulita', veri.length === 0, veri.join(' | '));
const w = await p.evaluate(() => document.querySelector('.cap-stati .cat-et').textContent); console.log('   ', w);
ok('il comando ha la stessa larghezza in tutti gli stati', /\(la stessa/.test(w), w);
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-catalogo-${motore}-${misura}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
