# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The pages of the website as the translation tools see them: a small HTML reader that keeps every offset, the messages a
page marks for translation, the unmarked text a translatable page still has, and the way a translation goes back in.

The convention (docs/translating.md) is made of `data-*` attributes on the Italian page:

    data-t="key"                the content of the element is a message; elements inside it (links, strong, span…) become
                                numbered tags <1>…</1> (or <1/> when empty), their attributes stay in the page
    data-t-<attr>="key"         the attribute <attr> (alt, title, aria-label, placeholder, content…) is a message
    data-t-plurale="…{n}…"      the content is the singular and this the plural of a message that counts {n} things
    data-t-n="3"                the count, when the page itself shows the plural for a known number
    data-t-nota="…"             a note for the translator, copied to the catalogue
    data-t-no="reason"          text or attributes here are deliberately not translated

The text of the page is the Italian text: a page opened as it is stays readable, and the Italian site is the page itself.
"""
import html
import json
import re
from dataclasses import dataclass, field

VUOTI = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
TESTO_PURO = {"script", "style"}
IN_RIGA = {"a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "s", "samp", "small",
           "span", "strong", "sub", "sup", "time", "u", "var", "wbr"}
ATTRIBUTI = ("alt", "title", "aria-label", "aria-description", "aria-placeholder", "aria-roledescription", "placeholder", "content", "value", "data-lungo")
MODIFICATORI = {"plurale", "n", "nota", "no"}
SPAZIO = re.compile(r"[ \t\r\n\f]+")
SEGNAPOSTO = re.compile(r"\{\{kalliope\.[a-z0-9.]+\}\}|\{[A-Za-z_][A-Za-z0-9_]*\}")


class ErrorePagina(Exception):
    pass


# ---------- il lettore ----------
@dataclass
class Testo:
    s: int
    e: int
    raw: str
    padre: "Nodo" = None


@dataclass
class Commento:
    s: int
    e: int


@dataclass
class Nodo:
    tag: str
    attrs: list            # [(nome, valore grezzo o None, valore senza entità, inizio valore, fine valore)]
    s: int                 # inizio del tag di apertura
    se: int                # fine del tag di apertura
    figli: list = field(default_factory=list)
    padre: "Nodo" = None
    ce: int = None         # inizio del tag di chiusura
    cf: int = None         # fine del tag di chiusura
    autochiuso: bool = False

    def attr(self, nome):
        for n, raw, val, _, _ in self.attrs:
            if n == nome:
                return val if val is not None else ""
        return None

    def ha(self, nome):
        return any(a[0] == nome for a in self.attrs)

    @property
    def vuoto(self):
        return self.tag in VUOTI or self.autochiuso

    @property
    def interno(self):
        return (self.se, self.ce)


_ATTR = re.compile(r"""\s*([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?""")


def _tag_apertura(t, i):
    """Legge un tag di apertura a partire da t[i] == '<'. Torna (nome, attributi, fine, autochiuso)."""
    m = re.compile(r"<([A-Za-z][^\s/>]*)").match(t, i)
    nome = m.group(1).lower()
    j = m.end()
    attrs = []
    while True:
        while j < len(t) and t[j] in " \t\r\n\f":
            j += 1
        if j >= len(t):
            raise ErrorePagina(f"tag <{nome}> has no «>» (offset {i})")
        if t[j] == ">":
            return nome, attrs, j + 1, False
        if t.startswith("/>", j):
            return nome, attrs, j + 2, True
        a = _ATTR.match(t, j)
        if not a or a.end() == j:
            raise ErrorePagina(f"unreadable attribute in <{nome}> (offset {j}): {t[j:j + 30]!r}")
        if a.group(2) is not None:
            raw, ini = a.group(2), a.start(2)
        elif a.group(3) is not None:
            raw, ini = a.group(3), a.start(3)
        elif a.group(4) is not None:
            raw, ini = a.group(4), a.start(4)
        else:
            raw, ini = None, None
        val = html.unescape(raw) if raw is not None else None
        attrs.append((a.group(1).lower(), raw, val, ini, ini + len(raw) if raw is not None else None))
        j = a.end()


_CHIUSURA_IMPLICITA = ("li", "p", "dt", "dd", "tr", "td", "th", "option", "html", "body", "head")


def leggi(t):
    """Il testo di una pagina → il nodo radice (tag «#doc»). ErrorePagina se i tag non tornano."""
    radice = Nodo("#doc", [], 0, 0)
    pila = [radice]
    i, n = 0, len(t)
    while i < n:
        k = t.find("<", i)
        if k == -1:
            k = n
        if k > i:
            pila[-1].figli.append(Testo(i, k, t[i:k], pila[-1]))
        if k >= n:
            break
        if t.startswith("<!--", k):
            f = t.find("-->", k + 4)
            if f == -1:
                raise ErrorePagina("comment without an end")
            pila[-1].figli.append(Commento(k, f + 3)); i = f + 3; continue
        if t.startswith("<!", k) or t.startswith("<?", k):
            f = t.find(">", k)
            i = f + 1; continue
        if t.startswith("</", k):
            f = t.find(">", k)
            nome = t[k + 2:f].strip().lower()
            # un tag di chiusura chiude il più vicino aperto con quel nome; ciò che sta in mezzo, senza chiusura, era vuoto
            for p in range(len(pila) - 1, 0, -1):
                if pila[p].tag == nome:
                    for q in pila[p + 1:]:
                        if q.tag not in _CHIUSURA_IMPLICITA:
                            raise ErrorePagina(f"<{q.tag}> (offset {q.s}) is not closed before </{nome}> (offset {k})")
                    pila[p].ce, pila[p].cf = k, f + 1
                    del pila[p:]
                    break
            else:
                raise ErrorePagina(f"</{nome}> without an opening tag (offset {k})")
            i = f + 1; continue
        if re.compile(r"<[A-Za-z]").match(t, k):
            nome, attrs, fine, auto = _tag_apertura(t, k)
            nodo = Nodo(nome, attrs, k, fine, padre=pila[-1], autochiuso=auto)
            pila[-1].figli.append(nodo)
            if nome in TESTO_PURO and not auto:
                chiusura = re.compile(rf"</{nome}\s*>", re.I).search(t, fine)
                if not chiusura:
                    raise ErrorePagina(f"<{nome}> has no closing tag")
                if chiusura.start() > fine:
                    nodo.figli.append(Testo(fine, chiusura.start(), t[fine:chiusura.start()], nodo))
                nodo.ce, nodo.cf = chiusura.start(), chiusura.end()
                i = chiusura.end(); continue
            if not nodo.vuoto:
                pila.append(nodo)
            i = fine; continue
        # un «<» che non apre nulla è testo
        pila[-1].figli.append(Testo(k, k + 1, "<", pila[-1])); i = k + 1
    for q in pila[1:]:
        if q.tag not in _CHIUSURA_IMPLICITA:
            raise ErrorePagina(f"<{q.tag}> (offset {q.s}) is not closed")
    return radice


def cammina(nodo):
    for f in nodo.figli:
        yield f
        if isinstance(f, Nodo):
            yield from cammina(f)


def riga_di(t, offset):
    return t.count("\n", 0, offset) + 1


# ---------- i messaggi ----------
@dataclass
class Messaggio:
    chiave: str
    testo: str
    pagina: str = ""
    plurale: str = None
    nota: str = None
    tipo: str = "contenuto"   # contenuto | attributo
    attr: str = None
    nodo: Nodo = None
    tag: list = field(default_factory=list)
    riga: int = 0
    n: int = None


def normalizza_spazi(s):
    return SPAZIO.sub(" ", s).strip(" ")


def _escape_testo(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _attributi_t(nodo):
    """{attributo: chiave} dei data-t-<attributo>, e gli errori di scrittura."""
    out, errori = {}, []
    for nome, raw, val, _, _ in nodo.attrs:
        if nome.startswith("data-t-"):
            suffisso = nome[7:]
            if suffisso in MODIFICATORI:
                continue
            if suffisso not in ATTRIBUTI:
                errori.append(f"{nome}: not a translatable attribute (allowed: {', '.join(ATTRIBUTI)})")
            else:
                out[suffisso] = val
    return out, errori


def _serializza(nodo, tags, pagina, errori):
    out = []
    for c in nodo.figli:
        if isinstance(c, Testo):
            out.append(_escape_testo(html.unescape(c.raw)))
        elif isinstance(c, Commento):
            errori.append(f"{pagina}: a comment inside a message")
        else:
            if c.tag not in IN_RIGA:
                errori.append(f"{pagina}: <{c.tag}> inside a message: only {', '.join(sorted(IN_RIGA))} are allowed")
            for nome, *_ in c.attrs:
                if (nome == "data-t" or nome.startswith("data-t-")) and nome != "data-t-no":
                    errori.append(f"{pagina}: <{c.tag}> inside a message has {nome}: a message inside a message is not allowed")
            tags.append(c)
            n = len(tags)
            if c.vuoto or not c.figli:
                out.append(f"<{n}/>")
            else:
                out.append(f"<{n}>" + _serializza(c, tags, pagina, errori) + f"</{n}>")
    return "".join(out)


def messaggi(t, radice, pagina):
    """I messaggi segnati nella pagina, nell'ordine del documento, e gli errori di scrittura."""
    out, errori = [], []
    for nodo in cammina(radice):
        if not isinstance(nodo, Nodo):
            continue
        riga = riga_di(t, nodo.s)
        chiave = nodo.attr("data-t")
        attrs, err = _attributi_t(nodo)
        errori.extend(f"{pagina}:{riga}: <{nodo.tag}> {e}" for e in err)
        nota = nodo.attr("data-t-nota")
        if chiave is not None:
            if not chiave.strip():
                errori.append(f"{pagina}:{riga}: empty data-t"); continue
            if nodo.vuoto:
                errori.append(f"{pagina}:{riga}: <{nodo.tag}> has no content: data-t is of no use")
                continue
            tags, err2 = [], []
            testo = normalizza_spazi(_serializza(nodo, tags, f"{pagina}:{riga}", err2))
            errori.extend(err2)
            if not testo:
                errori.append(f"{pagina}:{riga}: the message «{chiave}» is empty")
            m = Messaggio(chiave, testo, pagina, plurale=nodo.attr("data-t-plurale"), nota=nota, nodo=nodo, tag=tags, riga=riga)
            if nodo.attr("data-t-n") is not None:
                m.n = int(nodo.attr("data-t-n"))
            if m.plurale is not None and tags:
                errori.append(f"{pagina}:{riga}: «{chiave}» has a plural and tags: plural messages are plain text")
            out.append(m)
        for attr, ch in attrs.items():
            val = nodo.attr(attr)
            if val is None:
                errori.append(f"{pagina}:{riga}: <{nodo.tag}> has data-t-{attr} but no {attr}")
                continue
            out.append(Messaggio(ch, normalizza_spazi(val), pagina, nota=nota, tipo="attributo", attr=attr, nodo=nodo, riga=riga))
    # la stessa chiave deve dire sempre le stesse parole
    viste = {}
    for m in out:
        if m.chiave in viste and (viste[m.chiave].testo != m.testo or viste[m.chiave].plurale != m.plurale):
            a = viste[m.chiave]
            errori.append(f"{pagina}:{m.riga}: the key «{m.chiave}» has two texts (the other is at line {a.riga}): «{a.testo}» and «{m.testo}»")
        viste.setdefault(m.chiave, m)
    return out, errori


def pagina_traducibile(t):
    return re.search(r"""\sdata-t(?:-[a-z-]+)?\s*=""", t) is not None


# ---------- il testo che nessuno ha segnato ----------
_META_NON_TESTO = {"viewport", "theme-color", "color-scheme", "text-scale", "robots", "generator", "og:type", "og:url", "og:image", "og:locale",
                   "og:site_name"}


def non_segnato(t, radice, pagina):
    """Testo che si vede o si sente leggere e che nessun data-t copre. Torna una lista di righe di errore."""
    errori = []

    def senza_no(n):
        while n is not None and n.tag != "#doc":
            if n.ha("data-t-no"):
                return False
            n = n.padre
        return True

    def passa(nodo, coperto):
        for c in nodo.figli:
            if isinstance(c, Testo):
                if nodo.tag in ("script", "style"):
                    continue
                if not coperto and c.raw.strip() and senza_no(nodo):
                    errori.append(f"{pagina}:{riga_di(t, c.s)}: text without data-t: «{normalizza_spazi(html.unescape(c.raw))[:60]}»")
            elif isinstance(c, Nodo):
                if c.tag == "meta":
                    nome = (c.attr("name") or c.attr("property") or "").lower()
                    if nome in _META_NON_TESTO:
                        continue
                attrs, _ = _attributi_t(c)
                if senza_no(c):
                    for a in ATTRIBUTI:
                        if not c.ha(a) or a in attrs or not (c.attr(a) or "").strip():
                            continue
                        if a == "content" and c.tag != "meta":
                            continue
                        if a == "value" and not (c.tag == "input" and (c.attr("type") or "").lower() in ("button", "submit", "reset")):
                            continue
                        errori.append(f"{pagina}:{riga_di(t, c.s)}: <{c.tag}> has {a}=«{normalizza_spazi(c.attr(a))[:50]}» without data-t-{a}")
                if c.tag in ("script", "style"):
                    continue
                passa(c, coperto or c.attr("data-t") is not None)
    passa(radice, False)
    return errori


# ---------- rimettere una traduzione nella pagina ----------
_TAG_MSG = re.compile(r"<(/?)(\d+)(/?)>")


def struttura(testo):
    """Il disegno dei tag di un messaggio: ([(tipo, numero)], {numero: tag che lo contiene}). ValueError se non è ben formato."""
    pezzi, pila, padri = [], [], {}
    for m in _TAG_MSG.finditer(testo):
        chiude, num, auto = m.group(1) == "/", int(m.group(2)), m.group(3) == "/"
        if chiude and auto:
            raise ValueError(f"«{m.group(0)}» is not a tag")
        pezzi.append(("c" if chiude else "s" if auto else "a", num))
        if chiude:
            if not pila or pila[-1] != num:
                raise ValueError(f"</{num}> does not close the last open tag")
            pila.pop()
        else:
            padri.setdefault(num, pila[-1] if pila else 0)
            if not auto:
                pila.append(num)
    if pila:
        raise ValueError(f"<{pila[-1]}> is not closed")
    return pezzi, padri


def verifica_tag(sorgente, traduzione):
    """Descrive in che cosa i tag della traduzione non sono quelli del sorgente (lista vuota se vanno bene)."""
    try:
        a, fa = struttura(sorgente)
    except ValueError as e:
        return [f"the original text has malformed tags: {e}"]
    try:
        b, fb = struttura(traduzione)
    except ValueError as e:
        return [f"broken tags: {e}"]
    errori = []

    def nome(x):
        return {"a": f"<{x[1]}>", "c": f"</{x[1]}>", "s": f"<{x[1]}/>"}[x[0]]
    ca, cb = sorted(a), sorted(b)
    if ca != cb:
        manca = [x for x in ca if x not in cb]
        piu = [x for x in cb if x not in ca]
        if manca:
            errori.append("missing tags " + ", ".join(nome(x) for x in manca))
        if piu:
            errori.append("extra or different tags: " + ", ".join(nome(x) for x in piu))
    elif fa != fb:
        errori.append("tags are inside other tags than in the original text (move the words, but a tag stays inside the same tag)")
    if re.search(r"&(?!(?:amp|lt|gt);)", traduzione):
        errori.append("a «&» that does not start &amp;, &lt; or &gt;: write the character itself")
    resto = _TAG_MSG.sub("", traduzione)
    if "<" in resto.replace("&lt;", "") or ">" in resto.replace("&gt;", ""):
        errori.append("a «<» or «>» that is not a tag: write &lt; or &gt;")
    return errori


def segnaposto(testo):
    """I segnaposto di un testo, {nome} e {{kalliope.x}}, in ordine e con le ripetizioni."""
    return sorted(SEGNAPOSTO.findall(testo))


def rendi_contenuto(msg, traduzione, doc):
    """Il testo tradotto di un messaggio di contenuto → l'HTML da mettere dentro l'elemento (i tag con gli attributi della pagina)."""
    out, pos = [], 0
    for m in _TAG_MSG.finditer(traduzione):
        out.append(traduzione[pos:m.start()])
        chiude, num, auto = m.group(1) == "/", int(m.group(2)), m.group(3) == "/"
        nodo = msg.tag[num - 1]
        if chiude:
            out.append(f"</{nodo.tag}>")
        elif auto:
            out.append(doc[nodo.s:nodo.se] + ("" if nodo.vuoto else f"</{nodo.tag}>"))
        else:
            out.append(doc[nodo.s:nodo.se])
        pos = m.end()
    out.append(traduzione[pos:])
    return "".join(out)   # nel messaggio «&», «<» e «>» sono già scritti &amp; &lt; &gt;


def rendi_attributo(traduzione):
    return traduzione.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


@dataclass
class Plurale:
    """La traduzione di un messaggio al plurale: una forma per categoria della lingua."""
    forme: list
    nomi: list


def sostituzioni(doc, msgs, tradotte, indice_plurale=None, numero=str):
    """Le modifiche (inizio, fine, nuovo testo) che mettono le traduzioni nella pagina.

    `tradotte` dà per ogni chiave la traduzione (una stringa, o un Plurale). Un messaggio la cui traduzione è uguale al
    sorgente non si tocca: la pagina in italiano resta com'è, byte per byte. Un messaggio al plurale porta con sé tutte le
    forme (data-t-forme e data-t-nomi, per lo script) e mostra quella del suo conteggio, se la pagina lo dice."""
    mod = []
    for m in msgs:
        tr = tradotte.get(m.chiave)
        if tr is None:
            continue
        if isinstance(tr, Plurale):
            n = m.n if m.n is not None else 1
            scelta = tr.forme[indice_plurale(n)] if indice_plurale else tr.forme[0]
            testo = scelta.replace("{n}", numero(n)) if m.n is not None else scelta
            s, e = m.nodo.interno
            mod.append((s, e, _escape_testo(html.unescape(testo)) if "<" not in testo else testo))
            extra = f' data-t-forme="{rendi_attributo(json.dumps(tr.forme, ensure_ascii=False))}" data-t-nomi="{" ".join(tr.nomi)}"'
            mod.append((m.nodo.se - 1, m.nodo.se - 1, extra))
            continue
        if tr == m.testo:
            continue
        if m.tipo == "contenuto":
            s, e = m.nodo.interno
            vecchio = doc[s:e]
            lead = vecchio[:len(vecchio) - len(vecchio.lstrip(" \t\r\n\f"))]
            trail = vecchio[len(vecchio.rstrip(" \t\r\n\f")):]
            mod.append((s, e, lead + rendi_contenuto(m, tr, doc) + trail))
        else:
            for nome, raw, val, ini, fine in m.nodo.attrs:
                if nome == m.attr and raw is not None:
                    mod.append((ini, fine, rendi_attributo(tr)))
                    break
    return mod


def applica(doc, mod):
    mod = sorted(mod, key=lambda x: (x[0], x[1]))
    for (s1, e1, _), (s2, e2, _) in zip(mod, mod[1:]):
        if s2 < e1:
            raise ErrorePagina(f"two edits overlap ({s1}-{e1} and {s2}-{e2})")
    for s, e, nuovo in reversed(mod):
        doc = doc[:s] + nuovo + doc[e:]
    return doc
