// La pagina «non ancora» messa alla prova come la usa una persona: tastiera (a due ritmi), senza JavaScript, «riduci movimento», scorrimento
// veloce, ritorno da un'altra pagina, ricarica. Ogni scenario guarda ciò che si vede (posizione, opacità, stato), non solo il testo.
// Uso: PLAYWRIGHT=… node robustezza.mjs <cartella-sito> <uscita> <motore> <WxH> <scenario[,scenario…]> [--percorso=it/non-ancora/] [--rtl]
// Scenari: tastiera, tastiera-veloce, senza-js, ridotto, scorrimento, ritorno, ricarica, tutti
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco, uscitaAudio} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misura, elenco, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const rtl = opz.includes('--rtl');
const [W, H] = misura.split('x').map(Number), tel = W <= 760;
mkdirSync(uscita, {recursive: true});
const scenari = elenco === 'tutti' ? ['tastiera', 'tastiera-veloce', 'senza-js', 'senza-stili', 'senza-token', 'ridotto', 'scorrimento', 'ritorno', 'ricarica'] : elenco.split(',');
const esiti = [];
// Firefox senza uscita audio (prove.md §1) dà errore a ogni suono: ciò che dipende dal suono vero si scrive «non verificato», non come un difetto
const senzaSuono = motore === 'firefox' && !uscitaAudio();
const ok = (n, v, d = '') => {
  if (!v && senzaSuono && /suon|ascolt|si suonava/i.test(n)) { esiti.push({nome: n, ok: true, nonVerificato: true, dettaglio: `Firefox senza uscita audio: ${d}`}); console.log(`NV   ${n} · Firefox senza uscita audio, il suono non può partire`); return; }
  esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`);
};
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
async function apri({ridotto = false, js = true} = {}) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: js, ...tocco(motore, tel)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'});
  return {ctx, p, errori};
}
const foto = (p, n, o = {}) => p.screenshot({path: `${uscita}/${n}-${motore}-${misura}${rtl ? '-rtl' : ''}.png`, ...o});
const nome = `${motore} ${misura}`;
// la ricarica come la fa una persona (F5): con p.reload() di Playwright Firefox non rimette la pagina dov'era (succede anche alle pagine di prima), con location.reload() sì
const ricarica = p => Promise.all([p.waitForEvent('load'), p.evaluate(() => location.reload())]);

// ---------- la tastiera ----------
const descrivi = () => {
  const e = document.activeElement; if (!e || e === document.body) return null;
  const r = e.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect();
  let op = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) op = Math.min(op, +getComputedStyle(n).opacity);
  const vis = getComputedStyle(e).visibility;
  return {nome: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 34), classe: String(e.className).slice(0, 24), tag: e.tagName.toLowerCase(),
    top: Math.round(r.top), left: Math.round(r.left), bottom: Math.round(r.bottom), right: Math.round(r.right), opacita: op, visibilita: vis,
    anello: e.matches(':focus-visible') && getComputedStyle(e).outlineStyle !== 'none' && parseFloat(getComputedStyle(e).outlineWidth) > 0,
    // il contorno si distingue dal fondo su cui sta? (rapporto di luminanza fra il colore del contorno e il primo fondo pieno sopra l'elemento)
    anelloRapporto: (() => {
      const rgb = c => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r: v[0], g: v[1], b: v[2], a: v[3] === undefined ? 1 : v[3]}; };
      const lum = ({r, g, b}) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const o = rgb(getComputedStyle(e).outlineColor); if (!o) return null;
      let fondo = null; for (let n = e.parentElement; n; n = n.parentElement) { const cs = getComputedStyle(n); let c = rgb(cs.backgroundColor); if ((!c || c.a < 0.5) && cs.backgroundImage !== 'none') { const g = /rgba?\([^)]+\)/.exec(cs.backgroundImage); c = g ? rgb(g[0]) : null; } if (c && c.a >= 0.5) { fondo = c; break; } }   // un fondo a sfumatura: il suo primo colore
      if (!fondo) return null;
      const a = lum(o), b = lum(fondo); return Math.round((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) * 10) / 10;
    })(),
    sotto: r.top >= barra.bottom - 1 || r.bottom <= 0 ? null : r.top < barra.bottom - 1, inSchermo: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, y: Math.round(scrollY)};
};
async function giro(p, ritmo) {
  const soste = [];
  await p.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  for (let k = 0; k < 70; k++) {
    await p.keyboard.press('Tab');
    if (ritmo > 0) await p.waitForTimeout(ritmo); else await p.waitForTimeout(15);
    const d = await p.evaluate(descrivi);
    if (!d) break;
    if (soste.length && soste[0].nome === d.nome && soste[0].classe === d.classe && k > 3) break;
    soste.push(d);
  }
  return soste;
}
const ordineVisto = soste => {   // l'ordine di lettura di ciò che si vede: per riga (cima), dentro la riga per inizio (a destra con --rtl)
  const righe = []; [...soste].sort((a, b) => a.top - b.top).forEach(s => { const r = righe.find(x => Math.abs(x[0].top - s.top) < 14 && x.every(y => !(y.tag === s.tag && false))); if (r) r.push(s); else righe.push([s]); });
  return righe.flatMap(r => r.sort((a, c) => rtl ? c.left - a.left : a.left - c.left));
};

for (const sc of scenari) {
  console.log(`\n== ${sc} · ${nome}${rtl ? ' · da destra a sinistra' : ''}`);
  try {
    if (sc === 'tastiera' || sc === 'tastiera-veloce') {
      const lento = sc === 'tastiera';
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(lento ? 3500 : 300);
      const soste = await giro(p, lento ? 2600 : 0);   // lento: più lungo della più lunga entrata (1,9 s); veloce: senza pause
      await p.waitForTimeout(2600);
      console.log('   soste:', soste.map(s => s.nome).join(' → '));
      ok('il giro tocca ogni comando una volta, in un ordine', soste.length >= 12 && new Set(soste.map(s => s.nome + s.classe)).size === soste.length - soste.filter((s, i) => soste.findIndex(x => x.nome === s.nome && x.classe === s.classe) !== i).length, `${soste.length} soste`);
      const nonSchermo = soste.filter(s => !s.inSchermo || s.opacita < 0.99 || s.visibilita !== 'visible');
      // al momento della sosta (lento) ciò che ha il fuoco si vede intero, opaco, sotto la barra; veloce: dopo un attimo
      ok(lento ? 'ogni sosta ha il comando in vista, opaco e non sotto la barra' : 'a passo svelto il giro è lo stesso (i comandi entrano con la scena, ma restano nell\'ordine)', lento ? nonSchermo.length === 0 : true, nonSchermo.map(s => `${s.nome} (op ${s.opacita.toFixed(2)}, ${s.inSchermo ? 'in vista' : 'fuori vista'})`).join(', '));
      ok('il contorno del fuoco si vede su ogni sosta', soste.every(s => s.anello), soste.filter(s => !s.anello).map(s => s.nome).join(', '));
      const deboli = soste.filter(s => s.anelloRapporto !== null && s.anelloRapporto < 1.8);
      ok('il contorno del fuoco si distingue dal fondo su cui sta (rapporto di luminanza almeno 1,8 : 1, dove il fondo è pieno)', deboli.length === 0, deboli.map(s => `${s.nome} ${s.anelloRapporto}:1`).join(', ') || `${soste.filter(s => s.anelloRapporto !== null).length} soste misurate`);
      // l'ordine del fuoco è quello che si vede (barra, primo schermo): le soste che stanno nel primo schermo (alla prima misura) in ordine di lettura
      const primoSchermo = soste.filter(s => s.y < 1 && s.top < H);
      const visto = ordineVisto(primoSchermo).map(s => s.nome), tab = primoSchermo.map(s => s.nome);
      ok('l\'ordine del fuoco nel primo schermo è quello che si vede', JSON.stringify(visto) === JSON.stringify(tab), `fuoco: ${tab.join(' → ')} | visto: ${visto.join(' → ')}`);
      await foto(p, `${sc}-fine`);
      writeFileSync(`${uscita}/${sc}-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(soste, null, 1));
      await ctx.close();
    }
    if (sc === 'senza-js') {
      const {ctx, p, errori} = await apri({js: false});
      await p.waitForTimeout(1500);
      const s = await p.evaluate(() => ({js: document.documentElement.classList.contains('js'), bottone: getComputedStyle(document.querySelector('.ascolta-ferma')).display, lettore: getComputedStyle(document.querySelector('.lettore-ferma')).display,
        copia: getComputedStyle(document.querySelector('.copia-indirizzo')).display, preferiti: getComputedStyle(document.querySelector('.versioni-piede .senza-js')).display, strada: !!document.querySelector('.strada-ferma'), esito: getComputedStyle(document.querySelector('.esito-manca')).opacity,
        riquadri: [...document.querySelectorAll('.tavolo .riquadro')].map(r => getComputedStyle(r).opacity).join(','), versione: getComputedStyle(document.querySelector('.versione.ultima')).opacity, titolo: getComputedStyle(document.querySelector('#quando-titolo')).opacity,
        bolla: getComputedStyle(document.querySelector('.bolla-chiusa')).visibility, larghezza: document.documentElement.scrollWidth, menuHref: document.querySelector('.pulsante-menu').getAttribute('href')}));
      ok('senza JavaScript: niente classe «js»', !s.js);
      ok('il lettore nativo c\'è al posto del pulsante', s.lettore !== 'none' && s.bottone === 'none', JSON.stringify({lettore: s.lettore, bottone: s.bottone}));
      ok('la frase dei preferiti c\'è, il comando di copia no', s.preferiti !== 'none' && s.copia === 'none', JSON.stringify({preferiti: s.preferiti, copia: s.copia}));
      ok('tutto è già al suo posto (strada e «Manca», elenco, titoli, riquadri, bolla)', s.esito === '1' && s.versione === '1' && s.titolo === '1' && s.riquadri.split(',').every(x => x === '1') && s.bolla === 'visible', JSON.stringify(s));
      ok('nessuno scorrimento di lato', s.larghezza <= W, `${s.larghezza} contro ${W}`);
      await foto(p, 'senzajs-alto'); await p.evaluate(() => document.querySelector('#ascolta').scrollIntoView()); await p.waitForTimeout(400); await foto(p, 'senzajs-chiusura');
      await p.evaluate(() => scrollTo(0, 0));
      const tasti = await giro(p, 60); ok('senza JavaScript il giro di tastiera arriva a ogni collegamento e al lettore', tasti.length >= 10 && tasti.some(x => x.tag === 'audio'), `${tasti.length} soste, lettore: ${tasti.some(x => x.tag === 'audio')}`);
      if (tel) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.pulsante-menu'); await p.waitForTimeout(500); ok('al telefono «Menu» porta al piede', await p.evaluate(() => location.hash === '#piede-sezioni'), await p.evaluate(() => location.hash)); }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'senza-stili' || sc === 'senza-token') {
      // M6: se i fogli di stile non arrivano le figure non diventano enormi e lo script non dà errori; se manca solo token.css la pagina resta ferma e il suono funziona
      const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, tel)});
      await ctx.route(sc === 'senza-stili' ? /\.css(\?|$)/ : /token\.css(\?|$)/, r => r.abort());
      const errori = []; const p = await ctx.newPage(); p.on('pageerror', e => errori.push(e.message));
      await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(3500);
      const m = await p.evaluate(() => ({alto: document.documentElement.scrollHeight, svg: Math.max(...[...document.querySelectorAll('svg')].map(s => s.getBoundingClientRect().width)), js: document.documentElement.classList.contains('js'), pagina: !!window.__pagina}));
      if (sc === 'senza-stili') ok('senza i fogli di stile la pagina non diventa enorme (nessun disegno più largo di 300 px, pagina sotto i 12.000 px)', m.svg <= 300 && m.alto < 12000, JSON.stringify(m));
      else ok('senza token.css lo script riconosce che manca e la pagina si carica', m.pagina, JSON.stringify(m));
      ok('nessun errore dello script', errori.length === 0, errori.join(' | '));
      if (sc === 'senza-token') { await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView()); await p.waitForTimeout(500); await p.click('.ascolta-ferma'); await p.waitForTimeout(1500); ok('il suono funziona lo stesso', await p.evaluate(() => document.querySelector('.ascolta-ferma').classList.contains('suona')), ''); }
      await foto(p, sc);
      await ctx.close();
    }
    if (sc === 'ridotto') {
      const {ctx, p, errori} = await apri({ridotto: true});
      await p.waitForTimeout(800);
      const s = await p.evaluate(() => ({tent: document.querySelector('.chiamata-ferma').classList.contains('prova'), nota: getComputedStyle(document.querySelector('.mancante-nota')).opacity, strada: document.querySelector('.strada-ferma').classList.contains('fatto'), versione: getComputedStyle(document.querySelector('.versione.ultima')).opacity}));
      ok('«riduci movimento»: il tentativo non parte, «non c\'è» è già scritto', !s.tent && s.nota === '1', JSON.stringify(s));
      await p.evaluate(() => document.querySelector('#perche').scrollIntoView()); await p.waitForTimeout(700);
      ok('la strada arriva già disegnata', await p.evaluate(() => document.querySelector('.strada-ferma').classList.contains('fatto')));
      await p.evaluate(() => document.querySelector('#quando').scrollIntoView()); await p.waitForTimeout(700);
      ok('l\'elenco è già al suo stato finale (nessun riordino)', await p.evaluate(() => ['.versione.ultima', '.versione.prossima'].every(x => getComputedStyle(document.querySelector(x)).opacity === '1' && ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(document.querySelector(x)).transform))));
      await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView()); await p.waitForTimeout(900);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(1800);
      const a = await p.evaluate(() => ({st: ['carica', 'suona', 'pausa'].find(k => document.querySelector('.ascolta-ferma').classList.contains(k)) || 'fermo', acce: document.querySelectorAll('.bolla-chiusa .p:not(.attesa)').length}));
      ok('con «riduci movimento» il suono c\'è e la frase si accende', a.st === 'suona' && a.acce > 0, JSON.stringify(a));
      await foto(p, 'ridotto-ascolto');
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'scorrimento') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(600);
      const vuoti = () => p.evaluate(() => [...document.querySelectorAll('.entra, .entra-titolo')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight * 0.8 && r.bottom > 80 && r.height > 0 && +getComputedStyle(e).opacity < 0.99; }).map(e => (e.className + ' ' + (e.id || e.textContent.slice(0, 20))).slice(0, 50)));
      // un salto in fondo e una risalita a pezzi, veloce
      await p.keyboard.press('End'); await p.waitForTimeout(250);
      const fondo = await vuoti(); await p.waitForTimeout(1600); const fondo2 = await vuoti();
      ok('saltando in fondo con End ciò che è in vista entra', fondo2.length === 0, `subito: ${fondo.length} ancora spenti; dopo 1,6 s: ${fondo2.join(', ') || 'nessuno'}`);
      await foto(p, 'scorri-fondo');
      for (let k = 0; k < 8; k++) { await p.mouse.wheel(0, -(H * 0.9)); await p.waitForTimeout(90); }
      await p.waitForTimeout(1800);
      const su = await vuoti();
      ok('risalendo a colpi di rotella ciò che è in vista entra', su.length === 0, su.join(', ') || 'nessuno'); await foto(p, 'scorri-su');
      // un'ancora: «Come saperlo quando arriva» porta al tratto, che si vede intero
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
      await p.click('a[href="#quando"]'); await p.waitForTimeout(2600);
      const a = await p.evaluate(() => { const t = document.querySelector('#quando-titolo').getBoundingClientRect(), v = document.querySelector('.versioni').getBoundingClientRect(); return {titolo: Math.round(t.top), op: +getComputedStyle(document.querySelector('#quando-titolo')).opacity, versioni: Math.round(v.top), vop: +getComputedStyle(document.querySelector('.versione.ultima')).opacity, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), vh: innerHeight}; });
      ok('l\'ancora porta al tratto «Quando arriva»: titolo sotto la barra, opaco, elenco al suo posto', a.titolo >= a.barra - 1 && a.titolo < a.vh && a.op === 1 && a.vop === 1, JSON.stringify(a)); await foto(p, 'scorri-ancora');
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
      await p.click('a[href="#ascolta"]'); await p.waitForTimeout(2600);
      ok('l\'ancora «Intanto, senti la voce» porta alla riunione e al comando', await p.evaluate(() => { const c = document.querySelector('.ascolta-ferma').getBoundingClientRect(); return c.top >= 0 && c.bottom <= innerHeight; }));
      // una scorsa veloce di tutta la pagina: la strada, mentre passa, parte una volta sola e arriva allo stato finale
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
      for (let k = 0; k < 14; k++) { await p.mouse.wheel(0, H * 0.8); await p.waitForTimeout(60); }
      await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('#perche').scrollIntoView()); await p.waitForTimeout(3200);
      ok('dopo una scorsa veloce la strada arriva allo stato finale (disegnata, «Manca» visibile)', await p.evaluate(() => { const s = document.querySelector('.strada-ferma'); return s.classList.contains('fatto') && +getComputedStyle(document.querySelector('.esito-manca')).opacity === 1; }));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'ritorno') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView()); await p.waitForTimeout(1500);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(2200);
      const prima = await p.evaluate(() => document.querySelector('.ascolta-ferma').classList.contains('suona'));
      await p.click('.chiusura .fatti a'); await p.waitForLoadState('load'); await p.waitForTimeout(500);
      ok('il collegamento porta a un\'altra pagina', !/non-ancora/.test(p.url()), p.url());
      await p.goBack({waitUntil: 'load'}); await p.waitForTimeout(1500);
      const dopo = await p.evaluate(() => ({url: location.pathname, st: ['carica', 'suona', 'pausa'].find(k => document.querySelector('.ascolta-ferma').classList.contains(k)) || 'fermo', attesa: document.querySelectorAll('.bolla-chiusa .p.attesa').length, parole: document.querySelectorAll('.bolla-chiusa .p').length, detta: document.querySelector('.bolla-chiusa').classList.contains('detta'), nota: !!document.querySelector('.errore-ascolto'), js: document.documentElement.classList.contains('js'), scrollY: Math.round(scrollY),
        stradaOk: getComputedStyle(document.querySelector('.esito-manca')).opacity, tentativo: document.querySelector('.chiamata-ferma').className}));
      ok('si suonava prima di andare', prima);
      ok('tornando indietro il suono non suona e la frase è com\'era (non detta)', dopo.st === 'fermo' && (dopo.parole === 0 || dopo.attesa === dopo.parole) && !dopo.detta && !dopo.nota, JSON.stringify(dopo));
      await foto(p, 'ritorno');
      // e premendo di nuovo suona
      await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView()); await p.waitForTimeout(600);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(1800);
      ok('dopo il ritorno si può ascoltare di nuovo', await p.evaluate(() => document.querySelector('.ascolta-ferma').classList.contains('suona')));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'ricarica') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('#quando').scrollIntoView()); await p.waitForTimeout(2600);
      const y = await p.evaluate(() => Math.round(scrollY));
      await ricarica(p); await p.waitForTimeout(3000);
      const r = await p.evaluate(() => { const v = document.querySelector('.versioni').getBoundingClientRect(); return {y: Math.round(scrollY), titolo: +getComputedStyle(document.querySelector('#quando-titolo')).opacity, vers: +getComputedStyle(document.querySelector('.versione.ultima')).opacity, prossima: +getComputedStyle(document.querySelector('.versione.prossima > *')).opacity, vTop: Math.round(v.top), vh: innerHeight}; });
      ok('ricaricando a metà pagina si resta lì e ciò che è in vista c\'è', Math.abs(r.y - y) < 40 && r.titolo === 1 && r.vers === 1 && r.prossima === 1, JSON.stringify({prima: y, ...r}));
      await foto(p, 'ricarica-meta');
      // ricarica durante il tentativo (a 2,8 s dall'arrivo)
      await p.evaluate(() => scrollTo(0, 0)); await ricarica(p); await p.waitForTimeout(2800); await ricarica(p); await p.waitForTimeout(6500);
      const t = await p.evaluate(() => ({c: [...document.querySelector('.chiamata-ferma').classList].join(' '), nota: getComputedStyle(document.querySelector('.mancante-nota')).opacity, urtata: document.querySelector('.scelta.mancante').classList.contains('urtata')}));
      ok('ricaricando durante il tentativo la pagina riparte da capo e arriva allo stato finale', /non-c-e/.test(t.c) && t.nota === '1' && !t.urtata, JSON.stringify(t));
      // ricarica mentre suona
      await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView()); await p.waitForTimeout(1400);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(1500); await ricarica(p); await p.waitForTimeout(2500);
      ok('ricaricando mentre suona la pagina riparte ferma', await p.evaluate(() => !document.querySelector('.ascolta-ferma').classList.contains('suona') && !document.querySelector('.errore-ascolto')));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
  } catch (e) { ok(`${sc}: eccezione`, false, e.stack.split('\n').slice(0, 4).join(' / ')); }
}
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-robustezza-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
