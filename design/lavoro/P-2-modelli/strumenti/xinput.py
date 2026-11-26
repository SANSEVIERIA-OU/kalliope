#!/usr/bin/env python3
"""Synthetic input on the private Xvfb :138 through XTEST (Weston's x11 window forwards it).

  xinput.py click X Y        click at (X, Y) inside Weston's output
  xinput.py move X Y
  xinput.py type TEXT        ASCII text
  xinput.py key NAME         an X keysym name: Return, Escape, Down, Tab…
"""
import ctypes
import os
import sys
import time

ROOT = "/workspace/kalliope/materiali-locali/prove-voce/data/xvfb/root/usr/lib/x86_64-linux-gnu/"
x11 = ctypes.CDLL("libX11.so.6")
xtst = ctypes.CDLL(ROOT + "libXtst.so.6")
x11.XOpenDisplay.restype = ctypes.c_void_p
x11.XOpenDisplay.argtypes = [ctypes.c_char_p]
x11.XDefaultRootWindow.restype = ctypes.c_ulong
x11.XDefaultRootWindow.argtypes = [ctypes.c_void_p]
x11.XStringToKeysym.restype = ctypes.c_ulong
x11.XStringToKeysym.argtypes = [ctypes.c_char_p]
x11.XKeysymToKeycode.restype = ctypes.c_ubyte
x11.XKeysymToKeycode.argtypes = [ctypes.c_void_p, ctypes.c_ulong]
x11.XKeycodeToKeysym.restype = ctypes.c_ulong
x11.XKeycodeToKeysym.argtypes = [ctypes.c_void_p, ctypes.c_ubyte, ctypes.c_int]
x11.XFlush.argtypes = [ctypes.c_void_p]
x11.XSync.argtypes = [ctypes.c_void_p, ctypes.c_int]
x11.XQueryTree.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.POINTER(ctypes.c_ulong),
                           ctypes.POINTER(ctypes.c_ulong), ctypes.POINTER(ctypes.POINTER(ctypes.c_ulong)),
                           ctypes.POINTER(ctypes.c_uint)]
x11.XTranslateCoordinates.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_ulong, ctypes.c_int, ctypes.c_int,
                                      ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int),
                                      ctypes.POINTER(ctypes.c_ulong)]
xtst.XTestFakeMotionEvent.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_ulong]
xtst.XTestFakeButtonEvent.argtypes = [ctypes.c_void_p, ctypes.c_uint, ctypes.c_int, ctypes.c_ulong]
xtst.XTestFakeKeyEvent.argtypes = [ctypes.c_void_p, ctypes.c_uint, ctypes.c_int, ctypes.c_ulong]

display_name = os.environ.get("P2_X", ":138")
assert display_name not in (":0", ":1", ":0.0", ":1.0")
dpy = x11.XOpenDisplay(display_name.encode())
if not dpy:
    sys.exit(f"cannot open {display_name}")
root = x11.XDefaultRootWindow(dpy)


def origin():
    """Top-left of Weston's window on the Xvfb screen (the only top-level window)."""
    r, p = ctypes.c_ulong(), ctypes.c_ulong()
    children = ctypes.POINTER(ctypes.c_ulong)()
    n = ctypes.c_uint()
    x11.XQueryTree(dpy, root, ctypes.byref(r), ctypes.byref(p), ctypes.byref(children), ctypes.byref(n))
    best = None
    for i in range(n.value):
        x, y, c = ctypes.c_int(), ctypes.c_int(), ctypes.c_ulong()
        x11.XTranslateCoordinates(dpy, children[i], root, 0, 0, ctypes.byref(x), ctypes.byref(y), ctypes.byref(c))
        best = (x.value, y.value)
    return best or (0, 0)


def move(x, y):
    ox, oy = origin()
    xtst.XTestFakeMotionEvent(dpy, -1, ox + x, oy + y, 0)
    x11.XSync(dpy, 0)


def click(x, y):
    move(x, y)
    time.sleep(0.15)
    xtst.XTestFakeButtonEvent(dpy, 1, 1, 0)
    x11.XSync(dpy, 0)
    time.sleep(0.08)
    xtst.XTestFakeButtonEvent(dpy, 1, 0, 0)
    x11.XSync(dpy, 0)


SHIFT = x11.XKeysymToKeycode(dpy, x11.XStringToKeysym(b"Shift_L"))
NAMES = {" ": "space", ",": "comma", ".": "period", "?": "question", "!": "exclam", "'": "apostrophe",
         "-": "minus", ":": "colon", ";": "semicolon"}


def key(name):
    sym = x11.XStringToKeysym(name.encode())
    code = x11.XKeysymToKeycode(dpy, sym)
    if not code:
        sys.exit(f"no keycode for {name}")
    shifted = x11.XKeycodeToKeysym(dpy, code, 0) != sym
    if shifted:
        xtst.XTestFakeKeyEvent(dpy, SHIFT, 1, 0)
    xtst.XTestFakeKeyEvent(dpy, code, 1, 0)
    xtst.XTestFakeKeyEvent(dpy, code, 0, 0)
    if shifted:
        xtst.XTestFakeKeyEvent(dpy, SHIFT, 0, 0)
    x11.XSync(dpy, 0)
    time.sleep(0.03)


def main(args):
    cmd = args[0]
    if cmd == "click":
        click(int(args[1]), int(args[2]))
    elif cmd == "move":
        move(int(args[1]), int(args[2]))
    elif cmd == "type":
        for ch in " ".join(args[1:]):
            key(NAMES.get(ch, ch))
    elif cmd == "key":
        key(args[1])
    elif cmd == "origin":
        print(origin())
    else:
        sys.exit(__doc__)


main(sys.argv[1:])
