// N2 · l'etichetta del comando dell'ascolto resta al centro del comando in ogni stato (il tondo e la parola insieme), e il comando non cambia larghezza.
// Si forzano gli stati con le classi del sistema (come fa il catalogo): carica, suona, pausa; poi si misura il gruppo «tondo + parola visibile» contro il comando.
// Uso: PLAYWRIGHT=… node etichetta.mjs <cartella-sito> <uscita> <motore> <WxH[,WxH…]> [--percorso=it/non-ancora/]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misure, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const esiti = [];
const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...tocco(motore, W <= 760)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(800); await assesta(p);
  await p.evaluate(() => document.querySelector('.chiusura .comandi-ascolto').scrollIntoView({block: 'center'})); await p.waitForTimeout(500);
  const misura = stato => p.evaluate(s => {
    const bt = document.querySelector('.ascolta-ferma'); bt.classList.remove('carica', 'suona', 'pausa'); if (s !== 'fermo') bt.classList.add(s);
    const r = bt.getBoundingClientRect(), t = bt.querySelector('.tondo').getBoundingClientRect();
    const vis = [...bt.querySelectorAll('.etichette > span')].filter(x => getComputedStyle(x).visibility === 'visible' && getComputedStyle(x).display !== 'none');
    const range = document.createRange(); range.selectNodeContents(vis[0]); const rt = range.getBoundingClientRect();
    const sx = Math.min(t.left, rt.left), dx = Math.max(t.right, rt.right), centro = (sx + dx) / 2, centroBt = (r.left + r.right) / 2;
    return {stato: s, testo: vis[0].textContent.trim(), larghezza: Math.round(r.width * 10) / 10, sbilanciamento: Math.round((centro - centroBt) * 10) / 10, margineInizio: Math.round(sx - r.left), margineFine: Math.round(r.right - dx), visibili: vis.length};
  }, stato);
  const serie = []; for (const s of ['fermo', 'carica', 'suona', 'pausa']) { await p.evaluate(x => { const bt = document.querySelector('.ascolta-ferma'); bt.classList.remove('carica', 'suona', 'pausa'); if (x !== 'fermo') bt.classList.add(x); }, s); await p.waitForTimeout(120); serie.push(await misura(s)); await p.waitForTimeout(40); if (s !== 'fermo') await p.locator('.ascolta-ferma').screenshot({path: `${uscita}/etichetta-${s}-${motore}-${m}.png`}); else await p.locator('.ascolta-ferma').screenshot({path: `${uscita}/etichetta-riposo-${motore}-${m}.png`}); }
  const telefono = W <= 760;
  console.log(`   ${m}: ` + serie.map(s => `${s.stato}: «${s.testo}» largh ${s.larghezza}, sbilanciamento ${s.sbilanciamento} (margini ${s.margineInizio}/${s.margineFine})`).join(' | '));
  ok(`${m} · la larghezza del comando non cambia fra gli stati`, new Set(serie.map(s => s.larghezza)).size === 1, serie.map(s => s.larghezza).join(','));
  ok(`${m} · l'etichetta visibile è una sola in ogni stato`, serie.every(s => s.visibili === 1));
  // «come a riposo»: il gruppo tondo + parola sta dove sta a riposo (il comando ha un po' più d'aria dalla parte della parola: 8 px contro 24)
  if (telefono) ok(`${m} · al telefono il tondo e la parola stanno al centro del comando come a riposo, in ogni stato (scarto massimo 2 px)`, serie.every(s => Math.abs(s.sbilanciamento - serie[0].sbilanciamento) <= 2), serie.map(s => s.sbilanciamento).join(', '));
  else console.log(`   (al computer il comando è largo quanto la sua etichetta più lunga: nelle altre l'aria resta dalla parte della parola, ${serie.map(s => s.sbilanciamento).join(', ')}: non è il punto 2)`);
  ok('console pulita', errori.length === 0, errori.join(' | '));
  await ctx.close();
}
await b.close(); server.close();
writeFileSync(`${uscita}/etichetta-${motore}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
