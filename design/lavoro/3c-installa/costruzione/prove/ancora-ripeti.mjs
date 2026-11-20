// Un indirizzo con ancora (#indirizzo-installa, #fedora…) aperto più volte: dove sta il titolo del punto dopo l'arrivo, quanto è alta la pagina, e dove stava
// durante i primi tre secondi (titolo.top e altezza ogni 100 ms, da quando il documento è interattivo). Serve a dire se il difetto è sempre o a volte, e da dove viene.
// Uso: PORTA=… node ancora-ripeti.mjs <cartella-sito> <motore> <WxH> <ancora> <titolo css> <volte> [--traccia] [--ritardo-caratteri=ms]
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, motore = 'firefox', misura = '390x844', ancora = 'indirizzo-installa', titolo = '#inoltra h3', volte = '6', ...opz] = process.argv.slice(2);
const traccia = opz.includes('--traccia');
const {readFileSync} = await import('node:fs');
const carico = () => { try { return 'PSI CPU ' + readFileSync('/proc/pressure/cpu', 'utf8').split('\n')[0].split(' ')[1] + ', load ' + readFileSync('/proc/loadavg', 'utf8').split(' ').slice(0, 3).join(' '); } catch { return ''; } };
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
let giusti = 0;
for (let i = 1; i <= +volte; i++) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'no-preference'});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.addInitScript(([sel]) => {
    window.__tr = []; const t0 = performance.now();
    const giro = () => { const t = document.querySelector(sel); if (t) { const r = t.getBoundingClientRect(); window.__tr.push([Math.round(performance.now() - t0), Math.round(scrollY), Math.round(r.top), document.documentElement.scrollHeight, document.fonts.status, document.readyState, [...document.fonts].filter(f => f.status === 'loaded').length + '/' + document.fonts.size]); } if (performance.now() - t0 < 3200) setTimeout(giro, 100); };
    document.addEventListener('DOMContentLoaded', giro);
  }, [titolo]);
  await p.goto(base + 'it/installa/#' + ancora, {waitUntil: 'load'});
  await p.waitForTimeout(3400);
  const r = await p.evaluate(t => { const e = document.querySelector(t).getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {titolo: Math.round(e.top), barra: Math.round(barra), y: Math.round(scrollY), altezza: document.documentElement.scrollHeight, max: document.documentElement.scrollHeight - innerHeight, tr: window.__tr}; }, titolo);
  const bene = r.titolo >= r.barra - 1 && r.titolo + 30 <= H;
  const finale = r.tr.length ? r.tr[r.tr.length - 1] : null;
  const strano = bene && (r.y < r.max - 2 && r.titolo > 56 + 100);   // nello schermo, ma non dove il browser porta di solito il punto
  if (bene) giusti++;
  console.log(`${!bene ? 'NO' : strano ? 'ma' : 'ok'} ${motore} ${misura} #${ancora} prova ${i} [${carico()}]: titolo a ${r.titolo} (barra ${r.barra}), scrollY ${r.y}, pagina alta ${r.altezza} (scorrimento massimo ${r.max})`);
  if (traccia || !bene || strano) { let prec = null; for (const x of r.tr) { if (!prec || x[1] !== prec[1] || x[2] !== prec[2] || x[3] !== prec[3] || x[4] !== prec[4]) console.log('     ms', x.join(' · ')); prec = x; } }
  await ctx.close();
}
console.log(`${giusti}/${volte} nel punto giusto`);
await b.close(); server.close();
