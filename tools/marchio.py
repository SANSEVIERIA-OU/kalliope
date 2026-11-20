# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The mark of Kalliope (design-system/marchio/), made from one drawing and the tokens, and the check that says so.

    python3 -I tools/marchio.py            write every file below
    python3 -I tools/marchio.py --check    exit 1 when a file does not correspond to its sources (what CI runs)

The sources are two: the geometry, design-system/marchio/disegno.json, and the colours and times, the --segno-* tokens of
design-system/token.css. Nothing below is written by hand. From them:

    design-system/marchio/barra.svg        the mark of the bar, with the names of its parts; the site build puts it inside every page
                                           (colours from componenti/marchio.css, the front of the voice moved by marchio/marchio.js)
    design-system/marchio/libero.svg       the free form (Linux, Windows, old pages); plain paths and rects, no clip, no style sheet
    design-system/marchio/piena.svg        the form for macOS: the free form on the light square
    design-system/marchio/piccola.svg      the form for 16 and 24 px, and the tab of the browser
    design-system/marchio/simbolica.svg    the symbolic form of GNOME, 16×16, one colour
    design-system/marchio/favicon.ico      16 and 32 from piccola.svg, 48 from libero.svg (BMP entries, 32 bits, alpha)
    packaging/linux/<id>.svg               = libero.svg, for hicolor/scalable/apps
    packaging/linux/<id>-symbolic.svg      = simbolica.svg, for hicolor/symbolic/apps
    packaging/linux/<id>-48.png, -256.png  from libero.svg, for hicolor/48x48 and 256x256

