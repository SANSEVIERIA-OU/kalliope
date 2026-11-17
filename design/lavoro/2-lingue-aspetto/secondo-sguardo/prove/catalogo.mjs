const pw = await import(process.env.PLAYWRIGHT);
const [url, out] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true}); const p = await b.newPage({viewport: {width: 1440, height: 900}});
const err = []; p.on('pageerror', e => err.push(String(e))); p.on('console', m => { if (m.type() === 'error') err.push(m.text().slice(0, 150)); });
await p.goto(url, {waitUntil: 'load'}); await new Promise(r => setTimeout(r, 4000));
const ids = await p.evaluate(() => [...document.querySelectorAll('section[id], [id^="lingue"], [id*="specchio"]')].map(s => s.id).slice(0, 80));
console.log('sezioni:', ids.join(' '));
const s = p.locator('#specchio').first();
if (await s.count()) { await s.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 1500)); await s.screenshot({path: out}); }
console.log('errori:', err.length, err.slice(0, 5).join(' | '));
await b.close();
