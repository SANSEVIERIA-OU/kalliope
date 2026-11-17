// Le domande: la risposta si legge intera e la bolla non resta appiccicata quando non ci sta (secondo sguardo, N2). Per ogni misura, premendo ogni domanda (una dopo l'altra, in un
// ordine che passa da risposte corte a lunghe e ritorno): la bolla è appiccicata (sticky) solo se la sua altezza sta sotto la barra con l'aria del sistema, altrimenti scorre con la
// pagina (static) accanto alla sua domanda; poi si scorre a colpi di rotella finché si vede il fondo della bolla (tutta, se scorre) e si guarda che la bolla si muova con la pagina;
// al clic non c'è un salto (la bolla non si sposta di più di 3 px nel suo posto nella pagina, salvo l'allineamento alla domanda quando già scorreva) né della pagina (nessun fotogramma
// con più di 120 px di scorrimento). La scritta (corpo e interlinea) è quella del sistema. Uso: node domande-lettura.mjs <cartella-sito> <porta> <motore> <WxH,…> [--percorso=it/stato/] [--foto=<cartella>]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, porta, motore, misure, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/stato/', foto = opz.find(o => o.startsWith('--foto='))?.split('=')[1];
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await avvia(motore);
const ORDINE = ['d-adatto', 'd-costa', 'd-chi', 'd-frasi', 'd-voce', 'd-scrivere', 'd-sottotitoli', 'd-chi', 'd-installa', 'd-dove', 'd-online', 'd-frasi'];
let male = 0;
const dice = (ok, testo) => { if (!ok) male++; console.log(`${ok ? 'ok  ' : 'NO  '}${testo}`); };
for (const m of misure.split(',')) {
  const [W, H] = m.split('x').map(Number), tel = W <= 760;
  const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, tel)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  await p.goto(`http://127.0.0.1:${porta}/${percorso}`, {waitUntil: 'load'}); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(900);
  const aria = await p.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gesto-aria')));
  console.log(`\n== ${m} ${motore}${tel ? ' (telefono: la bolla sta sotto la domanda, non è appiccicata)' : ''}`);
  const esiti = [];
  let prec = null;
  for (const id of ORDINE) {
    // dov'è la bolla nella pagina nell'istante del clic (prima che la pagina la cambi): il clic di Playwright scorre prima di premere, e una bolla appiccicosa segue lo scorrimento
    await p.evaluate(() => { window.__prima = null; addEventListener('click', () => { const b = document.querySelector('.domande-bolla'), r = b.getBoundingClientRect(); window.__prima = {yDoc: scrollY + r.top, scorre: b.classList.contains('scorre')}; }, {capture: true, once: true}); });
    await p.locator(`#${id} .domanda-bottone`).click();
    const prima = await p.evaluate(() => window.__prima);
    // fotogramma per fotogramma per 1,6 s: dove sta la bolla nella pagina e quanto scorre la pagina
    const camp = await p.evaluate(async () => {
      const bolla = document.querySelector('.domande-bolla'), out = []; const t0 = performance.now(); let y0 = scrollY;
      while (performance.now() - t0 < 1600) { await new Promise(r => requestAnimationFrame(r)); const r = bolla.getBoundingClientRect(); out.push({t: Math.round(performance.now() - t0), dy: scrollY - y0, yDoc: scrollY + r.top, scorre: bolla.classList.contains('scorre')}); y0 = scrollY; }
      return out;
    });
    const fine = await p.evaluate(() => {
      const bolla = document.querySelector('.domande-bolla'), r = bolla.getBoundingClientRect(), cs = getComputedStyle(bolla), barra = document.querySelector('.barra').getBoundingClientRect().bottom, testo = bolla.querySelector('.bolla-testo');
      return {alta: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom), barra: Math.round(barra), pos: cs.position, sticky: parseFloat(cs.top), scorre: bolla.classList.contains('scorre'), corpo: getComputedStyle(testo).fontSize, interlinea: getComputedStyle(testo).lineHeight,
        chiede: bolla.querySelector('.domande-bolla-chiede').textContent.replace(/[⁦-⁩]/g, ''), bottone: (b => { const q = b.getBoundingClientRect(); return {top: Math.round(q.top), bottom: Math.round(q.bottom)}; })(document.querySelector('.domanda-bottone[aria-expanded=true]'))};
    });
    const limite = tel ? Infinity : H - fine.sticky - aria, sta = fine.alta <= limite + 0.5;
    // 1) appiccicata solo se ci sta
    const giusta = tel ? fine.pos === 'relative' : (sta ? fine.pos === 'sticky' && !fine.scorre : fine.pos === 'static' && fine.scorre);
    // 2) nessun salto al clic: la bolla non si sposta nella pagina (salvo quando scorreva già e va accanto alla nuova domanda, o quando torna appiccicata)
    const cambia = prima.scorre !== fine.scorre || (prima.scorre && fine.scorre);
    let primoSalto = 0; for (let i = 1; i < camp.length; i++) primoSalto = Math.max(primoSalto, Math.abs(camp[i].yDoc - camp[i - 1].yDoc)); 
    // un salto della pagina è un solo fotogramma che porta più della metà dello scorrimento (e più di 120 px): uno scorrimento morbido lo spezza in molti, anche se in un motore parte forte
    const totale = camp.reduce((a, x) => a + Math.abs(x.dy), 0), massimo = Math.max(...camp.map(x => Math.abs(x.dy))), saltoPagina = massimo > 120 && massimo > 0.6 * totale ? massimo : 0, fotogrammiInMoto = camp.filter(x => Math.abs(x.dy) > 0).length;
    const saltoBolla = !tel && prima.scorre === false && fine.scorre === true ? Math.abs(camp.find(x => x.scorre).yDoc - prima.yDoc) : 0;
    // 3) lettura intera: si scorre a colpi di rotella finché si vede il fondo; la bolla che scorre si muove con la pagina, quella appiccicata resta
    const tops = [fine.top]; let visto = fine.bottom <= H - 2, passi = 0;
    while (!visto && passi < 14) { await p.mouse.wheel(0, 90); await p.waitForTimeout(260); passi++; const q = await p.evaluate(() => { const r = document.querySelector('.domande-bolla').getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom)}; }); tops.push(q.top); visto = q.bottom <= H - 2; }
    const sipuoLeggere = visto;
    if (foto && (id === 'd-chi' || id === 'd-frasi' || id === 'd-scrivere')) await p.screenshot({path: `${foto}/domanda-${id}-${motore}-${m}-letta.png`});   // dopo aver scorso fino al fondo della bolla
    const seMuove = tops.length > 1 && tops[0] - tops[tops.length - 1] > 40;
    const coerente = tel ? true : (fine.scorre ? (!sta ? seMuove || tops.length === 1 : true) : (fine.pos === 'sticky'));
    const riga = `${id.padEnd(14)} alta ${String(fine.alta).padStart(3)} px, spazio ${Number.isFinite(limite) ? Math.round(limite) : '-'} px: ${fine.pos}${fine.scorre ? ' (scorre)' : ''} · sale di ${tops[0] - tops[tops.length - 1]} px in ${passi} colpi · fondo ${sipuoLeggere ? 'letto' : 'NON letto'} · salto bolla ${Math.round(saltoBolla)} px, pagina ${Math.round(totale)} px in ${fotogrammiInMoto} fotogrammi (al più ${Math.round(massimo)} px) ${saltoPagina ? 'SALTO' : 'morbida'} · scritta ${fine.corpo}/${fine.interlinea}`;
    const ok = giusta && sipuoLeggere && coerente && saltoBolla <= 3 && saltoPagina <= 120 && /Quanto|chi|È|E se|Ha|Funziona|Parla|Fa i|Chi/i.test(fine.chiede);
    dice(ok, riga + (ok ? '' : ` [giusta ${giusta}, coerente ${coerente}]`));
    esiti.push({id, ...fine, limite, sta});
    if (foto && (id === 'd-chi' || id === 'd-frasi' || id === 'd-scrivere')) await p.screenshot({path: `${foto}/domanda-${id}-${motore}-${m}-fine.png`});
    // si torna in cima all'elenco per la prossima
    await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start', behavior: 'instant'})); await p.waitForTimeout(300);
  }
  const corpi = new Set(esiti.map(e => e.corpo + '/' + e.interlinea)); dice(corpi.size === 1, `la scritta è una sola per tutte le risposte: ${[...corpi].join(' ')}`);
  dice(errori.length === 0, `console pulita${errori.length ? ': ' + errori.join(' | ') : ''}`);
  await ctx.close();
}
console.log(`\n${male ? male + ' NO' : 'tutto ok'}`);
await b.close(); server.close(); process.exit(male ? 1 : 0);
