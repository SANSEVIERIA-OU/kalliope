# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of the program's translations (docs/translating.md, «The program»): the extraction of `@tr` and `tr!`, the catalogue they
fill, the checks of a language, and the tables the Rust crate (crates/i18n) is tested against. Standard library only.

    python3 -I -m unittest discover -s tools -p 'test_*.py'

Each check has a case that passes and a spoilt copy that fails: a text with no key, a key with two texts, a placeholder of another
kind, a plural in a Slint text that has none, a language with one program message missing.
"""
import json
import pathlib
import re
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import importlib.util  # noqa: E402
import site as _site_stdlib  # noqa: E402,F401  (the standard library's `site`, loaded before ours is imported under another name)
import slint_valori  # noqa: E402
import translations  # noqa: E402
from i18n import app, catalogo, cldr, plurali, po, pseudo  # noqa: E402

_spec = importlib.util.spec_from_file_location("kalliope_site", pathlib.Path(__file__).resolve().parent / "site.py")
sito_py = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sito_py)

RADICE = pathlib.Path(__file__).resolve().parent.parent
CRATES = RADICE / "crates"
PAGINA = '<!doctype html><html lang="it"><head><meta charset="utf-8"><title data-t="titolo">Prova</title></head><body><p data-t="p">Ciao</p></body></html>\n'


def slint(testo, nome="x.slint"):
    return app.leggi_sorgente(testo, nome, "slint")


def rust(testo, nome="x.rs"):
    return app.leggi_sorgente(testo, nome, "rust")


def senza_commenti(testo):
    """Il testo senza i commenti di riga: per contare le chiamate in un altro modo da quello dell'estrattore."""
    return "\n".join(re.sub(r"(?<!:)//.*$", "", riga) for riga in testo.split("\n"))


