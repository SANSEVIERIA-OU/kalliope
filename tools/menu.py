# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The entry of Kalliope in the applications menu, in every language of the catalogue, and the check that says so.

    python3 -I tools/menu.py            write packaging/linux/<id>.desktop from <id>.desktop.in and website/lingue/*.po
    python3 -I tools/menu.py --check    exit 1 when the desktop file is not what this tool would write (what CI runs)

The model, packaging/linux/<id>.desktop.in, says which lines are translated: `GenericName=@tr("programma.menu.genere" => "…")`
(tools/i18n/menu.py). Its messages are in the one catalogue with the program's (`tools/translations.py extract` reads them), and
each language's translation of a line goes into the desktop file when it is there, not fuzzy, made for the Italian text of today
and without errors: one line per language, `GenericName[de]=…`. English is the default line, `GenericName=…`. The packages
install the desktop file as it is, and the release checks it with desktop-file-validate.

`--website DIR` reads the catalogue of another copy of website/ (the tests do). Only the Python standard library.
"""
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from i18n import catalogo, menu, po  # noqa: E402

RADICE = pathlib.Path(__file__).resolve().parent.parent
LINGUE = RADICE / "website" / "lingue"


def pronte(modello, nome, lingue):
    """{lingua: {chiave: testo}}: per ogni lingua del catalogo le righe del menu tradotte, non fuzzy, sul testo italiano di oggi
    e senza errori."""
    _, messaggi, errori = menu.leggi(modello, nome)
    if errori:
        raise menu.ErroreMenu("\n".join(errori))
    out = {}
    for codice in catalogo.lingue_presenti(lingue):
        if codice == menu.SORGENTE:
            continue
        voci = catalogo.leggi_lingua(lingue, codice).per_chiave()
        for chiave, m in messaggi.items():
            v = voci.get(chiave)
            if v is None or v.fuzzy or v.id != m.testo or not v.piena():
                continue
            if menu.controlla_testo(po.Voce(ctx=chiave, id=m.testo), v.str[0]):
                continue
            out.setdefault(codice, {})[chiave] = v.str[0]
    return out


def costruisci(radice=RADICE, lingue=LINGUE):
    """{percorso del .desktop: testo} per ogni modello."""
    out = {}
    for f in menu.modelli(radice):
        nome = f.relative_to(radice).as_posix()
        modello = f.read_text(encoding="utf-8")
        out[f.with_suffix("")] = menu.scrivi(modello, nome, pronte(modello, nome, lingue))
    return out


def controlla(radice=RADICE, lingue=LINGUE):
    """I file .desktop che non sono quelli che lo strumento scriverebbe (vuoto se tutto torna)."""
    return [f for f, t in costruisci(radice, lingue).items() if not f.exists() or f.read_text(encoding="utf-8") != t]


def main(argv=None):
    args = list(sys.argv[1:] if argv is None else argv)
    lingue = LINGUE
    if "--website" in args:
        i = args.index("--website")
        lingue = pathlib.Path(args[i + 1]).resolve() / "lingue"
        del args[i:i + 2]
    if args not in ([], ["--check"]):
        print(__doc__, file=sys.stderr)
        return 2
    try:
        file = costruisci(RADICE, lingue)
    except menu.ErroreMenu as e:
        print(f"menu.py: the model has errors:\n  {e}", file=sys.stderr)
        return 1
    if not file:
        print("menu.py: no packaging/linux/*.desktop.in", file=sys.stderr)
        return 1
    if args == ["--check"]:
        vecchi = controlla(RADICE, lingue)
        if vecchi:
            print("menu.py: the desktop file is not what the model and the catalogue make; run `python3 -I tools/menu.py`:\n  " +
                  "\n  ".join(f.relative_to(RADICE).as_posix() for f in vecchi), file=sys.stderr)
            return 1
        print("menu.py: the desktop file matches the model and the catalogue")
        return 0
    for f, t in file.items():
        f.write_text(t, encoding="utf-8")
        lingue_scritte = sorted({m.group(1) for m in re.finditer(r"^[A-Za-z0-9-]+\[([^\]]+)\]=", t, re.M)})
        print(f"menu.py: written {f.relative_to(RADICE).as_posix()} ({len(lingue_scritte)} languages besides English: {' '.join(lingue_scritte)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
