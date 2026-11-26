#!/bin/bash
# Gli indirizzi in fondo alla pagina (e due in mezzo) con gli script che arrivano dopo, a molte misure di un motore: stessa prova di `robustezza ancore`, ma solo i tre punti che possono cambiare
# (#indirizzo-installa, #inoltra, #ripresa) e solo gli script ritardati (800 ms). Esito in esiti/ancore-misure-<sito>-<motore>.txt.
# Uso: bash ancore-misure.sh <sito> <porta> <motore> <WxH> [<WxH> …]
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope/materiali-locali/playwright/env.sh
SITO=$1; PORTA=$2; MOTORE=$3; shift 3
F="$AQUI/esiti/ancore-misure-$SITO-$MOTORE.txt"
{ echo "# ancore a più misure · $SITO · $MOTORE · script ritardati di 800 ms · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"
  for M in "$@"; do PORTA=$PORTA timeout 300 node "$AQUI/prove/ancora-caratteri-tardi.mjs" /tmp/lavoro-3cb-sito-$SITO $MOTORE $M 800 indirizzo-installa,inoltra,ripresa --tipo=js 2>&1 | grep -v "Skipping host" | grep -v "^[0-9]*/[0-9]* nel"; done
  echo "# uscita: fine"; } > "$F"
echo "$MOTORE: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
