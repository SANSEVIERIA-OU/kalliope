#!/bin/bash
# weston-start.sh headless|x11 WIDTH HEIGHT  → private Weston on socket p1-wayland
. /tmp/p1-rig/wenv.sh
mode=$1 w=${2:-560} h=${3:-460}
pkill -f "^$W/usr/bin/weston --socket=p1" ; sleep 0.3
rm -f /tmp/p1-run/p1-wayland /tmp/p1-run/p1-wayland.lock
extra=()
if [ "$mode" = x11 ]; then
  export DISPLAY=:137
  WLIBS=$WLIBS:/tmp/metodo-motori/wk/radice/usr/lib/x86_64-linux-gnu
  extra=(--backend=x11 --width=$w --height=$h)
else
  extra=(--backend=headless --width=$w --height=$h)
fi
LD_LIBRARY_PATH=$WLIBS setsid nohup $W/usr/bin/weston --socket=p1-wayland --shell=kiosk --renderer=pixman --debug \
  --no-config "${extra[@]}" > /tmp/p1-run/weston.log 2>&1 &
for i in $(seq 50); do [ -S /tmp/p1-run/p1-wayland ] && break; sleep 0.1; done
ls -la /tmp/p1-run/p1-wayland && tail -3 /tmp/p1-run/weston.log
