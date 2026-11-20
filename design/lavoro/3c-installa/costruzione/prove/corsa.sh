#!/bin/bash
# Una corsa di esame o di dispositivi sull'albero di prova, nel suo server, con l'esito scritto in esiti/<nome>.txt
# Uso: RADICE=/tmp/lavoro-3cb-radice-<n> bash corsa.sh <nome> <porta> <cartella-sito> <programma-della-skill> <argomenti…>
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope-playwright/env.sh
S=$SKILL/scripts
NOME=$1; PORTA=$2; SITO=$3; PROG=$4; shift 4
export METODO_CONFIG=${CONFIG:-$AQUI/prove/config-prove.mjs} QA_CARTELLA=/tmp/lavoro-3cb-qa-$NOME
: "${RADICE:?manca la cartella dell albero di prova}"
mkdir -p "$AQUI/esiti"
{ echo "# $NOME · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh") · sito: $SITO · albero: $RADICE · $PROG $*"; timeout ${TEMPO:-1700} node "$AQUI/prove/con-server.mjs" "$PORTA=$SITO" -- node "$S/$PROG" "$@" 2>&1; echo "# uscita: $?"; } | tee "$AQUI/esiti/$NOME.txt" | grep -v "pulito$" | tail -${RIGHE:-40}
