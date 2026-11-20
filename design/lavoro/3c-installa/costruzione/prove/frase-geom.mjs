// Dove stanno la finestra e la frase premuta nello schermo, dopo aver premuto una frase della finestra. Uso: node frase-geom.mjs <url> <misure,…>
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, misure] = process.argv.slice(2);
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: 'reduce'});
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
  for (const st of ['curl', 'microfono']) {
    await p.evaluate(() => document.querySelector('#apri').scrollIntoView({block: 'start'})); await p.waitForTimeout(500);
    // come lo fa una persona: scorre fino al pulsante della frase e preme
    await p.locator(`.frase-bottone[data-stato=${st}]`).scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await p.click(`.frase-bottone[data-stato=${st}]`); await p.waitForTimeout(1200);
    const r = await p.evaluate(() => { const g = s => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; };
      return {vh: innerHeight, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), finestra: g('.finestra.avvio'), stato: g('.finestra.avvio .f-stato'), bottone: g('.frase-bottone[aria-pressed=true]'), stato_testo: document.querySelector('.f-stato').textContent.slice(0, 40)}; });
    const dentro = ([t, bo]) => t >= r.barra - 1 && bo <= r.vh;
    console.log(`${m} ${st}`, JSON.stringify(r), 'finestra in vista:', dentro(r.finestra), 'stato:', dentro(r.stato), 'bottone:', dentro(r.bottone));
  }
  await p.close();
}
await b.close();
