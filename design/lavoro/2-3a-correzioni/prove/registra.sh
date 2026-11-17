#!/bin/bash
# Una prova con l'esito scritto in esiti/<nome>.txt. Uso: LIMITE=<s> bash registra.sh <nome> <comando…>
AQUI="$(cd "$(dirname "$0")/.." && pwd)"; source "$AQUI/prove/env.sh"
NOME=$1; shift; mkdir -p "$AQUI/esiti"
{ echo "# $NOME · $(date '+%d/%m/%Y %H:%M') · $*"; timeout ${LIMITE:-400} "$@" 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } | tee "$AQUI/esiti/$NOME.txt" | tail -${RIGHE:-12} | cut -c1-${COL:-260}
