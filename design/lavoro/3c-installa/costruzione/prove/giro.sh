#!/bin/bash
# Un giro di robustezza su un sito costruito: motore, misura e scenari, uno dopo l'altro, con l'esito in esiti/<nome>.txt (e le foto in /tmp/lavoro-3cb-rob-<nome>).
# Uso: bash giro.sh <nome-sito> <porta> <motore:misura:scenari> [<motore:misura:scenari> …]     (scenari separati da virgole; «tutti» o la lista)
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope/materiali-locali/playwright/env.sh
SITO=$1; PORTA=$2; shift 2
mkdir -p "$AQUI/esiti"
for voce in "$@"; do
  IFS=: read -r MOTORE MISURA SCENARI <<< "$voce"
  OUT=/tmp/lavoro-3cb-rob-$SITO; mkdir -p "$OUT"
  FILE="$AQUI/esiti/robustezza-$SITO-$MOTORE-$MISURA${ETICHETTA:+-$ETICHETTA}.txt"   # ETICHETTA distingue due corse dello stesso motore e della stessa misura (la seconda non cancella la prima)
  { echo "# robustezza · $SITO · $MOTORE $MISURA · $SCENARI · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"; PORTA=$PORTA timeout 1700 node "$AQUI/prove/robustezza.mjs" /tmp/lavoro-3cb-sito-$SITO "$OUT" "$MOTORE" "$MISURA" "$SCENARI" 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$FILE"
  echo "$MOTORE $MISURA: $(grep -c '^ok' "$FILE") ok, $(grep -c '^NO' "$FILE") NO"
done
