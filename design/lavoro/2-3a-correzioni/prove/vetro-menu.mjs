// Punto 2 · il pannello del menu aperto (telefono) lascia leggere la pagina dietro? Si fotografa il pannello con la pagina dietro e di nuovo con la pagina dietro nascosta
// (stesso scorrimento, stessa misura): ciò che cambia fra le due foto dentro il pannello, fuori dalle voci, è ciò che passa attraverso («trasparenza»: la differenza massima
// e media per canale, su 255). In più il colore calcolato del pannello e se il motore dice di conoscere backdrop-filter.
// Uso: node vetro-menu.mjs <cartella-sito> <motore> <percorso[,percorso…]> [WxH] [--foto=cartella] [--soglia=<bordo netto massimo ammesso, 0-255>]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, motore, percorsi, misura = '390x844', ...opz] = process.argv.slice(2);
const val = n => opz.find(o => o.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const [W, H] = misura.split('x').map(Number), fotoDir = val('foto'), soglia = val('soglia') ? +val('soglia') : null;
const apri = val('apri') || '.pulsante-menu', pannello = val('pannello') || '#menu';   // il comando che apre e il pannello: il menu del telefono, o --apri='details.lingua-scelta > summary' --pannello='.lingue-elenco' per l'elenco delle lingue sul computer
if (fotoDir) mkdirSync(fotoDir, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA_2F || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let male = 0;
for (const perc of percorsi.split(',')) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760), deviceScaleFactor: 1}); const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(base + perc, {waitUntil: 'load'}); await p.waitForTimeout(3500); await assesta(p);
  await p.evaluate(a => document.querySelector(a).click(), apri); await p.waitForTimeout(900); await assesta(p);
  const info = await p.evaluate(sel => { const m = document.querySelector(sel), cs = getComputedStyle(m), r = m.getBoundingClientRect(); return {sfondo: cs.backgroundColor, filtro: cs.backdropFilter || cs.webkitBackdropFilter, conosce: CSS.supports('backdrop-filter', 'blur(18px)'), r: [r.left, r.top, r.right, r.bottom].map(Math.round), voci: [...m.querySelectorAll('a, summary')].map(a => { const g = document.createRange(); g.selectNodeContents(a); const q = g.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); }), scorre: m.scrollHeight > m.clientHeight + 1}; }, pannello);
  const con = await p.screenshot();
  await p.addStyleTag({content: 'main, .scena, .mondo > *:not(.barra):not(.luce), footer { visibility: hidden !important; } .mondo { background: #1b0008 !important; }'});
  await p.waitForTimeout(400); const senza = await p.screenshot();
  const r = await p.evaluate(async ([a, c, info]) => {
    const carica = async x => { const im = new Image(); im.src = 'data:image/png;base64,' + x; await im.decode(); const k = document.createElement('canvas'); k.width = im.width; k.height = im.height; const g = k.getContext('2d', {willReadFrequently: true}); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height); };
    const A = await carica(a), B = await carica(c); let max = 0, somma = 0, n = 0, bordo = 0;
    // «bordo»: quanto cambia, da un pixel al secondo accanto, la differenza fra le due foto. Una sfocatura lascia una macchia dolce (bordo basso, anche se la differenza media è alta);
    // un testo che passa nitido lascia bordi netti (bordo alto): è ciò che si legge. Il pannello vuoto, uguale in tutti i punti, dà 0.
    const diff = (x, y, k) => { const i = (y * A.width + x) * 4 + k; return A.data[i] - B.data[i]; };
    const [l, t, rr, bb] = info.r, escluso = (x, y) => info.voci.some(v => x >= v[0] - 4 && x <= v[2] + 4 && y >= v[1] - 4 && y <= v[3] + 4);
    for (let y = t + 6; y < Math.min(bb - 6, A.height); y++) for (let x = l + 6; x < Math.min(rr - 6, A.width); x++) {
      if (escluso(x, y)) continue; const i = (y * A.width + x) * 4;
      const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2])); max = Math.max(max, d); somma += d; n++;
      if (x + 2 < rr - 6 && y + 2 < bb - 6 && !escluso(x + 2, y + 2)) for (let k = 0; k < 3; k++) bordo = Math.max(bordo, Math.abs(diff(x, y, k) - diff(x + 2, y, k)), Math.abs(diff(x, y, k) - diff(x, y + 2, k)));
    }
    const k = document.createElement('canvas'); k.width = A.width; k.height = A.height; const g = k.getContext('2d'); const O = g.createImageData(A.width, A.height);
    for (let i = 0; i < A.data.length; i += 4) { for (let q = 0; q < 3; q++) O.data[i + q] = Math.min(255, Math.abs(A.data[i + q] - B.data[i + q]) * 12); O.data[i + 3] = 255; } g.putImageData(O, 0, 0);
    return {max, media: Math.round(100 * somma / n) / 100, n, bordo, diff: k.toDataURL('image/png')};
  }, [con.toString('base64'), senza.toString('base64'), info]);
  if (fotoDir) { const nome = perc.replace(/\//g, '_'); await ctx.close(); const c2 = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760), deviceScaleFactor: 1}); const q = pagina(await c2.newPage(), []); await q.goto(base + perc, {waitUntil: 'load'}); await q.waitForTimeout(3500); await assesta(q); await q.evaluate(a => document.querySelector(a).click(), apri); await q.waitForTimeout(900); await assesta(q); await q.screenshot({path: `${fotoDir}/vetro-${motore}-${nome}.png`}); await c2.close(); } else await ctx.close();
  if (fotoDir) { const {writeFileSync} = await import('node:fs'); writeFileSync(`${fotoDir}/vetro-${motore}-${perc.replace(/\//g, '_')}-diff.png`, Buffer.from(r.diff.split(',')[1], 'base64')); }
  const ok = soglia === null || r.bordo <= soglia; if (!ok) male++;
  console.log(`${soglia === null ? '    ' : ok ? 'ok  ' : 'NO  '}${motore} ${perc} ${misura}: la pagina dietro: differenza massima ${r.max}/255, media ${r.media}, bordo netto massimo ${r.bordo}/255 (su ${r.n} pixel fuori dalle voci) · pannello ${info.sfondo} · backdrop-filter ${info.conosce ? 'conosciuto' : 'NON conosciuto'} («${info.filtro}») · errori ${errori.length}`);
}
await b.close(); server.close(); process.exit(male ? 1 : 0);
