# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Plural forms: from CLDR rules to a gettext `Plural-Forms` header, and a small evaluator for such headers.

CLDR writes a plural rule as `n % 10 = 2..4 and n % 100 != 12..14 @integer 2~4, 22~24 ...`. A .po file counts
whole numbers only, so the operands are those of an integer: i = n, and v = w = f = t = c = e = 0. The forms of a
language are the categories CLDR defines for it, in the CLDR order (zero, one, two, few, many, other); `other`
is always the last, and a category only decimals reach (Czech `many`) has a field but no condition. `espressione()` writes the C expression gettext wants; `valuta()` reads one back, so a header that
a translation tool wrote is compared with the CLDR rule by meaning and not by its spelling.
"""
import re

CATEGORIE = ["zero", "one", "two", "few", "many", "other"]


# ---------- la regola CLDR ----------
def _spezza(regola):
    """La parte prima di «@integer»: un elenco di condizioni unite da or, ciascuna una lista di relazioni unite da and."""
    cond = regola.split("@")[0].strip()
    if not cond:
        return None
    return [[r.strip() for r in re.split(r"\s+and\s+", gruppo.strip())] for gruppo in re.split(r"\s+or\s+", cond)]


_REL = re.compile(r"^(?P<op>[nivwftce])(?:\s*(?:%|mod)\s*(?P<mod>\d+))?\s*(?P<neg>!?=)\s*(?P<lista>.+)$")


def _intervalli(lista):
    out = []
    for parte in lista.split(","):
        parte = parte.strip()
        if ".." in parte:
            a, b = parte.split("..")
            out.append((int(a), int(b)))
        else:
            out.append((int(parte), int(parte)))
    return out


def _relazione(testo):
    """(operando, modulo|None, negata, intervalli) o una costante True/False per gli operandi che per un intero valgono 0."""
    m = _REL.match(testo)
    if not m:
        raise ValueError(f"CLDR rule not understood: {testo!r}")
    op, mod, neg, intervalli = m["op"], m["mod"], m["neg"] == "!=", _intervalli(m["lista"])
    if op in "vwftce":   # per un intero valgono tutti 0
        dentro = any(a <= 0 <= b for a, b in intervalli)
        return (not dentro) if neg else dentro
    return ("n", int(mod) if mod else None, neg, intervalli)


def analizza(regola):
    """Regola → lista di gruppi (or) di relazioni (and); None se vuota (la categoria «other»); True/False se costante."""
    gruppi = _spezza(regola)
    if gruppi is None:
        return None
    out = []
    for g in gruppi:
        rel = [_relazione(r) for r in g]
        if any(r is False for r in rel):
            continue
        rel = [r for r in rel if r is not True]
        if not rel:
            return True   # un gruppo sempre vero: la regola è sempre vera
        out.append(rel)
    return out if out else False


def categoria_di(regole, n):
    """La categoria CLDR dell'intero n secondo le regole {categoria: testo}."""
    for cat in CATEGORIE[:-1]:
        if cat in regole and _vera(analizza(regole[cat]), n):
            return cat
    return "other"


def _vera(a, n):
    if a is None or a is False:
        return False
    if a is True:
        return True
    for gruppo in a:
        if all(_rel_vera(r, n) for r in gruppo):
            return True
    return False


def _rel_vera(r, n):
    _, mod, neg, intervalli = r
    v = n % mod if mod else n
    dentro = any(a <= v <= b for a, b in intervalli)
    return (not dentro) if neg else dentro


# ---------- l'espressione di gettext ----------
def _c_relazione(r):
    _, mod, neg, intervalli = r
    x = f"n%{mod}" if mod else "n"
    parti = []
    for a, b in intervalli:
        parti.append(f"{x}=={a}" if a == b else f"({x}>={a} && {x}<={b})")
    if len(parti) == 1:
        p = parti[0]
        if neg:
            if "&&" in p:
                return f"!{p}"
            return p.replace("==", "!=")
        return p
    s = " || ".join(parti)
    return f"!({s})" if neg else f"({s})"


def _c_condizione(a):
    gruppi = []
    for g in a:
        gruppi.append(" && ".join(_c_relazione(r) for r in g))
    if len(gruppi) == 1:
        return gruppi[0]
    return " || ".join(f"({g})" if "&&" in g else g for g in gruppi)


def forme(regole):
    """Le categorie che CLDR definisce per la lingua, nell'ordine CLDR; «other» è sempre l'ultima.

    Sono anche quelle che una regola raggiunge soltanto con i decimali (il «many» del ceco): un file .po ha un campo per
    ciascuna, come lo scrivono gli strumenti dei traduttori. Un numero intero non le raggiunge, e l'espressione non le usa."""
    return [c for c in CATEGORIE[:-1] if c in regole and regole[c].split("@")[0].strip()] + ["other"]


