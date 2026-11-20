# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
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

A page of a language whose script has its own font file (Arabic, Greek, Bulgarian) preloads that file in its <head>, so the
first screen shows in the right font instead of going through the fallback; the Italian page does not change by a byte. The
file comes from token.css (the :lang() rule of the language), and only small files are preloaded (PRECARICO_FINO_A).

The mark of Kalliope is never written into a page. A page marks where it goes, <svg data-marchio="barra"></svg> in the bar of the new pages and
<svg data-marchio="libero" width="40" height="40"></svg> in the old ones, and the build puts the drawing there from design-system/marchio/ (the bar's
mark inline, with the names of its parts; the free form as an image), and writes the icon of the tab into the <head> of every page: favicon.ico
(sizes any) and piccola.svg, the small form. A page that writes its own <link rel="icon"> stops the build. The build also checks, with tools/marchio.py,
that the files of design-system/marchio/ still match their drawing and the --segno-* tokens, and stops if they do not.

While one language only is published (today Italian) there is nothing to choose: the selector of the bar and the list of
languages of the foot are left out of every page, and the top address, /, is one more of those small pages that send to
/it/ (with the query and the fragment). The second complete language brings them all back, with no other change.

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
    {{kalliope.source.url}}     the files of the repository AT THE VERSION OFFERED (…/blob/<tag>); {{kalliope.tree.url}} its folders (…/tree/<tag>)
    {{kalliope.page.url}}       the address of the page being built, in its language (the one of its canonical link)

What depends on the release being a prerelease or not is written twice in the page and chosen by the build: an element with
data-release="prova" is kept only when the release offered is a prerelease, one with data-release="stabile" only when it is not
(for example the note «test version» next to the number, or the words «of test» inside a sentence: they never stay in the page by
hand, so the page says what the release is). The two are messages of the catalogue like any other; the one not chosen is left out
of every language.

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
    --no-selector   leave out the language selector the pages have in their bar and foot, whatever the number of languages
                    (to compare the Italian pages with those of before the languages; with one language it is the default)

The design system (tokens, base, components, fonts and its living catalogue) has its own folder, design-system/, because
the application will use it too. The build copies it into the site as design-system/, without its Markdown documents and
tool configuration; pages link to it as design-system/token.css, so they are complete only once built.

A source named next to a fact (a file of the repository) is a link built from {{kalliope.source.url}} or {{kalliope.tree.url}}, so it
opens the file as it is in the version the page shows. The build asks the repository (the local one when it has the tag, else
the public API) which files that version has: a source that is not there is shown as its name, without a link, and the build says
so (a link that leads nowhere never reaches visitors). Without a way to ask (offline, with --release-json and no local tag) the links stay.

