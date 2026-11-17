// Le foto «prima e dopo» dei punti: <punto> <cartella-sito> <uscita.png> [lingua]. Una foto per sito (poi affiancate da affianca.py).
//   salto   : 390×844 in Chromium, scorsa a 600: prima di aprire il menu, menu aperto, dopo Esc (con lo scorrimento di ciascun fotogramma nel nome del file)
//   scelta  : la pagina della scelta a 1440×900 (a riposo)
//   copia   : il pannello delle versioni a 1440×900, prima e dopo «Copia» (due foto: <uscita>-1.png, -2.png)
//   cornice : «non ancora» a 1440×900 con website/cornice.js bloccato, dopo 5,5 s (pagina intera)
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [punto, cartella, uscita, lingua = 'it'] = process.argv.slice(2);
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const motore = process.env.MOTORE || 'chromium', b = await avvia(motore);
const sy = p => p.evaluate(() => Math.round(scrollY));
if (punto === 'salto') {
  const ctx = await b.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, ...tocco(motore, true)}); const p = pagina(await ctx.newPage(), []);
  await p.goto(base + `${lingua}/non-ancora/`, {waitUntil: 'load'}); await p.waitForTimeout(1800); await assesta(p);
  await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(700);
  const r = await p.locator('.pulsante-menu').boundingBox(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
  await p.screenshot({path: `${uscita}-1-prima-di-aprire-y${await sy(p)}.png`, scale: 'css'});
  await p.mouse.click(cx, cy); await p.waitForTimeout(700); await p.screenshot({path: `${uscita}-2-menu-aperto-y${await sy(p)}.png`, scale: 'css'});
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); await p.screenshot({path: `${uscita}-3-dopo-Esc-y${await sy(p)}.png`, scale: 'css'});
} else if (punto === 'scelta') {
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1, locale: 'en-GB'}); const p = pagina(await ctx.newPage(), []);
  await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(3800); await assesta(p); await p.screenshot({path: `${uscita}.png`});
} else if (punto === 'copia') {
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1, reducedMotion: 'reduce'}); if (motore === 'chromium') await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const p = pagina(await ctx.newPage(), []);
  await p.goto(base + `${lingua}/non-ancora/`, {waitUntil: 'load'}); await p.waitForTimeout(1500); await assesta(p);
  await p.evaluate(() => document.querySelector('.versioni').scrollIntoView({block: 'center'})); await p.waitForTimeout(2500); await assesta(p);
  const area = async () => { const v = await p.locator('.versioni').boundingBox(); return {x: Math.max(0, v.x - 40), y: Math.max(0, v.y - 40), width: v.width + 80, height: v.height + 80}; };
  const clip = await area(); const v0 = await p.locator('.versioni').boundingBox();
  await p.screenshot({path: `${uscita}-1-a-riposo.png`, clip});
  const r = await p.locator('.copia-indirizzo').boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(900);
  await p.screenshot({path: `${uscita}-2-dopo-Copia.png`, clip});   // stesso ritaglio: se il pannello si muove si vede
  console.log('pannello a riposo', JSON.stringify(v0), 'dopo', JSON.stringify(await p.locator('.versioni').boundingBox()));
} else if (punto === 'cornice') {
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1}); const p = pagina(await ctx.newPage(), []);
  await p.route(/\/cornice\.js(\?.*)?$/, r => r.abort());
  await p.goto(base + `${lingua}/non-ancora/`, {waitUntil: 'load'}); await p.waitForTimeout(5500);
  await p.evaluate(() => document.querySelector('#perche').scrollIntoView({block: 'start'})); await p.waitForTimeout(800);
  await p.screenshot({path: `${uscita}.png`});
}
await b.close(); server.close();
