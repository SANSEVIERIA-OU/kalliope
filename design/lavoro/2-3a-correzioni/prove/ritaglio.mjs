// Una foto del pezzo (con la sua aria) e le misure di ciò che sta dentro, in un motore, a una misura, in una lingua.
// Uso: node ritaglio.mjs <cartella-sito> <percorso> <WxH> <selettore da fotografare> <uscita.png> [--suona] [--misura=<sel1>,<sel2>…] [--motore=chromium] [--aria=24] [--da=<selettore da portare in vista>]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, percorso, misura, sel, uscita, ...opz] = process.argv.slice(2);
const val = n => opz.find(o => o.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const motore = val('motore') || 'chromium', aria = +(val('aria') || 24), misurare = (val('misura') || '').split(',').filter(Boolean);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(800); await assesta(p);
await p.evaluate(s => document.querySelector(s).scrollIntoView({block: 'center'}), val('da') || sel);
await p.waitForTimeout(2200); await assesta(p);
if (opz.includes('--suona')) { await p.click('.ascolta-ferma'); await p.waitForTimeout(1900); await assesta(p); }
const r = await p.evaluate(({sel, misurare}) => {
  const rc = e => { const q = e.getBoundingClientRect(); return [Math.round(q.left * 10) / 10, Math.round(q.top * 10) / 10, Math.round(q.right * 10) / 10, Math.round(q.bottom * 10) / 10]; };
  const out = {contenitore: rc(document.querySelector(sel)), ih: innerHeight};
  for (const s of misurare) out[s] = [...document.querySelectorAll(s)].map(rc);
  return out;
}, {sel, misurare});
const c = r.contenitore;
const clip = {x: Math.max(0, c[0] - aria), y: Math.max(0, c[1] - aria), width: Math.min(W, c[2] + aria) - Math.max(0, c[0] - aria), height: Math.min(H, c[3] + aria) - Math.max(0, c[1] - aria)};
await p.screenshot({path: uscita, clip});
console.log(JSON.stringify({percorso, misura, ...r, errori}));
await b.close(); server.close();
