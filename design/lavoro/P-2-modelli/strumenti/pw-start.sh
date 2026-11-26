#!/bin/bash
# Starts the private PipeWire of /workspace/kalliope/materiali-locali/prove-voce/data/pw-tools (never the user's).
. /workspace/kalliope/materiali-locali/prove-voce/data/pw-tools/env.sh
mkdir -p /tmp/kmic-run /tmp/kmic-state /tmp/kmic-logs; chmod 700 /tmp/kmic-run
for p in pipewire-pulse wireplumber pipewire; do pkill -f "^$R/usr/bin/$p\$"; done; sleep 0.5
export LD_LIBRARY_PATH=$PW_LIBS
setsid nohup $R/usr/bin/pipewire > /tmp/kmic-logs/pipewire.log 2>&1 &
sleep 0.7
setsid nohup $R/usr/bin/wireplumber > /tmp/kmic-logs/wireplumber.log 2>&1 &
setsid nohup $R/usr/bin/pipewire-pulse > /tmp/kmic-logs/pulse.log 2>&1 &
sleep 2
pw-cli info 0 | head -5; pactl info | grep -E 'Server Name|Default'
