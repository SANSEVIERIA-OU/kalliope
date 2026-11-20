# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""A small SVG rasteriser, and the PNG and ICO writers, with the standard library only (tools/marchio.py uses it).

It draws the subset of SVG the mark is made of: g (transform: translate, scale; clip-path), path (M m L l H h V v C c A a Z z, circular
arcs), rect (rx), clipPath, fill, stroke (width, round joins, butt caps, dash array and offset) and fill-rule nonzero, with the colours
as #rrggbb or as classes given by the caller. Anti-aliasing counts 16 × 16 samples in every pixel, and a shape is the set of samples it
covers, so shapes that overlap (the pieces of a stroke) join exactly, and a clip is an AND of two sets. Every step is plain arithmetic
on floats and integers: the same SVG gives the same pixels on every machine, which is what lets tools/marchio.py check them.

    disegna(svg, n, classi=None)  → bytes, n × n pixels RGBA (not premultiplied), from an SVG whose viewBox is square
    png(w, h, rgba) → bytes       leggi_png(bytes) → (w, h, rgba)      (any PNG 8-bit RGBA that is not interlaced)
    ico([(n, rgba), …]) → bytes   leggi_ico(bytes) → [(n, rgba), …]    (BMP entries, 32 bits)
"""
import math
import re
import struct
import xml.etree.ElementTree as ET
import zlib

S = 16   # campioni per lato di pixel
PIENA = (1 << (S * S)) - 1
RIGA = (1 << S) - 1


# ---------- i percorsi ----------
def sottopercorsi(d):
    """Il percorso d → [(segmenti, chiuso)]. Segmenti assoluti: ('L', p0, p1), ('A', p0, p1, r, fa, fs), ('C', p0, p1, p2, p3). Archi solo circolari, senza rotazione."""
    i, n = 0, len(d)
    num = re.compile(r"[ ,\t\n]*(-?(?:\d+\.?\d*|\.\d+))")

    def numero():
        nonlocal i
        m = num.match(d, i)
        if not m:
            raise ValueError(f"percorso illeggibile a {d[i:i + 20]!r}")
        i = m.end()
        return float(m.group(1))

    def flag():
        nonlocal i
        while d[i] in " ,\t\n":
            i += 1
        if d[i] not in "01":
            raise ValueError("flag dell'arco illeggibile")
        i += 1
        return int(d[i - 1])

    out, segs, cur, inizio, cmd = [], [], (0.0, 0.0), None, None
    while True:
        while i < n and d[i] in " ,\t\n":
            i += 1
        if i >= n:
            break
        if d[i].isalpha():
            cmd = d[i]
            i += 1
            if cmd in "Zz":
                if inizio is not None and cur != inizio:
                    segs.append(("L", cur, inizio))
                cur = inizio
                out.append((segs, True)); segs = []
                continue
        if cmd is None:
            raise ValueError("il percorso non comincia con un comando")
        rel, c = cmd.islower(), cmd.upper()
        if c == "M":
            if segs:
                out.append((segs, False)); segs = []
            x, y = numero(), numero()
            cur = (cur[0] + x, cur[1] + y) if rel else (x, y)
            inizio = cur
            cmd = "l" if rel else "L"
        elif c == "L":
            x, y = numero(), numero()
            p = (cur[0] + x, cur[1] + y) if rel else (x, y)
            segs.append(("L", cur, p)); cur = p
        elif c == "H":
            x = numero(); p = (cur[0] + x if rel else x, cur[1])
            segs.append(("L", cur, p)); cur = p
        elif c == "V":
            y = numero(); p = (cur[0], cur[1] + y if rel else y)
            segs.append(("L", cur, p)); cur = p
        elif c == "C":
            v = [numero() for _ in range(6)]
            pts = [(cur[0] + v[k], cur[1] + v[k + 1]) if rel else (v[k], v[k + 1]) for k in (0, 2, 4)]
            segs.append(("C", cur, *pts)); cur = pts[2]
        elif c == "A":
            rx, ry, rot, fa, fs = numero(), numero(), numero(), flag(), flag()
            x, y = numero(), numero()
            if rx != ry or rot != 0:
                raise ValueError("sono ammessi solo archi circolari senza rotazione")
            p = (cur[0] + x, cur[1] + y) if rel else (x, y)
            segs.append(("A", cur, p, rx, fa, fs)); cur = p
        else:
            raise ValueError(f"comando {cmd!r} non ammesso")
    if segs:
        out.append((segs, False))
    return out


def centro_arco(p0, p1, r, fa, fs):
    """(cx, cy, r, theta1, dtheta) di un arco circolare, come nell'appendice F.6.5 della specifica SVG."""
    x1, y1 = (p0[0] - p1[0]) / 2, (p0[1] - p1[1]) / 2
    q = x1 * x1 + y1 * y1
    if q == 0:
        raise ValueError("arco di lunghezza zero")
    if q > r * r:
        r = math.sqrt(q)
    coef = math.sqrt(max(0.0, (r * r - q) / q))
    segno = -1 if fa == fs else 1
    cx1, cy1 = segno * coef * y1, -segno * coef * x1
    cx, cy = cx1 + (p0[0] + p1[0]) / 2, cy1 + (p0[1] + p1[1]) / 2
    t1 = math.atan2((y1 - cy1) / r, (x1 - cx1) / r)
    t2 = math.atan2((-y1 - cy1) / r, (-x1 - cx1) / r)
    dt = t2 - t1
    if fs == 0 and dt > 0:
        dt -= 2 * math.pi
    elif fs == 1 and dt < 0:
        dt += 2 * math.pi
    return cx, cy, r, t1, dt


