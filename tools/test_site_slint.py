# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The «Made with Slint» badge on the «installa» page (issue #21; licence Slint Royalty-free 2.0, §2(b)).

The licence asks for the official badge on a public page, preferably where the binaries are downloaded, so that any visitor can find it. This checks the
built site, in every language it builds (the pseudo-languages for the tests included): the page has the badge as an image of the official file, inside a
link to https://slint.dev/, near the files to download; and the file is the official one, byte for byte (CC-BY-ND-4.0: no change at all).

    python3 -I -m unittest discover -s tools -p 'test_*.py'

The check is a function (`problems`) that takes a built site; the spoilt copies below (no badge, a changed file, a badge far from the downloads, no link) must fail.
Standard library only.
"""
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

RADICE = pathlib.Path(__file__).resolve().parent.parent
FILE = "design-system/terze-parti/slint/MadeWithSlint-logo-dark.svg"
# SHA-256 of logo/MadeWithSlint-logo-dark.svg in slint-ui/slint (v1.19.1 and master, checked 26/11/2026)
IMPRONTA = "a994c8ce0e21d008fdd5a6f23b45b5c13a2208ce5c4a8a8e8fd09c0d0cb6175b"
# The release the site offers in the test, as the releases API describes it (the same shape as test_translations.py).
RILASCIO = {"tag_name": "v0.3", "published_at": "2026-11-27T09:00:00Z", "html_url": "https://x/r", "prerelease": False,
            "assets": [{"name": "kalliope-0.3-amd64.deb", "browser_download_url": "https://x/d", "size": 190_000_000, "digest": "sha256:aa"},
                       {"name": "kalliope-0.3-x86_64.rpm", "browser_download_url": "https://x/r", "size": 191_000_000, "digest": "sha256:bb"},
                       {"name": "kalliope-0.3-linux-x86_64.tar.gz", "browser_download_url": "https://x/t", "size": 205_000_000, "digest": "sha256:cc"},
                       {"name": "kalliope-bin.PKGBUILD", "browser_download_url": "https://x/p"}, {"name": "SHA256SUMS", "browser_download_url": "https://x/s"}]}


def problems(sito):
    """What is wrong with the badge in the built site `sito`, as a list of sentences (empty: nothing)."""
    sito = pathlib.Path(sito)
    out = []
    pagine = sorted(sito.glob("*/installa/index.html"))
    if not pagine:
        return ["no built «installa» page found"]
    for pagina in pagine:
        lingua = pagina.parent.parent.name
        t = pagina.read_text(encoding="utf-8")
        blocchi = re.findall(r'<div class="distintivo-slint">(.*?)</div>', t, re.S)
        if len(blocchi) != 1:
            out.append(f"{lingua}: the page has {len(blocchi)} badges, not one")
            continue
        b = blocchi[0]
        m = re.search(r'<a href="https://slint\.dev/"[^>]*>\s*<img [^>]*src="([^"]*MadeWithSlint-logo-dark\.svg)"[^>]*>\s*</a>', b)
        if not m:
            out.append(f"{lingua}: the badge is not the official image inside a link to https://slint.dev/")
            continue
        img = (pagina.parent / m.group(1)).resolve()
        if not img.is_file():
            out.append(f"{lingua}: the image of the badge ({m.group(1)}) is not in the site")
        elif hashlib.sha256(img.read_bytes()).hexdigest() != IMPRONTA:
            out.append(f"{lingua}: the image of the badge is not the official file, byte for byte")
        if re.search(r'alt=""', b.split("</a>")[0]):
            out.append(f"{lingua}: the badge has no alternative text")
        # near the downloads: in the step «Scarica», the one with the files (id passo-scarica)
        passo = re.search(r'<div class="passo" id="passo-scarica">(.*)', t, re.S)
        prima_del_controllo = passo.group(1).split('id="passo-controlla"')[0] if passo else ""
        if "distintivo-slint" not in prima_del_controllo:
            out.append(f"{lingua}: the badge is not in the step where the files are downloaded")
    return out


class DistintivoSlint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = pathlib.Path(tempfile.mkdtemp(prefix="sito-slint-"))
        cls.sito = cls.tmp / "sito"
        # A saved answer of the releases API, so the test needs no network (GitHub's API sometimes answers 504 to CI).
        rilasci = cls.tmp / "releases.json"
        rilasci.write_text(json.dumps([RILASCIO]), encoding="utf-8")
        r = subprocess.run([sys.executable, "-I", str(RADICE / "tools/site.py"), "--out", str(cls.sito), "--pseudo", "--release-json", str(rilasci)],
                           capture_output=True, text=True, cwd=RADICE)
        assert r.returncode == 0, r.stderr

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def copia(self, nome):
        d = self.tmp / nome
        shutil.copytree(self.sito, d)
        return d

    def test_il_file_del_repository_e_quello_ufficiale(self):
        self.assertEqual(hashlib.sha256((RADICE / FILE).read_bytes()).hexdigest(), IMPRONTA)

    def test_il_sito_costruito_ha_il_distintivo_in_ogni_lingua(self):
        self.assertEqual(problems(self.sito), [])
        lingue = sorted(p.parent.parent.name for p in self.sito.glob("*/installa/index.html"))
        self.assertIn("it", lingue)
        self.assertGreaterEqual(len(lingue), 3, f"italiano e le due pseudo-lingue: {lingue}")

    def test_senza_il_distintivo_fallisce(self):
        d = self.copia("senza")
        p = d / "it/installa/index.html"
        p.write_text(re.sub(r'<div class="distintivo-slint">.*?</div>', "", p.read_text(encoding="utf-8"), flags=re.S), encoding="utf-8")
        self.assertTrue(any("0 badges" in x for x in problems(d)))

    def test_un_file_cambiato_di_un_byte_fallisce(self):
        d = self.copia("byte")
        f = d / FILE
        f.write_bytes(f.read_bytes() + b"\0")
        self.assertTrue(any("byte for byte" in x for x in problems(d)))

    def test_senza_il_collegamento_a_slint_fallisce(self):
        d = self.copia("senza-link")
        p = d / "ar-XB/installa/index.html"
        p.write_text(p.read_text(encoding="utf-8").replace('<a href="https://slint.dev/" rel="noopener"><img', '<span><img', 1).replace("alt=\"", "alt=\"", 1), encoding="utf-8")
        t = p.read_text(encoding="utf-8")
        t = re.sub(r'(<span><img[^>]*>)</a>', r"\1</span>", t, count=1)
        p.write_text(t, encoding="utf-8")
        self.assertTrue(any("ar-XB" in x and "link" in x for x in problems(d)))

    def test_il_distintivo_lontano_dai_file_fallisce(self):
        d = self.copia("lontano")
        p = d / "it/installa/index.html"
        t = p.read_text(encoding="utf-8")
        blocco = re.search(r'<div class="distintivo-slint">.*?</div>', t, re.S).group(0)
        t = t.replace(blocco, "", 1).replace('<div class="passo" id="passo-controlla">', '<div class="passo" id="passo-controlla">' + blocco, 1)
        p.write_text(t, encoding="utf-8")
        self.assertTrue(any("step where the files are downloaded" in x for x in problems(d)))


if __name__ == "__main__":
    unittest.main()