The build fails when a marker is unknown, a package is missing from the release, a page marks its texts wrongly, or a link
of a translated page does not lead anywhere, so a typo never reaches visitors. Standard library only.
"""
import json
import os
import pathlib
import posixpath
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from i18n import catalogo, cldr, pagina, plurali, pseudo  # noqa: E402
import marchio  # noqa: E402

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


# The releases of the program: tags vX.Y and vX.Y-… (docs/releasing.md). Any other release, such as the one
# tagged assets that keeps the files that go inside Kalliope, is never offered.
VERSION_TAG = re.compile(r"v\d+\.\d+(-.+)?")


def choose(releases):
    published = [r for r in releases if not r.get("draft") and VERSION_TAG.fullmatch(r.get("tag_name", ""))]
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
        # the files of the repository at the version the page shows: a link to a source opens it as it was in that release
        "source.url": f"https://github.com/{REPO}/blob/{urllib.parse.quote(tag)}",
        "tree.url": f"https://github.com/{REPO}/tree/{urllib.parse.quote(tag)}",
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


def percorsi_della_versione(tag, in_rete):
    """{percorso: "blob" | "tree"}: i file e le cartelle del repository alla versione `tag`, per sapere se la fonte di un fatto si apre.

    Dal repository di questa copia, se ha il tag; altrimenti (la costruzione che pubblica parte da una copia senza i tag) dall'API pubblica,
    se `in_rete`. None se non si può sapere (senza rete, con --release-json e senza il tag nella copia): le fonti restano collegamenti."""
    try:
        uscita = subprocess.run(["git", "-C", str(ROOT), "ls-tree", "-r", "-t", "-z", tag], capture_output=True, timeout=60, check=True).stdout
        elenco = {}
        for voce in uscita.decode("utf-8").split("\0"):
            if voce:
                info, _, percorso = voce.partition("\t")
                elenco[percorso] = "tree" if info.split()[1] == "tree" else "blob"
        if elenco:
            return elenco
    except (OSError, subprocess.SubprocessError, UnicodeDecodeError, IndexError):
        pass
    if not in_rete:
        return None
    req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/git/trees/{urllib.parse.quote(tag)}?recursive=1",
                                 headers={"Accept": "application/vnd.github+json", "User-Agent": "kalliope-site-build"})
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            dati = json.load(resp)
    except (OSError, ValueError):
        return None
    if dati.get("truncated"):
        return None
    return {x["path"]: "tree" if x["type"] == "tree" else "blob" for x in dati.get("tree", [])}


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


def indirizzo_pagina(base_url, codice, indirizzo):
    """L'indirizzo di una pagina nella sua lingua, com'è nel suo canonical e nel segnaposto {{kalliope.page.url}}."""
    return f"{base_url}{codice}/{indirizzo}"


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
            # il comando che apre l'elenco (un <summary>) ha per nome ciò che fa e la lingua di adesso, «Cambia lingua: Italiano»: dal solo nome
            # visibile («Italiano») chi ascolta la pagina non saprebbe che apre una scelta. Il testo è quello già tradotto del suo title, e il nome
            # visibile ci sta dentro; la lingua di adesso è sempre quella della pagina, quindi il nome si legge in un'unica lingua.
            comando = a.padre
            while comando is not None and comando.tag != "summary":
                comando = comando.padre
            if comando is not None and comando.attr("title") and not comando.ha("aria-label"):
                nome_comando = html_escape(f'{comando.attr("title")}: {lingua.nome}').replace('"', "&quot;")
                mod.append((comando.se - 1, comando.se - 1, f' aria-label="{nome_comando}"'))
    if head is not None:
        righe = []
        indirizzo = sito.indirizzo(rel) if not nella_radice else ""
        ha_canonical = any(n.tag == "link" and (n.attr("rel") or "").lower() == "canonical" for n in nodi)
        if lingua.finta:
            righe.append('<meta name="robots" content="noindex">')
        elif nella_radice or rel in sito.traducibili:
            if not ha_canonical:
                righe.append(f'<link rel="canonical" href="{base_url + indirizzo if nella_radice else indirizzo_pagina(base_url, lingua.codice, indirizzo)}">')
            righe.extend(f'<link rel="alternate" hreflang="{l.bcp47}" href="{base_url}{l.codice}/{indirizzo}">' for l in in_vista)
            righe.append(f'<link rel="alternate" hreflang="x-default" href="{base_url}">')
        if righe:
            mod.append((head.ce, head.ce, "\n".join(righe) + "\n"))
    return pagina.applica(testo, mod)


# ---------- da destra a sinistra: le parti latine restano nel loro verso ----------
# In una pagina da destra a sinistra una versione («0.1-rc.1»), un nome di pacchetto o di programma («x86_64», «Kalliope 0.1»)
# fatti di lettere latine, cifre e punti si leggerebbero rovesciati («rc.1-0.1»): l'algoritmo bidirezionale di Unicode spezza
# la stringa ai punti e ai trattini. La costruzione chiude ogni parte latina fra LRI (U+2066) e PDI (U+2069), l'isolamento che
# W3C consiglia per il testo di verso opposto (inline-bidi-markup), nel testo e negli attributi tradotti. Le virgolette attorno a
# una parte isolata («Kalliope») prendono così il verso del testo. Non tocca i segnaposti dello script ({voce}), le entità, gli
# script e gli stili.
LATINO = "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F"
# Dentro una parte latina ci sono lettere, cifre e i segni . - _ / : + ; una virgola ci sta soltanto fra due cifre («0,07 s», «10,6 MB»: la virgola decimale): una virgola
# seguita da uno spazio, o fra lettere, è la punteggiatura della frase e separa. Senza, «0,07 s» in arabo si leggeva «07 s,0» (secondo sguardo su «stato», N7).
_UNITA = rf"[{LATINO}0-9](?:(?:[{LATINO}0-9.\-_/:+]|(?<=[0-9]),(?=[0-9]))*[{LATINO}0-9])?"
PARTE_LATINA = re.compile(rf"{_UNITA}(?: {_UNITA})*")
DA_NON_TOCCARE = re.compile(r"(\{[A-Za-z_][A-Za-z0-9_]*\}|&[#A-Za-z0-9]+;|[\u2066-\u2068][^\u2069]*\u2069)")   # un isolamento già messo resta com'è
LRI, PDI = "\u2066", "\u2069"


def _isola(raw):
    pezzi = DA_NON_TOCCARE.split(raw)
    for i in range(0, len(pezzi), 2):   # i pezzi dispari sono segnaposti, entità o isolamenti già messi
        pezzi[i] = PARTE_LATINA.sub(lambda m: LRI + m.group(0) + PDI if re.search(f"[{LATINO}]", m.group(0)) else m.group(0), pezzi[i])
    return "".join(pezzi)


def isola_latino(testo):
    radice = pagina.leggi(testo)
    mod = []
    for n in pagina.cammina(radice):
        if isinstance(n, pagina.Testo):
            if n.padre is not None and n.padre.tag in pagina.TESTO_PURO:
                continue
            # il nome di una lingua nel suo elenco («Deutsch» in una pagina araba) è l'unico testo del suo collegamento, con il suo lang: non ha un
            # verso da proteggere, e i caratteri invisibili finirebbero nel nome del collegamento (per chi lo detta o lo cerca per nome)
            if n.padre is not None and n.padre.tag == "a" and n.padre.ha("hreflang"):
                continue
            nuovo = _isola(n.raw)
            if nuovo != n.raw:
                mod.append((n.s, n.e, nuovo))
        elif isinstance(n, pagina.Nodo):
            for nome, raw, _val, vs, ve in n.attrs:
                if nome in pagina.ATTRIBUTI and raw and n.ha(f"data-t-{nome}"):   # soltanto gli attributi tradotti (non il content del viewport)
                    nuovo = _isola(testo[vs:ve])
                    if nuovo != testo[vs:ve]:
                        mod.append((vs, ve, nuovo))
    return pagina.applica(testo, mod)


# ---------- il carattere della scrittura: scaricato subito, non quando il testo è già disegnato ----------
# Una pagina in arabo, urdu, hindi, bengali, greco o bulgaro disegna il primo schermo con un carattere che arriva da un file (design-system/
# caratteri/, uno per scrittura, con il suo unicode-range). Il browser lo scopre soltanto quando ha letto lo stile e impaginato il testo:
# fino a quel momento il titolo è nel carattere di ripiego, e a rete lenta ci resta per secondi. La costruzione lo dice subito, con un
# <link rel="preload"> nella testa della pagina: la pagina italiana, che non ne ha bisogno, non cambia di un byte. Il file lo dice
# token.css, non una tabella qui: la regola :lang(xx) che dà il --font-testo della lingua nomina una famiglia con @font-face e url() che
# la pila di base non ha (il cinese usa un carattere di sistema, e non ne ha: niente da scaricare).
def _blocchi_css(css, selettore):
    """Le coppie (selettori, corpo) delle regole di primo livello che cominciano con il selettore dato, senza i commenti."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return [(s.strip(), c) for s, c in re.findall(r"(?:^|(?<=\}))\s*([^{}@]+)\{([^{}]*)\}", css) if re.search(selettore, s.strip())]