def _unita(dx, dy):
    l = math.hypot(dx, dy)
    return (dx / l, dy / l) if l else (1.0, 0.0)


def appiattisci(segs, scala):
    """I segmenti (nelle unità della tela) → (punti in pixel, tangenti): la polilinea (errore di una curva sotto 1/50 di pixel) e, per ogni sua corda,
    la tangente esatta del percorso alle due estremità della corda ((x, y) unitari, nell'ordine del percorso)."""
    pts = [tuple(c * scala for c in segs[0][1])]
    tang = []
    for seg in segs:
        if seg[0] == "L":
            pts.append((seg[2][0] * scala, seg[2][1] * scala))
            u = _unita(seg[2][0] - seg[1][0], seg[2][1] - seg[1][1])
            tang.append((u, u))
        elif seg[0] == "A":
            cx, cy, r, t1, dt = centro_arco(seg[1], seg[2], seg[3], seg[4], seg[5])
            rp = r * scala
            passo = 2 * math.acos(max(0.0, 1 - 0.02 / max(rp, 0.05)))
            k = max(4, int(math.ceil(abs(dt) / max(passo, 1e-3))))
            segno = 1 if dt > 0 else -1
            for j in range(1, k + 1):
                a = t1 + dt * j / k
                pts.append(((cx + r * math.cos(a)) * scala, (cy + r * math.sin(a)) * scala))
                a0 = t1 + dt * (j - 1) / k
                tang.append(((-segno * math.sin(a0), segno * math.cos(a0)), (-segno * math.sin(a), segno * math.cos(a))))
        else:
            _, (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
            lungo = (math.dist((x0, y0), (x1, y1)) + math.dist((x1, y1), (x2, y2)) + math.dist((x2, y2), (x3, y3))) * scala
            k = max(8, int(math.ceil(math.sqrt(lungo) * 3)))
            def derivata(t):
                u = 1 - t
                return _unita(3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2))
            for j in range(1, k + 1):
                t = j / k
                u = 1 - t
                a, b, c, e = u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t
                pts.append(((a * x0 + b * x1 + c * x2 + e * x3) * scala, (a * y0 + b * y1 + c * y2 + e * y3) * scala))
                tang.append((derivata((j - 1) / k), derivata(t)))
    return pts, tang


# ---------- gli insiemi di campioni ----------
class Maschera(dict):
    """{indice del pixel: intero a S*S bit}: i campioni coperti. Un pixel assente è vuoto."""


