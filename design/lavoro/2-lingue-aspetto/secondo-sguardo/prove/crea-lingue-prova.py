#!/usr/bin/env python3 -I
"""Prepara una copia di website/ e design-system/ per le prove, con cataloghi di lingue vere fatti dal catalogo italiano
(testo passato da en-XA o ar-XB): servono a provare i percorsi di una lingua vera (elenco, hreflang, direzione, plurali,
cifre CLDR) senza contenuti. Mai pubblicati.
Uso: crea-lingue-prova.py <cartella di uscita> <lingua> [<lingua> …]"""
import pathlib, shutil, sys
RADICE = pathlib.Path('/tmp/lavoro-2s-radice')
sys.path.insert(0, str(RADICE / 'tools'))
from i18n import catalogo, cldr, po, pseudo
out = pathlib.Path(sys.argv[1]); codici = sys.argv[2:]
if out.exists():
    sys.exit(f"{out} esiste già: usa una cartella nuova")
shutil.copytree(RADICE / 'website', out / 'website')
shutil.copytree(RADICE / 'design-system', out / 'design-system', ignore=shutil.ignore_patterns('*.md'))
pagine, tutti, errori = catalogo.raccogli(out / 'website')
assert not errori, errori
mod = catalogo.modello(pagine, tutti)
for c in codici:
    cat = catalogo.unisci(None, mod, c)
    f = pseudo.ar_xb if cldr.info(c)['direzione'] == 'rtl' else pseudo.en_xa
    for v in cat.voci:
        if v.id_plurale is None:
            v.str = [f(v.id)]
        else:
            v.str = [f(v.id if i == 0 else v.id_plurale) for i in range(len(v.str))]
    (out / 'website' / 'lingue' / f'{c}.po').write_text(po.scrivi(cat), encoding='utf-8')
print(f"{out}: lingue di prova {', '.join(codici)}")
