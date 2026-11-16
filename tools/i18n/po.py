# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Reading and writing gettext .po and .pot files (the format Slint reads too), with nothing but the standard library.

Supported: header, `msgctxt`, `msgid`, `msgid_plural`, `msgstr` and `msgstr[N]`, translator comments (`# `), extracted
comments (`#.`), references (`#:`), flags (`#, fuzzy`), previous text (`#| msgid`), and obsolete entries (`#~`). Strings
may be split over several lines. Entries are written one string per line, which every tool reads.
"""
import re

_ESC = {"n": "\n", "t": "\t", "r": "\r", '"': '"', "\\": "\\"}


def _unesc(s):
    return re.sub(r"\\(.)", lambda m: _ESC.get(m.group(1), "\\" + m.group(1)), s)


def _esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t").replace("\r", "\\r")


class Voce:
    def __init__(self, ctx=None, id="", id_plurale=None, str=None):
        self.ctx, self.id, self.id_plurale = ctx, id, id_plurale
        self.str = list(str) if str is not None else ([""] if id_plurale is None else [])
        self.traduttore, self.estratti, self.riferimenti, self.flags = [], [], [], []
        self.prec_ctx = self.prec_id = self.prec_plurale = None
        self.obsoleta = False

    @property
    def fuzzy(self):
        return "fuzzy" in self.flags

    @property
    def chiave(self):
        return (self.ctx, self.id)

    def piena(self, nforme=1):
        """Ogni forma ha del testo."""
        if self.id_plurale is None:
            return bool(self.str) and bool(self.str[0].strip())
        return len(self.str) >= nforme and all(s.strip() for s in self.str[:nforme])


class Catalogo:
    def __init__(self):
        self.intestazione = {}   # nome → valore, nell'ordine del file
        self.intestazione_commenti = []
        self.voci = []

    def get(self, ctx, id=None):
        for v in self.voci:
            if v.ctx == ctx and not v.obsoleta:
                return v
        return None

    def per_chiave(self):
        return {v.ctx: v for v in self.voci if not v.obsoleta and v.ctx is not None}


def leggi(testo):
    cat = Catalogo()
    blocchi = re.split(r"\n\s*\n", testo.replace("\r\n", "\n").strip("\n"))
    primo = True
    for blocco in blocchi:
        if not blocco.strip():
            continue
        v = _voce(blocco)
        if primo and v.ctx is None and v.id == "" and not v.obsoleta:
            for riga in (v.str[0] if v.str else "").split("\n"):
                if ":" in riga:
                    k, val = riga.split(":", 1)
                    cat.intestazione[k.strip()] = val.strip()
            cat.intestazione_commenti = v.traduttore
        else:
            cat.voci.append(v)
        primo = False
    return cat


def _voce(blocco):
    v = Voce()
    campo, campi = None, {"ctx": None, "id": None, "plurale": None, "str": {}}
    prec = {}
    for riga in blocco.split("\n"):
        obs = False
        if riga.startswith("#~"):
            obs = True
            riga = riga[2:].lstrip()
            v.obsoleta = True
        if riga.startswith("#."):
            v.estratti.append(riga[3:] if riga.startswith("#. ") else riga[2:].strip()); continue
        if riga.startswith("#:"):
            v.riferimenti.extend(riga[2:].split()); continue
        if riga.startswith("#,"):
            v.flags.extend(f.strip() for f in riga[2:].split(",") if f.strip()); continue
        if riga.startswith("#|"):
            m = re.match(r'#\|\s*(msgctxt|msgid_plural|msgid)\s+"(.*)"$', riga)
            if m:
                prec[m.group(1)] = _unesc(m.group(2)); campo = ("prec", m.group(1))
            else:
                m2 = re.match(r'#\|\s*"(.*)"$', riga)
                if m2 and isinstance(campo, tuple) and campo[0] == "prec":
                    prec[campo[1]] += _unesc(m2.group(1))
            continue
        if riga.startswith("#"):
            v.traduttore.append(riga[1:].lstrip() if riga[1:2] == " " else riga[1:]); continue
        m = re.match(r'^(msgctxt|msgid_plural|msgid|msgstr(?:\[(\d+)\])?)\s+"(.*)"\s*$', riga)
        if m:
            nome, idx, val = m.group(1), m.group(2), _unesc(m.group(3))
            if nome == "msgctxt": campo = "ctx"; campi["ctx"] = val
            elif nome == "msgid": campo = "id"; campi["id"] = val
            elif nome == "msgid_plural": campo = "plurale"; campi["plurale"] = val
            else:
                campo = ("str", int(idx) if idx is not None else 0); campi["str"][campo[1]] = val
            continue
        m = re.match(r'^"(.*)"\s*$', riga)
        if m and campo is not None and not (isinstance(campo, tuple) and campo[0] == "prec"):
            val = _unesc(m.group(1))
            if isinstance(campo, tuple): campi["str"][campo[1]] += val
            else: campi[campo] = (campi[campo] or "") + val
    v.ctx, v.id, v.id_plurale = campi["ctx"], campi["id"] or "", campi["plurale"]
    v.str = [campi["str"][i] for i in sorted(campi["str"])]
    v.prec_ctx, v.prec_id, v.prec_plurale = prec.get("msgctxt"), prec.get("msgid"), prec.get("msgid_plural")
    return v


def _riga(nome, valore, prefisso=""):
    return f'{prefisso}{nome} "{_esc(valore)}"'


def scrivi(cat):
    out = []
    if cat.intestazione_commenti:
        out.extend("# " + c if c else "#" for c in cat.intestazione_commenti)
    out.append('msgid ""')
    out.append('msgstr ""')
    for k, val in cat.intestazione.items():
        out.append(f'"{_esc(k + ": " + val + chr(10))}"')
    for v in cat.voci:
        out.append("")
        p = "#~ " if v.obsoleta else ""
        for c in v.traduttore: out.append(("# " + c) if c else "#")
        for c in v.estratti: out.append("#. " + c)
        if v.riferimenti: out.append("#: " + " ".join(v.riferimenti))
        if v.flags: out.append("#, " + ", ".join(v.flags))
        if v.prec_ctx is not None: out.append(_riga("msgctxt", v.prec_ctx, "#| "))
        if v.prec_id is not None: out.append(_riga("msgid", v.prec_id, "#| "))
        if v.prec_plurale is not None: out.append(_riga("msgid_plural", v.prec_plurale, "#| "))
        if v.ctx is not None: out.append(_riga("msgctxt", v.ctx, p))
        out.append(_riga("msgid", v.id, p))
        if v.id_plurale is not None:
            out.append(_riga("msgid_plural", v.id_plurale, p))
            for i, s in enumerate(v.str): out.append(_riga(f"msgstr[{i}]", s, p))
        else:
            out.append(_riga("msgstr", v.str[0] if v.str else "", p))
    return "\n".join(out) + "\n"
