// La scelta della lingua, l'elenco nelle pagine, la memoria, i vecchi indirizzi, il verso e le cifre, in un sito costruito con più lingue.
// Uso: node prova-lingue.mjs <cartella del sito costruito con ar en it pl zh bn> [--motore chromium|firefox|webkit]
import {existsSync, readFileSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const cartella = process.argv[2], motore = arg('--motore', 'chromium');
const server = await servi(cartella, {porta: +arg('--porta', 8775), fresco: true});
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await avvia(motore);
const esiti = [];
const prova = (nome, ok, dettaglio = '') => { esiti.push({nome, ok: !!ok, dettaglio}); console.log(`${ok ? 'ok  ' : 'NO  '} ${nome}${ok ? '' : ' — ' + dettaglio}`); };
const contesto = (opz = {}) => browser.newContext({viewport: {width: 1280, height: 800}, reducedMotion: 'reduce', ...opz});
const fa = (...v) => v.join(',');

// 1. la pagina di scelta, senza spostarsi, con la lingua del browser per prima
{
  const ctx = await contesto({locale: 'pl-PL'});
  await ctx.addInitScript(() => Object.defineProperty(navigator, 'languages', {get: () => ['pl-PL', 'en-US', 'en']}));
  const p = await ctx.newPage();
  await p.goto(base + '/');
  await p.waitForTimeout(300);
  prova('scelta: nessuno spostamento (resta a /)', new URL(p.url()).pathname === '/', p.url());
  const voci = await p.$$eval('[data-lingue="elenco"] a', as => as.map(a => ({lang: a.lang, testo: a.textContent, hreflang: a.getAttribute('hreflang'), href: a.getAttribute('href')})));
  prova('scelta: ogni lingua nel proprio nome, con il suo lang', voci.length >= 6 && voci.every(v => v.lang && v.testo.trim() && !v.testo.includes('<')), JSON.stringify(voci));
  prova('scelta: la lingua del browser per prima (pl, poi en)', voci[0].hreflang === 'pl' && voci[1].hreflang === 'en', voci.map(v => v.hreflang).join(','));
  prova('scelta: nessuna bandiera (né immagini né emoji di bandiera)', (await p.$$('img, [role="img"]')).length === 0 && !/[\u{1F1E6}-\u{1F1FF}]/u.test(await p.textContent('body')));
  prova('scelta: titolo e lingua della pagina', (await p.title()) === 'Kalliope' && (await p.getAttribute('html', 'lang')) === 'en');
  // scegliere ne ricorda la scelta
  await p.click('a[hreflang="en"]');
  await p.waitForURL('**/en/');
  prova('scelta: il collegamento porta alla lingua', new URL(p.url()).pathname === '/en/', p.url());
  prova('scelta: la scelta è ricordata (localStorage, non un cookie)', (await p.evaluate(() => localStorage.getItem('kalliope.lingua'))) === 'en' && (await ctx.cookies()).length === 0);
  await p.goto(base + '/');
  await p.waitForURL('**/en/', {timeout: 3000}).catch(() => {});
  prova('scelta: alla visita dopo porta alla lingua scelta', new URL(p.url()).pathname === '/en/', p.url());
  await p.goto(base + '/?lingue');
  await p.waitForTimeout(500);
  prova('scelta: «?lingue» mostra la scelta anche con una lingua ricordata', new URL(p.url()).pathname === '/', p.url());
  // dall'elenco di una pagina si cambia lingua e si resta sulla stessa pagina
  await p.goto(base + '/en/');
  await p.waitForLoadState('load');
  const href = await p.getAttribute('#lingue a[hreflang="it"]', 'href');
  prova('elenco: porta alla stessa pagina nell\'altra lingua (href relativo)', href === '../it/', href);
  await p.click('#lingue a[hreflang="it"]');
  await p.waitForURL('**/it/');
  prova('elenco: dopo il clic si è su /it/ e la lingua ricordata è it', new URL(p.url()).pathname === '/it/' && (await p.evaluate(() => localStorage.getItem('kalliope.lingua'))) === 'it');
  // una lingua ricordata che non c'è più non porta nel vuoto
  await p.evaluate(() => localStorage.setItem('kalliope.lingua', 'xx'));
  await p.goto(base + '/');
  await p.waitForTimeout(400);
  prova('scelta: una lingua ricordata che non è pubblicata si ignora', new URL(p.url()).pathname === '/', p.url());
  await ctx.close();
}

// 2. senza JavaScript: gli elenchi sono collegamenti e basta
{
  const ctx = await contesto({javaScriptEnabled: false});
  const p = await ctx.newPage();
  await p.goto(base + '/');
  const codici = await p.$$eval('[data-lingue="elenco"] a', as => as.map(a => a.getAttribute('hreflang')));
  prova('senza JavaScript: la scelta elenca tutte le lingue nell\'ordine del sito', codici.join(',') === 'ar,bn,en,it,pl,zh-Hans', codici.join(','));
  await p.click('a[hreflang="pl"]');
  await p.waitForURL('**/pl/');
  prova('senza JavaScript: il collegamento funziona', new URL(p.url()).pathname === '/pl/');
  await p.click('#lingue a[hreflang="zh-Hans"]');
  await p.waitForURL('**/zh/');
  prova('senza JavaScript: l\'elenco della pagina porta alla stessa pagina nell\'altra lingua', new URL(p.url()).pathname === '/zh/');
  await p.goto(base + '/installa/');
  await p.waitForURL('**/it/installa/', {timeout: 3000}).catch(() => {});
  prova('senza JavaScript: il vecchio indirizzo /installa/ porta a /it/installa/ (meta refresh)', new URL(p.url()).pathname === '/it/installa/', p.url());
  await ctx.close();
}

// 3. i vecchi indirizzi, con JavaScript: anche il frammento e la ricerca restano
{
  const ctx = await contesto();
  const p = await ctx.newPage();
  const rotte = [];
  p.on('response', r => { if (r.status() >= 400) rotte.push(`${r.status()} ${r.url()}`); });
  p.on('pageerror', e => rotte.push('pageerror ' + e.message));
  for (const [da, a] of [['/installa/', '/it/installa/'], ['/ascolta/', '/it/ascolta/'], ['/stato/', '/it/stato/'], ['/riunione/', '/it/riunione/'], ['/aiuto/', '/it/aiuto/'],
                         ['/non-ancora/', '/it/non-ancora/'], ['/sistema/', '/it/sistema/'], ['/sistema/ricerca/', '/it/sistema/ricerca/']]) {
    if (!existsSync(`${cartella}${da}index.html`)) { prova(`vecchio indirizzo ${da}: la pagina di rimando c'è`, false, 'manca il file'); continue; }
    await p.goto(base + da + '?x=1#microfono');
    await p.waitForURL(u => u.pathname === a, {timeout: 3000}).catch(() => {});
    const u = new URL(p.url());
    prova(`vecchio indirizzo ${da} → ${a} (con ricerca e frammento)`, u.pathname === a && u.hash === '#microfono' && u.search === '?x=1', p.url());
    await p.waitForLoadState('load');
    await p.waitForTimeout(250);
  }
  prova('vecchi indirizzi e pagine di prima: nessuna richiesta fallita né errore di script', rotte.filter(r => !/questa-pagina-non-esiste/.test(r)).length === 0, rotte.join(' | '));
  // i file della voce restano dove erano
  const r = await ctx.request.get(base + '/voce/giulia-1.mp3');
  prova('voce/giulia-1.mp3 risponde dove rispondeva', r.status() === 200);
  await ctx.close();
}

// 4. il verso, le cifre e il nome della lingua nelle pagine
{
  const ctx = await contesto();
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', e => errori.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
  for (const [lingua, dir, verso] of [['it', 'ltr', 1], ['en', 'ltr', 1], ['ar', 'rtl', -1], ['zh', 'ltr', 1], ['pl', 'ltr', 1], ['bn', 'ltr', 1]]) {
    await p.goto(`${base}/${lingua}/`, {waitUntil: 'load'});
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({
      dir: document.documentElement.dir, lang: document.documentElement.lang,
      css: getComputedStyle(document.documentElement).getPropertyValue('--verso').trim(), js: window.Testi.verso(),
      num: window.Testi.numero(1234.5), min: window.Testi.minuti(3), idx: document.querySelectorAll('[data-lingue="elenco"] li').length,
      selettore: document.querySelector('a[data-lingua-codice][aria-current="true"]')?.textContent,
      barra: document.querySelector('.menu a[lang]')?.textContent,
    }));
    prova(`/${lingua}/: dir=${dir}, --verso=${verso} letta dal CSS e da Testi.verso()`, r.dir === dir && r.css === String(verso) && r.js === verso, JSON.stringify(r));
    if (lingua === 'bn') prova('/bn/: le cifre del bengalese (Intl) nei numeri e nel tempo', /^[১২৩৪৫৬৭৮৯০]/.test(r.num) && /^০:০৩$/.test(r.min), `${r.num} ${r.min}`);
    if (lingua === 'it') prova('/it/: «0:03» e «1234,5» (CLDR: in italiano il punto non raggruppa le migliaia fino a cinque cifre) come prima', r.min === '0:03' && r.num === '1234,5', `${r.min} ${r.num}`);
    if (lingua === 'ar') prova('/ar/: nome della lingua nella barra e nell\'elenco', !!r.barra && r.selettore === 'العربية', `${r.barra} ${r.selettore}`);
  }
  prova('le pagine delle lingue: nessun errore di console', errori.length === 0, errori.join(' | '));
  await ctx.close();
}
await browser.close();
server.close();
const male = esiti.filter(e => !e.ok);
console.log(`\n${esiti.length - male.length} su ${esiti.length} prove riuscite (${motore})`);
process.exit(male.length ? 1 : 0);
