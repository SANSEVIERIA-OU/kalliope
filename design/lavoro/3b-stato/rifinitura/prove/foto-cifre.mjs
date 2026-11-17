// Le foto delle tappe con le cifre (la voce: «0,07 s»; il microfono: «0,26%») in una pagina da destra a sinistra, senza toccare le classi della pagina: si scorre fino alla tappa e si aspetta che sia entrata.
// (cifre.mjs misura e basta: le sue foto, con le classi forzate, uscivano vuote.) Uso: node foto-cifre.mjs <cartella-sito> <porta> <lingue,…> <WxH,…> <cartella-foto>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, porta, lingue, misure, fuori] = process.argv.slice(2); mkdirSync(fuori, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch();
for (const L of lingue.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}});
  const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:${porta}/${L}/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
  for (const quale of ['voce', 'microfono']) {
    const q = p.locator(`.anello[data-anello=${quale}]`); await q.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000);
    await q.screenshot({path: `${fuori}/${quale}-${L}-${m}.png`});
  }
  await ctx.close();
}
await b.close(); server.close();
