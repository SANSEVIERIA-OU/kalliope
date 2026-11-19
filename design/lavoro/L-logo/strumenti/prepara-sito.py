"""Prepara una copia del sito con il marchio di una direzione e la costruisce.

Copia /tmp/l1-base/website e design-system in una cartella nuova /tmp/l1-<n>-copia-<k> (non cancella niente), e lì:
- aggiunge in fondo a design-system/token.css il blocco dei token della direzione;
- mette design-system/componenti/marchio.css (il componente della direzione) e lo collega dopo barra.css;
- mette il disegno della barra (modelli/barra.svg) al posto del vecchio dentro <a class="marchio"> nelle pagine nuove;
- mette il disegno per le grandezze piccole (piccola.svg, generato dai token) al posto dell'icona della scheda;
- nella home collega marchio.js prima di scena.js e aggiunge a scena.js le chiamate al marchio (scrive, inizia, env, parole, onda, finisce).
Poi costruisce con tools/site.py in /tmp/l1-sito-<n>-<k> (e con --pseudo in /tmp/l1-sito-<n>-<k>-pseudo).
Uso: python3 -I prepara-sito.py <cartella della direzione>
"""
import pathlib, re, shutil, subprocess, sys

REPO = pathlib.Path('/workspace/kalliope')
BASE = pathlib.Path('/tmp/l1-base')
d = pathlib.Path(sys.argv[1]).resolve()
n = d.name.split('-')[0]
k = 1
while pathlib.Path(f'/tmp/l1-{n}-copia-{k}').exists():
    k += 1
copia = pathlib.Path(f'/tmp/l1-{n}-copia-{k}')
shutil.copytree(BASE / 'website', copia / 'website')
shutil.copytree(BASE / 'design-system', copia / 'design-system')
w, s = copia / 'website', copia / 'design-system'

# token e componente
tok = (d / 'token.css').read_text()
with open(s / 'token.css', 'a') as f:
    f.write(f'\n\n/* ===== Il marchio · prova L-1, {d.name} (copia: non è il sistema vero) ===== */\n{tok}')
shutil.copy(d / 'marchio.css', s / 'componenti' / 'marchio.css')

svg = re.sub(r'<!--.*?-->\s*', '', (d / 'modelli' / 'barra.svg').read_text(), flags=re.S).strip()
PAGINE = ['index.html', 'non-ancora/index.html', 'stato/index.html', 'lingue.html']
for p in PAGINE:
    f = w / p
    t = f.read_text()
    t, c1 = re.subn(r'(<a class="marchio"[^>]*>\s*)<svg.*?</svg>', lambda m: m.group(1) + svg, t, count=1, flags=re.S)
    t, c2 = re.subn(r'(<link rel="stylesheet" href="((?:\.\./)*)design-system/componenti/barra.css">)',
                    lambda m: m.group(1) + f'\n<link rel="stylesheet" href="{m.group(2)}design-system/componenti/marchio.css">', t, count=1)
    if p == 'index.html':
        t, c3 = re.subn(r'(<script src="scena.js"></script>)', r'<script src="marchio.js"></script>\n\1', t, count=1)
        assert c3 == 1, 'scena.js non trovato'
    assert c1 == 1 and c2 == 1, f'{p}: marchio {c1}, foglio {c2}'
    f.write_text(t)
    print('pagina', p)

shutil.copy(d / 'marchio.js', w / 'marchio.js')
icona = (d / ('piccola.svg' if (d / 'piccola.svg').exists() else 'disegno.svg')).read_text()   # la scheda del browser: 16 e 32 px
(w / 'immagini' / 'icona.svg').write_text('<!-- SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 -->\n' + icona)

# le chiamate al marchio in scena.js
sc = w / 'scena.js'
t = sc.read_text()
PEZZI = [
    ("  'use strict';\n", "  'use strict';\n  const marchio = (nome, ...a) => { const M = window.Marchio; if (M && M[nome]) M[nome](...a); };   // prova L-1: il marchio della barra segue la voce\n"),
    ("    if (!audio) palco.inizia(n);", "    if (!audio) { palco.inizia(n); marchio('inizia'); }"),
    ("      if (!discorso.iniziato) { discorso.iniziato = true; palco.inizia(n); }", "      if (!discorso.iniziato) { discorso.iniziato = true; palco.inizia(n); marchio('inizia'); }"),
    ("    d.palco.finisce(d.n, posa);", "    d.palco.finisce(d.n, posa); marchio('finisce');"),
    ("    d.palco.env(envA(d.file, t), t, d.file);", "    d.palco.env(envA(d.file, t), t, d.file);\n    marchio('env', envA(d.file, t)); marchio('parole', d.parole.filter(p => !p.classList.contains('attesa')).length / Math.max(1, d.parole.length));"),
    ("      if (!ridotto && t - d.picchi[d.prossimo] < 0.3) { d.palco.onde.push({t: ora(), toccati: new Set()}); d.palco.sporca = true; }",
     "      if (!ridotto && t - d.picchi[d.prossimo] < 0.3) { d.palco.onde.push({t: ora(), toccati: new Set()}); d.palco.sporca = true; marchio('onda'); }"),
    ("      eroe.campo.classList.add('fuoco');\n", "      eroe.campo.classList.add('fuoco'); marchio('scrive', true);\n"),
    ("    } else if (t >= INVIO && arrivo === true) {\n      scrivi(0);", "    } else if (t >= INVIO && arrivo === true) {\n      scrivi(0); marchio('scrive', false);"),
    ("  function fermaArrivo() { if (arrivo) { arrivo = false; scrivi(0);", "  function fermaArrivo() { if (arrivo) { arrivo = false; scrivi(0); marchio('scrive', false);"),
]
for vecchio, nuovo in PEZZI:
    assert t.count(vecchio) == 1, f'scena.js: {vecchio!r} trovato {t.count(vecchio)} volte'
    t = t.replace(vecchio, nuovo)
sc.write_text(t)

rel = '/tmp/lavoro-3ab-releases.json'
for extra, suf in (([], ''), (['--pseudo'], '-pseudo')):
    out = f'/tmp/l1-sito-{n}-{k}{suf}'
    r = subprocess.run([sys.executable, '-I', 'tools/site.py', '--website', str(w), '--system', str(s), '--out', out, '--release-json', rel, *extra],
                       cwd=REPO, capture_output=True, text=True)
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else '', r.stderr.strip().splitlines()[-1:] if r.returncode else '')
    if r.returncode:
        print(r.stderr); raise SystemExit(r.returncode)
    print('costruito', out)
