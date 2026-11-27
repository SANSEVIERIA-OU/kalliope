# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of the mark of Kalliope: the generator (tools/marchio.py), its rasteriser, and how the site build puts the mark in the pages.
Standard library only (cairosvg, when it is installed, is one more witness for the rasteriser; without it that case is skipped).

    python3 -I -m unittest discover -s tools -p 'test_*.py'

Every check has a case that passes and a spoilt copy that must fail: a changed token, a changed drawing, a file edited by hand, a page that
writes its own icon or its own drawing, a design system whose mark does not match its tokens. Some cases fail on the code of before the
mark entered the design system (pages with a hand-copied drawing and the green icon).
"""
import importlib.util
import json
import pathlib
import re
import shutil
import struct
import sys
import tempfile
import unittest
import zlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import site as _site_stdlib  # noqa: E402,F401  (the standard library's `site`, loaded before ours is imported under another name)
import marchio  # noqa: E402
import marchio_raster as raster  # noqa: E402

_spec = importlib.util.spec_from_file_location("kalliope_site", pathlib.Path(__file__).resolve().parent / "site.py")
sito_py = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sito_py)

RADICE = pathlib.Path(__file__).resolve().parent.parent
SISTEMA = RADICE / "design-system"
MARCHIO = SISTEMA / "marchio"
RILASCIO = {"tag_name": "v0.1", "published_at": "2026-11-12T15:57:29Z", "html_url": "https://x/r", "prerelease": False,
            "assets": [{"name": "k-0.1-amd64.deb", "browser_download_url": "https://x/d", "size": 14_123_456, "digest": "sha256:aa"},
                       {"name": "k-0.1-x86_64.rpm", "browser_download_url": "https://x/r", "size": 15_000_000, "digest": "sha256:bb"},
                       {"name": "k-0.1-linux-x86_64.tar.gz", "browser_download_url": "https://x/t", "size": 16_000_000, "digest": "sha256:cc"},
                       {"name": "kalliope-bin.PKGBUILD", "browser_download_url": "https://x/p"}, {"name": "SHA256SUMS", "browser_download_url": "https://x/s"}]}


def copia_del_sistema(destinazione):
    """Una copia di token.css e di marchio/ in una cartella nuova: ciò che il generatore legge e ciò che scrive."""
    (destinazione / "marchio").mkdir(parents=True)
    shutil.copy(SISTEMA / "token.css", destinazione / "token.css")
    for f in MARCHIO.iterdir():
        shutil.copy(f, destinazione / "marchio" / f.name)
    return destinazione


class DaiToken(unittest.TestCase):
    """I file del marchio sono quelli che il disegno e i token producono, e una copia guastata non lo è."""

    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="l3-marchio-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)

    def test_i_file_del_repository_corrispondono(self):
        self.assertEqual(marchio.controlla(SISTEMA, marchio.LINUX), [])

    def test_una_copia_intatta_corrisponde(self):
        self.assertEqual(marchio.controlla(copia_del_sistema(self.tmp / "ok")), [])

    def test_un_token_cambiato_fa_fallire_ogni_file_che_lo_usa(self):
        s = copia_del_sistema(self.tmp / "token")
        css = (s / "token.css").read_text(encoding="utf-8")
        self.assertIn("--segno-colore: #e6396e;", css)
        (s / "token.css").write_text(css.replace("--segno-colore: #e6396e;", "--segno-colore: #123456;"), encoding="utf-8")
        errori = marchio.controlla(s)
        for nome in ("libero.svg", "piena.svg", "piccola.svg", "favicon.ico"):
            self.assertTrue(any(nome in e for e in errori), (nome, errori))
        self.assertFalse(any("simbolica.svg" in e or "barra.svg" in e for e in errori), errori)   # il grigio simbolico e la barra (senza colori) non lo usano

    def test_il_grigio_simbolico_e_la_piastra_sono_dei_token(self):
        for token, file in (("--segno-simbolo: #2e3436;", "simbolica.svg"), ("--segno-piastra: #fab7c2;", "piena.svg")):
            s = copia_del_sistema(self.tmp / file)
            css = (s / "token.css").read_text(encoding="utf-8")
            self.assertIn(token, css)
            (s / "token.css").write_text(css.replace(token, token.split(":")[0] + ": #654321;"), encoding="utf-8")
            self.assertTrue(any(file in e for e in marchio.controlla(s)), file)

    def test_la_geometria_cambiata_fa_fallire(self):
        s = copia_del_sistema(self.tmp / "geometria")
        j = json.loads((s / "marchio" / "disegno.json").read_text(encoding="utf-8"))
        j["forme"]["libero"]["contorno"]["spessore"] = 10
        (s / "marchio" / "disegno.json").write_text(json.dumps(j), encoding="utf-8")
        errori = marchio.controlla(s)
        self.assertTrue(any("libero.svg" in e for e in errori) and any("barra.svg" in e for e in errori), errori)

    def test_un_file_modificato_a_mano_manca_o_non_torna(self):
        s = copia_del_sistema(self.tmp / "mano")
        svg = s / "marchio" / "libero.svg"
        svg.write_text(svg.read_text(encoding="utf-8").replace("#e6396e", "#e6396f", 1), encoding="utf-8")
        ico = s / "marchio" / "favicon.ico"
        dati = bytearray(ico.read_bytes())
        dati[len(dati) // 2] ^= 0x40   # un byte di un'immagine
        ico.write_bytes(bytes(dati))
        (s / "marchio" / "piena.svg").unlink()
        errori = marchio.controlla(s)
        self.assertTrue(any("libero.svg" in e for e in errori), errori)
        self.assertTrue(any("favicon.ico" in e for e in errori), errori)
        self.assertTrue(any("piena.svg: manca" in e for e in errori), errori)

    def test_un_png_ricompresso_con_gli_stessi_pixel_corrisponde_ma_con_un_pixel_diverso_no(self):
        n = 48
        svg = (MARCHIO / "libero.svg").read_text(encoding="utf-8")
        rgba = raster.disegna(svg, n)
        buono = raster.png(n, n, rgba)
        w, h, px = raster.leggi_png(buono)
        righe = b"".join(b"\0" + px[y * w * 4:(y + 1) * w * 4] for y in range(h))
        altro = (b"\x89PNG\r\n\x1a\n" + raster._chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
                 + raster._chunk(b"IDAT", zlib.compress(righe, 1)) + raster._chunk(b"IEND", b""))   # gli stessi pixel, un'altra compressione
        self.assertNotEqual(altro, buono)
        self.assertTrue(marchio.uguale(pathlib.Path("a.png"), buono, altro))
        guasto = bytearray(px)
        guasto[(20 * n + 20) * 4 + 3] ^= 0x80
        self.assertFalse(marchio.uguale(pathlib.Path("a.png"), buono, raster.png(n, n, bytes(guasto))))
        self.assertFalse(marchio.uguale(pathlib.Path("a.png"), buono, b"non un png"))

    def test_senza_marchio_il_sistema_non_ha_niente_da_dire(self):
        (self.tmp / "vuoto").mkdir()
        self.assertEqual(marchio.controlla_sistema(self.tmp / "vuoto"), [])

    def test_il_token_definito_due_volte_con_valori_diversi_e_un_errore(self):
        with self.assertRaises(SystemExit):
            marchio.leggi_token(":root { --segno-colore: #111111; } :root { --segno-colore: #222222; }")
        self.assertEqual(marchio.leggi_token(":root { --testo: #ffedef; --segno-parola: var(--testo); }"), {"--segno-parola": "#ffedef"})

    def test_il_colore_deve_essere_un_colore(self):
        with self.assertRaises(SystemExit):
            marchio.colori({"--segno-colore": "rebeccapurple", "--segno-parola": "#ffffff", "--segno-piastra": "#ffffff", "--segno-simbolo": "#000000"})
        with self.assertRaises(SystemExit):
            marchio.colori({"--segno-colore": "#ffffff"})


class ContenutoDeiFile(unittest.TestCase):
    """Che cosa c'è dentro i file generati."""

    def leggi(self, nome):
        return (MARCHIO / nome).read_text(encoding="utf-8")

    def test_i_file_isolati_non_hanno_ritagli_ne_fogli_di_stile_ne_var(self):
        for nome in ("libero.svg", "piena.svg", "piccola.svg", "simbolica.svg"):
            t = self.leggi(nome)
            for vietato in ("clipPath", "clip-path", "<style", "var(", "xml-stylesheet", "style="):
                self.assertNotIn(vietato, t, f"{nome}: {vietato}")
            self.assertEqual(len(re.findall(r"<!--", t)), len(re.findall(r"-->", t)))
            self.assertNotIn("--", re.sub(r"<!--.*?-->", lambda m: "", t, flags=re.S).replace("stroke-", ""), nome)   # un SVG ben formato: niente «--» nei commenti
            for commento in re.findall(r"<!--(.*?)-->", t, flags=re.S):
                self.assertNotIn("--", commento, nome)
            self.assertTrue(re.search(r'fill="#[0-9a-f]{6}"', t), nome)

    def test_la_barra_non_ha_colori_e_ha_le_parti_con_il_loro_nome(self):
        t = self.leggi("barra.svg")
        self.assertNotRegex(t, r"#[0-9a-fA-F]{3,6}\b")
        self.assertNotIn("style=", t)
        for parte in ("m-segno", "m-detto", "m-bordo", "m-dette", "m-fronte", 'id="m-bolla"', 'id="m-detto"', 'id="m-attesa"'):
            self.assertIn(parte, t)
        self.assertEqual(t.count('class="m-fronte"'), 2)   # i due ritagli che marchio.js sposta insieme

    def test_il_colore_del_marchio_e_quello_del_token_e_il_verde_di_prima_non_c_e(self):
        col = marchio.colori(marchio.leggi_token((SISTEMA / "token.css").read_text(encoding="utf-8")))
        for nome in ("libero.svg", "piccola.svg"):
            t = self.leggi(nome)
            self.assertIn(col["--segno-colore"], t)
            for verde in ("#2fb39a", "#16806f", "linearGradient"):
                self.assertNotIn(verde, t, nome)
        self.assertIn(col["--segno-simbolo"], self.leggi("simbolica.svg"))
        self.assertIn(col["--segno-piastra"], self.leggi("piena.svg"))

    def test_le_icone_del_programma_sono_la_forma_libera_e_la_simbolica(self):
        self.assertEqual((marchio.LINUX / f"{marchio.APP_ID}.svg").read_bytes(), (MARCHIO / "libero.svg").read_bytes())
        self.assertEqual((marchio.LINUX / f"{marchio.APP_ID}-symbolic.svg").read_bytes(), (MARCHIO / "simbolica.svg").read_bytes())
        for n in marchio.PNG_LINUX:
            w, h, _ = raster.leggi_png((marchio.LINUX / f"{marchio.APP_ID}-{n}.png").read_bytes())
            self.assertEqual((w, h), (n, n))

    def test_l_ico_ha_16_32_e_48_a_32_bit_con_trasparenza(self):
        dati = (MARCHIO / "favicon.ico").read_bytes()
        riservato, tipo, quante = struct.unpack("<HHH", dati[:6])
        self.assertEqual((riservato, tipo, quante), (0, 1, 3))
        voci = [struct.unpack("<BBBBHHII", dati[6 + 16 * k:22 + 16 * k]) for k in range(3)]
        self.assertEqual([v[0] for v in voci], [16, 32, 48])
        self.assertTrue(all(v[5] == 32 for v in voci))
        immagini = raster.leggi_ico(dati)
        for n, rgba in immagini:
            alfa = rgba[3::4]
            self.assertEqual(alfa[0], 0, "l'angolo è trasparente")
            self.assertGreater(max(alfa), 250, "ha parti piene")
        self.assertEqual(raster.ico(immagini), dati)   # si rilegge e si riscrive uguale

    def test_la_piccola_ha_il_contorno_di_un_pixel_sulla_griglia_di_16(self):
        """Il fondo della bolla, come l'alto, sta al centro di una riga di pixel: il contorno tratteggiato non si spalma su due righe (a 16 px sul
        chiaro e sullo scuro, e a 32 e 48, resta pieno)."""
        px = raster.disegna(self.leggi("piccola.svg"), 16)
        alfa = lambda x, y: px[(y * 16 + x) * 4 + 3]   # noqa: E731
        self.assertEqual(max(alfa(x, 2) for x in range(10, 12)), 255)    # alto: righe 2
        self.assertEqual(max(alfa(x, 11) for x in range(9, 11)), 255)    # basso: riga 11 (prima il tratto cadeva a metà fra la 10 e la 11)
        self.assertLess(max(alfa(x, 10) for x in range(9, 11)), 40)


