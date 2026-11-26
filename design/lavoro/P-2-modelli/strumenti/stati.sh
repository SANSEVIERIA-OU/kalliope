#!/bin/bash
# stati.sh prima|dopo BIN OUTDIR → photos of the window's states (3 shots each, for the text cursor's blink).
# prima: the program of 7369a80 with the models in variables, and its first start that downloads (held
# at 0 MB by hold.py on 127.0.0.1:8932). dopo: the installed program, no variables; plus the state of an
# installation without the voice (BROKEN=folder of an unpacked tarball whose share/kalliope was removed).
. /tmp/p2-rig/common.sh
MODE=$1 BIN=$2 OUT=$3
mkdir -p "$OUT"
shots() { for i in 1 2 3; do $RIG/shot.sh "$OUT/$1-$i.png" >/dev/null; sleep 0.35; done; echo "$1"; }
PWE=/workspace/kalliope/materiali-locali/prove-voce/data/pw-tools/env.sh
record() { (. $PWE; LD_LIBRARY_PATH=$PW_LIBS timeout -s INT "$1" pw-record --target kalliope --rate 48000 --channels 1 "$2" >/dev/null 2>&1 &); }
if [ "$MODE" = prima ]; then ENVV=("${PRIMAENV[@]}"); else ENVV=("${DOPOENV[@]}"); fi

if [ "$MODE" = prima ]; then
  # First start: no model, the download held at 0 MB, then cancelled.
  NOMODEL=(-u KALLIOPE_MODEL_DIR -u KALLIOPE_ORT_LIB -u KALLIOPE_POCKET_DIR -u KALLIOPE_VOICES_DIR
    https_proxy=http://127.0.0.1:8932 HTTPS_PROXY=http://127.0.0.1:8932
    XDG_DATA_HOME=/tmp/p2-home/empty-data XDG_CONFIG_HOME=/tmp/p2-home/config)
  fresh; $RIG/app.sh "$BIN" nopw "${NOMODEL[@]}"; sleep 4; park; sleep 0.3; shots 01-primo-avvio
  xi click 80 90; sleep 2; park; sleep 0.3; shots 02-scaricamento
  xi click 50 87; sleep 1.5; park; sleep 0.3; shots 03-scaricamento-annullato
else
  # First start of the installed program: a new home, nothing downloaded, straight to «Pronta».
  fresh; $RIG/app.sh "$BIN" pw "${ENVV[@]}"; sleep 4; park; sleep 0.3; shots 01-primo-avvio
fi

# The voice cannot start: no ONNX Runtime.
fresh; $RIG/app.sh "$BIN" pw "${ENVV[@]}" KALLIOPE_ORT_LIB=/tmp/p2-nessuno/libonnxruntime.so.1
sleep 5; park; sleep 0.3; shots 04-errore

# Ready, without the private PipeWire: the microphone warning.
fresh; $RIG/app.sh "$BIN" nopw "${ENVV[@]}"; sleep 6; park; sleep 0.3; shots 05-pronta-senza-microfono

# Ready, with the microphone.
fresh; $RIG/app.sh "$BIN" pw "${ENVV[@]}"; sleep 6; park; sleep 0.3; shots 06-pronta
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
fresh; mkdir -p /tmp/p2-home/config/kalliope; printf 'voice=giovanni\nmonitor=true\n' > /tmp/p2-home/config/kalliope/settings.conf
$RIG/app.sh "$BIN" pw "${ENVV[@]}"; sleep 8; park; sleep 0.3; shots 13-voce-preparata
pkill -x kalliope; sleep 0.5

if [ "$MODE" = dopo ] && [ -n "${BROKEN:-}" ]; then
  # An installation without the voice: the error state, saying what is missing.
  fresh; $RIG/app.sh "$BROKEN/bin/kalliope" pw "${ENVV[@]}"; sleep 4; park; sleep 0.3; shots 14-manca-la-voce
  pkill -x kalliope
fi
cp /tmp/p2-run/app.log "$OUT/app.log"
