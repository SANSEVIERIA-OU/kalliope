// La pagina «installa» messa alla prova come la usa una persona: la scelta della distribuzione (mouse, tocco, tastiera, senza JavaScript, tornando indietro e ricaricando, a metà dell'arrivo),
// gli indirizzi della pagina di prima, la tastiera a due ritmi, le frasi della finestra, «Copia» che riesce e che non riesce, senza JavaScript, senza stili, senza token, «riduci movimento»,
// scorrimento veloce e ritorno in su, scheda in secondo piano, ritorno da un'altra pagina, ricarica. Ogni scenario guarda ciò che si vede (posizione, opacità, stato), non solo il testo.
// Uso: node robustezza.mjs <cartella-sito> <uscita> <motore> <WxH> <scenario[,scenario…]> [--percorso=it/installa/] [--rtl]     (PORTA=… per la porta)
// Scenari: primo e stabile (con --lingua=xx), sistema, ancore, appunti (cosa si copia: appunti veri e selezione a mano), tastiera, tastiera-veloce, frasi, copia, senza-js, senza-stili, senza-token, ridotto, scorrimento, secondo-piano, ritorno, ricarica, a-meta, tutti
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina, tocco} = await import(SKILL + '/scripts/lib/comune.mjs');
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misura, elenco, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/installa/';
const rtl = opz.includes('--rtl');
const senzaIsolati = v => typeof v === 'string' ? v.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '') : Array.isArray(v) ? v.map(senzaIsolati) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, senzaIsolati(x)])) : v;
const [W, H] = misura.split('x').map(Number), tel = W <= 760;
mkdirSync(uscita, {recursive: true});
const TUTTI = ['primo', 'stabile', 'sistema', 'ancore', 'tastiera', 'tastiera-veloce', 'frasi', 'copia', 'senza-js', 'senza-stili', 'senza-token', 'ridotto', 'scorrimento', 'secondo-piano', 'ritorno', 'ricarica', 'a-meta', 'appunti'];
const scenari = elenco === 'tutti' ? TUTTI : elenco.split(',');
const esiti = [];
const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
// il server non dice «no-store»: i browser restituiscono lo stato dei campi (la scelta) tornando indietro e ricaricando, come con il sito vero (GitHub Pages)
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const FINTA_OK = `window.__copiato = []; Object.defineProperty(navigator, 'clipboard', {value: {writeText: t => { window.__copiato.push(t); return Promise.resolve(); }}, configurable: true});`;
const FINTA_NO = `window.__copiato = []; Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('no'))}, configurable: true});`;
const SENZA_APPUNTI = `Object.defineProperty(navigator, 'clipboard', {value: undefined, configurable: true});`;
async function apri({ridotto = false, js = true, permessi = false, prima = null, url = null} = {}) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: js, ...(permessi && motore === 'chromium' ? {permissions: ['clipboard-read', 'clipboard-write']} : {}), ...tocco(motore, tel)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  // da destra a sinistra la costruzione isola ogni parte latina della prosa tradotta con segni invisibili (U+2066–2069): le frasi che la prova confronta con una regola («.deb», «Fedora», «La riga della finestra dice»)
  // si leggono senza, come le legge chi guarda. **Ciò che si copia no**: le letture degli appunti, di `window.__copiato` e della selezione restano grezze (20/11/2026: una lettura senza segni applicata a tutto
  // nascondeva i segni dentro i comandi copiati; li controlla lo scenario `appunti`, con gli appunti veri)
  if (rtl) { const ev = p.evaluate.bind(p); p.evaluate = async (f, ...a) => { const r = await ev(f, ...a); return /__copiato|clipboard|getSelection/.test(String(f)) ? r : senzaIsolati(r); }; }
  // anche le richieste fallite e le risposte d'errore sono errori della pagina (non quelle interrotte da una ricarica o da una navigazione)
  p.on('requestfailed', r => { const e = (r.failure() || {}).errorText || ''; if (!/ABORT|cancel|interrupt/i.test(e)) errori.push(`richiesta fallita: ${r.url()} ${e}`); });
  p.on('response', r => { if (r.status() >= 400) errori.push(`${r.status()} ${r.url()}`); });
  if (prima) await prima(p, ctx);
  await p.goto(base + (url ?? percorso), {waitUntil: 'load'});
  return {ctx, p, errori};
}
const foto = (p, n, o = {}) => p.screenshot({path: `${uscita}/${n}-${motore}-${misura}${rtl ? '-rtl' : ''}.png`, ...o});
const nome = `${motore} ${misura}`;
// al telefono un tocco vero dove il motore lo sa fare (Chromium e WebKit); Firefox non ha un contesto con il tocco: lì un clic
const tocca = (p, sel) => tel && motore !== 'firefox' ? p.tap(sel) : p.click(sel);
const ricarica = p => Promise.all([p.waitForEvent('load'), p.evaluate(() => location.reload())]);
const aspetta = async (p, cond, arg, max = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await p.evaluate(cond, arg)) return Date.now() - t0; await p.waitForTimeout(50); } return -1; };
const ATTESO = {deb: {scarica: /\.deb/, comandi: 1, controllo: 2, dice: /Debian 13/}, rpm: {scarica: /\.rpm/, comandi: 1, controllo: 2, dice: /Fedora/}, arch: {scarica: /Arch/, comandi: 3, controllo: 0, dice: /Arch Linux/}, tar: {scarica: /archivio/, comandi: 3, controllo: 2, dice: /archivio/}};
const NOMI = {deb: 'Debian e Ubuntu', rpm: 'Fedora', arch: 'Arch', tar: 'Altre'};
const COMANDO_TERMINALE = {deb: /^sudo apt install \.\/kalliope-.*amd64\.deb$/, rpm: /^sudo dnf install \.\/kalliope-.*x86_64\.rpm$/, arch: /^makepkg -si$/, tar: /^\.\/install$/};
// ciò che la scelta mostra, letto dalla pagina
const mostrato = () => {
  const vis = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const q = s => [...document.querySelectorAll(s)].filter(vis);
  return {
    scelta: (document.querySelector('.sistema-voce:checked') || {}).value,
    pulsanti: q('#comandi-apertura .scarica').map(e => e.textContent.trim().replace(/\s+/g, ' ')),
    dice: q('.sistemi-dice span[data-sistema]').map(e => e.textContent.trim()),
    comandiInstalla: q('#installa .installa-comandi .comando').length,
    comandiControllo: q('#passo-controlla .comando').length,
    cartellaFile: q('.coppia-oggetto .cartella-file').length,
    terminale: q('.terminale-palco .t-comando').map(e => e.textContent.replace(/\s+/g, ' ').trim().replace(/^\$ /, '')),
    togli: q('.togli-comandi li').length,
  };
};

// ---------- la tastiera ----------
const descrivi = () => {
  const e = document.activeElement; if (!e || e === document.body) return null;
  const r = e.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect();
  // un bottone d'opzione non si vede (opacity 0 apposta): si vede la sua etichetta, e lei conta
  let op = 1; for (let n = e.classList.contains('sistema-voce') ? e.nextElementSibling : e; n && n.nodeType === 1; n = n.parentElement) op = Math.min(op, +getComputedStyle(n).opacity);
  const rgb = c => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r: v[0], g: v[1], b: v[2], a: v[3] === undefined ? 1 : v[3]}; };
  const lum = ({r, g, b}) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const o = rgb(getComputedStyle(e).outlineColor);
  let fondo = null; for (let n = e.parentElement; n && o; n = n.parentElement) { const cs = getComputedStyle(n); let c = rgb(cs.backgroundColor); if ((!c || c.a < 0.5) && cs.backgroundImage !== 'none') { const g = /rgba?\([^)]+\)/.exec(cs.backgroundImage); c = g ? rgb(g[0]) : c; } if (c && c.a >= 0.5) { fondo = c; break; } }
  const rapporto = o && fondo ? Math.round((Math.max(lum(o), lum(fondo)) + 0.05) / (Math.min(lum(o), lum(fondo)) + 0.05) * 10) / 10 : null;
  // un bottone d'opzione si vede dalla sua etichetta: il fuoco è sull'etichetta
  const sistema = e.classList.contains('sistema-voce') ? e.nextElementSibling : null;
  const contorno = sistema || e;
  const cs = getComputedStyle(contorno);
  return {nome: (e.getAttribute('aria-label') || (sistema && sistema.textContent) || e.textContent || e.tagName).replace(/[⁦-⁩]/g, '').trim().replace(/\s+/g, ' ').slice(0, 40), classe: String(e.className).slice(0, 24), tag: e.tagName.toLowerCase(),
    top: Math.round((sistema ? sistema.getBoundingClientRect() : r).top), left: Math.round(r.left), bottom: Math.round((sistema ? sistema.getBoundingClientRect() : r).bottom), right: Math.round(r.right), opacita: op, visibilita: getComputedStyle(e).visibility,
    anello: e.matches(':focus-visible') && cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0, anelloRapporto: rapporto,
    sotto: !e.closest('.barra, .salta') && ((sistema ? sistema.getBoundingClientRect() : r).top < barra.bottom - 1 && (sistema ? sistema.getBoundingClientRect() : r).bottom > 0),
    inSchermo: (sistema ? sistema.getBoundingClientRect() : r).top >= 0 && (sistema ? sistema.getBoundingClientRect() : r).bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, yDoc: Math.round(scrollY + (sistema ? sistema.getBoundingClientRect() : r).top), y: Math.round(scrollY)};
};
async function giro(p, ritmo, max = 140) {
  const soste = [];
  await p.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); scrollTo(0, 0); });
  for (let k = 0; k < max; k++) {
    await p.keyboard.press('Tab');
    await p.waitForTimeout(ritmo > 0 ? ritmo : 15);
    const d = await p.evaluate(descrivi);
    if (!d) break;
    if (soste.length && soste[0].nome === d.nome && soste[0].classe === d.classe && k > 3) break;
    const ult = soste[soste.length - 1];
    if (ult && ult.nome === d.nome && ult.classe === d.classe && ult.yDoc === d.yDoc) break;
    soste.push(d);
  }
  return soste;
}
const stazioni = [];   // le soste del giro, per scrivere un file

