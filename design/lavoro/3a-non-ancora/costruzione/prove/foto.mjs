// Foto di una pagina a una o più misure, in un motore. Il sito si serve da sé.
// Uso: PLAYWRIGHT=… node foto.mjs <cartella-sito> <uscita> <percorso> <motore> <WxH[,WxH…]> [--ridotto] [--senzajs] [--tutta] [--attendi=ms]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, uscita, percorso, motore, misure, ...opz] = process.argv.slice(2);
const ridotto = opz.includes('--ridotto'), senzajs = opz.includes('--senzajs'), tutta = opz.includes('--tutta');
const attendi = +(opz.find(o => o.startsWith('--attendi='))?.split('=')[1] || 3500);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: 0, fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number), tel = w <= 760;
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: !senzajs, ...tocco(motore, tel)});
  const errori = [];
  const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + percorso, {waitUntil: 'load'});
  await p.waitForTimeout(attendi); await assesta(p);
  const nome = `${uscita}/${percorso.replace(/[\/.]/g, '_')}-${motore}-${m}${ridotto ? '-ridotto' : ''}${senzajs ? '-senzajs' : ''}.png`;
  await p.screenshot({path: nome, fullPage: tutta});
  console.log(nome, errori.length ? `ERRORI: ${errori.join(' | ')}` : 'senza errori');
  await ctx.close();
}
await b.close(); server.close();
