// Testi rimasti in italiano nella pseudo-lingua en-XA: la pagina «non ancora» viva (arrivo, risposte di «Copia», messaggi d'errore, i nomi del comando
// nei suoi stati, l'annuncio). In en-XA ogni messaggio è accentato e fra [parentesi]: un testo visibile o letto che non lo è, è rimasto com'era.
// Uso: PLAYWRIGHT=… node pseudo-testi.mjs <cartella-sito> [lingua=en-XA]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, lingua = 'en-XA'] = process.argv.slice(2);
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/${lingua}/non-ancora/`;
const b = await avvia('chromium');
const trovati = new Map(); let n = 0;
const raccogli = async (p, stato) => {
  const r = await p.evaluate(() => {
    const visto = e => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden') return false; } return true; };
    const testi = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let t = w.nextNode(); t; t = w.nextNode()) { const s = t.textContent.trim().replace(/\s+/g, ' '); if (s && t.parentElement && !t.parentElement.closest('script, style, template') && visto(t.parentElement)) testi.push(s); }
    document.querySelectorAll('[aria-label], [title], [alt]').forEach(e => { if (visto(e) || e.classList.contains('solo-lettori')) for (const a of ['aria-label', 'title', 'alt']) if (e.getAttribute(a)) testi.push(e.getAttribute(a)); });
    const ann = document.querySelector('#annuncio'); if (ann && ann.textContent.trim()) testi.push(ann.textContent.trim());
    document.querySelectorAll('.solo-lettori').forEach(e => { if (e.textContent.trim()) testi.push(e.textContent.trim()); });
    return testi;
  });
  for (const t of r) { n++; const k = t; if (!trovati.has(k)) trovati.set(k, stato); }
};
const nuova = async (iniz) => { const ctx = await b.newContext({viewport: {width: 1440, height: 900}}); if (iniz) await ctx.route(/\/voce\/giulia-1\.(mp3|opus)$/, r => r.fulfill({status: 200, contentType: 'audio/mpeg', body: 'non è un suono'})); await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {origin: base}).catch(() => {}); const p = await ctx.newPage(); await p.goto(base, {waitUntil: 'load'}); await p.waitForTimeout(1500); return {ctx, p}; };
{
  const {ctx, p} = await nuova(false);
  await raccogli(p, 'arrivo');
  await p.evaluate(() => document.querySelector('#quando').scrollIntoView()); await p.waitForTimeout(2500); await raccogli(p, 'quando');
  await p.click('.copia-indirizzo'); await p.waitForTimeout(500); await raccogli(p, 'copia fatta');
  await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await p.click('.copia-indirizzo'); await p.waitForTimeout(500); await raccogli(p, 'copia non riuscita');
  await p.evaluate(() => document.querySelector('#ascolta').scrollIntoView()); await p.waitForTimeout(1500); await raccogli(p, 'chiusura');
  await p.click('.ascolta-ferma'); await p.waitForTimeout(150); await raccogli(p, 'ascolto: carica');
  await p.waitForTimeout(1500); await raccogli(p, 'ascolto: suona'); await p.click('.ascolta-ferma'); await p.waitForTimeout(300); await raccogli(p, 'ascolto: pausa');
  await ctx.close();
}
{
  const {ctx, p} = await nuova(true);
  await p.evaluate(() => document.querySelector('#ascolta').scrollIntoView()); await p.waitForTimeout(1200);
  await p.click('.ascolta-ferma'); await p.waitForTimeout(1500); await raccogli(p, 'errore: il suono non parte'); await ctx.close();
}
await b.close(); server.close();
// un testo di en-XA ha le lettere accentate in modo che l'italiano non ha (ŕ, ĝ, ṽ, þ, ð…) o le parentesi; un frammento senza niente di questo e con una parola
// italiana vera è rimasto com'era. I nomi propri e le cifre non si traducono.
const PSEUDO = /[\u0100-\u024F\u1E00-\u1EFF\u00C0-\u00C5\u00C7\u00D0\u00D1\u00D5-\u00D8\u00DB\u00DD\u00E1-\u00E5\u00E7\u00F0\u00F1\u00F5-\u00F8\u00FB\u00FD\u00FF\u00DE\u00FE\[\]]/;
const rimasti = [...trovati].filter(([t]) => !PSEUDO.test(t) && /[a-zàèéìòù]{3}/i.test(t) && !/^(Giulia|Marco|Kalliope|Tu|Paola|Luca|Anna|Windows|macOS|Zoom|Teams|Meet|Linux|PipeWire|x86_64|Microfono|Italiano|Menu)$/.test(t.replace(/[^\w]/g, ' ').trim()) && !/^English \(/.test(t) && !/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(t));   // il nome della lingua e la data li scrive la rifinitura dai dati CLDR
console.log(`${trovati.size} testi diversi guardati in ${lingua} (${n} letture), in 9 momenti`);
rimasti.forEach(([t, s]) => console.log(`   rimasto: «${t.slice(0, 90)}» (${s})`));
console.log(rimasti.length ? `NO ${rimasti.length} testi non cambiati` : 'ok: nessun testo è rimasto in italiano');
process.exit(rimasti.length ? 1 : 0);
