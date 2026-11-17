const pw = await import(process.env.PLAYWRIGHT);
const [url, out, w = '1000', h = '700', motore = 'chromium'] = process.argv.slice(2);
const b = await pw[motore].launch({headless: true}); const p = await b.newPage({viewport: {width: +w, height: +h}});
await p.goto(url, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 800));
await p.screenshot({path: out, fullPage: true}); await b.close();
