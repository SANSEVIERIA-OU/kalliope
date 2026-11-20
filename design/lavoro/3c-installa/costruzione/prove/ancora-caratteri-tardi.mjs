// Gli indirizzi con ancora quando i caratteri arrivano dopo: la prova che non dipende dal caso (dal carico della macchina). Per ogni ancora, con i caratteri (.woff2) tenuti fermi
// per un ritardo deciso (0 = come arrivano, poi più lunghi di «load»), dice dove sta il titolo del punto a pagina assestata e lo confronta con dove sta senza ritardo.
// Uso: PORTA=… node ancora-caratteri-tardi.mjs <cartella-sito> <motore> <WxH> <ritardo ms[,ritardo ms…]> [ancora,ancora…] [--tipo=woff2|dejavu|lexend|css|js|immagini|tutto]   (di serie: i caratteri)
const SKILL = process.env.SKILL;
const {servi} = await import(SKILL + '/scripts/lib/servi.mjs');
const {avvia, pagina} = await import(SKILL + '/scripts/lib/comune.mjs');
const {readFileSync} = await import('node:fs');
const argomenti = process.argv.slice(2), tipo = (argomenti.find(a => a.startsWith('--tipo=')) || '--tipo=woff2').split('=')[1];
const [cartella, motore = 'firefox', misura = '390x844', ritardi = '0,1500', elenco = ''] = argomenti.filter(a => !a.startsWith('--'));
const MODELLI = {testi: '**/testi.js', cornice: '**/cornice.js', installa: '**/installa/installa.js', dejavu: '**/DejaVu*.woff2', lexend: '**/Lexend*.woff2', woff2: '**/*.woff2', css: '**/*.css', js: '**/*.js', immagini: /\.(svg|png|webp|jpg|jpeg|avif|gif|mp4|webm)(\?|$)/, tutto: '**/*'};
const fotoDir = (argomenti.find(a => a.startsWith('--foto=')) || '').split('=')[1], etichetta = (argomenti.find(a => a.startsWith('--nome=')) || '--nome=').split('=')[1];
const [W, H] = misura.split('x').map(Number);
const CASI = [['fedora', '#installa-titolo'], ['debian-ubuntu', '#installa-titolo'], ['arch', '#installa-titolo'], ['altre', '#installa-titolo'], ['passo-1', '#scarica-titolo'], ['passo-2', '#passo-controlla .passo-nome'],
  ['passo-3', '#installa-titolo'], ['passo-4', '#apri-titolo'], ['passo-5', '#microfono-titolo'], ['ripresa', '#ripresa-titolo'], ['indirizzo-installa', '#inoltra h3'], ['inoltra', '#inoltra h3']];
const scelti = elenco ? CASI.filter(([a]) => elenco.split(',').includes(a)) : CASI;
const carico = () => { try { return 'PSI CPU ' + readFileSync('/proc/pressure/cpu', 'utf8').split('\n')[0].split(' ')[1] + ', load ' + readFileSync('/proc/loadavg', 'utf8').split(' ').slice(0, 3).join(' '); } catch { return ''; } };
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: false}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
async function misura1(ancora, titolo, ritardo) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'no-preference'});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  if (ritardo) await p.route(MODELLI[tipo], async r => { if (tipo === 'tutto' && r.request().resourceType() === 'document') return r.continue(); await new Promise(x => setTimeout(x, ritardo)); try { await r.continue(); } catch {} });
  await p.goto(base + 'it/installa/#' + ancora, {waitUntil: 'load'});
  await p.waitForTimeout(ritardo + 2800);
  const r = await p.evaluate(t => { const e = document.querySelector(t).getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {titolo: Math.round(e.top), bottom: Math.round(e.bottom), barra: Math.round(barra), y: Math.round(scrollY), altezza: document.documentElement.scrollHeight, caratteri: document.fonts.status}; }, titolo);
  if (fotoDir && ritardo) { (await import('node:fs')).mkdirSync(fotoDir, {recursive: true}); await p.screenshot({path: `${fotoDir}/ancora-${ancora}-${tipo}-${ritardo}ms-${motore}-${misura}${etichetta ? '-' + etichetta : ''}.png`}); }
  await ctx.close();
  return r;
}
let no = 0, tot = 0;
for (const ritardo of ritardi.split(',').map(Number)) {
  for (const [ancora, titolo] of scelti) {
    const r = await misura1(ancora, titolo, ritardo);
    let rif = null;
    if (ritardo) rif = await misura1(ancora, titolo, 0);
    const nelloSchermo = r.titolo >= r.barra - 1 && r.bottom <= H + 2;
    const comeSenza = !rif || Math.abs(r.titolo - rif.titolo) <= 2;
    tot++; if (!(nelloSchermo && comeSenza)) no++;
    console.log(`${nelloSchermo && comeSenza ? 'ok' : 'NO'}  ${motore} ${misura} #${ancora} ${tipo} dopo ${ritardo} ms: titolo a ${r.titolo} (barra ${r.barra}), scrollY ${r.y}, pagina ${r.altezza}, caratteri ${r.caratteri}${rif ? ` · senza ritardo: titolo a ${rif.titolo}, scrollY ${rif.y}, pagina ${rif.altezza}` : ''} [${carico()}]`);
  }
}
console.log(`${tot - no}/${tot} nel punto giusto e come senza ritardo`);
await b.close(); server.close();