def _segna(maschera, larg, alt, Y, xl, xr):
    """Copre nel sotto-riga Y i campioni con centro in [xl, xr) (coordinate in pixel)."""
    py, sy = divmod(Y, S)
    if py < 0 or py >= alt:
        return
    X0 = max(0, math.ceil(xl * S - 0.5))
    X1 = min(larg * S, math.ceil(xr * S - 0.5))
    if X1 <= X0:
        return
    base = py * larg
    p0, p1 = X0 // S, (X1 - 1) // S
    for px in range(p0, p1 + 1):
        a = X0 - px * S if px == p0 else 0
        b = X1 - px * S if px == p1 else S
        bit = (((1 << (b - a)) - 1) << a) << (sy * S)
        i = base + px
        maschera[i] = maschera.get(i, 0) | bit


def riempi_anelli(anelli, larg, alt):
    """La maschera dell'unione degli anelli con la regola «diverso da zero»."""
    m = Maschera()
    bordi = []
    for anello in anelli:
        n = len(anello)
        for k in range(n):
            (x0, y0), (x1, y1) = anello[k], anello[(k + 1) % n]
            if y0 != y1:
                bordi.append((min(y0, y1), max(y0, y1), x0, y0, x1, y1, 1 if y1 > y0 else -1))
    if not bordi:
        return m
    ymin = min(b[0] for b in bordi)
    ymax = max(b[1] for b in bordi)
    for Y in range(max(0, math.ceil(ymin * S - 0.5)), min(alt * S, math.ceil(ymax * S - 0.5))):
        y = (Y + 0.5) / S
        incroci = []
        for lo, hi, x0, y0, x1, y1, d in bordi:
            if lo <= y < hi:
                incroci.append((x0 + (y - y0) * (x1 - x0) / (y1 - y0), d))
        incroci.sort()
        giro, inizio = 0, None
        for x, d in incroci:
            prima = giro
            giro += d
            if prima == 0 and giro != 0:
                inizio = x
            elif prima != 0 and giro == 0:
                _segna(m, larg, alt, Y, inizio, x)
    return m


def _quadrilatero(p, q, mezza, tp=None, tq=None):
    """Il lato p→q con mezza larghezza `mezza` da una parte e dall'altra; agli estremi tagliato perpendicolare alla tangente tp / tq se date, alla corda se no."""
    (x0, y0), (x1, y1) = p, q
    c = _unita(x1 - x0, y1 - y0)
    tp, tq = tp or c, tq or c
    n0, n1 = (-tp[1] * mezza, tp[0] * mezza), (-tq[1] * mezza, tq[0] * mezza)
    return [(x0 + n0[0], y0 + n0[1]), (x1 + n1[0], y1 + n1[1]), (x1 - n1[0], y1 - n1[1]), (x0 - n0[0], y0 - n0[1])]


def _disco(c, r, m, larg, alt):
    cx, cy = c
    for Y in range(max(0, math.ceil((cy - r) * S - 0.5)), min(alt * S, math.ceil((cy + r) * S - 0.5))):
        dy = (Y + 0.5) / S - cy
        if abs(dy) < r:
            h = math.sqrt(r * r - dy * dy)
            _segna(m, larg, alt, Y, cx - h, cx + h)


def _convesso(poly, m, larg, alt):
    ys = [p[1] for p in poly]
    n = len(poly)
    for Y in range(max(0, math.ceil(min(ys) * S - 0.5)), min(alt * S, math.ceil(max(ys) * S - 0.5))):
        y = (Y + 0.5) / S
        xs = []
        for k in range(n):
            (x0, y0), (x1, y1) = poly[k], poly[(k + 1) % n]
            if y0 != y1 and min(y0, y1) <= y < max(y0, y1):
                xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
        if len(xs) >= 2:
            _segna(m, larg, alt, Y, min(xs), max(xs))


