// fotogrammi fitti dopo aver portato in vista un elemento: <url> <out> <misura> <selettore> <istanti ms separati da virgola>
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, out, misura, sel, istanti] = process.argv.slice(2);
const [w, h] = misura.split('x').map(Number);
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: w, height: h}});
await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(1200);
await p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); scrollTo({top: scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: 'instant'}); }, sel);
const t0 = Date.now();
for (const ms of istanti.split(',').map(Number)) { const d = ms - (Date.now() - t0); if (d > 0) await p.waitForTimeout(d); await p.screenshot({path: `${out}-${String(ms).padStart(4, '0')}.png`}); }
await b.close();
