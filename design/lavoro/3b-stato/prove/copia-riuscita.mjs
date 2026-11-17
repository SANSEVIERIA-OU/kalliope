// La copia riuscita del messaggio da inoltrare (gli appunti con il permesso dato): fotogrammi dopo il clic e il testo copiato.
// Uso: node copia-riuscita.mjs <indirizzo> <uscita-senza-estensione> <misura>
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, out, misura] = process.argv.slice(2);
const [w, h] = misura.split('x').map(Number);
const b = await chromium.launch();
const c = await b.newContext({viewport: {width: w, height: h}, permissions: ['clipboard-read', 'clipboard-write']});
const p = await c.newPage();
await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView({block: 'start'})); await p.waitForTimeout(1500);
await p.click('.copia-messaggio');
const t0 = Date.now();
for (const ms of [0, 150, 300, 500, 800, 1200]) { const d = ms - (Date.now() - t0); if (d > 0) await p.waitForTimeout(d); await p.screenshot({path: `${out}-${misura}-${String(ms).padStart(4, '0')}.png`}); }
console.log('copiato:', JSON.stringify(await p.evaluate(() => navigator.clipboard.readText())));
await b.close();