def tratti_a_trattini(pts, tang, chiuso, trattini, scarto):
    """La polilinea (in pixel, con le tangenti esatte delle sue corde) → [(punti, tangente all'inizio, tangente alla fine)], un pezzo per ogni trattino
    (o uno solo, tutta, se non ci sono trattini). Le tangenti sono None dove il pezzo finisce con il percorso: lì vale la direzione della corda."""
    if chiuso and math.dist(pts[0], pts[-1]) > 1e-6:
        pts = pts + [pts[0]]
        tang = tang + [(_unita(pts[0][0] - pts[-2][0], pts[0][1] - pts[-2][1]),) * 2]
    if not trattini:
        return [(pts, None, None)]
    periodo = sum(trattini)
    lung = [0.0]
    for a, b in zip(pts, pts[1:]):
        lung.append(lung[-1] + math.dist(a, b))
    totale = lung[-1]
    # i tratti pieni: [inizio, fine) lungo il percorso, a partire da `scarto` dentro il disegno dei trattini
    intervalli, pos, k = [], -(scarto % periodo), 0
    while pos < totale:
        fine = pos + trattini[k % len(trattini)]
        if k % 2 == 0 and fine > 0:
            intervalli.append((max(pos, 0.0), min(fine, totale)))
        pos, k = fine, k + 1

    def punto(s):
        j = 1
        while j < len(lung) - 1 and lung[j] < s:
            j += 1
        a, b = pts[j - 1], pts[j]
        u = (s - lung[j - 1]) / (lung[j] - lung[j - 1]) if lung[j] > lung[j - 1] else 0.0
        t0, t1 = tang[j - 1]
        return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u), j, _unita(t0[0] + (t1[0] - t0[0]) * u, t0[1] + (t1[1] - t0[1]) * u)

    out = []
    for a, b in intervalli:
        if b - a < 1e-9:
            continue
        pa, ja, ta = punto(a)
        pb, jb, tb = punto(b)
        pezzo = [pa] + [pts[j] for j in range(ja, jb)] + [pb]
        out.append((pezzo, ta if a > 0 else None, tb if b < totale else None))
    return out


def _giunzione(v, a, b, mezza, m, larg, alt):
    """La giunzione tonda fra il lato che arriva in v da a e quello che parte per b: il settore di cerchio dalla parte esterna della svolta
    (un disco intero sporgerebbe oltre l'estremo di un tratto, dove i lati sono più corti del raggio)."""
    d1 = (v[0] - a[0], v[1] - a[1])
    d2 = (b[0] - v[0], b[1] - v[1])
    l1, l2 = math.hypot(*d1), math.hypot(*d2)
    d1, d2 = (d1[0] / l1, d1[1] / l1), (d2[0] / l2, d2[1] / l2)
    croce = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(croce) < 1e-12 and d1[0] * d2[0] + d1[1] * d2[1] > 0:
        return   # i due lati continuano dritti
    segno = -1 if croce > 0 else 1   # il lato esterno è opposto a quello verso cui si svolta
    a1 = math.atan2(segno * d1[0], -segno * d1[1])
    a2 = math.atan2(segno * d2[0], -segno * d2[1])
    giro = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    k = max(1, int(math.ceil(abs(giro) / max(2 * math.acos(max(0.0, 1 - 0.02 / max(mezza, 0.05))), 1e-3))))
    punti = [v] + [(v[0] + mezza * math.cos(a1 + giro * j / k), v[1] + mezza * math.sin(a1 + giro * j / k)) for j in range(k + 1)]
    _convesso(punti, m, larg, alt)


def tratteggia(pts, tang, chiuso, spessore, trattini, scarto, larg, alt):
    """La maschera del contorno: un quadrilatero per ogni lato e il settore tondo di ogni giunzione interna, estremi tagliati dritti."""
    m = Maschera()
    mezza = spessore / 2
    for pezzo, ts, te in tratti_a_trattini(pts, tang, chiuso, trattini, scarto):
        pulito = [pezzo[0]]
        for p in pezzo[1:]:
            if math.dist(p, pulito[-1]) > 1e-9:
                pulito.append(p)
        ultimo = len(pulito) - 2
        for k, (a, b) in enumerate(zip(pulito, pulito[1:])):
            _convesso(_quadrilatero(a, b, mezza, ts if k == 0 else None, te if k == ultimo else None), m, larg, alt)
        for k in range(1, len(pulito) - 1):
            _giunzione(pulito[k], pulito[k - 1], pulito[k + 1], mezza, m, larg, alt)
        if chiuso and not trattini and len(pulito) > 2:
            _giunzione(pulito[0], pulito[-2], pulito[1], mezza, m, larg, alt)
    return m


