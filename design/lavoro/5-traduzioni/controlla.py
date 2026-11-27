# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Checks of a translated catalogue beyond `translations.py check`: what stayed Italian on purpose, what was left untranslated,
window texts quoted by the website, length of the window's short labels, script, invisible marks, Italian left over, glyphs.

    python controlla.py WORKTREE LANG [LANG …]      (a Python with fontTools and brotli)
"""
import pathlib
import re
import sys
import unicodedata

W = pathlib.Path(sys.argv[1])
sys.path.insert(0, str(W / "tools"))
from i18n import po  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

KEEP = re.compile(r"^(frase\.[123]$|frase\.\d\.(gruppo|detto)\.\d+$|frase\.2\.chi\.paola$|frase\.3\.detto-frase$|ascolto\.frase\.\d$|st\.riscrive\.(da|a)$)")
SAME_OK = re.compile(r"^[\s\W\d]*$|^(Kalliope|README|CHANGELOG\.md|GitHub|AUR|Linux|PipeWire|Zoom|Teams|Meet|Google Meet|Flatpak|"
                     r"WhatsApp|Telegram|Slint|Giulia|Marco|Paola\.?|ONNX Runtime|Klein|Pocket TTS|Kyutai|Debian|Ubuntu|Fedora|Arch|"
                     r"Arch Linux|Wayland|X11|GNOME|KDE|Webex|Jitsi|Discord|Skype|OK|Ok|Email|E-mail|Online|Open source|open source|"
                     r"Sansevieria|SANSEVIERIA|\.deb|\.rpm)$")
CROSS = {
    "programma.finestra.altro": ["riu.immagine.8", "riu.voce.testo", "st.d.voce.personale"],
    "programma.stato.attenzione": ["ai.testo.18"],
    "programma.comune.come-si-risolve": ["in.frasi.voce.rimedio", "riu.testo.6", "riu.testo.34"],
    "programma.finestra.crea-tua-voce": ["riu.voce.testo", "st.d.voce.personale"],
    "programma.scrittura.di": ["riu.immagine.8"],
    "programma.comune.ferma": ["riu.scrivi.riunione", "ai.testo.46"],
    "programma.stato.voce-non-parte": ["in.installa.voce-non-parte", "in.frasi.voce.frase", "riu.testo.6", "ai.testo.12"],
    "programma.stato.manca-microfono": ["in.frasi.microfono.frase", "in.microfono.se-no", "riu.testo.6", "ai.testo.15"],
    "programma.stato.nessuno-ti-sente": ["in.frasi.nessuno.frase", "riu.testo.6", "riu.testo.25", "ai.testo.17"],
    "programma.stato.preparo-la-voce": ["in.apri.ogni-volta", "ai.testo.13"],
    "programma.sessione.preparo": ["st.voce.forse"],
    "programma.stato.pronta": ["in.apri.titolo", "in.apri.riuscito", "in.ripresa.pronta", "riu.testo.1"],
    "programma.finestra.riunione": ["riu.immagine.8", "riu.scrivi.riunione"],
    "programma.finestra.senti-anche-tu-voce": ["riu.testo.33", "ai.testo.63", "st.passo.disco.testo"],
    "programma.stato.sto-parlando": ["riu.testo.25", "ai.testo.16"],
}
# site entries that copy a text of the window: the same words as the program's translation
PAIRS = {
    "finestra.pronta.nome": "programma.stato.pronta", "finestra.pronta.detto": "programma.stato.nella-riunione-scegli-kalliope",
    "finestra.segnaposto": "programma.comune.segnaposto-scrivi-invio", "finestra.ferma": "programma.comune.ferma",
    "finestra.esc": "programma.scrittura.esc", "finestra.di": "programma.scrittura.di", "finestra.invio": "programma.scrittura.invio",
    "avvio.preparo.nome": "programma.stato.preparo-la-voce", "avvio.preparo.detto": "programma.stato.fra-poco-puoi-scrivere",
    "avvio.segnaposto": "programma.finestra.segnaposto-puoi-gia-scrivere", "finestra.parla.nome": "programma.stato.sto-parlando",
    "finestra.parla.detto": "programma.stato.esc-ferma", "finestra.risolvi": "programma.comune.come-si-risolve",
    "finestra.segnaposto.errore": "programma.finestra.segnaposto-voce-non-parte-guarda",
    "in.stato.voce.nome": "programma.stato.voce-non-parte", "in.stato.voce.detto": "programma.voce.file-mancanti",
    "in.stato.microfono.nome": "programma.stato.manca-microfono", "in.stato.nessuno.nome": "programma.stato.nessuno-ti-sente",
    "in.stato.nessuno.detto": "programma.sessione.nessuno-sente",
    "ai.testo.19": "programma.stato.voce-non-parte", "ai.testo.24": "programma.stato.preparo-la-voce",
    "ai.testo.29": "programma.stato.pronta", "ai.testo.34": "programma.stato.manca-microfono",
    "ai.testo.42": "programma.stato.sto-parlando", "ai.testo.47": "programma.stato.nessuno-ti-sente",
    "ai.testo.52": "programma.stato.attenzione",
}
SCRIPT = {"el": "GREEK", "bg": "CYRILLIC", "ar": "ARABIC", "ur": "ARABIC", "hi": "DEVANAGARI", "bn": "BENGALI", "zh": "CJK"}
FACE = {"el": "geologica/Geologica-wght", "bg": "geologica/Geologica-wght", "ar": "readex-pro/ReadexPro-wght",
        "ur": "noto-nastaliq-urdu/NotoNastaliqUrdu-wght", "hi": "noto-sans-devanagari/NotoSansDevanagari-wght",
        "bn": "noto-sans-bengali/NotoSansBengali-wght"}
ITALIAN = re.compile(r"\b(della|delle|degli|nella|nelle|sono|anche|questo|questa|perché|quando|oppure|ancora|scrivi|voce|"
                     r"riunione|microfono|programma|frase)\b", re.I)
MARKS = re.compile("[‎‏‪-‮⁦-⁩]")
CARATTERI = W / "design-system/caratteri"


def cmap(path):
    return set(TTFont(str(path), lazy=True).getBestCmap() or {})


def testo(v):
    return [s for s in v.str if s]


def strip_tags(s):
    return re.sub(r"</?\d+/?>", "", s)


def core(s):
    return strip_tags(s).strip().rstrip("…. ").strip("«»“”„\"'「」《》 ")


def letter_script(ch):
    try:
        n = unicodedata.name(ch)
    except ValueError:
        return None
    if "CJK" in n or "IDEOGRAPH" in n:
        return "CJK"
    for k in ("GREEK", "CYRILLIC", "ARABIC", "DEVANAGARI", "BENGALI", "LATIN"):
        if n.startswith(k):
            return k
    return "OTHER"


def programma(e):
    return (e.ctx or "").startswith("programma.")


lexend = cmap(CARATTERI / "lexend/Lexend-wght.ttf")
sito = set()
for f in CARATTERI.glob("*/*.woff2"):
    if "nomi" not in f.name:
        sito |= cmap(f)
_it = po.leggi((W / "website/lingue/it.po").read_text(encoding="utf-8")).per_chiave()
base = {prog: {ord(c) for e in _it.values() if programma(e) == prog for x in e.str for c in x} for prog in (True, False)}

errori_tot = 0
for L in sys.argv[2:]:
    f = W / f"website/lingue/{L}.po"
    if not f.exists():
        print(f"== {L}: no file")
        continue
    v = po.leggi(f.read_text(encoding="utf-8")).per_chiave()
    err, warn = [], []
    for k, e in v.items():
        s = testo(e)
        if not s:
            err.append(f"empty: {k}")
            continue
        if KEEP.match(k):
            if s[0] != e.id:
                err.append(f"should stay Italian: {k}: {s[0][:70]!r}")
            continue
        if L != "it" and s[0] == e.id and not SAME_OK.match(strip_tags(e.id).strip()) and len(strip_tags(e.id)) > 3:
            warn.append(f"same as Italian: {k}: {e.id[:70]!r}")
        for x in s:
            if MARKS.search(x):
                err.append(f"direction mark: {k}")
        if L != "it":
            m = ITALIAN.findall(re.sub(r"«[^»]*»", "", strip_tags(s[0])))
            if len(m) >= 2:
                warn.append(f"Italian words? {k}: {m[:4]} {s[0][:60]!r}")
    # window texts quoted by the website
    for pk, sks in CROSS.items():
        if pk not in v or not testo(v[pk]):
            continue
        label = core(testo(v[pk])[0])
        for sk in sks:
            if sk in v and testo(v[sk]) and label.lower() not in strip_tags(testo(v[sk])[0]).lower():
                err.append(f"quote differs: {pk}={label!r} not in {sk}: {strip_tags(testo(v[sk])[0])[:90]!r}")
    for sk, pk in PAIRS.items():
        if sk in v and pk in v and testo(v[sk]) and testo(v[pk]) and core(testo(v[sk])[0]).lower() != core(testo(v[pk])[0]).lower():
            err.append(f"copy of the window differs: {sk}={core(testo(v[sk])[0])!r} but {pk}={core(testo(v[pk])[0])!r}")
    # short labels of the window
    for k, e in v.items():
        if programma(e) and testo(e) and len(e.id) <= 24:
            t = strip_tags(testo(e)[0])
            if len(t) > max(1.6 * len(e.id), len(e.id) + 8):
                warn.append(f"long label: {k}: {e.id!r} → {t!r}")
    # script
    if L in SCRIPT:
        lettere = [letter_script(c) for e in v.values() if not KEEP.match(e.ctx or "") for x in testo(e)
                   for c in strip_tags(x) if c.isalpha()]
        quota = sum(1 for s in lettere if s == SCRIPT[L]) / max(1, len(lettere))
        (warn if quota > 0.6 else err).append(f"share of {SCRIPT[L]} letters: {quota:.0%}")
    else:
        strane = {c for e in v.values() for x in testo(e) for c in x if c.isalpha() and letter_script(c) != "LATIN"}
        if strane:
            warn.append(f"letters outside Latin: {''.join(sorted(strane))}")
    # glyphs: the window's texts against the faces it embeds, the website's against the design system's files; a character
    # the Italian catalogue already uses is the starting point, not a fault of the translation

    def usati(prog):
        return {ord(c) for e in v.values() if programma(e) == prog for x in testo(e) for c in x
                if not c.isspace() and unicodedata.category(c)[0] != "C"} - base[prog]

    if L != "zh":
        app = lexend | (cmap(CARATTERI / (FACE[L] + ".ttf")) if L in FACE else set())
        manca = sorted(usati(True) - app)
        if manca:
            err.append("glyphs missing in the window: " + " ".join(f"{chr(c)}U+{c:04X}" for c in manca[:30]))
        manca = sorted(usati(False) - sito)
        if manca:
            err.append("glyphs missing on the site: " + " ".join(f"{chr(c)}U+{c:04X}" for c in manca[:30]))
    print(f"== {L}: {len(err)} error(s), {len(warn)} warning(s)")
    for x in err:
        print("  E " + x)
    for x in warn[:60]:
        print("  w " + x)
    if len(warn) > 60:
        print(f"  … {len(warn) - 60} more warnings")
    errori_tot += len(err)
sys.exit(1 if errori_tot else 0)
