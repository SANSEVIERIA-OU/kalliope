#!/bin/bash
# Lo scenario `appunti` di robustezza.mjs (appunti veri e selezione a mano, senza segni invisibili) in una o più lingue e motori. Esiti in esiti/appunti-<sito>-<lingua>-<motore>-<misura>.txt.
# Uso: bash appunti.sh <sito> <porta> <motore> <WxH> <lingua> [<lingua> …]      (lingua: it, ar, ur, ar-XB, …)
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope-playwright/env.sh
SITO=$1; PORTA=$2; MOTORE=$3; MISURA=$4; shift 4
for L in "$@"; do
  F="$AQUI/esiti/appunti-$SITO-$L-$MOTORE-$MISURA.txt"
  { echo "# appunti · $SITO · $L · $MOTORE $MISURA · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"; PORTA=$PORTA timeout 600 node "$AQUI/prove/robustezza.mjs" /tmp/lavoro-3cb-sito-$SITO /tmp/lavoro-3cb-rob-$SITO-appunti $MOTORE $MISURA appunti --percorso=$L/installa/ 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
  echo "$SITO $L $MOTORE $MISURA: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
done
