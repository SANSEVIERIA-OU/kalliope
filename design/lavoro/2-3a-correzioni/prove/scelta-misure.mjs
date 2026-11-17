// L3 · la pagina della scelta: il colore del nome «Kalliope» (a riposo e subito dopo l'arrivo) e il fondo della barra (in cima e scorrendo), a più misure.
// Uso: node scelta-misure.mjs <cartella-sito> <motore> <WxH[,WxH…]> [uscita-cartella]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, motore, misure, uscita] = process.argv.slice(2);
if (uscita) mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, locale: 'en-GB', ...tocco(motore, W <= 760)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + '?lingue', {waitUntil: 'load'});
  const leggi = () => p.evaluate(() => {
    const h = document.querySelector('.scelta-titolo'), bar = document.querySelector('.barra'), cs = getComputedStyle(bar), hs = getComputedStyle(h);
    return {titolo: hs.color, titoloOp: hs.opacity, barraFondo: cs.backgroundColor, barraOmbra: cs.boxShadow.slice(0, 40), barraClip: cs.clipPath, barraClasse: bar.className, y: Math.round(scrollY), scorre: document.documentElement.scrollHeight - innerHeight};
  });
  const t = [];
  for (const ms of [0, 400, 800, 1600, 3200]) { await p.waitForTimeout(ms === 0 ? 50 : ms - (t.at(-1)?.ms ?? 0)); t.push({ms, ...(await leggi())}); }
  await assesta(p);
  const fine = await leggi();
  if (uscita) await p.screenshot({path: `${uscita}/scelta-${m}-riposo.png`});
  let scorso = null;
  if (fine.scorre > 0) { await p.evaluate(() => scrollTo(0, 120)); await p.waitForTimeout(700); scorso = await leggi(); if (uscita) await p.screenshot({path: `${uscita}/scelta-${m}-scorso.png`}); }
  console.log(`${m}: titolo ${t.map(x => `${x.ms}ms ${x.titolo}`).join(' · ')}\n   riposo: barra ${fine.barraFondo} ombra ${fine.barraOmbra} clip ${fine.barraClip} [${fine.barraClasse}] scorre ${fine.scorre}px\n   scorso: ${scorso ? `barra ${scorso.barraFondo} ombra ${scorso.barraOmbra} [${scorso.barraClasse}] y=${scorso.y}` : 'la pagina non scorre'}  errori ${errori.length}`);
  await ctx.close();
}
await b.close(); server.close();