for (const sc of scenari) {
  console.log(`\n== ${sc} · ${nome}${rtl ? ' · da destra a sinistra' : ''}`);
  try {
    // =================================================================================================================
    if (sc === 'sistema') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(1500);
      const m0 = await p.evaluate(mostrato);
      ok('all\'arrivo: Debian e Ubuntu scelta, un solo pulsante, una sola riga, un comando in «Installa»', m0.scelta === 'deb' && m0.pulsanti.length === 1 && /\.deb/.test(m0.pulsanti[0]) && m0.dice.length === 1 && m0.comandiInstalla === 1, JSON.stringify(m0));
      const radio = await p.evaluate(() => ({n: document.querySelectorAll('input.sistema-voce[type=radio][name=sistema]').length, legenda: !!document.querySelector('fieldset#distribuzione > legend'), etichette: [...document.querySelectorAll('input.sistema-voce')].map(r => !!document.querySelector(`label[for="${r.id}"]`)).every(Boolean)}));
      ok('quattro bottoni d\'opzione dello stesso gruppo, ognuno con la sua etichetta, nel gruppo con la sua legenda', radio.n === 4 && radio.legenda && radio.etichette, JSON.stringify(radio));
      // mouse (o tocco) su ogni etichetta
      for (const s of ['rpm', 'arch', 'tar', 'deb']) {
        await tocca(p, `label[for=sistema-${s}]`);
        await p.waitForTimeout(400);
        const m = await p.evaluate(mostrato), a = ATTESO[s];
        ok(`${tel ? 'tocco' : 'clic'} su «${NOMI[s]}»: scelta, un pulsante giusto, la sua riga, i suoi comandi (${a.comandi} in «Installa», ${a.controllo} nel controllo)`,
          m.scelta === s && m.pulsanti.length === 1 && a.scarica.test(m.pulsanti[0]) && m.dice.length === 1 && a.dice.test(m.dice[0]) && m.comandiInstalla === a.comandi && m.comandiControllo === a.controllo && m.togli === 1, JSON.stringify(m));
        const ann = await aspetta(p, s => /^I comandi della pagina sono quelli per/.test(document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '')), s, 1500);
        ok(`  l'annuncio dice per quale distribuzione sono i comandi («${NOMI[s]}»)`, ann >= 0 && (await p.evaluate(() => document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, ''))).includes(NOMI[s]), await p.evaluate(() => document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '')));
      }
      // il comando del terminale del primo schermo: a fine arrivo è quello della distribuzione scelta, scritto intero
      for (const s of ['arch', 'rpm']) {
        await p.click(`label[for=sistema-${s}]`);
        const t = await aspetta(p, () => { const e = [...document.querySelectorAll('.terminale-palco .t-comando')].find(x => x.getClientRects().length); return e && !document.querySelector('.terminale-palco .t-cursore.lampeggia') && !e.querySelector('.t-resto'); }, null, 9000);
        const m = await p.evaluate(mostrato);
        ok(`il terminale del primo schermo scrive il comando di «${NOMI[s]}» intero`, t >= 0 && COMANDO_TERMINALE[s].test(m.terminale[0] || ''), JSON.stringify(m.terminale));
      }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
      // tastiera, su una pagina nuova (dopo un clic, Tab riparte da lì): Tab porta al gruppo (una sosta), le frecce cambiano la scelta e il fuoco la segue
      const k2 = await apri(); const p2 = k2.p; const errori2 = k2.errori;
      await p2.waitForTimeout(1200);
      await p2.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
      let k = 0; for (; k < 14; k++) { await p2.keyboard.press('Tab'); if (await p2.evaluate(() => document.activeElement.classList.contains('sistema-voce'))) break; }
      const sulGruppo = await p2.evaluate(descrivi);
      ok('Tab arriva al gruppo delle quattro scelte, con una sola sosta (sulla scelta fatta), con il contorno del fuoco sull\'etichetta', k < 14 && sulGruppo.classe.startsWith('sistema-voce') && sulGruppo.anello, JSON.stringify({k, ...sulGruppo}));
      const prima = await p2.evaluate(() => document.querySelector('.sistema-voce:checked').value);
      await p2.keyboard.press(rtl ? 'ArrowLeft' : 'ArrowRight'); await p2.waitForTimeout(400);
      const dopo = await p2.evaluate(() => ({scelta: document.querySelector('.sistema-voce:checked').value, fuoco: document.activeElement.value, ann: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '')}));
      const ordine = ['deb', 'rpm', 'arch', 'tar'];
      ok('freccia: la scelta passa alla seguente e il fuoco la segue, l\'annuncio dice la nuova', dopo.scelta === ordine[(ordine.indexOf(prima) + 1) % 4] && dopo.fuoco === dopo.scelta, JSON.stringify({prima, ...dopo}));
      for (let i = 0; i < 4; i++) { await p2.keyboard.press('ArrowDown'); await p2.waitForTimeout(120); }
      const giro4 = await p2.evaluate(() => document.querySelector('.sistema-voce:checked').value);
      // Chromium e Firefox fanno il giro; il WebKit di Playwright si ferma sull'ultima voce (è del bottone d'opzione nativo, non della pagina)
      ok(`quattro frecce giù: ${motore === 'webkit' ? 'la scelta resta sul gruppo e arriva all\'ultima voce (WebKit non fa il giro) o torna alla stessa' : 'fanno il giro e tornano alla stessa scelta'}`, giro4 === dopo.scelta || (motore === 'webkit' && giro4 === 'tar'), giro4);
      await p2.keyboard.press('Tab'); await p2.waitForTimeout(150);
      const dopoGruppo = await p2.evaluate(descrivi);
      ok('Tab dal gruppo va a «Non uso Linux» (non alle altre tre scelte)', /Non uso Linux/.test(dopoGruppo.nome), dopoGruppo.nome);
      // il pulsante di Arch porta ai comandi di Arch
      await p2.click('label[for=sistema-arch]'); await p2.waitForTimeout(300);
      await p2.click('#comandi-apertura .scarica[data-sistema=arch]'); await p2.waitForTimeout(1800);
      const arco = await p2.evaluate(() => { const t = document.querySelector('#installa-titolo').getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {titolo: Math.round(t.top), barra: Math.round(barra), vh: innerHeight, hash: location.hash, op: +getComputedStyle(document.querySelector('#installa-titolo')).opacity}; });
      ok('«Vai ai comandi per Arch» porta al passo «Installa»: titolo sotto la barra, opaco', arco.hash === '#installa' && arco.titolo >= arco.barra - 1 && arco.titolo < arco.vh && arco.op === 1, JSON.stringify(arco));
      await foto(p2, 'sistema-arch-installa');
      ok('console pulita', errori2.length === 0, errori2.join(' | '));
      await k2.ctx.close();
    }
    // =================================================================================================================
    if (sc === 'primo') {
      // la regola della cornice: nel primo schermo vince il comando. Il pulsante del file sta tutto nello schermo (con un po' d'aria sotto) dove la cornice lo vuole: al computer a ogni altezza,
      // al telefono basso. Al telefono alto (comandi dopo la riunione) e a 326×326 non c'è posto: limiti dichiarati (progresso.md), qui si misura e basta.
      const lingua = (opz.find(o => o.startsWith('--lingua=')) || '').split('=')[1];
      const {ctx, p, errori} = await apri({ridotto: true, url: lingua ? `${lingua}/installa/` : percorso});
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1800);
      const r = await p.evaluate(() => { const e = [...document.querySelectorAll('#comandi-apertura .scarica')].find(x => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden'), q = e.getBoundingClientRect(), st = [...document.querySelectorAll('.stato')].find(x => x.getClientRects().length), s = st.getBoundingClientRect(); return {top: Math.round(q.top), bottom: Math.round(q.bottom), vh: innerHeight, statoTop: Math.round(s.top), statoBottom: Math.round(s.bottom), classi: document.querySelector('.scena-pagina').className.replace('scena scena-pagina', '').trim() || '-', largo: document.documentElement.scrollWidth}; });
      const richiesto = W >= 761 || (W >= 360 && H < 760 && H >= 500);
      ok(`primo schermo${lingua ? ' ' + lingua : ''}: il pulsante del file sta nello schermo (${r.top}–${r.bottom} su ${r.vh}; gradino: ${r.classi}; lo stato «Oggi:» ${r.statoTop}–${r.statoBottom})`, !richiesto || r.bottom <= r.vh, JSON.stringify(r));
      ok('  nessuno scorrimento di lato', r.largo <= W, `${r.largo} contro ${W}`);
      await foto(p, `primo${lingua ? '-' + lingua : ''}`);
      ok('  console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'stabile') {
      // il primo schermo non oscilla: dopo l'arrivo e dopo una scelta le classi del primo schermo (adattaPrimo) non cambiano più, con «riduci movimento» e senza; e il bottone si preme.
      // (Con «riduci movimento» base.css dà 1 ms a ogni transizione: una misura presa subito dopo un cambio di classe leggeva i valori di prima e il gradino oscillava a ogni fotogramma.)
      const lingua = (opz.find(o => o.startsWith('--lingua=')) || '').split('=')[1];
      for (const ridotto of [true, false]) {
        const {ctx, p, errori} = await apri({ridotto, url: lingua ? `${lingua}/installa/` : percorso, prima: p => p.addInitScript(() => { window.__cambi = 0; document.addEventListener('DOMContentLoaded', () => new MutationObserver(m => { window.__cambi += m.length; }).observe(document.querySelector('.scena-pagina'), {attributes: true, attributeFilter: ['class']})); })});
        await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(ridotto ? 2500 : 7500);
        const n1 = await p.evaluate(() => window.__cambi);
        await p.waitForTimeout(1200);
        const fermo = await p.evaluate(() => window.__cambi) === n1;
        let preme = 'ok'; try { await p.click('label[for=sistema-tar]', {timeout: 6000}); } catch (e) { preme = 'NO: ' + String(e.message).split('\n')[0].slice(0, 50); }
        await p.waitForTimeout(1500);
        const a1 = await p.evaluate(() => window.__cambi); await p.waitForTimeout(1200); const a2 = await p.evaluate(() => window.__cambi);
        ok(`il primo schermo${lingua ? ' ' + lingua : ''} ${ridotto ? 'con «riduci movimento»' : 'con il movimento'}: le classi dell'adattamento non cambiano più (${n1} cambi all'arrivo, ${a2 - n1} dopo la scelta) e «Altre» si preme (${preme})`, fermo && a1 === a2 && a2 - n1 < 20 && preme === 'ok', JSON.stringify({n1, fermo, a1, a2, preme}));
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
    }
    // =================================================================================================================
    if (sc === 'ancore') {
      const casi = [['fedora', 'rpm', '#installa-titolo'], ['debian-ubuntu', 'deb', '#installa-titolo'], ['arch', 'arch', '#installa-titolo'], ['altre', 'tar', '#installa-titolo'],
        ['passo-1', null, '#scarica-titolo'], ['passo-2', null, '#passo-controlla .passo-nome'], ['passo-3', null, '#installa-titolo'], ['passo-4', null, '#apri-titolo'], ['passo-5', null, '#microfono-titolo'], ['ripresa', null, '#ripresa-titolo'], ['indirizzo-installa', null, '#inoltra h3']];
      for (const [ancora, scelta, titolo] of casi) {
        const {ctx, p, errori} = await apri({url: `${percorso}#${ancora}`});
        await p.waitForTimeout(2600);
        const r = await p.evaluate(([t, s]) => { const e = document.querySelector(t).getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {titolo: Math.round(e.top), bottom: Math.round(e.bottom), barra: Math.round(barra), vh: innerHeight, op: +getComputedStyle(document.querySelector(t)).opacity, scelta: (document.querySelector('.sistema-voce:checked') || {}).value, y: Math.round(scrollY)}; }, [titolo, scelta]);
        ok(`/#${ancora}${scelta ? ` sceglie «${NOMI[scelta]}»` : ''} e porta al punto giusto: «${titolo}» sotto la barra, nello schermo, opaco`, (!scelta || r.scelta === scelta) && r.titolo >= r.barra - 1 && r.bottom <= r.vh + 2 && r.op === 1, JSON.stringify(r));
        if (ancora === 'fedora' || ancora === 'passo-4') await foto(p, `ancora-${ancora}`);
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
        // gli script o i caratteri arrivano dopo (una rete lenta, una macchina carica): il browser porta al punto quando la pagina è più bassa o più alta di come sarà, e non lo ripete
        // (Firefox: l'indirizzo in fondo alla pagina restava 111 px più in basso; con i caratteri, 175 px più in alto): a pagina assestata il punto sta dove sta quando tutto arriva subito
        for (const [cosa, modello, ms] of [['gli script', '**/*.js', 1200], ['i caratteri', '**/*.woff2', 1500]]) {
          const tardi = async p => { await p.route(modello, async rr => { await new Promise(x => setTimeout(x, ms)); try { await rr.continue(); } catch {} }); };
          const {ctx: c2, p: p2, errori: er2} = await apri({url: `${percorso}#${ancora}`, prima: tardi});
          await p2.waitForTimeout(ms + 2600);
          const q = await p2.evaluate(([t, s]) => { const e = document.querySelector(t).getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {titolo: Math.round(e.top), bottom: Math.round(e.bottom), barra: Math.round(barra), vh: innerHeight, op: +getComputedStyle(document.querySelector(t)).opacity, scelta: (document.querySelector('.sistema-voce:checked') || {}).value, y: Math.round(scrollY)}; }, [titolo, scelta]);
          ok(`  /#${ancora} con ${cosa} che arrivano dopo ${ms} ms: il punto sta dove sta con tutto subito (${r.titolo})`, (!scelta || q.scelta === scelta) && q.titolo >= q.barra - 1 && q.bottom <= q.vh + 2 && Math.abs(q.titolo - r.titolo) <= 3, JSON.stringify(q));
          await c2.close();
        }
      }
      // con la pagina già aperta: un collegamento a un'ancora vecchia (hashchange)
      {
        const {ctx, p, errori} = await apri();
        await p.waitForTimeout(1200);
        await p.evaluate(() => { location.hash = '#fedora'; }); await p.waitForTimeout(1500);
        const r = await p.evaluate(() => ({scelta: document.querySelector('.sistema-voce:checked').value, titolo: Math.round(document.querySelector('#installa-titolo').getBoundingClientRect().top), barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom)}));
        ok('con la pagina aperta, cambiare l\'ancora in #fedora sceglie Fedora e porta ai comandi', r.scelta === 'rpm' && r.titolo >= r.barra - 1 && r.titolo < H, JSON.stringify(r));
        await p.evaluate(() => { location.hash = '#passo-2'; }); await p.waitForTimeout(1200);
        const q = await p.evaluate(() => ({scelta: document.querySelector('.sistema-voce:checked').value, passo: Math.round(document.querySelector('#passo-controlla .passo-nome').getBoundingClientRect().top), barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom)}));
        ok('poi #passo-2 porta al controllo e lascia la scelta com\'era (Fedora)', q.scelta === 'rpm' && q.passo >= q.barra - 1 && q.passo < H, JSON.stringify(q));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // senza JavaScript: l'ancora porta al punto giusto, la scelta resta com'è
      {
        const {ctx, p, errori} = await apri({js: false, url: `${percorso}#fedora`});
        await p.waitForTimeout(1500);
        const r = await p.evaluate(() => ({titolo: Math.round(document.querySelector('#installa-titolo').getBoundingClientRect().top), barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), larghezza: document.documentElement.scrollWidth}));
        ok('senza JavaScript /#fedora porta ai comandi (sceglierla toccherebbe a chi legge), la pagina non scorre di lato', r.titolo >= r.barra - 1 && r.titolo < H && r.larghezza <= W, JSON.stringify(r));
        await ctx.close();
      }
    }
    // =================================================================================================================
    if (sc === 'tastiera' || sc === 'tastiera-veloce') {
      const lento = sc === 'tastiera';
      for (const sistema of ['deb', 'arch']) {
        const {ctx, p, errori} = await apri({prima: p => p.addInitScript(FINTA_OK)});
        await p.waitForTimeout(lento ? 4500 : 300);
        if (sistema !== 'deb') { await p.evaluate(s => { const r = document.querySelector(`#sistema-${s}`); r.checked = true; r.dispatchEvent(new Event('change', {bubbles: true})); }, sistema); await p.waitForTimeout(lento ? 1200 : 150); }   // senza il mouse e senza fuoco: Tab riparte dall'inizio
        const attesi = await p.evaluate(() => ({copie: 0}));
        const soste = await giro(p, lento ? 2000 : 0);   // lento: più lungo della più lunga entrata; veloce: senza pause
        await p.waitForTimeout(2600);
        const copiaVisibili = await p.evaluate(() => [...document.querySelectorAll('.comando .copia')].filter(e => e.getClientRects().length).length);
        console.log(`   [${NOMI[sistema]}] soste:`, soste.length, soste.map(s => s.nome).join(' → ').slice(0, 700));
        if (sistema === 'deb') writeFileSync(`${uscita}/${sc}-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(soste, null, 1));
        ok(`[${NOMI[sistema]}] il giro tocca ogni comando una volta, in un ordine`, soste.length >= 30 && new Set(soste.map(s => s.nome + s.classe + s.yDoc)).size === soste.length, `${soste.length} soste`);
        ok(`[${NOMI[sistema]}] i pulsanti «Copia» nell'ordine del fuoco sono tutti quelli che si vedono (${copiaVisibili})`, soste.filter(s => s.classe.startsWith('copia')).length === copiaVisibili && copiaVisibili === ATTESO[sistema].comandi + ATTESO[sistema].controllo + 1, `${soste.filter(s => s.classe.startsWith('copia')).length} di ${copiaVisibili}`);
        ok(`[${NOMI[sistema]}] le quattro frasi della finestra sono quattro soste (pulsanti)`, soste.filter(s => s.classe.startsWith('frase-bottone')).length === 4);
        ok(`[${NOMI[sistema]}] le cinque tappe della ripresa e «Copia l'indirizzo» sono nell'ordine del fuoco`, soste.filter(s => /Non trovi il file|Il numero non è uguale|kalliope --version non risponde|La finestra non dice|non è fra i microfoni/.test(s.nome)).length === 5 && soste.some(s => /Copia l'indirizzo/.test(s.nome)));
        ok(`[${NOMI[sistema]}] «Per togliere Kalliope» è una sosta`, soste.some(s => /Per togliere Kalliope/.test(s.nome)));
        ok(`[${NOMI[sistema]}] la scelta è una sola sosta (le altre tre non sono soste), seguita da «Non uso Linux»`, soste.filter(s => s.classe.startsWith('sistema-voce')).length === 1);
        const nonSchermo = soste.filter(s => !s.inSchermo || s.opacita < 0.99 || s.visibilita !== 'visible');
        ok(`[${NOMI[sistema]}] ${lento ? 'ogni sosta ha il comando in vista, opaco e non sotto la barra' : 'a passo svelto il giro è lo stesso'}`, lento ? nonSchermo.length === 0 : true, nonSchermo.map(s => `${s.nome} (op ${s.opacita.toFixed(2)}, ${s.inSchermo ? 'in vista' : 'fuori vista'})`).join(', '));
        const sottoBarra = soste.filter(s => s.sotto);
        if (lento && sistema === 'deb') {   // e all'indietro (Maiusc+Tab) dall'ultima sosta alla prima: ogni sosta in vista e non sotto la barra (Firefox non scorre per un comando mezzo fuori)
          const indietro = [];
          for (let k = 0; k < soste.length + 2; k++) { await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(900); const d = await p.evaluate(descrivi); if (!d) break; indietro.push(d); if (/^Vai al contenuto/.test(d.nome)) break; }
          const male = indietro.filter(s => !s.inSchermo || s.opacita < 0.99 || s.visibilita !== 'visible' || s.sotto);
          ok(`[${NOMI[sistema]}] all'indietro (Maiusc+Tab) ${indietro.length} soste, ognuna in vista, opaca e non sotto la barra`, indietro.length >= soste.length - 2 && male.length === 0, male.map(s => `${s.nome} (top ${s.top}, bottom ${s.bottom}, ${s.inSchermo ? 'in vista' : 'fuori vista'}${s.sotto ? ', sotto la barra' : ''})`).join(', '));
        }
        ok(`[${NOMI[sistema]}] nessuna sosta sta sotto la barra`, sottoBarra.length === 0, sottoBarra.map(s => `${s.nome} top ${s.top}`).join(', '));
        ok(`[${NOMI[sistema]}] il contorno del fuoco si vede su ogni sosta`, soste.every(s => s.anello), soste.filter(s => !s.anello).map(s => s.nome).join(', '));
        const deboli = soste.filter(s => s.anelloRapporto !== null && s.anelloRapporto < 1.8);
        ok(`[${NOMI[sistema]}] il contorno del fuoco si distingue dal fondo (almeno 1,8 : 1 dove il fondo è pieno)`, deboli.length === 0, deboli.map(s => `${s.nome} ${s.anelloRapporto}:1`).join(', ') || `${soste.filter(s => s.anelloRapporto !== null).length} soste misurate`);
        const salti = []; soste.forEach((s, i) => { const prec = soste[i - 1]; if (prec && s.yDoc < prec.yDoc - 14 && !(rtl ? s.right < prec.right - 40 : s.left > prec.left + 40) && !(s.tag === 'a' && /^barra|marchio/.test(s.classe))) salti.push(`${prec.nome} (y ${prec.yDoc}) → ${s.nome} (y ${s.yDoc})`); });
        ok(`[${NOMI[sistema]}] l'ordine del fuoco va dall'alto in basso (e da una colonna alla seguente)`, salti.length === 0, salti.join(' | '));
        if (sistema === 'deb') await foto(p, `${sc}-fine`);
        ok(`[${NOMI[sistema]}] console pulita`, errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
    }
    // =================================================================================================================
    if (sc === 'frasi') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(1200);
      const prima = await p.evaluate(() => ({bottoni: document.querySelectorAll('.frase-bottone').length, premuti: document.querySelectorAll('.frase-bottone[aria-pressed=true]').length, frasiFisse: document.querySelectorAll('p.frase-detta').length, dopo: document.querySelector('.frase-bottone') && document.querySelector('.frase-bottone').closest('li').querySelector('.frase-rimedio').textContent.length > 0}));
      ok('con lo script le quattro frasi sono quattro pulsanti, nessuna premuta, ognuna con il suo rimedio sotto', prima.bottoni === 4 && prima.premuti === 0 && prima.frasiFisse === 0 && prima.dopo, JSON.stringify(prima));
      const finestra = () => p.evaluate(() => { const f = document.querySelector('.finestra.avvio'), st = document.querySelector('.f-stato'), r = st.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom, bt = document.querySelector('.frase-bottone[aria-pressed=true]'), br = bt && bt.getBoundingClientRect();
        return {classi: [...f.classList].filter(c => ['pronta', 'scarica', 'prepara', 'errore', 'provata'].includes(c)).join(' '), testo: st.textContent.trim(), allarme: st.classList.contains('allarme'), scaricaVisibile: [...f.querySelectorAll('.f-riga-scarica')].some(e => getComputedStyle(e).display !== 'none'), premuti: [...document.querySelectorAll('.frase-bottone[aria-pressed=true]')].map(x => x.dataset.stato),
          annuncio: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, ''), statoTop: Math.round(r.top), statoBottom: Math.round(r.bottom), barra: Math.round(barra), vh: innerHeight, bottoneTop: br && Math.round(br.top), bottoneBottom: br && Math.round(br.bottom), finestraTop: Math.round(f.getBoundingClientRect().top), finestraBottom: Math.round(f.getBoundingClientRect().bottom)}; });
      const nomeStato = {curl: /Per scaricare la voce serve il programma curl/, rete: /Download non riuscito/, impronta: /non corrisponde all'impronta attesa/, microfono: /La voce è pronta, ma/};
      const inVistaStato = f => f.statoTop >= f.barra - 1 && f.statoBottom <= f.vh;
      for (const st of ['curl', 'rete', 'impronta', 'microfono']) {
        // come una persona: scorre fino alla frase e la preme (la pagina può muoversi sotto di lei)
        await p.locator(`.frase-bottone[data-stato=${st}]`).scrollIntoViewIfNeeded(); await p.waitForTimeout(250);
        await p.click(`.frase-bottone[data-stato=${st}]`); await p.waitForTimeout(1300);
        const f = await finestra();
        const errore = st !== 'microfono';
        ok(`«${st}» premuta: la finestra mostra la frase in allarme${errore ? ' e torna «Scarica la voce»' : ' ma resta «Pronta» (la causa è un\'altra)'}; una sola frase premuta`, nomeStato[st].test(f.testo) && f.allarme && f.premuti.join() === st && (errore ? /errore/.test(f.classi) && f.scaricaVisibile : /pronta/.test(f.classi) && !f.scaricaVisibile), JSON.stringify({classi: f.classi, testo: f.testo.slice(0, 40), premuti: f.premuti}));
        ok(`  l'annuncio dice la riga della finestra («La riga della finestra dice: …»)`, f.annuncio.startsWith('La riga della finestra dice:') && nomeStato[st].test(f.annuncio), f.annuncio.slice(0, 80));
        ok(`  la riga della finestra sta nello schermo, sotto la barra, dopo che la frase è stata premuta (ciò che il gesto cambia si vede)`, inVistaStato(f), JSON.stringify({top: f.statoTop, bottom: f.statoBottom, barra: f.barra, vh: f.vh}));
        // la frase premuta resta in vista se sta insieme alla finestra nello spazio libero
        const distanza = Math.max(f.bottoneBottom, f.finestraBottom) - Math.min(f.bottoneTop, f.finestraTop);
        const stanno = distanza <= f.vh - f.barra - 24;
        ok(`  con la finestra resta in vista anche la frase premuta, quando insieme ci stanno nello schermo (${stanno ? 'ci stanno' : 'non ci stanno: vince la finestra'})`, !stanno || (f.bottoneTop >= f.barra - 1 && f.bottoneBottom <= f.vh), JSON.stringify({bottone: [f.bottoneTop, f.bottoneBottom], finestra: [f.finestraTop, f.finestraBottom], distanza, spazio: f.vh - f.barra}));
        if (st === 'microfono' || st === 'curl') await foto(p, `frase-${st}`);
      }
      // premuta ancora, la stessa: torna «Pronta»
      await p.locator('.frase-bottone[data-stato=microfono]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=microfono]'); await p.waitForTimeout(1300);
      const di_nuovo = await finestra();
      ok('premuta di nuovo, la stessa frase si toglie: «Pronta», nessuna frase premuta, l\'annuncio dice «Pronta»', /pronta/.test(di_nuovo.classi) && di_nuovo.premuti.length === 0 && !di_nuovo.allarme && /^Pronta\./.test(di_nuovo.testo) && /Pronta\./.test(di_nuovo.annuncio), JSON.stringify({classi: di_nuovo.classi, testo: di_nuovo.testo.slice(0, 30), annuncio: di_nuovo.annuncio.slice(0, 60)}));
      ok('  e la finestra sta nello schermo dopo averla tolta', inVistaStato(di_nuovo), JSON.stringify({top: di_nuovo.statoTop, bottom: di_nuovo.statoBottom}));
      // tastiera: Tab sulla prima frase, Invio, Spazio sulla seguente, Tab non salta pulsanti
      await p.locator('.frase-bottone[data-stato=curl]').focus();
      await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
      const k1 = await finestra();
      ok('Invio su una frase la preme, il fuoco resta sul pulsante', k1.premuti.join() === 'curl' && await p.evaluate(() => document.activeElement.dataset.stato === 'curl'), JSON.stringify(k1.premuti));
      await p.keyboard.press('Tab'); await p.waitForTimeout(150);
      const fuoco2 = await p.evaluate(() => ({stato: document.activeElement.dataset.stato || null, tag: document.activeElement.tagName}));
      ok('Tab dalla prima frase va alla seconda (il rimedio non è una sosta, il collegamento «Che cosa fare» è dopo la quarta)', fuoco2.stato === 'rete', JSON.stringify(fuoco2));
      await p.keyboard.press('Space'); await p.waitForTimeout(1000);
      const k2 = await finestra();
      ok('Spazio sulla seconda la preme e toglie la prima: una frase sola', k2.premuti.join() === 'rete' && /Download non riuscito/.test(k2.testo), JSON.stringify(k2.premuti));
      // dal computer al telefono con una frase premuta: la scelta resta e la finestra si vede
      if (!tel) {
        await p.setViewportSize({width: 390, height: 844}); await p.waitForTimeout(1200);
        const t1 = await finestra();
        ok('passando a 390 px con una frase premuta la finestra mostra ancora quella frase e la frase resta premuta', t1.premuti.join() === 'rete' && /Download non riuscito/.test(t1.testo), JSON.stringify({premuti: t1.premuti, testo: t1.testo.slice(0, 30)}));
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(1000);
        const t2 = await finestra();
        ok('e tornando alla misura di prima è come prima', t2.premuti.join() === 'rete' && /Download non riuscito/.test(t2.testo), JSON.stringify({premuti: t2.premuti}));
      } else {
        await p.setViewportSize({width: 1280, height: 800}); await p.waitForTimeout(1200);
        const t1 = await finestra();
        ok('passando al computer (1280 px) con una frase premuta la finestra mostra ancora quella frase', t1.premuti.join() === 'rete' && /Download non riuscito/.test(t1.testo), JSON.stringify({premuti: t1.premuti, testo: t1.testo.slice(0, 30)}));
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(1000);
      }
      // premere durante il racconto del primo avvio: il racconto si ferma, la frase vince; non riparte
      {
        const c2 = await apri(); const q = c2.p;
        await q.waitForTimeout(500);
        await q.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start', behavior: 'instant'})); await q.waitForTimeout(2200);   // il racconto è cominciato (860 ms dopo la rivelazione)
        await q.locator('.frase-bottone[data-stato=curl]').scrollIntoViewIfNeeded(); await q.click('.frase-bottone[data-stato=curl]'); await q.waitForTimeout(6000);
        const durante = await q.evaluate(() => ({classi: [...document.querySelector('.finestra.avvio').classList].join(' '), testo: document.querySelector('.f-stato').textContent.slice(0, 40)}));
        ok('premendo una frase durante il racconto del primo avvio, il racconto si ferma e non riparte: resta la frase', /errore/.test(durante.classi) && /Per scaricare la voce serve/.test(durante.testo) && !/pronta|scarica |prepara/.test(durante.classi.replace('errore', '')), JSON.stringify(durante));
        await c2.ctx.close();
      }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'copia') {
      const via = async (finta, permessi) => { const r = await apri({permessi, prima: finta ? p => p.addInitScript(finta) : null}); await r.p.waitForTimeout(1500); return r; };
      const alControllo = async p => { await p.evaluate(() => document.querySelector('#passo-controlla').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(1500); };
      // 1) riesce: ogni «Copia» visibile copia esattamente il suo comando (per ogni distribuzione)
      {
        const {ctx, p, errori} = await via(FINTA_OK);
        for (const s of ['deb', 'arch', 'tar']) {
          await p.click(`label[for=sistema-${s}]`); await p.waitForTimeout(500);
          await p.evaluate(() => { window.__copiato = []; });
          const n = await p.locator('.comando .copia:visible').count();
          const attesi = [];
          for (let i = 0; i < n; i++) {
            const bt = p.locator('.comando .copia:visible').nth(i);
            await bt.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
            attesi.push(await bt.evaluate(e => e.closest('.comando').querySelector('code').textContent.trim()));
            await bt.click(); await p.waitForTimeout(150);
          }
          const copiati = await p.evaluate(() => window.__copiato);
          ok(`«${NOMI[s]}»: ognuno dei ${n} pulsanti «Copia» copia il suo comando com'è (senza spazi in più, senza invii)`, n === ATTESO[s].comandi + ATTESO[s].controllo + 1 && JSON.stringify(copiati) === JSON.stringify(attesi) && copiati.every(c => !/\n/.test(c) && c === c.trim()), JSON.stringify({n, copiati: copiati.map(c => c.slice(0, 30))}));
        }
        // il segno di riuscita e l'annuncio
        await p.click('label[for=sistema-deb]'); await p.waitForTimeout(300);
        await alControllo(p);
        const bt = p.locator('#passo-controlla .comando .copia').first();
        await bt.click(); await p.waitForTimeout(250);
        const r = await bt.evaluate(e => { const c = e.closest('.comando'), r = c.getBoundingClientRect(), et = e.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {copiato: c.classList.contains('copiato'), fatto: getComputedStyle(e.querySelector('.se-fatto')).visibility, fermo: getComputedStyle(e.querySelector('.se-fermo')).visibility, larghezza: Math.round(et.width), annuncio: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, ''), errore: !!c.nextElementSibling && c.nextElementSibling.classList.contains('comando-errore'), top: Math.round(r.top), bottom: Math.round(r.bottom), barra: Math.round(barra), vh: innerHeight}; });
        ok('la copia riesce: «Copiato» nella stessa cella (il pulsante non cambia larghezza), nessun errore, l\'annuncio dice «Copiato negli appunti.»', r.copiato && r.fatto === 'visible' && r.fermo === 'hidden' && !r.errore && r.annuncio === 'Copiato negli appunti.', JSON.stringify(r));
        const l0 = r.larghezza; await p.waitForTimeout(2300);
        const r2 = await bt.evaluate(e => ({copiato: e.closest('.comando').classList.contains('copiato'), larghezza: Math.round(e.getBoundingClientRect().width)}));
        ok('dopo 1,6 s torna «Copia», la stessa larghezza', !r2.copiato && r2.larghezza === l0, JSON.stringify({l0, ...r2}));
        ok('il comando copiato sta nello schermo, sotto la barra', r.top >= r.barra - 1 && r.bottom <= r.vh, JSON.stringify(r));
        await foto(p, 'copia-riuscita');
        await bt.click(); await p.waitForTimeout(100);
        await p.evaluate(() => { window.__seq = []; new MutationObserver(m => m.forEach(x => window.__seq.push('annuncio:' + document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '')))).observe(document.querySelector('#annuncio'), {childList: true, characterData: true, subtree: true}); });
        await bt.click(); await p.waitForTimeout(400);
        const seq = await p.evaluate(() => window.__seq);
        ok('premendo ancora l\'annuncio si ripete (sparisce e ricompare)', seq.length >= 2 && seq[0] === 'annuncio:' && seq.includes('annuncio:Copiato negli appunti.'), JSON.stringify(seq));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 2) non riesce: la frase sotto il comando, il comando selezionato, resta finché non si ripreme; poi riesce
      {
        const {ctx, p, errori} = await via(FINTA_NO);
        await alControllo(p);
        const bt = p.locator('#passo-controlla .comando .copia').first();
        await bt.click(); await p.waitForTimeout(800);
        const r = await bt.evaluate(e => { const c = e.closest('.comando'), er = c.nextElementSibling, rr = er && er.getBoundingClientRect(), cr = c.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom;
          return {errore: !!er && er.classList.contains('comando-errore'), testo: er ? er.textContent.trim() : '', ruolo: er && er.getAttribute('role'), copiato: c.classList.contains('copiato'), selezione: getSelection().toString().trim(), comando: c.querySelector('code').textContent.trim(), top: rr && Math.round(rr.top), bottom: rr && Math.round(rr.bottom), cBottom: Math.round(cr.bottom), barra: Math.round(barra), vh: innerHeight, annuncio: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069\u200e\u200f\u202a-\u202e]/g, '')}; });
        ok('la copia non riesce: sotto il comando compare la frase per copiarlo a mano, nessun «Copiato»', r.errore && /seleziona il testo e copialo/.test(r.testo) && !r.copiato, JSON.stringify({testo: r.testo, copiato: r.copiato}));
        ok('  il comando resta selezionato (si copia con la tastiera)', r.selezione === r.comando, JSON.stringify({selezione: r.selezione.slice(0, 40), comando: r.comando.slice(0, 40)}));
        ok('  la frase sta nello schermo per intero, sotto la barra, attaccata al comando (a meno di 24 px)', r.top >= r.barra - 1 && r.bottom <= r.vh && r.top - r.cBottom < 24, JSON.stringify({top: r.top, bottom: r.bottom, cBottom: r.cBottom, vh: r.vh}));
        ok('  la frase è uno stato annunciato (role=status) e l\'annuncio la dice', r.ruolo === 'status' && /seleziona il testo e copialo/.test(r.annuncio), JSON.stringify({ruolo: r.ruolo, annuncio: r.annuncio}));
        await foto(p, 'copia-non-riuscita');
        await p.waitForTimeout(3000);
        ok('  la frase resta finché non si ripreme', await bt.evaluate(e => !!e.closest('.comando').nextElementSibling && e.closest('.comando').nextElementSibling.classList.contains('comando-errore')));
        await bt.click(); await p.waitForTimeout(500);
        ok('  premuto di nuovo (e fallito di nuovo) c\'è una frase sola, non due', await bt.evaluate(e => e.closest('.comando').parentElement.querySelectorAll('.comando-errore').length === 1));
        await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.resolve()}, configurable: true}); });
        await bt.click(); await p.waitForTimeout(500);
        ok('  poi riesce: la frase d\'errore sparisce e c\'è «Copiato»', await bt.evaluate(e => e.closest('.comando').classList.contains('copiato') && !e.closest('.comando').parentElement.querySelector('.comando-errore')));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 3) il browser non ha gli appunti: niente pulsante, un clic seleziona il comando intero
      {
        const {ctx, p, errori} = await via(SENZA_APPUNTI);
        await alControllo(p);
        const n = await p.evaluate(() => document.querySelectorAll('.comando .copia').length);
        ok('senza appunti non c\'è nessun «Copia»', n === 0, `${n}`);
        await p.click('#passo-controlla .comando code'); await p.waitForTimeout(150);
        const sel = await p.evaluate(() => ({s: getSelection().toString().trim(), c: document.querySelector('#passo-controlla .comando code').textContent.trim()}));
        ok('un clic sul comando lo seleziona intero (si copia con la tastiera)', sel.s === sel.c && sel.s.length > 10, JSON.stringify({s: sel.s.slice(0, 50), c: sel.c.slice(0, 50)}));
        await foto(p, 'senza-appunti');
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 4) gli appunti veri, nel motore che li lascia provare (Chromium con il permesso); negli altri, ciò che il motore fa davvero: o «Copiato» o la frase, mai niente e mai tutte e due
      if (motore === 'chromium') {
        const {ctx, p, errori} = await via(null, true);
        await alControllo(p);
        await p.click('#passo-controlla .comando .copia'); await p.waitForTimeout(500);
        const letto = await p.evaluate(() => navigator.clipboard.readText());
        const cmd = await p.evaluate(() => document.querySelector('#passo-controlla .comando code').textContent.trim());
        ok('con gli appunti veri il testo copiato è il comando', letto === cmd, JSON.stringify(letto.slice(0, 60)));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      {
        const {ctx, p, errori} = await via(null, false);
        await alControllo(p);
        const haAppunti = await p.evaluate(() => !!navigator.clipboard);
        if (haAppunti) {
          await p.click('#passo-controlla .comando .copia'); await p.waitForTimeout(900);
          const r = await p.evaluate(() => { const c = document.querySelector('#passo-controlla .comando'); return {copiato: c.classList.contains('copiato'), errore: !!c.nextElementSibling && c.nextElementSibling.classList.contains('comando-errore')}; });
          ok(`senza il permesso del browser (${motore}) la risposta è una sola: «Copiato» (${r.copiato}) oppure la frase per copiarlo a mano (${r.errore})`, r.copiato !== r.errore, JSON.stringify(r));
          await foto(p, 'copia-senza-permesso');
        } else ok(`${motore}: il browser non ha gli appunti in questo contesto: niente pulsante (provato sopra)`, true);
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 5) l'indirizzo della pagina: riesce, non riesce, e si legge da sinistra a destra
      {
        for (const [finta, riesce] of [[FINTA_OK, true], [FINTA_NO, false]]) {
          const {ctx, p, errori} = await via(finta);
          await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(1500);
          await p.click('.copia-indirizzo'); await p.waitForTimeout(900);
          const r = await p.evaluate(() => { const g = s => { const e = document.querySelector(s); return e ? [!e.hidden, Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().bottom)] : null; }; return {fatto: g('.copia-fatto'), errore: g('.copia-errore'), anello: document.querySelector('.bolla-indirizzo').classList.contains('copiata'), copiato: window.__copiato, indirizzo: document.querySelector('.inoltra-indirizzo').textContent.trim().replace(/[⁦-⁩]/g, ''), canonical: document.querySelector('link[rel=canonical]').href, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), vh: innerHeight, sel: getSelection().toString().trim().replace(/[⁦-⁩]/g, '')}; });
          if (riesce) ok('«Copia l\'indirizzo» riesce: il testo copiato è l\'indirizzo mostrato, uguale al canonical; la risposta compare, l\'anello è sulla bolla', r.copiato.length === 1 && r.copiato[0].replace(/[⁦-⁩]/g, '') === r.indirizzo && r.indirizzo === r.canonical && r.fatto[0] && !r.errore[0] && r.anello, JSON.stringify({copiato: r.copiato, indirizzo: r.indirizzo, canonical: r.canonical}));
          else ok('«Copia l\'indirizzo» non riesce: la frase per copiarlo a mano, nessun anello, l\'indirizzo selezionato', r.errore[0] && !r.fatto[0] && !r.anello && r.sel === r.indirizzo, JSON.stringify({sel: r.sel, indirizzo: r.indirizzo}));
          const dentro = (riesce ? r.fatto : r.errore);
          ok('  la risposta sta nello schermo per intero, sotto la barra', dentro[1] >= r.barra - 1 && dentro[2] <= r.vh, JSON.stringify(dentro));
          await foto(p, riesce ? 'indirizzo-copiato' : 'indirizzo-non-copiato');
          ok('  console pulita', errori.length === 0, errori.join(' | '));
          await ctx.close();
        }
      }
    }
    // =================================================================================================================
    if (sc === 'appunti') {
      // Ciò che si copia sono caratteri, non disegno: né «Copia» né una selezione a mano devono portarsi dietro segni invisibili (U+2066–2069 di isolamento, U+200E/F, U+202A–E). Incollato in un
      // terminale, un comando con un segno in mezzo non funziona («./kalliope-…⁩.deb: file non trovato»). Si legge dagli appunti veri (non dal DOM, non da ciò che la pagina dice di scrivere) e da
      // getSelection(). I comandi attesi sono quelli della pagina italiana (che non ha segni). Scoperto il 20/11/2026: in arabo e in urdu la costruzione metteva i segni dentro ogni <code>.
      const SEGNI = /[⁦-⁩‎‏‪-‮]/;
      const mostraSegni = s => String(s).replace(/[⁦-⁩‎‏‪-‮]/g, c => `<U+${c.codePointAt(0).toString(16).toUpperCase()}>`);
      const leggiAppunti = async p => {
        try { const t = await p.evaluate(() => navigator.clipboard.readText()); if (typeof t === 'string') return t; } catch {}
        // senza il permesso di lettura (Firefox) si incolla in un campo con Ctrl+V, come fa chi usa la tastiera
        await p.evaluate(() => { let t = document.getElementById('__incolla'); if (!t) { t = document.createElement('textarea'); t.id = '__incolla'; t.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0'; document.body.append(t); } t.value = ''; t.focus(); });
        await p.keyboard.press('Control+V'); await p.waitForTimeout(150);
        return p.evaluate(() => document.getElementById('__incolla').value);
      };
      const COMANDI = () => [...document.querySelectorAll('.comando')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
      const comandiDi = async (p, s) => { await p.click(`label[for=sistema-${s}]`); await p.waitForTimeout(450); return p.evaluate(() => [...document.querySelectorAll('.comando')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').map(e => e.querySelector('code').textContent.trim())); };
      const rif = {};
      {   // la pagina italiana: i comandi attesi
        const {ctx, p} = await apri({url: 'it/installa/'});
        await p.waitForTimeout(900);
        for (const s of ['deb', 'rpm', 'arch', 'tar']) rif[s] = await comandiDi(p, s);
        await ctx.close();
      }
      const {ctx, p, errori} = await apri({permessi: true});
      await p.waitForTimeout(1200);
      const cattivi = [];
      for (const s of ['deb', 'rpm', 'arch', 'tar']) {
        const visti = await comandiDi(p, s);
        const n = await p.locator('.comando .copia:visible').count();
        const dagliAppunti = [];
        for (let i = 0; i < n; i++) {
          const bt = p.locator('.comando .copia:visible').nth(i);
          await bt.scrollIntoViewIfNeeded(); await p.waitForTimeout(120);
          await bt.click(); await p.waitForTimeout(250);
          dagliAppunti.push(await leggiAppunti(p));
        }
        const segni = dagliAppunti.map((t, i) => SEGNI.test(t) ? `${i + 1}: ${mostraSegni(t).slice(0, 60)}` : null).filter(Boolean);
        ok(`«${NOMI[s]}»: dopo ognuno dei ${n} «Copia» gli appunti hanno il comando come nella pagina italiana, senza segni invisibili`, n === rif[s].length && dagliAppunti.every((t, i) => t === rif[s][i]), JSON.stringify({n, attesi: rif[s].length, conSegni: segni.length, primo: segni[0] || null}));
        // la selezione a mano del blocco intero
        const sel = await p.evaluate(() => [...document.querySelectorAll('.comando')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').map(e => { const c = e.querySelector('code'), r = document.createRange(); r.selectNodeContents(c); const g = getSelection(); g.removeAllRanges(); g.addRange(r); return g.toString().trim(); }));
        const selSegni = sel.map((t, i) => SEGNI.test(t) ? `${i + 1}: ${mostraSegni(t).slice(0, 60)}` : null).filter(Boolean);
        ok(`«${NOMI[s]}»: selezionando a mano ognuno dei ${sel.length} comandi si ottiene il comando come nella pagina italiana, senza segni invisibili`, sel.length === rif[s].length && sel.every((t, i) => t === rif[s][i]), JSON.stringify({conSegni: selSegni.length, primo: selSegni[0] || null}));
        if (segni.length || selSegni.length) cattivi.push(s);
      }
      // gli altri testi che si possono selezionare e copiare a mano: il terminale, i nomi dei file, le cartelle, l'indirizzo
      await p.click('label[for=sistema-tar]'); await p.waitForTimeout(500);
      const altri = await p.evaluate(() => {
        const vis = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
        const gruppi = {'riga del terminale': '.t-corpo .t-riga', 'comando scritto nel terminale': '.t-scrive', 'nome del file': 'a.file', 'file nella cartella': '.cartella-file', 'cartella': '.cartelle-nome', 'percorso nel pacchetto': '.pacco[data-t-no]', 'indirizzo della pagina': '.inoltra-indirizzo'};
        const out = {};
        for (const [nome, sel] of Object.entries(gruppi)) { out[nome] = {n: 0, conSegni: []}; for (const e of document.querySelectorAll(sel)) { if (!vis(e) && !e.closest('.terminale')) continue; const r = document.createRange(); r.selectNodeContents(e); const g = getSelection(); g.removeAllRanges(); g.addRange(r); const t = g.toString(); out[nome].n++; if (/[⁦-⁩‎‏‪-‮]/.test(t)) out[nome].conSegni.push(t.replace(/[⁦-⁩‎‏‪-‮]/g, c => `<U+${c.codePointAt(0).toString(16).toUpperCase()}>`).slice(0, 50)); } }
        return out;
      });
      for (const [nome, v] of Object.entries(altri)) ok(`selezionando a mano ${nome} (${v.n}) non si portano dietro segni invisibili`, v.n > 0 && v.conSegni.length === 0, JSON.stringify({conSegni: v.conSegni.length, primo: v.conSegni[0] || null}));
      // «Copia l'indirizzo»
      const btI = p.locator('.copia-indirizzo');
      if (await btI.isVisible()) {
        await btI.scrollIntoViewIfNeeded(); await btI.click(); await p.waitForTimeout(300);
        const ap = await leggiAppunti(p), canonico = await p.evaluate(() => document.querySelector('link[rel=canonical]').href);
        ok('«Copia l\'indirizzo»: gli appunti hanno l\'indirizzo della pagina, senza segni invisibili', ap === canonico && !SEGNI.test(ap), JSON.stringify({appunti: mostraSegni(ap).slice(0, 90), canonico}));
      }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'senza-js') {
      const {ctx, p, errori} = await apri({js: false});
      await p.waitForTimeout(4500);
      const s = await p.evaluate(() => { const vis = e => e.getClientRects().length > 0; const q = s => [...document.querySelectorAll(s)].filter(vis);
        return {js: document.documentElement.classList.contains('js'), copia: q('.comando .copia').length, copiaIndirizzo: getComputedStyle(document.querySelector('.copia-indirizzo')).display, frasiFisse: q('p.frase-detta').length, bottoniFrasi: document.querySelectorAll('.frase-bottone').length,
          installata: !!document.querySelector('.chiamata-installa') && getComputedStyle(document.querySelector('.chiamata-installa .nome-dopo')).display !== 'none' && getComputedStyle(document.querySelector('.chiamata-installa .nome-prima')).display === 'none',
          tratteggio: getComputedStyle(document.querySelector('.chiamata-installa .riquadro.tu'), '::before').opacity, righeTerminale: [...document.querySelectorAll('.terminale .t-riga')].filter(r => r.getClientRects().length && getComputedStyle(r).visibility === 'hidden').length,
          impronteIntere: q('.t-impronta').every(e => /^[0-9a-f]{64}$/i.test(e.textContent.trim())), esito: q('.t-esito').length, esitoOpaco: q('.t-esito').every(e => +getComputedStyle(e).opacity === 1), finestra: document.querySelector('.f-stato').textContent.trim(), finestraPronta: document.querySelector('.finestra.avvio').classList.contains('pronta'),
          titoli: [...document.querySelectorAll('.entra')].filter(e => e.getClientRects().length && +getComputedStyle(e).opacity < 0.99).length, pacchi: [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length && +getComputedStyle(e).opacity < 0.99).length,
          cartella: q('.cartella-file').every(e => +getComputedStyle(e).opacity === 1), larghezza: document.documentElement.scrollWidth, menuHref: document.querySelector('.pulsante-menu').getAttribute('href'), versione: q('.t-risposta.t-dopo').map(e => e.textContent.trim()).join('|'), indirizzo: document.querySelector('.inoltra-indirizzo').textContent.trim().replace(/[⁦-⁩]/g, ''),
          microfonoTrovato: getComputedStyle(document.querySelector('.microfono-scena .scelta-kalliope')).backgroundColor};
      });
      ok('senza JavaScript: niente classe «js»', !s.js);
      ok('senza JavaScript non c\'è «Copia» né «Copia l\'indirizzo»; le frasi della finestra sono testo con il loro rimedio (nessun pulsante)', s.copia === 0 && s.copiaIndirizzo === 'none' && s.frasiFisse === 4 && s.bottoniFrasi === 0, JSON.stringify({copia: s.copia, copiaIndirizzo: s.copiaIndirizzo, frasiFisse: s.frasiFisse}));
      ok('il primo schermo è allo stato finale: «Tu · microfono «Kalliope»», nessun tratteggio, il posto di «Kalliope» pieno', s.installata && s.tratteggio === '0', JSON.stringify({installata: s.installata, tratteggio: s.tratteggio}));
      ok('i terminali hanno tutte le righe (nessuna nascosta), le impronte intere e «Uguale, cifra per cifra» scritto', s.righeTerminale === 0 && s.impronteIntere && s.esito >= 1 && s.esitoOpaco, JSON.stringify({nascoste: s.righeTerminale, intere: s.impronteIntere, esito: s.esito}));
      ok('la finestra dice «Pronta», i file stanno nella cartella, le entrate sono finite (titoli, file)', /^Pronta\./.test(s.finestra) && s.finestraPronta && s.titoli === 0 && s.pacchi === 0 && s.cartella, JSON.stringify({finestra: s.finestra.slice(0, 20), titoli: s.titoli, pacchi: s.pacchi}));
      ok('la versione che il programma risponde c\'è, scritta dalla costruzione (kalliope 0.1)', /^kalliope 0\.1/.test(s.versione), s.versione);
      ok('l\'indirizzo c\'è (lo scrive la costruzione), nessuno scorrimento di lato', /^https:\/\/.+\/installa\/$/.test(s.indirizzo) && s.larghezza <= W, `${s.indirizzo}, ${s.larghezza} contro ${W}`);
      // la scelta funziona da sola (CSS): cliccando le etichette cambiano i comandi
      for (const sist of ['rpm', 'arch', 'tar', 'deb']) {
        await tocca(p, `label[for=sistema-${sist}]`);
        await p.waitForTimeout(300);
        const m = await p.evaluate(mostrato), a = ATTESO[sist];
        ok(`senza JavaScript «${NOMI[sist]}»: la scelta cambia pulsante, riga e comandi (${a.comandi} in «Installa»)`, m.scelta === sist && m.pulsanti.length === 1 && a.scarica.test(m.pulsanti[0]) && m.dice.length === 1 && m.comandiInstalla === a.comandi && m.comandiControllo === a.controllo, JSON.stringify(m));
      }
      // la pillola del file non ripete l'entrata a ogni cambio di scelta (nessuna animazione in corso subito dopo)
      await p.click('label[for=sistema-rpm]'); await p.waitForTimeout(60);
      const anim = await p.evaluate(() => [...document.querySelectorAll('#comandi-apertura > *')].filter(e => e.getClientRects().length).map(e => e.getAnimations().filter(a => a.playState === 'running').length));
      ok('senza JavaScript cambiando distribuzione il pulsante del file e il collegamento non ripetono l\'entrata', anim.every(n => n === 0), JSON.stringify(anim));
      await p.click('label[for=sistema-arch]'); await p.waitForTimeout(60);
      const anim2 = await p.evaluate(() => [...document.querySelectorAll('#comandi-apertura > *')].filter(e => e.getClientRects().length).map(e => [e.className.slice(0, 22), e.getAnimations().filter(a => a.playState === 'running').length]));
      ok('  e così anche per Arch (il pulsante cambia contenuto)', anim2.every(([, n]) => n === 0), JSON.stringify(anim2));
      // selezione con un clic sul comando
      await p.click('label[for=sistema-deb]'); await p.waitForTimeout(200);
      await p.locator('#passo-controlla .comando code').first().scrollIntoViewIfNeeded(); await p.click('#passo-controlla .comando code'); await p.waitForTimeout(100);
      const sel = await p.evaluate(() => ({s: getSelection().toString().trim(), c: document.querySelector('#passo-controlla .comando code').textContent.trim()}));
      ok('un clic su un comando lo seleziona intero', sel.s === sel.c && sel.c.length > 10, JSON.stringify({s: sel.s.slice(0, 30)}));
      await foto(p, 'senzajs-alto');
      await p.evaluate(() => scrollTo(0, 0));
      await ricarica(p); await p.waitForTimeout(800);
      const tasti = await giro(p, 40, 140); ok('senza JavaScript il giro di tastiera arriva a ogni collegamento e alla scelta (barra, scelta, comandi, frasi non pulsanti, ripresa, piede)', tasti.length >= 24 && tasti.some(s => s.classe.startsWith('sistema-voce')) && tasti.filter(s => s.tag === 'a').length >= 20, `${tasti.length} soste`);
      if (tel) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.pulsante-menu'); await p.waitForTimeout(500); ok('al telefono «Menu» porta al piede', await p.evaluate(() => location.hash === '#piede-sezioni'), await p.evaluate(() => location.hash)); }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'senza-stili' || sc === 'senza-token') {
      const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, tel)});
      await ctx.route(sc === 'senza-stili' ? /\.css(\?|$)/ : /token\.css(\?|$)/, r => r.abort());
      const errori = []; const p = await ctx.newPage(); p.on('pageerror', e => errori.push(e.message));
      await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(3500);
      const m = await p.evaluate(() => ({alto: document.documentElement.scrollHeight, svg: Math.max(...[...document.querySelectorAll('svg')].map(s => s.getBoundingClientRect().width)), pagina: !!window.__pagina, js: document.documentElement.classList.contains('js'), installata: document.querySelector('.chiamata-installa').classList.contains('installata'), scelte: document.querySelectorAll('.sistema-voce').length}));
      if (sc === 'senza-stili') ok('senza i fogli di stile la pagina non diventa enorme (nessun disegno più largo di 300 px, pagina sotto i 30.000 px)', m.svg <= 300 && m.alto < 30000, JSON.stringify(m));
      else ok('senza token.css lo script riconosce che manca e la pagina si carica: il primo schermo è allo stato finale, nessun racconto che parte', m.pagina && m.installata, JSON.stringify(m));
      ok('nessun errore dello script', errori.length === 0, errori.join(' | '));
      // la scelta funziona lo stesso (è del browser)
      await p.click('label[for=sistema-tar]').catch(() => p.check('#sistema-tar', {force: true})); await p.waitForTimeout(500);
      ok('la scelta della distribuzione risponde anche così (il bottone vero è del browser)', await p.evaluate(() => document.querySelector('.sistema-voce:checked').value === 'tar'));
      await foto(p, sc);
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'ridotto') {
      const {ctx, p, errori} = await apri({ridotto: true, prima: p => p.addInitScript(FINTA_OK)});
      await p.waitForTimeout(900);
      const s = await p.evaluate(() => ({installata: document.querySelector('.chiamata-installa').classList.contains('installata'), righeNascoste: [...document.querySelectorAll('.terminale .t-riga')].filter(r => r.getClientRects().length && getComputedStyle(r).visibility === 'hidden').length, uguali: [...document.querySelectorAll('.terminale-controllo .t-gruppo')].filter(g => getComputedStyle(g).visibility !== 'hidden').every(g => g.classList.contains('uguale')), finestra: document.querySelector('.finestra.avvio').classList.contains('pronta'), cursoreScrive: !!document.querySelector('.terminale-palco .t-scrive .t-cursore')}));
      ok('«riduci movimento»: il primo schermo è già al suo stato finale (installata), nessuna riga nascosta, i gruppi dell\'impronta tutti uguali', s.installata && s.righeNascoste === 0 && s.uguali && !s.cursoreScrive, JSON.stringify(s));
      await p.evaluate(() => document.querySelector('.disco').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(500);
      const c = await p.evaluate(() => ({pacchi: [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1), animazioni: document.querySelector('.disco').getAnimations({subtree: true}).length, versione: [...document.querySelectorAll('.t-risposta.t-dopo')].filter(e => e.getClientRects().length).map(e => getComputedStyle(e).visibility).join()}));
      ok('con «riduci movimento» i file sono già nella cartella e «kalliope --version» c\'è', c.pacchi && c.versione.includes('visible'), JSON.stringify(c));
      await p.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(900);
      ok('la finestra è già su «Pronta»', await p.evaluate(() => /^Pronta\./.test(document.querySelector('.f-stato').textContent)));
      // i gesti restano: scelta, frase, copia
      await p.click('label[for=sistema-arch]'); await p.waitForTimeout(250);
      ok('con «riduci movimento» la scelta cambia i comandi subito', await p.evaluate(() => document.querySelector('.sistema-voce:checked').value === 'arch' && [...document.querySelectorAll('#comandi-apertura .scarica')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').length === 1));
      await p.locator('.frase-bottone[data-stato=rete]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=rete]'); await p.waitForTimeout(400);
      ok('la frase premuta risponde (la finestra mostra la riga) senza dissolvenze', await p.evaluate(() => /Download non riuscito/.test(document.querySelector('.f-stato').textContent) && document.querySelector('.finestra.avvio').getAnimations({subtree: true}).length === 0));
      await p.evaluate(() => document.querySelector('#passo-controlla').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(400);
      await p.locator('.comando .copia:visible').first().click(); await p.waitForTimeout(300);
      ok('«Copia» risponde (Copiato) e l\'alone è il bordo fermo', await p.evaluate(() => !!document.querySelector('.comando.copiato') && document.querySelector('.comando.copiato').getAnimations().length === 0));
      await p.evaluate(() => document.querySelector('.microfono-scena').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(700);
      ok('il microfono: la riga «kalliope» c\'è e «Kalliope» è già scelto nella barra', await p.evaluate(() => { const e = document.querySelector('.microfono-scena'); return !e.classList.contains('in-attesa') && getComputedStyle(document.querySelector('.microfono-scena .scelta-kalliope')).borderStyle !== 'dashed'; }));
      await foto(p, 'ridotto-fine');
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'scorrimento') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(800);
      const vuoti = () => p.evaluate(() => [...document.querySelectorAll('.entra, .entra-titolo')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight * 0.8 && r.bottom > 80 && r.height > 0 && +getComputedStyle(e).opacity < 0.99; }).map(e => (e.className + ' ' + (e.id || e.textContent.slice(0, 20))).slice(0, 50)));
      await p.keyboard.press('End'); await p.waitForTimeout(300);
      const fondo = await vuoti(); await p.waitForTimeout(1800);
      ok('saltando in fondo con End ciò che è in vista entra', (await vuoti()).length === 0, `subito: ${fondo.length} spenti`);
      await p.keyboard.press('Home'); await p.waitForTimeout(600);
      // una scorsa veloce di tutta la pagina, poi ci si ferma a ogni tratto: la scena arriva al suo stato finale
      const stati = {
        B: () => p.evaluate(() => { const t = document.querySelector('.terminale-controllo'); return !t.classList.contains('in-attesa') && [...t.querySelectorAll('.t-gruppo')].filter(g => g.getClientRects().length).every(g => g.classList.contains('uguale')) && [...document.querySelectorAll('.t-esito')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1); }),
        C: () => p.evaluate(() => { const t = document.querySelector('.terminale-installa'); return !t.classList.contains('in-attesa') && [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1); }),
        D: () => p.evaluate(() => document.querySelector('.finestra.avvio').classList.contains('pronta') && /^Pronta\./.test(document.querySelector('.f-stato').textContent)),
        E: () => p.evaluate(() => document.querySelector('.microfono-scena').classList.contains('trovato') && !document.querySelector('.terminale-microfono').classList.contains('in-attesa')),
      };
      // la prova si ferma con la scena in vista (a una finestra bassa o stretta il passo e il suo terminale non stanno nello stesso punto: sul telefono il terminale sta sopra, a 844×390 molto sotto)
      const sel = {B: '.terminale-controllo', C: '.disco', D: '.apri-finestra', E: '.microfono-scena'}, sopra = {B: 100};
      for (const t of ['E', 'D', 'C', 'B']) {   // dal fondo in su: ogni tratto si ferma dopo una scorsa veloce
        await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(250);
        await p.evaluate(([s, su]) => { const y = document.querySelector(s).getBoundingClientRect().top + scrollY; scrollTo({top: y - su, behavior: 'instant'}); }, [sel[t], sopra[t] ?? 200]);
        for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, k % 2 ? -150 : 150); await p.waitForTimeout(30); }
        const t0 = Date.now(); let fatto = false;
        while (Date.now() - t0 < 16000) { if (await stati[t]()) { fatto = true; break; } await p.waitForTimeout(100); }
        ok(`dopo una scorsa veloce fino al tratto ${t} la scena arriva al suo stato finale (${fatto ? Date.now() - t0 : '> 16000'} ms)`, fatto, `${Date.now() - t0} ms`);
      }
      // il ritorno in su: nulla da rifare, il primo schermo c'è e la barra è piena
      for (let k = 0; k < 40; k++) { await p.mouse.wheel(0, -H * 0.7); await p.waitForTimeout(30); }
      await p.waitForTimeout(1200);
      const su = await p.evaluate(() => ({y: Math.round(scrollY), titolo: +getComputedStyle(document.querySelector('#titolo')).opacity, installata: document.querySelector('.chiamata-installa').classList.contains('installata'), compatta: document.querySelector('.barra').classList.contains('compatta'), attesa: [...document.querySelectorAll('.terminale')].filter(t => t.classList.contains('in-attesa')).length}));
      ok('risalendo in cima: il titolo c\'è, il primo schermo è finito, nessun terminale è rimasto in attesa', su.y < 50 && su.titolo === 1 && su.installata && !su.compatta && su.attesa === 0, JSON.stringify(su));
      await foto(p, 'scorri-su');
      // le ancore della pagina
      for (const [sel2, titolo] of [['.ripresa-tappe a[href="#passo-controlla"]', '#passo-controlla .passo-nome'], ['#comandi-apertura a[href="#inoltra"]', '#inoltra h3']]) {
        await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
        const vis = await p.locator(sel2).first().isVisible().catch(() => false);
        if (!vis) { await p.evaluate(s => document.querySelector(s).click(), sel2); } else await p.click(sel2);
        await p.waitForTimeout(2600);
        const a = await p.evaluate(t => { const e = document.querySelector(t).getBoundingClientRect(); return {titolo: Math.round(e.top), op: +getComputedStyle(document.querySelector(t)).opacity, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), vh: innerHeight}; }, titolo);
        ok(`l'ancora ${sel2.match(/#[a-z-]+/)[0]} porta al punto: titolo sotto la barra, opaco`, a.titolo >= a.barra - 1 && a.titolo < a.vh && a.op === 1, JSON.stringify(a));
      }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'secondo-piano') {
      const {ctx, p, errori} = await apri();
      const nascondi = v => p.evaluate(v => { Object.defineProperty(document, 'hidden', {value: v, configurable: true}); Object.defineProperty(document, 'visibilityState', {value: v ? 'hidden' : 'visible', configurable: true}); document.dispatchEvent(new Event('visibilitychange')); }, v);
      await p.waitForTimeout(900);
      await nascondi(true);
      await p.waitForTimeout(8000);   // più dell'arrivo (il comando a 2 s, il posto che si riempie a 5,5 s): se l'orologio non si fermasse la scena sarebbe finita
      const durante = await p.evaluate(() => ({installata: document.querySelector('.chiamata-installa').classList.contains('installata'), cursore: !!document.querySelector('.terminale-palco .t-scrive .t-cursore') || document.querySelector('.terminale-palco').classList.contains('in-attesa')}));
      ok('con la scheda in secondo piano l\'arrivo non va avanti (il posto di «Kalliope» non si è riempito)', !durante.installata, JSON.stringify(durante));
      await nascondi(false);
      const quando = await aspetta(p, () => document.querySelector('.chiamata-installa').classList.contains('installata') && !document.querySelector('.terminale-palco').classList.contains('in-attesa'), null, 14000);
      ok('tornando alla scheda l\'arrivo riparte da dov\'era e arriva allo stato finale', quando >= 0, `${quando} ms dopo il ritorno`);
      // durante il confronto dell'impronta
      await p.evaluate(() => document.querySelector('.controllo-scena').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(1900);
      await nascondi(true); await p.waitForTimeout(5000); await nascondi(false);
      const imp = await aspetta(p, () => !document.querySelector('.terminale-controllo').classList.contains('in-attesa') && [...document.querySelectorAll('.terminale-controllo .t-gruppo')].filter(g => g.getClientRects().length).every(g => g.classList.contains('uguale')), null, 9000);
      ok('con la scheda in secondo piano durante il confronto dell\'impronta, tornando i gruppi finiscono e nessuno resta a metà', imp >= 0, `${imp} ms`);
      // durante la discesa dei file e il primo avvio
      await p.evaluate(() => document.querySelector('.disco').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2300);
      await nascondi(true); await p.waitForTimeout(4500); await nascondi(false);
      const pacchi = await aspetta(p, () => [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1) && !document.querySelector('.terminale-installa').classList.contains('in-attesa'), null, 9000);
      ok('con la scheda in secondo piano durante la discesa dei file, tornando i file arrivano tutti', pacchi >= 0, `${pacchi} ms`);
      await p.evaluate(() => document.querySelector('.apri-finestra').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2200);
      await nascondi(true); await p.waitForTimeout(6000); await nascondi(false);
      const pronta = await aspetta(p, () => document.querySelector('.finestra.avvio').classList.contains('pronta'), null, 12000);
      ok('con la scheda in secondo piano durante il primo avvio della finestra, tornando il racconto arriva a «Pronta»', pronta >= 0, `${pronta} ms`);
      // un tratto che arriva con la scheda nascosta si racconta quando si torna
      const c2 = await apri();
      await c2.p.evaluate(() => { Object.defineProperty(document, 'hidden', {value: true, configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
      await c2.p.evaluate(() => document.querySelector('.microfono-scena').scrollIntoView({block: 'center', behavior: 'instant'})); await c2.p.waitForTimeout(2500);
      const nascosto = await c2.p.evaluate(() => document.querySelector('.microfono-scena').classList.contains('trovato'));
      await c2.p.evaluate(() => { Object.defineProperty(document, 'hidden', {value: false, configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
      const tro = await aspetta(c2.p, () => document.querySelector('.microfono-scena').classList.contains('trovato'), null, 9000);
      ok('un tratto che arriva con la scheda nascosta non va avanti, e si racconta tornando', !nascosto && tro >= 0, `${tro} ms`);
      await c2.ctx.close();
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'ritorno') {
      const {ctx, p, errori} = await apri({prima: p => p.addInitScript(FINTA_OK)});
      await p.waitForTimeout(900);
      await p.click('label[for=sistema-rpm]'); await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(1500);
      const y = await p.evaluate(() => Math.round(scrollY));
      const pagina2 = await p.evaluate(() => document.querySelector('a[href$="stato/"]').href);
      await p.evaluate(h => { location.href = h; }, pagina2); await p.waitForLoadState('load'); await p.waitForTimeout(700);
      ok('il collegamento porta alla pagina Stato', /stato/.test(p.url()), p.url());
      await p.goBack({waitUntil: 'load'}); await p.waitForTimeout(3200);
      const r = await p.evaluate(() => ({url: location.pathname, js: document.documentElement.classList.contains('js'), y: Math.round(scrollY), scelta: document.querySelector('.sistema-voce:checked').value, mostrato: [...document.querySelectorAll('#comandi-apertura .scarica')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').map(e => e.textContent.trim()).join('|'), installa: [...document.querySelectorAll('#installa .installa-comandi .comando')].filter(e => e.getClientRects().length).length, finestraPronta: document.querySelector('.finestra.avvio').classList.contains('pronta'), righeNascoste: [...document.querySelectorAll('.terminale')].filter(t => t.classList.contains('in-attesa')).length}));
      ok(`tornando indietro con «Indietro» la scelta resta (Fedora): il bottone, il pulsante e i comandi sono quelli di Fedora (${motore})`, r.js && r.scelta === 'rpm' && /\.rpm/.test(r.mostrato) && r.installa === 1, JSON.stringify(r));
      ok('  e si è dove si era (a meno di 120 px)', Math.abs(r.y - y) < 120, JSON.stringify({prima: y, dopo: r.y}));
      await p.waitForTimeout(3000);
      const r2 = await p.evaluate(() => ({finestraTesto: document.querySelector('.f-stato').textContent.trim().slice(0, 30), attesa: [...document.querySelectorAll('.terminale')].filter(t => t.classList.contains('in-attesa') && t.getClientRects().length && t.getBoundingClientRect().top < innerHeight && t.getBoundingClientRect().bottom > 0).length}));
      ok('  le scene in vista tornano a raccontarsi e finiscono (nessun terminale in vista resta in attesa)', r2.attesa === 0, JSON.stringify(r2));
      await foto(p, 'ritorno');
      ok('dopo il ritorno la copia funziona di nuovo', await (async () => { await p.evaluate(() => document.querySelector('#passo-controlla').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(600); await p.locator('.comando .copia:visible').first().click(); await p.waitForTimeout(500); return p.evaluate(() => !!document.querySelector('.comando.copiato')); })());
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'ricarica') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(800);
      await p.click('label[for=sistema-tar]'); await p.waitForTimeout(400);
      await p.evaluate(() => document.querySelector('#installa .installa-comandi').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(2600);
      const y = await p.evaluate(() => Math.round(scrollY));
      await ricarica(p); await p.waitForTimeout(3800);
      const r = await p.evaluate(() => { const d = document.querySelector('.disco').getBoundingClientRect(), inVista = d.bottom > 0 && d.top < innerHeight; return {y: Math.round(scrollY), scelta: document.querySelector('.sistema-voce:checked').value, comandi: [...document.querySelectorAll('#installa .installa-comandi .comando')].filter(e => e.getClientRects().length).length, discoInVista: inVista, pacchi: !inVista || [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1), terminaleAttesa: inVista && document.querySelector('.terminale-installa').classList.contains('in-attesa'), js: document.documentElement.classList.contains('js')}; });
      ok(`ricaricando a metà pagina (Altre, ai comandi) si resta lì, la scelta resta (${motore}), la scena in vista finisce`, Math.abs(r.y - y) < 160 && r.scelta === 'tar' && r.comandi === 3 && r.pacchi && !r.terminaleAttesa && r.js, JSON.stringify({prima: y, ...r}));
      await foto(p, 'ricarica-meta');
      // ricarica durante l'arrivo: riparte da capo e arriva allo stato finale
      await p.evaluate(() => scrollTo(0, 0)); await ricarica(p); await p.waitForTimeout(3000); await ricarica(p); await p.waitForTimeout(9500);
      const t = await p.evaluate(() => ({installata: document.querySelector('.chiamata-installa').classList.contains('installata'), attesa: document.querySelector('.terminale-palco').classList.contains('in-attesa'), comando: [...document.querySelectorAll('.terminale-palco .t-comando')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim()).join('|')}));
      ok('ricaricando durante l\'arrivo la pagina riparte da capo e arriva allo stato finale (con la scelta fatta)', t.installata && !t.attesa && /\.\/install/.test(t.comando), JSON.stringify(t));
      // ricarica con una frase premuta: tutto riparte come all'arrivo
      await p.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(900);
      await p.locator('.frase-bottone[data-stato=rete]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=rete]'); await p.waitForTimeout(600);
      await ricarica(p); await p.waitForTimeout(2200);
      ok('ricaricando con una frase premuta si riparte senza (nessuna frase premuta, nessun errore in finestra)', await p.evaluate(() => document.querySelectorAll('.frase-bottone[aria-pressed=true]').length === 0 && !document.querySelector('.finestra.avvio').classList.contains('errore')));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    // =================================================================================================================
    if (sc === 'a-meta') {
      // la distribuzione cambiata a metà dell'arrivo, a metà del confronto dell'impronta, a metà della discesa dei file, e a raffica: alla fine tutto è coerente
      const coerente = async (p, s, etichetta) => {
        await p.waitForTimeout(500);
        const t = await aspetta(p, ([s, re]) => { const e = [...document.querySelectorAll('.terminale-palco .t-comando')].find(x => x.getClientRects().length); const ok1 = e && new RegExp(re).test(e.textContent.replace(/\s+/g, ' ').trim().replace(/^\$ /, '')) && !e.querySelector('.t-resto, .t-cursore'); return ok1 && !document.querySelector('.terminale-palco').classList.contains('in-attesa'); }, [s, COMANDO_TERMINALE[s].source], 12000);
        const m = await p.evaluate(mostrato);
        ok(`${etichetta}: alla fine il terminale del primo schermo ha il comando di «${NOMI[s]}» intero, e pulsante, riga e comandi sono i suoi`, t >= 0 && m.scelta === s && m.pulsanti.length === 1 && ATTESO[s].scarica.test(m.pulsanti[0]) && m.comandiInstalla === ATTESO[s].comandi, JSON.stringify({t, ...m}));
      };
      {
        const {ctx, p, errori} = await apri();
        await p.waitForTimeout(3100);   // il comando si sta scrivendo (comincia a 2 s)
        await p.click('label[for=sistema-rpm]'); await p.waitForTimeout(900);
        await p.click('label[for=sistema-arch]');
        await coerente(p, 'arch', 'cambiata mentre il comando si scrive');
        ok('  il posto di «Kalliope» si riempie (dopo il comando) e non richiude', await aspetta(p, () => document.querySelector('.chiamata-installa').classList.contains('installata'), null, 5000) >= 0);
        await foto(p, 'a-meta-arrivo');
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      {
        const {ctx, p, errori} = await apri();
        await p.waitForTimeout(800);
        await p.evaluate(() => document.querySelector('.controllo-scena').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2800);   // il confronto è in corso
        await p.click('label[for=sistema-tar]'); await p.waitForTimeout(700); await p.click('label[for=sistema-rpm]');
        const f = await aspetta(p, () => !document.querySelector('.terminale-controllo').classList.contains('in-attesa') && [...document.querySelectorAll('.terminale-controllo .t-gruppo')].filter(g => g.getClientRects().length).every(g => g.classList.contains('uguale')), null, 12000);
        const m = await p.evaluate(mostrato);
        ok('cambiata a metà del confronto dell\'impronta: alla fine i gruppi visibili sono tutti uguali, «Uguale» c\'è, la scelta è Fedora', f >= 0 && m.scelta === 'rpm' && await p.evaluate(() => [...document.querySelectorAll('.t-esito')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1)), JSON.stringify({f, scelta: m.scelta}));
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      {
        const {ctx, p, errori} = await apri();
        await p.waitForTimeout(800);
        await p.evaluate(() => document.querySelector('.disco').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2200);   // i file stanno scendendo
        await p.click('label[for=sistema-arch]', {force: true}).catch(() => {}); await p.evaluate(() => document.querySelector('label[for=sistema-tar]').click());
        const f = await aspetta(p, () => [...document.querySelectorAll('.pacco')].filter(e => e.getClientRects().length).every(e => +getComputedStyle(e).opacity === 1) && !document.querySelector('.terminale-installa').classList.contains('in-attesa'), null, 12000);
        ok('cambiata a metà della discesa dei file: alla fine i quattro file sono nella cartella, il terminale ha finito', f >= 0, `${f} ms`);
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      {
        const {ctx, p, errori} = await apri();
        await p.waitForTimeout(2600);
        for (const s of ['rpm', 'arch', 'tar', 'deb', 'rpm', 'tar']) { await p.evaluate(s => document.querySelector(`label[for=sistema-${s}]`).click(), s); await p.waitForTimeout(70); }
        await coerente(p, 'tar', 'sei scelte in mezzo secondo');
        ok('  console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
    }
  } catch (e) { ok(`${sc}: eccezione`, false, e.stack.split('\n').slice(0, 4).join(' / ')); }
}
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-robustezza-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
