# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Tests of the translation tools and of the multilingual site build. Standard library only.

    python3 -I -m unittest discover -s tools -p 'test_*.py'

Every check has a case that must pass and a spoilt copy that must fail: a key taken away, a broken tag, a changed placeholder,
a wrong plural header, text the page did not mark, a physical left/right in a style sheet.
"""
import json
import pathlib
import re
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


class SceltaDellaVersione(unittest.TestCase):
    """La versione offerta è una release del programma (tag vX.Y o vX.Y-…), mai quella dei file che vanno nel programma."""

    def rilascio(self, tag, quando, prova):
        return {**RILASCIO, "tag_name": tag, "published_at": quando, "prerelease": prova}

    def test_la_release_dei_file_non_e_mai_offerta(self):
        prova = self.rilascio("v0.1-rc.1", "2026-11-12T15:57:29Z", True)
        file = self.rilascio("assets", "2026-11-20T09:00:00Z", True)
        self.assertEqual(sito_py.choose([file, prova])["tag_name"], "v0.1-rc.1")
        stabile = self.rilascio("v0.1", "2026-11-25T09:00:00Z", False)
        self.assertEqual(sito_py.choose([self.rilascio("assets", "2026-11-30T09:00:00Z", False), stabile, prova])["tag_name"], "v0.1")

    def test_solo_i_tag_di_versione(self):
        for tag in ("v0.1", "v1.0", "v0.1-rc.1", "v0.0-test.3"):
            self.assertEqual(sito_py.choose([self.rilascio(tag, "2026-11-12T15:57:29Z", True)])["tag_name"], tag)
        for tag in ("assets", "v1", "0.1", "versione-0.1", "v0.1.0x"):
            with self.assertRaises(SystemExit):
                sito_py.choose([self.rilascio(tag, "2026-11-12T15:57:29Z", True)])


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
        # una lingua sola: niente da scegliere. Né il selettore della barra né l'elenco del piede, e «/» manda a «/it/»
        self.assertNotIn("data-lingua", home)
        self.assertNotIn("Cambia lingua", home)   # la voce della barra
        self.assertNotIn('id="lingue"', home)
        scelta = self.leggi("index.html")
        self.assertIn('<meta http-equiv="refresh" content="0; url=it/">', scelta)
        self.assertIn('<link rel="canonical" href="https://esempio.test/k/it/">', scelta)
        self.assertIn('location.replace("it/" + location.search + location.hash)', scelta)
        self.assertNotIn("data-lingue", scelta)

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

    def test_con_la_seconda_lingua_tornano_il_selettore_e_la_scelta(self):
        self.aggiungi_lingua("en")
        self.costruisci()
        home = self.leggi("it/index.html")
        self.assertIn('title="Cambia lingua"', home)   # la voce della barra (la costruzione toglie il marcatore e scrive il nome)
        self.assertIn('id="lingue"', home)
        self.assertIn('data-lingue="elenco"', home)
        self.assertEqual(home.count('data-lingua-codice='), 2)
        self.assertIn('data-lingue="en it"', self.leggi("index.html"))   # «/» è la scelta, non un rimando
        self.assertNotIn("http-equiv", self.leggi("index.html"))

    def test_una_lingua_incompleta_non_riporta_il_selettore(self):
        self.aggiungi_lingua("de", lambda c: c.voci.pop())
        self.costruisci()
        self.assertNotIn("data-lingua", self.leggi("it/index.html"))
        self.assertIn('http-equiv="refresh"', self.leggi("index.html"))

    def test_le_pseudo_lingue_non_contano_per_il_selettore(self):
        self.costruisci(pseudo=True)
        self.assertNotIn("data-lingua", self.leggi("it/index.html"))
        self.assertNotIn("data-lingua", self.leggi("en-XA/index.html"))
        self.assertIn('http-equiv="refresh"', self.leggi("index.html"))

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
        self.aggiungi_lingua("en")
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


class SitoVero(unittest.TestCase):
    """Il sito vero (website/ e design-system/) con una lingua sola e con due: il selettore c'è soltanto con due, in ogni pagina che lo ha
    (incarico 2-b, 17/11/2026). La seconda lingua è fatta dal catalogo italiano con la pseudo-lingua, soltanto per questa prova."""
    @classmethod
    def setUpClass(cls):
        cls.tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-2b-sitovero-"))
        cls.v, cls.grezzi = sito_py.values(RILASCIO)
        cls.una = cls.costruisci(cls.tmp / "una", RADICE / "website")
        w = cls.tmp / "due-website"
        shutil.copytree(RADICE / "website", w)
        pagine, tutti, _ = catalogo.raccogli(w)
        for codice, f in (("en", pseudo.en_xa), ("ar", pseudo.ar_xb)):
            cat = catalogo.unisci(None, catalogo.modello(pagine, tutti), codice)
            for voce in cat.voci:
                voce.str = [f(voce.id)] if voce.id_plurale is None else [f(voce.id if i == 0 else voce.id_plurale) for i in range(len(voce.str))]
            (w / "lingue" / f"{codice}.po").write_text(po.scrivi(cat), encoding="utf-8")
        cls.due = cls.costruisci(cls.tmp / "due", w)

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, True)

    @classmethod
    def costruisci(cls, out, website):
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": website,
                   "system": RADICE / "design-system"}
        sito_py.build(out, cls.v, cls.grezzi, opzioni)
        return out

    PAGINE_CON_BARRA = ["it/index.html", "it/non-ancora/index.html"]

    def test_con_una_lingua_sola_niente_selettore_in_nessuna_pagina(self):
        for rel in self.PAGINE_CON_BARRA:
            html = (self.una / rel).read_text(encoding="utf-8")
            self.assertNotIn("lingua-scelta", html, rel)
            self.assertNotIn("data-lingua", html, rel)
            self.assertNotIn('class="lingue"', html, rel)
            self.assertNotIn("Cambia lingua", html, rel)
        self.assertIn('http-equiv="refresh" content="0; url=it/"', (self.una / "index.html").read_text(encoding="utf-8"))

    def test_con_due_lingue_ogni_pagina_ha_il_selettore_e_porta_alla_stessa_pagina(self):
        import re
        for rel, atteso in (("it/index.html", "../en/"), ("it/non-ancora/index.html", "../../en/non-ancora/"),
                            ("en/index.html", "../it/"), ("en/non-ancora/index.html", "../../it/non-ancora/"),
                            ("ar/index.html", "../it/"), ("ar/non-ancora/index.html", "../../it/non-ancora/")):
            html = (self.due / rel).read_text(encoding="utf-8")
            self.assertIn("data-lingua-codice=", html, rel)
            self.assertIn(f'href="{atteso}"', html, rel)
            sorgente = (RADICE / "website" / rel.split("/", 1)[1]).read_text(encoding="utf-8")
            if "lingua-scelta" in sorgente:   # la pagina ha preso la scelta nuova: ne resta una sola, con il suo elenco (la home sempre)
                self.assertEqual(len(re.findall(r"<details[^>]*lingua-scelta", html)), 1, rel)
            else:
                self.assertNotEqual(rel, "it/index.html")
        self.assertIn('data-lingue="ar en it"', (self.due / "index.html").read_text(encoding="utf-8"))

    def test_il_carattere_arabo_si_precarica_in_ogni_pagina_araba(self):
        for rel, prefisso in (("ar/index.html", "../"), ("ar/non-ancora/index.html", "../../")):
            html = (self.due / rel).read_text(encoding="utf-8")
            riga = f'<link rel="preload" href="{prefisso}design-system/caratteri/readex-pro/ReadexPro-wght.woff2" as="font" type="font/woff2" crossorigin>'
            self.assertEqual(html.count(riga), 1, rel)
            self.assertLess(html.index("Lexend-wght-latino.woff2"), html.index("ReadexPro-wght.woff2"), rel)
            self.assertTrue((self.due / "design-system/caratteri/readex-pro/ReadexPro-wght.woff2").is_file())
        for rel in ("en/index.html", "en/non-ancora/index.html", "it/index.html", "it/non-ancora/index.html"):
            self.assertNotIn("ReadexPro", (self.due / rel).read_text(encoding="utf-8"), rel)

    def test_il_comando_della_scelta_ha_per_nome_cio_che_fa_e_la_lingua_di_adesso(self):
        import re
        for rel, nome in (("it/index.html", "Italiano"), ("en/index.html", "English"), ("ar/index.html", "العربية"), ("it/non-ancora/index.html", "Italiano")):
            html = (self.due / rel).read_text(encoding="utf-8")
            m = re.search(r'<summary[^>]*\btitle="([^"]*)"[^>]*\baria-label="([^"]*)"', html)
            self.assertIsNotNone(m, rel)
            titolo = m.group(1).replace("\u2066", "").replace("\u2069", "")   # il title di una pagina da destra a sinistra ha i suoi isolamenti: il nome, che si ascolta e non si vede, no
            self.assertEqual(m.group(2), f"{titolo}: {nome}", rel)   # «Cambia lingua: Italiano»: il nome visibile ci sta dentro
        # i nomi delle lingue nel loro elenco non hanno caratteri invisibili, nemmeno in una pagina da destra a sinistra
        ar = (self.due / "ar/index.html").read_text(encoding="utf-8")
        self.assertIn('hreflang="en" lang="en" data-lingua-codice="en">English</a>', ar)

    def test_un_comando_senza_title_non_prende_un_nome_inventato(self):
        class Finto:
            traducibili = {"index.html": ""}
            def indirizzo(self, rel):
                return ""
        it = sito_py.Lingua("it", "it", "ltr", "Italiano")
        for titolo, atteso in (' title="Cambia lingua"', ' aria-label="Cambia lingua: Italiano"'), ("", None):
            pagina_di_prova = f'<html lang="it"><head></head><body><details class="lingua-scelta"><summary{titolo}><span data-lingua-corrente data-t-no="n">Italiano</span></summary></details></body></html>'
            fuori = sito_py.passo_struttura(pagina_di_prova, "index.html", it, {"it": it}, Finto(), False, "https://x/")
            if atteso:
                self.assertIn(atteso, fuori)
            else:
                self.assertNotIn("aria-label", fuori)

    def test_il_catalogo_ha_gli_esempi_con_tutte_le_lingue_anche_con_una_lingua_sola(self):
        import re
        for sito in (self.una, self.due):
            home = (sito / "design-system/catalogo/esempio-home.html").read_text(encoding="utf-8")
            scelta = (sito / "design-system/catalogo/esempio-scelta.html").read_text(encoding="utf-8")
            self.assertEqual(len(re.findall(r"<details[^>]*lingua-scelta", home)), 1)
            self.assertEqual(len(re.findall(r'<nav class="lingue"', home)), 1)
            self.assertEqual(home.count("data-lingua-codice="), 60)   # 30 nella barra, 30 nel piede
            self.assertEqual(scelta.count("data-lingua-codice="), 30)
            self.assertEqual(len(re.search(r'<html[^>]*data-lingue="([^"]+)"', scelta).group(1).split()), 30)
            for html, base in ((home, "../../it/"), (scelta, "../../")):
                self.assertIn(f'<base href="{base}">', html)
                self.assertIn('<meta name="robots" content="noindex">', html)
                self.assertNotIn('rel="canonical"', html)
                self.assertNotIn('rel="alternate"', html)
        # le pagine vere, con una lingua sola, non hanno né la scelta né il piede: gli esempi non sono quelle pagine
        self.assertNotIn("lingua-scelta", (self.una / "it/index.html").read_text(encoding="utf-8"))

    def test_la_pagina_italiana_non_ha_un_precarico_in_piu(self):
        for rel in self.PAGINE_CON_BARRA:
            html = (self.una / rel).read_text(encoding="utf-8")
            self.assertEqual(html.count('rel="preload"'), 1, rel)   # soltanto Lexend latino, com'era
            self.assertEqual(html.count('as="font"'), 1, rel)


TOKEN_CARATTERI = """
@font-face { font-family: "Lexend"; src: url("caratteri/lexend/Lexend-wght-latino.woff2") format("woff2"); }
@font-face { font-family: "Lexend riserva"; src: local("Arial"); }
@font-face { font-family: "Readex Pro Kalliope"; src: url("caratteri/readex-pro/ReadexPro-wght.woff2") format("woff2"); unicode-range: U+0600-06FF; }
@font-face { font-family: "Geologica Kalliope"; src: url("caratteri/geologica/Geologica-wght.woff2") format("woff2"); }
@font-face { font-family: "Noto Sans Devanagari Kalliope"; src: url("caratteri/noto-sans-devanagari/NotoSansDevanagari-wght.woff2") format("woff2"); }
:root { --font-testo: "Lexend", "Lexend riserva", system-ui, sans-serif; }
/* un commento con :lang(xx) { --font-testo: "Lexend", "Finto"; } */
:lang(el), :lang(bg) { --font-testo: "Lexend", "Geologica Kalliope", "Lexend riserva", sans-serif; }
:lang(ar) { --font-testo: "Lexend", "Readex Pro Kalliope", "Lexend riserva", sans-serif; --font-app: "Finto"; }
:lang(hi) { --font-testo: "Lexend", "Noto Sans Devanagari Kalliope", sans-serif; }
:lang(zh) { --font-testo: "Lexend", "PingFang SC", "Microsoft YaHei", sans-serif; }
:lang(ur) { --font-testo: "Lexend", "Noto Nastaliq Urdu", sans-serif; }
@media (max-width: 760px) { :root { --margine: 20px; } }
:lang(ar), :lang(ur) { --sottolineatura-posizione: from-font; }
"""


class Precarico(unittest.TestCase):
    """Il carattere della scrittura si scarica subito: la costruzione lo precarica nelle pagine di quella lingua (incarico 2-b, 17/11/2026)."""

    def test_il_file_lo_dice_token_css(self):
        self.assertEqual(sito_py.caratteri_per_lingua(TOKEN_CARATTERI),
                         {"el": "caratteri/geologica/Geologica-wght.woff2", "bg": "caratteri/geologica/Geologica-wght.woff2",
                          "ar": "caratteri/readex-pro/ReadexPro-wght.woff2",
                          "hi": "caratteri/noto-sans-devanagari/NotoSansDevanagari-wght.woff2"})   # il cinese (carattere di sistema) e l'urdu (nessuna faccia con un file qui) no

    def test_i_caratteri_del_sistema_vero(self):
        c = sito_py.caratteri_per_lingua((RADICE / "design-system" / "token.css").read_text(encoding="utf-8"))
        self.assertEqual(sorted(c), ["ar", "bg", "bn", "el", "hi", "ur"])   # le sei scritture con un file; il cinese è di sistema, il latino è già precaricato
        for file in c.values():
            self.assertTrue((RADICE / "design-system" / file).is_file(), file)
        self.assertEqual(c["ur"], "caratteri/noto-nastaliq-urdu/NotoNastaliqUrdu-wght.woff2")

    def test_si_precaricano_soltanto_i_file_piccoli(self):
        c = sito_py.caratteri_per_lingua((RADICE / "design-system" / "token.css").read_text(encoding="utf-8"))
        self.assertEqual(sorted(sito_py.da_precaricare(c, RADICE / "design-system")), ["ar", "bg", "el"])   # Readex Pro e Geologica, 22 KB; non Bengali, Devanagari, Nastaliq (misure in site.py)
        for lingua in ("ar", "bg", "el"):
            self.assertLessEqual((RADICE / "design-system" / c[lingua]).stat().st_size, sito_py.PRECARICO_FINO_A)
        for lingua in ("bn", "hi", "ur"):
            self.assertGreater((RADICE / "design-system" / c[lingua]).stat().st_size, sito_py.PRECARICO_FINO_A)

    def test_una_pagina_si_costruisce_con_il_precarico_giusto(self):
        for rel, atteso in (("index.html", "../design-system/caratteri/readex-pro/ReadexPro-wght.woff2"),
                            ("sotto/index.html", "../../design-system/caratteri/readex-pro/ReadexPro-wght.woff2")):
            lingua = sito_py.Lingua("ar", "ar", "rtl", "العربية")
            pagina_di_prova = ('<html><head><meta charset="utf-8">\n  <link rel="preload" href="design-system/caratteri/lexend/Lexend-wght-latino.woff2" as="font" type="font/woff2" crossorigin>\n'
                               '  <link rel="stylesheet" href="design-system/token.css">\n</head><body></body></html>')
            fuori = sito_py.precarica_carattere(pagina_di_prova, rel, lingua, "readex-pro/ReadexPro-wght.woff2")
            self.assertIn(f'  <link rel="preload" href="{atteso}" as="font" type="font/woff2" crossorigin>\n  <link rel="stylesheet"', fuori)
            self.assertLess(fuori.index("Lexend-wght-latino"), fuori.index("ReadexPro"))   # dopo il precarico del latino
            self.assertEqual(fuori.count('rel="preload"'), 2)
        senza = sito_py.precarica_carattere('<html><head>\n<link rel="stylesheet" href="x.css">\n</head></html>', "index.html", lingua, "readex-pro/ReadexPro-wght.woff2")
        self.assertLess(senza.index("ReadexPro"), senza.index("x.css"))   # senza un altro precarico: prima del primo foglio di stile

    def test_la_costruzione_la_mette_dove_serve_e_non_altrove(self):
        tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-2b-precarico-"))
        self.addCleanup(shutil.rmtree, tmp, True)
        w = tmp / "website"
        (w / "lingue").mkdir(parents=True)
        (w / "index.html").write_text('<!doctype html><html lang="it"><head><meta charset="utf-8"><title data-t="t">Kalliope</title>'
                                      '<link rel="preload" href="design-system/caratteri/lexend/Lexend-wght-latino.woff2" as="font" type="font/woff2" crossorigin>'
                                      '<link rel="stylesheet" href="design-system/token.css"></head><body><h1 data-t="h">Ciao</h1>'
                                      '<ul data-lingue="elenco"><li><a data-lingua data-t-no="n" href="#">x</a></li></ul></body></html>', encoding="utf-8")
        (w / "vecchia").mkdir()
        (w / "vecchia" / "index.html").write_text("<!doctype html><html lang=\"it\"><head><title>V</title></head><body><p>solo italiano</p></body></html>", encoding="utf-8")
        (w / "lingue.html").write_text(SCELTA, encoding="utf-8")
        s = tmp / "design-system"
        for cartella, file, byte in (("lexend", "Lexend-wght-latino.woff2", 100), ("readex-pro", "ReadexPro-wght.woff2", 100),
                                     ("noto-sans-devanagari", "NotoSansDevanagari-wght.woff2", sito_py.PRECARICO_FINO_A + 1)):
            (s / "caratteri" / cartella).mkdir(parents=True)
            (s / "caratteri" / cartella / file).write_bytes(b"w" * byte)
        (s / "token.css").write_text(TOKEN_CARATTERI, encoding="utf-8")
        pagine, tutti, _ = catalogo.raccogli(w)
        mod = catalogo.modello(pagine, tutti)
        for codice in ("ar", "en", "zh", "hi"):
            cat = catalogo.unisci(None, mod, codice)
            for v in cat.voci:
                v.str = [v.id]
            (w / "lingue" / f"{codice}.po").write_text(po.scrivi(cat), encoding="utf-8")
        v, grezzi = sito_py.values(RILASCIO)
        opzioni = {"pseudo": True, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": w, "system": s}
        sito_py.build(tmp / "out", v, grezzi, opzioni)
        leggi = lambda r: (tmp / "out" / r).read_text(encoding="utf-8")   # noqa: E731
        self.assertIn('href="../design-system/caratteri/readex-pro/ReadexPro-wght.woff2" as="font"', leggi("ar/index.html"))
        self.assertEqual(leggi("ar/index.html").count("ReadexPro"), 1)
        for senza in ("it/index.html", "en/index.html", "zh/index.html", "ar-XB/index.html", "en-XA/index.html", "hi/index.html"):
            self.assertNotIn("ReadexPro", leggi(senza), senza)   # l'italiano non cambia di un byte; il latino, il cinese di sistema e le pseudo-lingue non ne hanno bisogno
        self.assertNotIn("NotoSansDevanagari", leggi("hi/index.html"))   # un file grande non si precarica
        self.assertEqual(leggi("it/index.html").count('rel="preload"'), 1)
        self.assertNotIn("ReadexPro", leggi("it/vecchia/index.html"))


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

    def test_il_nome_di_una_lingua_nel_suo_elenco_resta_com_e(self):
        pagina_con_elenco = '<html lang="ar" dir="rtl"><body><p>اللغة Linux</p><ul><li><a href="../de/" hreflang="de" lang="de">Deutsch</a></li></ul></body></html>'
        fuori = sito_py.isola_latino(pagina_con_elenco)
        self.assertIn('lang="de">Deutsch</a>', fuori)   # nessun LRI né PDI nel nome
        self.assertIn("\u2066Linux\u2069", fuori)         # il testo vicino sì

    def test_non_tocca_cio_che_non_e_testo(self):
        fuori = sito_py.isola_latino(self.PAGINA)
        self.assertIn('content="width=device-width, initial-scale=1"', fuori)   # un attributo non tradotto
        self.assertIn("{voce} &amp; 14/3", fuori)   # segnaposto, entità, cifre senza lettere
        self.assertIn('var a = "Linux";', fuori)   # uno script
        self.assertIn('href="x/"', fuori)
        self.assertEqual(sito_py.isola_latino(fuori), fuori)   # due volte è come una

    # Cifre con la virgola decimale (secondo sguardo su «stato», N7): «0,07 s» fra due parti latine isolate si leggeva «07 s,0» in arabo e in urdu, perché la virgola
    # non faceva parte della parte isolata e il 0 restava fuori, da solo. La virgola fra due cifre resta dentro; il punto delle migliaia c'era già; una virgola seguita
    # da uno spazio, o fra lettere, separa (è la punteggiatura della frase).
    def isolate(self, testo):
        return sito_py.isola_latino(f'<html lang="ar" dir="rtl"><body><p>{testo}</p></body></html>')

    def test_la_virgola_decimale_resta_dentro_la_parte_latina(self):
        fuori = self.isolate("لكل ثانية 0,07 s من المعالج وحوالي 10,6 MB")
        self.assertIn("\u20660,07 s\u2069", fuori)
        self.assertIn("\u206610,6 MB\u2069", fuori)
        self.assertNotIn("\u2066s\u2069", fuori)   # nessun pezzo spaiato
        self.assertNotIn(",\u2066", fuori.replace("0,07 s", "").replace("10,6 MB", ""))

    def test_il_punto_delle_migliaia_resta_dentro_la_parte_latina(self):
        fuori = self.isolate("حجم 1.250 MB للتحميل")
        self.assertIn("\u20661.250 MB\u2069", fuori)

    def test_una_virgola_seguita_da_uno_spazio_separa(self):
        fuori = self.isolate("Linux, 10 MB")
        self.assertIn("\u2066Linux\u2069, \u206610 MB\u2069", fuori)
        fuori = self.isolate("x86_64,Linux")   # fra lettere non è decimale: separa
        self.assertIn("\u2066x86_64\u2069,\u2066Linux\u2069", fuori)
        fuori = self.isolate("10,MB")   # una cifra, una virgola e una lettera: non è un decimale
        self.assertEqual(fuori.count("\u2066"), 1)

    def test_la_costruzione_isola_solo_da_destra_a_sinistra(self):
        guasta = self.PAGINA.replace("\u2066", "")
        self.assertNotEqual(sito_py.isola_latino(guasta), guasta)


class DataRelease(unittest.TestCase):
    """Ciò che dipende dall'essere la versione di prova o no si sceglie dai dati della versione (rifinitura 3a-r, N4): data-release="prova"
    resta soltanto con una versione di prova, "stabile" soltanto con una che non lo è, anche dentro una frase."""
    PAGINA = """<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title data-t="t">Prova</title></head>
