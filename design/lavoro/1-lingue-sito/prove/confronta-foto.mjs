// Confronta due cartelle di foto, punto per punto, nel browser (canvas). Uso: node confronta-foto.mjs <A> <B> <uscita> [--motore chromium]
// Per ogni nome presente in tutte e due: pixel diversi, scarto massimo, e una foto delle differenze (in rosso).
import {readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const [A, B, uscita] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const nomi = readdirSync(A).filter(f => f.endsWith('.png')).sort();
const browser = await avvia('chromium');
const p = await browser.newPage();
await p.setContent('<canvas id=c></canvas>');
const righe = [];
for (const n of nomi) {
  if (!existsSync(join(B, n))) { righe.push({n, mancaIn: B}); continue; }
  const a = readFileSync(join(A, n)).toString('base64'), b = readFileSync(join(B, n)).toString('base64');
  const r = await p.evaluate(async ([a, b]) => {
    const carica = s => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'data:image/png;base64,' + s; });
    const [ia, ib] = await Promise.all([carica(a), carica(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return {misure: [ia.width, ia.height, ib.width, ib.height]};
    const dati = i => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height); };
    const da = dati(ia), db = dati(ib), out = new ImageData(ia.width, ia.height);
    let n = 0, max = 0;
    for (let k = 0; k < da.data.length; k += 4) {
      const d = Math.max(Math.abs(da.data[k] - db.data[k]), Math.abs(da.data[k + 1] - db.data[k + 1]), Math.abs(da.data[k + 2] - db.data[k + 2]));
      if (d > 0) { n++; max = Math.max(max, d); out.data.set([255, 0, 0, 255], k); } else out.data.set([da.data[k] >> 2, da.data[k + 1] >> 2, da.data[k + 2] >> 2, 255], k);
    }
    let png = null;
    if (n) { const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; c.getContext('2d').putImageData(out, 0, 0); png = c.toDataURL('image/png').split(',')[1]; }
    return {n, max, png};
  }, [a, b]);
  if (r.png) writeFileSync(join(uscita, 'diff-' + n), Buffer.from(r.png, 'base64'));
  righe.push({n, ...(r.misure ? {misure: r.misure} : {diversi: r.n, scarto: r.max})});
}
const soloB = readdirSync(B).filter(f => f.endsWith('.png') && !nomi.includes(f));
await browser.close();
const diversi = righe.filter(r => r.diversi || r.misure || r.mancaIn);
writeFileSync(join(uscita, 'esito.json'), JSON.stringify({confrontate: righe.length, conDifferenze: diversi.length, soloInB: soloB, righe}, null, 1));
console.log(`confrontate ${righe.length}, con differenze ${diversi.length}, solo in B ${soloB.length}`);
for (const r of diversi) console.log(' ', JSON.stringify(r));
process.exit(diversi.length || soloB.length ? 1 : 0);