def intersezione(m1, m2):
    if m2 is None:
        return m1
    out = Maschera()
    for i, v in m1.items():
        w = m2.get(i)
        if w:
            x = v & w
            if x:
                out[i] = x
    return out


# ---------- l'SVG ----------
def _colore(v):
    v = v.strip().lower()
    m = re.fullmatch(r"#([0-9a-f]{6})", v)
    if m:
        return tuple(int(m.group(1)[k:k + 2], 16) for k in (0, 2, 4))
    if v == "none":
        return None
    raise ValueError(f"colore non ammesso: {v!r}")


def _trasformazione(t):
    """«translate(a b) scale(s)» → (a, b, c, d, e, f) come in SVG."""
    m = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    for nome, arg in re.findall(r"(\w+)\(([^)]*)\)", t or ""):
        v = [float(x) for x in re.split(r"[ ,]+", arg.strip())]
        if nome == "translate":
            n = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0.0)
        elif nome == "scale":
            n = (v[0], 0, 0, v[-1], 0, 0)
        else:
            raise ValueError(f"trasformazione non ammessa: {nome}")
        a, b, c, d, e_, f = m
        m = (a * n[0] + c * n[1], b * n[0] + d * n[1], a * n[2] + c * n[3], b * n[2] + d * n[3], a * n[4] + c * n[5] + e_, b * n[4] + d * n[5] + f)
    return m


def _nome(el):
    """Il nome dell'elemento senza lo spazio dei nomi (un SVG dentro una pagina HTML non lo dichiara)."""
    return el.tag.rpartition("}")[2]


def moltiplica(mat, trasformazione):
    """La matrice `mat` seguita da una trasformazione scritta come in SVG (nessuna: la stessa)."""
    if not trasformazione:
        return mat
    a, b, c, d, e_, f = mat
    t = _trasformazione(trasformazione)
    return (a * t[0] + c * t[1], b * t[0] + d * t[1], a * t[2] + c * t[3], b * t[2] + d * t[3], a * t[4] + c * t[5] + e_, b * t[4] + d * t[5] + f)


def _stile(el, classi):
    s = {}
    for c in (el.get("class") or "").split():
        s.update((classi or {}).get(c, {}))
    for k in ("fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-dashoffset", "stroke-linejoin"):
        if el.get(k) is not None:
            s[k] = el.get(k)
    for dich in (el.get("style") or "").split(";"):
        if ":" in dich:
            k, v = dich.split(":", 1)
            s[k.strip()] = v.strip()
    return s


