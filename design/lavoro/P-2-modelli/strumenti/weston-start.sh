#!/bin/bash
# weston-start.sh headless|x11 WIDTH HEIGHT  → private Weston on socket p2-wayland
. /tmp/p2-rig/wenv.sh
mode=$1 w=${2:-560} h=${3:-460}
pkill -f "^$W/usr/bin/weston --socket=p2" ; sleep 0.3
rm -f /tmp/p2-run/p2-wayland /tmp/p2-run/p2-wayland.lock
extra=()
if [ "$mode" = x11 ]; then
  export DISPLAY=:138
  WLIBS=$WLIBS:/tmp/metodo-motori/wk/radice/usr/lib/x86_64-linux-gnu
  extra=(--backend=x11 --width=$w --height=$h)
else
  extra=(--backend=headless --width=$w --height=$h)
fi
LD_LIBRARY_PATH=$WLIBS setsid nohup $W/usr/bin/weston --socket=p2-wayland --shell=kiosk --renderer=pixman --debug \
  --no-config "${extra[@]}" > /tmp/p2-run/weston.log 2>&1 &
for i in $(seq 50); do [ -S /tmp/p2-run/p2-wayland ] && break; sleep 0.1; done
ls -la /tmp/p2-run/p2-wayland && tail -3 /tmp/p2-run/weston.log
