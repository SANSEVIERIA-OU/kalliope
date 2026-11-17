// Le cifre con la virgola decimale in una pagina da destra a sinistra (secondo sguardo, N7): «0,07 s», «10,6 MB», «0,26%», «2,3%» si leggono da sinistra a destra? Per ogni lingua e misura si
// cerca ogni cifra nel testo della tappa e si guarda dove sta davvero ogni carattere: la sequenza deve andare da sinistra a destra (x crescente). Uso: node cifre.mjs <cartella-sito> <porta> <lingue,…> <WxH,…> [--foto=<cartella>]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, porta, lingue, misure, ...opz] = process.argv.slice(2);
const foto = opz.find(o => o.startsWith('--foto='))?.split('=')[1]; if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await chromium.launch(); let male = 0;
for (const L of lingue.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...(W <= 760 ? {hasTouch: true, isMobile: true} : {})});
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${porta}/${L}/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(900);
  await p.evaluate(() => document.querySelectorAll('.anello, .tratto, .entra').forEach(x => x.classList.add('visto', 'subito', 'acceso')));
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; })); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode; if (!n.parentElement.getClientRects().length) continue;
      // il testo senza i segni di verso invisibili, con la posizione di ogni carattere nel testo vero
      const mappa = []; let pulito = ''; [...n.textContent].forEach((ch, i) => { if (!/[\u2066-\u2069]/.test(ch)) { mappa.push(i); pulito += ch; } });
      for (const c of ['0,07', '10,6', '0,26', '2,3']) { let i = 0; while ((i = pulito.indexOf(c, i)) >= 0) {
          const xs = []; for (let k = 0; k < c.length; k++) { const r = document.createRange(); r.setStart(n, mappa[i + k]); r.setEnd(n, mappa[i + k] + 1); const q = r.getClientRects()[0]; xs.push(q ? Math.round(q.left * 10) / 10 : null); }
          out.push({cifra: c, contesto: pulito.slice(Math.max(0, i - 8), i + c.length + 6).trim(), da: xs, crescente: xs.every((x, k) => k === 0 || (x !== null && x > xs[k - 1]))}); i += c.length; } } }
    return out;
  });
  const brutte = r.filter(x => !x.crescente);
  if (brutte.length) male++;
  console.log(`${brutte.length ? 'NO  ' : 'ok  '}${L} ${m}: ${r.length} cifre, ${brutte.length ? 'rovesciate: ' + brutte.map(x => `«${x.contesto}» x=${x.da.join(',')}`).join(' | ') : 'tutte da sinistra a destra'}`);
  if (foto) { const q = p.locator('.anello[data-anello=voce]'); await q.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000); await q.screenshot({path: `${foto}/voce-${L}-${m}.png`}); const q2 = p.locator('.anello[data-anello=microfono]'); await q2.scrollIntoViewIfNeeded(); await p.waitForTimeout(3000); await q2.screenshot({path: `${foto}/microfono-${L}-${m}.png`}); }
  await ctx.close();
}
console.log(male ? `\n${male} misure con cifre rovesciate` : '\ntutte le cifre da sinistra a destra'); await b.close(); server.close(); process.exit(male ? 1 : 0);
