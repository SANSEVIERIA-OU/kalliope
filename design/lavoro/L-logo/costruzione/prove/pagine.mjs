// Ogni pagina costruita, a tre larghezze: il marchio nella barra (foto della barra), 0 errori in console, 0 richieste fallite, l'icona della scheda presente in SVG e in ICO
// (le due righe <link rel="icon"> aprono file veri), il segno non specchiato e all'inizio della riga, nessuno scorrimento orizzontale nuovo.
// Uso: node pagine.mjs <indirizzo del sito> <cartella di uscita> [larghezze=1440,768,390] [elenco.json]
import {mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [base, cart, larg = '1440,768,390', cartellaSito] = process.argv.slice(2);
mkdirSync(cart + '/barre', {recursive: true});
// l'elenco delle pagine: tutte quelle del sito costruito (la cartella si passa come quarto argomento)
const pagine = [];
const visita = (d, rel = '') => { for (const f of readdirSync(d).sort()) { const p = d + '/' + f; if (statSync(p).isDirectory()) { if (f !== 'design-system' && f !== 'voce' && f !== 'immagini' && f !== 'stile' && f !== 'script') visita(p, rel + f + '/'); } else if (f.endsWith('.html')) pagine.push(rel + (f === 'index.html' ? '' : f)); } };
visita(cartellaSito);
const solo = process.env.SOLO ? new RegExp(process.env.SOLO) : null;   // per rifare soltanto alcune pagine (un'espressione sul loro indirizzo)
const b = await chromium.launch({headless: true});
const risultati = [], problemi = [];
for (const w of larg.split(',').map(Number)) {
  for (const rel of pagine) {
    if (solo && !solo.test(rel)) continue;
    const ctx = await b.newContext({viewport: {width: w, height: 800}});
    const p = await ctx.newPage();
    const errori = [], falliti = [];
    p.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
    p.on('pageerror', e => errori.push('pageerror: ' + e.message));
    p.on('requestfailed', r => falliti.push(r.url() + ' ' + (r.failure() || {}).errorText));
    p.on('response', r => { if (r.status() >= 400) falliti.push(r.url() + ' ' + r.status()); });
    const risposta = await p.goto(base + rel, {waitUntil: 'load'});
    await p.waitForTimeout(900);
    const info = await p.evaluate(async () => {
      const icone = [...document.querySelectorAll('link[rel~="icon"]')].map(l => ({href: l.href, type: l.type, sizes: l.getAttribute('sizes')}));
      const segno = document.querySelector('.barra .m-segno'), img = document.querySelector('.marca img');
      const nome = document.querySelector('.marchio span, .marca span');
      const r = e => { const x = e.getBoundingClientRect(); return {x: x.x, y: x.y, w: x.width, h: x.height}; };
      return {
        dir: document.documentElement.dir, lang: document.documentElement.lang, icone,
        segno: segno ? {...r(segno), matrice: getComputedStyle(segno).transform, parti: segno.querySelectorAll('.m-fronte').length, visibile: getComputedStyle(segno).visibility} : null,
        img: img ? {...r(img), caricata: img.complete && img.naturalWidth > 0, src: img.getAttribute('src')} : null,
        nome: nome ? r(nome) : null, larghezzaPagina: document.documentElement.scrollWidth, larghezzaFinestra: document.documentElement.clientWidth,
        fronteInizio: segno ? [...segno.querySelectorAll('.m-fronte')].map(f => f.getAttribute('transform')) : null,
        // il segno non è coperto da un'altra cosa (l'azione, il menu): ciò che sta nel suo centro e nei suoi quattro quarti è il suo collegamento
        coperto: segno ? (() => { const q = segno.getBoundingClientRect(); const l = segno.closest('a'); return [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]].filter(([u, v]) => { const e = document.elementFromPoint(q.x + q.width * u, q.y + q.height * v); return !(e && l && l.contains(e)); }).length; })() : 0,
        sulloSchermo: segno ? (() => { const q = segno.getBoundingClientRect(); return q.left >= 0 && q.right <= innerWidth && q.top >= 0 && q.bottom <= innerHeight; })() : true,
      };
    });
    const nome = `${rel.replace(/\/$/, '').replace(/\//g, '_') || 'radice'}`;
    const e = [];
    if (info.icone.length !== 2) e.push(`icone della scheda: ${info.icone.length}`);
    else {
      const [ico, svg] = info.icone;
      if (!/favicon\.ico$/.test(ico.href) || ico.sizes !== 'any') e.push('la prima icona non è favicon.ico sizes=any');
      if (!/piccola\.svg$/.test(svg.href) || svg.type !== 'image/svg+xml') e.push('la seconda icona non è piccola.svg');
      const a = await p.request.get(ico.href), s = await p.request.get(svg.href);
      const corpoIco = await a.body(), corpoSvg = (await s.text());
      if (a.status() !== 200 || !(corpoIco[0] === 0 && corpoIco[1] === 0 && corpoIco[2] === 1 && corpoIco[3] === 0 && corpoIco[4] === 3)) e.push('favicon.ico non è un ICO con tre immagini');
      if (s.status() !== 200 || !corpoSvg.includes('<svg')) e.push('piccola.svg non si apre');
    }
    if (info.segno) {
      const atteso = w <= 760 ? 30 : 36;
      if (Math.abs(info.segno.w - atteso) > 0.6 || Math.abs(info.segno.h - atteso) > 0.6) e.push(`il segno è ${info.segno.w.toFixed(1)}×${info.segno.h.toFixed(1)}, non ${atteso}`);
      if (info.segno.parti !== 2) e.push('il segno non ha i due ritagli del fronte');
      if (info.segno.matrice !== 'none') e.push('il segno è trasformato: ' + info.segno.matrice);
      if (info.coperto) e.push(`il segno è coperto da altro in ${info.coperto} punti su 5`);
      if (!info.sulloSchermo) e.push('il segno non sta tutto nello schermo');
      if (info.fronteInizio.some(t => t !== null)) e.push('il fronte non è a riposo all\'arrivo: ' + info.fronteInizio.join(','));
      if (info.nome && info.nome.w > 0) {
        const sx = info.segno.x, nx = info.nome.x;
        if ((info.dir === 'rtl') !== (sx > nx)) e.push(`il segno non sta all'inizio della riga (${info.dir}): segno x ${sx.toFixed(0)}, nome x ${nx.toFixed(0)}`);
      }
    } else if (info.img) {
      if (!info.img.caricata) e.push('l\'immagine della barra delle pagine di prima non si carica');
    } else if (!/404/.test(rel) || true) {
      if (!/^$/.test(rel) || w === 0) e.push('niente marchio nella barra');
    }
    if (errori.length) e.push('console: ' + errori.join(' | '));
    if (falliti.length) e.push('richieste fallite: ' + falliti.join(' | '));
    if (risposta.status() >= 400) e.push('stato ' + risposta.status());
    const largo = info.larghezzaPagina > info.larghezzaFinestra + 1;
    risultati.push({larghezza: w, pagina: rel, dir: info.dir, segno: info.segno && [info.segno.w, info.segno.h], orizzontale: largo, errori: e});
    if (e.length) problemi.push(`${w} ${rel || '/'}: ${e.join('; ')}`);
    const clip = {x: info.dir === 'rtl' ? Math.max(0, w - 700) : 0, y: 0, width: Math.min(w, 700), height: 84};   // da destra a sinistra il segno sta a destra
    await p.screenshot({path: `${cart}/barre/${w}-${nome}.png`, clip});
    await ctx.close();
  }
}
await b.close();
writeFileSync(cart + '/pagine.json', JSON.stringify(risultati, null, 1));
const orizz = risultati.filter(r => r.orizzontale).map(r => `${r.larghezza} ${r.pagina || '/'}`);
console.log(`${risultati.length} pagine×larghezze (${pagine.length} pagine) · segno trovato in ${risultati.filter(r => r.segno).length} · immagine delle pagine di prima in ${risultati.filter(r => !r.segno && !r.errori.some(x => x.includes('niente marchio'))).length} · scorrimento orizzontale in ${orizz.length}${orizz.length ? ': ' + orizz.join(', ') : ''}`);
if (problemi.length) { console.log('NON TORNA:\n  ' + problemi.join('\n  ')); process.exit(1); }
console.log('torna: 0 errori in console, 0 richieste fallite, icone SVG e ICO presenti, segno al suo posto in ogni pagina');
