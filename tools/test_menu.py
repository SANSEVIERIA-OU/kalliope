# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of the applications menu entry in every language (tools/menu.py, tools/i18n/menu.py): the model and its messages, the
check of a translated line, the desktop file written from the catalogue, and the file of the repository. Standard library only.

    python3 -I -m unittest discover -s tools -p 'test_menu.py'

Each check has a case that passes and a spoilt copy that fails: a key of the window in the model, a list of words without its «;», a
line break in a translation, a fuzzy or out-of-date line, a desktop file edited by hand.
"""
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import menu as menu_py  # noqa: E402
from i18n import catalogo, menu, po  # noqa: E402

RADICE = pathlib.Path(__file__).resolve().parent.parent
MODELLO = """# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# A line Key=@tr("programma.menu.KEY" => "text") is a message.
[Desktop Entry]
Type=Application
Name=Kalliope
# TRANSLATORS: The kind of program.
GenericName=@tr("programma.menu.genere" => "Voce per le videochiamate")
Comment=@tr("programma.menu.descrizione" => "Scrivi e fatti sentire")
# TRANSLATORS: Words to search with.
Keywords=@tr("programma.menu.parole" => "voce;microfono;")
Exec=kalliope
Categories=Utility;Accessibility;
"""
PAGINA = '<!doctype html><html lang="it"><head><meta charset="utf-8"><title data-t="titolo">Prova</title></head><body><p data-t="p">Ciao</p></body></html>\n'


def voce(chiave, italiano):
    return po.Voce(ctx=chiave, id=italiano)


class Modello(unittest.TestCase):
    def test_i_messaggi_con_chiave_testo_e_nota(self):
        righe, msgs, errori = menu.leggi(MODELLO, "x.desktop.in")
        self.assertEqual(errori, [])
        self.assertEqual({k: m.testo for k, m in msgs.items()},
                         {"programma.menu.genere": "Voce per le videochiamate", "programma.menu.descrizione": "Scrivi e fatti sentire",
                          "programma.menu.parole": "voce;microfono;"})
        self.assertEqual(msgs["programma.menu.genere"].nota, "The kind of program.")
        self.assertIsNone(msgs["programma.menu.descrizione"].nota)   # la nota è della riga subito sotto, non della successiva
        self.assertEqual(msgs["programma.menu.parole"].nota, "Words to search with.")
        self.assertIn(("GenericName", "programma.menu.genere"), righe)
        self.assertIn("Exec=kalliope", righe)

    def test_una_chiave_della_finestra_nel_modello_e_un_errore(self):
        _, _, errori = menu.leggi(MODELLO.replace("programma.menu.genere", "programma.finestra.genere"), "x.desktop.in")
        self.assertTrue(any("must start with programma.menu." in e for e in errori), errori)

    def test_una_chiave_due_volte_e_un_errore(self):
        _, _, errori = menu.leggi(MODELLO.replace("programma.menu.descrizione", "programma.menu.genere"), "x.desktop.in")
        self.assertTrue(any("twice" in e for e in errori), errori)

    def test_un_tr_scritto_male_e_un_errore(self):
        _, _, errori = menu.leggi(MODELLO.replace('Comment=@tr("programma.menu.descrizione" => "Scrivi e fatti sentire")',
                                                  'Comment=@tr("programma.menu.descrizione", "Scrivi")'), "x.desktop.in")
        self.assertTrue(any("a line with @tr" in e for e in errori), errori)

    def test_un_segnaposto_nel_modello_e_un_errore(self):
        _, _, errori = menu.leggi(MODELLO.replace("Scrivi e fatti sentire", "Scrivi {nome}"), "x.desktop.in")
        self.assertTrue(any("placeholders" in e for e in errori), errori)


class Riga(unittest.TestCase):
    def test_una_lista_giusta_passa(self):
        self.assertEqual(menu.controlla_testo(voce("programma.menu.parole", "voce;microfono;"), "Stimme;Mikrofon;Sprachausgabe;"), [])

    def test_una_lista_senza_il_punto_e_virgola_finale_non_passa(self):
        self.assertTrue(menu.controlla_testo(voce("programma.menu.parole", "voce;microfono;"), "Stimme;Mikrofon"))

    def test_una_parola_vuota_o_gli_spazi_non_passano(self):
        v = voce("programma.menu.parole", "voce;microfono;")
        self.assertTrue(menu.controlla_testo(v, "Stimme;;Mikrofon;"))
        self.assertTrue(menu.controlla_testo(v, ";Stimme;Mikrofon;"))
        self.assertTrue(menu.controlla_testo(v, "Stimme ; Mikrofon;"))

    def test_un_a_capo_una_barra_o_un_punto_e_virgola_in_un_testo_non_passano(self):
        v = voce("programma.menu.genere", "Voce per le videochiamate")
        self.assertEqual(menu.controlla_testo(v, "Stimme für Videoanrufe"), [])
        self.assertTrue(menu.controlla_testo(v, "Stimme\nfür Videoanrufe"))
        self.assertTrue(menu.controlla_testo(v, "Stimme\\sfür Videoanrufe"))
        self.assertTrue(menu.controlla_testo(v, "Stimme; Videoanrufe"))
        self.assertTrue(menu.controlla_testo(v, " Stimme"))


class Scrittura(unittest.TestCase):
    def test_inglese_di_base_poi_le_lingue_in_ordine(self):
        t = menu.scrivi(MODELLO, "packaging/linux/x.desktop.in", {
            "en": {"programma.menu.genere": "Voice for video calls", "programma.menu.parole": "voice;microphone;"},
            "de": {"programma.menu.genere": "Stimme für Videoanrufe"}, "ar": {"programma.menu.genere": "صوت لمكالمات الفيديو"}})
        righe = t.splitlines()
        self.assertEqual(righe[0], "# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1")
        self.assertIn("do not edit by hand", righe[1])
        self.assertEqual(righe[2], "[Desktop Entry]")
        i = righe.index("GenericName=Voice for video calls")
        self.assertEqual(righe[i + 1:i + 4], ["GenericName[ar]=صوت لمكالمات الفيديو", "GenericName[de]=Stimme für Videoanrufe",
                                              "GenericName[it]=Voce per le videochiamate"])
        # dove l'inglese manca, la riga di base è l'italiano; l'inglese non si ripete come [en]
        self.assertIn("Comment=Scrivi e fatti sentire", righe)
        self.assertNotIn("[en]", t)
        self.assertIn("Keywords=voice;microphone;", righe)
        self.assertIn("Categories=Utility;Accessibility;", righe)
        self.assertNotIn("TRANSLATORS", t)
        self.assertNotIn("@tr", t)


class DalCatalogo(unittest.TestCase):
    """Un repository in piccolo: una pagina, una finestra, il modello del menu; il catalogo, il controllo e il file scritto."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        r = self.r = pathlib.Path(self._tmp.name)
        (r / "website").mkdir()
        (r / "website" / "index.html").write_text(PAGINA, encoding="utf-8")
        (r / "crates" / "app" / "ui").mkdir(parents=True)
        (r / "crates" / "app" / "ui" / "x.slint").write_text('t: @tr("programma.finestra.altro" => "Altro");\n', encoding="utf-8")
        (r / "packaging" / "linux").mkdir(parents=True)
        (r / "packaging" / "linux" / "x.desktop.in").write_text(MODELLO, encoding="utf-8")
        pagine, tutti, errori = catalogo.raccogli(r / "website", r / "crates")
        self.assertEqual(errori, [])
        self.mod = catalogo.modello(pagine, tutti)
        self.lingue = r / "website" / "lingue"
        self.lingue.mkdir()

    def tearDown(self):
        self._tmp.cleanup()

    def lingua(self, codice, testi, fuzzy=()):
        cat = catalogo.unisci(None, self.mod, codice)
        for v in cat.voci:
            if v.ctx in testi:
                v.str = [testi[v.ctx]]
                if v.ctx in fuzzy:
                    v.flags.append("fuzzy")
        (self.lingue / f"{codice}.po").write_text(po.scrivi(cat), encoding="utf-8")
        return catalogo.controlla(po.leggi((self.lingue / f"{codice}.po").read_text(encoding="utf-8")), self.mod, codice)

    TEDESCO = {"titolo": "Probe", "p": "Hallo", "programma.finestra.altro": "Mehr", "programma.menu.genere": "Stimme für Videoanrufe",
               "programma.menu.descrizione": "Schreib und werde gehört", "programma.menu.parole": "Stimme;Mikrofon;"}

    def test_le_righe_del_menu_sono_messaggi_del_programma_con_il_loro_flag(self):
        v = {x.ctx: x for x in self.mod.voci}["programma.menu.parole"]
        self.assertIn("kalliope-desktop", v.flags)
        self.assertEqual(v.riferimenti, ["packaging/linux/x.desktop.in"])
        self.assertTrue(any("Words to search with." in e for e in v.estratti))

    def test_una_lingua_intera_entra_nel_file(self):
        self.assertTrue(self.lingua("de", self.TEDESCO).completa)
        t = menu.scrivi(MODELLO, "x.desktop.in", menu_py.pronte(MODELLO, "x.desktop.in", self.lingue))
        self.assertIn("GenericName[de]=Stimme für Videoanrufe", t)
        self.assertIn("Keywords[de]=Stimme;Mikrofon;", t)

    def test_una_lista_rotta_e_un_errore_del_controllo_e_resta_fuori(self):
        e = self.lingua("de", self.TEDESCO | {"programma.menu.parole": "Stimme;Mikrofon"})
        self.assertTrue(any("programma.menu.parole" in x and "ends with" in x for x in e.errori), e.errori)
        t = menu.scrivi(MODELLO, "x.desktop.in", menu_py.pronte(MODELLO, "x.desktop.in", self.lingue))
        self.assertNotIn("Keywords[de]", t)
        self.assertIn("GenericName[de]=Stimme für Videoanrufe", t)   # le altre righe della lingua restano

    def test_una_riga_fuzzy_resta_fuori(self):
        self.lingua("de", self.TEDESCO, fuzzy={"programma.menu.genere"})
        t = menu.scrivi(MODELLO, "x.desktop.in", menu_py.pronte(MODELLO, "x.desktop.in", self.lingue))
        self.assertNotIn("GenericName[de]", t)
        self.assertIn("Comment[de]=Schreib und werde gehört", t)

    def test_una_riga_del_testo_italiano_di_ieri_resta_fuori(self):
        self.lingua("de", self.TEDESCO)
        oggi = MODELLO.replace("Scrivi e fatti sentire", "Scrivi e fatti sentire da tutti")
        t = menu.scrivi(oggi, "x.desktop.in", menu_py.pronte(oggi, "x.desktop.in", self.lingue))
        self.assertNotIn("Comment[de]", t)
        self.assertIn("Comment[it]=Scrivi e fatti sentire da tutti", t)


