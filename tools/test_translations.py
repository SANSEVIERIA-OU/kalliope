# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Tests of the translation tools and of the multilingual site build. Standard library only.

    python3 -I -m unittest discover -s tools -p 'test_*.py'

Every check has a case that must pass and a spoilt copy that must fail: a key taken away, a broken tag, a changed placeholder,
a wrong plural header, text the page did not mark, a physical left/right in a style sheet.
"""
import json
import pathlib
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import css_logico  # noqa: E402
import site as _site_stdlib  # noqa: E402,F401  (the standard library's `site`, loaded before ours is imported under another name)
import importlib.util  # noqa: E402
import translations  # noqa: E402
from i18n import catalogo, cldr, pagina, plurali, po, pseudo  # noqa: E402

_spec = importlib.util.spec_from_file_location("kalliope_site", pathlib.Path(__file__).resolve().parent / "site.py")
sito_py = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sito_py)

RADICE = pathlib.Path(__file__).resolve().parent.parent

PAGINA = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title data-t="titolo">Kalliope · prova</title>
<meta name="description" content="Una descrizione." data-t-content="descrizione">
</head>
<body>
<h1 data-t="h1" data-t-nota="Due righe."><span class="riga">Prima riga,</span>
  <span class="riga">seconda riga.</span></h1>
<p data-t="p">Leggi <a href="a/" class="x">la guida</a> e <strong>scarica</strong> {{kalliope.version}} (<span class="freccia"></span>). Ci sono {n} cose.</p>
<button aria-label="Chiudi la finestra" data-t-aria-label="chiudi" data-t="chiudi.testo">Chiudi</button>
<p data-t="voci" data-t-plurale="{n} voci" data-t-n="3">{n} voce</p>
</body>
</html>
"""


def sito_prova(cartella, testo=PAGINA):
    (cartella / "website").mkdir(parents=True)
    (cartella / "website" / "index.html").write_text(testo, encoding="utf-8")
    return cartella / "website"


def msg(testo=PAGINA):
    radice = pagina.leggi(testo)
    m, err = pagina.messaggi(testo, radice, "index.html")
    return {x.chiave: x for x in m}, err


class Plurali(unittest.TestCase):
    def test_ogni_lingua_ha_forme_che_tornano_con_gli_esempi_di_cldr(self):
        for codice in cldr.lingue():
            info = cldr.info(codice)["plurali"]
            self.assertEqual(plurali.confronta(info["regole"], info["intestazione"]), [], codice)

    def test_le_forme_di_ricerca_lingue(self):
        atteso = {"ar": 6, "ga": 5, "mt": 5, "cs": 4, "sk": 4, "lt": 4, "pl": 4, "sl": 4, "hr": 3, "ro": 3, "lv": 3, "fr": 3, "es": 3, "pt": 3,
                  "it": 3, "zh": 1, "id": 1, "en": 2, "de": 2, "bg": 2, "ur": 2, "hi": 2, "bn": 2}
        for codice, n in atteso.items():
            self.assertEqual(len(cldr.info(codice)["plurali"]["forme"]), n, codice)

    def test_intestazione_sbagliata_e_riconosciuta(self):
        r = cldr.info("pl")["plurali"]["regole"]
        self.assertTrue(plurali.confronta(r, "nplurals=2; plural=(n != 1);"))                       # troppo poche forme
        self.assertTrue(plurali.confronta(r, "nplurals=4; plural=(n==1 ? 0 : n>=2 ? 1 : 3);"))     # espressione che sbaglia
        self.assertTrue(plurali.confronta(r, "nplurals=4; plural=(n==1"))                           # non si legge
        self.assertEqual(plurali.confronta(cldr.info("en")["plurali"]["regole"], "nplurals=2; plural=n != 1;"), [])   # un altro modo di scriverla


