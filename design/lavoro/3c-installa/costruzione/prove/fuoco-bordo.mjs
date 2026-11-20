// Il fuoco di tastiera su un collegamento in fondo allo schermo: Tab fino a un nome dato, poi dove sta rispetto al bordo basso (Firefox lasciava «Che cosa fare» 9 px sotto).
// Uso: PORTA=… node fuoco-bordo.mjs <cartella-sito> <motore> <WxH> "<nome>" [css da iniettare]
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const [cartella, motore, misura, nome, css = ''] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(base + 'it/installa/', {waitUntil: 'load'}); await p.waitForTimeout(3000);
if (css) await p.addStyleTag({content: css});
let trovato = null;
for (let k = 0; k < 90 && !trovato; k++) {
  await p.keyboard.press('Tab'); await p.waitForTimeout(900);
  const a = await p.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(), cs = getComputedStyle(e), pr = getComputedStyle(e.parentElement); return {nome: (e.getAttribute('aria-label') || e.textContent).replace(/\s+/g, ' ').trim().slice(0, 40), tag: e.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, y: Math.round(scrollY), display: cs.display, padre: pr.display, righe: e.getClientRects().length, margine: cs.scrollMarginBottom, rit: e.parentElement.className}; });
  if (a.nome.startsWith(nome)) trovato = a;
}
console.log(`${motore} ${misura} «${nome}»${css ? ' con ' + css : ''}:`, JSON.stringify(trovato), trovato && trovato.bottom <= trovato.vh ? 'IN VISTA' : 'TAGLIATO SOTTO');
await b.close(); server.close();