The standalone files use no clip path and no style sheet: a desktop that draws icons with a small SVG engine (Qt's, for KDE) does
not follow clip paths. The half that is said is a filled path and a solid stroke, the half not yet said a dashed stroke, cut where the
front of the voice crosses the outline; the dash starts at the same distance along the outline as in the bar, so the dashes fall
in the same places. The bar needs the clip paths, because there the front moves. tools/marchio_raster.py draws the PNG and the ICO
with the standard library only: the same files come out on every machine, and --check compares their pixels.

The site build calls controlla_sistema() on its design system, so a mark that does not match the tokens never reaches the site.
Standard library only.
"""
import json
import math
import pathlib
import re
import struct
import sys
import zlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import marchio_raster as raster  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SYSTEM = ROOT / "design-system"
LINUX = ROOT / "packaging" / "linux"
APP_ID = "io.github.sansevieria_ou.kalliope"
LICENZA = "SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1"
AVVISO = "File generato da tools/marchio.py da design-system/marchio/disegno.json e dai token segno-* di design-system/token.css: non si modifica a mano."
# Le dimensioni dell'ICO: 16 e 32 dalla forma piccola (le grandezze della scheda), 48 dal disegno libero (Google, i collegamenti di Windows).
ICO = ((16, "piccola"), (32, "piccola"), (48, "libero"))
PNG_LINUX = (48, 256)


# ---------- i token ----------
def leggi_token(css):
    """{nome: valore} dei token del foglio, il primo valore di ciascuno; i var(--x) si risolvono. Un token --segno-* definito due volte con valori diversi è un errore."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    valori = {}
    for nome, valore in re.findall(r"(--[a-z0-9-]+)\s*:\s*([^;{}]+);", css):
        valore = valore.strip()
        if nome in valori:
            if nome.startswith("--segno-") and valori[nome] != valore:
                raise SystemExit(f"marchio: {nome} è definito due volte, con valori diversi")
            continue
        valori[nome] = valore
    def risolvi(v, visti=()):
        def sost(m):
            n = m.group(1)
            if n in visti or n not in valori:
                raise SystemExit(f"marchio: {n} non è in token.css (o gira su sé stesso)")
            return risolvi(valori[n], visti + (n,))
        return re.sub(r"var\((--[a-z0-9-]+)\)", sost, v)
    return {n: risolvi(v) for n, v in valori.items() if n.startswith("--segno-")}


COLORI = ("--segno-colore", "--segno-parola", "--segno-piastra", "--segno-simbolo")


def colori(token):
    for nome in COLORI:
        v = token.get(nome)
        if v is None:
            raise SystemExit(f"marchio: il token {nome} non è in token.css")
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", v):
            raise SystemExit(f"marchio: {nome} deve essere un colore #rrggbb, è {v!r}")
    return {n: token[n].lower() for n in COLORI}


# ---------- la geometria ----------
def fmt(v):
    s = f"{v:.3f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def leggi_d(d):
    """La sagoma (un solo percorso, con linee e archi circolari) → segmenti assoluti: ('L', p0, p1) e ('A', p0, p1, r, fa, fs)."""
    try:
        percorsi = raster.sottopercorsi(d)
    except ValueError as errore:
        raise SystemExit(f"marchio: {errore}")
    if len(percorsi) != 1 or any(s[0] == "C" for s in percorsi[0][0]):
        raise SystemExit("marchio: la sagoma deve essere un percorso solo, di linee e archi")
    return percorsi[0][0]


def cubica(c, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = c
    u = 1 - t
    a, b, cc, e = u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t
    return (a * x0 + b * x1 + cc * x2 + e * x3, a * y0 + b * y1 + cc * y2 + e * y3)


def spezza_cubica(c, t):
    """De Casteljau: le due cubiche in cui t divide c."""
    def m(p, q):
        return ((p[0] + q[0]) / 2 if t == 0.5 else p[0] + (q[0] - p[0]) * t, (p[1] + q[1]) / 2 if t == 0.5 else p[1] + (q[1] - p[1]) * t)
    p0, p1, p2, p3 = c
    a, b, cc = m(p0, p1), m(p1, p2), m(p2, p3)
    d, e = m(a, b), m(b, cc)
    f = m(d, e)
    return [p0, a, d, f], [f, e, cc, p3]


def incroci_linea(seg, fronte):
    """Gli incroci del segmento di linea con il fronte: [(s, t, punto)], s sul segmento (0..1), t sulla cubica (None per la retta)."""
    _, (x0, y0), (x1, y1) = seg[:3]
    if "retta" in fronte:
        c = fronte["retta"]
        if x1 == x0:
            if x0 == c:
                raise SystemExit("marchio: un lato della sagoma sta sul fronte")
            return []
        s = (c - x0) / (x1 - x0)
        return [(s, None, (c, y0 + s * (y1 - y0)))] if -1e-9 <= s <= 1 + 1e-9 else []
    curva = [tuple(p) for p in fronte["curva"]]
    dx, dy = x1 - x0, y1 - y0
    f = lambda t: (-dy) * (cubica(curva, t)[0] - x0) + dx * (cubica(curva, t)[1] - y0)  # noqa: E731
    out, passi = [], 400
    prec = f(0)
    for k in range(1, passi + 1):
        t1 = k / passi
        cur = f(t1)
        if prec == 0 or prec * cur < 0:
            a, b = (k - 1) / passi, t1
            for _ in range(80):
                m = (a + b) / 2
                if f(a) * f(m) <= 0:
                    b = m
                else:
                    a = m
            t = (a + b) / 2
            p = cubica(curva, t)
            s = ((p[0] - x0) * dx + (p[1] - y0) * dy) / (dx * dx + dy * dy)
            if -1e-9 <= s <= 1 + 1e-9 and all(abs(s - o[0]) > 1e-6 for o in out):
                out.append((min(1.0, max(0.0, s)), t, p))
        prec = cur
    return out


def lunghezza(seg):
    if seg[0] == "L":
        return math.dist(seg[1], seg[2])
    _, r, _, dt = raster.centro_arco(seg[1], seg[2], seg[3], seg[4], seg[5])[1:]
    return abs(dt) * r


def taglia(segs, fronte):
    """Divide la sagoma al fronte. Torna (sinistra, destra, tagli, prima): le due parti (liste di segmenti, la sinistra dal secondo taglio al primo
    passando dall'inizio del percorso, la destra dal primo al secondo), i due punti di taglio con il loro t sulla cubica, e la lunghezza di percorso prima del primo."""
    tagli = []   # (indice del segmento, s, t, punto)
    for k, seg in enumerate(segs):
        for s, t, p in incroci_linea(seg, fronte) if seg[0] == "L" else []:
            tagli.append((k, s, t, p))
    # un incrocio esattamente su un vertice sarebbe contato dal segmento che finisce lì e da quello che comincia: uno solo
    unici = []
    for tg in tagli:
        if any(math.dist(tg[3], u[3]) < 1e-6 for u in unici):
            continue
        unici.append(tg)
    for seg in segs:
        if seg[0] == "A":   # un arco che il fronte taglia non è ammesso: lo si vede campionandolo
            cx, cy, r, t1, dt = raster.centro_arco(seg[1], seg[2], seg[3], seg[4], seg[5])
            lati = {a_sinistra((cx + r * math.cos(t1 + dt * j / 32), cy + r * math.sin(t1 + dt * j / 32)), fronte) for j in range(33)}
            if len(lati) > 1:
                raise SystemExit("marchio: il fronte taglia un arco della sagoma: non è ammesso, si taglia solo su linee")
    if len(unici) != 2:
        raise SystemExit(f"marchio: il fronte deve incrociare la sagoma in due punti, ne incrocia {len(unici)}")
    (k1, s1, t1, p1), (k2, s2, t2, p2) = unici
    def pezzo(k, s, dopo):
        """Il segmento k tagliato in s: la parte dopo (dal taglio alla fine) o prima (dall'inizio al taglio)."""
        seg = segs[k]
        p = (seg[1][0] + s * (seg[2][0] - seg[1][0]), seg[1][1] + s * (seg[2][1] - seg[1][1]))
        if dopo:
            return [] if s >= 1 - 1e-9 else [("L", p, seg[2])]
        return [] if s <= 1e-9 else [("L", seg[1], p)]
    destra = pezzo(k1, s1, True) + segs[k1 + 1:k2] + pezzo(k2, s2, False)
    sinistra = pezzo(k2, s2, True) + segs[k2 + 1:] + segs[:k1] + pezzo(k1, s1, False)
    prima = sum(lunghezza(x) for x in segs[:k1]) + (lunghezza(segs[k1]) * s1 if segs[k1][0] == "L" else 0)
    return sinistra, destra, ((p1, t1), (p2, t2)), prima


def a_sinistra(p, fronte):
    if "retta" in fronte:
        return p[0] < fronte["retta"]
    curva = [tuple(q) for q in fronte["curva"]]
    a, b = 0.0, 1.0
    for _ in range(80):
        m = (a + b) / 2
        if cubica(curva, m)[1] < p[1]:
            a = m
        else:
            b = m
    return p[0] < cubica(curva, (a + b) / 2)[0]


def d_segmenti(segs, chiudi=False, coda=""):
    """I segmenti (contigui) → d assoluto. `coda` si aggiunge in fondo (il fronte, per chiudere un'area)."""
    if not segs:
        return ""
    p = segs[0][1]
    parti = [f"M{fmt(p[0])} {fmt(p[1])}"]
    for seg in segs:
        q = seg[2]
        if seg[0] == "L":
            if abs(q[1] - p[1]) < 1e-9:
                parti.append(f"H{fmt(q[0])}")
            elif abs(q[0] - p[0]) < 1e-9:
                parti.append(f"V{fmt(q[1])}")
            else:
                parti.append(f"L{fmt(q[0])} {fmt(q[1])}")
        else:
            parti.append(f"A{fmt(seg[3])} {fmt(seg[3])} 0 {seg[4]} {seg[5]} {fmt(q[0])} {fmt(q[1])}")
        p = q
    return "".join(parti) + coda + ("z" if chiudi else "")


def d_fronte_giu(fronte, tagli):
    """Il fronte dal taglio in alto al taglio in basso, come coda di un percorso."""
    (pa, ta), (pb, tb) = sorted(tagli, key=lambda x: x[0][1])
    if "retta" in fronte:
        return f"L{fmt(pb[0])} {fmt(pb[1])}"
    curva = [tuple(q) for q in fronte["curva"]]
    _, resto = spezza_cubica(curva, ta)
    parte, _ = spezza_cubica(resto, (tb - ta) / (1 - ta))
    return "C" + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in parte[1:])


def parti_della_forma(forma):
    """Le tre parti della forma, come percorsi senza clip: l'area detta (chiusa), il contorno pieno (aperto) e quello tratteggiato (aperto) con il suo scarto."""
    segs = leggi_d(forma["sagoma"])
    fronte = forma["fronte"]
    sinistra, destra, tagli, prima = taglia(segs, fronte)
    # l'inizio della sagoma deve stare a sinistra: la sinistra è la parte che passa dall'inizio
    if not a_sinistra(segs[0][1], fronte):
        raise SystemExit("marchio: la sagoma deve cominciare a sinistra del fronte")
    # la parte sinistra comincia dal secondo taglio lungo il percorso (il basso) e finisce nel primo (l'alto); il fronte la richiude dall'alto al basso
    area = d_segmenti(sinistra, chiudi=True, coda=d_fronte_giu(fronte, tagli))
    contorno_pieno = d_segmenti(sinistra)
    tratteggio = d_segmenti(destra)
    periodo = sum(forma["contorno"]["tratteggio"])
    scarto = prima % periodo
    return {"area": area, "pieno": contorno_pieno, "tratteggiato": tratteggio, "scarto": scarto}


# ---------- i file ----------
def intestazione(extra=""):
    return f"<!-- {LICENZA} -->\n<!-- {AVVISO}{extra} -->\n"


def rettangolo(r, attr):
    x, y, w, h = r
    return f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" rx="{fmt(h / 2)}"{attr}/>'


def svg_forma(nome, forma, col):
    """Una forma libera (senza clip, senza foglio di stile), con i colori dei token."""
    t = forma["tela"]
    parti = parti_della_forma(forma)
    c = col["--segno-simbolo"] if nome == "simbolica" else col["--segno-colore"]
    sp, tr = forma["contorno"]["spessore"], forma["contorno"]["tratteggio"]
    righe = [f'<path d="{parti["area"]}" fill="{c}"/>']
    if not forma["contorno"].get("solo_tratteggiato"):
        righe.append(f'<path d="{parti["pieno"]}" fill="none" stroke="{c}" stroke-width="{fmt(sp)}" stroke-linejoin="round"/>')
    righe.append(f'<path d="{parti["tratteggiato"]}" fill="none" stroke="{c}" stroke-width="{fmt(sp)}" stroke-dasharray="{" ".join(fmt(x) for x in tr)}" '
                 f'stroke-dashoffset="{fmt(parti["scarto"])}" stroke-linejoin="round"/>')
    righe += [rettangolo(r, f' fill="{col["--segno-parola"]}"') for r in forma["parole"]]
    return (intestazione() + f'<svg xmlns="http://www.w3.org/2000/svg" width="{t}" height="{t}" viewBox="0 0 {t} {t}">\n  '
            + "\n  ".join(righe) + "\n</svg>\n")


def svg_piena(disegno, col):
    libero = disegno["forme"]["libero"]
    parti = parti_della_forma(libero)
    tx, ty, sc = disegno["piena"]["trasformazione"]
    c = col["--segno-colore"]
    sp, tr = libero["contorno"]["spessore"], libero["contorno"]["tratteggio"]
    corpo = [f'<path d="{parti["area"]}" fill="{c}"/>',
             f'<path d="{parti["pieno"]}" fill="none" stroke="{c}" stroke-width="{fmt(sp)}" stroke-linejoin="round"/>',
             f'<path d="{parti["tratteggiato"]}" fill="none" stroke="{c}" stroke-width="{fmt(sp)}" stroke-dasharray="{" ".join(fmt(x) for x in tr)}" '
             f'stroke-dashoffset="{fmt(parti["scarto"])}" stroke-linejoin="round"/>']
    corpo += [rettangolo(r, f' fill="{col["--segno-parola"]}"') for r in libero["parole"]]
    t = libero["tela"]
    return (intestazione() + f'<svg xmlns="http://www.w3.org/2000/svg" width="{t}" height="{t}" viewBox="0 0 {t} {t}">\n'
            f'  <rect width="{t}" height="{t}" fill="{col["--segno-piastra"]}"/>\n'
            f'  <g transform="translate({fmt(tx)} {fmt(ty)}) scale({fmt(sc)})">\n    ' + "\n    ".join(corpo) + "\n  </g>\n</svg>\n")


def svg_barra(disegno):
    """Il segno della barra: con i nomi delle parti (m-detto, m-bordo, m-dette, m-fronte), i colori li dà componenti/marchio.css e il fronte lo sposta marchio.js."""
    f = disegno["forme"]["libero"]
    t, sag = f["tela"], f["sagoma"]
    (x0, y0), c1, c2, (x3, y3) = [tuple(p) for p in f["fronte"]["curva"]]
    sin, des = f["fronte"]["lontano_sinistra"], f["fronte"]["lontano_destra"]
    curva = f"{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(x3)} {fmt(y3)}"
    indietro = f"{fmt(c2[0])} {fmt(c2[1])} {fmt(c1[0])} {fmt(c1[1])} {fmt(x0)} {fmt(y0)}"
    sp, tr = f["contorno"]["spessore"], f["contorno"]["tratteggio"]
    parole = "".join(rettangolo(r, "") for r in f["parole"])
    corpo = (f'<svg class="m-segno" width="36" height="36" viewBox="0 0 {t} {t}" aria-hidden="true" focusable="false"><defs>'
             f'<clipPath id="m-bolla"><path d="{sag}"/></clipPath>'
             f'<clipPath id="m-detto"><path class="m-fronte" d="M{fmt(sin)} {fmt(y0)}H{fmt(x0)}C{curva}H{fmt(sin)}z"/></clipPath>'
             f'<clipPath id="m-attesa"><path class="m-fronte" d="M{fmt(x0)} {fmt(y0)}H{fmt(des)}V{fmt(y3)}H{fmt(x3)}C{indietro}z"/></clipPath></defs>'
             f'<g clip-path="url(#m-bolla)"><rect class="m-detto" width="{t}" height="{t}" clip-path="url(#m-detto)"/></g>'
             f'<g clip-path="url(#m-detto)"><path class="m-bordo" d="{sag}" fill="none" stroke-width="{fmt(sp)}" stroke-linejoin="round"/></g>'
             f'<g clip-path="url(#m-attesa)"><path class="m-bordo" d="{sag}" fill="none" stroke-width="{fmt(sp)}" stroke-dasharray="{" ".join(fmt(x) for x in tr)}" stroke-linejoin="round"/></g>'
             f'<g class="m-dette" clip-path="url(#m-detto)">{parole}</g></svg>')
    return intestazione(" Colori e movimento: componenti/marchio.css e marchio/marchio.js.") + corpo + "\n"


def costruisci(sistema=SYSTEM, linux=None):
    """{percorso: contenuto} di tutti i file del marchio, dai file di sorgente di `sistema` (design-system/). Con `linux` (packaging/linux/) anche le icone del programma."""
    disegno = json.loads((sistema / "marchio" / "disegno.json").read_text(encoding="utf-8"))
    token = leggi_token((sistema / "token.css").read_text(encoding="utf-8"))
    col = colori(token)
    m = sistema / "marchio"
    out = {}
    for nome, forma in disegno["forme"].items():
        out[m / f"{nome}.svg"] = svg_forma(nome, forma, col).encode()
    out[m / "piena.svg"] = svg_piena(disegno, col).encode()
    out[m / "barra.svg"] = svg_barra(disegno).encode()
    out[m / "favicon.ico"] = raster.ico([(n, raster.disegna(out[m / f"{forma}.svg"].decode(), n)) for n, forma in ICO])
    if linux is not None:
        out[linux / f"{APP_ID}.svg"] = out[m / "libero.svg"]
        out[linux / f"{APP_ID}-symbolic.svg"] = out[m / "simbolica.svg"]
        for n in PNG_LINUX:
            out[linux / f"{APP_ID}-{n}.png"] = raster.png(n, n, raster.disegna(out[m / "libero.svg"].decode(), n))
    return out


# ---------- scrivere e controllare ----------
def uguale(percorso, voluto, trovato):
    """I file di testo sono uguali byte per byte; l'ICO anche (non ha compressione); un PNG ha gli stessi pixel (zlib non è lo stesso su ogni macchina)."""
    if percorso.suffix == ".png":
        try:
            return raster.leggi_png(voluto) == raster.leggi_png(trovato)
        except (ValueError, zlib.error, struct.error):
            return False
    return voluto == trovato


def controlla(sistema=SYSTEM, linux=None):
    """L'elenco di ciò che non corrisponde (vuoto se tutto torna)."""
    errori = []
    for percorso, voluto in costruisci(sistema, linux).items():
        nome = percorso.relative_to(ROOT).as_posix() if ROOT in percorso.parents else percorso.as_posix()
        if not percorso.exists():
            errori.append(f"{nome}: manca")
        elif not uguale(percorso, voluto, percorso.read_bytes()):
            errori.append(f"{nome}: non corrisponde a disegno.json e ai token segno-*")
    return errori


def controlla_sistema(sistema):
    """Per la costruzione del sito: i file del marchio dentro `sistema` (design-system/ o una sua copia) tornano con i suoi token. Niente da dire se non ha marchio/."""
    if not (sistema / "marchio" / "disegno.json").exists():
        return []
    return controlla(sistema)


def scrivi():
    for percorso, contenuto in costruisci(SYSTEM, LINUX).items():
        percorso.parent.mkdir(parents=True, exist_ok=True)
        percorso.write_bytes(contenuto)
        print("scritto", percorso.relative_to(ROOT).as_posix())


def main():
    args = sys.argv[1:]
    if args == ["--check"]:
        errori = controlla(SYSTEM, LINUX)
        if errori:
            print("marchio: i file generati non corrispondono più alle sorgenti; rilancia `python3 -I tools/marchio.py`:\n  " + "\n  ".join(errori), file=sys.stderr)
            sys.exit(1)
        print("marchio: tutti i file corrispondono a disegno.json e ai token")
    elif not args:
        scrivi()
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
