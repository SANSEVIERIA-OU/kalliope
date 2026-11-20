// Ciò che si copia, in ogni pagina del sito costruita da destra a sinistra (home, «non ancora», «stato», «installa», la scelta della lingua): gli appunti veri dopo ogni pulsante «Copia» e il testo di una
// selezione a mano di ogni elemento tecnico (<code>, <pre>, <kbd>, <samp>, dir="ltr", un data-t-no che sta da solo) non devono avere segni invisibili (U+2066–2069, U+200E/F, U+202A–E).
// Uso: PORTA=… node appunti-pagine.mjs <cartella-sito> <motore> <WxH> <lingua[,lingua…]> [--pagine=a,b]     (lingua: ar, ur, ar-XB, it…)
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const argomenti = process.argv.slice(2);
const [cartella, motore = 'chromium', misura = '1440x900', lingue = 'ar,ur'] = argomenti.filter(a => !a.startsWith('--'));
const [W, H] = misura.split('x').map(Number);
const PAGINE = (argomenti.find(a => a.startsWith('--pagine=')) || '--pagine=,non-ancora/,stato/,installa/').split('=')[1].split(',');
const SEGNI = /[⁦-⁩‎‏‪-‮]/;
const mostra = s => String(s).replace(/[⁦-⁩‎‏‪-‮]/g, c => `<U+${c.codePointAt(0).toString(16).toUpperCase()}>`);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let ok = 0, no = 0;
const esito = (v, nome, dettaglio) => { if (v) ok++; else no++; console.log(`${v ? 'ok  ' : 'NO  '} ${nome}${dettaglio ? ' · ' + dettaglio : ''}`); };
const leggiAppunti = async p => {
  try { const t = await p.evaluate(() => navigator.clipboard.readText()); if (typeof t === 'string') return t; } catch {}
  await p.evaluate(() => { let t = document.getElementById('__incolla'); if (!t) { t = document.createElement('textarea'); t.id = '__incolla'; t.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0'; document.body.append(t); } t.value = ''; t.focus(); });
  await p.keyboard.press('Control+V'); await p.waitForTimeout(150);
  return p.evaluate(() => document.getElementById('__incolla').value);
};
for (const L of lingue.split(',')) for (const pg of PAGINE) {
  const percorso = `${L}/${pg}`, nome = `${L}/${pg || '(home)'}`;
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...(motore === 'chromium' ? {permissions: ['clipboard-read', 'clipboard-write']} : {})});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(1500);
  // 1) la selezione a mano di ogni elemento tecnico
  const sel = await p.evaluate(() => {
    const vis = e => e.getClientRects().length > 0;
    const tecnici = new Set([...document.querySelectorAll('code, pre, kbd, samp, [dir=ltr]')]);
    const CHE_SI_COPIA = ["un comando", "un'impronta", "nome di un file", "il percorso di un file", "una cartella", "l'indirizzo della pagina", "ciò che ", "il nome del microfono nel sistema"];   // l'oracolo: i tipi di testo che si incollano in un terminale o in un messaggio (gli altri, nomi che si leggono e basta, tengono l'isolamento)
    for (const e of document.querySelectorAll('[data-t-no]')) { if (!CHE_SI_COPIA.some(k => e.getAttribute('data-t-no').startsWith(k))) continue; let x = e.parentElement, intro = false; for (; x; x = x.parentElement) if (x.hasAttribute('data-t')) { intro = true; break; } if (!intro) tecnici.add(e); }
    const out = {n: 0, nascosti: 0, cattivi: []};
    for (const e of tecnici) {
      if (e.closest('a[hreflang]')) continue;   // il nome di una lingua nel suo elenco (CLDR): non è testo tecnico né ha isolamenti
      const r = document.createRange(); r.selectNodeContents(e); const g = getSelection(); g.removeAllRanges(); g.addRange(r);
      const t = g.toString(); if (!vis(e)) out.nascosti++;
      out.n++;
      if (/[⁦-⁩‎‏‪-‮]/.test(t)) out.cattivi.push(`${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''}: ${t.slice(0, 40)}`);
    }
    return out;
  });
  esito(sel.cattivi.length === 0, `${nome}: selezione a mano di ${sel.n} elementi tecnici (${sel.nascosti} nascosti) senza segni invisibili`, sel.cattivi.length ? `${sel.cattivi.length} con segni, il primo: ${mostra(sel.cattivi[0])}` : '');
  // 2) gli appunti veri dopo ogni pulsante «Copia» visibile (anche quelli che la pagina mostra solo con lo script)
  const pulsanti = await p.evaluate(() => [...document.querySelectorAll('button')].filter(e => /copia/i.test(e.className) && e.getClientRects().length > 0).map((e, i) => { e.setAttribute('data-sonda', i); return e.className.split(' ').slice(0, 2).join('.') + ' «' + e.textContent.trim().slice(0, 24) + '»'; }));
  if (pulsanti.length) {
    // «installa» ne ha decine (uno per comando: li guarda lo scenario `appunti`): qui il primo e l'ultimo
    const quali = pulsanti.length > 4 ? [0, pulsanti.length - 1] : pulsanti.map((_, i) => i);
    for (const i of quali) {
      const bt = p.locator(`[data-sonda="${i}"]`);
      await bt.scrollIntoViewIfNeeded(); await bt.click(); await p.waitForTimeout(400);
      const t = await leggiAppunti(p);
      esito(!SEGNI.test(t) && t.length > 0, `${nome}: gli appunti dopo «${pulsanti[i]}» senza segni invisibili`, `${mostra(t).slice(0, 80).replace(/\n/g, '⏎')}`);
    }
  } else console.log(`--   ${nome}: nessun pulsante «Copia» visibile`);
  esito(errori.length === 0, `${nome}: console pulita`, errori.join(' | '));
  await ctx.close();
}
console.log(`${ok} ok, ${no} NO`);
await b.close(); server.close();
process.exit(no ? 1 : 0);