def caratteri_per_lingua(token_css):
    """{codice della lingua: percorso del file del suo carattere, relativo a design-system/}, letto da token.css."""
    css = re.sub(r"/\*.*?\*/", "", token_css, flags=re.S)
    facce = {}   # famiglia → file, per le facce con un file vero (le facce con local() non ne hanno)
    for corpo in re.findall(r"@font-face\s*\{([^{}]*)\}", css):
        famiglia, file = re.search(r'font-family:\s*"([^"]+)"', corpo), re.search(r'url\("([^"]+)"\)', corpo)
        if famiglia and file:
            facce.setdefault(famiglia.group(1), file.group(1))
    def pila(corpo):
        m = re.search(r"--font-testo:\s*([^;]+);", corpo)
        return re.findall(r'"([^"]+)"', m.group(1)) if m else []
    base = set()
    for _, corpo in _blocchi_css(css, r"^:root$"):
        base |= set(pila(corpo))
    out = {}
    for selettori, corpo in _blocchi_css(css, r":lang\("):
        propri = [f for f in pila(corpo) if f not in base and f in facce]
        if propri:
            for codice in re.findall(r":lang\(([a-z]{2,3})\)", selettori):
                out[codice] = facce[propri[0]]
    return out


# Quando conviene. Misurato il 17/11/2026 a rete lenta (Chromium, HTTP/2 e testo compresso come GitHub Pages; 4G lento 1,6 Mbps con 150 ms, 3G
# 400 kbps con 400 ms; tre corse per caso; design/lavoro/2-lingue-aspetto/costruzione/misure/): per i file piccoli (Readex Pro e Geologica,
# 22 KB) il testo del primo schermo compare nel carattere giusto 17-22% prima (4G: 1,30 → 1,06 s; 3G: 4,7 → 3,6 s) e non passa più
# dal ripiego; per i grandi (Noto Sans Bengali 102 KB, Devanagari 118 KB, Nastaliq 234 KB) il guadagno è il 1-4% (il file occupa la
# rete per tutto il tempo, anche scoperto tardi) e il primo disegno arriva dell'8-9% dopo (+0,08 s al 4G, +0,3 s al 3G): lì non si precarica.
PRECARICO_FINO_A = 40_000   # byte del file


