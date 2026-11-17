// I caratteri candidati per una scrittura, resi nella home vera della lingua: lo stesso primo schermo con un carattere diverso.
// Uso: node prova-caratteri.mjs <sito costruito> <uscita> <lingua> <nome=file.ttf[:prima]> … [--porta 8801] [--misura 1440x900]
//   file.ttf sta in /tmp/lavoro-2-font/src/<famiglia>/; «:prima» mette il candidato prima di Lexend (anche per le lettere latine).
//   --spaziatura-zero: niente spaziatura fra le lettere nei titoli (per le scritture che la rompono)
// Il candidato arriva con un @font-face aggiunto alla pagina; il resto della pagina è quello costruito.
import {mkdirSync} from 'node:fs';
import {join, basename} from 'node:path';
import {execFileSync} from 'node:child_process';
import {readdirSync, existsSync} from 'node:fs';
const trova = f => readdirSync('/tmp/lavoro-2-font/src').map(d => `/tmp/lavoro-2-font/src/${d}/${f}`).find(existsSync);

const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const pos = process.argv.slice(2).filter((a, i, v) => !a.startsWith('--') && !(['--porta', '--misura', '--sel'].includes(v[i - 1])));
const [sito, uscita, lingua, ...candidati] = pos;
const [w, h] = arg('--misura', '1440x900').split('x').map(Number);
const zero = process.argv.includes('--spaziatura-zero');
mkdirSync(uscita, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8803), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium');
const foto = [];
for (const c of ['sistema=', ...candidati]) {
  const [nome, spec] = c.split('=');
  const [file, prima] = (spec || '').split(':');
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce', deviceScaleFactor: 1});
  const p = await ctx.newPage();
  if (file) {
    const vero = trova(file); if (!vero) throw new Error('non trovo ' + file);
    await p.route('**/prova-font/candidato.ttf', r => r.fulfill({path: vero, contentType: 'font/ttf'}));
  }
  await p.goto(`${base}${lingua}/`, {waitUntil: 'load'});
  const css = (file ? `@font-face{font-family:"Candidato";src:url(/prova-font/candidato.ttf);font-weight:100 900}
    :root{--font-testo:${prima ? '"Candidato","Lexend"' : '"Lexend","Candidato"'},sans-serif}` : '')
    + (zero ? '.apertura h1,.tratto h2,.chiusura h2,.bolla-testo,.marchio{letter-spacing:0!important}' : '');
  if (css) await p.addStyleTag({content: css});
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
  const f = join(uscita, `${lingua}-${w}-${nome}.png`);
  await p.screenshot({path: f}); foto.push(`${nome}=${f}`);
  await ctx.close();
}
await b.close(); server.close();
execFileSync('python3', [new URL('./foglio.py', import.meta.url).pathname, join(uscita, `foglio-${lingua}-${w}.png`), String(w > 900 ? 720 : 390), w > 900 ? '2' : '4', ...foto]);
console.log(join(uscita, `foglio-${lingua}-${w}.png`));
