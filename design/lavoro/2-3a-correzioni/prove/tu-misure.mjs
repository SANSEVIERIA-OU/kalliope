// L2 · l'etichetta del riquadro di «Tu» e le barre della voce non si toccano, in nessuna scrittura e a nessuna misura del computer e del telefono girato.
// Nella chiusura di «non ancora» (.chiusura .tavolo-cornice): per ogni lingua e misura, il rettangolo dell'etichetta (.riquadro.tu .nome) e quelli delle cinque barre
// (.riquadro.tu .barre i); «tocca» se i due rettangoli (con 1 px di margine) si sovrappongono. Mentre suona le barre cambiano altezza: si guarda anche a riposo e con la voce (--suona).
// Uso: node tu-misure.mjs <cartella-sito> <motore> <lingue separate da virgola> <WxH,WxH…> [--suona] [--poco=<px>] [--json=file]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {writeFileSync} from 'node:fs';
const [cartella, motore, lingue, misure, ...opz] = process.argv.slice(2);
const poco = +(opz.find(o => o.startsWith('--poco='))?.split('=')[1] ?? 1), json = opz.find(o => o.startsWith('--json='))?.split('=')[1];
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const righe = []; let tocca = 0;
for (const l of lingue.split(',')) {
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, ...tocco(motore, false)}); const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(`${base}${l}/non-ancora/`, {waitUntil: 'load'}); await p.waitForTimeout(500); await assesta(p);
  for (const m of misure.split(',')) {
    const [W, H] = m.split('x').map(Number);
    await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(250);
    await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView({block: 'center'})); await p.waitForTimeout(1500); await assesta(p);
    if (opz.includes('--suona')) { await p.evaluate(() => document.querySelector('.ascolta-ferma').click()); await p.waitForTimeout(1500); }
    const r = await p.evaluate(poco => {
      const rc = e => { const q = e.getBoundingClientRect(); return {l: q.left, t: q.top, r: q.right, b: q.bottom}; };
      const nome = document.querySelector('.chiusura .riquadro.tu .nome'), barre = [...document.querySelectorAll('.chiusura .riquadro.tu .barre i')], tile = document.querySelector('.chiusura .riquadro.tu');
      if (!nome || !barre.length) return null;
      const n = rc(nome), bs = barre.map(rc), t = rc(tile);
      // distanza minima fra l'etichetta e una barra (negativa: si sovrappongono)
      const dist = bs.map(q => Math.max(q.l - n.r, n.l - q.r, q.t - n.b, n.t - q.b));
      return {tocca: Math.min(...dist) < poco, distanza: Math.round(Math.min(...dist) * 10) / 10, riquadro: [Math.round(t.r - t.l), Math.round(t.b - t.t)], etichetta: [Math.round(n.r - n.l), Math.round(n.b - n.t)], barre: [Math.round(bs[0].r - bs[0].l), Math.round(bs[2].b - bs[2].t)]};
    }, poco);
    const riga = {lingua: l, misura: m, ...(r || {mancante: true})}; righe.push(riga); if (r?.tocca) tocca++;
  }
  if (errori.length) console.log(`ERRORI ${l}: ${errori.slice(0, 2).join(' | ')}`);
  await ctx.close();
}
await b.close(); server.close();
if (json) writeFileSync(json, JSON.stringify(righe, null, 1));
const stato = opz.includes('--suona') ? 'con la voce' : 'a riposo';
const per = {}; for (const r of righe) if (r.tocca) (per[r.lingua] ||= []).push(`${r.misura}(${r.distanza})`);
for (const [l, v] of Object.entries(per)) console.log(`  ${l}: tocca a ${v.length} misure: ${v.slice(0, 14).join(' ')}${v.length > 14 ? ' …' : ''}`);
console.log(`${tocca ? 'NO  ' : 'ok  '}${motore} ${stato}: ${righe.length} casi, ${tocca} in cui l'etichetta tocca le barre (margine ${poco} px)`);
process.exit(tocca ? 1 : 0);
