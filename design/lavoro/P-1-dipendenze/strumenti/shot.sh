#!/bin/bash
# shot.sh OUT.png → screenshot of the private Weston output
. /tmp/p1-rig/wenv.sh
export WAYLAND_DISPLAY=p1-wayland
d=$(mktemp -d /tmp/p1-shot.XXXX); cd "$d"
LD_LIBRARY_PATH=$WLIBS timeout 10 $W/usr/bin/weston-screenshooter >/dev/null 2>&1
f=$(ls *.png 2>/dev/null | head -1)
[ -n "$f" ] && mv "$f" "$1" && echo "$1" || { echo "no screenshot"; ls -la; }
cd /; rmdir "$d" 2>/dev/null
