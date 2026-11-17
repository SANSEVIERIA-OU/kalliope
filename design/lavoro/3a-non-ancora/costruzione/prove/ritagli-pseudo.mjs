// Ritagli delle rotture della pseudo-lingua en-XA (testo +40%): la pillola del comando che esce dal suo fondo al telefono, la barra che spezza le voci a 1366 px.
// Uso: PLAYWRIGHT=… node ritagli-pseudo.mjs <cartella-sito> <uscita>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, uscita] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/en-XA/non-ancora/`;
const b = await avvia('chromium');
{
  const ctx = await b.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce', ...tocco('chromium', true)}); const p = await ctx.newPage();
  await p.goto(base, {waitUntil: 'load'}); await p.waitForTimeout(800); await assesta(p);
  const misure = await p.evaluate(() => [...document.querySelectorAll('.pillola')].filter(x => x.getClientRects().length).map(x => ({t: x.textContent.trim().slice(0, 30), box: Math.round(x.getBoundingClientRect().width), testo: x.scrollWidth, esce: x.scrollWidth > x.clientWidth})));
  console.log('pillole a 390 in en-XA:', JSON.stringify(misure));
  await p.locator('#comandi-apertura').screenshot({path: `${uscita}/en-XA-390-comandi-apertura.png`});
  await p.evaluate(() => document.querySelector('.copia-indirizzo').scrollIntoView({block: 'center'})); await p.waitForTimeout(600);
  await p.locator('.versioni').screenshot({path: `${uscita}/en-XA-390-versioni-copia.png`});
  await ctx.close();
}
{
  const ctx = await b.newContext({viewport: {width: 1366, height: 640}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  await p.goto(base, {waitUntil: 'load'}); await p.waitForTimeout(800); await assesta(p);
  await p.screenshot({path: `${uscita}/en-XA-1366x640-barra.png`, clip: {x: 0, y: 0, width: 1366, height: 120}});
  await ctx.close();
}
await b.close(); server.close();