class Formati(unittest.TestCase):
    def test_italiano_come_prima(self):
        self.assertEqual(cldr.data_lunga("it", 2026, 11, 12), "12 novembre 2026")
        self.assertEqual(cldr.dimensione("it", 14_123_456), "14,1 MB")

    def test_altre_lingue(self):
        self.assertEqual(cldr.dimensione("en", 14_123_456), "14.1 MB")
        self.assertEqual(cldr.dimensione("fr", 14_123_456), "14,1 Mo")
        self.assertEqual(cldr.data_lunga("zh", 2026, 11, 12), "2026年11月12日")
        self.assertEqual(cldr.data_lunga("bn", 2026, 11, 12), "১২ নভেম্বর, ২০২৬")
        self.assertEqual(cldr.numero("hi", 1234567.5, 1), "12,34,567.5")


class Pagina(unittest.TestCase):
    def test_messaggi_e_tag(self):
        m, err = msg()
        self.assertEqual(err, [])
        self.assertEqual(m["h1"].testo, "<1>Prima riga,</1> <2>seconda riga.</2>")
        self.assertEqual(m["p"].testo, "Leggi <1>la guida</1> e <2>scarica</2> {{kalliope.version}} (<3/>). Ci sono {n} cose.")
        self.assertEqual(m["chiudi"].testo, "Chiudi la finestra")
        self.assertEqual(m["chiudi"].tipo, "attributo")
        self.assertEqual(m["voci"].plurale, "{n} voci")
        self.assertEqual(m["h1"].nota, "Due righe.")

    def test_testo_non_segnato_si_vede(self):
        radice = pagina.leggi(PAGINA.replace("<p data-t=\"p\">", "<p>"))
        errori = pagina.non_segnato(PAGINA.replace("<p data-t=\"p\">", "<p>"), radice, "x")
        self.assertTrue(any("Leggi" in e for e in errori), errori)
        guasta = PAGINA.replace(' data-t-aria-label="chiudi"', "")
        self.assertTrue(any("aria-label" in e for e in pagina.non_segnato(guasta, pagina.leggi(guasta), "x")))
        pulita = pagina.non_segnato(PAGINA, pagina.leggi(PAGINA), "x")
        self.assertEqual(pulita, [], pulita)

    def test_data_t_no_dice_che_non_si_traduce(self):
        t = PAGINA.replace("</body>", '<p data-t-no="un codice">ABC-123</p></body>')
        self.assertEqual(pagina.non_segnato(t, pagina.leggi(t), "x"), [])

    def test_errori_di_scrittura(self):
        _, err = msg(PAGINA.replace("<strong>scarica</strong>", "<div>scarica</div>"))
        self.assertTrue(any("<div>" in e for e in err), err)
        _, err = msg(PAGINA.replace("<strong>scarica</strong>", '<strong data-t="dentro">scarica</strong>'))
        self.assertTrue(any("inside a message" in e for e in err), err)
        _, err = msg(PAGINA.replace('data-t="p"', 'data-t="h1"'))
        self.assertTrue(any("two texts" in e for e in err), err)
        _, err = msg(PAGINA.replace('data-t-content="descrizione"', 'data-t-colore="x"'))
        self.assertTrue(any("not a translatable attribute" in e for e in err), err)

    def test_tag_della_traduzione(self):
        sorgente = "Leggi <1>la guida</1> e <2>scarica</2> (<3/>)."
        self.assertEqual(pagina.verifica_tag(sorgente, "Lies <2>den Download</2> und <1>die Anleitung</1> (<3/>)."), [])
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und <2>den Download (<3/>)."))        # tag non chiuso
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und den Download (<3/>)."))           # tag tolto
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und <2>den Download</2> (<3/>) <4/>."))  # tag in più
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung und <2>den Download</2></1> (<3/>)."))   # un tag dentro un altro
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und <2>den Download</2> (<3></3>)."))  # vuoto che non lo è più
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und <2>Tom & Jerry</2> (<3/>)."))     # & scritto male
        self.assertTrue(pagina.verifica_tag(sorgente, "Lies <1>die Anleitung</1> und <2>a < b</2> (<3/>)."))            # < scritto male

    def test_segnaposto(self):
        self.assertEqual(pagina.segnaposto("{{kalliope.version}} e {n} e {{kalliope.date}}"), ["{n}", "{{kalliope.date}}", "{{kalliope.version}}"])

    def test_italiano_resta_com_e_e_le_traduzioni_entrano(self):
        m, _ = msg()
        radice = pagina.leggi(PAGINA)
        msgs, _ = pagina.messaggi(PAGINA, radice, "index.html")
        # identica al sorgente: nessuna modifica
        identiche = {k: v.testo for k, v in m.items() if v.plurale is None}
        self.assertEqual(pagina.sostituzioni(PAGINA, msgs, identiche), [])
        tradotte = {"h1": "<2>Zweite,</2> <1>erste.</1>", "p": "Lies <1>die Anleitung</1> und <2>lade</2> {{kalliope.version}} (<3/>). {n} Dinge.",
                    "chiudi": "Fenster schließen", "descrizione": "Eine Beschreibung & mehr."}
        nuovo = pagina.applica(PAGINA, pagina.sostituzioni(PAGINA, msgs, tradotte))
        self.assertIn('<span class="riga">Zweite,</span> <span class="riga">erste.</span>', nuovo)
        self.assertIn('<a href="a/" class="x">die Anleitung</a>', nuovo)
        self.assertIn('<span class="freccia"></span>', nuovo)
        self.assertIn('aria-label="Fenster schließen"', nuovo)
        self.assertIn('content="Eine Beschreibung &amp; mehr."', nuovo)
        pagina.leggi(nuovo)   # è ancora una pagina che si legge

    def test_plurale_con_conteggio_nella_pagina(self):
        radice = pagina.leggi(PAGINA)
        msgs, _ = pagina.messaggi(PAGINA, radice, "index.html")
        tr = {"voci": pagina.Plurale(["{n} Eintrag", "{n} Einträge"], ["one", "other"])}
        nuovo = pagina.applica(PAGINA, pagina.sostituzioni(PAGINA, msgs, tr, lambda n: 0 if n == 1 else 1, lambda n: str(n)))
        self.assertIn(">3 Einträge</p>", nuovo.replace('"', '"'))
        self.assertIn('data-t-nomi="one other"', nuovo)
        self.assertIn("data-t-forme=", nuovo)