def da_precaricare(caratteri, system):
    """Dei file dei caratteri per lingua, soltanto quelli che il precarico fa comparire prima senza ritardare il resto: i piccoli."""
    return {c: f for c, f in caratteri.items() if (system / f).is_file() and (system / f).stat().st_size <= PRECARICO_FINO_A}


def precarica_carattere(testo, rel, lingua, nome_file):
    """Aggiunge alla testa il precarico del file del carattere, dopo gli altri precarichi di caratteri (o prima del primo foglio di stile)."""
    radice = pagina.leggi(testo)
    nodi = [n for n in pagina.cammina(radice) if isinstance(n, pagina.Nodo) and n.tag == "link"]
    precarichi = [n for n in nodi if (n.attr("rel") or "").lower() == "preload" and (n.attr("as") or "").lower() == "font"]
    fogli = [n for n in nodi if (n.attr("rel") or "").lower() == "stylesheet"]
    ancora = precarichi[-1] if precarichi else (fogli[0] if fogli else None)
    if ancora is None:
        return testo
    cartella = posixpath.dirname(rel)
    alla_radice = posixpath.relpath(".", f"{lingua.codice}/{cartella}".rstrip("/") or ".")
    href = posixpath.normpath(posixpath.join(alla_radice, SYSTEM_IN_SITE, "caratteri", nome_file))
    riga = f'<link rel="preload" href="{href}" as="font" type="font/woff2" crossorigin>'
    if precarichi:
        return pagina.applica(testo, [(ancora.se, ancora.se, "\n" + _spazio_prima(testo, ancora.s) + riga)])
    return pagina.applica(testo, [(ancora.s, ancora.s, riga + "\n" + _spazio_prima(testo, ancora.s))])


# ---------- il marchio: il disegno dalla fonte unica, e l'icona della scheda ----------
# Nessuna pagina scrive il disegno: segna dove va con <svg data-marchio="barra"></svg> (il segno della barra, in linea, con i nomi delle sue
# parti: i colori li dà componenti/marchio.css, il fronte della voce lo muove marchio/marchio.js) o <svg data-marchio="libero" width="40" height="40">
# </svg> (la forma libera, come immagine: le pagine di prima non hanno i token). Lo stesso disegno, i token e la prova sono in design-system/marchio/.
def marchio_del_sistema(system):
    """Il marchio di `system` (design-system/ o una sua copia): {"barra": il segno in linea, "forme": i nomi dei file .svg}. None se il sistema non ne ha uno.
    Ferma la costruzione se i file del marchio non tornano con il suo disegno e con i token."""
    cartella = system / "marchio"
    if not (cartella / "disegno.json").exists():
        return None
    errori = marchio.controlla_sistema(system)
    if errori:
        sys.exit("site.py: the mark of the design system does not match its drawing and tokens (run python3 -I tools/marchio.py):\n  " + "\n  ".join(errori))
    forme = {f.stem for f in cartella.glob("*.svg")}
    return {"barra": re.sub(r"<!--.*?-->\s*", "", (cartella / "barra.svg").read_text(encoding="utf-8"), flags=re.S).strip(), "forme": forme}