def disegna(svg, n, classi=None):
    """L'SVG disegnato a n × n pixel (la tela è il suo viewBox, quadrato): n*n*4 byte RGBA."""
    radice = ET.fromstring(re.sub(r"<!--.*?-->", "", svg, flags=re.S))
    vb = [float(x) for x in radice.get("viewBox").split()]
    if vb[2] != vb[3] or vb[0] != 0 or vb[1] != 0:
        raise ValueError("il viewBox deve essere quadrato e cominciare da 0 0")
    scala = n / vb[2]
    clip_def = {c.get("id"): c for c in radice.iter() if _nome(c) == "clipPath"}
    acc = [0.0] * (n * n * 4)   # r, g, b premoltiplicati e alfa

    def punti_nel_mondo(segs_pts, mat):
        a, b, c, d, e_, f = mat
        return [(a * x + c * y + e_, b * x + d * y + f) for x, y in segs_pts]

    def forma(el, mat):
        """Gli anelli (pixel) di un elemento riempibile: [(punti, chiuso)]."""
        tag = _nome(el)
        if tag == "rect":
            x, y, w, h = (float(el.get(k, 0)) for k in ("x", "y", "width", "height"))
            rx = float(el.get("rx", el.get("ry", 0)))
            r = min(rx, w / 2, h / 2)
            if r > 0:
                d = f"M{x + r} {y}H{x + w - r}A{r} {r} 0 0 1 {x + w} {y + r}V{y + h - r}A{r} {r} 0 0 1 {x + w - r} {y + h}H{x + r}A{r} {r} 0 0 1 {x} {y + h - r}V{y + r}A{r} {r} 0 0 1 {x + r} {y}z"
            else:
                d = f"M{x} {y}H{x + w}V{y + h}H{x}z"
        elif tag == "path":
            d = el.get("d")
        else:
            return []
        out = []
        for segs, chiuso in sottopercorsi(d):
            if not segs:
                continue
            pts, tang = appiattisci(segs, 1.0)
            pts = punti_nel_mondo(pts, mat)
            a, b, c, d, _, _ = mat   # le tangenti ruotano con la matrice (uniforme: scala e traslazione)
            tang = [tuple(_unita(a * u[0] + c * u[1], b * u[0] + d * u[1]) for u in coppia) for coppia in tang]
            out.append(([(p[0] * scala, p[1] * scala) for p in pts], tang, chiuso))
        return out

    def maschera_clip(cp, mat):
        anelli = []
        for fig in cp:
            for pts, _, _ in forma(fig, moltiplica(mat, fig.get("transform"))):
                anelli.append(pts)
        return riempi_anelli(anelli, n, n)

    def componi(maschera, colore):
        for i, v in maschera.items():
            cov = v.bit_count() / (S * S)
            base = i * 4
            r, g, b = colore
            acc[base] = r * cov + acc[base] * (1 - cov)
            acc[base + 1] = g * cov + acc[base + 1] * (1 - cov)
            acc[base + 2] = b * cov + acc[base + 2] * (1 - cov)
            acc[base + 3] = cov + acc[base + 3] * (1 - cov)

    def visita(el, mat, clip, ereditato):
        tag = _nome(el)
        if tag in ("defs", "clipPath", "title", "desc"):
            return
        st = {**ereditato, **_stile(el, classi)}
        mat = moltiplica(mat, el.get("transform"))
        if el.get("clip-path"):
            ref = re.fullmatch(r"url\(#([^)]+)\)", el.get("clip-path").strip())
            cp = clip_def[ref.group(1)]
            clip = intersezione(maschera_clip(cp, mat), clip)
        if tag in ("svg", "g"):
            ereditabili = {k: v for k, v in st.items() if k in ("fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-dashoffset", "stroke-linejoin")}
            for fig in el:
                visita(fig, mat, clip, ereditabili)
            return
        figure = forma(el, mat)
        riempimento = _colore(st.get("fill", "#000000"))
        if riempimento is not None:
            m = riempi_anelli([pts for pts, _, _ in figure], n, n)
            componi(intersezione(m, clip), riempimento)
        tratto = _colore(st.get("stroke", "none"))
        if tratto is not None:
            sp = float(st.get("stroke-width", 1)) * scala * math.sqrt(abs(mat[0] * mat[3] - mat[1] * mat[2]))
            trattini = [float(x) * scala * math.sqrt(abs(mat[0] * mat[3] - mat[1] * mat[2])) for x in re.split(r"[ ,]+", st["stroke-dasharray"].strip())] if st.get("stroke-dasharray", "none") != "none" else []
            if trattini and len(trattini) % 2:
                trattini = trattini * 2
            scarto = float(st.get("stroke-dashoffset", 0)) * scala * math.sqrt(abs(mat[0] * mat[3] - mat[1] * mat[2]))
            if st.get("stroke-linejoin", "round") != "round":
                raise ValueError("sono ammesse solo giunzioni tonde")
            for pts, tang, chiuso in figure:
                m = tratteggia(pts, tang, chiuso, sp, trattini, scarto, n, n)
                componi(intersezione(m, clip), tratto)

    visita(radice, (1.0, 0.0, 0.0, 1.0, 0.0, 0.0), None, {})
    out = bytearray()
    for i in range(n * n):
        a = acc[i * 4 + 3]
        if a <= 0:
            out += b"\0\0\0\0"
            continue
        out += bytes(min(255, int(acc[i * 4 + k] / a + 0.5)) for k in range(3))
        out.append(min(255, int(a * 255 + 0.5)))
    return bytes(out)


# ---------- PNG ----------
def _chunk(tipo, dati):
    return struct.pack(">I", len(dati)) + tipo + dati + struct.pack(">I", zlib.crc32(tipo + dati) & 0xFFFFFFFF)


