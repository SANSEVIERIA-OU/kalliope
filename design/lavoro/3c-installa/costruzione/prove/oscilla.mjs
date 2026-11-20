// Il primo schermo oscilla? Conta i cambi di classe di .scena-pagina (adattaPrimo) e le misure del titolo in una finestra di tempo, a più altezze, prima e dopo una scelta. Uso: node oscilla.mjs <url> <larghezza> <altezze,…>
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, W, altezze] = process.argv.slice(2);
const b = await chromium.launch();
for (const H of altezze.split(',').map(Number)) {
  const p = await b.newPage({viewport: {width: +W, height: H}, reducedMotion: 'reduce'});
  await p.addInitScript(() => { window.__cambi = []; document.addEventListener('DOMContentLoaded', () => { new MutationObserver(() => window.__cambi.push([Math.round(performance.now()), document.querySelector('.scena-pagina').className.replace('scena scena-pagina', '').trim() || '-'])).observe(document.querySelector('.scena-pagina'), {attributes: true, attributeFilter: ['class']}); }); });
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(2500);
  const prima = await p.evaluate(() => ({n: window.__cambi.length, ultimo: window.__cambi.slice(-4), h1: Math.round(document.querySelector('h1').getBoundingClientRect().height)}));
  let esito = 'ok';
  try { await p.click('label[for=sistema-tar]', {timeout: 6000}); } catch (e) { esito = 'TIMEOUT ' + String(e.message).split('\n')[0].slice(0, 60); }
  await p.waitForTimeout(1500);
  const dopo = await p.evaluate(() => ({n: window.__cambi.length, ultimo: window.__cambi.slice(-4), h1: Math.round(document.querySelector('h1').getBoundingClientRect().height)}));
  console.log(`${W}x${H}`, JSON.stringify({prima, esito, dopo}));
  await p.close();
}
await b.close();
