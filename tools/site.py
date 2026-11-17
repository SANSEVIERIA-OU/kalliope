# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Build the website, in every language that is ready, with the design system and the release to download.

    python3 -I tools/site.py --out DIR [--release-json FILE] [--pseudo] [--languages it,en] [--base-url URL] [--no-selector] [--website DIR --system DIR]

The site is a tree of languages: DIR/it/, DIR/en/ … hold the same pages with the same names, and DIR/ itself is the page
where a visitor chooses the language (hreflang x-default). Files shared by the languages (design-system/, voce/,
immagini/, scena.js …) stay at the top. The pages under website/ are written in Italian and mark what a translator
sees with data-t attributes; the translations are website/lingue/<xx>.po (docs/translating.md). A language is built when
its .po file is complete and checked: with a missing, fuzzy or out-of-date entry, or a broken tag or placeholder, it is
left out, and this build says so. Italian, the language of the pages, is always built. Pages that mark nothing (the ones
not yet redone) are built in Italian only, and the other languages link to their Italian version.

Every page gets <html lang dir>; translated pages get a canonical link and hreflang for all the languages built. Old
addresses (/installa/, /ascolta/ …) are small pages that send to the Italian one: GitHub Pages has no server to redirect.

The pages never write a version or a package name by hand. They use these markers, replaced in every .html, .xml, .txt
and .webmanifest file, in the language of the page:

    {{kalliope.version}}        0.1-rc.1
    {{kalliope.tag}}            v0.1-rc.1
    {{kalliope.date}}           12 novembre 2026          (publication date, long form of the language, no-break spaces)
    {{kalliope.date.iso}}       2026-11-12
    {{kalliope.prerelease}}     "true" or "false"         (for data-* attributes)
    {{kalliope.release.url}}    the release page on GitHub
    {{kalliope.deb.url}}        {{kalliope.deb.size}}     {{kalliope.deb.name}}
    {{kalliope.rpm.url}}        {{kalliope.rpm.size}}     {{kalliope.rpm.name}}
    {{kalliope.tar.url}}        {{kalliope.tar.size}}     {{kalliope.tar.name}}
    {{kalliope.tar.dir}}        the folder the archive unpacks into
    {{kalliope.aur.url}}        the AUR recipe (kalliope-bin.PKGBUILD)
    {{kalliope.sums.url}}       SHA256SUMS
    {{kalliope.sha256.deb}}     {{kalliope.sha256.rpm}}   {{kalliope.sha256.tar}}

Dates and sizes come from the CLDR data of the language (tools/data/cldr.json, made by tools/cldr_data.py): Italian "14,1 MB",
English "14.1 MB", French "14,1 Mo". The release offered is the newest one that is not a prerelease; while there is none, the
newest prerelease. Release data comes from the public GitHub API (GH_TOKEN or GITHUB_TOKEN is used when set, to avoid the
anonymous rate limit), or from --release-json, a saved answer of `GET /repos/SANSEVIERIA-OU/kalliope/releases`, to work offline.

Options for tests, never for the published site:
    --pseudo        also build en-XA (accented, 40% longer) and ar-XB (right to left): the Italian catalogue run through
                    tools/i18n/pseudo.py. They are not in the chooser nor in any hreflang, and carry noindex.
    --languages     build only these languages (the check of the others is skipped)
    --base-url      the address the site will have, for canonical and hreflang (default: GitHub Pages)
    --website DIR, --system DIR   build from other copies of website/ and design-system/ (the tests do)
    --no-selector   leave out the language selector the pages have in their bar and foot (to compare the Italian pages
                    with those of before the languages)

The design system (tokens, base, components, fonts and its living catalogue) has its own folder, design-system/, because
the application will use it too. The build copies it into the site as design-system/, without its Markdown documents and
tool configuration; pages link to it as design-system/token.css, so they are complete only once built.