class Estrazione(unittest.TestCase):
    def test_slint_chiave_testo_e_argomenti(self):
        m, e = slint('x: @tr("programma.a.b" => "Voce: {}", root.v); y: @tr("programma.a.c" => "Ripeti");')
        self.assertEqual(e, [])
        self.assertEqual([(x.chiave, x.testo, x.plurale) for x in m], [("programma.a.b", "Voce: {}", None), ("programma.a.c", "Ripeti", None)])

    def test_slint_plurale_con_il_conto(self):
        m, e = slint('t: @tr("programma.a.m" => "{0} · ne manca {n}" | "{0} · ne mancano {n}" % ceil((a - b) / 1s), root.tempo);')
        self.assertEqual(e, [])
        self.assertEqual((m[0].testo, m[0].plurale), ("{0} · ne manca {n}", "{0} · ne mancano {n}"))

    def test_slint_ignora_commenti_e_stringhe(self):
        m, e = slint('// @tr("programma.no.a" => "no")\n/* @tr("programma.no.b" => "no") */\nx: "@tr(finto)"; y: @tr("programma.si" => "sì");')
        self.assertEqual(e, [])
        self.assertEqual([x.chiave for x in m], ["programma.si"])

    def test_slint_escape_e_virgolette(self):
        m, e = slint(r'x: @tr("programma.q" => "Dice \"ciao\"\n e «poi» \u{2192} fine");')
        self.assertEqual(e, [])
        self.assertEqual(m[0].testo, 'Dice "ciao"\n e «poi» → fine')

    def test_rust_tr_e_trn_con_argomenti_e_righe_spezzate(self):
        m, e = rust('''fn f() {
    let a = tr!("programma.s.a" => "Sto parlando…");
    let b = kalliope_i18n::trn!("programma.s.b" => "Ne manca {n}" | "Ne mancano {n}", n, x = 1);
    let c = tr!(
        "programma.s.c" => "uno \\
             due {nome}",
        nome = f("a (b)"),
    );
    let ch = 'x'; let l: &'static str = "tr!(finto)"; // tr!("programma.no" => "no")
}''')
        self.assertEqual(e, [])
        self.assertEqual([(x.chiave, x.testo, x.plurale) for x in m], [
            ("programma.s.a", "Sto parlando…", None), ("programma.s.b", "Ne manca {n}", "Ne mancano {n}"), ("programma.s.c", "uno due {nome}", None)])

    def test_rust_un_nome_che_finisce_per_tr_non_e_una_chiamata(self):
        m, e = rust('fn f() { mytr!("programma.no" => "no"); extr!("programma.no" => "no"); }')
        self.assertEqual((m, e), ([], []))

    def test_la_nota_per_chi_traduce(self):
        m, _ = slint('// TRANSLATORS: {0} is the name of a voice\nx: @tr("programma.a" => "Voce: {}", v);\ny: @tr("programma.b" => "Altro");')
        self.assertEqual((m[0].nota, m[1].nota), ("{0} is the name of a voice", None))
        m, _ = rust('let a = tr!("programma.a" => "uno"); // TRANSLATORS: dopo\nlet b = tr!("programma.b" => "due");')
        self.assertEqual((m[0].nota, m[1].nota), ("dopo", None))

    # --- le copie guaste: ognuna deve fallire ---
    def test_un_testo_senza_chiave_e_un_errore(self):
        for cosa, testo in (("slint", 'x: @tr("Ripeti");'), ("rust", 'let a = tr!("Sto parlando");')):
            m, e = (slint if cosa == "slint" else rust)(testo)
            self.assertTrue(e and "key" in e[0], (cosa, e))

    def test_una_chiave_che_non_e_del_programma_e_un_errore(self):
        for chiave in ("app.finestra", "programma", "programma.Maiuscola", "programma.a b", "programma..x", "finestra.x"):
            m, e = slint(f'x: @tr("{chiave}" => "Testo");')
            self.assertTrue(e, chiave)

    def test_il_formato_dei_segnaposto(self):
        casi = [
            ("slint", 'x: @tr("programma.a" => "{} e {0}", a, b);', "one or the other"),
            ("slint", 'x: @tr("programma.a" => "Ciao {nome}", a);', "only {}"),
            ("slint", 'x: @tr("programma.a" => "Ne mancano {n}", a);', "no plural"),
            ("rust", 'let a = tr!("programma.a" => "Ciao {}", x);', "names its arguments"),
            ("rust", 'let a = tr!("programma.a" => "Ciao {0}", x);', "names its arguments"),
        ]
        for cosa, testo, parte in casi:
            m, e = (slint if cosa == "slint" else rust)(testo)
            self.assertTrue(any(parte in r for r in e), (testo, e))

    def test_trn_ha_bisogno_del_plurale_e_tr_non_lo_ha(self):
        self.assertTrue(rust('let a = trn!("programma.a" => "uno", n);')[1])
        self.assertTrue(rust('let a = tr!("programma.a" => "uno" | "più");')[1])

    def test_una_chiave_con_due_testi_e_un_errore(self):
        d = pathlib.Path(tempfile.mkdtemp(prefix="app-test-"))
        self.addCleanup(shutil.rmtree, d, True)
        (d / "crates" / "app" / "ui").mkdir(parents=True)
        (d / "crates" / "app" / "src").mkdir(parents=True)
        (d / "crates" / "app" / "ui" / "a.slint").write_text('x: @tr("programma.k" => "Uno"); y: @tr("programma.k" => "Uno");')
        (d / "crates" / "app" / "src" / "a.rs").write_text('fn f() { tr!("programma.k" => "Due"); tr!("programma.j" => "Tre"); }')
        tutti, errori = app.raccogli(d / "crates")
        self.assertTrue(any("programma.k" in r and "another text" in r for r in errori), errori)
        # lo stesso testo ripetuto, anche in file diversi dello stesso tipo, va bene
        (d / "crates" / "app" / "src" / "a.rs").write_text('fn f() { tr!("programma.j" => "Tre"); }')
        (d / "crates" / "app" / "src" / "b.rs").write_text('fn g() { tr!("programma.j" => "Tre"); }')
        tutti, errori = app.raccogli(d / "crates")
        self.assertEqual(errori, [])
        self.assertEqual(tutti["programma.j"].usi, {"crates/app/src/a.rs", "crates/app/src/b.rs"})

    def test_la_stessa_chiave_in_slint_e_in_rust_e_un_errore(self):
        d = pathlib.Path(tempfile.mkdtemp(prefix="app-test-"))
        self.addCleanup(shutil.rmtree, d, True)
        (d / "crates" / "app" / "ui").mkdir(parents=True)
        (d / "crates" / "app" / "src").mkdir(parents=True)
        (d / "crates" / "app" / "ui" / "a.slint").write_text('x: @tr("programma.k" => "Uno");')
        (d / "crates" / "app" / "src" / "a.rs").write_text('fn f() { tr!("programma.k" => "Uno"); }')
        self.assertTrue(any("two keys" in r for r in app.raccogli(d / "crates")[1]))

    def test_una_chiamata_non_chiusa_o_una_stringa_non_chiusa(self):
        self.assertTrue(rust('fn f() { tr!("programma.a" => "uno"')[1] or rust('fn f() { tr!("programma.a" => "uno"')[0] == [])
        self.assertTrue(slint('x: @tr("programma.a" => "uno')[1])


