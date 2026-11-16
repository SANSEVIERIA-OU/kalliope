// Le tre frasi che lo script ricava dalla pagina sono quelle che prima stavano scritte dentro lo script?
// Uso: node frasi-uguali.mjs <cartella del sito costruito> <scena.js di prima> [percorso della pagina]
import {readFileSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const [cartella, vecchio, percorso = 'it/'] = process.argv.slice(2);
const server = await servi(cartella, {porta: 8774});
const vecchioTesto = readFileSync(vecchio, 'utf8');
const a = vecchioTesto.indexOf('  const w = (s, x = {}) => ({s, ...x});'), b = vecchioTesto.indexOf('  // ---------- i tempi ----------');
const codiceVecchio = vecchioTesto.slice(a, b) + '\nreturn FRASI;';
const nuovo = readFileSync(`${cartella}/scena.js`, 'utf8');
const c = nuovo.indexOf('  const w = (s, x = {}) => ({s, ...x});'), d = nuovo.indexOf('  const FRASI = {1: leggiFrase(1)');
const codiceNuovo = nuovo.slice(c, d) + '\nreturn {1: leggiFrase(1), 2: leggiFrase(2), 3: leggiFrase(3)};';
const browser = await avvia('chromium');
const p = await browser.newPage();
await p.goto(`http://127.0.0.1:${server.address().port}/${percorso}`, {waitUntil: 'load'});
const r = await p.evaluate(([cv, cn]) => {
  const $ = (s, r = document) => r.querySelector(s);
  const T = window.Testi.testo;
  const v = new Function('$', 'T', cv)($, T), n = new Function('$', 'T', cn)($, T);
  // i nomi delle unità («ora», «prezzo», «data» / «u1», «u2») valgono solo per uguaglianza: si confrontano per ordine di comparsa
  const unita = f => { const m = new Map(); for (const n of Object.keys(f)) for (const t of f[n].parti.flat()) if (t.u) { if (!m.has(n + t.u)) m.set(n + t.u, m.size); t.u = 'u' + m.get(n + t.u); } return f; };
  unita(v); unita(n);
  const norm = x => JSON.stringify(x, (k, val) => (val && typeof val === 'object' && !Array.isArray(val) ? Object.fromEntries(Object.entries(val).sort()) : val));
  return {uguali: norm(v) === norm(n), vecchio: norm(v), nuovo: norm(n)};
}, [codiceVecchio, codiceNuovo]);
console.log(r.uguali ? 'FRASI: uguali a quelle di prima (testo, parti, parole, gruppi, unità, lunghezze, chi annuisce)' : 'FRASI: DIVERSE');
if (!r.uguali) { console.log('prima:', r.vecchio); console.log('adesso:', r.nuovo); }
await browser.close(); server.close();
process.exit(r.uguali ? 0 : 1);
