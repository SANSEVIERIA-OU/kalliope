"""Scrive i file del marchio di ogni direzione dai suoi modelli e dal suo file dei token.

I modelli (direzioni/<n>/modelli/*.svg) usano i colori per nome, var(--…), e si aprono nel browser con token.css. I file
che non possono leggere un foglio di stile (l'icona della scheda, l'icona del programma) hanno bisogno dei valori: questo
programma li scrive in direzioni/<n>/<nome>.svg. Nessun colore si scrive a mano nei file generati.
Uso: python3 -I genera.py [cartella delle direzioni]
"""
import re, sys, pathlib

BASE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent / 'direzioni')
TOKEN = re.compile(r'(--[a-z0-9-]+)\s*:\s*([^;]+);')

def token(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    return {k: v.strip() for k, v in TOKEN.findall(css)}

def risolvi(testo, valori, origine):
    def sost(m):
        nome = m.group(1)
        if nome not in valori:
            raise SystemExit(f'{origine}: il token {nome} non è in token.css')
        return valori[nome]
    return re.sub(r'var\((--[a-z0-9-]+)\)', sost, testo)

for d in sorted(p for p in BASE.iterdir() if p.is_dir() and (p / 'token.css').exists()):
    valori = token((d / 'token.css').read_text())
    for m in sorted((d / 'modelli').glob('*.svg')):
        if m.name == 'barra.svg':
            continue   # il disegno della barra resta con i nomi: lo colora marchio.css
        testo = m.read_text()
        testo = re.sub(r'<\?xml-stylesheet[^>]*\?>\n?', '', testo)
        testo = re.sub(r'<!--(.*?)-->', lambda c: f'<!--{c.group(1)}\n     File generato da strumenti/genera.py da modelli/{m.name} e token.css: non si modifica a mano. -->', testo, count=1, flags=re.S)
        uscita = risolvi(testo, valori, m)
        if 'var(' in uscita:
            raise SystemExit(f'{m}: resta un var()')
        (d / m.name).write_text(uscita)
        print('scritto', (d / m.name).relative_to(BASE))