class IlProgrammaVero(unittest.TestCase):
    """Il programma di questo repository, letto da cima a fondo."""

    @classmethod
    def setUpClass(cls):
        cls.tutti, cls.errori = app.raccogli(CRATES)

    def test_nessun_errore(self):
        self.assertEqual(self.errori, [])

    def test_ogni_chiamata_dei_sorgenti_e_stata_trovata(self):
        # un altro modo di contare: l'espressione regolare su ogni file, senza i commenti di riga e senza le definizioni dei macro
        attese = 0
        for f, linguaggio in app.sorgenti(CRATES):
            testo = f.read_text(encoding="utf-8")
            if linguaggio == "slint":
                if testo.startswith("// Generated"):
                    continue
                attese += len(re.findall(r"@tr\(", senza_commenti(testo)))
            else:
                solo_codice = re.sub(r"'(?:\\u\{[0-9a-f]+\}|\\.|[^\\'])'", "''", senza_commenti(testo))     # senza le virgolette dei caratteri
                solo_codice = re.sub(r"\"(?:[^\"\\]|\\.)*\"", '""', solo_codice, flags=re.S)   # senza il contenuto delle stringhe
                attese += len(re.findall(r"(?<![A-Za-z0-9_])trn?!\s*\(", solo_codice))
        trovate = sum(1 for f, l in app.sorgenti(CRATES) for _ in app.leggi_sorgente(f.read_text(encoding="utf-8"), str(f), l)[0])
        self.assertEqual(trovate, attese)
        self.assertGreater(attese, 150)

    def test_non_resta_un_testo_italiano_fuori_dal_catalogo_nelle_finestre(self):
        """Ogni testo che la finestra mostra passa dal catalogo: nei .slint un `text:` o `testo:` con una stringa letterale è
        soltanto un nome proprio, un simbolo o un'unità."""
        ok = {"Kalliope", "Kalliope ", "Giulia", "Marco", "0.1", ""}
        letterali = []
        for f in sorted((CRATES / "app" / "ui").rglob("*.slint")):
            if f.name == "catalogo.slint" or f.read_text(encoding="utf-8").startswith("// Generated"):
                continue
            testo = slint_valori.codice(f.read_text(encoding="utf-8"))   # senza commenti, con le stringhe svuotate
            originale = f.read_text(encoding="utf-8").split("\n")
            for n, riga in enumerate(testo.split("\n"), 1):
                for m in re.finditer(r"\b(?:text|testo):\s*(\"[^\"]*\")", originale[n - 1]):
                    valore = m.group(1).strip('"')
                    if valore not in ok:
                        letterali.append(f"{f.name}:{n}: {m.group(0)}")
        self.assertEqual(letterali, [], "un testo scritto nella finestra senza @tr: mettilo nel catalogo (o, se è un nome proprio, in `ok` qui)")

    def test_le_chiavi_sono_del_programma_e_il_sito_non_le_usa(self):
        self.assertTrue(all(k.startswith("programma.") for k in self.tutti))
        pagine, sito, errori = catalogo.raccogli(RADICE / "website")
        self.assertEqual(errori, [])
        self.assertFalse([k for k in sito if k.startswith("programma.")])

    def test_i_testi_con_un_conto_hanno_il_plurale(self):
        for k, m in self.tutti.items():
            if "{n}" in m.testo:
                self.assertIsNotNone(m.plurale, f"{k}: usa {{n}} ma non ha la forma plurale")


