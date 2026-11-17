#!/usr/bin/env python3
"""Scrive i cataloghi di prova (SOLO PER LE PROVE, mai in website/lingue/) dalle traduzioni di testi_europa.py e testi_mondo.py,
sul modello delle pagine di adesso. Uso: python3 -I crea_cataloghi.py [cartella website]   (predefinita: quella del repository)
Una chiave del modello senza traduzione, o una traduzione senza chiave, si dice e ferma lo script."""
import pathlib, sys
QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]
sys.path.insert(0, str(RADICE / 'tools')); sys.path.insert(0, str(QUI))
from i18n import catalogo, po  # noqa: E402
import testi_europa, testi_mondo  # noqa: E402
sito = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else RADICE / 'website'
pagine, tutti, errori = catalogo.raccogli(sito)
assert not errori, errori
mod = catalogo.modello(pagine, tutti)
LINGUE = {'de': testi_europa.DE, 'fi': testi_europa.FI, 'el': testi_europa.EL, 'bg': testi_europa.BG,
          'ar': testi_mondo.AR, 'ur': testi_mondo.UR, 'hi': testi_mondo.HI, 'bn': testi_mondo.BN, 'zh': testi_mondo.ZH}
male = []
altre = {}
for codice, testi in LINGUE.items():
    cat = catalogo.unisci(None, mod, codice)
    cat.intestazione_commenti = [f'Kalliope · website texts in {codice}. SOLO PER LE PROVE (incarico 2, 16/11/2026): traduzione onesta ma non rivista,',
                                 'fatta per provare l\'aspetto delle scritture. Non va in website/lingue/ e non si pubblica.']
    chiavi = {v.ctx for v in cat.voci}
    for v in cat.voci:
        if v.ctx not in testi:
            if any(r.split(':')[0] != 'index.html' for r in v.riferimenti) and not any(r.split(':')[0] == 'index.html' for r in v.riferimenti):
                # una voce di un'altra pagina (non della home): resta in italiano, e si dice
                v.str = [v.id] if v.id_plurale is None else [v.id, v.id_plurale][:len(v.str) or 2]
                altre.setdefault(codice, []).append(v.ctx); continue
            male.append(f'{codice}: manca {v.ctx}'); continue
        v.str = [testi[v.ctx]]
    male += [f'{codice}: in più {k}' for k in testi if k not in chiavi]
    (QUI / f'{codice}.po').write_text(po.scrivi(cat), encoding='utf-8')
if male:
    sys.exit('\n'.join(male))
if altre:
    print(f'voci di altre pagine lasciate in italiano: {len(next(iter(altre.values())))} per lingua ({", ".join(sorted(next(iter(altre.values())))[:3])}…)')
print(f'{len(LINGUE)} cataloghi di prova, {len(mod.voci)} voci ciascuno: {" ".join(LINGUE)}')
