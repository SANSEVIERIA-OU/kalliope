const pw = await import(process.env.PLAYWRIGHT);
const [url] = process.argv.slice(2);
for (const motore of ['firefox', 'chromium']) {
  const b = await pw[motore].launch({headless: true}); const p = await b.newPage({viewport: {width: 390, height: 844}});
  await p.goto(url, {waitUntil: 'load'}); await new Promise(r => setTimeout(r, 2000));
  await p.click('.pulsante-menu'); await new Promise(r => setTimeout(r, 800));
  const r = await p.evaluate(() => { const m = document.getElementById('menu'); const s = getComputedStyle(m);
    return {versione: navigator.userAgent.match(/(Firefox|Chrome)\/[\d.]+/)?.[0], supporta: CSS.supports('backdrop-filter', 'blur(4px)'), filtro: s.backdropFilter, fondo: s.backgroundColor, immagine: s.backgroundImage.slice(0, 120)}; });
  console.log(motore, JSON.stringify(r));
  await b.close();
}
