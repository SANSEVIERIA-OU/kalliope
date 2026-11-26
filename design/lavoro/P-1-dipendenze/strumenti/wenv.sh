# Private headless Weston for P-1 photos. Never the real screen.
W=/workspace/kalliope/materiali-locali/prove-voce/data/xvfb/wroot
X=/workspace/kalliope/materiali-locali/prove-voce/data/xvfb/root
unset DISPLAY WAYLAND_DISPLAY WAYLAND_SOCKET
export XDG_RUNTIME_DIR=/tmp/p1-run
L=$W/usr/lib/x86_64-linux-gnu
export WLIBS=$L:$L/weston:$L/libweston-14:$X/usr/lib/x86_64-linux-gnu
export WESTON_MODULE_MAP="headless-backend.so=$L/libweston-14/headless-backend.so;x11-backend.so=$L/libweston-14/x11-backend.so;kiosk-shell.so=$L/weston/kiosk-shell.so;desktop-shell.so=$L/weston/desktop-shell.so;weston-desktop-shell=$W/usr/libexec/weston-desktop-shell;gl-renderer.so=$L/libweston-14/gl-renderer.so;color-lcms.so=$L/libweston-14/color-lcms.so"
