#!/bin/bash
# stati.sh BIN OUTDIR → photos of the window's main states (3 shots each, for the text cursor's blink).
# Needs: Xvfb :137 (xvfb-start.sh), Weston x11 on it (weston-start.sh x11 560 460), private PipeWire
# (pw-start.sh), hold.py on 127.0.0.1:8931.
. /tmp/p1-rig/common.sh
BIN=$1 OUT=$2
mkdir -p "$OUT"
shots() { for i in 1 2 3; do $RIG/shot.sh "$OUT/$1-$i.png" >/dev/null; sleep 0.35; done; echo "$1"; }
PWE=/workspace/nomedadefinire/data/pw-tools/env.sh
record() { (. $PWE; LD_LIBRARY_PATH=$PW_LIBS timeout -s INT "$1" pw-record --target kalliope --rate 48000 --channels 1 "$2" >/dev/null 2>&1 &); }
NOMODEL=(-u KALLIOPE_MODEL_DIR -u KALLIOPE_ORT_LIB -u KALLIOPE_POCKET_DIR -u KALLIOPE_VOICES_DIR
  https_proxy=http://127.0.0.1:8931 HTTPS_PROXY=http://127.0.0.1:8931
  XDG_DATA_HOME=/tmp/p1-home/empty-data XDG_CONFIG_HOME=/tmp/p1-home/config)

# First start, the download held at 0 MB, then cancelled.
fresh; $RIG/app.sh "$BIN" nopw "${NOMODEL[@]}"; sleep 4; park; sleep 0.3; shots 01-primo-avvio
xi click 80 90; sleep 2; park; sleep 0.3; shots 02-scaricamento
xi click 50 87; sleep 1.5; park; sleep 0.3; shots 03-scaricamento-annullato

# The voice cannot start: no ONNX Runtime.
fresh; $RIG/app.sh "$BIN" pw KALLIOPE_ORT_LIB=/tmp/p1-nessuno/libonnxruntime.so.1 "${READYENV[@]:0:1}" "${READYENV[@]:2}"
sleep 5; park; sleep 0.3; shots 04-errore

# Ready, without the private PipeWire: the microphone warning.
fresh; $RIG/app.sh "$BIN" nopw "${READYENV[@]}"; sleep 6; park; sleep 0.3; shots 05-pronta-senza-microfono

# Ready, with the microphone.
fresh; $RIG/app.sh "$BIN" pw "${READYENV[@]}"; sleep 6; park; sleep 0.3; shots 06-pronta
xi click 200 90; sleep 0.3; xi type "Buongiorno a tutti"; sleep 0.4; park; sleep 0.3; shots 07-scritto
record 9 "$OUT/rec-08.wav"; sleep 1; xi key Return; sleep 0.5; shots 08-sta-parlando
sleep 9
xi click 253 436; sleep 0.5; xi click 200 70; sleep 0.3
xi type "Mi sentite bene? Scusate, ho avuto un problema con la connessione e sono arrivata in ritardo, adesso ci sono."; park; xi key Return; sleep 0.15; shots 09-nessuno-ascolta
sleep 8
xi type "Scusate il ritardo"; xi key Return; sleep 6; park; sleep 0.3; shots 10-cronologia
xi click 145 436; sleep 1; shots 11-voci
xi key Escape; sleep 0.5
xi click 490 436; sleep 1; park; sleep 0.3; shots 12-informazioni
pkill -x kalliope; sleep 0.5

# The voice prepared from a recording, chosen in the list.
fresh; printf 'voice=giovanni\nmonitor=true\n' > /tmp/p1-home/config/kalliope.conf
mkdir -p /tmp/p1-home/config/kalliope; printf 'voice=giovanni\nmonitor=true\n' > /tmp/p1-home/config/kalliope/settings.conf
$RIG/app.sh "$BIN" pw "${READYENV[@]}"; sleep 8; park; sleep 0.3; shots 13-voce-preparata
pkill -x kalliope
cp /tmp/p1-run/app.log "$OUT/app.log"
