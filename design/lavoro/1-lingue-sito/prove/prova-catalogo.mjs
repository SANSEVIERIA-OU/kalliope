const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const b = await avvia('chromium'); const p = await b.newPage({viewport: {width: 1280, height: 900}});
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text())); p.on('response', r => r.status() >= 400 && err.push(r.status() + ' ' + r.url()));
await p.goto(process.env.ANTEPRIMA + 'design-system/catalogo/'); await p.waitForTimeout(2500);
console.log('token letti:', await p.evaluate(() => document.body.innerText.match(/(\d+) token/)?.[0]), '| errori:', JSON.stringify(err));
console.log('componenti:', await p.evaluate(() => document.querySelectorAll('.cat-scheda, section').length));
await b.close();