class Rasterizzatore(unittest.TestCase):
    def test_una_pillola_ha_la_copertura_dell_area_vera(self):
        svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="4" fill="#000000"/></svg>'
        px = raster.disegna(svg, 16)
        def vero(x, y):
            cx = min(max(x, 6), 10)
            return (x - cx) ** 2 + (y - 8) ** 2 <= 16
        for riga in range(3, 13):
            for col in range(1, 15):
                n = sum(vero(col + (i + 0.5) / 32, riga + (j + 0.5) / 32) for i in range(32) for j in range(32)) / 1024
                self.assertAlmostEqual(px[(riga * 16 + col) * 4 + 3] / 255, n, delta=0.02, msg=(col, riga))

    def test_un_contorno_tratteggiato_ha_i_trattini_dove_il_disegno_li_mette(self):
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M0 4H32" fill="none" stroke="#000000" stroke-width="2" '
               'stroke-dasharray="4 4" stroke-dashoffset="2"/></svg>')
        px = raster.disegna(svg, 32)   # un pixel per unità
        riga = [px[(3 * 32 + x) * 4 + 3] for x in range(32)]
        # il disegno dei trattini comincia 2 unità dentro il primo: 2 pieni, 4 vuoti, 4 pieni, 4 vuoti…
        self.assertEqual(riga[:18], [255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255])

    def test_un_trattino_su_un_arco_finisce_perpendicolare_alla_tangente_e_senza_gobbe(self):
        """Due difetti trovati confrontando con Chromium: l'estremo di un trattino su una curva era tagliato perpendicolare alla corda e non alla tangente,
        e le giunzioni tonde erano dischi interi, che sporgevano oltre l'estremo del trattino dove i lati sono più corti del raggio."""
        import math
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><path d="M66 36A30 30 0 0 1 36 66" fill="none" stroke="#000000" stroke-width="24" '
               'stroke-dasharray="20 100"/></svg>')   # un quarto di cerchio di raggio 30 e centro (36 36), un trattino lungo 20: finisce a 0,667 rad
        n = 384
        px = raster.disegna(svg, n)
        def alfa(r, ang):
            x, y = 36 + r * math.cos(ang), 36 + r * math.sin(ang)
            return px[(int(y * n / 96) * n + int(x * n / 96)) * 4 + 3] / 255
        fine = 20 / 30
        for r in (20.0, 30.0, 40.0):
            self.assertEqual(alfa(r, fine - 0.08), 1, f"dentro il trattino, r={r}")
            self.assertEqual(alfa(r, fine + 0.08), 0, f"oltre l'estremo, r={r}: una gobba o un taglio storto")
        # il taglio è radiale: a raggi diversi la fine del trattino sta allo stesso angolo (la copertura sommata lungo l'arco ne dà la posizione al di sotto del pixel)
        def taglio(r, passi=800):
            lo, hi = fine - 0.1, fine + 0.1
            return lo + sum(alfa(r, lo + (hi - lo) * (k + 0.5) / passi) for k in range(passi)) * (hi - lo) / passi
        self.assertAlmostEqual(taglio(20.0), fine, delta=0.006)
        self.assertAlmostEqual(taglio(40.0), fine, delta=0.006)
        self.assertAlmostEqual(taglio(20.0), taglio(40.0), delta=0.006)
        pts, tang = raster.appiattisci(raster.sottopercorsi("M66 36A30 30 0 0 1 36 66")[0][0], 1.0)
        te = raster.tratti_a_trattini(pts, tang, False, [20.0, 100.0], 0.0)[0][2]
        self.assertAlmostEqual(te[0], -math.sin(fine), places=3)   # la tangente esatta: perpendicolare al raggio
        self.assertAlmostEqual(te[1], math.cos(fine), places=3)

    def test_il_ritaglio_e_l_intersezione_e_il_fronte_spostato_si_vede(self):
        barra = (MARCHIO / "barra.svg").read_text(encoding="utf-8")
        col = marchio.colori(marchio.leggi_token((SISTEMA / "token.css").read_text(encoding="utf-8")))
        classi = {"m-detto": {"fill": col["--segno-colore"]}, "m-bordo": {"stroke": col["--segno-colore"]}, "m-dette": {"fill": col["--segno-parola"]}}
        a_riposo = raster.disegna(barra, 64, classi)
        pieno = raster.disegna(barra.replace('class="m-fronte" d=', 'class="m-fronte" transform="translate(62 0)" d='), 64, classi)
        coperti = lambda px: sum(1 for a in px[3::4] if a > 128)   # noqa: E731
        self.assertGreater(coperti(pieno), coperti(a_riposo) * 1.15)   # tutta piena: più pixel pieni della bolla detta a metà, con il tratteggio

    def test_la_forma_libera_e_la_barra_a_riposo_sono_lo_stesso_disegno(self):
        """Il disegno senza ritagli (le icone) e quello con i ritagli (la barra) differiscono solo dove il fronte taglia il contorno: pochi pixel."""
        barra = (MARCHIO / "barra.svg").read_text(encoding="utf-8")
        libero = (MARCHIO / "libero.svg").read_text(encoding="utf-8")
        col = marchio.colori(marchio.leggi_token((SISTEMA / "token.css").read_text(encoding="utf-8")))
        classi = {"m-detto": {"fill": col["--segno-colore"]}, "m-bordo": {"stroke": col["--segno-colore"]}, "m-dette": {"fill": col["--segno-parola"]}}
        n = 64
        a, b = raster.disegna(barra, n, classi), raster.disegna(libero, n)
        diversi = sum(1 for i in range(n * n) if abs(a[i * 4 + 3] - b[i * 4 + 3]) > 40 or (a[i * 4 + 3] > 200 and max(abs(a[i * 4 + k] - b[i * 4 + k]) for k in range(3)) > 40))
        self.assertLess(diversi, 12, "solo i due punti dove il fronte taglia il contorno")
        self.assertGreater(sum(1 for v in a[3::4] if v > 200), 700)

    def test_png_e_ico_si_rileggono(self):
        rgba = bytes(c for y in range(8) for x in range(8) for c in (x * 30, y * 30, 99, 255 if (x + y) % 3 else 0))
        w, h, px = raster.leggi_png(raster.png(8, 8, rgba))
        self.assertEqual((w, h, px), (8, 8, rgba))
        self.assertEqual(raster.leggi_ico(raster.ico([(8, rgba)])), [(8, rgba)])
        with self.assertRaises(ValueError):
            raster.leggi_png(b"x" * 20)

    def test_un_percorso_o_un_comando_fuori_dall_elenco_e_un_errore(self):
        with self.assertRaises(ValueError):
            raster.sottopercorsi("M0 0Q1 1 2 2")
        with self.assertRaises(ValueError):
            raster.sottopercorsi("M0 0A3 4 0 0 1 5 5")   # arco ellittico

    def test_cairosvg_la_pensa_come_noi(self):
        try:
            import cairosvg  # noqa: F401
            from PIL import Image  # noqa: F401
        except ImportError:
            self.skipTest("cairosvg e Pillow non ci sono: un testimone in meno")
        import io
        from PIL import Image
        n = 64
        for nome in ("libero.svg", "piccola.svg"):
            svg = (MARCHIO / nome).read_bytes()
            ref = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg, output_width=n, output_height=n))).convert("RGBA")
            mio = Image.frombytes("RGBA", (n, n), raster.disegna(svg.decode(), n))
            sfondo = Image.new("RGBA", (n, n), (30, 30, 30, 255))
            a, b = sfondo.copy(), sfondo.copy()
            a.alpha_composite(ref); b.alpha_composite(mio)
            diversi = sum(1 for p, q in zip(a.convert("RGB").tobytes()[::3], b.convert("RGB").tobytes()[::3]) if abs(p - q) > 40)
            self.assertLess(diversi, 40, nome)


