#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Scorciatoia del worker visita-4: lancia passo.mjs col posto in $POSTO, senza DISPLAY, salva l'uscita completa in
# design/incarichi/visita-4/log e stampa un riassunto.
# Uso: POSTO=l4:xxxx visita4-p.sh <ID> <comando passo...>   (LUNGO=n per più testo; RAW=1 per l'uscita intera)
SK=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
ID="$1"; shift
LOG=/workspace/kalliope/design/incarichi/visita-4/log
mkdir -p "$LOG"
N=$(ls "$LOG" | wc -l); N=$(printf "%04d" $((N+1)))
OUT="$LOG/$N-$ID-$1.txt"
cd "$SK"
env -u DISPLAY -u WAYLAND_DISPLAY timeout 170 node passo.mjs "$POSTO" "$@" > "$OUT" 2>&1
RC=$?
echo "[log $N rc=$RC]"
case "$1" in
  valuta|avvia|libera|schede|scheda|stato|aspetta) cat "$OUT" | head -c ${LUNGO:-6000};;
  *) python3 -I /workspace/kalliope/design/ricerca/strumenti/visita4-riassumi.py "${LUNGO:-300}" < "$OUT";;
esac