def passo_marchio(testo, alla_radice, mar, rel):
    """Il disegno del marchio al posto dei segnaposto data-marchio, e nella testa l'icona della scheda (favicon.ico e la forma piccola in SVG).
    `alla_radice`: il percorso dalla pagina alla radice del sito («../», «../../», o vuoto in cima)."""
    if mar is None:
        return testo
    radice = pagina.leggi(testo)
    nodi = [n for n in pagina.cammina(radice) if isinstance(n, pagina.Nodo)]
    mod = []
    for n in nodi:
        if not n.ha("data-marchio"):
            continue
        forma = n.attr("data-marchio")
        fine = n.cf if n.cf is not None else n.se
        if forma == "barra":
            mod.append((n.s, fine, mar["barra"]))
        elif forma in mar["forme"] and forma != "barra":
            mod.append((n.s, fine, f'<img src="{alla_radice}{SYSTEM_IN_SITE}/marchio/{forma}.svg" alt="" width="{n.attr("width") or 40}" height="{n.attr("height") or 40}">'))
        else:
            sys.exit(f'site.py: {rel}: data-marchio="{forma}" is not a form of the mark ({", ".join(sorted(mar["forme"]))})')
    head = next((n for n in nodi if n.tag == "head"), None)
    if head is not None:
        if any(n.tag == "link" and "icon" in (n.attr("rel") or "").lower().split() for n in nodi):
            sys.exit(f"site.py: {rel}: the page writes its own <link rel=\"icon\">; the build writes the icon of the tab from design-system/marchio/")
        icone = (f'<link rel="icon" href="{alla_radice}{SYSTEM_IN_SITE}/marchio/favicon.ico" sizes="any">\n'
                 f'<link rel="icon" href="{alla_radice}{SYSTEM_IN_SITE}/marchio/piccola.svg" type="image/svg+xml">\n')
        mod.append((head.ce, head.ce, icone))
    return pagina.applica(testo, mod)


def passo_release(testo, v, rel):
    """Toglie gli elementi che valgono per l'altro tipo di versione: data-release="prova" resta se la versione offerta è di prova,
    data-release="stabile" se non lo è."""
    radice = pagina.leggi(testo)
    di_prova = v["prerelease"] == "true"
    mod, fino = [], -1
    for n in pagina.cammina(radice):
        if not isinstance(n, pagina.Nodo) or not n.ha("data-release") or n.s < fino:
            continue   # (un elemento dentro uno già tolto non serve)
        tipo = n.attr("data-release")
        if tipo not in ("prova", "stabile"):
            sys.exit(f'site.py: {rel}: data-release="{tipo}" is not "prova" or "stabile"')
        if n.cf is None:
            sys.exit(f"site.py: {rel}: an element with data-release must have content and a closing tag ({n.tag})")
        if (tipo == "prova") != di_prova:
            mod.append((n.s, n.cf, ""))
            fino = n.cf
    return pagina.applica(testo, mod)


def passo_fonti(testo, v, percorsi, mancanti):
    """Le fonti (…/blob/<tag>/<file>, …/tree/<tag>/<cartella>) portano a ciò che esiste alla versione mostrata dalla pagina. Una fonte che
    a quella versione non c'è resta il suo nome, senza collegamento: si toglie solo il <a>, il testo resta. `mancanti` raccoglie i percorsi."""
    if percorsi is None:
        return testo
    radice = pagina.leggi(testo)
    basi = ((v["source.url"] + "/", "blob"), (v["tree.url"] + "/", "tree"))
    mod = []
    for n in pagina.cammina(radice):
        if not isinstance(n, pagina.Nodo) or n.tag != "a":
            continue
        href = n.attr("href") or ""
        base = next(((b, tipo) for b, tipo in basi if href.startswith(b)), None)
        if base is None:
            continue
        percorso = re.split(r"[?#]", href[len(base[0]):])[0].rstrip("/")
        if percorsi.get(percorso) == base[1]:
            continue
        mancanti.add(percorso)
        if n.cf is not None:
            mod += [(n.s, n.se, ""), (n.ce, n.cf, "")]
    return pagina.applica(testo, mod)


