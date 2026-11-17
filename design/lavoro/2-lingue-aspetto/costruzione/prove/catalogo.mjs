// Il catalogo si apre senza errori (nei tre motori) e la sua tabella dei token ha tutti i blocchi di token.css; la sezione delle lingue c'è con tutti i suoi
// pezzi anche quando il sito pubblica una lingua sola. Uso: node catalogo.mjs <sito costruito> --attesi <numero di token in tutti i blocchi :root> [--motori chromium,firefox,webkit] [--porta 8846] [--foto <cartella>]
import {mkdirSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, pagina} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const sito = process.argv[2], attesi = +arg('--attesi', 0), foto = arg('--foto', '');
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8846), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
let rosse = 0;
const dice = (ok, testo) => { if (!ok) rosse++; console.log(`  ${ok ? 'ok   ' : 'ROSSO'} ${testo}`); };
for (const motore of arg('--motori', 'chromium,firefox,webkit').split(',')) {
  console.log(motore);
  const b = await avvia(motore);
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  ctx.on('page', q => { q.on('pageerror', e => errori.push('frame: ' + e.message)); });
  await p.goto(base + 'design-system/catalogo/', {waitUntil: 'load'});
  await p.waitForFunction(() => window.__catalogo && document.querySelector('#lingue .cat-scheda') && document.querySelector('#specchio .cat-prova'), null, {timeout: 30000}).catch(() => {});
  // i riquadri sono iframe pigri: scorrere perché si carichino
  await p.evaluate(async () => { for (const y of [...Array(40).keys()]) { scrollTo(0, y * innerHeight * 0.8); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const c = window.__catalogo || {}, righe = [...document.querySelectorAll('#tabella tbody tr')];
    const cella = (nome, i) => { const tr = righe.find(x => x.children[2].textContent === nome); return tr ? tr.children[i].textContent : null; };
    const frames = [...document.querySelectorAll('iframe')];
    const lingue = document.querySelector('#lingue');
    const barra = lingue && lingue.querySelector('.cap-barra');
    return {
      stato: document.querySelector('#stato-catalogo').textContent, errori: c.errori, token: c.token, blocchi: c.blocchi, perBlocco: c.perBlocco, variano: c.variano,
      righe: righe.length, sezioni: [...document.querySelectorAll('#indice a')].map(a => a.getAttribute('href').slice(1)),
      blocchiTabella: [...new Set(righe.map(x => x.children[0].textContent))],
      pagineInterne: cella('--pagina-scena-spazio-sotto', 0), scritture: cella('--interlinea-titoli-scrittura', 0), lingueToken: cella('--lingue-distanza', 0),
      variaVerso: cella('--verso', 6), variaMargine: cella('--margine', 6), variaInterlinea: cella('--interlinea-titoli-scrittura', 6), variaFont: cella('--font-testo', 6),
      scrittureFrame: document.querySelectorAll('#scritture iframe').length, specchioFrame: document.querySelectorAll('#specchio iframe').length, vive: document.querySelectorAll('#lingue .cap-schermo iframe').length,
      barraVoci: barra ? barra.querySelectorAll('.lingue-elenco a').length : null, barraAperta: barra ? !!barra.querySelector('details[open]') : null,
      elencoVoci: lingue && lingue.querySelector('.cat-scheda .cat-prova .lingue-elenco') ? lingue.querySelector('.cat-scheda .cat-prova .lingue-elenco').querySelectorAll('a').length : null,
      bollaVoci: lingue ? lingue.querySelectorAll('.scelta-lingua .lingue-in-bolla a').length : null,
      senzaAltezza: frames.filter(f => !f.getBoundingClientRect().height).length,
    };
  });
  // dentro i riquadri (iframe pigri): uno alla volta, portato in vista, aspettando che si carichi; si legge dal suo documento
  const dentro = await p.evaluate(async () => {
    const out = [];
    for (const f of document.querySelectorAll('iframe')) {
      f.scrollIntoView({block: 'center'});
      const t0 = performance.now();
      while (performance.now() - t0 < 6000 && !(f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentDocument.body && f.contentDocument.body.children.length && f.contentDocument.querySelector('link[rel=stylesheet]'))) await new Promise(r => setTimeout(r, 80));
      const d = f.contentDocument;
      if (!d || !d.body) { out.push({titolo: f.title, caricato: false}); continue; }
      await d.fonts.ready;
      const h = d.querySelector('h1, .scelta-titolo, .barra, .bolla');
      out.push({titolo: f.title, caricato: true, lang: d.documentElement.lang, h1: !!h, elenco: d.querySelectorAll('.lingue-in-bolla a').length, font: h ? d.defaultView.getComputedStyle(h).fontFamily.slice(0, 50) : ''});
    }
    return out;
  });
  dice(!r.errori.length && !/non si è costruita|Lingue:/.test(r.stato), `nessuna sezione in errore (${JSON.stringify(r.errori)}): ${r.stato}`);
  dice(r.token === r.righe && r.token > 0, `righe della tabella ${r.righe} = token letti ${r.token}`);
  if (attesi) dice(r.token === attesi, `token letti ${r.token} = token dei blocchi :root di token.css contati a parte ${attesi}`);
  dice(r.blocchi >= 4 && r.blocchiTabella.length === r.blocchi, `blocchi ${r.blocchi}, nella tabella: ${r.blocchiTabella.map(x => x.slice(0, 28)).join(' | ')}`);
  dice(!!r.pagineInterne && !!r.scritture && !!r.lingueToken && r.pagineInterne !== 'Base' && r.scritture !== 'Base' && r.lingueToken !== 'Base', `un token di ogni blocco aggiunto ha il suo blocco: ${[r.pagineInterne, r.scritture, r.lingueToken].map(x => (x || '∅').slice(0, 22)).join(' | ')}`);
  dice(/da destra a sinistra: -1/.test(r.variaVerso || '') && /max-width: 760px/.test(r.variaMargine || '') && /ur: 1\.75/.test(r.variaInterlinea || '') && /ar: /.test(r.variaFont || ''), `colonna «Varia»: --verso «${r.variaVerso}», --margine «${(r.variaMargine || '').slice(0, 50)}», --interlinea-titoli-scrittura «${(r.variaInterlinea || '').slice(0, 60)}»`);
  dice(['scritture', 'lingue', 'specchio'].every(x => r.sezioni.includes(x)), `sezioni (${r.sezioni.length}): scritture, lingue, specchio presenti`);
  dice(r.scrittureFrame === 9 && r.specchioFrame === 2 && r.vive === 2, `riquadri: scritture ${r.scrittureFrame}/9, specchio ${r.specchioFrame}/2, pagina della scelta viva ${r.vive}/2`);
  dice(r.barraVoci === 30 && r.barraAperta && r.elencoVoci === 30 && r.bollaVoci === 30, `scelta nella barra ${r.barraVoci} voci (aperta ${r.barraAperta}), elenco ${r.elencoVoci}, bolla ${r.bollaVoci}`);
  dice(r.senzaAltezza === 0, `riquadri senza altezza: ${r.senzaAltezza}`);
  dice(dentro.length >= 13 && dentro.every(x => x.caricato && x.h1), `dentro i riquadri (${dentro.length}): tutti caricati e con il titolo (${dentro.filter(x => !x.caricato || !x.h1).map(x => x.titolo).join(', ') || 'nessuno senza'}); pagine della scelta con ${dentro.filter(x => x.elenco).map(x => x.elenco).join(',')} nomi; lingue ${[...new Set(dentro.map(x => x.lang))].join(' ')}`);
  dice(!errori.length, `errori di console e di pagina: ${errori.length}${errori.length ? ' · ' + errori.slice(0, 3).join(' | ') : ''}`);
  if (foto) { await p.evaluate(() => document.querySelector('#lingue').scrollIntoView()); await p.waitForTimeout(800); await p.screenshot({path: `${foto}/catalogo-lingue-${motore}.png`}); await p.evaluate(() => document.querySelector('#tabella').scrollIntoView()); await p.waitForTimeout(400); await p.screenshot({path: `${foto}/catalogo-tabella-${motore}.png`}); }
  await ctx.close(); await b.close();
}
server.close();
console.log(rosse ? `${rosse} ROSSE` : 'tutto ok');
process.exit(rosse ? 1 : 0);
