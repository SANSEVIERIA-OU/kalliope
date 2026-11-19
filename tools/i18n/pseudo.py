# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Pseudo-languages for testing the site without translators, made from the Italian catalogue and never published.

    en-XA   accented letters, a text 40% longer, delimiters: every cut, overlap and unmarked (still Italian) text shows up
    ar-XB   the same words forced right to left (RLO), with dir="rtl" on the page: what the layout does when it is mirrored

The names are those of Android's pseudo-locales. Tags (<1>…</1>), placeholders ({n}, {{kalliope.version}}) and entities
(&amp;) are copied as they are: only the words change.
"""
import math
import re

_TOKEN = re.compile(r"</?\d+/?>|\{\{kalliope\.[a-z0-9.]+\}\}|\{[A-Za-z_][A-Za-z0-9_]*\}|&(?:amp|lt|gt);")
_DA = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
_A = "ÅáßβÇçÐðÉéƑƒĜĝĤĥÎîĴĵĶķĻļḾḿÑñÖöÞþǪǫŔŕŠšŢţÛûṼṽŴŵẊẋÝýŽž"
_MAPPA = str.maketrans(_DA, _A)
_RIEMPITIVO = "Ĺöŕéḿ ĩṕšûḿ ðöļöŕ šĩţ àḿéţ ċöñšéċţéţûŕ àðĩṕĩšċĩñĝ éļĩţ ššéð ðö éĩûšḿöð ţéḿṕöŕ"
RLO, PDF = "‮", "‬"


def _segmenti(testo):
    """(è_token, testo) per ogni pezzo."""
    out, pos = [], 0
    for m in _TOKEN.finditer(testo):
        if m.start() > pos:
            out.append((False, testo[pos:m.start()]))
        out.append((True, m.group(0)))
        pos = m.end()
    if pos < len(testo):
        out.append((False, testo[pos:]))
    return out


def _riempitivo(n):
    """Esattamente n caratteri di riempitivo, che cominciano con uno spazio."""
    r = " " + " ".join(_RIEMPITIVO.split() * (n // 4 + 2))
    return r[:n].rstrip(" ") + ("·" if r[:n].endswith(" ") else "")


def en_xa(testo):
    """Lettere accentate; ogni pezzo di testo più lungo del 40% (come una traduzione lunga: dentro il suo tag, non in fondo al
    messaggio); «[» all'inizio del primo pezzo e «]» alla fine dell'ultimo, dentro i tag che lì sono aperti: fuori, cambierebbero
    le righe di un titolo fatto di <span> uno per riga."""
    seg = _segmenti(testo)
    con_testo = [k for k, (tok, t) in enumerate(seg) if not tok and t.strip()]
    primo, ultimo = (con_testo[0], con_testo[-1]) if con_testo else (None, None)
    out = []
    for k, (tok, t) in enumerate(seg):
        if tok:
            out.append(t); continue
        r = t.translate(_MAPPA)
        corpo = r.strip(" ")
        if corpo and len(corpo) >= 2:
            fine = len(r.rstrip(" "))
            r = r[:fine] + _riempitivo(math.ceil(len(corpo) * 0.4)) + r[fine:]
        if k == primo:
            lead = len(r) - len(r.lstrip(" "))
            r = r[:lead] + "[" + r[lead:]
        if k == ultimo:
            fine = len(r.rstrip(" "))
            r = r[:fine] + "]" + r[fine:]
        out.append(r)
    if primo is None:   # solo tag e segnaposto
        return "[" + "".join(out) + "]"
    return "".join(out)


def ar_xb(testo):
    return RLO + testo + PDF


def catalogo(lingua, voci):
    """{chiave: traduzione} pseudo per le voci (lista di (chiave, id, id_plurale))."""
    f = {"en-XA": en_xa, "ar-XB": ar_xb}[lingua]
    out = {}
    for chiave, testo, plurale in voci:
        out[chiave] = (f(testo), f(plurale)) if plurale is not None else f(testo)
    return out


PSEUDO = {"en-XA": {"bcp47": "en-XA", "direzione": "ltr", "nome": "English (pseudo, accented)"},
          "ar-XB": {"bcp47": "ar-XB", "direzione": "rtl", "nome": "العربية (pseudo, RTL)"}}