<body>
<p data-t="frase">Versione<span data-release="prova"> di prova</span> {{kalliope.version}}, solo per Linux.</p>
<ul><li><span data-release="prova" data-t="nota.prova">Versione di prova · solo Linux</span><span data-release="stabile" data-t="nota.stabile">Solo Linux</span></li></ul>
</body></html>
"""

    def costruisci(self, di_prova, pagina_html=None):
        tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-3ar-release-"))
        self.addCleanup(shutil.rmtree, tmp, True)
        w = tmp / "website"
        w.mkdir()
        (w / "index.html").write_text(pagina_html or self.PAGINA, encoding="utf-8")
        (w / "lingue.html").write_text(SCELTA, encoding="utf-8")
        (w / "lingua.js").write_text("//", encoding="utf-8")
        (tmp / "design-system").mkdir()
        (tmp / "design-system" / "token.css").write_text(":root{}", encoding="utf-8")
        v, grezzi = sito_py.values({**RILASCIO, "prerelease": di_prova})
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": w, "system": tmp / "design-system"}
        sito_py.build(tmp / "out", v, grezzi, opzioni)
        return (tmp / "out" / "it" / "index.html").read_text(encoding="utf-8")

    def test_una_versione_di_prova_tiene_le_parole_di_prova(self):
        html = self.costruisci(True)
        self.assertIn('Versione<span data-release="prova"> di prova</span> 0.1, solo per Linux.', html)
        self.assertIn("Versione di prova · solo Linux", html)
        self.assertNotIn("Solo Linux", html)

    def test_una_versione_stabile_non_le_ha(self):
        html = self.costruisci(False)
        self.assertIn("Versione 0.1, solo per Linux.", html)   # lo spazio sta dentro l'elemento: la frase si chiude senza buchi
        self.assertNotIn("di prova", html)
        self.assertIn("Solo Linux", html)
        self.assertNotIn("Versione di prova", html)

    def test_un_valore_sconosciuto_ferma_la_costruzione(self):
        with self.assertRaises(SystemExit) as e:
            self.costruisci(True, self.PAGINA.replace('data-release="stabile"', 'data-release="beta"'))
        self.assertIn("data-release", str(e.exception))

    def test_il_catalogo_ha_tutte_e_due_le_forme(self):
        tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-3ar-release-cat-"))
        self.addCleanup(shutil.rmtree, tmp, True)
        (tmp / "index.html").write_text(self.PAGINA, encoding="utf-8")
        pagine, tutti, errori = catalogo.raccogli(tmp)
        self.assertEqual(errori, [])
        self.assertTrue({"nota.prova", "nota.stabile", "frase"} <= set(tutti))   # chi traduce vede tutte e due: la costruzione ne sceglie una


class FontiEIndirizzo(unittest.TestCase):
    """Le fonti dei fatti si aprono sul file alla versione mostrata, e l'indirizzo della pagina lo scrive la costruzione (incarico 3b-b, M5 e M7)."""
    PAGINA = """<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title data-t="t">Prova</title>
<link rel="canonical" href="https://sansevieria-ou.github.io/kalliope/stato/"></head>
<body>
<p data-t="fatto">Un fatto. <span class="fonte"><a href="{{kalliope.source.url}}/README.md" title="README.md" data-t-no="un percorso">README</a>, <a href="{{kalliope.source.url}}/crates/app/src/non-c-e.rs" title="x" data-t-no="un percorso">non-c-e.rs</a>, <a href="{{kalliope.tree.url}}/packaging/linux" title="x" data-t-no="un percorso">packaging/linux</a></span></p>
<p class="indirizzo" data-t-no="l'indirizzo">{{kalliope.page.url}}</p>
</body></html>
"""
    # i file e le cartelle del repository alla versione, com'è (git ls-tree): una cartella (tree) non è un file (blob)
    ALBERO = {"README.md": "blob", "crates": "tree", "crates/app": "tree", "crates/app/src": "tree", "crates/app/src/main.rs": "blob", "packaging": "tree", "packaging/linux": "tree"}

    def costruisci(self, percorsi, pagina_html=None, di_prova=False):
        tmp = pathlib.Path(tempfile.mkdtemp(prefix="lavoro-3bb-fonti-"))
        self.addCleanup(shutil.rmtree, tmp, True)
        w = tmp / "website"
        (w / "stato").mkdir(parents=True)
        (w / "stato" / "index.html").write_text(pagina_html or self.PAGINA, encoding="utf-8")
        (w / "lingue.html").write_text(SCELTA, encoding="utf-8")
        (w / "lingua.js").write_text("//", encoding="utf-8")
        (tmp / "design-system").mkdir()
        (tmp / "design-system" / "token.css").write_text(":root{}", encoding="utf-8")
        v, grezzi = sito_py.values({**RILASCIO, "prerelease": di_prova})
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": w, "system": tmp / "design-system",
                   "percorsi_versione": percorsi}
        _, giornale, _, _ = sito_py.build(tmp / "out", v, grezzi, opzioni)
        return (tmp / "out" / "it" / "stato" / "index.html").read_text(encoding="utf-8"), giornale

    def test_gli_indirizzi_dei_file_vengono_dalla_versione(self):
        v, _ = sito_py.values(RILASCIO)
        self.assertEqual(v["source.url"], "https://github.com/SANSEVIERIA-OU/kalliope/blob/v0.1")
        self.assertEqual(v["tree.url"], "https://github.com/SANSEVIERIA-OU/kalliope/tree/v0.1")

    def test_una_fonte_che_c_e_resta_un_collegamento_al_file_di_quella_versione(self):
        html, _ = self.costruisci(None)
        self.assertIn('href="https://github.com/SANSEVIERIA-OU/kalliope/blob/v0.1/README.md"', html)
        self.assertIn('href="https://github.com/SANSEVIERIA-OU/kalliope/tree/v0.1/packaging/linux"', html)
        html, _ = self.costruisci(self.ALBERO)
        self.assertIn('href="https://github.com/SANSEVIERIA-OU/kalliope/blob/v0.1/README.md"', html)
        self.assertIn('href="https://github.com/SANSEVIERIA-OU/kalliope/tree/v0.1/packaging/linux"', html)

    def test_una_fonte_che_a_quella_versione_non_c_e_resta_il_suo_nome_senza_collegamento(self):
        html, giornale = self.costruisci(self.ALBERO)
        self.assertNotIn("non-c-e.rs</a>", html)
        self.assertNotIn("blob/v0.1/crates/app/src/non-c-e.rs", html)   # il collegamento è tolto, non soltanto l'etichetta
        self.assertIn("non-c-e.rs, ", html)   # il nome resta nel testo
        self.assertTrue(any("crates/app/src/non-c-e.rs" in r and "without a link" in r for r in giornale), giornale)
        self.assertEqual(html.count("<a "), 2, html)   # README e packaging/linux: gli altri due link restano

    def test_la_prova_riconosce_una_copia_guasta(self):
        # con il controllo spento (la copia di prima) il collegamento rotto arriva ai visitatori: è ciò che la prova sopra deve vedere
        html, _ = self.costruisci(None)
        self.assertIn("non-c-e.rs</a>", html)
        # e una cartella scritta come file (o un file come cartella) non è la stessa cosa
        html, giornale = self.costruisci({**self.ALBERO, "packaging/linux": "blob"})
        self.assertEqual(html.count("<a "), 1)
        self.assertTrue(any("packaging/linux" in r for r in giornale))

    def test_l_indirizzo_della_pagina_e_quello_del_suo_canonical(self):
        html, _ = self.costruisci(None)
        self.assertIn('<p class="indirizzo" data-t-no="l\'indirizzo">https://esempio.test/k/it/stato/</p>', html)
        self.assertIn('<link rel="canonical" href="https://esempio.test/k/it/stato/">', html)

    def test_l_indirizzo_segue_la_lingua_della_pagina(self):
        self.assertEqual(sito_py.indirizzo_pagina("https://esempio.test/k/", "de", "stato/"), "https://esempio.test/k/de/stato/")

    def test_un_percorso_che_nessuno_puo_elencare_lascia_i_collegamenti(self):
        # senza rete e senza il tag nella copia (--release-json) la costruzione non può sapere: non toglie niente e lo dice nel suo avviso di partenza
        self.assertIsNone(sito_py.percorsi_della_versione("v0-non-c-e-in-nessun-repository", False))

    def test_le_fonti_della_pagina_stato_esistono_nel_repository(self):
        # nessun errore di battitura: ogni fonte della pagina vera è un file (o una cartella) che il repository ha (alla versione mostrata lo dice la costruzione)
        testo = (RADICE / "website" / "stato" / "index.html").read_text(encoding="utf-8")
        trovate = re.findall(r'href="\{\{kalliope\.(source|tree)\.url\}\}/([^"#?]+)"', testo)
        self.assertGreaterEqual(len(trovate), 14, trovate)
        # Tolte dal repository dopo la versione che la pagina descrive (v0.1-rc.1, dove esistono: la costruzione collega le fonti a
        # quella versione). Si tolgono da qui quando la pagina descrive la versione nuova.
        tolte_dopo = {"crates/app/src/download.rs"}
        for tipo, percorso in trovate:
            if percorso in tolte_dopo:
                continue
            f = RADICE / percorso
            self.assertTrue(f.is_dir() if tipo == "tree" else f.is_file(), f"{tipo}: {percorso}")

    def test_la_pagina_stato_non_scrive_l_indirizzo_a_mano(self):
        testo = (RADICE / "website" / "stato" / "index.html").read_text(encoding="utf-8")
        self.assertIn("{{kalliope.page.url}}", testo)
        self.assertNotIn("github.io/kalliope/stato/</p>", testo)
        self.assertNotIn("location.href", (RADICE / "website" / "stato" / "stato.js").read_text(encoding="utf-8"))   # il messaggio copiato non dipende da dov'è aperta la pagina


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
