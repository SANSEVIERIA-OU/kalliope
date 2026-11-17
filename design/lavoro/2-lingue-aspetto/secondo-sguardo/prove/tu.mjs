// L'etichetta di «Tu» al telefono: una riga? sopra le barre? Uso: node tu.mjs <base> <lingue> <misure>
const pw = await import(process.env.PLAYWRIGHT);
const [base, lingue, misure] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
for (const l of lingue.split(',')) for (const [w, h] of misure.split(',').map(x => x.split('x').map(Number))) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, isMobile: true, hasTouch: true}); const p = await ctx.newPage();
  await p.goto(`${base}/${l}/`, {waitUntil: 'load'}); await new Promise(r => setTimeout(r, 3500));
  const r = await p.evaluate(() => { const t = document.querySelector('.apertura ~ * .riquadro.tu, .riquadro.tu'); const n = t.querySelector('.nome'), ba = t.querySelector('.barre'), q = n.getBoundingClientRect(), qb = ba.getBoundingClientRect(), qt = t.getBoundingClientRect();
    const righe = n.getClientRects().length > 1 || q.height > parseFloat(getComputedStyle(n).lineHeight) * 1.5 + 12;
    return {testo: n.innerText.trim(), righe: Math.round(q.height), sopraBarre: q.bottom > qb.top && q.top < qb.bottom && q.left < qb.right && q.right > qb.left, fuori: q.left < qt.left - 1 || q.right > qt.right + 1}; });
  console.log(`${l} ${w}x${h}: «${r.testo}» alto ${r.righe} ${r.sopraBarre ? 'SOPRA LE BARRE' : ''} ${r.fuori ? 'FUORI' : ''}`);
  await p.screenshot({path: `/tmp/lavoro-2s-foto/ritagli/tu-${l}-${w}.png`});
  await ctx.close();
}
await b.close();