def costruisci_pagina(rel, testo, lingua, reali, sito, disponibile, v_lingua, sconosciuti, avvisi, opzioni):
    """L'HTML di una pagina in una lingua."""
    if rel in sito.traducibili:
        radice = pagina.leggi(testo)
        msgs, err = pagina.messaggi(testo, radice, rel)
        if err:
            sys.exit("site.py: " + "; ".join(err))
        testo = pagina.applica(testo, pagina.sostituzioni(testo, msgs, lingua.tradotte, lingua.plurale, lingua.numero))
    testo = passo_release(testo, v_lingua, f"{lingua.codice}/{rel}")   # prima degli indirizzi: ciò che si toglie non deve dare avvisi
    # prima gli indirizzi scritti nella pagina, poi ciò che la costruzione aggiunge (che è già scritto per la cartella della lingua)
    testo = passo_indirizzi(testo, rel, lingua.codice, sito, disponibile, avvisi, opzioni["base_url"])
    testo = passo_struttura(testo, rel, lingua, reali, sito, opzioni["senza_selettore"], opzioni["base_url"])
    testo = passo_marchio(testo, posixpath.relpath(".", f"{lingua.codice}/{posixpath.dirname(rel)}".rstrip("/") or ".") + "/", opzioni.get("marchio"), f"{lingua.codice}/{rel}")
    # l'indirizzo della pagina in questa lingua è lo stesso del suo canonical: chi lo mostra e chi lo copia lo prendono da qui
    v_pagina = {**v_lingua, "page.url": indirizzo_pagina(opzioni["base_url"], lingua.codice, sito.indirizzo(rel))}
    testo = riempi(testo, v_pagina, f"{lingua.codice}/{rel}", sconosciuti)
    testo = passo_fonti(testo, v_lingua, opzioni.get("percorsi_versione"), opzioni.setdefault("fonti_mancanti", set()))
    file = opzioni.get("caratteri", {}).get(lingua.codice)
    if file and rel in sito.traducibili and not lingua.finta:   # una pseudo-lingua non ha lettere della scrittura: il file non servirebbe
        testo = precarica_carattere(testo, rel, lingua, file)
    return isola_latino(testo) if lingua.direzione == "rtl" and not lingua.finta else testo


def pagina_scelta(testo, reali, sito, v_it, sconosciuti, opzioni):
    """L'indirizzo principale: la pagina di scelta della lingua (x-default)."""
    lingua = Lingua("en", "en", "ltr", "English")
    codici = " ".join(sorted(c for c, l in reali.items() if l.pubblicata))
    radice = pagina.leggi(testo)
    h = next(n for n in pagina.cammina(radice) if isinstance(n, pagina.Nodo) and n.tag == "html")
    testo = testo[:h.s] + tag_html(h, lingua)[:-1] + f' data-lingue="{codici}">' + testo[h.se:]
    testo = passo_struttura(testo, "index.html", lingua, reali, sito, opzioni["senza_selettore"], opzioni["base_url"], nella_radice=True)
    testo = passo_marchio(testo, "", opzioni.get("marchio"), "index.html")
    return riempi(testo, v_it, "index.html", sconosciuti)


