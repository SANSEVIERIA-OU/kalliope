/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Analizza i sei MP3 di site/voce con la decodifica di Chromium (senza finestra) e scrive site/voce/tempi.json:
// durata, pause fra le frasi e inviluppo dell'ampiezza (un valore ogni 60 ms). Dati misurati, non stimati.
// Uso: PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs node analizza-voci.mjs
import {readFileSync, writeFileSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const dir = '/workspace/kalliope/site/voce/';
const nomi = ['giulia-1', 'giulia-2', 'giulia-3', 'marco-1', 'marco-2', 'marco-3'];
const browser = await chromium.launch({headless: true});
const page = await browser.newPage();
await page.goto('about:blank');
const risultato = {};
for (const n of nomi) {
  const b64 = readFileSync(dir + n + '.mp3').toString('base64');
  risultato[n] = await page.evaluate(async b64 => {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const ctx = new OfflineAudioContext(1, 24000, 24000);
    const buf = await ctx.decodeAudioData(bin.buffer);
    const x = buf.getChannelData(0), sr = buf.sampleRate;
    const passo = 0.060, n = Math.ceil(buf.duration / passo), env = [];
    for (let i = 0; i < n; i++) {
      let s = 0, c = 0;
      for (let k = Math.floor(i * passo * sr); k < Math.min(x.length, Math.floor((i + 1) * passo * sr)); k++) { s += x[k] * x[k]; c++; }
      env.push(c ? Math.sqrt(s / c) : 0);
    }
    const max = Math.max(...env);
    // finestre da 20 ms per cercare le pause
    const w = 0.020, nw = Math.ceil(buf.duration / w), rms = [];
    for (let i = 0; i < nw; i++) {
      let s = 0, c = 0;
      for (let k = Math.floor(i * w * sr); k < Math.min(x.length, Math.floor((i + 1) * w * sr)); k++) { s += x[k] * x[k]; c++; }
      rms.push(c ? Math.sqrt(s / c) : 0);
    }
    return {durata_s: buf.duration, frequenza: sr, max, env, rms, w};
  }, b64);
}
await browser.close();
const out = {passo_ms: 60, file: {}};
for (const n of nomi) {
  const r = risultato[n];
  const soglia = r.max * 0.04;
  // pause: sequenze di finestre sotto soglia lunghe almeno 220 ms, non in testa né in coda
  const pause = [];
  let inizio = null;
  r.rms.forEach((v, i) => {
    if (v < soglia) { if (inizio === null) inizio = i; }
    else { if (inizio !== null) { const durata = (i - inizio) * r.w; if (durata >= 0.22 && inizio * r.w > 0.3) pause.push([inizio * r.w, i * r.w]); inizio = null; } }
  });
  // primo e ultimo suono
  const primo = r.rms.findIndex(v => v >= soglia) * r.w;
  let ultimo = r.rms.length - 1; while (ultimo > 0 && r.rms[ultimo] < soglia) ultimo--;
  ultimo = (ultimo + 1) * r.w;
  // numero di frasi (punti fermi) di ciascun testo: i confini sono le pause più lunghe; le pause dentro una frase (due punti, virgola) non contano
  const nFrasi = {'1': 2, '2': 2, '3': 1}[n.slice(-1)];
  const confini = [...pause].sort((p, q) => (q[1] - q[0]) - (p[1] - p[0])).slice(0, nFrasi - 1).sort((p, q) => p[0] - q[0]);
  const frasi = [];
  let da = primo;
  for (const [a, b] of confini) { frasi.push({da: +da.toFixed(2), a: +a.toFixed(2)}); da = b; }
  frasi.push({da: +da.toFixed(2), a: +ultimo.toFixed(2)});
  out.file[n] = {durata_s: +r.durata_s.toFixed(2), frasi, env: r.env.map(v => +(v / r.max).toFixed(3))};
  console.log(n, 'durata', r.durata_s.toFixed(2), 'frasi', JSON.stringify(frasi), 'pause trovate', JSON.stringify(pause.map(p => p.map(v => +v.toFixed(2)))));
}
writeFileSync('/workspace/kalliope/site/voce/tempi.json', JSON.stringify(out));
console.log('scritto tempi.json', JSON.stringify(out).length, 'byte');
