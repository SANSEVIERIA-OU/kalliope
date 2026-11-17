// La pagina schermata per schermata (scorrendo, con il movimento vero: ciò che vede una persona), in un motore, a una misura.
// Uso: PLAYWRIGHT=… node schermate.mjs <cartella-sito> <uscita> <percorso> <motore> <WxH> [--ridotto]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, uscita, percorso, motore, misura, ...opz] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: opz.includes('--ridotto') ? 'reduce' : 'no-preference', ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(4800); await assesta(p);
const alto = await p.evaluate(() => document.documentElement.scrollHeight);
const nome = percorso.split('/')[0] || 'pagina';
let k = 0;
for (let y = 0; ; y += Math.round(H * 0.85)) {
  await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(k ? 1500 : 200); await assesta(p);
  await p.screenshot({path: `${uscita}/${nome}-${motore}-${misura}-s${String(++k).padStart(2, '0')}.png`});
  if (y + H >= alto - 2) break;
}
console.log(`${nome} ${motore} ${misura}: ${k} schermate, altezza ${alto}, ${errori.length ? 'ERRORI: ' + errori.join(' | ') : 'senza errori'}`);
await b.close(); server.close();
