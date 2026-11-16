// In en-XA ogni lettera è accentata: una parola in lettere semplici che la pagina mostra, fa leggere o mette negli attributi è un testo
// che nessuno ha segnato (o una stringa dello script rimasta dentro lo script). Si guarda la pagina viva: all'arrivo, mentre la scena
// scrive, col menu e l'ascolto aperti, con l'errore dell'audio, dopo il primo avvio.
// Uso: node testi-rimasti.mjs <cartella del sito costruito con --pseudo>
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const server = await servi(process.argv[2], {porta: 0});
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await avvia('chromium');
const trovati = new Map();
const scansione = async (p, quando) => {
  const r = await p.evaluate(() => {
    const out = [];
    const parole = t => t.match(/[A-Za-z]{3,}/g) || [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const e = n.parentElement;
      if (!e || e.closest('script, style, template, noscript') || !n.textContent.trim()) continue;
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const ps = parole(n.textContent); if (ps.length) out.push({tipo: 'testo', testo: n.textContent.trim().slice(0, 70), parole: ps});
    }
    for (const e of document.querySelectorAll('[aria-label], [title], [placeholder], [alt]')) {
      for (const a of ['aria-label', 'title', 'placeholder', 'alt']) { const v = e.getAttribute(a); if (v && parole(v).length) out.push({tipo: a, testo: v.slice(0, 70), parole: parole(v)}); }
    }
    for (const sel of ['title', 'meta[name=description]']) { const e = document.querySelector(sel); const v = e && (e.content ?? e.textContent); if (v && parole(v).length) out.push({tipo: sel, testo: v.slice(0, 70), parole: parole(v)}); }
    out.push(...[...document.querySelectorAll('#annuncio')].filter(e => e.textContent && parole(e.textContent).length).map(e => ({tipo: 'annuncio', testo: e.textContent, parole: parole(e.textContent)})));
    return out;
  });
  for (const x of r) { const k = `${x.tipo}|${x.testo}`; if (!trovati.has(k)) trovati.set(k, {...x, quando}); }
};
const nuova = async (opz = {}) => { const ctx = await browser.newContext({viewport: {width: 1280, height: 800}, ...opz}); const p = await ctx.newPage(); await p.route(/\/voce\/[a-z]+-\d\.(opus|mp3)$/, r => r.abort()); return {ctx, p}; };   // le registrazioni non arrivano; i tempi sì (la scena scrive e parla da sola)
// 1. con il movimento: la scena scrive e parla da sola; poi si scende fino in fondo (primo avvio, requisiti)
{
  const {ctx, p} = await nuova();
  await p.goto(`${base}/en-XA/`, {waitUntil: 'load'});
  for (const t of [1500, 3500, 5500, 7500, 9500]) { await p.waitForTimeout(t === 1500 ? 1500 : 2000); await scansione(p, `arrivo, ${t} ms`); }
  for (let y = 700; y < 7000; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(900); await scansione(p, `scorrendo, y=${y}`); }
  await p.waitForTimeout(6000); await scansione(p, 'dopo il primo avvio');
  await ctx.close();
}
// 2. ascolto aperto e errore dell'audio (le registrazioni non arrivano), poi il filo
{
  const {ctx, p} = await nuova({reducedMotion: 'reduce'});
  await p.goto(`${base}/en-XA/`, {waitUntil: 'load'}); await p.waitForTimeout(1200);
  await p.click('#ascolta'); await p.waitForTimeout(1500); await scansione(p, 'ascolto aperto, errore dell\'audio');
  await p.evaluate(() => document.querySelector('#chiudi').click()); await p.waitForTimeout(700);
  await p.evaluate(() => document.querySelector('.suona-frase[data-frase="2"]').scrollIntoView()); await p.click('.suona-frase[data-frase="2"]'); await p.waitForTimeout(1500); await scansione(p, 'errore nel filo');
  await ctx.close();
}
// 3. menu aperto e telefono
{
  const {ctx, p} = await nuova({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  await p.goto(`${base}/en-XA/`, {waitUntil: 'load'}); await p.waitForTimeout(1200);
  await p.click('.pulsante-menu'); await p.waitForTimeout(500); await scansione(p, 'menu aperto (390)');
  await ctx.close();
}
await browser.close(); server.close();
// ciò che resta è atteso solo se è un nome proprio o un'unità che la pseudo-lingua non tocca
const ATTESI = /^(MB|IVA|PipeWire|Linux|Windows|macOS|Zoom|Teams|Meet|SANSEVIERIA|OSI|VAT|x86_64|rc|mp3|English|pseudo|accented|Italiano|November|RTL)$/i;   // nomi, unità, i nomi delle lingue e la data che la costruzione scrive
const male = [...trovati.values()].filter(x => x.parole.some(w => !ATTESI.test(w)));
for (const x of male) console.log(`NO  [${x.quando}] ${x.tipo}: «${x.testo}» → ${x.parole.join(' ')}`);
console.log(male.length ? `${male.length} testi in lettere semplici` : 'nessun testo rimasto in italiano: tutto ciò che si vede o si sente leggere passa dal catalogo');
process.exit(male.length ? 1 : 0);