class Geometria(unittest.TestCase):
    """Il taglio della sagoma al fronte."""

    def test_le_due_parti_rifanno_il_contorno(self):
        disegno = json.loads((MARCHIO / "disegno.json").read_text(encoding="utf-8"))
        for nome, forma in disegno["forme"].items():
            segs = marchio.leggi_d(forma["sagoma"])
            sinistra, destra, tagli, prima = marchio.taglia(segs, forma["fronte"])
            totale = sum(marchio.lunghezza(s) for s in segs)
            self.assertAlmostEqual(sum(marchio.lunghezza(s) for s in sinistra) + sum(marchio.lunghezza(s) for s in destra), totale, places=6, msg=nome)
            self.assertEqual(len(tagli), 2, nome)
            # la sinistra comincia dove finisce la destra, e finisce dove comincia
            self.assertAlmostEqual(destra[-1][2][0], sinistra[0][1][0], places=6, msg=nome)
            self.assertAlmostEqual(sinistra[-1][2][0], destra[0][1][0], places=6, msg=nome)

    def test_un_fronte_che_non_incrocia_la_sagoma_in_due_punti_e_un_errore(self):
        segs = marchio.leggi_d("M0 0h10v10h-10z")
        with self.assertRaises(SystemExit):
            marchio.taglia(segs, {"retta": 50})
        with self.assertRaises(SystemExit):
            marchio.taglia(marchio.leggi_d("M0 0h10v10h-10v-10z M20 0h10v10h-10z"), {"retta": 5})

    def test_un_fronte_che_taglia_un_arco_e_un_errore(self):
        with self.assertRaises(SystemExit):
            marchio.taglia(marchio.leggi_d("M0 5A5 5 0 0 1 10 5A5 5 0 0 1 0 5z"), {"retta": 5})


