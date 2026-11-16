// I plurali nel browser: Testi.plurale() sceglie la forma giusta con Intl.PluralRules e i nomi che la costruzione ha scritto.
// Costruisce da sé un sito minimo con una pagina che ha messaggi al plurale, in lingue di prova con le loro forme CLDR.
// Uso: node prova-plurali.mjs
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const RADICE = '/workspace/kalliope';
const tmp = mkdtempSync(join(tmpdir(), 'lavoro-1-plurali-'));
const w = join(tmp, 'website'), s = join(tmp, 'design-system');
mkdirSync(w); mkdirSync(s);
writeFileSync(join(s, 'token.css'), ':root{ --verso: 1; }\n:root:dir(rtl){ --verso: -1; }');
copyFileSync(`${RADICE}/website/testi.js`, join(w, 'testi.js'));
copyFileSync(`${RADICE}/website/lingue.html`, join(w, 'lingue.html'));
copyFileSync(`${RADICE}/website/lingua.js`, join(w, 'lingua.js'));
mkdirSync(join(w, 'immagini')); copyFileSync(`${RADICE}/website/immagini/icona.svg`, join(w, 'immagini/icona.svg'));
writeFileSync(join(w, 'index.html'), `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title data-t="t">Prova</title>
<link rel="stylesheet" href="design-system/token.css"><script src="testi.js"></script></head>
<body>
<p id="statico" data-t="cose" data-t-plurale="{n} cose" data-t-n="1">{n} cosa</p>
<p id="statico5" data-t="cose5" data-t-plurale="{n} cose" data-t-n="5">{n} cosa</p>
<template id="testi-prova"><p data-t="voci" data-t-plurale="{n} voci in {luogo}">{n} voce in {luogo}</p></template>
</body></html>
`);
writeFileSync(join(w, 'lingue.html').replace('lingue.html', 'lingue.html'), readFileSync(join(w, 'lingue.html'), 'utf8'));
const crea = (codice) => execFileSync('python3', ['-I', `${RADICE}/tools/translations.py`, 'new', codice, '--website', w], {encoding: 'utf8'});
const py = String.raw`
import sys, pathlib
sys.path.insert(0, '/workspace/kalliope/tools')
from i18n import po
w = pathlib.Path(sys.argv[1]); codice = sys.argv[2]
f = w / 'lingue' / (codice + '.po')
cat = po.leggi(f.read_text())
for v in cat.voci:
    if v.id_plurale is None:
        v.str = [v.id]
    else:
        v.str = [f'[{codice}:{i}] ' + (v.id if i == 0 else v.id_plurale) for i in range(len(v.str))]
f.write_text(po.scrivi(cat))
`;
const lingue = ['en', 'pl', 'ar', 'zh', 'it'];
for (const c of lingue.filter(c => c !== 'it')) { crea(c); execFileSync('python3', ['-I', '-c', py, w, c]); }
const rilascio = join(tmp, 'rilascio.json');
writeFileSync(rilascio, JSON.stringify([{tag_name: 'v0.1', published_at: '2026-11-12T15:57:29Z', html_url: 'https://x/r', prerelease: false,
  assets: [['k-0.1-amd64.deb', 1e7], ['k-0.1-x86_64.rpm', 1e7], ['k-0.1-linux-x86_64.tar.gz', 1e7]].map(([name, size]) => ({name, size, browser_download_url: 'https://x/' + name, digest: 'sha256:aa'}))
    .concat([{name: 'kalliope-bin.PKGBUILD', browser_download_url: 'https://x/p'}, {name: 'SHA256SUMS', browser_download_url: 'https://x/s'}])}]));
const out = join(tmp, 'out');
console.log(execFileSync('python3', ['-I', `${RADICE}/tools/site.py`, '--out', out, '--release-json', rilascio, '--website', w, '--system', s], {encoding: 'utf8'}).trim());
const server = await servi(out, {porta: 8786});
const browser = await avvia('chromium');
const p = await browser.newPage();
let ok = 0, tot = 0;
const prova = (n, cond, d = '') => { tot++; if (cond) ok++; console.log(`${cond ? 'ok  ' : 'NO  '} ${n}${cond ? '' : ' — ' + d}`); };
// forme attese, per lingua e n: «[codice:indice] …»
const attese = {
  en: {1: 0, 2: 1, 0: 1, 5: 1}, zh: {1: 0, 2: 0, 5: 0},
  pl: {1: 0, 2: 1, 5: 2, 22: 1, 12: 2, 25: 2, 0: 2},
  ar: {0: 0, 1: 1, 2: 2, 3: 3, 5: 3, 10: 3, 11: 4, 99: 4, 100: 5, 102: 5},
};
for (const [lingua, tabella] of Object.entries(attese)) {
  await p.goto(`http://127.0.0.1:8786/${lingua}/`);
  const r = await p.evaluate(({tabella}) => {
    const out = {};
    for (const n of Object.keys(tabella)) out[n] = window.Testi.plurale('voci', +n, {luogo: 'X'});
    return {out, statico: document.getElementById('statico').textContent, statico5: document.getElementById('statico5').textContent,
      nomi: document.querySelector('#testi-prova').content.querySelector('[data-t=voci]').dataset.tNomi};
  }, {tabella});
  for (const [n, indice] of Object.entries(tabella)) prova(`${lingua}: ${n} → forma ${indice}`, r.out[n].startsWith(`[${lingua}:${indice}] `) && r.out[n].includes(` ${n} `) === false ? r.out[n].startsWith(`[${lingua}:${indice}] ${n} `) : r.out[n].startsWith(`[${lingua}:${indice}] `), r.out[n]);
  prova(`${lingua}: il {n} è il numero nella lingua e il segnaposto {luogo} è riempito`, !/\{/.test(Object.values(r.out).join('')), JSON.stringify(r.out));
  prova(`${lingua}: il plurale scritto dalla pagina (data-t-n) ha la forma del suo numero`, r.statico.startsWith(`[${lingua}:${tabella[1]}]`) && r.statico5.startsWith(`[${lingua}:${tabella[5]}]`), `${r.statico} | ${r.statico5}`);
}
await browser.close(); server.close();
console.log(`\n${ok} su ${tot} prove riuscite`);
process.exit(ok === tot ? 0 : 1);
