// La scelta della lingua nella barra: stati, tastiera, clic, scelta ricordata, ritorno e ricarica, senza JavaScript, movimento ridotto.
// Uso: node selettore-barra.mjs <sito costruito con le lingue di prova> [--motori chromium,firefox,webkit] [--porta 8848] [--foto <cartella>] [--lingue it,ar,ur]
import {mkdirSync} from 'node:fs';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia, pagina, tocco} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const sito = process.argv[2], foto = arg('--foto', '');
const SEZIONI = new Set(arg('--sezioni', 'tastiera,ricordo,telefono,basso,resize,senzajs,ridotto,scorrimento,ritmo').split(','));   // per dividere un giro lungo (Firefox è lento)
const vuole = s => SEZIONI.has(s);
const PAGINA = arg('--pagina', '');   // la pagina dentro la cartella della lingua: '' è la home, 'non-ancora/' la pagina interna
const PG = u => u.replace(/^(it|[a-z]{2})\/$/, `$1/${PAGINA}`);
if (foto) mkdirSync(foto, {recursive: true});
const server = await servi(sito, {porta: +arg('--porta', 8848), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
let rosse = 0;
// quante lingue ha pubblicato la costruzione: la pagina della scelta lo dice nel suo <html data-lingue>
const N = (await (await fetch(base)).text()).match(/<html[^>]*data-lingue="([^"]+)"/)?.[1].split(' ').length || 0;
console.log(`lingue pubblicate: ${N}`);
const dice = (ok, testo) => { if (!ok) rosse++; console.log(`  ${ok ? 'ok   ' : 'ROSSO'} ${testo}`); };
const RTL = new Set(['ar', 'ur']);

// ciò che ha il fuoco, come lo vede la persona: dov'è, se sta nello schermo, se qualcosa lo copre
const fuoco = p => p.evaluate(() => {
  const e = document.activeElement; if (!e || e === document.body) return {nulla: true};
  const r = e.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const sopra = document.elementFromPoint(cx, cy);
  return {tag: e.tagName.toLowerCase(), testo: (e.textContent || '').trim().slice(0, 24), href: e.getAttribute('href'), summary: e.tagName === 'SUMMARY',
    x: Math.round(cx), y: Math.round(cy), ya: Math.round(cy + (e.closest('#menu') ? e.closest('#menu').scrollTop : 0) + scrollY), l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height),
    inVista: r.width > 0 && r.height > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1,
    coperto: !(sopra && (sopra === e || e.contains(sopra))), inLista: !!e.closest('.lingue-elenco'), aperto: !!(e.closest('details') && e.closest('details').open)};
});
const aperta = p => p.evaluate(() => { const d = document.querySelector('details.lingua-scelta'); return d.open; });
const pannello = p => p.evaluate(() => { const u = document.querySelector('.lingua-scelta .lingue-elenco'), r = u.getBoundingClientRect(), s = getComputedStyle(u); return {l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), visibile: s.display !== 'none' && r.width > 0, W: innerWidth, H: innerHeight}; });
const nuova = async (b, motore, opz, url) => { const ctx = await b.newContext(opz); const errori = []; const p = pagina(await ctx.newPage(), errori); await p.goto(base + url, {waitUntil: 'load'}); if (opz.javaScriptEnabled !== false) await p.evaluate(() => document.fonts.ready); else await p.waitForTimeout(1000);   // senza JavaScript Firefox non risolve una promessa dentro evaluate
  await p.waitForTimeout(300); return {ctx, p, errori}; };

