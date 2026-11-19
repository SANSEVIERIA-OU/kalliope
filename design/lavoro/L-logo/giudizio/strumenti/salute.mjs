// Errori, scorrimento orizzontale e misura del marchio: node salute.mjs <base> <pagine,...>
const pw = (await import(process.env.PLAYWRIGHT)).default;
const [base, pagine] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
for (const [w, h] of [[1440, 900], [390, 844], [768, 1024]]) for (const pg of pagine.split(',')) {
  const p = await b.newPage({viewport: {width: w, height: h}});
  const err = []; p.on('pageerror', e => err.push(String(e))); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
  p.on('requestfailed', r => err.push('FALLITA ' + r.url()));
  const r = await p.goto(base + pg, {waitUntil: 'load'}); await p.waitForTimeout(1500);
  const m = await p.evaluate(() => { const el = document.querySelector('.marchio'); const s = el && (el.querySelector('svg,img') || el); const rr = s && s.getBoundingClientRect();
    return {sw: document.documentElement.scrollWidth, iw: innerWidth, marchio: rr ? `${Math.round(rr.width)}x${Math.round(rr.height)} a ${Math.round(rr.x)},${Math.round(rr.y)}` : 'manca', nome: el ? el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) : '', dir: document.documentElement.dir || 'ltr'}; });
  console.log(`${w} ${pg} http ${r.status()} scroll-oriz ${m.sw > m.iw ? 'SI ' + m.sw : 'no'} marchio ${m.marchio} «${m.nome}» ${m.dir} ${err.length ? 'ERRORI ' + err.join(' | ') : 'nessun errore'}`);
  await p.close();
}
await b.close();