The build fails when a marker is unknown, a package is missing from the release, a page marks its texts wrongly, or a link
of a translated page does not lead anywhere, so a typo never reaches visitors. Standard library only.
"""
import json
import os
import pathlib
import posixpath
import re
import shutil
import sys
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from i18n import catalogo, cldr, pagina, plurali, pseudo  # noqa: E402

REPO = "SANSEVIERIA-OU/kalliope"
BASE_URL = "https://sansevieria-ou.github.io/kalliope/"
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "website"
SYSTEM = ROOT / "design-system"
SYSTEM_IN_SITE = "design-system"
SORGENTE = "it"
# Pages of the top of the site: published as they are, once, not per language. Source name → published name.
PAGINE_RADICE = {"404.html": "404.html", "lingue.html": "index.html"}
TEXT_SUFFIXES = {".html", ".xml", ".txt", ".webmanifest"}
MARKER = re.compile(r"\{\{kalliope\.([a-z0-9.]+)\}\}")
PACKAGES = {"deb": "-amd64.deb", "rpm": "-x86_64.rpm", "tar": "-linux-x86_64.tar.gz"}
LOCALIZZATI = {"date"} | {f"{k}.size" for k in PACKAGES}
ATTRIBUTI_URL = ("href", "src", "poster", "action", "formaction")


def fetch_releases():
    req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases?per_page=30",
                                 headers={"Accept": "application/vnd.github+json",
                                          "User-Agent": "kalliope-site-build"})
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def choose(releases):
    published = [r for r in releases if not r.get("draft")]
    stable = [r for r in published if not r.get("prerelease")]
    pool = stable or published
    if not pool:
        sys.exit("site.py: the repository has no published release")
    return max(pool, key=lambda r: r["published_at"])


def values(release):
    """The values of the markers that do not depend on the language, and the raw date and sizes that do."""
    tag = release["tag_name"]
    day = release["published_at"][:10]
    y, m, d = (int(x) for x in day.split("-"))
    v = {
        "version": tag.removeprefix("v"),
        "tag": tag,
        "date.iso": day,
        "prerelease": "true" if release.get("prerelease") else "false",
        "release.url": release["html_url"],
    }
    grezzi = {"date": (y, m, d)}
    assets = {a["name"]: a for a in release.get("assets", [])}
    for key, suffix in PACKAGES.items():
        found = [a for name, a in assets.items() if name.endswith(suffix)]
        if len(found) != 1:
            sys.exit(f"site.py: release {tag} has {len(found)} files ending in {suffix}, expected 1")
        a = found[0]
        v[f"{key}.url"] = a["browser_download_url"]
        grezzi[f"{key}.size"] = a["size"]
        v[f"{key}.name"] = a["name"]
        if key == "tar":
            # The archive unpacks into a folder with its own name.
            v["tar.dir"] = a["name"].removesuffix(".tar.gz")
        digest = a.get("digest") or ""
        v[f"sha256.{key}"] = digest.removeprefix("sha256:")
    for key, name in (("aur", "kalliope-bin.PKGBUILD"), ("sums", "SHA256SUMS")):
        if name not in assets:
            sys.exit(f"site.py: release {tag} has no {name}")
        v[f"{key}.url"] = assets[name]["browser_download_url"]
    return v, grezzi


def valori_lingua(v, grezzi, lingua):
    """The markers for a language: dates and sizes written as its CLDR data says."""
    out = dict(v)
    out["date"] = cldr.data_lunga(lingua, *grezzi["date"])
    for key in PACKAGES:
        out[f"{key}.size"] = cldr.dimensione(lingua, grezzi[f"{key}.size"])
    return out


def riempi(testo, v, dove, sconosciuti):
    def fill(m):
        key = m.group(1)
        if key not in v or not v[key]:
            sconosciuti.add(f"{dove}: {m.group(0)}")
            return m.group(0)
        return v[key]
    return MARKER.sub(fill, testo)


# ---------- le lingue ----------
class Lingua:
    def __init__(self, codice, bcp47, direzione, nome, tradotte=None, pubblicata=True, finta=False, plurale=None, numero=str, forme=None):
        self.codice, self.bcp47, self.direzione, self.nome = codice, bcp47, direzione, nome
        self.tradotte, self.pubblicata, self.finta = tradotte or {}, pubblicata, finta
        self.plurale, self.numero, self.forme = plurale, numero, forme or []

    @property
    def cartella(self):
        return self.codice


def traduzioni_di(codice, cat, mod):
    """{chiave: traduzione} di un catalogo completo (un Plurale per i messaggi al plurale)."""
    forme = cldr.info(codice)["plurali"]["forme"]
    out = {}
    per_chiave = cat.per_chiave()
    for t in mod.voci:
        v = per_chiave[t.ctx]
        out[t.ctx] = v.str[0] if t.id_plurale is None else pagina.Plurale(list(v.str), forme)
    return out


def lingue_da_costruire(mod, totale, cartella, solo, con_pseudo, giornale):
    """Le lingue che si costruiscono (l'italiano sempre), e il perché di quelle lasciate fuori."""
    out = {}
    info = cldr.info(SORGENTE)
    f_it = info["plurali"]["forme"]
    sorg = {}
    for t in mod.voci:
        sorg[t.ctx] = t.id if t.id_plurale is None else pagina.Plurale([t.id if f == "one" else t.id_plurale for f in f_it], f_it)
    indice = plurali.leggi_intestazione(info["plurali"]["intestazione"])[1]
    out[SORGENTE] = Lingua(SORGENTE, info["bcp47"], info["direzione"], info["nomeElenco"], sorg, True, False, indice, lambda n: cldr.numero(SORGENTE, n), f_it)
    for codice in catalogo.lingue_presenti(cartella):
        if codice == SORGENTE or (solo and codice not in solo):
            continue
        try:
            info = cldr.info(codice)
        except KeyError as e:
            giornale.append(f"language {codice}: left out, {e}")
            continue
        cat = catalogo.leggi_lingua(cartella, codice)
        e = catalogo.controlla(cat, mod, codice)
        if not e.completa:
            primo = (e.errori or [f"{c}: missing" for c in e.mancanti] or [f"{c}: Italian text changed" for c in e.fuori_data]
                     or [f"{c}: fuzzy" for c in e.fuzzy])[0]
            giornale.append(f"language {codice}: left out, {e.riassunto(totale)}; first: {primo}")
            continue
        out[codice] = Lingua(codice, info["bcp47"], info["direzione"], info["nomeElenco"], traduzioni_di(codice, cat, mod), True, False,
                             plurali.leggi_intestazione(info["plurali"]["intestazione"])[1], (lambda c: lambda n: cldr.numero(c, n))(codice),
                             info["plurali"]["forme"])
    if con_pseudo:
        voci = [(t.ctx, t.id, t.id_plurale) for t in mod.voci]
        for nome, dati in pseudo.PSEUDO.items():
            tr = pseudo.catalogo(nome, voci)
            forme_en = ["one", "other"]
            tr = {k: (pagina.Plurale([v[0], v[1]], forme_en) if isinstance(v, tuple) else v) for k, v in tr.items()}
            out[nome] = Lingua(nome, dati["bcp47"], dati["direzione"], dati["nome"], tr, False, True,
                               lambda n: 0 if n == 1 else 1, str, forme_en)
    return out


# ---------- l'insieme delle pagine ----------
class Sito:
    def __init__(self, website, system):
        self.website, self.system = website, system
        self.pagine = {}        # percorso relativo → testo, per le pagine delle lingue
        self.traducibili = {}   # percorso relativo → (testo, radice, messaggi)
        self.radice = {}        # nome pubblicato → testo, per le pagine in cima al sito
        self.risorse = []       # percorsi relativi dei file che non sono pagine
        for f in sorted(website.rglob("*")):
            rel = f.relative_to(website).as_posix()
            if f.is_dir() or rel.split("/")[0] == "lingue":
                continue
            if f.suffix == ".html":
                if rel in PAGINE_RADICE:
                    self.radice[PAGINE_RADICE[rel]] = f.read_text(encoding="utf-8")
                else:
                    self.pagine[rel] = f.read_text(encoding="utf-8")
            else:
                self.risorse.append(rel)
        for f in sorted(system.rglob("*")):
            if f.is_file() and f.suffix != ".md" and f.name != "metodo.config.mjs":
                self.risorse.append(f"{SYSTEM_IN_SITE}/{f.relative_to(system).as_posix()}")
        self.risorse_set = set(self.risorse)

    def indirizzo(self, rel):
        """L'indirizzo di una pagina («index.html» → «», «installa/index.html» → «installa/»)."""
        return rel[:-len("index.html")] if rel.endswith("index.html") else rel


# ---------- gli indirizzi ----------
def rimappa(valore, rel, cartella_lingua, sito, disponibile, avvisi, base_url=None):
    """Il nuovo valore di un indirizzo scritto in una pagina di partenza, per la pagina costruita nella cartella di una lingua.

    Le pagine delle lingue stanno in <lingua>/…; i file condivisi restano in cima al sito. Una pagina che nella lingua
    non c'è porta alla sua versione italiana. Con base_url si leggono anche gli indirizzi assoluti del sito
    (canonical, og:url) e si scrivono assoluti."""
    v = valore.strip()
    assoluto = False
    if base_url and (v.startswith(BASE_URL) or v.startswith(base_url)):
        # l'indirizzo del sito, com'è scritto nelle pagine (BASE_URL) o come lo vuole questa costruzione (--base-url)
        assoluto, v = True, (v[len(BASE_URL if v.startswith(BASE_URL) else base_url):] or "./")
    elif not v or v.startswith(("#", "{{", "/", "//", "?")) or re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", v):
        return None
    m = re.match(r"^([^?#]*)([?#].*)?$", v, re.S)
    percorso, coda = m.group(1), m.group(2) or ""
    cartella = "" if assoluto else posixpath.dirname(rel)
    destinazione = posixpath.normpath(posixpath.join(cartella, percorso)) if percorso else (cartella or ".")
    if destinazione == ".." or destinazione.startswith("../"):
        avvisi.append(f"{rel}: {valore!r} goes out of the site")
        return None
    e_cartella = percorso.endswith("/") or percorso in ("", ".", "..") or destinazione == "."
    indice = "index.html" if destinazione == "." else posixpath.join(destinazione, "index.html")
    if e_cartella or (indice in sito.pagine or indice in sito.risorse_set) and destinazione not in sito.risorse_set:
        pagina_rel, e_dir = indice, True
    else:
        pagina_rel, e_dir = destinazione, False
    if pagina_rel in sito.pagine:
        lingua = cartella_lingua if pagina_rel in disponibile.get(cartella_lingua, ()) else SORGENTE
        if pagina_rel not in disponibile.get(lingua, ()):
            avvisi.append(f"{rel}: {valore!r} does not lead to a built page")
            return None
        uscita, e_pagina = f"{lingua}/{sito.indirizzo(pagina_rel)}", e_dir or pagina_rel.endswith("index.html")
    elif pagina_rel in sito.risorse_set or destinazione in sito.risorse_set or destinazione in sito.radice or destinazione in PAGINE_RADICE.values():
        # un file condiviso, o una cartella di file condivisi (design-system/catalogo/)
        uscita = pagina_rel.removesuffix("index.html") if e_dir and pagina_rel in sito.risorse_set else destinazione
        e_pagina = e_dir and pagina_rel in sito.risorse_set
    else:
        avvisi.append(f"{rel}: {valore!r} leads nowhere (looked for {destinazione})")
        return None
    if assoluto:
        return base_url + uscita + coda
    partenza = f"{cartella_lingua}/{posixpath.dirname(rel)}".rstrip("/")
    r = posixpath.relpath(uscita.rstrip("/") or ".", partenza or ".")
    if uscita.endswith("/") or uscita == "":
        r = r.rstrip("/") + "/"
    if r == ".":
        r = "./"
    return r + coda


def passo_indirizzi(testo, rel, cartella_lingua, sito, disponibile, avvisi, base_url):
    radice = pagina.leggi(testo)
    mod = []
    for n in pagina.cammina(radice):
        if not isinstance(n, pagina.Nodo) or n.tag == "base":
            continue
        for nome, raw, val, ini, fine in n.attrs:
            if raw is None:
                continue
            assoluto = n.tag == "link" and nome == "href" or (n.tag == "meta" and nome == "content" and (n.attr("property") or "") == "og:url")
            if nome in ATTRIBUTI_URL or assoluto:
                nuovo = rimappa(val, rel, cartella_lingua, sito, disponibile, avvisi, base_url if assoluto else None)
                if nuovo is not None and nuovo != val:
                    mod.append((ini, fine, pagina.rendi_attributo(nuovo)))
    return pagina.applica(testo, mod)


# ---------- una pagina in una lingua ----------
def _attributi(nodo, tolti):
    return "".join(f' {n}="{r}"' if r is not None else f" {n}" for n, r, _, _, _ in nodo.attrs if n not in tolti)


def tag_html(nodo, lingua):
    """Il tag <html> con lang e dir della lingua, con gli altri attributi com'erano."""
    return f'<html lang="{lingua.bcp47}" dir="{lingua.direzione}"{_attributi(nodo, ("lang", "dir"))}>'


def html_escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def voce_elenco(modello_li, lingua_voce, href, corrente):
    """Una voce dell'elenco delle lingue, fatta sul modello della pagina (il primo <li>): il suo collegamento ha data-lingua."""
    r = pagina.leggi(modello_li)
    mod = []
    for n in pagina.cammina(r):
        if isinstance(n, pagina.Nodo) and n.ha("data-lingua"):
            extra = _attributi(n, ("data-lingua", "href", "hreflang", "lang", "dir", "aria-current", "data-t-no"))
            mod.append((n.s, n.cf, f'<{n.tag}{extra} href="{href}" hreflang="{lingua_voce.bcp47}" lang="{lingua_voce.bcp47}" '
                        f'data-lingua-codice="{lingua_voce.codice}"' + (' aria-current="true"' if corrente else "")
                        + f">{html_escape(lingua_voce.nome)}</{n.tag}>"))
    return pagina.applica(modello_li, mod)


def _antenato_li(nodo):
    """Il <li> più vicino che contiene il nodo (la voce della barra); il padre, se non ce n'è."""
    n = nodo.padre
    while n is not None and n.tag != "li":
        n = n.padre
    return n if n is not None else nodo.padre


def _dentro(nodo, antenato):
    while nodo is not None:
        if nodo is antenato:
            return True
        nodo = nodo.padre
    return False


def _spazio_prima(testo, offset):
    """Lo spazio fra l'ultimo a capo e offset (il rientro di una riga del sorgente)."""
    m = re.search(r"([ \t]*)$", testo[:offset])
    return m.group(1) if m else ""


def passo_struttura(testo, rel, lingua, reali, sito, senza_selettore, base_url, nella_radice=False):
    """<html lang dir>, l'elenco delle lingue, canonical e hreflang."""
    radice = pagina.leggi(testo)
    nodi = [n for n in pagina.cammina(radice) if isinstance(n, pagina.Nodo)]
    html_nodo = next((n for n in nodi if n.tag == "html"), None)
    head = next((n for n in nodi if n.tag == "head"), None)
    mod = []
    if html_nodo is not None:
        mod.append((html_nodo.s, html_nodo.se, tag_html(html_nodo, lingua)))
    cartella = posixpath.dirname(rel)
    in_vista = sorted((l for l in reali.values() if l.pubblicata), key=lambda x: x.codice)
    # senza selettore si toglie la voce della barra intera (il <li> che contiene il nome della lingua corrente, con ciò che ha dentro)
    voci_tolte = [_antenato_li(a) for a in nodi if a.ha("data-lingua-corrente")] if senza_selettore else []
    for ul in (n for n in nodi if n.attr("data-lingue") == "elenco"):
        if senza_selettore:
            if any(_dentro(ul, li) for li in voci_tolte):
                continue
            nav = ul.padre
            mod.append((nav.s, nav.cf, "") if nav is not None and nav.tag == "nav" else (ul.s, ul.cf, ""))
            continue
        li = next(f for f in ul.figli if isinstance(f, pagina.Nodo) and f.tag == "li")
        modello_li, rientro = testo[li.s:li.cf], _spazio_prima(testo, li.s)
        voci = []
        for l in in_vista:
            if nella_radice:
                href = f"{l.codice}/"
            else:
                href = posixpath.relpath(f"{l.codice}/{cartella}".rstrip("/") or ".", f"{lingua.codice}/{cartella}".rstrip("/") or ".") + "/"
            voci.append(voce_elenco(modello_li, l, href, l.codice == lingua.codice and not nella_radice))
        mod.append((ul.se, ul.ce, "\n" + rientro + ("\n" + rientro).join(voci) + "\n" + _spazio_prima(testo, ul.ce)))
    for a in (n for n in nodi if n.ha("data-lingua-corrente")):
        if senza_selettore:
            li = _antenato_li(a)
            mod.append((li.s, li.cf, ""))
        else:
            # l'elemento resta quello della pagina (un collegamento, o il nome dentro il comando che apre l'elenco)
            mod.append((a.s, a.cf, f'<{a.tag}{_attributi(a, ("data-lingua-corrente", "lang", "data-t-no"))} lang="{lingua.bcp47}">{html_escape(lingua.nome)}</{a.tag}>'))
    if head is not None:
        righe = []
        indirizzo = sito.indirizzo(rel) if not nella_radice else ""
        ha_canonical = any(n.tag == "link" and (n.attr("rel") or "").lower() == "canonical" for n in nodi)
        if lingua.finta:
            righe.append('<meta name="robots" content="noindex">')
        elif nella_radice or rel in sito.traducibili:
            if not ha_canonical:
                righe.append(f'<link rel="canonical" href="{base_url}{"" if nella_radice else lingua.codice + "/"}{indirizzo}">')
            righe.extend(f'<link rel="alternate" hreflang="{l.bcp47}" href="{base_url}{l.codice}/{indirizzo}">' for l in in_vista)
            righe.append(f'<link rel="alternate" hreflang="x-default" href="{base_url}">')
        if righe:
            mod.append((head.ce, head.ce, "\n".join(righe) + "\n"))
    return pagina.applica(testo, mod)


def costruisci_pagina(rel, testo, lingua, reali, sito, disponibile, v_lingua, sconosciuti, avvisi, opzioni):
    """L'HTML di una pagina in una lingua."""
    if rel in sito.traducibili:
        radice = pagina.leggi(testo)
        msgs, err = pagina.messaggi(testo, radice, rel)
        if err:
            sys.exit("site.py: " + "; ".join(err))
        testo = pagina.applica(testo, pagina.sostituzioni(testo, msgs, lingua.tradotte, lingua.plurale, lingua.numero))
    # prima gli indirizzi scritti nella pagina, poi ciò che la costruzione aggiunge (che è già scritto per la cartella della lingua)
    testo = passo_indirizzi(testo, rel, lingua.codice, sito, disponibile, avvisi, opzioni["base_url"])
    testo = passo_struttura(testo, rel, lingua, reali, sito, opzioni["senza_selettore"], opzioni["base_url"])
    return riempi(testo, v_lingua, f"{lingua.codice}/{rel}", sconosciuti)


def pagina_scelta(testo, reali, sito, v_it, sconosciuti, opzioni):
    """L'indirizzo principale: la pagina di scelta della lingua (x-default)."""
    lingua = Lingua("en", "en", "ltr", "English")
    codici = " ".join(sorted(c for c, l in reali.items() if l.pubblicata))
    radice = pagina.leggi(testo)
    h = next(n for n in pagina.cammina(radice) if isinstance(n, pagina.Nodo) and n.tag == "html")
    testo = testo[:h.s] + tag_html(h, lingua)[:-1] + f' data-lingue="{codici}">' + testo[h.se:]
    testo = passo_struttura(testo, "index.html", lingua, reali, sito, opzioni["senza_selettore"], opzioni["base_url"], nella_radice=True)
    return riempi(testo, v_it, "index.html", sconosciuti)


def pagina_rimando(relativo, assoluto):
    return f"""<!doctype html>
<!-- SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 -->
<html lang="it" dir="ltr">
<head>
<meta charset="utf-8">
<title>Kalliope</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url={relativo}">
<link rel="canonical" href="{assoluto}">
<script>location.replace({json.dumps(relativo)} + location.search + location.hash)</script>
</head>
<body>
<p>Questa pagina si è spostata: <a href="{relativo}">{relativo}</a></p>
</body>
</html>
"""


# ---------- la costruzione ----------
def build(out, v, grezzi, opzioni):
    if out.exists():
        shutil.rmtree(out)
    sito = Sito(opzioni["website"], opzioni["system"])
    pagine, tutti, errori = catalogo.raccogli(opzioni["website"])
    for rel, testo in list(sito.pagine.items()):
        if rel not in pagine and pagina.pagina_traducibile(testo):
            errori.append(f"{rel}: marks texts but cannot be read")
    if errori:
        sys.exit("site.py: the pages mark their texts wrongly:\n  " + "\n  ".join(errori))
    sito.traducibili = {rel: sito.pagine[rel] for rel in pagine}
    mod = catalogo.modello(pagine, tutti)
    giornale = []
    reali = lingue_da_costruire(mod, len(mod.voci), opzioni["website"] / "lingue", opzioni["lingue"], opzioni["pseudo"], giornale)
    # le pagine di ogni lingua: le traducibili in ogni lingua, le altre soltanto in italiano
    disponibile = {c: (set(sito.pagine) if c == SORGENTE else set(sito.traducibili)) for c in reali}
    sconosciuti, avvisi = set(), []
    out.mkdir(parents=True)
    # i file condivisi
    for rel in sito.risorse:
        sorgente = (sito.website / rel) if not rel.startswith(SYSTEM_IN_SITE + "/") else (sito.system / rel[len(SYSTEM_IN_SITE) + 1:])
        dest = out / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if sorgente.suffix in TEXT_SUFFIXES:
            dest.write_text(riempi(sorgente.read_text(encoding="utf-8"), valori_lingua(v, grezzi, SORGENTE), rel, sconosciuti), encoding="utf-8")
        else:
            shutil.copyfile(sorgente, dest)
    v_lingue = {c: valori_lingua(v, grezzi, c if not l.finta else "en") for c, l in reali.items()}
    # le pagine
    contate = {}
    for codice, lingua in reali.items():
        for rel in sorted(disponibile[codice]):
            html = costruisci_pagina(rel, sito.pagine[rel], lingua, reali, sito, disponibile, v_lingue[codice], sconosciuti, avvisi, opzioni)
            dest = out / codice / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(html, encoding="utf-8")
        contate[codice] = len(disponibile[codice])
    # in cima al sito: la scelta della lingua, le altre pagine, i rimandi dei vecchi indirizzi
    for nome, testo in sito.radice.items():
        if nome == "index.html":
            html = pagina_scelta(testo, reali, sito, v_lingue[SORGENTE], sconosciuti, opzioni)
        else:
            # un'altra pagina in cima al sito (la 404): anche lei ha lang e dir
            testo = passo_struttura(testo, nome, reali[SORGENTE], reali, sito, opzioni["senza_selettore"], opzioni["base_url"])
            html = riempi(testo, v_lingue[SORGENTE], nome, sconosciuti)
        (out / nome).write_text(html, encoding="utf-8")
    rimandi = []
    for rel in sorted(sito.pagine):
        if rel == "index.html":
            continue   # il vecchio indirizzo della home, «/», è la pagina di scelta
        nuovo = f"{SORGENTE}/{sito.indirizzo(rel)}"
        relativo = posixpath.relpath(nuovo.rstrip("/"), posixpath.dirname(rel) or ".") + ("/" if nuovo.endswith("/") else "")
        dest = out / rel
        if dest.exists():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(pagina_rimando(relativo, opzioni["base_url"] + nuovo), encoding="utf-8")
        rimandi.append(sito.indirizzo(rel))
    # ciò che non torna
    if sconosciuti:
        sys.exit("site.py: markers without a value:\n  " + "\n  ".join(sorted(sconosciuti)))
    # un indirizzo rotto in una pagina tradotta ferma la costruzione; in una pagina di prima (non ancora rifatta) si dice soltanto
    rotti = sorted({a for a in avvisi if a.split(":")[0] in sito.traducibili})
    if rotti:
        sys.exit("site.py: links that lead nowhere in translated pages:\n  " + "\n  ".join(rotti))
    giornale.extend(f"warning, as before: {a}" for a in sorted(set(avvisi) - set(rotti)))
    return reali, giornale, contate, rimandi


def main():
    args = sys.argv[1:]
    if "--out" not in args:
        sys.exit(__doc__)
    out = pathlib.Path(args[args.index("--out") + 1]).resolve()
    for source in (SITE, SYSTEM):
        if out == source or source in out.parents or out in source.parents:
            sys.exit("site.py: --out must be outside website/ and design-system/")
    if "--release-json" in args:
        releases = json.loads(pathlib.Path(args[args.index("--release-json") + 1]).read_text())
    else:
        releases = fetch_releases()
    release = choose(releases)
    v, grezzi = values(release)
    base_url = args[args.index("--base-url") + 1] if "--base-url" in args else BASE_URL
    if not base_url.endswith("/"):
        base_url += "/"
    opzioni = {"pseudo": "--pseudo" in args, "senza_selettore": "--no-selector" in args, "base_url": base_url,
               "website": pathlib.Path(args[args.index("--website") + 1]).resolve() if "--website" in args else SITE,
               "system": pathlib.Path(args[args.index("--system") + 1]).resolve() if "--system" in args else SYSTEM,
               "lingue": set(args[args.index("--languages") + 1].split(",")) if "--languages" in args else None}
    reali, giornale, contate, rimandi = build(out, v, grezzi, opzioni)
    for riga in giornale:
        print(f"site.py: {riga}")
    pubblicate = [c for c, l in reali.items() if l.pubblicata]
    prova = [c for c, l in reali.items() if l.finta]
    print(f"site built in {out} for {v['tag']} ({'prerelease' if v['prerelease'] == 'true' else 'release'}); languages: "
          + ", ".join(f"{c} ({contate[c]} pages)" for c in pubblicate) + ("; for tests only: " + ", ".join(prova) if prova else "")
          + f"; {len(rimandi)} old addresses send to /{SORGENTE}/")


if __name__ == "__main__":
    main()