class NelSito(unittest.TestCase):
    """La costruzione mette il disegno e l'icona della scheda in ogni pagina, dalla fonte unica."""

    @classmethod
    def setUpClass(cls):
        cls.tmp = pathlib.Path(tempfile.mkdtemp(prefix="l3-sito-"))
        cls.v, cls.grezzi = sito_py.values(RILASCIO)
        cls.out = cls.tmp / "out"
        # Italian only: the test counts the pages of one language
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": {"it"}, "website": RADICE / "website",
                   "system": SISTEMA}
        sito_py.build(cls.out, cls.v, cls.grezzi, opzioni)

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, True)

    def pagine(self):
        return [p for p in self.out.rglob("*.html") if "design-system" not in p.parts and 'http-equiv="refresh"' not in p.read_text(encoding="utf-8")]

    def test_nessuna_pagina_di_partenza_scrive_il_disegno_o_l_icona(self):
        """Fallisce sul codice di prima: ogni pagina aveva il suo SVG copiato (una bolla verde), l'immagine della scheda e il suo <link rel="icon">."""
        for f in sorted((RADICE / "website").rglob("*.html")):
            t = f.read_text(encoding="utf-8")
            rel = f.relative_to(RADICE / "website")
            self.assertNotIn("icona-bolla", t, rel)
            self.assertNotIn("linearGradient", t, rel)
            self.assertNotIn("immagini/icona.svg", t, rel)
            self.assertNotRegex(t, r'<link[^>]*rel="icon"', str(rel))
            for m in re.finditer(r'<a class="(?:marchio|marca)"[^>]*>(.*?)</a>', t, flags=re.S):
                self.assertNotRegex(m.group(1), r"<svg[^>]*viewBox|<img", f"{rel}: il disegno va segnato con data-marchio, non scritto")
                self.assertIn("data-marchio=", m.group(1), rel)
        self.assertFalse((RADICE / "website" / "immagini" / "icona.svg").exists())

    def test_ogni_pagina_costruita_ha_il_disegno_e_l_icona_della_scheda_che_si_aprono(self):
        viste = 0
        for f in self.pagine():
            t = f.read_text(encoding="utf-8")
            rel = f.relative_to(self.out)
            self.assertNotIn("data-marchio", t, rel)
            self.assertNotIn("icona-bolla", t, rel)
            icone = re.findall(r'<link rel="icon" href="([^"]+)"([^>]*)>', t)
            self.assertEqual([i[0].rsplit("/", 1)[1] for i in icone], ["favicon.ico", "piccola.svg"], rel)
            self.assertIn('sizes="any"', icone[0][1])
            self.assertIn('type="image/svg+xml"', icone[1][1])
            for href, _ in icone:
                base = self.out if href.startswith("/k/") else (f.parent if not t.count("<base href") else self.out)
                href = href.removeprefix("/k/")
                self.assertTrue((base / href).resolve().is_file(), f"{rel}: {href} non porta a un file")
            if 'class="marchio"' in t:
                self.assertEqual(len(re.findall(r'<svg class="m-segno"', t)), 1, rel)
            else:
                self.assertRegex(t, r'<a class="marca"[^>]*><img src="[^"]*design-system/marchio/libero\.svg" alt="" width="40" height="40">', rel)
            viste += 1
        self.assertEqual(viste, 6)   # cinque pagine nella lingua e la 404; Ascolta è nella home, Aiuto in riunione, sistema è il catalogo condiviso

    def test_il_segno_inserito_e_quello_generato(self):
        barra = re.sub(r"<!--.*?-->\s*", "", (MARCHIO / "barra.svg").read_text(encoding="utf-8"), flags=re.S).strip()
        for rel in ("it/index.html", "it/stato/index.html", "it/non-ancora/index.html"):
            self.assertIn(barra, (self.out / rel).read_text(encoding="utf-8"), rel)

    def test_le_pagine_nuove_collegano_il_foglio_e_lo_script_del_marchio(self):
        for rel, prefisso in (("it/index.html", "../"), ("it/stato/index.html", "../../"), ("it/non-ancora/index.html", "../../")):
            t = (self.out / rel).read_text(encoding="utf-8")
            self.assertIn(f'<link rel="stylesheet" href="{prefisso}design-system/componenti/marchio.css">', t, rel)
            self.assertIn(f'<script src="{prefisso}design-system/marchio/marchio.js" defer></script>', t, rel)
            self.assertLess(t.index("componenti/barra.css"), t.index("componenti/marchio.css"), rel)

    def test_i_file_del_marchio_arrivano_nel_sito(self):
        for nome in ("barra.svg", "libero.svg", "piena.svg", "piccola.svg", "simbolica.svg", "favicon.ico", "marchio.js", "disegno.json"):
            self.assertTrue((self.out / "design-system" / "marchio" / nome).is_file(), nome)
        self.assertTrue((self.out / "design-system" / "componenti" / "marchio.css").is_file())


