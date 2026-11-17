#!/bin/bash
# Una corsa di esame o di dispositivi sull'albero di prova, nel suo server, con l'esito scritto in esiti/<nome>.txt
# Uso: RADICE=/tmp/lavoro-3bb-radice-<n> bash corsa.sh <nome> <porta> <cartella-sito> <programma-della-skill> <argomenti…>
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts
NOME=$1; PORTA=$2; SITO=$3; PROG=$4; shift 4
export PLAYWRIGHT=${PLAYWRIGHT:-/workspace/test-playwright/node_modules/playwright/index.mjs} METODO_CONFIG=${CONFIG:-$AQUI/prove/config-prove.mjs} QA_CARTELLA=/tmp/lavoro-3bb-qa-$NOME
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
: "${RADICE:?manca la cartella dell albero di prova}"
mkdir -p "$AQUI/esiti"
{ echo "# $NOME · $(date '+%d/%m/%Y %H:%M') · sito: $SITO · albero: $RADICE · $PROG $*"; timeout 540 node "$AQUI/prove/con-server.mjs" "$PORTA=$SITO" -- node "$S/$PROG" "$@" 2>&1; echo "# uscita: $?"; } | tee "$AQUI/esiti/$NOME.txt" | grep -v "pulito$" | tail -${RIGHE:-40}
