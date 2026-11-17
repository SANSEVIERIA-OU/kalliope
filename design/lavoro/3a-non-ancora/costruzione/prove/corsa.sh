#!/bin/bash
# Una corsa di esame o di dispositivi sulla copia di lavoro, nel server proprio, con l'esito scritto in esiti/<nome>.txt
# Uso: bash corsa.sh <nome> <porta> <cartella-sito> <programma-della-skill> <argomenti…>
#   es.: bash corsa.sh larghezze-1 8810 /tmp/lavoro-3ab-sito-4 esame-impaginazione.mjs chromium normale non-ancora 320x900,…
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts
NOME=$1; PORTA=$2; SITO=$3; PROG=$4; shift 4
export PLAYWRIGHT=${PLAYWRIGHT:-/workspace/test-playwright/node_modules/playwright/index.mjs} METODO_CONFIG=${CONFIG:-$AQUI/config-prove.mjs} QA_CARTELLA=/tmp/lavoro-3ab-qa-$NOME
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
mkdir -p "$AQUI/esiti"
{ echo "# $NOME · $(date '+%d/%m/%Y %H:%M') · sito: $SITO · $PROG $*"; timeout 540 node "$AQUI/prove/con-server.mjs" "$SITO" "$PORTA" -- node "$S/$PROG" "$@" 2>&1; echo "# uscita: $?"; } | tee "$AQUI/esiti/$NOME.txt" | grep -v "pulito$" | tail -${RIGHE:-40}
