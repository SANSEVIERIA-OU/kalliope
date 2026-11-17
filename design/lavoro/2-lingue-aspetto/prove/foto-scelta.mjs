// La pagina della scelta della lingua e la scelta nella barra, fotografate.
// Uso: node foto-scelta.mjs <sito costruito> <uscita> [--porta 8806] [--lingua-browser it-IT] [--movimento]
// Foto: scelta a 1440×900, 1366×640 e 390×844 (lingua del browser data con --lingua-browser); la home in it/ e ar/ con la scelta della barra
// aperta (1440), il menu del telefono aperto con la scelta aperta (390), lo stesso scorrendo (barra compatta).
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
const movimento = process.argv.includes('--movimento');
const foto = async (nome, w, h, url, azione, locale = arg('--lingua-browser', 'it-IT')) => {
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: movimento ? 'no-preference' : 'reduce', locale});
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
  p.on('requestfailed', r => { if (!/voce\//.test(r.url())) err.push('requestfailed ' + r.url()); });
  await p.goto(base + url, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(movimento ? 2600 : 1200);
  if (azione) { await azione(p); await p.waitForTimeout(700); }
  await p.screenshot({path: join(uscita, nome + '.png')});
  console.log(nome, err.length ? 'ERRORI ' + err.join(' | ') : 'ok');
  await ctx.close();
};
await foto('scelta-1440x900', 1440, 900, '?lingue');
await foto('scelta-1366x640', 1366, 640, '?lingue');
await foto('scelta-390x844', 390, 844, '?lingue');
await foto('scelta-390x844-ar', 390, 844, '?lingue', null, 'ar-EG');
await foto('it-1440-barra-aperta', 1440, 900, 'it/', p => p.click('.lingua-scelta summary'));
await foto('it-1440-barra-aperta-scorsa', 1440, 900, 'it/', async p => { await p.evaluate(() => scrollTo(0, 1200)); await p.waitForTimeout(600); await p.click('.lingua-scelta summary'); });
await foto('ar-1440-barra-aperta', 1440, 900, 'ar/', p => p.click('.lingua-scelta summary'));
await foto('it-390-menu-lingue', 390, 844, 'it/', async p => { await p.click('.pulsante-menu'); await p.waitForTimeout(400); await p.click('.lingua-scelta summary'); });
await foto('ur-390-menu-lingue', 390, 844, 'ur/', async p => { await p.click('.pulsante-menu'); await p.waitForTimeout(400); await p.click('.lingua-scelta summary'); });
await foto('it-390-menu-scorso', 390, 844, 'it/', async p => { await p.evaluate(() => scrollTo(0, 1400)); await p.waitForTimeout(600); await p.click('.pulsante-menu'); });
await b.close(); server.close();
