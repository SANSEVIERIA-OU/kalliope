// Foto delle fonti collegate (M7): a riposo, al passaggio e al fuoco, sulla scena scura e su quella chiara. Uso: node foto-fonti.mjs <cartella-sito> <uscita> <porta>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, uscita, porta] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
await p.goto(`http://127.0.0.1:${porta}/it/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(1200);
const tappa = async (sel, nome, stato) => {
  await p.evaluate(s => document.querySelector(s).scrollIntoView({block: 'center', behavior: 'instant'}), sel); await p.waitForTimeout(900);
  const a = p.locator(sel + ' a').first();
  if (stato === 'hover') await a.hover(); else if (stato === 'fuoco') await a.focus(); else await p.mouse.move(2, 2);
  await p.waitForTimeout(300);
  const r = await p.locator(sel).first().boundingBox();
  await p.screenshot({path: `${uscita}/fonte-${nome}-${stato}.png`, clip: {x: Math.max(0, r.x - 10), y: Math.max(0, r.y - 10), width: Math.min(1440, r.width + 20), height: Math.min(900, r.height + 20)}});
};
for (const stato of ['riposo', 'hover', 'fuoco']) {
  await tappa('.anello[data-anello=voce] .anello-fatti', 'scura', stato);
  await tappa('.varco-passo[data-passo=scarico] p', 'chiara', stato);
  await tappa('.licenze-blocco:first-child p:first-of-type', 'licenze', stato);
}
await b.close(); server.close();
