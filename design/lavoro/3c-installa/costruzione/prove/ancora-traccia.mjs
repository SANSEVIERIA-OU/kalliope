// Dove va a finire un indirizzo vecchio (#fedora…): la posizione del titolo del tratto e l'altezza della pagina ogni 150 ms per tre secondi.
// Uso: PORTA=… node ancora-traccia.mjs <cartella-sito> <motore> <WxH> <ancora>
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, motore = 'firefox', misura = '1440x900', ancora = 'fedora'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.addInitScript(() => { window.__traccia = []; const t0 = performance.now(); const giro = () => { const t = document.querySelector('#installa-titolo'); if (t) { const r = t.getBoundingClientRect(); const parti = [...document.querySelectorAll('main > *, .scena-pagina > *, section.passo, .passo')].map(e => (e.id || e.className.toString().split(' ')[0] || e.tagName) + ':' + Math.round(e.getBoundingClientRect().height)).join(' '); window.__traccia.push([Math.round(performance.now() - t0), Math.round(scrollY), Math.round(r.top), document.documentElement.scrollHeight, document.fonts.status, parti]); } if (performance.now() - t0 < 3500) setTimeout(giro, 150); }; document.addEventListener('DOMContentLoaded', giro); });
await p.goto(base + 'it/installa/#' + ancora, {waitUntil: 'load'}); await p.waitForTimeout(3800);
const tr = await p.evaluate(() => window.__traccia);
console.log(`${motore} ${misura} #${ancora}: [ms, scrollY, titolo.top, altezza pagina]`); let prec = ''; for (const r of tr.slice(0, 5)) { const [a1, b1, c1, d1, f1, parti] = r; console.log('  ', a1, b1, c1, d1, f1); if (prec) { const x = parti.split(' '), y = prec.split(' '); const diff = x.map((v, i) => v !== y[i] ? `${y[i]} -> ${v}` : null).filter(Boolean); if (diff.length) console.log('      cambia:', diff.join(' ; ')); } prec = parti; }
await b.close(); server.close();
