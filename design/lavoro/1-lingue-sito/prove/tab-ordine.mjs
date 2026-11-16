// L'ordine di Tab della home, a due ritmi (una persona: 250 ms fra un Tab e l'altro; in fretta: nessuna pausa).
// Uso: node tab-ordine.mjs <cartella del sito> <percorso della pagina> <uscita.json> [--larghezza 1440]
import {writeFileSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const [cartella, percorso, uscita] = process.argv.slice(2);
const larg = +(process.argv[process.argv.indexOf('--larghezza') + 1] || 1440);
const server = await servi(cartella, {porta: 0, fresco: true});
const browser = await avvia('chromium');
const giro = async (pausa) => {
  const ctx = await browser.newContext({viewport: {width: larg, height: larg < 600 ? 844 : 900}, reducedMotion: 'reduce'});
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${server.address().port}/${percorso}`, {waitUntil: 'load'});
  await p.waitForTimeout(1500);
  const seq = [];
  for (let i = 0; i < 90; i++) {
    await p.keyboard.press('Tab');
    if (pausa) await p.waitForTimeout(pausa);
    const d = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return 'body'; return `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''} «${(e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28)}»`; });
    seq.push(d);
    if (seq.length > 3 && seq[seq.length - 1] === seq[0] && i > 5) break;
  }
  await ctx.close();
  return seq;
};
const lento = await giro(250), veloce = await giro(0);
writeFileSync(uscita, JSON.stringify({lento, veloce}, null, 1));
console.log(`${lento.length} soste (lento), ${veloce.length} (veloce); uguali fra i due ritmi: ${JSON.stringify(lento) === JSON.stringify(veloce)}`);
await browser.close(); server.close();
