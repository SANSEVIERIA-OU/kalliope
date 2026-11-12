/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Il primo schermo, misurato: dove stanno il comando d'ascolto, lo stato e le azioni principali su computer e telefono (con e senza l'avviso del sistema).
// Uso: node design/strumenti/con-server.mjs DIR node design/strumenti/primo-schermo.mjs CARTELLA_FOTO [motore]
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const {avvia: avviaMotore} = await import('/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts/lib/comune.mjs');
const out = process.argv[2]; mkdirSync(out, {recursive: true});
const motore = process.argv[3] || 'chromium';
const base = process.env.ANTEPRIMA; const esiti = [];
const ok = (nome, c, d = '') => { esiti.push({nome, ok: !!c, dettaglio: d}); console.log((c ? 'OK   ' : 'FALLITO ') + nome + (d ? ' · ' + d : '')); };
const browser = motore === 'chromium' ? await pw.chromium.launch({headless: true}) : await avviaMotore(motore);
const UA_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36';
const UA_IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
async function apri(w, h, url, ua, plat) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, userAgent: ua, locale: 'it-IT', hasTouch: w < 900 && motore !== 'firefox'});
  const p = await ctx.newPage();
  if (plat) await p.addInitScript(x => Object.defineProperty(navigator, 'platform', {get: () => x}), plat);
  if (motore === 'webkit') await ctx.route(/^http:\/\/127\.0\.0\.1/, async r => { const res = await r.fetch(); const t = res.headers()['content-type'] || ''; if (/text\/html/.test(t)) { const b = (await res.text()).replace(/(<audio[^>]*?)\ssrc="[^"]*"/g, '$1'); await r.fulfill({response: res, body: b}); } else await r.fulfill({response: res}); });
  await p.goto(new URL(url, base).href, {waitUntil: 'networkidle'}); await p.waitForTimeout(400);
  return {ctx, p};
}
const quota = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), left: Math.round(r.left), right: Math.round(r.right)}; }, sel);
const casi = [
  ['computer 1440×900', 1440, 900, '', null, null],
  ['computer 1280×720', 1280, 720, '', null, null],
  ['telefono 390×844', 390, 844, undefined, null, null],
  ['telefono 390×844 con avviso (iPhone)', 390, 844, UA_IPHONE, 'iPhone', null],
  ['telefono 360×740 (informativo)', 360, 740, undefined, null, null],
];
for (const [nome, w, h, ua, plat] of casi) {
  const {ctx, p} = await apri(w, h, '', ua || undefined, plat);
  const btn = await quota(p, '.apertura .voce .btn'), stato = await quota(p, '.apertura__stato'), card = await quota(p, '.apertura__stato-card .stato'), scarica = await quota(p, '.apertura__azioni .btn--primario');
  const barra = await quota(p, '.apertura__ascolto .ascolto');
  const info = /informativo/.test(nome);
  if (info) console.log(`INFO ${nome}: comando d'ascolto a ${btn.top}-${btn.bottom} su ${h}`); else ok(`home ${nome}: il comando d'ascolto è intero nel primo schermo`, btn && btn.bottom <= h, JSON.stringify(btn));
  ok(`home ${nome}: la riga di stato sta nel primo schermo`, stato && stato.bottom <= h, JSON.stringify(stato));
  if (w >= 900 && h >= 900) ok(`home ${nome}: il cartellino comincia nel primo schermo`, card && card.top < h - 80, JSON.stringify(card));
  else if (w < 900) ok(`home ${nome}: «Scarica e installa» viene dopo il cartellino`, card && scarica && scarica.top > card.bottom - 2, `cartellino ${card && card.top}-${card && card.bottom}, scarica ${scarica && scarica.top}`);
  if (/avviso/.test(nome)) { const av = await quota(p, '[data-banner-sistema]'); ok(`home ${nome}: l'avviso sta su poche righe`, av && (av.bottom - av.top) <= 130 && av.left >= 0 && av.right <= w, JSON.stringify(av)); }
  await p.screenshot({path: `${out}/home-${w}x${h}${/avviso/.test(nome) ? '-avviso' : ''}.png`, clip: {x: 0, y: 0, width: w, height: h}});
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(`home ${nome}: nessuna sporgenza laterale`, sx <= 0, `${sx}`);
  await ctx.close();
}
for (const [nome, w, h] of [['computer 1440×900', 1440, 900], ['telefono 390×844', 390, 844]]) {
  const {ctx, p} = await apri(w, h, 'ascolta/');
  const btn = await quota(p, '.voce .btn');
  ok(`ascolta ${nome}: il primo comando d'ascolto è intero nel primo schermo`, btn && btn.bottom <= h, JSON.stringify(btn));
  await p.screenshot({path: `${out}/ascolta-${w}x${h}.png`, clip: {x: 0, y: 0, width: w, height: h}});
  await ctx.close();
}
{
  const {ctx, p} = await apri(390, 844, 'installa/');
  const d = await quota(p, '#passo-1 .btn--primario');
  ok('installa telefono 390×844: il primo gesto (scarica) sta entro 1,6 schermi', d && d.top < 844 * 1.6, JSON.stringify(d));
  const nav = await quota(p, '.percorso');
  ok('installa telefono 390×844: il percorso è una riga sola', nav && (nav.bottom - nav.top) <= 40, JSON.stringify(nav));
  await ctx.close();
}
writeFileSync(`${out}/esiti-primo-schermo-${motore}.json`, JSON.stringify(esiti, null, 1));
await browser.close();
process.exit(esiti.every(e => e.ok) ? 0 : 1);