class Cataloghi(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-1-test-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.sito = sito_prova(self.tmp)
        self.pagine, self.tutti, errori = catalogo.raccogli(self.sito)
        self.assertEqual(errori, [])
        self.mod = catalogo.modello(self.pagine, self.tutti)

    def lingua(self, codice, modifica=None, riempi=True):
        cat = catalogo.unisci(None, self.mod, codice)
        if riempi:
            for v in cat.voci:
                v.str = [self._tradotto(v, i) for i in range(len(v.str))]
        if modifica:
            modifica(cat)
        return cat

    def _tradotto(self, v, i):
        if v.id_plurale is not None:
            return f"{{n}} X{i}"
        return v.id   # stessa stringa: va bene per il controllo (testi, tag e segnaposto uguali)

    def esito(self, cat, codice="de"):
        return catalogo.controlla(cat, self.mod, codice)

    def voce(self, cat, chiave):
        return next(v for v in cat.voci if v.ctx == chiave)

    def test_lingua_completa_passa(self):
        e = self.esito(self.lingua("de"))
        self.assertTrue(e.completa, (e.errori, e.mancanti))

    def test_chiave_tolta(self):
        e = self.esito(self.lingua("de", lambda c: c.voci.remove(self.voce(c, "p"))))
        self.assertEqual(e.mancanti, ["p"])
        self.assertFalse(e.completa)

    def test_voce_vuota(self):
        e = self.esito(self.lingua("de", lambda c: setattr(self.voce(c, "chiudi"), "str", [""])))
        self.assertIn("chiudi", e.mancanti)

    def test_tag_rotto(self):
        e = self.esito(self.lingua("de", lambda c: setattr(self.voce(c, "p"), "str", ["Lies <1>die Anleitung</1> und <2>den Download (<3/>). {{kalliope.version}} {n}"])))
        self.assertTrue(any("broken tags" in r for r in e.errori), e.errori)

    def test_tag_tolto(self):
        e = self.esito(self.lingua("de", lambda c: setattr(self.voce(c, "h1"), "str", ["<1>Nur eine</1>"])))
        self.assertTrue(any("missing tags" in r for r in e.errori), e.errori)

    def test_segnaposto_cambiato(self):
        e = self.esito(self.lingua("de", lambda c: setattr(self.voce(c, "p"), "str", ["Lies <1>a</1> <2>b</2> {{kalliope.versione}} (<3/>) {n}"])))
        self.assertTrue(any("placeholders" in r for r in e.errori), e.errori)
        e = self.esito(self.lingua("de", lambda c: setattr(self.voce(c, "p"), "str", ["Lies <1>a</1> <2>b</2> {{kalliope.version}} (<3/>) {m}"])))
        self.assertTrue(any("placeholders" in r for r in e.errori), e.errori)

    def test_plurale_con_il_numero_di_forme_sbagliato(self):
        e = self.esito(self.lingua("it", lambda c: setattr(self.voce(c, "voci"), "str", ["{n} voce", "{n} voci"])), "it")
        self.assertTrue(any("forms" in r for r in e.errori), e.errori)
        e = self.esito(self.lingua("pl"), "pl")
        self.assertTrue(e.completa, e.errori)
        e = self.esito(self.lingua("zh", lambda c: setattr(self.voce(c, "voci"), "str", ["{n} a", "{n} b"])), "zh")
        self.assertTrue(any("forms" in r for r in e.errori), e.errori)

    def test_intestazione_dei_plurali_sbagliata(self):
        e = self.esito(self.lingua("pl", lambda c: c.intestazione.__setitem__("Plural-Forms", "nplurals=2; plural=(n != 1);")), "pl")
        self.assertTrue(any("Plural-Forms" in r for r in e.errori), e.errori)

    def test_lingua_sbagliata_o_sconosciuta(self):
        e = self.esito(self.lingua("de", lambda c: c.intestazione.__setitem__("Language", "fr")))
        self.assertTrue(any("Language" in r for r in e.errori))
        e = catalogo.controlla(self.lingua("de"), self.mod, "xx")
        self.assertTrue(e.errori)

    def test_fuzzy_e_italiano_cambiato(self):
        e = self.esito(self.lingua("de", lambda c: self.voce(c, "chiudi").flags.append("fuzzy")))
        self.assertEqual(e.fuzzy, ["chiudi"])
        cat = self.lingua("de")
        self.sito.joinpath("index.html").write_text(PAGINA.replace(">Chiudi</button>", ">Chiudi qui</button>"), encoding="utf-8")
        pagine, tutti, _ = catalogo.raccogli(self.sito)
        nuovo = catalogo.modello(pagine, tutti)
        e = catalogo.controlla(cat, nuovo, "de")
        self.assertEqual(e.fuori_data, ["chiudi.testo"])
        # `extract` non cancella la traduzione: la tiene, fuzzy, con il testo di prima
        unito = catalogo.unisci(cat, nuovo, "de")
        v = next(x for x in unito.voci if x.ctx == "chiudi.testo")
        self.assertTrue(v.fuzzy)
        self.assertEqual(v.prec_id, "Chiudi")
        self.assertEqual(v.str, ["Chiudi"])
        self.assertFalse(catalogo.controlla(unito, nuovo, "de").completa)

    def test_voce_tolta_dalla_pagina_resta_obsoleta(self):
        cat = self.lingua("de")
        self.sito.joinpath("index.html").write_text(PAGINA.replace('<button aria-label="Chiudi la finestra" data-t-aria-label="chiudi" data-t="chiudi.testo">Chiudi</button>', ""), encoding="utf-8")
        pagine, tutti, _ = catalogo.raccogli(self.sito)
        unito = catalogo.unisci(cat, catalogo.modello(pagine, tutti), "de")
        self.assertTrue(any(v.obsoleta and v.ctx == "chiudi.testo" for v in unito.voci))
        self.assertIn("#~", po.scrivi(unito))

    def test_it_po_roundtrip_e_scrittura(self):
        cat = catalogo.unisci(None, self.mod, "it", sorgente=True)
        testo = po.scrivi(cat)
        self.assertEqual(po.scrivi(po.leggi(testo)), testo)
        self.assertTrue(catalogo.controlla(po.leggi(testo), self.mod, "it").completa)


class Pseudo(unittest.TestCase):
    def test_en_xa_allunga_e_non_tocca_tag_e_segnaposto(self):
        t = "Leggi <1>la guida</1> e <2>scarica</2> {{kalliope.version}} &amp; {n} cose."
        r = pseudo.en_xa(t)
        self.assertEqual(pagina.segnaposto(r), pagina.segnaposto(t))
        self.assertEqual(pagina.verifica_tag(t, r), [])
        visibile = lambda s: len(pseudo._TOKEN.sub("", s))  # noqa: E731   (le sole parole: né tag né segnaposto né entità)
        self.assertGreaterEqual(visibile(r), visibile(t) * 1.35)   # circa il 40%: ogni pezzo più lungo del 40%, i pezzi di un carattere no
        self.assertIn("é", r)

    def test_ar_xb_forza_da_destra(self):
        r = pseudo.ar_xb("Ciao <1>mondo</1>")
        self.assertTrue(r.startswith("‮") and r.endswith("‬"))
        self.assertEqual(pagina.verifica_tag("Ciao <1>mondo</1>", r), [])


# ---------- la costruzione del sito ----------
HOME = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title data-t="titolo">Kalliope</title>
<link rel="icon" href="immagini/icona.svg">
<link rel="stylesheet" href="design-system/token.css">
<script src="lingua.js" defer></script>
</head>
<body>
<nav data-t-aria-label="menu" aria-label="Sezioni"><ul><li><a href="vecchia/" data-t="menu.vecchia">Vecchia</a></li><li><a href="#lingue" data-lingua-corrente data-t-no="nome" data-t-title="lingua.titolo" title="Cambia lingua">Italiano</a></li></ul></nav>
<p data-t="p">Versione {{kalliope.version}} del {{kalliope.date}}: {{kalliope.deb.size}}. <a href="vecchia/">Guida</a></p>
<nav id="lingue" data-t-aria-label="lingue" aria-label="Lingue"><ul data-lingue="elenco"><li><a data-lingua data-t-no="nome" href="#">x</a></li></ul></nav>
</body>
</html>
"""
VECCHIA = """<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>Vecchia</title>
<link rel="canonical" href="https://sansevieria-ou.github.io/kalliope/vecchia/">
<link rel="stylesheet" href="../stile/x.css"></head>
<body><a href="../">Home</a> <a href="../immagini/icona.svg">icona</a> <p>{{kalliope.deb.size}}</p></body></html>
"""
SCELTA = """<!doctype html><html lang="en"><head><title>Kalliope</title><script src="lingua.js"></script></head>
<body><nav aria-label="Language"><ul data-lingue="elenco"><li><a data-lingua href="#">English</a></li></ul></nav></body></html>
"""
RILASCIO = {"tag_name": "v0.1", "published_at": "2026-11-12T15:57:29Z", "html_url": "https://x/r", "prerelease": False,
            "assets": [{"name": "k-0.1-amd64.deb", "browser_download_url": "https://x/d", "size": 14_123_456, "digest": "sha256:aa"},
                       {"name": "k-0.1-x86_64.rpm", "browser_download_url": "https://x/r", "size": 15_000_000, "digest": "sha256:bb"},
                       {"name": "k-0.1-linux-x86_64.tar.gz", "browser_download_url": "https://x/t", "size": 16_000_000, "digest": "sha256:cc"},
                       {"name": "kalliope-bin.PKGBUILD", "browser_download_url": "https://x/p"}, {"name": "SHA256SUMS", "browser_download_url": "https://x/s"}]}


class Sito(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-1-sito-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        w = self.tmp / "website"
        (w / "vecchia").mkdir(parents=True)
        (w / "stile").mkdir()
        (w / "immagini").mkdir()
        (w / "index.html").write_text(HOME, encoding="utf-8")
        (w / "vecchia" / "index.html").write_text(VECCHIA, encoding="utf-8")
        (w / "lingue.html").write_text(SCELTA, encoding="utf-8")
        (w / "404.html").write_text('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Non c\'è</title></head><body><a href="vecchia/">Guida</a></body></html>', encoding="utf-8")
        (w / "lingua.js").write_text("//", encoding="utf-8")
        (w / "stile" / "x.css").write_text("a{}", encoding="utf-8")
        (w / "immagini" / "icona.svg").write_text("<svg/>", encoding="utf-8")
        s = self.tmp / "design-system"
        s.mkdir()
        (s / "token.css").write_text(":root{}", encoding="utf-8")
        self.w, self.s = w, s
        self.v, self.grezzi = sito_py.values(RILASCIO)

    def costruisci(self, **opz):
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": self.w, "system": self.s, **opz}
        return sito_py.build(self.tmp / "out", self.v, self.grezzi, opzioni)

    def aggiungi_lingua(self, codice, modifica=None):
        pagine, tutti, _ = catalogo.raccogli(self.w)
        mod = catalogo.modello(pagine, tutti)
        (self.w / "lingue").mkdir(exist_ok=True)
        cat = catalogo.unisci(None, mod, codice)
        for v in cat.voci:
            v.str = [v.id] if v.id_plurale is None else [v.id_plurale] * len(v.str)
        if modifica:
            modifica(cat)
        (self.w / "lingue" / f"{codice}.po").write_text(po.scrivi(cat), encoding="utf-8")

    def leggi(self, p):
        return (self.tmp / "out" / p).read_text(encoding="utf-8")

    def test_solo_italiano(self):
        reali, giornale, contate, rimandi = self.costruisci()
        self.assertEqual(list(reali), ["it"])
        home = self.leggi("it/index.html")
        self.assertIn('<html lang="it" dir="ltr">', home)
        self.assertIn('href="../design-system/token.css"', home)
        self.assertIn("14,1 MB", self.leggi("it/vecchia/index.html"))
        self.assertIn("12 novembre 2026", home)
        self.assertIn('href="../stile/x.css"'.replace("../", "../../"), self.leggi("it/vecchia/index.html"))
        self.assertIn('<link rel="alternate" hreflang="x-default" href="https://esempio.test/k/">', home)
        self.assertIn('<link rel="canonical" href="https://esempio.test/k/it/">', home)
        self.assertIn('<link rel="canonical" href="https://esempio.test/k/it/vecchia/">', self.leggi("it/vecchia/index.html"))
        self.assertIn('href="../it/vecchia/"', self.leggi("vecchia/index.html"))   # il rimando del vecchio indirizzo
        self.assertEqual(rimandi, ["vecchia/"])

    def test_ogni_pagina_costruita_ha_lang_e_dir(self):
        import re
        self.aggiungi_lingua("ar")
        self.costruisci(pseudo=True)
        viste = 0
        for f in sorted((self.tmp / "out").rglob("*.html")):
            if f.relative_to(self.tmp / "out").parts[0] == "design-system":
                continue
            tag = re.search(r"<html[^>]*>", f.read_text(encoding="utf-8")).group(0)
            self.assertTrue(re.search(r'\blang="[^"]+"', tag) and re.search(r'\bdir="(ltr|rtl)"', tag), f"{f}: {tag}")
            viste += 1
        self.assertGreaterEqual(viste, 7)

    def test_scelta_in_cima(self):
        self.aggiungi_lingua("en")
        self.costruisci()
        scelta = self.leggi("index.html")
        self.assertIn('data-lingue="en it"', scelta)
        self.assertIn('<li><a href="en/" hreflang="en" lang="en" data-lingua-codice="en">English</a></li>', scelta)
        self.assertIn('<li><a href="it/" hreflang="it" lang="it" data-lingua-codice="it">Italiano</a></li>', scelta)

    def test_lingua_completa_si_pubblica_con_hreflang(self):
        self.aggiungi_lingua("en")
        reali, giornale, contate, _ = self.costruisci()
        self.assertEqual(sorted(reali), ["en", "it"])
        self.assertEqual(giornale, [])
        home = self.leggi("it/index.html")
        self.assertIn('<link rel="alternate" hreflang="en" href="https://esempio.test/k/en/">', home)
        self.assertIn('<li><a href="../en/" hreflang="en" lang="en" data-lingua-codice="en">English</a></li>', home)
        en = self.leggi("en/index.html")
        self.assertIn('<html lang="en" dir="ltr">', en)
        self.assertIn("14.1 MB", en)
        self.assertIn("November 12, 2026", en)
        self.assertIn('href="../it/vecchia/"', en)   # la pagina di prima c'è solo in italiano
        self.assertFalse((self.tmp / "out" / "en" / "vecchia").exists())

    def test_lingua_incompleta_non_si_pubblica(self):
        self.aggiungi_lingua("de", lambda c: c.voci.pop())
        reali, giornale, _, _ = self.costruisci()
        self.assertEqual(list(reali), ["it"])
        self.assertTrue(any("language de: left out" in r and "missing" in r for r in giornale), giornale)
        self.assertFalse((self.tmp / "out" / "de").exists())
        self.assertNotIn("hreflang=\"de\"", self.leggi("it/index.html"))

    def test_lingua_con_un_tag_rotto_non_si_pubblica(self):
        self.aggiungi_lingua("de", lambda c: setattr(next(v for v in c.voci if v.ctx == "p"), "str", ["<1>rotto {{kalliope.version}} {{kalliope.date}} {{kalliope.deb.size}}"]))
        reali, giornale, _, _ = self.costruisci()
        self.assertEqual(list(reali), ["it"])
        self.assertTrue(any("language de: left out" in r for r in giornale), giornale)

    def test_lingua_da_destra_a_sinistra(self):
        self.aggiungi_lingua("ar")
        self.costruisci()
        ar = self.leggi("ar/index.html")
        self.assertIn('<html lang="ar" dir="rtl">', ar)
        self.assertIn("14.1", ar)

    def test_pseudo_non_sono_pubblicate(self):
        self.aggiungi_lingua("en")
        reali, _, _, _ = self.costruisci(pseudo=True)
        self.assertEqual(sorted(reali), ["ar-XB", "en", "en-XA", "it"])
        home_it = self.leggi("it/index.html")
        self.assertNotIn("en-XA", home_it)
        self.assertNotIn("ar-XB", self.leggi("index.html"))
        xb = self.leggi("ar-XB/index.html")
        self.assertIn('<html lang="ar-XB" dir="rtl">', xb)
        self.assertIn('<meta name="robots" content="noindex">', xb)
        self.assertNotIn('rel="alternate"', xb)
        self.assertNotIn('rel="canonical"', xb)
        self.assertIn("[", self.leggi("en-XA/index.html"))

    def test_senza_selettore(self):
        self.costruisci(senza_selettore=True)
        home = self.leggi("it/index.html")
        self.assertNotIn("lingue", home.replace("hreflang", ""))
        self.assertNotIn("data-lingua", home)

    def test_un_collegamento_rotto_in_una_pagina_tradotta_ferma_la_costruzione(self):
        (self.w / "index.html").write_text(HOME.replace('href="immagini/icona.svg"', 'href="immagini/manca.svg"'), encoding="utf-8")
        with self.assertRaises(SystemExit) as c:
            self.costruisci()
        self.assertIn("links that lead nowhere", str(c.exception))

    def test_un_marcatore_sconosciuto_ferma_la_costruzione(self):
        (self.w / "index.html").write_text(HOME.replace("{{kalliope.version}}", "{{kalliope.versione}}"), encoding="utf-8")
        with self.assertRaises(SystemExit) as c:
            self.costruisci()
        self.assertIn("markers without a value", str(c.exception))

    def test_una_pagina_segnata_male_ferma_la_costruzione(self):
        (self.w / "index.html").write_text(HOME.replace("<p data-t=\"p\">", "<p>"), encoding="utf-8")
        with self.assertRaises(SystemExit) as c:
            self.costruisci()
        self.assertIn("mark their texts wrongly", str(c.exception))


class CssLogico(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-1-css-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        (self.tmp / "componenti").mkdir()
        (self.tmp / "token.css").write_text(":root{ --a: 0 24px 0 8px; --b: 4px 4px; --verso: 1; }", encoding="utf-8")

    def difetti(self, css):
        (self.tmp / "componenti" / "x.css").write_text(css, encoding="utf-8")
        return css_logico.esamina(self.tmp)[0]

    def test_pulito(self):
        self.assertEqual(self.difetti(".a { margin-inline-start: 4px; padding: var(--b); inset-inline: 0; text-align: start; }\n"), [])

    def test_fisiche(self):
        d = self.difetti(".a { margin-left: 4px; }\n.b { left: 0; text-align: right; }\n.c { border-left: 1px solid red; }\n")
        self.assertEqual([x[2] for x in d], ["FISICA"] * 4)

    def test_fisica_voluta_con_il_motivo(self):
        self.assertEqual(self.difetti(".a { left: 50%; } /* fisico: centratura */\n"), [])

    def test_scorciatoia_asimmetrica(self):
        d = self.difetti(".a { padding: var(--a); }\n.b { margin: 0 1px 0 2px; }\n.c { border-radius: 4px 0 0 4px; }\n")
        self.assertEqual([x[2] for x in d], ["ASIMMETRICA"] * 3)

    def test_testo_nel_css(self):
        d = self.difetti('.a::after { content: " · microfono"; }\n.b::after { content: " " attr(data-x); }\n.c::after { content: "\\A"; }\n')
        self.assertEqual([x[2] for x in d], ["TESTO"])

    def test_nome_di_un_lato(self):
        (self.tmp / "token.css").write_text(":root{ --luce-sinistra: 1px; }", encoding="utf-8")
        d = self.difetti(".a { }\n")
        self.assertEqual([x[2] for x in d], ["NOME"])

    def test_il_design_system_vero_e_pulito(self):
        d, _ = css_logico.esamina(RADICE / "design-system")
        self.assertEqual(d, [])


class DaDestraASinistra(unittest.TestCase):
    """Le parti latine di una pagina da destra a sinistra restano nel loro verso (correzione dopo il giudizio dell'incarico 2, I1)."""
    PAGINA = ('<html lang="ar" dir="rtl"><head><meta name="viewport" content="width=device-width, initial-scale=1">'
              '<meta name="description" content="Kalliope 0.1 للحاسوب" data-t-content="d"><style>a{color:red}</style></head>'
              '<body><p>نسخة تجريبية 0.1-rc.1، لنظام Linux فقط (x86_64)</p><p>{voce} &amp; 14/3 «Kalliope»</p>'
              '<a title="Kalliope، الصفحة" data-t-title="t" href="x/">ok</a><script>var a = "Linux";</script></body></html>')

    def test_le_parti_latine_si_isolano(self):
        fuori = sito_py.isola_latino(self.PAGINA)
        for parte in ("0.1-rc.1", "Linux", "x86_64", "Kalliope"):
            self.assertIn("\u2066" + parte + "\u2069", fuori, parte)
        self.assertIn('content="\u2066Kalliope 0.1\u2069 للحاسوب"', fuori)
        self.assertIn('title="\u2066Kalliope\u2069، الصفحة"', fuori)

    def test_non_tocca_cio_che_non_e_testo(self):
        fuori = sito_py.isola_latino(self.PAGINA)
        self.assertIn('content="width=device-width, initial-scale=1"', fuori)   # un attributo non tradotto
        self.assertIn("{voce} &amp; 14/3", fuori)   # segnaposto, entità, cifre senza lettere
        self.assertIn('var a = "Linux";', fuori)   # uno script
        self.assertIn('href="x/"', fuori)
        self.assertEqual(sito_py.isola_latino(fuori), fuori)   # due volte è come una

    def test_la_costruzione_isola_solo_da_destra_a_sinistra(self):
        guasta = self.PAGINA.replace("\u2066", "")
        self.assertNotEqual(sito_py.isola_latino(guasta), guasta)


class Repository(unittest.TestCase):
    def test_i_cataloghi_sono_quelli_che_le_pagine_producono(self):
        self.assertEqual(translations.main(["extract", "--check"]), 0)

    def test_le_lingue_presenti_sono_complete(self):
        self.assertEqual(translations.main(["check", "--complete"]), 0)

    def test_il_registro_ha_le_trenta_lingue(self):
        self.assertEqual(len(cldr.lingue()), 30)
        self.assertEqual(set(cldr.lingue()), set("bg cs da de el en es et fi fr ga hr hu it lt lv mt nl pl pt ro sk sl sv zh hi ar bn id ur".split()))


if __name__ == "__main__":
    unittest.main()
