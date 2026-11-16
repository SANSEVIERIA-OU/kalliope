#!/usr/bin/env python3 -I
"""Converte le proprietà fisiche sinistra/destra dei fogli del design system in proprietà logiche.
Uso: converti-logico.py <cartella design-system>
Non tocca ciò che sta nell'elenco FISICHE (disegni che non si specchiano, centrature in coppia con una traslazione):
a quelle righe aggiunge il commento «fisico: …», che il controllo tools/css_logico.py accetta.
"""
import re, sys, pathlib

root = pathlib.Path(sys.argv[1])
TRIANGOLO = 'disegno della freccia di riproduzione (▶): non si specchia'
LUCE = 'posizione in coppia con translate(-50%, -50%): la sposta insieme l\'incarico 2'
FISICHE = {
    ('componenti/ascolto.css', 43): TRIANGOLO, ('componenti/ascolto.css', 45): TRIANGOLO, ('componenti/ascolto.css', 50): TRIANGOLO,
    ('componenti/ascolto.css', 136): TRIANGOLO,
    ('componenti/pulsanti.css', 56): TRIANGOLO, ('componenti/pulsanti.css', 58): TRIANGOLO, ('componenti/pulsanti.css', 77): TRIANGOLO,
    ('componenti/filo.css', 33): TRIANGOLO, ('componenti/filo.css', 35): TRIANGOLO,
    ('componenti/filo.css', 106): LUCE, ('componenti/strada.css', 7): LUCE,
    ('componenti/tratti.css', 9): LUCE, ('componenti/tratti.css', 22): LUCE, ('componenti/tratti.css', 25): LUCE, ('componenti/tratti.css', 28): LUCE,
    ('componenti/tratti.css', 60): LUCE, ('componenti/tratti.css', 167): LUCE,
    ('componenti/riunione.css', 90): 'centratura con translate(-50%, -50%): simmetrica, giusta in entrambe le direzioni',
}
MAPPA = {
    'margin-left': 'margin-inline-start', 'margin-right': 'margin-inline-end',
    'padding-left': 'padding-inline-start', 'padding-right': 'padding-inline-end',
    'border-left-color': 'border-inline-start-color', 'border-right-color': 'border-inline-end-color',
    'border-left-width': 'border-inline-start-width', 'border-right-width': 'border-inline-end-width',
    'border-left-style': 'border-inline-start-style', 'border-right-style': 'border-inline-end-style',
    'border-left': 'border-inline-start', 'border-right': 'border-inline-end',
    'left': 'inset-inline-start', 'right': 'inset-inline-end',
}
DECL = re.compile(r'(?P<pre>(?:^|[{;])\s*)(?P<p>margin-left|margin-right|padding-left|padding-right|border-left-color|border-right-color|border-left-width|border-right-width|border-left-style|border-right-style|border-left|border-right|left|right)(?P<post>\s*:)', re.M)
TA = re.compile(r'(text-align\s*:\s*)(left|right)\b')
cambi = 0
for f in sorted(list(root.glob('*.css')) + list((root / 'componenti').glob('*.css')) + list((root / 'catalogo').glob('*.css'))):
    if f.name == 'token.css': continue
    rel = str(f.relative_to(root))
    righe = f.read_text().split('\n')
    for i, riga in enumerate(righe, 1):
        if riga.lstrip().startswith(('/*', '*')) and '{' not in riga: continue
        nuova = riga
        motivo = FISICHE.get((rel, i))
        if motivo:
            if '/* fisico' not in nuova:
                nuova = nuova.rstrip() + f' /* fisico: {motivo} */'
        else:
            nuova = DECL.sub(lambda m: m.group('pre') + MAPPA[m.group('p')] + m.group('post'), nuova)
            nuova = TA.sub(lambda m: m.group(1) + ('start' if m.group(2) == 'left' else 'end'), nuova)
        if nuova != riga: cambi += 1; righe[i - 1] = nuova
    f.write_text('\n'.join(righe))
print('righe cambiate:', cambi)
