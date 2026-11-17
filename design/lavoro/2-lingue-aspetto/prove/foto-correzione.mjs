// Le foto prima e dopo della correzione dopo il giudizio (incarico 2-c): ogni punto nella stessa inquadratura, nelle due costruzioni.
// Uso: node foto-correzione.mjs <sito prima> <sito dopo> <sito prima di «non ancora»> <cartella> [--porta 8803]
// Ogni coppia esce come <cartella>/<nome>-prima.png e -dopo.png; foglio.py le mette fianco a fianco.
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const [prima, dopo, primaNA, out] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const porta = process.argv.includes('--porta') ? +process.argv[process.argv.indexOf('--porta') + 1] : 8803;
const scrolla = async p => { await p.mouse.move(400, 400); await p.mouse.wheel(0, 1300); await p.waitForTimeout(900); };
const colpi = [
  // B1: la barra dopo la rotella, nelle lingue lunghe
  {n: 'B1-de-1024', u: 'de/', w: 1024, h: 800, prima: scrolla, clip: {x: 0, y: 0, width: 1024, height: 76}},
  {n: 'B1-bg-1100', u: 'bg/', w: 1100, h: 800, prima: scrolla, clip: {x: 0, y: 0, width: 1100, height: 76}},
  {n: 'B1-en-XA-1440', u: 'en-XA/', w: 1440, h: 900, prima: scrolla, clip: {x: 0, y: 0, width: 1440, height: 76}},
  // al telefono e sul tablet: la pagina scorsa che si allarga oltre 440 px (la parola del marchio riappare), «Menu» stretto in cima
  {n: 'B1-de-450-da-430', u: 'de/', w: 430, h: 800, prima: async p => { await scrolla(p); await p.setViewportSize({width: 450, height: 800}); await p.waitForTimeout(1200); }, clip: {x: 0, y: 0, width: 450, height: 76}},
  {n: 'B1-en-XA-320', u: 'en-XA/', w: 320, h: 700, prima: scrolla, clip: {x: 0, y: 0, width: 320, height: 76}},
  {n: 'B1-non-ancora-en-XA-1366', u: 'en-XA/non-ancora/', w: 1366, h: 640, na: true, clip: {x: 0, y: 0, width: 1366, height: 76}},
  // I1: la versione da destra a sinistra
  {n: 'I1-ar-1440-stato', u: 'ar/', w: 1440, h: 900, sel: '[data-t="apertura.stato"]'},
  {n: 'I1-ur-390-stato', u: 'ur/', w: 390, h: 844, sel: '[data-t="apertura.stato"]'},
  // I2: l'etichetta di «Tu» al telefono
  {n: 'I2-ar-390-tu', u: 'ar/', w: 390, h: 844, sel: '.palco .riquadro.tu'},
  {n: 'I2-el-390-tu', u: 'el/', w: 390, h: 844, sel: '.palco .riquadro.tu'},
  {n: 'I2-en-XA-390-tu', u: 'en-XA/', w: 390, h: 844, sel: '.palco .riquadro.tu'},
  // M1, M2, M5, M6: titolo e collegamenti
  {n: 'M1-de-390-titolo', u: 'de/', w: 390, h: 844, sel: 'h1'},
  {n: 'M2-el-390-collegamento', u: 'el/', w: 390, h: 844, sel: '#comandi-apertura .collegamento'},
  {n: 'M5-ar-390-collegamento', u: 'ar/', w: 390, h: 844, sel: '#comandi-apertura .collegamento'},
  {n: 'M6-zh-390-titolo', u: 'zh/', w: 390, h: 844, sel: 'h1'},
  // M3: il nome «العربية» nella scelta della pagina urdu
  {n: 'M3-ur-390-scelta', u: 'ur/', w: 390, h: 844, prima: async p => { await p.click('.pulsante-menu'); await p.waitForTimeout(400); await p.click('.lingua-scelta summary'); await p.waitForTimeout(700); }, sel: '.lingua-scelta .lingue-elenco'},
  // M7: l'urdu senza i caratteri scaricati
  {n: 'M7-ur-1440-senza-caratteri', u: 'ur/', w: 1440, h: 900, senzaCaratteri: true, clip: {x: 720, y: 70, width: 700, height: 470}},
  // pillole lunghe in «non ancora» (aggiornamento di chi coordina)
  {n: 'pillole-non-ancora-en-XA-390-comandi', u: 'en-XA/non-ancora/', w: 390, h: 844, na: true, sel: '#comandi-apertura'},
  {n: 'pillole-non-ancora-en-XA-390-copia', u: 'en-XA/non-ancora/', w: 390, h: 844, na: true, sel: '.versioni-piede .pillola'},
];
const sp = await servi(prima, {porta, fresco: true}), sd = await servi(dopo, {porta: porta + 1, fresco: true}), sn = await servi(primaNA, {porta: porta + 2, fresco: true});
const b = await avvia('chromium'); const errori = [];
for (const c of colpi) for (const [quale, base] of [['prima', c.na ? porta + 2 : porta], ['dopo', porta + 1]]) {
  const ctx = await b.newContext({viewport: {width: c.w, height: c.h}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  p.on('pageerror', e => errori.push(`${c.n} ${quale}: ${e.message}`));
  if (c.senzaCaratteri) await p.route(/\.woff2$/, r => r.abort());
  await p.goto(`http://127.0.0.1:${base}/${c.u}`, {waitUntil: 'load'}); if (!c.senzaCaratteri) await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
  try {
    if (c.prima) await c.prima(p);
    const file = join(out, `${c.n}-${quale}.png`);
    if (c.sel) { const e = await p.$(c.sel); await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await e.screenshot({path: file}); }
    else await p.screenshot({path: file, clip: c.clip});
  } catch (e) { errori.push(`${c.n} ${quale}: ${e.message.split('\n')[0]}`); }
  await ctx.close();
}
await b.close(); sp.close(); sd.close(); sn.close();
console.log(`${colpi.length} coppie`); console.log(errori.length ? errori.join('\n') : 'nessun errore');
