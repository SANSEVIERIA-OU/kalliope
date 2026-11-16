# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Writes tools/data/cldr.json, the Unicode CLDR data the website build needs, for the languages the site is ready for.

    python3 -I tools/cldr_data.py [--tag 49.0.0] [--out tools/data/cldr.json]

Run it by hand when CLDR or the list of languages changes, and commit the result: the site build (tools/site.py) and the
translation check read the file and need nothing else, so they run on the Python standard library alone, without a
network. The data comes from the official JSON release of CLDR, https://github.com/unicode-org/cldr-json, under the
Unicode License v3 (https://www.unicode.org/license.txt). For each language the file keeps:

    nome        the language written in itself (CLDR localeDisplayNames); nomeElenco the same as CLDR wants it in a
                list or menu (contextTransforms uiListOrMenu: "italiano" → "Italiano"), for the language chooser and selector
    direzione   "ltr" or "rtl" (CLDR layout characterOrder), for <html dir>
    bcp47       the tag for <html lang> and hreflang
    numeri      decimal and group separators, digits, grouping, for sizes of files
    data        the long date pattern and the 12 month names (format and stand-alone), for the date of a release
    megabyte    the short unit pattern of a megabyte
    plurali     the CLDR plural rules, the forms of the language and the gettext `Plural-Forms` line, checked against the
                integer samples CLDR gives for every rule

The list of languages is the decision of 16/11/2026 (CLAUDE.md, «Pronti per le traduzioni»): the 24 official languages of
the EU and the ten most spoken in the world.
"""
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from i18n import plurali  # noqa: E402

TAG = "49.0.0"
BASE = "https://raw.githubusercontent.com/unicode-org/cldr-json/{tag}/cldr-json/"
LINGUE = ("bg cs da de el en es et fi fr ga hr hu it lt lv mt nl pl pt ro sk sl sv zh hi ar bn id ur").split()
BCP47 = {"zh": "zh-Hans"}   # CLDR "zh" is simplified Chinese; the tag says so, so a browser picks the right font
OUT = pathlib.Path(__file__).resolve().parent / "data" / "cldr.json"


def scarica(tag, percorso, facoltativo=False):
    url = BASE.format(tag=tag) + percorso
    for tentativo in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "kalliope-cldr-data"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404 and facoltativo:
                return None
            if tentativo == 3:
                sys.exit(f"cldr_data.py: cannot read {url}: {e}")
            time.sleep(1.5 * (tentativo + 1))
        except Exception as e:   # noqa: BLE001
            if tentativo == 3:
                sys.exit(f"cldr_data.py: cannot read {url}: {e}")
            time.sleep(1.5 * (tentativo + 1))


def campioni_interi(testo):
    """I numeri interi dopo «@integer» in una regola CLDR (intervalli «2~4» compresi; si ferma a «…»)."""
    m = re.search(r"@integer\s+(.*?)(?:@decimal|$)", testo)
    if not m:
        return []
    out = []
    for parte in m.group(1).split(","):
        parte = parte.strip()
        if parte.startswith("…") or not parte or "c" in parte or "e" in parte:
            continue
        if "~" in parte:
            a, b = parte.split("~")
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(parte))
    return out


def plurali_di(regole_tutte, lingua):
    chiave = "pluralRule-count-"
    grezze = {k[len(chiave):]: v for k, v in regole_tutte[lingua].items()}
    regole = {c: t.strip() for c, t in grezze.items()}
    expr = plurali.espressione(regole)
    # prova: ogni intero di esempio di CLDR cade nella categoria che CLDR gli dà
    elenco = plurali.forme(regole)
    nplurals, f = plurali.leggi_intestazione(expr)
    assert nplurals == len(elenco), (lingua, expr)
    for cat, testo in grezze.items():
        for n in campioni_interi(testo):
            if f(n) != elenco.index(cat):
                sys.exit(f"cldr_data.py: {lingua}: l'intero {n} è «{cat}» per CLDR ma l'espressione «{expr}» dà {f(n)}")
    return {"regole": regole, "forme": elenco, "intestazione": expr}


def main():
    args = sys.argv[1:]
    tag = args[args.index("--tag") + 1] if "--tag" in args else TAG
    out = pathlib.Path(args[args.index("--out") + 1]) if "--out" in args else OUT
    plur = scarica(tag, "cldr-core/supplemental/plurals.json")["supplemental"]["plurals-type-cardinal"]
    sistemi = scarica(tag, "cldr-core/supplemental/numberingSystems.json")["supplemental"]["numberingSystems"]
    versione = scarica(tag, "cldr-core/package.json").get("version", tag)
    lingue = {}
    for L in LINGUE:
        date = scarica(tag, f"cldr-dates-full/main/{L}/ca-gregorian.json")["main"][L]["dates"]["calendars"]["gregorian"]
        num = scarica(tag, f"cldr-numbers-full/main/{L}/numbers.json")["main"][L]["numbers"]
        unita = scarica(tag, f"cldr-units-full/main/{L}/units.json")["main"][L]["units"]["short"]
        nomi = scarica(tag, f"cldr-localenames-full/main/{L}/languages.json")["main"][L]["localeDisplayNames"]["languages"]
        layout = scarica(tag, f"cldr-misc-full/main/{L}/layout.json")["main"][L]["layout"]["orientation"]["characterOrder"]
        trasf = scarica(tag, f"cldr-misc-full/main/{L}/contextTransforms.json", facoltativo=True)
        regola_elenco = ((trasf or {}).get("main", {}).get(L, {}).get("contextTransforms", {}).get("languages") or {}).get("uiListOrMenu")
        nome_elenco = nomi[L][:1].upper() + nomi[L][1:] if regola_elenco == "titlecase-firstword" else nomi[L]
        sistema = num["defaultNumberingSystem"]
        simboli = num[f"symbols-numberSystem-{sistema}"]
        modello = num[f"decimalFormats-numberSystem-{sistema}"]["standard"]
        lingue[L] = {
            "nome": nomi[L],
            "nomeElenco": nome_elenco,
            "direzione": "rtl" if layout == "right-to-left" else "ltr",
            "bcp47": BCP47.get(L, L),
            "numeri": {"sistema": sistema, "cifre": sistemi[sistema]["_digits"] if "_digits" in sistemi[sistema] else sistemi[sistema]["digits"],
                       "decimale": simboli["decimal"], "gruppo": simboli["group"], "modello": modello,
                       "minimoGruppo": int(num.get("minimumGroupingDigits", "1"))},
            "data": {"lungo": date["dateFormats"]["long"],
                     "mesi": [date["months"]["format"]["wide"][str(i)] for i in range(1, 13)],
                     "mesiIsolati": [date["months"]["stand-alone"]["wide"][str(i)] for i in range(1, 13)]},
            "megabyte": unita["digital-megabyte"]["unitPattern-count-other"],
            "plurali": plurali_di(plur, L),
        }
        print(f"  {L}: {nomi[L]} ({lingue[L]['direzione']}), {lingue[L]['plurali']['intestazione']}")
    dati = {
        "fonte": {"nome": "Unicode CLDR (JSON)", "versione": versione, "tag": tag,
                  "indirizzo": f"https://github.com/unicode-org/cldr-json/tree/{tag}",
                  "licenza": "Unicode License v3, https://www.unicode.org/license.txt",
                  "generato_da": "tools/cldr_data.py"},
        "lingue": lingue,
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(dati, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print(f"cldr_data.py: {len(lingue)} languages, CLDR {versione}, written to {out}")


if __name__ == "__main__":
    main()
