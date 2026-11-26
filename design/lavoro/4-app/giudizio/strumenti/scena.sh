#!/bin/bash
# uso: scena.sh SCENA OUTDIR [MISURA] [SECONDI] [EXTRA_ENV...]
# lancia la scena demo su :155, fotografa la finestra, la lascia scadere con timeout
set -u
SCENA="$1"; OUT="$2"; MIS="${3:-}"; SEC="${4:-6}"
BIN=/workspace/kalliope/materiali-locali/target-direzione/release/kalliope
mkdir -p "$OUT"
export DISPLAY=:155
unset WAYLAND_DISPLAY
cd /tmp
if [ -n "$MIS" ]; then export KALLIOPE_DEMO_MISURA="$MIS"; fi
if [ "$SCENA" = "catalogo" ]; then ARGS=(--catalogo); elif [ "$SCENA" = "vero" ]; then ARGS=(); else ARGS=(--demo "$SCENA"); fi
timeout "$SEC" "$BIN" "${ARGS[@]}" > "$OUT/$SCENA${MIS:+-$MIS}.log" 2>&1 &
P=$!
python3 -c 'import time; time.sleep(2.5)'
WID=$(xdotool search --pid $P 2>/dev/null | tail -1)
xdotool getwindowgeometry $WID 2>/dev/null
import -window root "$OUT/$SCENA${MIS:+-$MIS}-root.png"
wait $P
