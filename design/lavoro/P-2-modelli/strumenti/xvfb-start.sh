#!/bin/bash
# Private Xvfb :138 in its own mount namespace (the shared /tmp/.X11-unix is read-only); clients reach
# it through the abstract socket @/tmp/.X11-unix/X138. Never :0 or :1.
X=/workspace/kalliope/materiali-locali/prove-voce/data/xvfb/root
pkill -f "^$X/usr/bin/Xvfb :138"; sleep 0.3
setsid nohup unshare -rm sh -c "mount -t tmpfs none /tmp/.X11-unix && mount -t overlay overlay -o lowerdir=/tmp/p2-xkbbin:/usr/bin /usr/bin && LD_LIBRARY_PATH=$X/usr/lib/x86_64-linux-gnu exec $X/usr/bin/Xvfb :138 -screen 0 1024x768x24 -nolisten tcp -xkbdir $X/usr/share/X11/xkb" > /tmp/p2-run/xvfb.log 2>&1 &
sleep 1.5
grep -c 'X11-unix/X138' /proc/net/unix; tail -3 /tmp/p2-run/xvfb.log
