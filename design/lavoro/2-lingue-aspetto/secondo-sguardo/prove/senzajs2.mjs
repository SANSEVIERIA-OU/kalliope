const pw = await import(process.env.PLAYWRIGHT);
const [dieci] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
for (const [w, h] of [[1440, 900], [390, 844]]) for (const js of [false, true]) {
  const ctx = await b.newContext({javaScriptEnabled: js, viewport: {width: w, height: h}}); const p = await ctx.newPage();
  await p.goto(dieci + '/', {waitUntil: 'load'}); await sleep(6000);
  const r = await p.evaluate(() => { const bo = document.querySelector('.bolla-lingue'), s = getComputedStyle(bo), a = document.querySelector('.lingue-in-bolla a'), sa = getComputedStyle(a);
    return {bolla: `op=${s.opacity} vis=${s.visibility} disp=${s.display} trasf=${s.transform.slice(0, 30)} anim=${s.animationName}`, nome: `op=${sa.opacity} vis=${sa.visibility}`, html: document.documentElement.className, main: document.querySelector('main').className}; });
  await p.screenshot({path: `/tmp/lavoro-2s-foto/ritagli/scelta-js${js ? 'si' : 'no'}-${w}.png`});
  console.log(`${w}x${h} JS=${js}`, JSON.stringify(r));
  await ctx.close();
}
await b.close();
