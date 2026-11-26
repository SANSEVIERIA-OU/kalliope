#!/bin/bash
# Il rendering delle pagine da destra a sinistra prima (H6: `site.py` che isolava anche il testo tecnico) e dopo (H8): stessa schermata, che cosa è cambiato (confronta-scelta.mjs: H6 è la «scelta», H8 «adesso»).
# Uso: bash rtl-prima-dopo.sh <pagina,pagina…> <y,y…>      pagine: percorsi come ar/stato/index.html
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope/materiali-locali/playwright/env.sh
for pg in ${1//,/ }; do for y in ${2//,/ }; do
  nome=$(echo "$pg" | sed 's#/index.html##; s#/#-#g; s#^index.html$#home#')
  F="$AQUI/esiti/rtl-prima-dopo-${ADESSO:-H9}-$nome-y$y.txt"
  { echo "# rtl prima/dopo · $pg · y $y · scelta H6 · adesso ${ADESSO:-H9} · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"
    node "$SKILL/scripts/confronta-scelta.mjs" /tmp/lavoro-3cb-sito-H6 /tmp/lavoro-3cb-sito-${ADESSO:-H9} /tmp/lavoro-3cb-rtl-pd-${ADESSO:-H9}/$nome-y$y --misure 1440x900,390x844 --ridotto --attesa 1800 --y $y --pagina $pg 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
  echo "$nome y=$y: $(grep -E '^# uscita' "$F") · $(grep -ciE 'SPOSTATO|MISURA|CARATTERE|COLORE|MANCA|IN PIÙ' "$F") righe di differenza"
done; done