class CatalogoDelProgramma(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="app-cat-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        (self.tmp / "website").mkdir()
        (self.tmp / "website" / "index.html").write_text(PAGINA, encoding="utf-8")
        ui, src = self.tmp / "crates" / "app" / "ui", self.tmp / "crates" / "app" / "src"
        ui.mkdir(parents=True); src.mkdir(parents=True)
        (ui / "a.slint").write_text('x: @tr("programma.a.voce" => "Voce: {}", v);\ny: @tr("programma.a.mancano" => "{0} · ne manca {n}" | "{0} · ne mancano {n}" % c, t);\n')
        (src / "a.rs").write_text('fn f() { tr!("programma.s.pronta" => "Pronta"); tr!("programma.s.leggo" => "Leggo «{nome}»", nome = x); }')
        self.sito, self.crates = self.tmp / "website", self.tmp / "crates"
        pagine, tutti, errori = catalogo.raccogli(self.sito, self.crates)
        self.assertEqual(errori, [])
        self.mod = catalogo.modello(pagine, tutti)

    def voce(self, cat, chiave):
        return next(v for v in cat.voci if v.ctx == chiave)

    def lingua(self, codice="de", modifica=None):
        cat = catalogo.unisci(None, self.mod, codice)
        for v in cat.voci:
            v.str = [v.id if v.id_plurale is None else (v.id if i == 0 else v.id_plurale) for i in range(len(v.str))]
        if modifica:
            modifica(cat)
        return cat

    def test_il_modello_ha_i_messaggi_del_sito_e_del_programma(self):
        self.assertEqual([v.ctx for v in self.mod.voci], ["titolo", "p", "programma.a.voce", "programma.a.mancano", "programma.s.pronta", "programma.s.leggo"])
        v = self.voce(self.mod, "programma.a.mancano")
        self.assertEqual((v.id, v.id_plurale), ("{0} · ne manca {n}", "{0} · ne mancano {n}"))
        self.assertIn("kalliope-slint", v.flags)
        self.assertIn("kalliope-rust", self.voce(self.mod, "programma.s.leggo").flags)
        self.assertEqual(self.voce(self.mod, "programma.a.voce").riferimenti, ["crates/app/ui/a.slint"])

    def test_l_italiano_ha_le_forme_del_plurale_di_cldr(self):
        it = catalogo.unisci(None, self.mod, "it", sorgente=True)
        self.assertEqual(self.voce(it, "programma.a.mancano").str, ["{0} · ne manca {n}", "{0} · ne mancano {n}", "{0} · ne mancano {n}"])
        self.assertTrue(catalogo.controlla(it, self.mod, "it").completa)

    def test_una_lingua_completa_passa_e_una_con_un_messaggio_del_programma_in_meno_no(self):
        self.assertTrue(catalogo.controlla(self.lingua(), self.mod, "de").completa)
        e = catalogo.controlla(self.lingua(modifica=lambda c: c.voci.remove(self.voce(c, "programma.s.pronta"))), self.mod, "de")
        self.assertEqual(e.mancanti, ["programma.s.pronta"])
        self.assertFalse(e.completa)

    def test_i_segnaposto_del_programma(self):
        def con(chiave, testo, forma=0):
            return lambda c: self.voce(c, chiave).str.__setitem__(forma, testo)
        ok = [("programma.a.voce", "Stimme: {}"), ("programma.a.voce", "{0}: Stimme"), ("programma.s.leggo", "«{nome}» lese ich")]
        for chiave, testo in ok:
            e = catalogo.controlla(self.lingua(modifica=con(chiave, testo)), self.mod, "de")
            self.assertEqual(e.errori, [], (chiave, testo))
        guasti = [("programma.a.voce", "Stimme"), ("programma.a.voce", "Stimme {1}"), ("programma.a.voce", "{} {0}"),
                  ("programma.s.leggo", "Ich lese {name}"), ("programma.s.leggo", "Ich lese"), ("programma.s.leggo", "Ich lese {}"),
                  ("programma.s.leggo", "Ich lese {nome} {altro}")]
        for chiave, testo in guasti:
            e = catalogo.controlla(self.lingua(modifica=con(chiave, testo)), self.mod, "de")
            self.assertTrue(e.errori or e.mancanti, (chiave, testo))

    def test_il_plurale_puo_lasciar_cadere_il_conto_ma_non_inventarne_uno(self):
        def forma(testo):
            return lambda c: self.voce(c, "programma.a.mancano").str.__setitem__(0, testo)
        self.assertEqual(catalogo.controlla(self.lingua(modifica=forma("{0} · noch eine")), self.mod, "de").errori, [])
        self.assertTrue(catalogo.controlla(self.lingua(modifica=forma("{0} · noch {m}")), self.mod, "de").errori)
        self.assertTrue(catalogo.controlla(self.lingua(modifica=forma("{2} · noch {n}")), self.mod, "de").errori)

    def test_il_numero_di_forme_del_plurale(self):
        e = catalogo.controlla(self.lingua("pl", lambda c: self.voce(c, "programma.a.mancano").str.__setitem__(slice(None), ["a {0} {n}", "b {0} {n}"])), self.mod, "pl")
        self.assertTrue(any("forms" in r for r in e.errori), e.errori)

    def test_un_testo_cambiato_nel_sorgente_rende_la_traduzione_fuzzy(self):
        cat = self.lingua()
        (self.crates / "app" / "src" / "a.rs").write_text('fn f() { tr!("programma.s.pronta" => "Pronta adesso"); tr!("programma.s.leggo" => "Leggo «{nome}»", nome = x); }')
        pagine, tutti, _ = catalogo.raccogli(self.sito, self.crates)
        nuovo = catalogo.modello(pagine, tutti)
        self.assertEqual(catalogo.controlla(cat, nuovo, "de").fuori_data, ["programma.s.pronta"])
        unito = catalogo.unisci(cat, nuovo, "de")
        v = self.voce(unito, "programma.s.pronta")
        self.assertTrue(v.fuzzy)
        self.assertEqual((v.prec_id, v.str), ("Pronta", ["Pronta"]))
        self.assertFalse(catalogo.controlla(unito, nuovo, "de").completa)

    def test_extract_scrive_il_modello_e_l_italiano_e_check_li_trova_aggiornati(self):
        lingue = self.sito / "lingue"
        argv = ["--website", str(self.sito), "--app", str(self.crates)]
        self.assertEqual(translations.main(["extract"] + argv), 0)
        pot = (lingue / "site.pot").read_text(encoding="utf-8")
        self.assertIn('msgctxt "programma.a.mancano"', pot)
        self.assertIn('msgid_plural "{0} · ne mancano {n}"', pot)
        self.assertEqual(translations.main(["extract", "--check"] + argv), 0)
        self.assertEqual(translations.main(["check"] + argv), 0)
        # un messaggio nuovo nei sorgenti, e `extract --check` dice che i cataloghi sono vecchi
        (self.crates / "app" / "src" / "a.rs").write_text('fn f() { tr!("programma.s.nuova" => "Nuova"); }')
        self.assertEqual(translations.main(["extract", "--check"] + argv), 1)

    def test_senza_app_una_copia_del_sito_non_ha_messaggi_del_programma(self):
        pagine, tutti, errori = translations.carica(self.sito)
        self.assertEqual(list(tutti), ["titolo", "p"])

    def test_i_testi_del_sito_non_possono_avere_una_chiave_del_programma(self):
        (self.sito / "index.html").write_text(PAGINA.replace('data-t="p"', 'data-t="programma.x"'), encoding="utf-8")
        pagine, tutti, errori = catalogo.raccogli(self.sito, self.crates)
        self.assertTrue(any("programma." in r for r in errori), errori)


class DatiCheIlProgrammaCondivide(unittest.TestCase):
    """I file di dati dai quali crates/i18n si prova (e che Python rifà da CLDR): se CLDR o le regole cambiano, questi falliscono."""

    def test_le_pseudo_lingue_di_rust_sono_quelle_di_python(self):
        righe = []
        for riga in (CRATES / "i18n" / "tests" / "pseudo.txt").read_text(encoding="utf-8").splitlines():
            modo, testo, atteso = riga.split("|", 2)
            f = pseudo.en_xa if modo == "en-XA" else pseudo.ar_xb
            self.assertEqual(f(testo.replace("\\n", "\n")), atteso.replace("\\n", "\n"), (modo, testo))
            righe.append(modo)
        self.assertGreaterEqual(len(righe), 20)
        self.assertEqual(set(righe), {"en-XA", "ar-XB"})

    def test_le_forme_dei_plurali_di_rust_sono_quelle_di_cldr(self):
        campione = list(range(0, 31)) + list(range(98, 113)) + [121, 122, 125, 200, 1000, 1001, 1002, 1011, 1012, 1100, 21000000, 1000000, 1000001, 2000000, 10 ** 9 + 1]
        atteso = []
        for c in cldr.lingue():
            p = cldr.info(c)["plurali"]
            f = plurali.forme(p["regole"])
            atteso.append(f"{c}\t{p['intestazione']}\t" + ",".join(f"{n}={f.index(plurali.categoria_di(p['regole'], n))}" for n in campione))
        self.assertEqual((CRATES / "i18n" / "tests" / "plurali.txt").read_text(encoding="utf-8"), "\n".join(atteso) + "\n")

    def test_la_tabella_delle_scritture_di_rust_e_cldr_e_token_css(self):
        sorgente = (CRATES / "i18n" / "src" / "scritture.rs").read_text(encoding="utf-8")
        tabella = {c: (s, rtl == "true") for c, s, rtl in re.findall(r'\("([a-zA-Z-]+)", Script::(\w+), (true|false)\)', sorgente)}
        # da destra a sinistra: come CLDR
        for c in cldr.lingue():
            self.assertEqual(tabella.get(c, ("Latin", False))[1], cldr.info(c)["direzione"] == "rtl", c)
        self.assertEqual(tabella["ar-XB"][1], True)
        # le scritture che non sono latine: le lingue che token.css lega a un carattere con :lang()
        css = (RADICE / "design-system" / "token.css").read_text(encoding="utf-8")
        con_regola = set()
        for gruppo in re.findall(r"^((?::lang\(\w+\)(?:,\s*)?)+)\s*\{", css, re.M):
            con_regola |= set(re.findall(r":lang\((\w+)\)", gruppo))
        non_latine = {c for c, (s, _) in tabella.items() if s != "Latin" and "-" not in c}
        self.assertEqual(non_latine, con_regola)
        # le scritture: la stessa per le lingue della stessa scrittura
        self.assertEqual({c: tabella[c][0] for c in non_latine}, {"ar": "Arabic", "ur": "Arabic", "bg": "Cyrillic", "el": "Greek", "hi": "Devanagari", "bn": "Bengali", "zh": "Han"})

    def test_la_distanza_fra_le_righe_della_finestra_e_quella_del_sito(self):
        css = (RADICE / "design-system" / "token.css").read_text(encoding="utf-8")
        finestra = dict(re.findall(r"--app-interlinea-([a-z]{2}):\s*([\d.]+);", css))
        sito = {}
        for gruppo, corpo in re.findall(r"^((?::lang\(\w+\)(?:,\s*)?)+)\s*\{([^}]*)\}", css, re.M):
            m = re.search(r"--interlinea-testo-scrittura:\s*([\d.]+);", corpo)
            if m:
                for lingua in re.findall(r":lang\((\w+)\)", gruppo):
                    sito[lingua] = m.group(1)
        self.assertEqual(finestra, sito)
        # e l'elenco delle lingue in aspetto.slint è lo stesso
        aspetto = (RADICE / "crates" / "app" / "ui" / "kalliope" / "aspetto.slint").read_text(encoding="utf-8")
        self.assertEqual(set(re.findall(r'root\.lingua == "(\w+)" \? Token\.interlinea-', aspetto)), set(finestra))

    def test_ogni_lingua_con_una_scrittura_sua_ha_il_carattere_nel_sistema_tranne_il_cinese(self):
        css = (RADICE / "design-system" / "token.css").read_text(encoding="utf-8")
        righe = dict(re.findall(r'--app-carattere-([a-z]{2}):\s*url\("([^"]+)"\)', css))
        self.assertEqual(set(righe), {"ar", "ur", "bg", "el", "hi", "bn"})
        for lingua, file in righe.items():
            ttf = RADICE / "design-system" / file
            self.assertTrue(ttf.is_file(), f"{lingua}: {file}")
            self.assertTrue(ttf.with_suffix(".woff2").is_file(), f"{lingua}: il .ttf si ricava dal .woff2 (tools/caratteri_ttf.py)")
        # un carattere per scrittura: lo stesso file per il greco e il cirillico
        self.assertEqual(righe["el"], righe["bg"])

    def test_i_ttf_del_programma_non_vanno_nel_sito(self):
        """Il TTF accanto a un .woff2 con lo stesso nome è la copia della finestra: il sito serve il woff2 e non pubblica 1,7 MB in più."""
        sito = sito_py.Sito(RADICE / "website", RADICE / "design-system")
        pubblicati = set(sito.risorse)
        for ttf in (RADICE / "design-system" / "caratteri").rglob("*.ttf"):
            rel = f"{sito_py.SYSTEM_IN_SITE}/{ttf.relative_to(RADICE / 'design-system').as_posix()}"
            self.assertEqual(rel in pubblicati, not ttf.with_suffix(".woff2").exists(), rel)
        # i due che c'erano già (nessun .woff2 con il loro nome) restano pubblicati, come prima
        self.assertIn(f"{sito_py.SYSTEM_IN_SITE}/caratteri/lexend/Lexend-wght.ttf", pubblicati)

    def test_la_regola_dello_specchio_di_slint_valori(self):
        d = pathlib.Path(tempfile.mkdtemp(prefix="valori-"))
        self.addCleanup(shutil.rmtree, d, True)
        # senza il controvolta: tre difetti, uno per Text, TextInput e Image
        (d / "a.slint").write_text("component A { Text { text: \"x\"; } TextInput { } img := Image { source: \"a\"; } }\n")
        # il controvolta c'è ma il lato no (Slint dispone «start» a sinistra in ogni lingua): un difetto per Text e per TextInput;
        # e il lato c'è ma non la distanza fra le righe della scrittura
        (d / "b.slint").write_text("component B { Text { transform-scale-x: Token.verso; } TextInput { transform-scale-x: Token.verso; } }\n"
                                   "component G { Text { transform-scale-x: Token.verso; horizontal-alignment: left; } }\n")
        # un componente che è un Text: il lato nella definizione, il controvolta dove lo si usa, non nella radice (Slint la ignora)
        (d / "c.slint").write_text("component C inherits Text { transform-scale-x: Token.verso; }\ncomponent U { C { text: \"x\"; } }\n")
        # tutto in ordine, e un testo in un commento o in una stringa non conta
        (d / "d.slint").write_text("component D { Text { transform-scale-x: Token.verso; horizontal-alignment: Aspetto.inizio; line-height-factor: Aspetto.interlinea; text: \"Text {\"; } // Text { }\n"
                                   "  Image { transform-scale-x: Token.verso; }\n"
                                   "  TextInput { transform-scale-x: Token.verso; horizontal-alignment: center; line-height-factor: 1; } }\n"
                                   "component E inherits Text { horizontal-alignment: Aspetto.inizio; line-height-factor: Aspetto.interlinea; }\ncomponent F { E { transform-scale-x: Token.verso; } }\n")
        trovati = sorted((p.name, v) for p, _, t, v, _ in slint_valori.controlla(d) if t == "SPECCHIO")
        self.assertEqual(trovati, [("a.slint", "Image"), ("a.slint", "Text"), ("a.slint", "TextInput"),
                                   ("b.slint", "Text without horizontal-alignment"), ("b.slint", "Text without line-height-factor"),
                                   ("b.slint", "TextInput without horizontal-alignment"),
                                   ("c.slint", "C"), ("c.slint", "C without horizontal-alignment")])
        self.assertEqual(slint_valori.controlla(RADICE / "crates" / "app" / "ui"), [])

if __name__ == "__main__":
    unittest.main()
