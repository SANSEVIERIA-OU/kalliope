#!/bin/bash
# `appunti-pagine.mjs` su un sito costruito: appunti e selezione a mano in ogni pagina, per le lingue date. Esito in esiti/appunti-pagine-<sito>-<motore>-<misura>.txt.
# Uso: bash appunti-pagine.sh <sito> <porta> <motore> <WxH> <lingua,lingua…>
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope/materiali-locali/playwright/env.sh
SITO=$1; PORTA=$2; MOTORE=$3; MISURA=$4; LINGUE=$5
F="$AQUI/esiti/appunti-pagine-$SITO-$MOTORE-$MISURA.txt"
{ echo "# appunti in ogni pagina · $SITO · $LINGUE · $MOTORE $MISURA · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"; PORTA=$PORTA timeout 600 node "$AQUI/prove/appunti-pagine.mjs" /tmp/lavoro-3cb-sito-$SITO $MOTORE $MISURA $LINGUE 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
echo "$SITO $LINGUE $MOTORE $MISURA: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
