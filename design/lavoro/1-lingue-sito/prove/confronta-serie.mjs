// Confronta due serie di foto della stessa pagina, ciascuna fatta più volte: per ogni schermata il numero di pixel diversi è il minimo
// fra tutte le coppie (una foto della serie A, una della B). Il rumore di una pagina (un'animazione a metà, una sezione che si rivela
// un momento prima) cade su una foto e non su un'altra: se almeno una coppia è identica, la schermata è la stessa.
// Si scrive anche quanto la serie A differisce da sé stessa (il rumore di base). Uso: node confronta-serie.mjs <uscita.json> <A1,A2,…> <B1,B2,…>
import {readdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const [uscita, As, Bs] = process.argv.slice(2);
const A = As.split(','), B = Bs.split(',');
const nomi = readdirSync(A[0]).filter(f => f.endsWith('.png')).sort();
const browser = await avvia('chromium');
const p = await browser.newPage();
const righe = [];
for (const n of nomi) {
  const dirs = [...A, ...B];
  if (!dirs.every(d => existsSync(join(d, n)))) { righe.push({n, manca: dirs.filter(d => !existsSync(join(d, n)))}); continue; }
  const dati = dirs.map(d => readFileSync(join(d, n)).toString('base64'));
  const r = await p.evaluate(async ({dati, na}) => {
    const carica = s => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'data:image/png;base64,' + s; });
    const ims = await Promise.all(dati.map(carica));
    const px = ims.map(i => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data; });
    if (ims.some(i => i.width !== ims[0].width || i.height !== ims[0].height)) return {misure: ims.map(i => [i.width, i.height])};
    const diff = (a, b) => { let n = 0, max = 0; for (let k = 0; k < a.length; k += 4) { const d = Math.max(Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2])); if (d) { n++; if (d > max) max = d; } } return [n, max]; };
    let min = [Infinity, 0], rumoreA = [0, 0];
    for (let i = 0; i < na; i++) for (let j = na; j < px.length; j++) { const d = diff(px[i], px[j]); if (d[0] < min[0]) min = d; }
    for (let i = 0; i < na; i++) for (let j = i + 1; j < na; j++) { const d = diff(px[i], px[j]); if (d[0] > rumoreA[0]) rumoreA = d; }
    return {minimo: min[0], scarto: min[1], rumoreSerieA: rumoreA[0]};
  }, {dati, na: A.length});
  righe.push({n, ...r});
}
await browser.close();
const diverse = righe.filter(r => r.manca || r.misure || r.minimo > 0);
writeFileSync(uscita, JSON.stringify({serieA: A, serieB: B, schermate: righe.length, diverse: diverse.length, righe}, null, 1));
console.log(`${righe.length} schermate, ${righe.length - diverse.length} identiche (almeno una coppia a 0 pixel), ${diverse.length} con differenze`);
for (const r of diverse) console.log(' ', JSON.stringify(r));
const rumorose = righe.filter(r => r.rumoreSerieA > 0).length;
console.log(`rumore: ${rumorose} schermate su ${righe.length} non sono uguali nemmeno fra le foto della serie A`);
process.exit(diverse.length ? 1 : 0);
