#!/bin/bash
# app.sh BIN pw|nopw [env args for env(1)...] → starts the app on the private Weston, in the background.
bin=$1 pw=$2; shift 2
if [ "$pw" = pw ]; then . /workspace/nomedadefinire/data/pw-tools/env.sh; export LD_LIBRARY_PATH=$PW_LIBS PIPEWIRE_RUNTIME_DIR=/tmp/kmic-run; unset XDG_DATA_DIRS XDG_CONFIG_HOME XDG_STATE_HOME; fi
unset DISPLAY WAYLAND_SOCKET
export WAYLAND_DISPLAY=/tmp/p2-run/p2-wayland XDG_RUNTIME_DIR=/tmp/p2-run
pkill -x kalliope; sleep 0.3
env "$@" setsid nohup "$bin" > /tmp/p2-run/app.log 2>&1 &
echo $! > /tmp/p2-run/app.pid
