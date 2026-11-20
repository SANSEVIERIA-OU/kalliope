// La scorsa veloce fino al tratto B («Controlla») a una misura bassa: dove sta il terminale rispetto alla finestra quando la prova si ferma 200 px sotto la cima del passo,
// e se la scena arriva al suo stato finale quando il terminale si vede davvero. Uso: PORTA=… node tratto-b.mjs <cartella-sito> <motore> <WxH>
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, motore = 'chromium', misura = '360x640'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + 'it/installa/', {waitUntil: 'load'}); await p.waitForTimeout(800);
const stato = () => p.evaluate(() => { const t = document.querySelector('.terminale-controllo'), r = t.getBoundingClientRect(); return {alto: Math.round(r.top), basso: Math.round(r.bottom), vh: innerHeight, inAttesa: t.classList.contains('in-attesa'), gruppiUguali: [...t.querySelectorAll('.t-gruppo')].filter(g => g.getClientRects().length).every(g => g.classList.contains('uguale'))}; });
const fatto = async (max = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { const s = await stato(); if (!s.inAttesa && s.gruppiUguali) return Date.now() - t0; await p.waitForTimeout(100); } return -1; };
await p.evaluate(() => { const y = document.querySelector('#passo-controlla').getBoundingClientRect().top + scrollY; scrollTo({top: y - 200, behavior: 'instant'}); });
for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, k % 2 ? -150 : 150); await p.waitForTimeout(30); }
console.log(`${motore} ${misura} · come la prova (cima del passo - 200 px):`, JSON.stringify(await stato()), 'finito in', await fatto(6000), 'ms');
await p.evaluate(() => { const t = document.querySelector('.terminale-controllo'); const y = t.getBoundingClientRect().top + scrollY; scrollTo({top: y - 100, behavior: 'instant'}); });
for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, k % 2 ? -150 : 150); await p.waitForTimeout(30); }
console.log(`${motore} ${misura} · con il terminale in vista (cima del terminale - 100 px):`, JSON.stringify(await stato()), 'finito in', await fatto(16000), 'ms');
await b.close(); server.close();
