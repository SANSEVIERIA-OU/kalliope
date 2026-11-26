#!/bin/bash
# e2e_mic.sh BIN OUT → the app, in its window on the private Weston, speaks into the virtual microphone of
# the private PipeWire; pw-record records the "kalliope" source as a call app would, one file per text.
# Giulia (Klein) and giovanni (the voice prepared from a CC0 recording), then `kalliope --say` without
# a window. Texts are ASCII because they are typed through XTEST.
. /tmp/p1-rig/common.sh
BIN=$1 OUT=$2
mkdir -p "$OUT"
PWE=/workspace/kalliope/materiali-locali/prove-voce/data/pw-tools/env.sh
TEXTS=("Buongiorno a tutti, scusate il ritardo." "Possiamo rivedere insieme i numeri del terzo trimestre?"
  "Mi sentite bene? Ho cambiato microfono stamattina." "Certo." "Mi sentite?" "Grazie." "Arrivo subito." "A dopo.")
printf '%s\n' "${TEXTS[@]}" > "$OUT/testi.txt"
record() { (. $PWE; LD_LIBRARY_PATH=$PW_LIBS exec timeout -s INT "$1" pw-record --target kalliope --rate 48000 --channels 1 --format f32 "$2" >/dev/null 2>&1) & }

for voice in Giulia giovanni; do
  fresh; mkdir -p /tmp/p1-home/config/kalliope
  printf 'voice=%s\nmonitor=false\n' "$voice" > /tmp/p1-home/config/kalliope/settings.conf
  $RIG/app.sh "$BIN" pw "${READYENV[@]}"; sleep 9
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

# Without a window: kalliope --say, with Giulia.
fresh; i=0
for t in "Buongiorno a tutti, scusate il ritardo." "Certo."; do
  record 9 "$OUT/say-$i.wav"; sleep 1.2
  (. $PWE; export LD_LIBRARY_PATH=$PW_LIBS PIPEWIRE_RUNTIME_DIR=/tmp/kmic-run; unset XDG_DATA_DIRS XDG_CONFIG_HOME XDG_STATE_HOME DISPLAY WAYLAND_DISPLAY
   env "${READYENV[@]}" "$BIN" --say "$t") > "$OUT/say-$i.log" 2>&1
  wait; i=$((i + 1))
done
printf '%s\n' "Buongiorno a tutti, scusate il ritardo." "Certo." > "$OUT/testi-say.txt"
ls "$OUT" | wc -l
