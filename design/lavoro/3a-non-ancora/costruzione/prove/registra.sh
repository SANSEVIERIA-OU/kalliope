#!/bin/bash
# Lancia un programma di prova e ne scrive l'esito (con la data, il comando e il codice di uscita) in ../esiti/<nome>.txt
# Uso: bash registra.sh <nome> <programma> [argomenti…]   (il sito costruito è in $SITO, le uscite delle foto in $FOTO)
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
NOME=$1; shift
export PLAYWRIGHT=${PLAYWRIGHT:-/workspace/test-playwright/node_modules/playwright/index.mjs} PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
{ echo "# $NOME · $(date '+%d/%m/%Y %H:%M') · $*"; timeout ${LIMITE:-520} "$@" 2>&1 | grep -vE "Skipping host requirements|^ok  "; echo "# uscita: ${PIPESTATUS[0]}"; } > "$AQUI/esiti/$NOME.txt"
grep -E "^(NO |NV |[0-9]+/[0-9]+ ok|# uscita)|cose da guardare|Tutto pulito|casi puliti|LIMITE NON USATO" "$AQUI/esiti/$NOME.txt" | cut -c1-210