def png(w, h, rgba):
    righe = b"".join(b"\0" + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h))
    return (b"\x89PNG\r\n\x1a\n" + _chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
            + _chunk(b"IDAT", zlib.compress(righe, 9)) + _chunk(b"IEND", b""))


def leggi_png(dati):
    if dati[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("non è un PNG")
    i, idat, w = 8, b"", None
    while i < len(dati):
        n, tipo = struct.unpack(">I4s", dati[i:i + 8])
        corpo = dati[i + 8:i + 8 + n]
        if struct.unpack(">I", dati[i + 8 + n:i + 12 + n])[0] != zlib.crc32(tipo + corpo) & 0xFFFFFFFF:
            raise ValueError("CRC sbagliato")
        if tipo == b"IHDR":
            w, h, prof, tipo_colore, _, _, intrecciato = struct.unpack(">IIBBBBB", corpo)
            if (prof, tipo_colore, intrecciato) != (8, 6, 0):
                raise ValueError("solo PNG RGBA a 8 bit non intrecciati")
        elif tipo == b"IDAT":
            idat += corpo
        i += 12 + n
    grezzo = zlib.decompress(idat)
    stride = w * 4
    out = bytearray()
    prec = bytearray(stride)
    for y in range(h):
        f = grezzo[y * (stride + 1)]
        riga = bytearray(grezzo[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for x in range(stride):
            a = riga[x - 4] if x >= 4 else 0
            b = prec[x]
            c = prec[x - 4] if x >= 4 else 0
            if f == 1:
                riga[x] = (riga[x] + a) & 255
            elif f == 2:
                riga[x] = (riga[x] + b) & 255
            elif f == 3:
                riga[x] = (riga[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                riga[x] = (riga[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
            elif f != 0:
                raise ValueError("filtro PNG sconosciuto")
        out += riga
        prec = riga
    return w, h, bytes(out)


# ---------- ICO ----------
def ico(immagini):
    """Un ICO con una voce BMP a 32 bit (alfa non premoltiplicato) per ogni (n, rgba)."""
    voci, corpi = [], []
    offset = 6 + 16 * len(immagini)
    for n, rgba in immagini:
        pixel = bytearray()
        for y in range(n - 1, -1, -1):   # dal basso
            for x in range(n):
                r, g, b, a = rgba[(y * n + x) * 4:(y * n + x) * 4 + 4]
                pixel += bytes((b, g, r, a))
        maschera = b"\0" * (((n + 31) // 32) * 4 * n)   # la trasparenza sta nell'alfa
        corpo = struct.pack("<IiiHHIIiiII", 40, n, n * 2, 1, 32, 0, len(pixel) + len(maschera), 0, 0, 0, 0) + bytes(pixel) + maschera
        voci.append(struct.pack("<BBBBHHII", n % 256, n % 256, 0, 0, 1, 32, len(corpo), offset))
        corpi.append(corpo)
        offset += len(corpo)
    return struct.pack("<HHH", 0, 1, len(immagini)) + b"".join(voci) + b"".join(corpi)


def leggi_ico(dati):
    riservato, tipo, quante = struct.unpack("<HHH", dati[:6])
    if (riservato, tipo) != (0, 1):
        raise ValueError("non è un ICO")
    out = []
    for k in range(quante):
        w, h, _, _, piani, bit, dimensione, offset = struct.unpack("<BBBBHHII", dati[6 + 16 * k:22 + 16 * k])
        n = w or 256
        corpo = dati[offset:offset + dimensione]
        if corpo[:4] == b"\x89PNG":
            lw, lh, rgba = leggi_png(corpo)
            out.append((lw, rgba))
            continue
        intestazione, larg, alt2 = struct.unpack("<Iii", corpo[:12])
        if (larg, alt2, bit) != (n, n * 2, 32):
            raise ValueError("voce dell'ICO non a 32 bit")
        pix = corpo[intestazione:intestazione + n * n * 4]
        rgba = bytearray()
        for y in range(n - 1, -1, -1):
            for x in range(n):
                b, g, r, a = pix[(y * n + x) * 4:(y * n + x) * 4 + 4]
                rgba += bytes((r, g, b, a))
        out.append((n, bytes(rgba)))
    return out
