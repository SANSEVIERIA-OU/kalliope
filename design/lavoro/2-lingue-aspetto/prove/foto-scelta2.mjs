// La pagina della scelta della lingua (dopo il giudizio): 1440×900, 1366×640, 390×844, 844×390, con e senza JavaScript, «riduci movimento».
// Uso: node foto-scelta2.mjs <sito costruito> <uscita> [--porta 8806] [--lingua-browser it-IT]
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [sito, uscita] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8806), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium');
for (const [w, h] of [[1440, 900], [1366, 640], [390, 844], [844, 390]]) for (const js of [true, false]) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce', locale: arg('--lingua-browser', 'it-IT'), javaScriptEnabled: js});
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
  await p.goto(base + '?lingue', {waitUntil: 'load'}); if (js) await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
  const nome = `scelta-${w}x${h}${js ? '' : '-senza-js'}`;
  await p.screenshot({path: join(uscita, nome + '.png')});
  const m = await p.evaluate(() => { const r = e => e && e.getBoundingClientRect(); const b = r(document.querySelector('.bolla-lingue')), t = r(document.querySelector('.tavolo-cornice')), h = r(document.querySelector('.scelta-titolo')); return {titolo: h && [Math.round(h.top), Math.round(h.bottom)], bolla: b && [Math.round(b.top), Math.round(b.bottom)], fila: t && [Math.round(t.top), Math.round(t.bottom)], scorre: document.documentElement.scrollWidth > innerWidth}; });
  console.log(nome, JSON.stringify(m), err.length ? 'ERRORI ' + err.join(' | ') : 'ok');
  await ctx.close();
}
await b.close(); server.close();
