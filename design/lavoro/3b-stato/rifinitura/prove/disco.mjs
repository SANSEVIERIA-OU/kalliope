// Il computer del tratto chiaro (varco): ogni etichetta sta dentro il suo riquadro? Per ogni lingua e misura: di quanti px «la voce · 53 MB», «il programma», «settings.conf» escono dal
// riquadro «Sul disco» (il suo bordo interno), e le altre etichette dal loro (la finestra, il microfono, «Il tuo computer»). Positivo = esce.
// Uso: node disco.mjs <cartella-sito> <porta> <lingue,…> <WxH,…> [--foto=<cartella>]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {mkdirSync} from 'node:fs';
import {avvia} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
const [cartella, porta, lingue, misure, ...opz] = process.argv.slice(2);
const motore = opz.find(o => o.startsWith('--motore='))?.split('=')[1] || 'chromium';
const foto = opz.find(o => o.startsWith('--foto='))?.split('=')[1];
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await avvia(motore);
let male = 0; const righe = [];
for (const L of lingue.split(',')) for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...(W <= 760 && motore === 'chromium' ? {hasTouch: true, isMobile: true} : {})});
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${porta}/${L}/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(900);
  await p.evaluate(() => document.querySelector('.varco').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2500);   // il computer entra quando arriva: si aspetta che sia entrato
  await p.evaluate(() => document.querySelectorAll('.varco.entra').forEach(x => x.classList.add('visto', 'subito'))); await p.waitForTimeout(500);   // il computer è entrato (come quando lo si guarda): la foto lo mostra
  const r = await p.evaluate(() => {
    const rtl = getComputedStyle(document.documentElement).direction === 'rtl';
    const dentro = (e, c) => { const a = e.getBoundingClientRect(), z = c.getBoundingClientRect(), cs = getComputedStyle(c);
      const l = z.left + parseFloat(cs.borderLeftWidth), r = z.right - parseFloat(cs.borderRightWidth);
      return Math.round(Math.max(l - a.left, a.right - r, 0) * 10) / 10; };
    const v = document.querySelector('.varco'), disco = v.querySelector('.varco-disco'), fin = v.querySelector('.varco-finestra'), bordo = v.querySelector('.varco-bordo');
    const out = {};
    [...disco.querySelectorAll('.varco-file')].forEach((e, i) => { out[`file${i + 1}`] = [e.textContent.trim().slice(0, 18), dentro(e, disco), Math.round(e.getBoundingClientRect().height)]; });
    out.etichettaDisco = ['Sul disco', dentro(disco.querySelector('.varco-etichetta'), disco)];
    out.campo = ['campo', dentro(fin.querySelector('.varco-campo'), fin)]; out.gia = ['già', dentro(fin.querySelector('.varco-gia'), fin)]; out.memoria = ['memoria', dentro(fin.querySelector('.varco-memoria'), fin)];
    out.mic = ['microfono', dentro(v.querySelector('.varco-mic'), bordo)]; out.nome = ['nome', dentro(v.querySelector('.varco-nome'), bordo)];
    out.fuori = ['fuori', dentro(v.querySelector('.varco-fuori'), v)];
    out.riquadri = {disco: Math.round(disco.getBoundingClientRect().width), finestra: Math.round(fin.getBoundingClientRect().width), bordo: Math.round(bordo.getBoundingClientRect().width)};
    out.scorre = document.documentElement.scrollWidth > innerWidth;
    return out;
  });
  const esce = Object.entries(r).filter(([k, v]) => Array.isArray(v) && v[1] > 0.5).map(([k, v]) => `${v[0]} ${v[1]}px`);
  if (esce.length) male++;
  righe.push(`${esce.length ? 'ESCE' : 'ok  '} ${motore} ${L} ${m}: ${esce.length ? esce.join(', ') : 'tutto dentro'} · riquadri ${JSON.stringify(r.riquadri)} · file ${['file1', 'file2', 'file3'].map(k => r[k] ? r[k][2] : '-').join('/')} px di altezza${r.scorre ? ' · SCORRE DI LATO' : ''}`);
  if (foto) { const r = await p.locator('.varco-disco').boundingBox(); const x0 = Math.max(0, r.x - 16), y0 = Math.max(0, r.y - 16); await p.screenshot({path: `${foto}/disco-${L}-${m}.png`, clip: {x: x0, y: y0, width: Math.min(W - x0, r.width + 32), height: Math.min(H - y0, r.height + 32)}}); }   // la foto del riquadro «Sul disco» nello schermo (non l'elemento: appiccicoso al telefono)
  await ctx.close();
}
console.log(righe.join('\n')); console.log(`\n${righe.length - male}/${righe.length} senza etichette fuori dal riquadro`);
await b.close(); server.close(); process.exit(male ? 1 : 0);
