// Misure veloci di elementi: node misura.mjs <url> <LxA> <selettore>...
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, m, ...sel] = process.argv.slice(2); const [w, h] = m.split('x').map(Number);
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: 'reduce'});
await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(500);
for (const s of sel) console.log(s, JSON.stringify(await p.$$eval(s, es => es.filter(e => e.getClientRects().length).map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)]; }))));
await b.close();
