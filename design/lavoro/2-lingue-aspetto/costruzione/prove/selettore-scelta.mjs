// La pagina della scelta della lingua («/»): tastiera, scelta ricordata e ritorno, senza JavaScript, movimento ridotto, larghezze.
// Uso: node selettore-scelta.mjs <sito costruito con le lingue di prova> [--motori chromium,firefox,webkit] [--porta 8849] [--foto <cartella>]
import {mkdirSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, pagina, tocco} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const sito = process.argv[2], foto = arg('--foto', '');
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8849), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
let rosse = 0;
const dice = (ok, testo) => { if (!ok) rosse++; console.log(`  ${ok ? 'ok   ' : 'ROSSO'} ${testo}`); };
const N = (await (await fetch(base)).text()).match(/<html[^>]*data-lingue="([^"]+)"/)?.[1].split(' ').length || 0;
console.log(`lingue pubblicate: ${N}`);
const nuova = async (b, opz, url = '?lingue', attesa = 600) => { const ctx = await b.newContext(opz); const errori = []; const p = pagina(await ctx.newPage(), errori); await p.goto(base + url, {waitUntil: 'load'}); await p.waitForTimeout(attesa); return {ctx, p, errori}; };
const fuoco = p => p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return {nulla: true}; const r = e.getBoundingClientRect(), s = getComputedStyle(e), sopra = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {testo: e.textContent.trim(), href: e.getAttribute('href'), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), h: Math.round(r.height), inVista: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1, coperto: !(sopra && (sopra === e || e.contains(sopra))),
    segno: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none', preferita: !!e.closest('.preferita')}; });

