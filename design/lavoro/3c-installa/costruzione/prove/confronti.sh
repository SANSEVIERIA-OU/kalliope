#!/bin/bash
# Il confronto con la scelta (confronta-scelta.mjs): home, «non ancora» e «stato» di oggi contro la copia di partenza 548a6f2 (sito P, in italiano): devono essere identiche; «installa» contro
# la sua resa (548a6f2), con le sole differenze dichiarate (ammesse.json). Uso: bash confronti.sh <sito costruito in italiano> <nome corsa>
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope/materiali-locali/playwright/env.sh
ADESSO=$1; NOME=$2; P=/tmp/lavoro-3cb-sito-P; MIS=1440x900,390x844,1366x640,844x390,360x640
mkdir -p "$AQUI/esiti"
for voce in "home it/index.html" "non-ancora it/non-ancora/index.html" "stato it/stato/index.html"; do
  set -- $voce
  { echo "# confronta-scelta · $1 · scelta $P · adesso $ADESSO · $(date '+%d/%m/%Y %H:%M')"; node "$SKILL/scripts/confronta-scelta.mjs" "$P" "$ADESSO" /tmp/lavoro-3cb-conf/$NOME/$1 --misure $MIS --ridotto --attesa 1500 --pagina "$2" 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$AQUI/esiti/$NOME-confronta-scelta-$1.txt"
  tail -3 "$AQUI/esiti/$NOME-confronta-scelta-$1.txt" | cut -c1-200
  for y in 1800; do
    { echo "# confronta-scelta · $1 dopo $y px · $(date '+%d/%m/%Y %H:%M')"; node "$SKILL/scripts/confronta-scelta.mjs" "$P" "$ADESSO" /tmp/lavoro-3cb-conf/$NOME/$1-$y --misure 1440x900,390x844 --ridotto --attesa 1500 --y $y --pagina "$2" 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$AQUI/esiti/$NOME-confronta-scelta-$1-$y.txt"
    tail -2 "$AQUI/esiti/$NOME-confronta-scelta-$1-$y.txt" | cut -c1-200
  done
done
if [ -f "$AQUI/prove/ammesse.json" ]; then A="--ammesse $AQUI/prove/ammesse.json"; else A=""; fi
for y in 0 700 2400 3300 4300 5200; do
  { echo "# confronta-scelta · installa a $y px · $(date '+%d/%m/%Y %H:%M')"; node "$SKILL/scripts/confronta-scelta.mjs" "$P" "$ADESSO" /tmp/lavoro-3cb-conf/$NOME/installa-$y --misure 1440x900,390x844,1366x640,1024x768,844x390 --ridotto --attesa 1500 --y $y --pagina it/installa/index.html $A 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$AQUI/esiti/$NOME-confronta-scelta-installa-$y.txt"
  tail -2 "$AQUI/esiti/$NOME-confronta-scelta-installa-$y.txt" | cut -c1-200
done
