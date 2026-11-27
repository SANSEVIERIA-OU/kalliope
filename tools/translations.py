# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The translations of the website and of the program: the model, one catalogue per language, and the check (docs/translating.md).

    python3 -I tools/translations.py extract [--check]   make website/lingue/site.pot and it.po from the pages and from the program's
                                                          sources (`@tr` in the .slint files, `tr!` in the Rust ones), and bring
                                                          every <xx>.po up to date (new entries empty, changed text fuzzy)
    python3 -I tools/translations.py check [xx …]        check the catalogues: every key there, placeholders and tags
                                                          intact, the plural forms of the language; exit 1 on an error
    python3 -I tools/translations.py status              for each language: how many entries are ready, published or not
    python3 -I tools/translations.py new xx              start website/lingue/xx.po for one of the supported languages

Any command takes `--website DIR` to work on another copy of website/ (the tests do), and `--app DIR` to read the program's messages
from another copy of crates/ (a copy of website/ alone brings none).

`check --complete` also fails when a language has entries missing, out of date or fuzzy (what the site build does not
publish). `extract --check` writes nothing and fails when the files are not what `extract` would write: a text in a page
changed and nobody ran `extract`. Only the Python standard library.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from i18n import catalogo, cldr, po  # noqa: E402

RADICE = pathlib.Path(__file__).resolve().parent.parent
SITO = RADICE / "website"
LINGUE = SITO / "lingue"
SORGENTE = "it"
PROGRAMMA = RADICE / "crates"
_crates = "auto"   # `--app DIR` lo cambia; "auto": il programma del repository con il sito del repository


def mostra(f):
    """Un percorso come lo si scrive a chi legge: relativo al repository se ci sta dentro."""
    try:
        return str(pathlib.Path(f).relative_to(RADICE))
    except ValueError:
        return str(f)


def carica(sito=SITO, crates=None):
    """Le pagine e i messaggi del sito e del programma. Con `crates="auto"` il programma del repository, ma soltanto se il sito
    è quello del repository (una copia di website/ non ha il suo programma)."""
    if crates is None:
        crates = _crates if _crates != "auto" else (PROGRAMMA if pathlib.Path(sito) == SITO else None)
    pagine, tutti, errori = catalogo.raccogli(sito, crates)
    return pagine, tutti, errori


def cmd_extract(args, sito=SITO, lingue=LINGUE):
    solo_controllo = "--check" in args
    pagine, tutti, errori = carica(sito)
    if errori:
        print("translations.py: the pages have errors:\n  " + "\n  ".join(errori), file=sys.stderr)
        return 1
    mod = catalogo.modello(pagine, tutti)
    file_scritti = {lingue / "site.pot": po.scrivi(mod)}
    for codice in catalogo.lingue_presenti(lingue) + ([SORGENTE] if SORGENTE not in catalogo.lingue_presenti(lingue) else []):
        vecchio = catalogo.leggi_lingua(lingue, codice)
        file_scritti[lingue / f"{codice}.po"] = po.scrivi(catalogo.unisci(vecchio, mod, codice, sorgente=(codice == SORGENTE)))
    cambiati = [f for f, t in file_scritti.items() if not f.exists() or f.read_text(encoding="utf-8") != t]
    if solo_controllo:
        if cambiati:
            print("translations.py: out of date, run `python3 -I tools/translations.py extract`:\n  " +
                  "\n  ".join(mostra(f) for f in cambiati), file=sys.stderr)
            return 1
        print(f"translations.py: {len(mod.voci)} messages, catalogues up to date")
        return 0
    lingue.mkdir(parents=True, exist_ok=True)
    for f, t in file_scritti.items():
        f.write_text(t, encoding="utf-8")
    print(f"translations.py: {len(mod.voci)} messages from {len(pagine)} page(s); written: " +
          ", ".join(f.name for f in file_scritti) + (f" ({len(cambiati)} changed)" if cambiati else " (nothing changed)"))
    return 0


