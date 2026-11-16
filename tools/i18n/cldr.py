# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Dates, numbers, sizes of files and the names of the languages, from the CLDR data in tools/data/cldr.json.

Nothing here is a table written by hand: the file is generated from the official CLDR release by tools/cldr_data.py.
"""
import json
import pathlib
import re

_DATI = None
FILE = pathlib.Path(__file__).resolve().parent.parent / "data" / "cldr.json"


def dati():
    global _DATI
    if _DATI is None:
        _DATI = json.loads(FILE.read_text(encoding="utf-8"))
    return _DATI


def fonte():
    return dati()["fonte"]


def lingue():
    """I codici delle lingue pronte, in ordine alfabetico."""
    return sorted(dati()["lingue"])


def info(codice):
    try:
        return dati()["lingue"][codice]
    except KeyError:
        raise KeyError(f"the language «{codice}» is not one of the site's: {' '.join(lingue())}") from None


# ---------- numeri ----------
def _cifre(testo, L):
    cifre = info(L)["numeri"]["cifre"]
    return "".join(cifre[int(c)] if c.isdigit() else c for c in testo)


def _gruppi(modello):
    """(primario, secondario) dal modello «#,##,##0.###»."""
    intero = modello.split(".")[0]
    parti = intero.split(",")
    if len(parti) == 1:
        return 0, 0
    primario = len(parti[-1])
    secondario = len(parti[-2]) if len(parti) > 2 else primario
    return primario, secondario


def numero(L, valore, decimali=None):
    """Un numero come lo scrive la lingua: separatore dei decimali, raggruppamento e cifre di CLDR."""
    n = info(L)["numeri"]
    testo = f"{valore:.{decimali}f}" if decimali is not None else str(valore)
    segno = "-" if testo.startswith("-") else ""
    testo = testo.lstrip("-")
    intero, _, frazione = testo.partition(".")
    primario, secondario = _gruppi(n["modello"])
    if primario and len(intero) >= primario + n["minimoGruppo"]:
        resto, gruppi = intero[:-primario], [intero[-primario:]]
        while resto:
            gruppi.insert(0, resto[-secondario:]); resto = resto[:-secondario]
        intero = n["gruppo"].join(gruppi)
    return segno + _cifre(intero + (n["decimale"] + frazione if frazione else ""), L)


def dimensione(L, byte):
    """La grandezza di un file in megabyte con un decimale: «14,1 MB» in italiano."""
    return info(L)["megabyte"].replace("{0}", numero(L, byte / 1_000_000, 1))


# ---------- date ----------
def data_lunga(L, anno, mese, giorno):
    """La data nel formato lungo della lingua («12 novembre 2026»), con gli spazi che non vanno a capo."""
    d = info(L)["data"]
    cifre = lambda x: _cifre(str(x), L)  # noqa: E731
    out, i, p = [], 0, d["lungo"]
    while i < len(p):
        c = p[i]
        if c == "'":
            j = p.find("'", i + 1)
            if j == i + 1:
                out.append("'"); i += 2; continue
            out.append(p[i + 1:j]); i = j + 1; continue
        if c in "dMLy":
            j = i
            while j < len(p) and p[j] == c:
                j += 1
            n = j - i
            if c == "d": out.append(cifre(giorno if n == 1 else f"{giorno:02d}"))
            elif c == "y": out.append(cifre(anno if n != 2 else f"{anno % 100:02d}"))
            elif c == "M" and n >= 4: out.append(d["mesi"][mese - 1])
            elif c == "L" and n >= 4: out.append(d["mesiIsolati"][mese - 1])
            elif c in "ML": out.append(cifre(mese if n == 1 else f"{mese:02d}"))
            i = j; continue
        if c.isascii() and c.isalpha():
            raise ValueError(f"CLDR: letter «{c}» not handled in the date pattern «{p}» of {L}")
        out.append(c); i += 1
    return re.sub(r"[  ]", " ", "".join(out))
