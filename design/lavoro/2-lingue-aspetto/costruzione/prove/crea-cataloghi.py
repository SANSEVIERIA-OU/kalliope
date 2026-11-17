#!/usr/bin/env python3
"""Come prova-lingue/crea_cataloghi.py (incarico 2), ma scrive i cataloghi di prova in una cartella data e non in prova-lingue/:
le traduzioni vengono dai testi di quell'incarico, il modello dalle pagine di adesso. SOLO PER LE PROVE.
Uso: python3 -I crea-cataloghi.py <website> <cartella di uscita>"""
import pathlib, sys
Q = pathlib.Path('/workspace/kalliope/design/lavoro/2-lingue-aspetto/prova-lingue')
sys.path.insert(0, '/workspace/kalliope/tools'); sys.path.insert(0, str(Q))
sys.dont_write_bytecode = True
from i18n import catalogo, po  # noqa: E402
import testi_europa, testi_mondo  # noqa: E402
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from testi_aggiornati import AGGIORNATI  # noqa: E402
sito, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
pagine, tutti, errori = catalogo.raccogli(sito)
assert not errori, errori
mod = catalogo.modello(pagine, tutti)
LINGUE = {'de': testi_europa.DE, 'fi': testi_europa.FI, 'el': testi_europa.EL, 'bg': testi_europa.BG,
          'ar': testi_mondo.AR, 'ur': testi_mondo.UR, 'hi': testi_mondo.HI, 'bn': testi_mondo.BN, 'zh': testi_mondo.ZH}
male = []
for codice, testi in LINGUE.items():
    testi = {**testi, **AGGIORNATI.get(codice, {})}   # le voci i cui segni sono cambiati dopo
    cat = catalogo.unisci(None, mod, codice)
    cat.intestazione_commenti = [f'Kalliope · website texts in {codice}. SOLO PER LE PROVE (incarico 2-b): traduzione non rivista.']
    for v in cat.voci:
        if v.ctx not in testi:
            if not any(r.split(':')[0] == 'index.html' for r in v.riferimenti):
                v.str = [v.id] if v.id_plurale is None else [v.id, v.id_plurale][:len(v.str) or 2]   # una voce di un'altra pagina: resta in italiano
                continue
            male.append(f'{codice}: manca {v.ctx}'); continue
        v.str = [testi[v.ctx]]
    (out / f'{codice}.po').write_text(po.scrivi(cat), encoding='utf-8')
if male:
    sys.exit('\n'.join(male))
print(f'{len(LINGUE)} cataloghi di prova in {out}: {" ".join(LINGUE)}')
