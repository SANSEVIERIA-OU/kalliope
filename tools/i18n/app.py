# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The messages of the program, read from its sources, for the one catalogue (docs/translating.md, «The program»).

Two kinds of source, one key each, written where the text is:

    .slint   @tr("programma.finestra.riunione" => "Riunione")
             @tr("programma.crea.tratti" => "Ho trovato {n} tratto." | "Ho trovato {n} tratti." % count)
             {} and {0} {1} are the arguments after the text, in order; {n} is the count of a plural
    .rs      tr!("programma.sessione.parlo" => "Sto parlando…")
             trn!("programma.crea.mancano" => "Ne manca {n}." | "Ne mancano {n}.", count, nome = valore)
             {name} is the argument `name = value`; {n} is the count of a plural

The key is the `msgctxt` of the entry, like the keys of the website, and starts with `programma.` (the website's never do). The text
in the source is the Italian text, the `msgid`. A comment `// TRANSLATORS: …` on the line above the call, or after it on its
line, goes to the translators; `// TRANSLATORS(programma.key): …` anywhere in the same file goes to the message with that key
(for a line with several calls). Only the Python standard library.
"""
import pathlib
import re
from dataclasses import dataclass, field

CHIAVE = re.compile(r"^programma\.[a-z0-9]+(?:[.-][a-z0-9]+)*$")
# {} {0} {n} {name}, and {{ }} for a brace written as itself
SEGNAPOSTO = re.compile(r"\{\{|\}\}|\{(\d*|[A-Za-z_][A-Za-z0-9_]*)\}")
NOTA = re.compile(r"TRANSLATORS:\s*(.*)")
NOTA_CHIAVE = re.compile(r"TRANSLATORS\(([^)\s]+)\):\s*(.*)")
_RUST_RAW = re.compile(r'r(#*)"')
_RUST_CHAR = re.compile(r"'(?:\\u\{[0-9a-fA-F]+\}|\\.|[^\\'])'")
_RUST_CALL = re.compile(r"(?<![A-Za-z0-9_])(trn?)!\s*\(")


class ErroreApp(Exception):
    pass


@dataclass
class MessaggioApp:
    chiave: str
    testo: str
    plurale: str = None
    pagina: str = ""
    riga: int = 0
    nota: str = None
    formato: str = "slint"   # slint (argomenti per posto) | rust (argomenti per nome)
    tipo: str = "app"
    attr: str = None
    tag: tuple = ()
    usi: set = field(default_factory=set)


# ---------- i segnaposto ----------
def segnaposto(testo):
    """I segnaposto di un testo, nell'ordine in cui compaiono: «{}», «{0}», «{n}», «{nome}» (non le parentesi doppie)."""
    return [m.group(1) for m in SEGNAPOSTO.finditer(testo) if m.group(1) is not None]


def indici_slint(testo):
    """I segnaposto di un testo Slint come nomi: «{}» diventa 0, 1, 2… per posto, «{1}» resta 1, «{n}» resta n.
    ([nomi], usa_vuoti, usa_numeri): Slint non ammette «{}» e «{0}» nello stesso testo."""
    nomi, prossimo, vuoti, numeri = [], 0, False, False
    for s in segnaposto(testo):
        if s == "":
            nomi.append(str(prossimo)); prossimo += 1; vuoti = True
        else:
            nomi.append(s)
            numeri = numeri or s.isdigit()
    return nomi, vuoti, numeri


def problemi_origine(m):
    """Gli errori di scrittura del testo in un sorgente (segnaposto del formato sbagliato)."""
    out = []
    for parte in (m.testo, m.plurale):
        if parte is None:
            continue
        if m.formato == "slint":
            nomi, vuoti, numeri = indici_slint(parte)
            if vuoti and numeri:
                out.append(f"{m.chiave}: «{{}}» and «{{0}}» in the same text: Slint takes one or the other")
            for s in segnaposto(parte):
                if s and not s.isdigit() and s != "n":
                    out.append(f"{m.chiave}: «{{{s}}}»: a Slint text has only {{}}, {{0}}… and {{n}} (the count of a plural)")
            if "n" in nomi and m.plurale is None:
                out.append(f"{m.chiave}: «{{n}}» is the count of a plural: this text has no plural form")
        else:
            for s in segnaposto(parte):
                if s == "" or s.isdigit():
                    out.append(f"{m.chiave}: «{{{s}}}»: a Rust text names its arguments: {{name}} for `name = value`, {{n}} for the count")
    return out


# ---------- le stringhe dei sorgenti ----------
_ESC = {"n": "\n", "t": "\t", "r": "\r", '"': '"', "\\": "\\", "'": "'", "0": "\0"}


def _stringa(t, i, linguaggio):
    """Legge il letterale che comincia in t[i] == '"'. (testo, indice dopo)."""
    j, out = i + 1, []
    while j < len(t):
        c = t[j]
        if c == '"':
            return "".join(out), j + 1
        if c == "\\":
            d = t[j + 1:j + 2]
            if d == "u" and t[j + 2:j + 3] == "{":
                fine = t.index("}", j)
                out.append(chr(int(t[j + 3:fine], 16)))
                j = fine + 1
            elif linguaggio == "rust" and d == "\n":      # «\» a fine riga: salta gli spazi che seguono
                j += 2
                while j < len(t) and t[j] in " \t\r\n":
                    j += 1
            elif linguaggio == "rust" and d == "\r" and t[j + 2:j + 3] == "\n":
                j += 3
                while j < len(t) and t[j] in " \t\r\n":
                    j += 1
            elif d == "{" and linguaggio == "slint":
                raise ErroreApp("a string with \\{…} inside @tr is not a plain literal")
            elif d == "x":
                out.append(chr(int(t[j + 2:j + 4], 16))); j += 4
            elif d in _ESC:
                out.append(_ESC[d]); j += 2
            else:
                raise ErroreApp(f"unknown escape \\{d}")
        else:
            out.append(c); j += 1
    raise ErroreApp("unterminated string")


class _Lettore:
    """Un sorgente Slint o Rust: salta commenti e stringhe, e dice dove stanno le chiamate di traduzione."""

    def __init__(self, testo, linguaggio):
        self.t, self.l = testo, linguaggio
        self.righe = [0]
        for k, c in enumerate(testo):
            if c == "\n":
                self.righe.append(k + 1)
        self.note = {}   # riga → testo del commento TRANSLATORS
        self.note_chiave = {}   # chiave → testo del commento TRANSLATORS(chiave), ovunque nel file

    def riga(self, i):
        import bisect
        return bisect.bisect_right(self.righe, i)

    def salta_spazi(self, i):
        t = self.t
        while i < len(t):
            if t[i] in " \t\r\n":
                i += 1
            elif t.startswith("//", i):
                j = t.find("\n", i)
                j = len(t) if j < 0 else j
                commento = t[i + 2:j]
                if mc := NOTA_CHIAVE.search(commento):
                    self.note_chiave[mc.group(1)] = mc.group(2).strip()
                elif m := NOTA.search(commento):
                    self.note[self.riga(i)] = m.group(1).strip()
                i = j
            elif t.startswith("/*", i):
                j = t.find("*/", i + 2)
                i = len(t) if j < 0 else j + 2
            else:
                break
        return i

    def letterale(self, i, cosa):
        i = self.salta_spazi(i)
        if self.t[i:i + 1] != '"':
            raise ErroreApp(f"{cosa} must be a string literal")
        return _stringa(self.t, i, self.l)

    def salta_argomenti(self, i):
        """Dall'indice dopo il testo fino alla parentesi che chiude la chiamata; ritorna quell'indice."""
        t, profondita = self.t, 1
        while i < len(t):
            c = t[i]
            if c == '"':
                _, i = _stringa(t, i, self.l); continue
            if t.startswith("//", i) or t.startswith("/*", i):
                i = self.salta_spazi(i); continue
            if c in "([{":
                profondita += 1
            elif c in ")]}":
                profondita -= 1
                if profondita == 0:
                    return i
            i += 1
        raise ErroreApp("the call is not closed")

    def chiamate(self):
        """Le posizioni delle chiamate di traduzione del sorgente: l'indice dopo la parentesi (Rust: con «è plurale»)."""
        t, out, i = self.t, [], 0
        while i < len(t):
            c = t[i]
            if c == '"':
                _, i = _stringa(t, i, self.l); continue
            if self.l == "rust":
                if c == "r" and (m := _RUST_RAW.match(t, i)) and (i == 0 or not (t[i - 1].isalnum() or t[i - 1] == "_")):
                    fine = t.find('"' + m.group(1), m.end())
                    i = len(t) if fine < 0 else fine + 1 + len(m.group(1)); continue
                if c == "'":
                    m = _RUST_CHAR.match(t, i)
                    i = m.end() if m else i + 1
                    continue
            if t.startswith("//", i) or t.startswith("/*", i):
                i = self.salta_spazi(i); continue
            if self.l == "slint" and t.startswith("@tr(", i):
                out.append(i + 4); i += 4; continue
            if self.l == "rust" and c in "tT" and (m := _RUST_CALL.match(t, i)):
                out.append((m.end(), m.group(1) == "trn")); i = m.end(); continue
            i += 1
        return out


def _leggi_chiamata(L, i, pos_attesa_plurale=None):
    """(chiave, testo, plurale) della chiamata che comincia in t[i]."""
    primo, i = L.letterale(i, "the key")
    i = L.salta_spazi(i)
    if L.t[i:i + 2] != "=>":
        raise ErroreApp(f"«{primo}»: the text needs its key before it: \"programma.where.what\" => \"text\"")
    chiave = primo
    testo, i = L.letterale(i + 2, "the text")
    i = L.salta_spazi(i)
    plurale = None
    if L.t[i:i + 1] == "|":
        plurale, i = L.letterale(i + 1, "the plural form")
    return chiave, testo, plurale


def leggi_sorgente(testo, nome, linguaggio):
    """([MessaggioApp], [errori]) di un sorgente."""
    L = _Lettore(testo, linguaggio)
    messaggi, errori, usate = [], [], set()
    try:
        chiamate = L.chiamate()
    except (ErroreApp, ValueError) as e:
        return [], [f"{nome}: {e}"]
    for c in chiamate:
        i, plurale_atteso = (c, None) if linguaggio == "slint" else c
        riga = L.riga(i)
        try:
            chiave, t, plurale = _leggi_chiamata(L, i)
            L.salta_argomenti(L.salta_spazi(i))  # solo per controllare che la chiamata si chiuda
        except (ErroreApp, ValueError) as e:
            errori.append(f"{nome}:{riga}: {e}"); continue
        if linguaggio == "rust" and plurale_atteso and plurale is None:
            errori.append(f"{nome}:{riga}: trn! needs a plural form: \"singular\" | \"plural\""); continue
        if linguaggio == "rust" and not plurale_atteso and plurale is not None:
            errori.append(f"{nome}:{riga}: tr! has no plural form: use trn!"); continue
        if not CHIAVE.match(chiave):
            errori.append(f"{nome}:{riga}: the key «{chiave}» is not programma.word[.word][-word]: lowercase letters, digits, dots and dashes"); continue
        m = MessaggioApp(chiave, t, plurale, nome, riga, formato=linguaggio)
        # la nota: sulla riga della chiamata, o su quella sopra se è soltanto un commento; ogni nota serve una chiamata sola
        for r in (riga, riga - 1):
            if r in L.note and r not in usate:
                sola = r == riga or L.t[L.righe[r - 1]:L.righe[r]].strip().startswith("//")
                if sola:
                    m.nota = L.note[r]; usate.add(r)
                    break
        if chiave in L.note_chiave:
            m.nota = L.note_chiave[chiave]
        for p in problemi_origine(m):
            errori.append(f"{nome}:{riga}: {p}")
        messaggi.append(m)
    chiavi = {m.chiave for m in messaggi}
    for k in L.note_chiave:
        if k not in chiavi:
            errori.append(f"{nome}: the note TRANSLATORS({k}) names a key that no call of this file has")
    return messaggi, errori


# ---------- il programma ----------
def sorgenti(radice):
    """[(percorso, linguaggio)] del programma sotto `radice` (la cartella crates/): le interfacce .slint e i sorgenti .rs."""
    radice = pathlib.Path(radice)
    out = []
    for f in sorted(radice.rglob("*.slint")):
        parti = f.relative_to(radice).parts
        if "ui" in parti:
            out.append((f, "slint"))
    for f in sorted(radice.rglob("*.rs")):
        parti = f.relative_to(radice).parts
        # crates/i18n defines the macros, and its tests use keys that are not messages
        if "src" in parti and "target" not in parti and parti[0] != "i18n":
            out.append((f, "rust"))
    return out


def raccogli(radice):
    """({chiave: MessaggioApp}, errori): ogni chiave una volta, con lo stesso testo dove si ripete."""
    radice = pathlib.Path(radice)
    tutti, errori = {}, []
    for f, linguaggio in sorgenti(radice):
        testo = f.read_text(encoding="utf-8")
        if linguaggio == "slint" and testo.startswith("// Generated"):
            continue
        nome = f.relative_to(radice.parent).as_posix() if radice.parent != radice else f.name
        msgs, err = leggi_sorgente(testo, nome, linguaggio)
        errori.extend(err)
        for m in msgs:
            a = tutti.get(m.chiave)
            m.usi = {m.pagina}
            if a is None:
                tutti[m.chiave] = m
            else:
                if a.testo != m.testo or a.plurale != m.plurale:
                    errori.append(f"{m.pagina}:{m.riga}: the key «{m.chiave}» has another text in {a.pagina}:{a.riga}")
                elif a.formato != m.formato:
                    errori.append(f"{m.pagina}:{m.riga}: the key «{m.chiave}» is used by a Slint file and a Rust file: write two keys")
                if m.nota and not a.nota:
                    a.nota = m.nota
                a.usi |= {m.pagina}
    return tutti, errori


# ---------- il controllo di una traduzione ----------
def nomi_segnaposto(testo, formato):
    """I segnaposto di un testo come nomi: in Slint «{}» diventa 0, 1, 2… per posto; in Rust sono già nomi."""
    return indici_slint(testo)[0] if formato == "slint" else segnaposto(testo)


def controlla_testo(m, tradotto, forma_plurale):
    """Gli errori di segnaposto di una traduzione (una forma) contro il messaggio `m` (una voce del modello): niente di più di
    quelli dell'originale; in un testo senza plurale, niente di meno; in Slint, «{}» e «{0}» non insieme."""
    out = []
    formato = "slint" if "kalliope-slint" in m.flags else "rust"
    a = set(nomi_segnaposto(m.id + " " + (m.id_plurale or ""), formato))
    b = nomi_segnaposto(tradotto, formato)
    if formato == "slint":
        _, vuoti, numeri = indici_slint(tradotto)
        if vuoti and numeri:
            out.append(f"{m.ctx}: «{{}}» and «{{0}}» in the same text: Slint takes one or the other")
    extra = sorted({x for x in b if x not in a})
    if extra:
        out.append(f"{m.ctx}: placeholders the original does not have: " + " ".join("{" + x + "}" for x in extra))
    if m.id_plurale is None:
        mancanti = sorted(a - set(b))
        if mancanti:
            out.append(f"{m.ctx}: placeholders missing from the translation: " + " ".join("{" + x + "}" for x in mancanti))
    return out