def espressione(regole):
    """«nplurals=N; plural=…;» per le regole CLDR {categoria: testo}."""
    elenco = forme(regole)
    if len(elenco) == 1:
        return "nplurals=1; plural=0;"
    corpo = str(len(elenco) - 1)
    for i in range(len(elenco) - 2, -1, -1):
        a = analizza(regole[elenco[i]])
        if a is False:
            continue   # una categoria che un intero non raggiunge (il «many» del ceco) non ha condizione
        corpo = f"{_c_condizione(a)} ? {i} : {corpo}"
    return f"nplurals={len(elenco)}; plural=({corpo});"


# ---------- leggere un'espressione di gettext ----------
_TOK = re.compile(r"\s*(?:(\d+)|(n)|(==|!=|<=|>=|&&|\|\||[%<>!?:()]))")


def _tokens(s):
    pos, out = 0, []
    s = s.strip()
    while pos < len(s):
        m = _TOK.match(s, pos)
        if not m:
            raise ValueError(f"invalid expression in «{s}» at {pos}")
        out.append(m.group(m.lastindex))
        pos = m.end()
    return out


class _Parser:
    def __init__(self, tokens):
        self.t, self.i = tokens, 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def next(self):
        v = self.peek(); self.i += 1; return v

    def espr(self):
        c = self.logico_or()
        if self.peek() == "?":
            self.next(); a = self.espr()
            if self.next() != ":":
                raise ValueError("missing «:» in the expression")
            b = self.espr()
            return ("?", c, a, b)
        return c

    def logico_or(self):
        a = self.logico_and()
        while self.peek() == "||":
            self.next(); a = ("||", a, self.logico_and())
        return a

    def logico_and(self):
        a = self.uguaglianza()
        while self.peek() == "&&":
            self.next(); a = ("&&", a, self.uguaglianza())
        return a

    def uguaglianza(self):
        a = self.relazione()
        while self.peek() in ("==", "!="):
            op = self.next(); a = (op, a, self.relazione())
        return a

    def relazione(self):
        a = self.modulo()
        while self.peek() in ("<", ">", "<=", ">="):
            op = self.next(); a = (op, a, self.modulo())
        return a

    def modulo(self):
        a = self.unario()
        while self.peek() == "%":
            self.next(); a = ("%", a, self.unario())
        return a

    def unario(self):
        if self.peek() == "!":
            self.next(); return ("!", self.unario())
        return self.primario()

    def primario(self):
        v = self.next()
        if v == "(":
            e = self.espr()
            if self.next() != ")":
                raise ValueError("missing «)»")
            return e
        if v == "n":
            return ("n",)
        if v is not None and v.isdigit():
            return ("#", int(v))
        raise ValueError(f"unexpected element: {v!r}")


def _ev(e, n):
    k = e[0]
    if k == "#": return e[1]
    if k == "n": return n
    if k == "!": return int(not _ev(e[1], n))
    if k == "?": return _ev(e[2], n) if _ev(e[1], n) else _ev(e[3], n)
    a, b = _ev(e[1], n), _ev(e[2], n)
    return {"%": lambda: a % b, "==": lambda: int(a == b), "!=": lambda: int(a != b), "<": lambda: int(a < b), ">": lambda: int(a > b),
            "<=": lambda: int(a <= b), ">=": lambda: int(a >= b), "&&": lambda: int(bool(a) and bool(b)), "||": lambda: int(bool(a) or bool(b))}[k]()


def leggi_intestazione(testo):
    """«nplurals=3; plural=(…);» → (nplurals, funzione n → indice). ValueError se non si legge."""
    m = re.match(r"^\s*nplurals\s*=\s*(\d+)\s*;\s*plural\s*=\s*(.+?);?\s*$", testo or "", re.S)
    if not m:
        raise ValueError("Plural-Forms is not in the form «nplurals=N; plural=EXPRESSION;»")
    nplurals = int(m.group(1))
    p = _Parser(_tokens(m.group(2)))
    albero = p.espr()
    if p.peek() is not None:
        raise ValueError("text left after the Plural-Forms expression")
    return nplurals, (lambda n: _ev(albero, n))


CAMPIONE = list(range(0, 1201)) + [k * 1000000 + d for k in range(1, 5) for d in (0, 1, 2, 5)] + [10 ** 9, 10 ** 12]


def confronta(regole, intestazione):
    """Descrive in che cosa l'intestazione non è quella delle regole CLDR (lista vuota se è equivalente)."""
    attesa = forme(regole)
    try:
        n_header, f = leggi_intestazione(intestazione)
    except ValueError as e:
        return [str(e)]
    if n_header != len(attesa):
        return [f"nplurals={n_header}, but the language has {len(attesa)} forms ({', '.join(attesa)}): use «{espressione(regole)}»"]
    for n in CAMPIONE:
        voluto = attesa.index(categoria_di(regole, n))
        try:
            dato = f(n)
        except ZeroDivisionError:
            return ["division by zero in the Plural-Forms expression"]
        if dato != voluto:
            return [f"for n={n} the form is {dato}, the CLDR rule ({attesa[voluto]}) wants index {voluto}: use «{espressione(regole)}»"]
    return []