for (const motore of arg('--motori', 'chromium,firefox,webkit').split(',')) {
  console.log(motore);
  const b = await avvia(motore);
  // ---------- tastiera: l'ordine è quello che si vede ----------
  {
    const {ctx, p, errori} = await nuova(b, {viewport: {width: 1440, height: 900}, locale: 'de-DE', reducedMotion: 'reduce'});
    const nomi = await p.evaluate(() => [...document.querySelectorAll('.lingue-in-bolla a')].map(a => a.textContent.trim()));
    dice(nomi[0] === 'Deutsch' && await p.evaluate(() => document.querySelector('.lingue-in-bolla li:first-child').classList.contains('preferita')), `[scelta] la lingua del browser (de) è la prima e accesa: «${nomi.slice(0, 3).join('», «')}…»`);
    const passi = [];
    for (let i = 0; i < N + 2; i++) { await p.keyboard.press('Tab'); passi.push(await fuoco(p)); }
    const voci = passi.filter(x => !x.nulla && x.href && /^[a-z-]+\/$/.test(x.href));
    let ordine = voci.length >= N;
    for (let i = 1; i < N; i++) { const a = voci[i - 1], c = voci[i]; if (!(Math.abs(c.y - a.y) < a.h / 2 ? c.x > a.x : c.y > a.y)) ordine = false; }
    dice(ordine && voci.slice(0, N).map(x => x.testo).join() === nomi.join(), `[scelta] Tab percorre ${N} nomi nell'ordine in cui si leggono (riga per riga, da sinistra a destra), uguale all'ordine del documento`);
    dice(voci.slice(0, N).every(x => x.inVista && !x.coperto && x.segno), `[scelta] ogni nome con il fuoco sta nello schermo, niente lo copre e ha il segno del fuoco`);
    if (foto && motore === 'chromium') { await p.focus('.lingue-in-bolla li:nth-child(4) a'); await p.screenshot({path: `${foto}/scelta-fuoco-1440.png`}); }
    // Invio sul nome: porta alla lingua, che si ricorda
    await p.focus('.lingue-in-bolla li:nth-child(3) a'); const dove = await p.evaluate(() => document.activeElement.getAttribute('href'));
    await Promise.all([p.waitForURL(u => u.pathname === '/' + dove), p.keyboard.press('Enter')]);
    dice(await p.evaluate(() => localStorage.getItem('kalliope.lingua')) === dove.replace('/', ''), `[scelta] Invio su un nome porta a /${dove} e la ricorda`);
    dice(!errori.length, `[scelta] nessun errore di console (${errori.length}${errori.length ? ': ' + errori[0] : ''})`);
    await ctx.close();
  }
  // ---------- la scelta ricordata, il ritorno, la ricarica ----------
  {
    const {ctx, p} = await nuova(b, {viewport: {width: 1440, height: 900}, locale: 'it-IT', reducedMotion: 'reduce'}, '');
    const prima = new URL(p.url()).pathname;
    await Promise.all([p.waitForURL(/\/it\//), p.click('.lingue-in-bolla a[hreflang="it"]')]);
    await p.waitForTimeout(400);
    await p.goBack({waitUntil: 'load'}); await p.waitForTimeout(900);
    const tornato = new URL(p.url()).pathname;
    dice(prima === '/' && tornato === '/' && await p.evaluate(() => !!document.querySelector('.scelta-lingua')), `[ritorno] da «/» alla pagina italiana e «Indietro»: si torna alla scelta (${tornato}), che non rimanda subito avanti`);
    await p.goForward({waitUntil: 'load'}).catch(() => {}); await p.waitForTimeout(300);
    await p.goto(base, {waitUntil: 'load'}); await p.waitForURL(/\/it\//, {timeout: 3000}).catch(() => {});
    dice(new URL(p.url()).pathname === '/it/', `[ritorno] «/» con la scelta ricordata porta a ${new URL(p.url()).pathname}`);
    await p.evaluate(() => localStorage.setItem('kalliope.lingua', '../../esempio'));
    await p.goto(base, {waitUntil: 'load'}); await p.waitForTimeout(700);
    dice(new URL(p.url()).pathname === '/' && await p.evaluate(() => !!document.querySelector('.scelta-lingua')), `[ritorno] una scelta ricordata che non è una lingua del sito (valore scritto a mano) mostra la scelta, non porta altrove`);
    await p.evaluate(() => localStorage.setItem('kalliope.lingua', 'zz'));
    await p.goto(base, {waitUntil: 'load'}); await p.waitForTimeout(500);
    dice(new URL(p.url()).pathname === '/', `[ritorno] una lingua ricordata che il sito non ha (zz) mostra la scelta`);
    await p.reload({waitUntil: 'load'}); await p.waitForTimeout(500);
    dice(new URL(p.url()).pathname === '/' && await p.evaluate(() => !!document.querySelector('.lingue-in-bolla a')), `[ritorno] ricaricando la scelta si ricarica la scelta`);
    await ctx.close();
  }
  // ---------- senza JavaScript ----------
  {
    const {ctx, p} = await nuova(b, {viewport: {width: 1440, height: 900}, locale: 'de-DE', javaScriptEnabled: false}, '?lingue', 4500);   // l'arrivo (CSS) dura fino a ~3 s anche senza script
    const r = await p.evaluate(() => { const a = [...document.querySelectorAll('.lingue-in-bolla a')]; return {n: a.length, tutti: a.every(x => x.getAttribute('href') && x.getAttribute('lang') && x.getAttribute('hreflang')), opachi: a.every(x => +getComputedStyle(x.closest('li')).opacity === 1), dentro: a.every(x => { const q = x.getBoundingClientRect(); return q.left >= 0 && q.right <= innerWidth && q.top >= 0 && q.bottom <= innerHeight; }), primo: a[0].textContent.trim(), codici: a.map(x => x.getAttribute('href'))}; });
    dice(r.n === N && r.tutti && r.dentro && r.opachi, `[senza JS] ${r.n}/${N} nomi, tutti collegamenti con href, lang e hreflang, tutti nello schermo e visibili`);
    const ordinati = [...r.codici].sort().join() === r.codici.join();
    dice(ordinati, `[senza JS] l'ordine è quello dei codici (${r.codici.slice(0, 4).join(' ')}…): senza script non si sposta la lingua del browser`);
    await Promise.all([p.waitForURL(/\/[a-z-]+\/$/), p.click(`.lingue-in-bolla a[hreflang="it"]`)]);
    dice(new URL(p.url()).pathname === '/it/', `[senza JS] un nome porta alla lingua (${new URL(p.url()).pathname})`);
    await ctx.close();
  }
  // ---------- movimento ridotto e movimento normale ----------
  for (const ridotto of [true, false]) {
    const {ctx, p} = await nuova(b, {viewport: {width: 1440, height: 900}, locale: 'it-IT', reducedMotion: ridotto ? 'reduce' : 'no-preference'}, '?lingue', 50);
    const a0 = await p.evaluate(() => ({animazioni: document.getAnimations().filter(x => x.timeline === document.timeline).length, lunghe: document.getAnimations().filter(x => x.timeline === document.timeline && x.effect.getComputedTiming().duration > 1).map(x => x.animationName || x.constructor.name), nomi: [...document.querySelectorAll('.lingue-in-bolla li')].map(x => +getComputedStyle(x).opacity), bolla: +getComputedStyle(document.querySelector('.bolla-lingue')).opacity}));
    // una foto prima che arrivino i caratteri mostra il ripiego, e in WebKit le transizioni da 1 ms (base.css) finiscono dopo qualche centinaio di millisecondi: non è movimento
    if (ridotto) { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); }
    const s0 = ridotto ? await p.screenshot() : null;
    await p.waitForTimeout(ridotto ? 3000 : 4500);   // (ridotto: 3 s dopo la prima foto)
    const a1 = await p.evaluate(() => ({animazioni: document.getAnimations().filter(x => x.timeline === document.timeline && x.playState === 'running').length, nomi: [...document.querySelectorAll('.lingue-in-bolla li')].map(x => +getComputedStyle(x).opacity), bolla: +getComputedStyle(document.querySelector('.bolla-lingue')).opacity}));
    if (ridotto) {
      const s1 = await p.screenshot();
      dice(a0.lunghe.length === 0 && a0.nomi.every(x => x === 1) && a0.bolla === 1 && s0.equals(s1), `[movimento ridotto] nessuna animazione più lunga di 1 ms (${a0.animazioni} da 1 ms, base.css; più lunghe: ${a0.lunghe.join(', ') || 'nessuna'}), la bolla e i ${a0.nomi.length} nomi già al loro posto fin dal primo istante, e la pagina a 0,6 s e a 3,6 s è la stessa (${s0.equals(s1) ? 'foto identiche' : 'FOTO DIVERSE'})`);
    } else {
      dice(a0.animazioni > 0 && a0.nomi.some(x => x < 1 || a0.bolla < 1) && a1.nomi.every(x => x === 1) && a1.bolla === 1, `[movimento normale] a 50 ms ${a0.animazioni} animazioni e i nomi non ancora accesi (bolla ${a0.bolla.toFixed(2)}); a 4,5 s tutto acceso e fermo (${a1.animazioni} animazioni in corso)`);
    }
    await ctx.close();
  }
  // ---------- la scheda in secondo piano: l'arrivo avviene mentre la scheda è nascosta ----------
  // Senza finestra nessun motore rende nascosta una scheda con bringToFront (document.visibilityState resta «visible»): non lo si fa credere. Soltanto in Chromium si congela la scheda
  // come fa il browser con una scheda in secondo piano (CDP Page.setWebLifecycleState «frozen»: né script né timer), e la si risveglia; negli altri motori la prova è dichiarata non verificabile.
  if (motore === 'chromium') {
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'}); const errori = [];
    const p = pagina(await ctx.newPage(), errori); const cdp = await ctx.newCDPSession(p);
    await p.goto(base + '?lingue', {waitUntil: 'commit'});
    await p.waitForTimeout(150);
    await cdp.send('Page.enable'); await cdp.send('Page.setWebLifecycleState', {state: 'frozen'});   // la scheda sparisce dallo schermo durante l'arrivo
    await new Promise(r => setTimeout(r, 5000));
    await cdp.send('Page.setWebLifecycleState', {state: 'active'}); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => ({nomi: [...document.querySelectorAll('.lingue-in-bolla li')].map(x => +getComputedStyle(x).opacity), bolla: +getComputedStyle(document.querySelector('.bolla-lingue')).opacity, guarda: [...document.querySelectorAll('.scelta-tavolo .persona')].filter(x => x.classList.contains('guarda')).length, preferita: !!document.querySelector('.preferita')}));
    dice(r.nomi.length === N && r.nomi.every(x => x === 1) && r.bolla === 1 && r.guarda === 3 && !errori.length, `[scheda in secondo piano] congelata 5 s durante l'arrivo e risvegliata: ${r.nomi.filter(x => x === 1).length}/${r.nomi.length} nomi accesi, bolla ${r.bolla}, ${r.guarda}/3 persone girate, ${errori.length} errori`);
    await ctx.close();
  } else console.log(`  ----  [scheda in secondo piano] non verificabile in ${motore}: senza finestra il motore non rende nascosta una scheda`);
  // ---------- larghezze: la scelta sta nello schermo, o dove non ci sta si scorre e ogni nome si raggiunge ----------
  // sugli schermi bassi (1366×640, 360×640, il quadrato da 326) trenta nomi non stanno insieme alla fila di riquadri: la fila è decorativa e si scorre
  for (const [w, h, intera] of [[1440, 900, true], [1366, 640, false], [1024, 768, true], [820, 1180, true], [390, 844, true], [360, 640, false], [844, 390, true], [326, 326, false]]) {
    const {ctx, p} = await nuova(b, {viewport: {width: w, height: h}, locale: 'it-IT', reducedMotion: 'reduce', ...(w < 500 || h < 500 ? tocco(motore, true) : {})});
    const r = await p.evaluate(() => { const q = s => { const e = document.querySelector(s); const r = e && e.getBoundingClientRect(); return r && [Math.round(r.top), Math.round(r.bottom)]; };
      const a = [...document.querySelectorAll('.lingue-in-bolla a')].map(x => x.getBoundingClientRect()), bolla = document.querySelector('.bolla-lingue .bolla-corpo').getBoundingClientRect();
      return {largo: document.documentElement.scrollWidth - innerWidth, alto: document.documentElement.scrollHeight - innerHeight, titolo: q('.scelta-titolo'), bolla: q('.bolla-lingue'), fila: q('.tavolo-cornice'), nomiFuori: a.filter(x => x.left < bolla.left - 1 || x.right > bolla.right + 1).length, ultimoNome: Math.round(Math.max(...a.map(x => x.bottom)))}; });
    // in fondo alla pagina l'ultimo nome è nello schermo e niente lo copre
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(300);
    const fondo = await p.evaluate(() => { const a = [...document.querySelectorAll('.lingue-in-bolla a')], e = a.at(-1), q = e.getBoundingClientRect(), s = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return {dentro: q.top >= 0 && q.bottom <= innerHeight, coperto: !(s && (s === e || e.contains(s)))}; });
    const ok = r.largo <= 0 && r.nomiFuori === 0 && fondo.dentro && !fondo.coperto && (!intera || (r.alto <= 3 && r.fila[1] <= h));
    dice(ok, `[${w}×${h}] nessuno scorrimento di lato; titolo ${r.titolo}, bolla ${r.bolla[0]}–${r.bolla[1]}, fila ${r.fila[0]}–${r.fila[1]}; ${r.alto <= 3 ? 'sta tutto nello schermo' : 'si scorre di ' + r.alto + ' px'}${intera ? '' : ' (schermo basso, dichiarato)'}; in fondo l'ultimo nome è ${fondo.dentro && !fondo.coperto ? 'nello schermo' : 'FUORI O COPERTO'}; nomi fuori dalla bolla: ${r.nomiFuori}`);
    if (foto && motore === 'chromium') { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(200); await p.screenshot({path: `${foto}/scelta-${w}x${h}.png`}); }
    await ctx.close();
  }
  await b.close();
}
server.close();
console.log(rosse ? `${rosse} ROSSE` : 'tutto ok');
process.exit(rosse ? 1 : 0);
