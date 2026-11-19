#!/bin/bash
# e2e_mic.sh BIN OUT → the installed app, in its window on the private Weston, with no KALLIOPE_* variable,
# speaks into the virtual microphone of the private PipeWire; pw-record records the "kalliope" source as a
# call app would, one file per text. Giulia (Klein) and giovanni (the voice prepared from a CC0 recording,
# in the data folder). Texts are ASCII because they are typed through XTEST. (From P-1's e2e_mic.sh.)
. /tmp/p2-rig/common.sh
BIN=$1 OUT=$2
mkdir -p "$OUT"
PWE=/workspace/nomedadefinire/data/pw-tools/env.sh
TEXTS=("Buongiorno a tutti, scusate il ritardo." "Possiamo rivedere insieme i numeri del terzo trimestre?"
  "Mi sentite bene? Ho cambiato microfono stamattina." "Certo." "Mi sentite?" "Grazie." "Arrivo subito." "A dopo.")
printf '%s\n' "${TEXTS[@]}" > "$OUT/testi.txt"
record() { (. $PWE; LD_LIBRARY_PATH=$PW_LIBS exec timeout -s INT "$1" pw-record --target kalliope --rate 48000 --channels 1 --format f32 "$2" >/dev/null 2>&1) & }

for voice in Giulia giovanni; do
  fresh; mkdir -p /tmp/p2-home/config/kalliope
  printf 'voice=%s\nmonitor=false\n' "$voice" > /tmp/p2-home/config/kalliope/settings.conf
  $RIG/app.sh "$BIN" pw "${DOPOENV[@]}"; sleep 9
  $RIG/shot.sh "$OUT/$voice-pronta.png" >/dev/null
  i=0
  for t in "${TEXTS[@]}"; do
    xi click 200 90; sleep 0.3; xi type "$t"
    record 9 "$OUT/$voice-$i.wav"; sleep 1.2
    xi key Return; sleep 8.5; wait
    i=$((i + 1))
  done
  $RIG/shot.sh "$OUT/$voice-fine.png" >/dev/null
  pkill -x kalliope; sleep 1
done
cp /tmp/p2-run/app.log "$OUT/app.log"
ls "$OUT" | wc -l
