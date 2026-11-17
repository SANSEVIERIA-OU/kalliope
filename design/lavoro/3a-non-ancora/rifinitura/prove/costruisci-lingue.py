#!/usr/bin/env python3 -I
"""Un sito di prova con più lingue PUBBLICATE, per provare il selettore della lingua nella barra (punto 7): fa un'istantanea dell'albero vivo,
vi scrive i cataloghi di prova en (testo accentato e lungo, da sinistra a destra), de (lo stesso) e ar (le stesse parole forzate da destra a
sinistra), fatti dalla pseudo-lingua sul catalogo italiano di adesso, e lo costruisce. SOLO PER LE PROVE: i cataloghi stanno nella copia, mai in website/lingue/.
Uso: python3 -I costruisci-lingue.py <nome della corsa>   → /tmp/lavoro-3ar-lavoro/radice-L-<nome>/ e /tmp/lavoro-3ar-sito-L-<nome>/ (cartelle nuove)"""
import pathlib, shutil, subprocess, sys
nome = sys.argv[1]
VIVO = pathlib.Path("/workspace/kalliope")
rad = pathlib.Path(f"/tmp/lavoro-3ar-lavoro/radice-L-{nome}")
out = pathlib.Path(f"/tmp/lavoro-3ar-sito-L-{nome}")
if rad.exists() or out.exists():
    sys.exit(f"{rad} o {out} esiste già: usa un altro nome")
rad.mkdir(parents=True)
for d in ("website", "design-system", "tools", "docs"):
    shutil.copytree(VIVO / d, rad / d, ignore=shutil.ignore_patterns("__pycache__"))
sys.path.insert(0, str(rad / "tools"))
from i18n import catalogo, po, pseudo  # noqa: E402
w = rad / "website"
pagine, tutti, errori = catalogo.raccogli(w)
assert not errori, errori
mod = catalogo.modello(pagine, tutti)
for codice, trasforma in (("en", pseudo.en_xa), ("de", pseudo.en_xa), ("ar", pseudo.ar_xb)):
    cat = catalogo.unisci(None, mod, codice)
    for v in cat.voci:
        v.str = [trasforma(v.id)] if v.id_plurale is None else [trasforma(v.id if i == 0 else v.id_plurale) for i in range(len(v.str))]
    (w / "lingue" / f"{codice}.po").write_text(po.scrivi(cat), encoding="utf-8")
r = subprocess.run([sys.executable, "-I", str(rad / "tools" / "site.py"), "--out", str(out), "--release-json", "/tmp/lavoro-3ar-releases.json"], capture_output=True, text=True)
print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[-400:])
sys.exit(r.returncode)