class NelRepository(unittest.TestCase):
    def test_il_file_del_menu_e_quello_che_lo_strumento_scrive(self):
        file = menu_py.costruisci()
        self.assertEqual(list(file), [RADICE / "packaging/linux/io.github.sansevieria_ou.kalliope.desktop"])
        for percorso, testo in file.items():
            self.assertEqual(percorso.read_text(encoding="utf-8"), testo, "run `python3 -I tools/menu.py`")

    def test_un_file_cambiato_a_mano_non_passa_il_controllo(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = pathlib.Path(tmp)
            (r / "packaging" / "linux").mkdir(parents=True)
            (r / "packaging" / "linux" / "x.desktop.in").write_text(MODELLO, encoding="utf-8")
            (r / "lingue").mkdir()
            self.assertEqual(menu_py.controlla(r, r / "lingue"), [r / "packaging/linux/x.desktop"])   # manca
            for percorso, testo in menu_py.costruisci(r, r / "lingue").items():
                percorso.write_text(testo, encoding="utf-8")
            self.assertEqual(menu_py.controlla(r, r / "lingue"), [])
            f = r / "packaging/linux/x.desktop"
            f.write_text(f.read_text(encoding="utf-8").replace("Exec=kalliope", "Exec=kalliope --demo vuota"), encoding="utf-8")
            self.assertEqual(menu_py.controlla(r, r / "lingue"), [f])

    def test_ogni_lingua_pubblicata_ha_tutto_il_menu(self):
        lingue = RADICE / "website" / "lingue"
        modello = (RADICE / "packaging/linux/io.github.sansevieria_ou.kalliope.desktop.in").read_text(encoding="utf-8")
        _, messaggi, _ = menu.leggi(modello, "m")
        pronte = menu_py.pronte(modello, "m", lingue)
        pagine, tutti, _ = catalogo.raccogli(RADICE / "website", RADICE / "crates")
        mod = catalogo.modello(pagine, tutti)
        for codice in catalogo.lingue_presenti(lingue):
            if codice == "it":
                continue
            if catalogo.controlla(catalogo.leggi_lingua(lingue, codice), mod, codice).completa:
                self.assertEqual(set(pronte.get(codice, {})), set(messaggi), codice)


LEGGI_CON_GLIB = """
import json, sys
import gi
gi.require_version("Gio", "2.0")
from gi.repository import Gio
a = Gio.DesktopAppInfo.new_from_filename(sys.argv[1])
print(json.dumps([a.get_name(), a.get_generic_name(), a.get_description(), a.get_keywords()]))
"""


def glib():
    try:
        return subprocess.run([sys.executable, "-I", "-c", "import gi; gi.require_version('Gio', '2.0')"], capture_output=True).returncode == 0
    except OSError:
        return False


@unittest.skipUnless(glib(), "PyGObject with Gio is needed (python3-gi, gir1.2-glib-2.0)")
class ComeLoLeggeIlDesktop(unittest.TestCase):
    """Il file del repository letto da GLib (GDesktopAppInfo, quello di GNOME e di chi usa GLib) con la lingua di sistema di
    ogni lingua: le parole che il menu mostra e cerca sono quelle del catalogo."""

    FILE = RADICE / "packaging/linux/io.github.sansevieria_ou.kalliope.desktop"

    @classmethod
    def setUpClass(cls):
        # GLib does not load an entry whose program is not on PATH: a `kalliope` that does nothing
        cls._bin = tempfile.TemporaryDirectory()
        finto = pathlib.Path(cls._bin.name) / "kalliope"
        finto.write_text("#!/bin/sh\n", encoding="utf-8")
        finto.chmod(0o755)

    @classmethod
    def tearDownClass(cls):
        cls._bin.cleanup()

    def leggi(self, locale):
        env = {k: v for k, v in os.environ.items() if not k.startswith(("LC_", "LANG"))} | {"LC_ALL": locale}
        env["PATH"] = self._bin.name + os.pathsep + env.get("PATH", "")
        r = subprocess.run([sys.executable, "-I", "-c", LEGGI_CON_GLIB, str(self.FILE)], capture_output=True, text=True, env=env, check=True)
        return json.loads(r.stdout)

    def attese(self, codice):
        modello = self.FILE.with_suffix(".desktop.in").read_text(encoding="utf-8")
        _, messaggi, _ = menu.leggi(modello, "m")
        pronte = menu_py.pronte(modello, "m", RADICE / "website" / "lingue")
        testi = {k: m.testo for k, m in messaggi.items()} if codice == "it" else pronte.get(codice, {})
        base = pronte.get("en", {})
        return [testi.get(k, base.get(k, messaggi[k].testo)) for k in ("programma.menu.genere", "programma.menu.descrizione", "programma.menu.parole")]

    def test_ogni_lingua_del_file(self):
        testo = self.FILE.read_text(encoding="utf-8")
        codici = sorted(set(re.findall(r"^GenericName\[([^\]]+)\]=", testo, re.M)))
        self.assertIn("it", codici)
        for codice in codici:
            nome, genere, descrizione, parole = self.leggi(f"{codice}_XX.UTF-8")
            g, d, p = self.attese(codice)
            self.assertEqual((nome, genere, descrizione), ("Kalliope", g, d), codice)
            self.assertEqual(parole, p.rstrip(";").split(";"), codice)

    def test_la_variante_prende_la_lingua_e_una_lingua_che_manca_l_inglese(self):
        for locale, codice in (("pt_BR.UTF-8", "pt"), ("zh_TW.UTF-8", "zh"), ("de_AT.UTF-8", "de")):
            if f"GenericName[{codice}]=" in self.FILE.read_text(encoding="utf-8"):
                self.assertEqual(self.leggi(locale)[1], self.attese(codice)[0], locale)
        self.assertEqual(self.leggi("ja_JP.UTF-8")[1], self.attese("en")[0])


CERCA_CON_GLIB = """
import json, sys
import gi
gi.require_version("Gio", "2.0")
from gi.repository import Gio
ID = sys.argv[1]
print(json.dumps([q for q in sys.argv[2:] if not any(ID in gruppo for gruppo in Gio.DesktopAppInfo.search(q))], ensure_ascii=False))
"""


@unittest.skipUnless(glib(), "PyGObject with Gio is needed (python3-gi, gir1.2-glib-2.0)")
class ComeLoCercaIlDesktop(unittest.TestCase):
    """La ricerca del desktop (g_desktop_app_info_search, quella di GNOME Shell) con l'indice di un sistema che ha solo Kalliope:
    in ogni lingua ogni parola chiave trova Kalliope, scritta intera e anche solo con le prime lettere, come la scrive chi ha fretta."""

    FILE = RADICE / "packaging/linux/io.github.sansevieria_ou.kalliope.desktop"

    def test_ogni_parola_chiave_e_il_suo_inizio_trovano_kalliope(self):
        testo = self.FILE.read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as tmp:
            r = pathlib.Path(tmp)
            (r / "share" / "applications").mkdir(parents=True)
            (r / "share" / "applications" / self.FILE.name).write_text(testo, encoding="utf-8")
            (r / "bin").mkdir()
            (r / "bin" / "kalliope").write_text("#!/bin/sh\n", encoding="utf-8")
            (r / "bin" / "kalliope").chmod(0o755)
            righe = dict(re.findall(r"^Keywords(?:\[([^\]]+)\])?=(.*)$", testo, re.M))
            self.assertIn("", righe)   # la riga di base, inglese
            for codice, parole in righe.items():
                cerca = []
                for p in filter(None, parole.split(";")):
                    cerca += [p, p[:4]]
                # una lingua senza riga (ja) vede la riga di base; LANGUAGE è quello che GLib legge per primo
                env = {"HOME": tmp, "PATH": f"{r / 'bin'}{os.pathsep}{os.environ.get('PATH', '')}", "LC_ALL": "C.UTF-8",
                       "LANGUAGE": codice or "ja", "XDG_DATA_DIRS": str(r / "share"), "XDG_DATA_HOME": str(r / "vuota")}
                out = subprocess.run([sys.executable, "-I", "-c", CERCA_CON_GLIB, self.FILE.name, *cerca], capture_output=True,
                                     text=True, env=env, check=True)
                self.assertEqual(json.loads(out.stdout), [], codice or "en")


if __name__ == "__main__":
    unittest.main()
