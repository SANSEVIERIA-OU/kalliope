// L3 · il colore reso del nome «Kalliope» nella pagina della scelta: il pixel più chiaro del titolo, con e senza un correttivo iniettato.
const pw = await import(process.env.PLAYWRIGHT);
const [base, css = ''] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
const ctx = await b.newContext({viewport: {width: 1440, height: 900}, locale: 'en-GB'});
if (css) await ctx.addInitScript(c => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = c; document.head.append(s); }), css);
const p = await ctx.newPage(); await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(3500);
const r = await (await p.locator('.scelta-titolo').boundingBox());
const png = await p.screenshot({clip: r});
const {default: sharp} = await import('/workspace/test-playwright/node_modules/sharp/lib/index.js').catch(() => ({default: null}));
console.log(JSON.stringify(r), sharp ? 'sharp' : 'nosharp');
await p.screenshot({path: `/tmp/lavoro-2f-lavoro/titolo-${css ? 'dopo' : 'prima'}.png`, clip: r});
await b.close();
