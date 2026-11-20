#!/usr/bin/env python3
"""Pagina di prova dei caratteri: per ogni scrittura, lo stesso testo (le frasi del sito nella sua lingua di prova e i nomi delle lingue) composto
con i file di PRIMA e con quelli di DOPO nella stessa pagina, in pesi diversi, per confrontarli pixel per pixel in ogni motore.
Uso: <venv>/bin/python -I prova-testo.py <caratteri prima> <caratteri dopo> <uscita>
Scrive <uscita>/index.html e copia i file in <uscita>/prima/ e <uscita>/dopo/. Una cartella nuova."""
import html, json, pathlib, shutil, sys
sys.path.insert(0, '/workspace/kalliope/tools')
from i18n import po  # noqa: E402

prima, dopo, uscita = map(pathlib.Path, sys.argv[1:4])
REPO = pathlib.Path('/workspace/kalliope')
PO = REPO / 'design/lavoro/2-lingue-aspetto/prova-lingue'
NOMI = {l: v['nomeElenco'] for l, v in json.loads((REPO / 'tools/data/cldr.json').read_text())['lingue'].items()}
# scrittura: (lingua, cartella, file, file dei nomi, pesi provati, dir)
SCRITTURE = {
    'arabo': ('ar', 'readex-pro', 'ReadexPro-wght', (160, 300, 400, 500, 700), 'rtl'),
    'urdu': ('ur', 'noto-nastaliq-urdu', 'NotoNastaliqUrdu-wght', (400, 500, 600, 700), 'rtl'),
    'devanagari': ('hi', 'noto-sans-devanagari', 'NotoSansDevanagari-wght', (100, 300, 400, 500, 600, 700, 900), 'ltr'),
    'bengali': ('bn', 'noto-sans-bengali', 'NotoSansBengali-wght', (100, 300, 400, 500, 600, 700, 900), 'ltr'),
    'greco': ('el', 'geologica', 'Geologica-wght', (100, 300, 400, 500, 600, 700, 900), 'ltr'),
    'bulgaro': ('bg', 'geologica', 'Geologica-wght', (100, 300, 400, 500, 600, 700, 900), 'ltr'),
}
if uscita.exists():
    sys.exit(f'{uscita} esiste già')
for nome, cart in (('prima', prima), ('dopo', dopo)):
    shutil.copytree(cart, uscita / nome, ignore=shutil.ignore_patterns('*.txt', '*.md'))
css, corpo = [], []
for scr, (lingua, cartella, file, pesi, verso) in SCRITTURE.items():
    cat = po.leggi((PO / f'{lingua}.po').read_text(encoding='utf-8'))
    frasi = [v.str[0] for v in cat.voci if v.str and v.str[0] and v.str[0] != v.id][:90]
    frasi.append(NOMI[lingua])
    testo = '\n'.join(html.escape(f) for f in frasi)
    for quando in ('prima', 'dopo'):
        fam = f'{scr}-{quando}'
        css.append(f'@font-face {{ font-family: "{fam}"; src: url("{quando}/{cartella}/{file}.woff2") format("woff2"); font-weight: 100 900; }}')
        css.append(f'@font-face {{ font-family: "{fam}-nomi"; src: url("{quando}/{cartella}/{file}-nomi.woff2") format("woff2"); font-weight: 100 900; }}')
    for peso in pesi:
        for quando in ('prima', 'dopo'):
            corpo.append(f'<section class="b" dir="{verso}" lang="{lingua}" data-scr="{scr}" data-peso="{peso}" data-quando="{quando}" style="font-family:\'{scr}-{quando}\',serif;font-weight:{peso}"><pre>{testo}</pre></section>')
        for quando in ('prima', 'dopo'):
            corpo.append(f'<section class="b n" dir="{verso}" lang="{lingua}" data-scr="{scr}-nomi" data-peso="{peso}" data-quando="{quando}" style="font-family:\'{scr}-{quando}-nomi\',serif;font-weight:{peso}"><pre>{html.escape(NOMI[lingua])} {html.escape(NOMI[lingua])}</pre></section>')
(uscita / 'index.html').write_text('<!doctype html><meta charset="utf-8"><title>prova dei caratteri</title><style>' + '\n'.join(css) +
    '\nbody{margin:0;background:#fff;color:#000}.b{width:900px;box-sizing:border-box;padding:8px}.b pre{margin:0;font:inherit;font-size:18px;line-height:2;white-space:pre-wrap}.n pre{font-size:48px}' +
    '</style><body>' + '\n'.join(corpo), encoding='utf-8')
print(f'{len(corpo)} blocchi, scritti in {uscita}')
