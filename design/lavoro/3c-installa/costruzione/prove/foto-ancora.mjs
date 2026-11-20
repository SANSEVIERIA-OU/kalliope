// La foto di un indirizzo con ancora dopo l'arrivo, per il prima e il dopo del difetto 15 (Firefox: il titolo del punto dietro la barra).
// Uso: PORTA=… node foto-ancora.mjs <cartella-sito> <uscita.png> <motore> <WxH> <ancora> [ritardo script ms]
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, uscita, motore, misura, ancora, ritardo = '0'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'no-preference'});
const p = pagina(await ctx.newPage(), []);
if (+ritardo) await p.route('**/*.js', async r => { await new Promise(x => setTimeout(x, +ritardo)); try { await r.continue(); } catch {} });
await p.goto(base + 'it/installa/#' + ancora, {waitUntil: 'load'}); await p.waitForTimeout(+ritardo + 2800);
const r = await p.evaluate(() => { const t = document.querySelector('#inoltra h3').getBoundingClientRect(); return {titolo: Math.round(t.top), barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom)}; });
await p.screenshot({path: uscita});
console.log(`${uscita}: titolo a ${r.titolo}, barra a ${r.barra}`);
await b.close(); server.close();