class NelSitoDiProva(unittest.TestCase):
    """La stessa costruzione su un sito piccolo, con le pagine che sbagliano."""
    HOME = ('<!doctype html><html lang="it"><head><meta charset="utf-8"><title data-t="t">Kalliope</title>{extra}</head>'
            '<body><a class="marchio" href="./"><svg data-marchio="barra"></svg><span data-t="n">Kalliope</span></a></body></html>')
    VECCHIA = ('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Vecchia</title></head>'
               '<body><a class="marca" href="../"><svg data-marchio="libero" width="40" height="40"></svg><span>Kalliope</span></a></body></html>')

    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="l3-prova-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.v, self.grezzi = sito_py.values(RILASCIO)

    def sito(self, home_extra="", con_marchio=True, guasto=None, home=None):
        w, s = self.tmp / "website", self.tmp / "design-system"
        (w / "vecchia").mkdir(parents=True)
        (w / "index.html").write_text(home or self.HOME.format(extra=home_extra), encoding="utf-8")
        (w / "vecchia" / "index.html").write_text(self.VECCHIA, encoding="utf-8")
        (w / "404.html").write_text('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>No</title></head><body>no</body></html>', encoding="utf-8")
        (w / "lingua.js").write_text("//", encoding="utf-8")
        s.mkdir()
        if con_marchio:
            copia_del_sistema(s)
        else:
            (s / "token.css").write_text(":root{}", encoding="utf-8")
        if guasto:
            guasto(s)
        return w, s

    def costruisci(self, w, s):
        opzioni = {"pseudo": False, "senza_selettore": False, "base_url": "https://esempio.test/k/", "lingue": None, "website": w, "system": s}
        sito_py.build(self.tmp / "out", self.v, self.grezzi, opzioni)
        return self.tmp / "out"

    def test_il_segno_la_forma_libera_e_le_icone_arrivano(self):
        out = self.costruisci(*self.sito())
        home = (out / "it" / "index.html").read_text(encoding="utf-8")
        self.assertIn('<svg class="m-segno"', home)
        self.assertIn('<link rel="icon" href="../design-system/marchio/favicon.ico" sizes="any">', home)
        self.assertIn('<link rel="icon" href="../design-system/marchio/piccola.svg" type="image/svg+xml">', home)
        vecchia = (out / "it" / "vecchia" / "index.html").read_text(encoding="utf-8")
        self.assertIn('<img src="../../design-system/marchio/libero.svg" alt="" width="40" height="40">', vecchia)
        self.assertIn('href="../../design-system/marchio/piccola.svg"', vecchia)
        self.assertIn('<link rel="icon" href="/k/design-system/marchio/favicon.ico" sizes="any">', (out / "404.html").read_text(encoding="utf-8"))

    def test_una_pagina_che_scrive_la_sua_icona_ferma_la_costruzione(self):
        with self.assertRaises(SystemExit) as e:
            self.costruisci(*self.sito('<link rel="icon" href="immagini/icona.svg">'))
        self.assertIn("writes its own", str(e.exception))

    def test_una_forma_che_non_c_e_ferma_la_costruzione(self):
        with self.assertRaises(SystemExit) as e:
            self.costruisci(*self.sito(home=self.HOME.format(extra="").replace('data-marchio="barra"', 'data-marchio="quadrata"')))
        self.assertIn("quadrata", str(e.exception))

    def test_un_sistema_il_cui_marchio_non_torna_con_i_token_ferma_la_costruzione(self):
        def guasta(s):
            css = (s / "token.css").read_text(encoding="utf-8")
            (s / "token.css").write_text(css.replace("--segno-colore: #e6396e;", "--segno-colore: #00aa00;"), encoding="utf-8")
        with self.assertRaises(SystemExit) as e:
            self.costruisci(*self.sito(guasto=guasta))
        self.assertIn("does not match", str(e.exception))

    def test_un_sistema_senza_marchio_costruisce_come_prima(self):
        out = self.costruisci(*self.sito(con_marchio=False))
        self.assertNotIn('rel="icon"', (out / "it" / "index.html").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