for (const motore of arg('--motori', 'chromium,firefox,webkit').split(',')) {
  console.log(motore);
  const b = await avvia(motore);
  for (const lingua of arg('--lingue', 'it,ar,ur').split(',')) {
    const rtl = RTL.has(lingua);
    // ---------- computer: tastiera ----------
    if (vuole('tastiera')) {
      const {ctx, p, errori} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT'}, PG(`${lingua}/`));
      await p.focus('.marchio');
      const ordine = [];
      for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); ordine.push(await fuoco(p)); if (ordine.at(-1).summary) break; }
      const fino = ordine.findIndex(x => x.summary);
      // la fila della barra: marchio e voci, nell'ordine in cui si leggono (da sinistra a destra, o da destra a sinistra)
      const xs = ordine.slice(0, fino + 1).map(x => x.x);
      const crescente = xs.every((x, i) => i === 0 || (rtl ? x < xs[i - 1] : x > xs[i - 1]));
      dice(fino >= 5 && crescente, `[${lingua}] 1440 · Tab: ${fino + 1} comandi fino alla scelta, nell'ordine in cui si vedono (${rtl ? 'da destra a sinistra' : 'da sinistra a destra'}): x ${xs.join(' → ')}`);
      const s = ordine[fino];
      dice(s && s.summary && s.inVista && !s.coperto, `[${lingua}] 1440 · la scelta ha il fuoco, sta nello schermo e niente la copre`);
      // si apre con Invio; il fuoco resta sul comando; Tab entra nell'elenco
      await p.keyboard.press('Enter'); await p.waitForTimeout(400);
      dice(await aperta(p), `[${lingua}] 1440 · Invio apre l'elenco`);
      const f0 = await fuoco(p);
      dice(f0.summary && f0.aperto, `[${lingua}] 1440 · il fuoco resta sul comando che l'ha aperto`);
      const pn = await pannello(p);
      dice(pn.visibile && pn.l >= 0 && pn.r <= pn.W && pn.t >= 0 && pn.b <= pn.H, `[${lingua}] 1440 · il pannello sta nello schermo: ${pn.l}–${pn.r} su ${pn.W}, ${pn.t}–${pn.b} su ${pn.H}`);
      // le 30 voci con Tab: nell'ordine in cui si leggono (riga per riga), ognuna nello schermo e non coperta
      const voci = [];
      for (let i = 0; i < N + 1; i++) { await p.keyboard.press('Tab'); const f = await fuoco(p); if (!f.inLista) { voci.push({fuori: f}); break; } voci.push(f); }
      const dentro = voci.filter(v => !v.fuori);
      const nelPannello = dentro.every(v => v.aperto);
      let ordineOk = true, mess = '';
      for (let i = 1; i < dentro.length; i++) { const a = dentro[i - 1], c = dentro[i]; const stessaRiga = Math.abs(c.ya - a.ya) < a.h / 2; const avanti = rtl ? c.x < a.x : c.x > a.x; if (!(stessaRiga ? avanti : c.ya > a.ya)) { ordineOk = false; mess = `${a.testo}→${c.testo}`; break; } }
      dice(dentro.length === N && ordineOk, `[${lingua}] 1440 · Tab percorre le ${dentro.length}/${N} voci riga per riga, nel verso della lettura${mess ? ' (storto a ' + mess + ')' : ''}`);
      dice(dentro.every(v => v.inVista && !v.coperto) && nelPannello, `[${lingua}] 1440 · ogni voce con il fuoco sta nello schermo e niente la copre (${dentro.filter(v => !v.inVista || v.coperto).map(v => v.testo).join(', ') || 'tutte'})`);
      // dopo l'ultima, il fuoco esce e l'elenco si chiude
      const ultimo = voci.at(-1);
      dice(!!ultimo.fuori && !(await aperta(p)), `[${lingua}] 1440 · dopo l'ultima voce il fuoco esce e l'elenco si chiude (fuoco su «${ultimo.fuori ? ultimo.fuori.testo || ultimo.fuori.tag : '—'}»)`);
      // Maiusc+Tab dall'elenco riporta al comando, e l'elenco resta aperto; Esc dentro l'elenco chiude e il fuoco torna al comando
      await p.focus('details.lingua-scelta > summary'); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await p.keyboard.press('Tab');
      await p.keyboard.press('Shift+Tab'); const sb = await fuoco(p);
      dice(sb.summary && await aperta(p), `[${lingua}] 1440 · Maiusc+Tab dalla prima voce torna al comando e l'elenco resta aperto`);
      await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      const fe = await fuoco(p);
      dice(!(await aperta(p)) && fe.summary, `[${lingua}] 1440 · Esc dalla seconda voce chiude l'elenco e il fuoco torna al comando`);
      await p.keyboard.press('Enter'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
      dice(!(await aperta(p)) && (await fuoco(p)).summary, `[${lingua}] 1440 · Esc dal comando aperto chiude l'elenco e il fuoco resta sul comando`);
      // clic: apre, clic fuori chiude, clic sul comando apre e richiude
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(300);
      const aperto1 = await aperta(p);
      if (foto && motore === 'chromium' && lingua !== 'ur') await p.screenshot({path: `${foto}/barra-aperta-${lingua}-1440.png`, clip: {x: 0, y: 0, width: 1440, height: 520}});
      await p.mouse.click(700, 700); await p.waitForTimeout(300);
      const chiusoFuori = !(await aperta(p));
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(200); await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(200);
      dice(aperto1 && chiusoFuori && !(await aperta(p)), `[${lingua}] 1440 · il clic apre, il clic fuori chiude, un secondo clic sul comando apre e richiude`);
      dice(!errori.length, `[${lingua}] 1440 · nessun errore di console (${errori.length})`);
      await ctx.close();
    }
    // ---------- computer: scelta ricordata, ritorno e ricarica ----------
    if (lingua === 'it' && vuole('ricordo')) {
      const {ctx, p, errori} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT'}, PG('it/'));
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(250);
      const dest = await p.evaluate(() => document.querySelector('.lingua-scelta .lingue-elenco a[data-lingua-codice="de"]').getAttribute('href'));
      await Promise.all([p.waitForURL(/\/de\//), p.click('.lingua-scelta .lingue-elenco a[data-lingua-codice="de"]')]);
      dice(new URL(p.url()).pathname === '/de/' && dest === '../de/', `[it] scelta del tedesco dalla barra: porta a ${new URL(p.url()).pathname} (href «${dest}»)`);
      dice(await p.evaluate(() => localStorage.getItem('kalliope.lingua')) === 'de', `[it] la scelta è ricordata (localStorage kalliope.lingua = de)`);
      // «/» porta alla lingua ricordata; «?lingue» mostra la scelta
      await p.goto(base, {waitUntil: 'load'}); await p.waitForURL(/\/de\//, {timeout: 3000}).catch(() => {});
      dice(new URL(p.url()).pathname === '/de/', `[it] «/» con la scelta ricordata porta a ${new URL(p.url()).pathname}`);
      await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(500);
      dice(new URL(p.url()).pathname === '/' && await p.evaluate(() => !!document.querySelector('.scelta-lingua')), `[it] «/?lingue» mostra la scelta anche con la scelta ricordata`);
      // ritorno: dalla pagina tedesca, Indietro torna dove si era (la scelta o la pagina italiana), e non resta bloccato
      await p.goto(base + 'it/', {waitUntil: 'load'});
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(250);
      await Promise.all([p.waitForURL(/\/ar\//), p.click('.lingua-scelta .lingue-elenco a[data-lingua-codice="ar"]')]);
      await p.goBack({waitUntil: 'load'}); await p.waitForTimeout(500);
      const dopoIndietro = new URL(p.url()).pathname;
      dice(dopoIndietro === '/it/', `[it] Indietro da /ar/ torna a ${dopoIndietro}`);
      dice(!(await aperta(p)), `[it] tornando indietro l'elenco è chiuso (il comando mostra «${await p.evaluate(() => document.querySelector('details.lingua-scelta > summary').textContent.trim())}»)`);
      // ricarica con l'elenco aperto: chiuso
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(250); const prima = await aperta(p);
      await p.reload({waitUntil: 'load'}); await p.waitForTimeout(400);
      dice(prima && !(await aperta(p)), `[it] ricaricando con l'elenco aperto la pagina riparte con l'elenco chiuso`);
      dice(!errori.length, `[it] nessun errore di console (${errori.length}${errori.length ? ': ' + errori[0] : ''})`);
      await ctx.close();
    }
    // ---------- telefono: la scelta dentro il menu ----------
    if (vuole('telefono')) {
      const {ctx, p, errori} = await nuova(b, motore, {viewport: {width: 390, height: 844}, locale: 'it-IT', ...tocco(motore, true)}, PG(`${lingua}/`));
      await p.click('.pulsante-menu'); await p.waitForTimeout(600);
      dice(await p.evaluate(() => document.querySelector('#menu').classList.contains('aperto')), `[${lingua}] 390 · il menu si apre`);
      // il fuoco entra nel menu sulla prima voce; Tab arriva alla scelta
      const passi = [];
      for (let i = 0; i < 8; i++) { const f = await fuoco(p); passi.push(f); if (f.summary) break; await p.keyboard.press('Tab'); }
      const ult = passi.at(-1);
      dice(ult && ult.summary && ult.inVista && !ult.coperto, `[${lingua}] 390 · Tab porta alla scelta dentro il menu (${passi.length} comandi), nello schermo e non coperta`);
      await p.keyboard.press('Enter'); await p.waitForTimeout(500);
      const pn = await pannello(p);
      dice(await aperta(p) && pn.visibile && pn.l >= 0 && pn.r <= pn.W, `[${lingua}] 390 · l'elenco si apre dentro il menu e sta nello schermo: ${pn.l}–${pn.r} su ${pn.W}`);
      // tutte le voci, riga per riga, ognuna nello schermo con il fuoco
      const voci = [];
      for (let i = 0; i < N + 1; i++) { await p.keyboard.press('Tab'); const f = await fuoco(p); if (!f.inLista) break; voci.push(f); }
      let ok = voci.length === N; for (let i = 1; i < voci.length; i++) { const a = voci[i - 1], c = voci[i]; const riga = Math.abs(c.ya - a.ya) < a.h / 2; if (!(riga ? (rtl ? c.x < a.x : c.x > a.x) : c.ya > a.ya)) ok = false; }
      dice(ok, `[${lingua}] 390 · Tab percorre ${voci.length}/${N} voci riga per riga nel verso della lettura`);
      dice(voci.every(v => v.inVista && !v.coperto), `[${lingua}] 390 · ogni voce con il fuoco sta nello schermo e niente la copre (${voci.filter(v => !v.inVista || v.coperto).map(v => v.testo + (v.coperto ? ' coperta' : ' fuori')).join(', ') || 'tutte'})`);
      if (foto && motore === 'chromium' && lingua !== 'ur') { await p.focus('details.lingua-scelta > summary'); await p.waitForTimeout(300); await p.screenshot({path: `${foto}/menu-elenco-${lingua}-390.png`}); }
      // Esc con il fuoco nell'elenco: chiude soltanto l'elenco, il menu resta; un secondo Esc chiude il menu e il fuoco va su «Menu»
      // (percorse tutte le voci l'ultimo Tab è uscito dal menu e lo ha chiuso: si riapre il menu e l'elenco, e il fuoco entra nell'elenco con Tab)
      if (!(await p.evaluate(() => document.querySelector('#menu').classList.contains('aperto')))) { await p.click('.pulsante-menu'); await p.waitForTimeout(500); }
      await p.focus('details.lingua-scelta > summary'); if (!(await aperta(p))) await p.keyboard.press('Enter'); await p.waitForTimeout(300); await p.keyboard.press('Tab'); await p.waitForTimeout(200);
      const prima = await fuoco(p);
      dice(prima.inLista && await aperta(p), `[${lingua}] 390 · riaperti menu ed elenco, il fuoco è nella prima voce`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(400);
      const dopo1 = await p.evaluate(() => ({elenco: document.querySelector('details.lingua-scelta').open, menu: document.querySelector('#menu').classList.contains('aperto'), fuoco: document.activeElement.tagName}));
      dice(!dopo1.elenco && dopo1.menu && dopo1.fuoco === 'SUMMARY', `[${lingua}] 390 · Esc dall'elenco chiude l'elenco, il menu resta e il fuoco va sul comando (elenco ${dopo1.elenco ? 'aperto' : 'chiuso'}, menu ${dopo1.menu ? 'aperto' : 'chiuso'}, fuoco ${dopo1.fuoco})`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(400);
      const dopo2 = await p.evaluate(() => ({menu: document.querySelector('#menu').classList.contains('aperto'), fuoco: document.activeElement.className}));
      dice(!dopo2.menu && /pulsante-menu/.test(dopo2.fuoco), `[${lingua}] 390 · un secondo Esc chiude il menu e il fuoco va su «Menu» (${dopo2.fuoco})`);
      // chiuso il menu con l'elenco aperto, riaprendo il menu l'elenco è chiuso
      await p.click('.pulsante-menu'); await p.waitForTimeout(500); await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(300);
      const apertoPrima = await aperta(p);
      await p.click('.pulsante-menu'); await p.waitForTimeout(500);   // chiude il menu con l'elenco aperto
      await p.click('.pulsante-menu'); await p.waitForTimeout(500);
      dice(apertoPrima && !(await aperta(p)), `[${lingua}] 390 · chiuso il menu con l'elenco aperto, riaprendo il menu l'elenco è chiuso`);
      dice(!errori.length, `[${lingua}] 390 · nessun errore di console (${errori.length}${errori.length ? ': ' + errori[0] : ''})`);
      await ctx.close();
    }
    // ---------- schermi bassi e stretti: l'elenco si apre dentro il menu che scorre, e le prime righe si vedono; con Tab ogni voce si raggiunge ----------
    if (lingua === 'it' && vuole('basso')) for (const [w, h] of [[844, 390], [326, 326], [360, 640], [390, 844], [750, 832], [959, 900]]) {
      const {ctx, p, errori} = await nuova(b, motore, {viewport: {width: w, height: h}, locale: 'it-IT', ...tocco(motore, true)}, PG('it/'));
      await p.click('.pulsante-menu'); await p.waitForTimeout(500);
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(600);
      const m = await p.evaluate(() => { const menu = document.querySelector('#menu'), mr = menu.getBoundingClientRect(), a = [...document.querySelectorAll('.lingua-scelta .lingue-elenco a')], s = document.querySelector('details.lingua-scelta > summary').getBoundingClientRect();
        const dentro = x => { const r = x.getBoundingClientRect(); return r.top >= mr.top - 1 && r.bottom <= mr.bottom + 1 && r.top >= 0 && r.bottom <= innerHeight; };
        return {quattro: a.slice(0, 4).every(dentro), n: a.length, comando: s.top >= mr.top - 1 && s.bottom <= mr.bottom + 1, scorreMenu: menu.scrollHeight > menu.clientHeight + 1, paginaY: scrollY, scrollTop: Math.round(menu.scrollTop)}; });
      dice(m.quattro && m.comando && m.paginaY === 0, `[basso ${w}×${h}] aperto l'elenco nel menu: il comando e le prime due righe (4 nomi di ${m.n}) stanno nello schermo e nel menu (il menu ${m.scorreMenu ? 'scorre, scostato di ' + m.scrollTop + ' px' : 'non scorre'}; la pagina resta ferma)`);
      // con Tab ogni voce, una dopo l'altra, sta nello schermo e nel menu e niente la copre
      await p.focus('details.lingua-scelta > summary');
      const voci = [];
      for (let i = 0; i < m.n + 1; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(40); const f = await fuoco(p); if (!f.inLista) break; voci.push(f); }
      const male = voci.filter(v => !v.inVista || v.coperto);
      dice(voci.length === m.n && male.length === 0, `[basso ${w}×${h}] Tab percorre ${voci.length}/${m.n} voci nel menu che scorre: ${male.length ? 'FUORI O COPERTE: ' + male.slice(0, 4).map(v => v.testo + (v.coperto ? ' coperta' : ' fuori')).join(', ') : 'ognuna nello schermo e non coperta'}`);
      if (foto && motore === 'chromium' && (w === 844 || w === 326)) { await p.keyboard.press('Shift+Tab'); await p.screenshot({path: `${foto}/elenco-menu-${w}x${h}.png`}); }
      dice(!errori.length, `[basso ${w}×${h}] nessun errore di console (${errori.length})`);
      await ctx.close();
    }
    // ---------- il giro con la tastiera a due ritmi: quello di una persona (più lento della più lunga entrata della barra) e uno rapido; devono dare lo stesso percorso ----------
    if (lingua === 'it' && vuole('ritmo')) {
      const giro = async (ritmo, w, h) => {
        const {ctx, p} = await nuova(b, motore, {viewport: {width: w, height: h}, locale: 'it-IT', ...(w < 500 ? tocco(motore, true) : {})}, PG('it/'));
        if (w < 500) { await p.click('.pulsante-menu'); await p.waitForTimeout(500); } else await p.focus('.marchio');
        const via = [];
        for (let i = 0; i < 14; i++) { await p.keyboard.press('Tab'); if (ritmo) await p.waitForTimeout(ritmo); const f = await fuoco(p); via.push(f.nulla ? '—' : `${f.tag}:${f.testo}`); if (f.summary) break; }
        await p.keyboard.press('Enter'); if (ritmo) await p.waitForTimeout(ritmo);
        const lista = [];
        for (let i = 0; i < 40; i++) { await p.keyboard.press('Tab'); if (ritmo) await p.waitForTimeout(Math.min(ritmo, 250)); const f = await fuoco(p); if (!f.inLista) break; lista.push(f.testo); }
        await ctx.close(); return {via: via.join(' › '), lista: lista.join(' › ')};
      };
      for (const [w, h] of [[1440, 900], [390, 844]]) {
        const lento = await giro(700, w, h), rapido = await giro(0, w, h);
        dice(lento.via === rapido.via && lento.lista === rapido.lista && lento.lista.split(' › ').length >= 10, `[ritmo ${w}×${h}] il giro con Tab a 700 ms per passo e a 0 ms dà lo stesso percorso: ${lento.via.split(' › ').length} comandi fino alla scelta, ${lento.lista.split(' › ').length} voci nell'elenco${lento.via === rapido.via && lento.lista === rapido.lista ? '' : ' — DIVERSO: ' + lento.via + ' / ' + rapido.via}`);
      }
    }
    // ---------- scorrimento veloce con l'elenco aperto: la barra cambia (compatta, l'azione entra) e l'elenco la segue ----------
    if (vuole('scorrimento')) {
      const {ctx, p, errori} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT'}, PG(`${lingua}/`));
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(300);
      await p.mouse.move(700, 600);
      for (let i = 0; i < 6; i++) await p.mouse.wheel(0, 700);   // quasi senza pause
      await p.waitForTimeout(1200);
      // l'azione si guarda soltanto dove c'è (in fondo alla pagina la barra non l'ha: la chiusura ha il suo comando)
      const r = await p.evaluate(() => { const s = document.querySelector('details.lingua-scelta > summary').getBoundingClientRect(), u = document.querySelector('.lingua-scelta .lingue-elenco').getBoundingClientRect(), az = document.querySelector('.barra-azione').getBoundingClientRect(), bar = document.querySelector('.barra').getBoundingClientRect();
        return {aperto: document.querySelector('details.lingua-scelta').open, y: scrollY, sInVista: s.top >= 0 && s.bottom <= innerHeight && s.left >= 0 && s.right <= innerWidth, uInVista: u.top >= 0 && u.bottom <= innerHeight && u.left >= 0 && u.right <= innerWidth, uSottoBarra: u.top >= bar.bottom - 8, sopraAzione: document.querySelector('.barra').classList.contains('con-azione') && !(s.right <= az.left || s.left >= az.right || s.bottom <= az.top || s.top >= az.bottom), compatta: document.querySelector('.barra').classList.contains('compatta') || getComputedStyle(document.querySelector('.barra')).position}; });
      dice(r.y > 1000 && r.sInVista && r.uInVista && !r.sopraAzione, `[${lingua}] 1440 · scorrendo in fretta (${r.y} px) con l'elenco aperto: il comando e l'elenco restano nello schermo e il comando non finisce sull'azione della barra (aperto ${r.aperto})`);
      if (foto && motore === 'chromium' && lingua === 'it') await p.screenshot({path: `${foto}/scorrimento-veloce-it-1440.png`, clip: {x: 0, y: 0, width: 1440, height: 420}});
      dice(!errori.length, `[${lingua}] 1440 · scorrimento: nessun errore di console (${errori.length})`);
      await ctx.close();
    }
    // ---------- lo schermo che cambia forma con l'elenco aperto ----------
    if (lingua === 'it' && vuole('resize')) {
      const {ctx, p} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT'}, PG('it/'));
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(300);
      await p.setViewportSize({width: 390, height: 844}); await p.waitForTimeout(500);
      const dopoResize = await aperta(p);
      await p.click('.pulsante-menu'); await p.waitForTimeout(600);
      dice(!(await aperta(p)), `[it] aperto l'elenco a 1440 e ridotto lo schermo a 390, aprendo il menu l'elenco è chiuso (dopo il ridimensionamento era ${dopoResize ? 'ancora aperto' : 'chiuso'})`);
      await p.setViewportSize({width: 844, height: 390}); await p.waitForTimeout(500);
      dice(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `[it] girando il telefono (844×390) nessuno scorrimento di lato`);
      await ctx.close();
    }
  }
  // ---------- senza JavaScript ----------
  if (vuole('senzajs')) {
    const {ctx, p} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT', javaScriptEnabled: false}, PG('it/'));
    const s = 'details.lingua-scelta > summary';
    const visibile = await p.isVisible(s);
    await p.click(s); await p.waitForTimeout(300);
    const a1 = await aperta(p), pn = await pannello(p);
    await p.click(s); await p.waitForTimeout(200); const a2 = await aperta(p);
    await p.focus(s); await p.keyboard.press('Enter'); await p.waitForTimeout(250); const a3 = await aperta(p);
    await p.keyboard.press('Space'); await p.waitForTimeout(250); const a4 = await aperta(p);
    dice(visibile && a1 && !a2 && a3 && !a4, `[senza JS 1440] la scelta nella barra si apre e si chiude con il clic, con Invio e con Spazio (${[a1, a2, a3, a4].join('/')})`);
    dice(pn.visibile && pn.l >= 0 && pn.r <= pn.W, `[senza JS 1440] l'elenco aperto sta nello schermo: ${pn.l}–${pn.r} su ${pn.W}`);
    if (foto && motore === 'chromium') { await p.click(s); await p.waitForTimeout(300); await p.screenshot({path: `${foto}/senza-js-aperto-1440.png`, clip: {x: 0, y: 0, width: 1440, height: 420}}); }
    const voci = await p.evaluate(() => [...document.querySelectorAll('.lingua-scelta .lingue-elenco a')].map(a => [a.getAttribute('href'), a.getAttribute('lang'), a.getAttribute('hreflang')]));
    dice(voci.length === N && voci.every(([h, l, hl]) => h && l && hl), `[senza JS 1440] ${voci.length}/${N} collegamenti veri nella barra, ognuno con href, lang e hreflang`);
    await ctx.close();
  }
  if (vuole('senzajs')) {
    // al telefono, senza script, il menu non si apre (si apre con lo script): le lingue sono nell'elenco del piede, a cui «Menu» porta
    const {ctx, p} = await nuova(b, motore, {viewport: {width: 390, height: 844}, locale: 'it-IT', javaScriptEnabled: false, ...tocco(motore, true)}, PG('it/'));
    const menuVisibile = await p.isVisible('#menu');
    await p.click('.pulsante-menu'); await p.waitForTimeout(600);
    const m = await p.evaluate(() => { const nav = document.querySelector('nav.lingue'), r = nav.getBoundingClientRect(), a = [...nav.querySelectorAll('a')].map(x => x.getBoundingClientRect()); return {voci: a.length, dentro: a.every(x => x.left >= 0 && x.right <= innerWidth), alte: a.every(x => x.height >= 24), nav: [Math.round(r.top), Math.round(r.bottom)], H: innerHeight, scrollX: document.documentElement.scrollWidth > innerWidth, lingue: [...nav.querySelectorAll('a')].every(x => x.getAttribute('lang') && x.getAttribute('hreflang') && x.getAttribute('href'))}; });
    dice(!menuVisibile && m.voci === N && m.dentro && m.alte && m.lingue && !m.scrollX, `[senza JS 390] il menu non c'è e «Menu» porta all'elenco del piede: ${m.voci}/${N} lingue tutte nello schermo, tutte con lang, hreflang e href, nessuno scorrimento di lato`);
    await ctx.close();
  }
  // ---------- movimento ridotto ----------
  for (const [ridotto, nome] of vuole('ridotto') ? [[true, 'movimento ridotto'], [false, 'movimento normale']] : []) {
    const {ctx, p} = await nuova(b, motore, {viewport: {width: 1440, height: 900}, locale: 'it-IT', reducedMotion: ridotto ? 'reduce' : 'no-preference'}, PG('it/'));
    await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(60);
    const m = await p.evaluate(() => { const u = document.querySelector('.lingua-scelta .lingue-elenco'); return {animazioni: u.getAnimations().length, opacita: +getComputedStyle(u).opacity}; });
    await p.waitForTimeout(700);
    const fin = await p.evaluate(() => { const u = document.querySelector('.lingua-scelta .lingue-elenco'); return {animazioni: u.getAnimations().length, opacita: +getComputedStyle(u).opacity, aperto: document.querySelector('details.lingua-scelta').open}; });
    dice(fin.aperto && fin.opacita === 1 && (ridotto ? m.animazioni === 0 && m.opacita === 1 : m.animazioni > 0), `[${nome}] l'elenco si apre ${ridotto ? 'subito, senza animazione' : 'con l\'animazione'} (a 60 ms: ${m.animazioni} animazioni, opacità ${m.opacita}; poi ${fin.opacita})`);
    await ctx.close();
  }
  await b.close();
}
server.close();
console.log(rosse ? `${rosse} ROSSE` : 'tutto ok');
process.exit(rosse ? 1 : 0);
