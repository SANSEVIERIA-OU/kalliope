// «stato» con cornice.js che non arriva (rete, filtro): dopo la rete di sicurezza (4 s) la pagina si legge come senza JavaScript. Foto di quattro schermate. Uso: node foto-senza-cornice.mjs <cartella-sito> <uscita> <porta> <WxH>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, uscita, porta, misura] = process.argv.slice(2); const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch(); const ctx = await b.newContext({viewport: {width: W, height: H}, ...(W <= 760 ? {hasTouch: true, isMobile: true} : {})});
await ctx.route(/\/cornice\.js(\?.*)?$/, r => r.abort());
const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:${porta}/it/stato/`, {waitUntil: 'load'}); await p.waitForTimeout(5500);
for (const [n, sel] of [['1-primo', null], ['2-catena', '#provato-titolo'], ['3-domande', '#per-chi-titolo'], ['4-inoltra', '#inoltra-titolo']]) {
  if (sel) await p.evaluate(s => document.querySelector(s).scrollIntoView({block: 'start', behavior: 'instant'}), sel);
  await p.waitForTimeout(500); await p.screenshot({path: `${uscita}/senza-cornice-${misura}-${n}.png`});
}
await b.close(); server.close();
