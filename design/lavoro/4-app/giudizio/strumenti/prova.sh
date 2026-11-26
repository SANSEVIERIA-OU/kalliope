#!/bin/bash
# uso: prova.sh TEMA NOME SECONDI AZIONI.sh [ARGOMENTI APP...]
#  lancia Kalliope (ramo direzione) su :155 con portale finto per il tema, poi esegue AZIONI.sh (con $OUT, $D esportati)
set -u
TEMA=$1; NOME=$2; SEC=$3; AZ=$4; shift 4
G=/workspace/kalliope/design/lavoro/4-app/giudizio
OUT=$G/${RUN:-run2}/$NOME; mkdir -p "$OUT"
BIN=/workspace/kalliope/materiali-locali/target-direzione/release/kalliope
export DISPLAY=:155 D=:155 OUT LC_ALL=C.UTF-8 LANG=C.UTF-8
unset WAYLAND_DISPLAY WAYLAND_SOCKET DBUS_SESSION_BUS_ADDRESS XDG_CURRENT_DESKTOP
export XDG_CONFIG_HOME=$OUT/config XDG_DATA_HOME=$OUT/data XDG_RUNTIME_DIR=$OUT/run
mkdir -p $XDG_CONFIG_HOME $XDG_DATA_HOME $XDG_RUNTIME_DIR; chmod 700 $XDG_RUNTIME_DIR
export SLINT_BACKEND=winit-skia-software
cd /tmp
timeout "$SEC" dbus-run-session -- python3 -I /workspace/kalliope/materiali-locali/direzione-finestra/tools/portale_finto.py $TEMA -- $BIN "$@" > "$OUT/app.log" 2>&1 &
P=$!
python3 -c 'import time; time.sleep(3)'
bash "$AZ"
wait $P
echo fine $NOME
