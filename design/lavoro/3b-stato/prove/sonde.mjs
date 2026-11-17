// Due misure per la correzione: I1 (saltando alla tappa del microfono, dopo quanto si legge piena) e I2 (premendo una domanda,
// l'opacità della risposta a ogni fotogramma: un lampeggio è un 1 prima della dissolvenza d'entrata).
// Uso: node sonde.mjs <indirizzo> <misura>
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, misura = '1440x900'] = process.argv.slice(2);
const [w, h] = misura.split('x').map(Number);
const b = await chromium.launch();
// I1
{
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => {
    const a = document.querySelector('.anello[data-anello=microfono]');
    a.scrollIntoView({block: 'center'});
    const t0 = performance.now(), out = [];
    const testo = a.querySelector('.anello-fatti p') || a.querySelector('.anello-nome');
    while (performance.now() - t0 < 3500) {
      await new Promise(r => requestAnimationFrame(r));
      out.push([Math.round(performance.now() - t0), +getComputedStyle(a.querySelector('.anello-nome')).opacity, +getComputedStyle(testo).opacity, a.classList.contains('acceso')]);
    }
    const piena = out.find(x => x[1] >= 0.99 && x[2] >= 0.99);
    const accesa = out.find(x => x[3]);
    return {primaLettura: out[0], pienaA: piena ? piena[0] : null, accesaA: accesa ? accesa[0] : null};
  });
  console.log('I1 tappa del microfono', misura, JSON.stringify(r));
  await p.close();
}
// I2
{
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(1500);
  for (const id of ['d-costa', 'd-voce', 'd-chi']) {
    const r = await p.evaluate(async id => {
      const c = document.querySelector('.domande-bolla-contenuto');
      document.querySelector(`#${id} .domanda-bottone`).click();
      const t0 = performance.now(), out = [];
      while (performance.now() - t0 < 1100) { await new Promise(r => requestAnimationFrame(r)); out.push([Math.round(performance.now() - t0), +(+getComputedStyle(c).opacity).toFixed(2), c.textContent.slice(0, 18)]); }
      return out;
    }, id);
    // lampeggio: dopo che l'opacità è scesa sotto 0,3, torna a ≥0,95 e poi riscende sotto 0,3
    let scesa = false, risalita = false, lampo = false;
    for (const [, o] of r) { if (o < 0.3 && !scesa) scesa = true; else if (scesa && o >= 0.95 && !risalita) risalita = true; else if (risalita && o < 0.3) lampo = true; }
    console.log('I2', id, misura, lampo ? 'LAMPEGGIA' : 'una volta', r.map(x => `${x[0]}:${x[1]}:${x[2].slice(0, 6)}`).join(' '));
    await p.waitForTimeout(600);
  }
  await p.close();
}
await b.close();
