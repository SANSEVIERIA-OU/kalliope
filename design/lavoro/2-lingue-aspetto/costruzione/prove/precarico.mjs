// Quando compare il testo del primo schermo nel carattere giusto della sua scrittura, a rete lenta (Chromium, CDP).
// Per ogni lingua e ogni profilo di rete: n corse con un contesto nuovo (niente copie), e nel titolo (h1) si guarda a intervalli di 25 ms quali
// caratteri disegnano davvero il testo (CSS.getPlatformFontsForNode); il tempo è quello in cui compare un carattere scaricato (isCustomFont) della
// scrittura. Si registrano anche il primo disegno del testo (FCP), l'arrivo del file del carattere e quanti file di carattere sono richiesti.
// Uso: node precarico.mjs <sito costruito> <uscita.json> [--lingue ar,ur,hi,bn,el,bg] [--n 3] [--porta 8841] [--pagina ""] [--h2]
import {writeFileSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const h2 = process.argv.includes('--h2');   // HTTP/2 su TLS e testo compresso, come GitHub Pages (servi-h2.mjs); senza, il server di libreria (HTTP/1.1, non comprime)
const {servi} = await import(h2 ? './servi-h2.mjs' : `${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [sito, uscita] = process.argv.slice(2);
const lingue = arg('--lingue', 'ar,ur,hi,bn,el,bg').split(',');
const n = +arg('--n', 3), pagina = arg('--pagina', '');
const server = await servi(sito, {porta: +arg('--porta', 8841), fresco: true});
const base = `http${h2 ? 's' : ''}://127.0.0.1:${server.address().port}/`;
const PROFILI = {
  'rete veloce': null,
  '4G lento (1,6 Mbps, 150 ms)': {offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 0.75e6 / 8},
  '3G (400 kbps, 400 ms)': {offline: false, latency: 400, downloadThroughput: 0.4e6 / 8, uploadThroughput: 0.4e6 / 8},
};
// le scritture e il nome del carattere scaricato (il nome interno del file) che deve comparire nel titolo
const CARATTERE = {ar: /Readex/i, ur: /Nastaliq/i, hi: /Devanagari/i, bn: /Bengali/i, el: /Geologica/i, bg: /Geologica/i};
const mediana = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const b = await avvia('chromium');
const risultati = {};
for (const lingua of lingue) for (const [nome, rete] of Object.entries(PROFILI)) {
  const corse = [];
  for (let i = 0; i < n; i++) {
    const ctx = await b.newContext({viewport: {width: 390, height: 844}, locale: 'it-IT', reducedMotion: 'reduce', ignoreHTTPSErrors: true});
    const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
    const richieste = [];
    p.on('request', r => { if (/\.woff2?$/.test(r.url())) richieste.push({url: r.url().split('/caratteri/')[1], t: Date.now()}); });
    await cdp.send('Network.enable'); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    if (rete) await cdp.send('Network.emulateNetworkConditions', rete);
    const t0 = Date.now();
    const nav = p.goto(`${base}${lingua}/${pagina}`, {waitUntil: 'commit'});
    let comparso = null, fcp = null;
    await nav;
    for (let k = 0; k < 800 && comparso === null; k++) {   // fino a 20 secondi
      try {
        const {root} = await cdp.send('DOM.getDocument', {depth: 0});
        const {nodeId} = await cdp.send('DOM.querySelector', {nodeId: root.nodeId, selector: 'h1'});
        if (nodeId) {
          const {fonts} = await cdp.send('CSS.getPlatformFontsForNode', {nodeId});
          if (fonts.some(f => f.isCustomFont && CARATTERE[lingua].test(f.familyName + ' ' + f.postScriptName))) comparso = Date.now() - t0;
        }
      } catch { /* la pagina si sta ancora costruendo */ }
      if (comparso === null) await new Promise(r => setTimeout(r, 25));
    }
    fcp = await p.evaluate(() => new Promise(r => { const f = performance.getEntriesByName('first-contentful-paint')[0]; r(f ? Math.round(f.startTime) : null); })).catch(() => null);
    await p.waitForTimeout(rete ? 1500 : 300);
    const risorse = await p.evaluate(() => performance.getEntriesByType('resource').filter(e => /\.woff2?$/.test(e.name)).map(e => ({file: e.name.split('/caratteri/')[1], byte: e.encodedBodySize, inizio: Math.round(e.startTime), fine: Math.round(e.responseEnd)}))).catch(() => []);
    corse.push({comparso, fcp, richieste: richieste.length, file: risorse});
    await ctx.close();
  }
  risultati[`${lingua} · ${nome}`] = {comparso: mediana(corse.map(c => c.comparso ?? 99999)), fcp: mediana(corse.map(c => c.fcp ?? 99999)), richiesteFont: mediana(corse.map(c => c.richieste)), corse};
  const r = risultati[`${lingua} · ${nome}`];
  console.log(`${lingua} · ${nome.padEnd(28)} testo nel carattere giusto: ${String(r.comparso).padStart(5)} ms (corse ${corse.map(c => c.comparso).join(', ')}) · primo disegno ${r.fcp} ms · richieste di caratteri ${r.richiesteFont} · ${corse[0].file.map(f => f.file.split('/').pop() + ' ' + f.inizio + '→' + f.fine).join(' | ')}`);
}
writeFileSync(uscita, JSON.stringify(risultati, null, 1));
await b.close(); server.close();
