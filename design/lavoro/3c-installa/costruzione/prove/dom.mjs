// Rettangoli e margini di elementi, a una misura. Uso: node dom.mjs <url> <WxH> <selettore>…   (con movimento ridotto)
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, m, ...sel] = process.argv.slice(2); const [w, h] = m.split('x').map(Number);
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: 'reduce'});
await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(700);
for (const s of sel) console.log(s, JSON.stringify(await p.$$eval(s, es => es.filter(e => e.getClientRects().length).map(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return {x: Math.round(r.x), top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), mt: c.marginTop, mb: c.marginBottom, pt: c.paddingTop, pb: c.paddingBottom, d: c.display, fs: c.fontSize}; }))));
await b.close();
