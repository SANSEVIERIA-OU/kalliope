const pw = await import(process.env.PLAYWRIGHT);
const [url] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const motore of ["firefox"]) {
  const b = await pw[motore].launch({headless: true}); const p = await b.newPage({viewport: {width: 390, height: 844}});
  await p.goto(url, {waitUntil: 'load'}); await sleep(2500);
  await p.click('.pulsante-menu'); await sleep(2500);
  await p.screenshot({path: `/tmp/lavoro-2s-foto/ritagli/vetro-prima-${motore}.png`});
  const ul = await p.evaluate(() => [...document.querySelectorAll('#menu, #menu > ul, .lingua-scelta')].map(e => { const s = getComputedStyle(e); return e.tagName + ' bg=' + s.backgroundColor + ' op=' + s.opacity + ' filtro=' + s.backdropFilter + ' anim=' + s.animationName; }));
  console.log(motore, ul.join(' | '));
  await b.close();
}
