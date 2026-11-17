// Il nome e il ruolo che il browser dà alla scelta della lingua, e la lingua di ogni voce. Chromium: l'albero di accessibilità vero (CDP); Firefox e WebKit:
// l'istantanea di Playwright (ruolo e nome calcolati da Playwright, non dal browser). Uso: node selettore-a11y.mjs <sito costruito con le lingue di prova> [--porta 8852]
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const server = await servi(process.argv[2], {porta: +arg('--porta', 8852), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
let rosse = 0;
const dice = (ok, testo) => { if (!ok) rosse++; console.log(`  ${ok ? 'ok   ' : 'ROSSO'} ${testo}`); };
const NOMI = {it: 'Italiano', ar: 'العربية', ur: 'اردو', zh: '中文', de: 'Deutsch'};
// il nome che il comando deve avere: il testo del suo title, due punti e la lingua di adesso
const ATTESO = {it: 'Cambia lingua: Italiano', ar: 'تغيير اللغة: العربية', zh: '切换语言: 中文'};
for (const motore of ['chromium', 'firefox', 'webkit']) {
  console.log(motore);
  const b = await avvia(motore);
  for (const lingua of ['it', 'ar', 'zh']) {
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}}); const p = await ctx.newPage();
    await p.goto(`${base}${lingua}/`, {waitUntil: 'load'}); await p.waitForTimeout(500);
    const dom = await p.evaluate(() => { const s = document.querySelector('details.lingua-scelta > summary'), a = [...document.querySelectorAll('details.lingua-scelta .lingue-elenco a')];
      return {nome: s.getAttribute('aria-label'), title: s.getAttribute('title'), lang: s.querySelector('span').lang, htmlLang: document.documentElement.lang, htmlDir: document.documentElement.dir,
        voci: a.length, senzaLang: a.filter(x => !x.lang || !x.getAttribute('hreflang')).length, corrente: a.filter(x => x.getAttribute('aria-current')).map(x => x.textContent.trim()), duplicati: new Set(a.map(x => x.textContent.trim())).size !== a.length,
        paesi: a.map(x => x.lang + ':' + x.textContent.trim()).slice(0, 5)}; });
    dice(dom.nome === ATTESO[lingua], `[${lingua}] il comando ha per nome «${dom.nome}» (atteso «${ATTESO[lingua]}»); il nome visibile «${NOMI[lingua]}» ci sta dentro`);
    dice(dom.lang === dom.htmlLang && dom.htmlLang.startsWith(lingua) && dom.corrente.join() === NOMI[lingua], `[${lingua}] la lingua di adesso ha lang ${dom.lang} (pagina ${dom.htmlLang}, dir ${dom.htmlDir}) ed è la sola con aria-current: «${dom.corrente.join()}»`);
    dice(dom.senzaLang === 0 && !dom.duplicati, `[${lingua}] ${dom.voci} voci, ognuna con lang e hreflang, nessun nome ripetuto; prime: ${dom.paesi.join(' · ')}`);
    if (motore === 'chromium') {
      const cdp = await ctx.newCDPSession(p); await cdp.send('Accessibility.enable');
      const {nodes} = await cdp.send('Accessibility.getFullAXTree');
      const val = x => (x && x.value) ?? '';   // un AXValue ha {type, value}
      const per = r => nodes.filter(n => val(n.role) === r);
      const sm = nodes.find(n => val(n.name) === ATTESO[lingua]);
      const stato = sm ? Object.fromEntries((sm.properties || []).map(x => [x.name, x.value.value])) : {};
      dice(!!sm && /DisclosureTriangle|button/i.test(val(sm.role)) && stato.expanded === false, `[${lingua}] albero di Chromium: ruolo «${sm ? val(sm.role) : '—'}», nome «${sm ? val(sm.name) : '—'}», espanso ${stato.expanded}, descrizione «${sm ? val(sm.description) : ''}»`);
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(400);
      const dopo = (await cdp.send('Accessibility.getFullAXTree')).nodes;
      const sm2 = dopo.find(n => val(n.name) === ATTESO[lingua]); const st2 = sm2 ? Object.fromEntries((sm2.properties || []).map(x => [x.name, x.value.value])) : {};
      const link = dopo.filter(n => val(n.role) === 'link' && Object.values(NOMI).includes(val(n.name)) );
      dice(st2.expanded === true && link.length >= 4, `[${lingua}] aperto: espanso ${st2.expanded}; nell'albero i collegamenti delle lingue hanno per nome il nome della lingua (${link.map(n => val(n.name)).slice(0, 5).join(' · ')}…)`);
    } else {
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(400);
      const snap = await p.locator('details.lingua-scelta').ariaSnapshot();
      const links = (snap.match(/- link /g) || []).length;
      dice(links === dom.voci && snap.includes(NOMI[lingua]), `[${lingua}] istantanea di Playwright, elenco aperto: ${links}/${dom.voci} collegamenti con il nome della lingua (primo: ${(snap.match(/- link "?[^\n]+/) || [''])[0].trim().slice(0, 40)})`);
    }
    await ctx.close();
  }
  // la pagina della scelta
  const ctx = await b.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'}); const p = await ctx.newPage();
  await p.goto(base + '?lingue', {waitUntil: 'load'}); await p.waitForTimeout(500);
  const sc = await p.evaluate(() => { const a = [...document.querySelectorAll('.lingue-in-bolla a')]; return {main: !!document.querySelector('main'), h1: document.querySelector('h1')?.textContent, nav: document.querySelector('nav')?.getAttribute('aria-label'), navLang: document.documentElement.lang, voci: a.length, senza: a.filter(x => !x.lang || !x.getAttribute('hreflang')).length, decor: [...document.querySelectorAll('.tavolo-cornice, .luce')].every(x => x.getAttribute('aria-hidden') === 'true'), corrente: a.filter(x => x.getAttribute('aria-current')).length}; });
  dice(sc.main && sc.h1 === 'Kalliope' && sc.nav && sc.senza === 0 && sc.decor, `[scelta] una regione principale, titolo «${sc.h1}», navigazione «${sc.nav}» (${sc.navLang}), ${sc.voci} nomi tutti con lang e hreflang, la riunione decorativa nascosta ai lettori (aria-hidden)`);
  await ctx.close(); await b.close();
}
server.close();
console.log(rosse ? `${rosse} ROSSE` : 'tutto ok');
process.exit(rosse ? 1 : 0);
