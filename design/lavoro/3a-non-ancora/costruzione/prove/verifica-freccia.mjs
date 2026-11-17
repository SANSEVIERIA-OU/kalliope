// M7: la freccia del collegamento «Intanto, senti la voce» da destra a sinistra: in ar-XB deve puntare a sinistra (scaleX(-1)), in italiano a destra.
// Uso: PLAYWRIGHT=… node verifica-freccia.mjs <cartella-sito> <uscita>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, uscita] = process.argv.slice(2); mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia('chromium'); let no = 0;
for (const [lingua, atteso] of [['it', 'matrix(1, 0, 0, 1, 0, 0)'], ['ar-XB', 'matrix(-1, 0, 0, 1, 0, 0)']]) {
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  await p.goto(`${base}${lingua}/non-ancora/`, {waitUntil: 'load'}); await p.waitForTimeout(700);
  const t = await p.evaluate(() => getComputedStyle(document.querySelector('#comandi-apertura .freccia')).transform);
  const vero = t === atteso || (atteso.startsWith('matrix(1') && t === 'none');
  console.log(`${vero ? 'ok  ' : 'NO  '} freccia in ${lingua}: transform ${t}`); if (!vero) no++;
  await p.locator('#comandi-apertura').screenshot({path: `${uscita}/freccia-${lingua}.png`});
  await ctx.close();
}
await b.close(); server.close(); process.exit(no ? 1 : 0);
