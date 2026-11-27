# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Two things about the window that only its pixels can show, measured on the real program in its demonstration mode.

    python3 -I tools/controlla_finestra.py PROGRAMMA [--display :157]

PROGRAMMA is the built `kalliope`. It needs a display with no window manager (Xvfb), xdotool, ImageMagick, dbus-run-session and
PyGObject (the same as `portale_finto.py`); the window is opened with `kalliope --demo SCENA`, in the dark theme.

1. The foot of the writing. The dashed place of the writing keeps a margin under it, at every height from 420 to 580 px with the
   longest state («Nessuno ti sente») at 640, 800 and 920 px wide, and at the largest text size. A window whose parts do not fit
   used to lose the bottom of the writing (found by the judge of the built window, 26/11/2026).
2. The click. A click in the lower part of the writing place, among its commands, gives it the focus and what is typed appears, at
   100, 125, 150, 175 and 200% (at the large sizes the click used to be lost).

Exit status 0 when all hold; each failure is printed. Not a unit test: it needs a display, so it does not run in CI by itself.
Each window is closed on the display (xdotool windowkill) and the program started is left to end; `timeout` bounds its life.
"""
import os
import subprocess
import sys
import tempfile
import time

PORTALE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portale_finto.py")
MARGINE_MINIMO = 8
# a margin larger than this means the foot of the dashed place is not there at all (the window cut it off), not that it is far
MARGINE_MASSIMO = 60


def avvia(programma, scena, display, misura=None, scala=None):
    cartella = tempfile.mkdtemp(prefix="kalliope-controlla-")
    env = dict(os.environ, DISPLAY=display, SLINT_BACKEND="winit-skia-software", XDG_RUNTIME_DIR=cartella,
               XDG_CONFIG_HOME=cartella + "/c", XDG_DATA_HOME=cartella + "/d")
    for nome in ("WAYLAND_DISPLAY", "DBUS_SESSION_BUS_ADDRESS", "XDG_DATA_DIRS"):
        env.pop(nome, None)
    os.chmod(cartella, 0o700)
    if misura:
        env["KALLIOPE_DEMO_MISURA"] = misura
    if scala:
        env["KALLIOPE_DEMO_SCALA"] = scala
    return subprocess.Popen(["timeout", "30", "dbus-run-session", "--", "python3", "-I", PORTALE, "dark", "--", programma, "--demo", scena],
                            env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL), env


def finestra(env):
    for _ in range(100):
        ids = subprocess.run(["xdotool", "search", "--onlyvisible", "--name", "^Kalliope$"], env=env, capture_output=True, text=True).stdout.split()
        if ids:
            return ids[-1]
        time.sleep(0.1)
    return None


def foto(env, id_finestra, percorso):
    subprocess.run(["import", "-window", id_finestra, percorso], env=env, check=True)
    larghezza, altezza = map(int, subprocess.run(["identify", "-format", "%w %h", percorso], capture_output=True, text=True).stdout.split())
    dati = subprocess.run(["convert", percorso, "-depth", "8", "rgb:-"], capture_output=True).stdout
    return larghezza, altezza, dati


def tratteggio(dati, larghezza, x, y):
    i = (y * larghezza + x) * 3
    r, g, b = dati[i], dati[i + 1], dati[i + 2]
    return g > 150 and r < 190 and b > 130 and g > r + 30


def margine_sotto(env, id_finestra, percorso):
    """Pixels between the lowest row of the dashed place and the bottom of the window; -1 where it is not there."""
    larghezza, altezza, dati = foto(env, id_finestra, percorso)
    righe = [sum(1 for x in range(0, larghezza, 2) if tratteggio(dati, larghezza, x, y)) for y in range(altezza)]
    giu = [y for y in range(altezza) if righe[y] > 30]
    return altezza, (altezza - 1 - max(giu)) if giu else -1


def chiudi(processo, env, id_finestra):
    if id_finestra:
        subprocess.run(["xdotool", "windowkill", id_finestra], env=env, capture_output=True)
    try:
        processo.wait(timeout=10)
    except subprocess.TimeoutExpired:
        pass


def margini(programma, display, errori):
    cartella = tempfile.mkdtemp(prefix="kalliope-foto-")
    casi = [(f"{w}x{h}", None) for w in (640, 800, 920) for h in (420, 460, 500, 540, 580)] + [(None, "2")]
    for misura, scala in casi:
        processo, env = avvia(programma, "nessuno", display, misura, scala)
        f = finestra(env)
        try:
            time.sleep(1.8)
            _, m = margine_sotto(env, f, f"{cartella}/m-{misura or 'scala'}-{scala or 1}.png")
            for _ in range(3):
                if m != -1:
                    break
                # nothing drawn yet: the window was just mapped
                time.sleep(1.0)
                _, m = margine_sotto(env, f, f"{cartella}/m-{misura or 'scala'}-{scala or 1}.png")
        finally:
            chiudi(processo, env, f)
        nome = misura or "200%"
        bene = MARGINE_MINIMO <= m <= MARGINE_MASSIMO
        print(f"  margine {nome}: {m} px {'ok' if bene else 'NO'}")
        if not bene:
            errori.append(f"sotto la scrittura a {nome} restano {m} px (da {MARGINE_MINIMO} a {MARGINE_MASSIMO}: se è di più, il piede non si vede)")


def clic(programma, display, errori):
    cartella = tempfile.mkdtemp(prefix="kalliope-foto-")
    for scala in ("1", "1.25", "1.5", "1.75", "2"):
        processo, env = avvia(programma, "vuota", display, scala=scala)
        f = finestra(env)
        try:
            time.sleep(1.8)
            _, altezza, prima = foto(env, f, f"{cartella}/c-{scala}-a.png")
            subprocess.run(["xdotool", "windowfocus", f], env=env)
            # the lower part of the dashed place: the strip of the commands, away from the buttons
            subprocess.run(["xdotool", "mousemove", "--window", f, "300", str(altezza - 45), "click", "1"], env=env)
            time.sleep(0.4)
            subprocess.run(["xdotool", "type", "--delay", "60", "wwwww"], env=env)
            time.sleep(0.5)
            _, _, dopo = foto(env, f, f"{cartella}/c-{scala}-b.png")
        finally:
            chiudi(processo, env, f)
        chiari = lambda d: sum(1 for i in range(0, len(d), 3) if d[i] > 215 and d[i + 1] > 215 and d[i + 2] > 215)
        piu = chiari(dopo) - chiari(prima)
        ok = piu > 150
        print(f"  clic in basso a {float(scala) * 100:.0f}%: {'il testo compare' if ok else 'il testo NON compare'} ({piu} pixel chiari in più)")
        if not ok:
            errori.append(f"a {float(scala) * 100:.0f}% un clic in basso nella scrittura non la attiva")


def main(argv):
    if not argv or argv[0].startswith("-"):
        raise SystemExit(__doc__)
    programma = argv[0]
    display = argv[argv.index("--display") + 1] if "--display" in argv else os.environ.get("DISPLAY", ":157")
    errori = []
    print("Il piede della scrittura:")
    margini(programma, display, errori)
    print("Il clic nella parte bassa della scrittura:")
    clic(programma, display, errori)
    for e in errori:
        print("DIFETTO:", e)
    print("tutto a posto" if not errori else f"{len(errori)} difetti")
    return 1 if errori else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