def esempi_per_il_catalogo(out, sito, reali, v_lingue, sconosciuti, opzioni):
    """Per il catalogo (design-system/catalogo/): la home e la pagina della scelta come sarebbero con tutte le lingue del registro pubblicate.

    Il catalogo mostra la scelta nella barra, l'elenco del piede e la pagina della scelta copiandoli dalle pagine vere. Con una lingua sola
    quelle pagine non li hanno (la costruzione li toglie, e «/» manda a «/it/»): i due file qui sotto sono le stesse pagine, costruite
    con le stesse funzioni, con le 30 lingue del registro (tools/data/cldr.json), solo per il catalogo: senza indici di ricerca, con
    <base> perché gli indirizzi relativi valgano dalla radice del sito."""
    it = reali[SORGENTE]
    tutte = {}
    for codice in cldr.lingue():
        info = cldr.info(codice)
        tutte[codice] = Lingua(codice, info["bcp47"], info["direzione"], info["nomeElenco"], pubblicata=True)
    tutte[SORGENTE] = Lingua(it.codice, it.bcp47, it.direzione, it.nome, it.tradotte, True, False, it.plurale, it.numero, it.forme)
    disponibile = {c: (set(sito.pagine) if c == SORGENTE else set(sito.traducibili)) for c in tutte}
    opz = {**opzioni, "senza_selettore": False, "caratteri": {}, "fonti_mancanti": set()}

    def per_il_catalogo(html, base):
        html = re.sub(r'<link rel="(?:canonical|alternate)"[^>]*>\n?', "", html)   # non sono pagine del sito: né canonical né hreflang
        return html.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<base href="{base}">\n<meta name="robots" content="noindex">', 1)

    home = costruisci_pagina("index.html", sito.pagine["index.html"], tutte[SORGENTE], tutte, sito, disponibile, v_lingue[SORGENTE], sconosciuti, [], opz)
    scelta = pagina_scelta(sito.radice["index.html"], tutte, sito, v_lingue[SORGENTE], sconosciuti, opz)
    cartella = out / SYSTEM_IN_SITE / "catalogo"
    cartella.mkdir(parents=True, exist_ok=True)
    (cartella / "esempio-home.html").write_text(per_il_catalogo(home, "../../it/"), encoding="utf-8")
    (cartella / "esempio-scelta.html").write_text(per_il_catalogo(scelta, "../../"), encoding="utf-8")


def pagina_rimando(relativo, assoluto):
    return f"""<!doctype html>
<!-- SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 -->
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
    # una lingua sola (oggi l'italiano): non c'è niente da scegliere. Il selettore della barra e l'elenco del piede non si mostrano e
    # l'indirizzo principale manda alla lingua, come i vecchi indirizzi; con la seconda lingua completa tornano da soli.
    lingua_sola = sum(1 for l in reali.values() if l.pubblicata) < 2
    if lingua_sola:
        opzioni = {**opzioni, "senza_selettore": True}
    # il file del carattere di ogni scrittura, da precaricare (token.css dice quale)
    tutti_i_caratteri = caratteri_per_lingua((opzioni["system"] / "token.css").read_text(encoding="utf-8"))
    opzioni = {**opzioni, "caratteri": {c: f.removeprefix("caratteri/") for c, f in da_precaricare(tutti_i_caratteri, opzioni["system"]).items()},
               "fonti_mancanti": set(), "marchio": marchio_del_sistema(opzioni["system"])}
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
        if nome == "index.html" and lingua_sola:
            html = pagina_rimando(f"{SORGENTE}/", opzioni["base_url"] + f"{SORGENTE}/")
        elif nome == "index.html":
            html = pagina_scelta(testo, reali, sito, v_lingue[SORGENTE], sconosciuti, opzioni)
        else:
            # un'altra pagina in cima al sito (la 404): anche lei ha lang e dir
            testo = passo_struttura(testo, nome, reali[SORGENTE], reali, sito, opzioni["senza_selettore"], opzioni["base_url"])
            testo = passo_marchio(testo, "", opzioni.get("marchio"), nome)
            html = riempi(testo, v_lingue[SORGENTE], nome, sconosciuti)
        (out / nome).write_text(html, encoding="utf-8")
    if "index.html" in sito.radice and "index.html" in sito.pagine:
        esempi_per_il_catalogo(out, sito, reali, v_lingue, sconosciuti, opzioni)
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
    giornale.extend(f"source {m} is not in the repository at {v['tag']}: shown as its name, without a link" for m in sorted(opzioni["fonti_mancanti"]))
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
    percorsi = percorsi_della_versione(v["tag"], "--release-json" not in args)
    if percorsi is None:
        print(f"site.py: warning, the files of {v['tag']} could not be listed: the links to the sources are not checked")
    opzioni = {"percorsi_versione": percorsi, "pseudo": "--pseudo" in args, "senza_selettore": "--no-selector" in args, "base_url": base_url,
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