def esiti(sito=SITO, lingue=LINGUE, codici=None):
    """(modello, totale, {lingua: Esito}, errori delle pagine)."""
    pagine, tutti, errori = carica(sito)
    if errori:
        return None, 0, {}, errori
    mod = catalogo.modello(pagine, tutti)
    out = {}
    for codice in codici or catalogo.lingue_presenti(lingue):
        cat = catalogo.leggi_lingua(lingue, codice)
        if cat is None:
            e = catalogo.Esito(codice)
            e.errori.append(f"the file {codice}.po is missing")
            out[codice] = e
            continue
        out[codice] = catalogo.controlla(cat, mod, codice)
    return mod, len(mod.voci), out, []


def cmd_check(args, sito=SITO, lingue=LINGUE):
    completo = "--complete" in args
    codici = [a for a in args if not a.startswith("--")] or None
    mod, totale, risultati, errori = esiti(sito, lingue, codici)
    if errori:
        print("translations.py: the pages have errors:\n  " + "\n  ".join(errori), file=sys.stderr)
        return 1
    # il catalogo e il modello devono essere quelli che le pagine producono (altrimenti l'italiano non è quello delle pagine)
    sbagliato = 0
    for codice, e in risultati.items():
        print(e.riassunto(totale))
        for r in e.errori:
            print(f"  ERROR {codice}.po: {r}")
        if completo:
            for chiave in e.mancanti:
                print(f"  MISSING {codice}.po: {chiave}")
            for chiave in e.fuori_data:
                print(f"  OUT OF DATE {codice}.po: {chiave} (the Italian text changed)")
            for chiave in e.fuzzy:
                print(f"  FUZZY {codice}.po: {chiave}")
        if e.errori or (completo and not e.completa):
            sbagliato += 1
    if not risultati:
        print("translations.py: no catalogue to check")
    return 1 if sbagliato else 0


def cmd_status(args, sito=SITO, lingue=LINGUE):
    mod, totale, risultati, errori = esiti(sito, lingue)
    if errori:
        print("translations.py: the pages have errors:\n  " + "\n  ".join(errori), file=sys.stderr)
        return 1
    print(f"{totale} messages in the template")
    for codice in cldr.lingue():
        e = risultati.get(codice)
        if e is None:
            print(f"  {codice}  {cldr.info(codice)['nome']}: no file")
        else:
            stato = "published" if e.completa else "NOT published"
            print(f"  {codice}  {cldr.info(codice)['nome']}: {e.riassunto(totale)} → {stato}")
    return 0


def cmd_new(args, sito=SITO, lingue=LINGUE):
    if not args:
        print("usage: translations.py new <language code>", file=sys.stderr)
        return 2
    codice = args[0]
    try:
        cldr.info(codice)
    except KeyError as e:
        print(f"translations.py: {e}", file=sys.stderr)
        return 1
    f = lingue / f"{codice}.po"
    if f.exists():
        print(f"translations.py: {f.name} exists already; `extract` brings it up to date", file=sys.stderr)
        return 1
    pagine, tutti, errori = carica(sito)
    if errori:
        print("translations.py: the pages have errors:\n  " + "\n  ".join(errori), file=sys.stderr)
        return 1
    mod = catalogo.modello(pagine, tutti)
    lingue.mkdir(parents=True, exist_ok=True)
    f.write_text(po.scrivi(catalogo.unisci(None, mod, codice)), encoding="utf-8")
    print(f"translations.py: {mostra(f)} started with {len(mod.voci)} empty entries "
          f"({cldr.info(codice)['nome']}, {len(cldr.info(codice)['plurali']['forme'])} plural form(s))")
    return 0


COMANDI = {"extract": cmd_extract, "check": cmd_check, "status": cmd_status, "new": cmd_new}


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv or argv[0] not in COMANDI:
        print(__doc__)
        return 2
    global _crates
    sito = SITO
    _crates = "auto"
    if "--app" in argv:   # per le prove: un'altra copia di crates/
        i = argv.index("--app")
        _crates = pathlib.Path(argv[i + 1]).resolve()
        del argv[i:i + 2]
    if "--website" in argv:   # per le prove: un'altra copia di website/
        i = argv.index("--website")
        sito = pathlib.Path(argv[i + 1]).resolve()
        del argv[i:i + 2]
    return COMANDI[argv[0]](argv[1:], sito, sito / "lingue")


if __name__ == "__main__":
    sys.exit(main())
