#!/bin/bash
# Riprende la corsa finale della coda (30 lavori… 85): ammette lavori per 3 minuti, aspetta quelli in corso (al massimo ~5 min), esce con 3 se resta altro.
# Uso: riprendi.sh <corsa> <file dei lavori> <file di uscita>
set -uo pipefail
cd /workspace/kalliope
S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
timeout 570 node $S/coda.mjs "$2" --corsa="$1" --uscita=/tmp/lavoro-2b-corse --massimo=6 --entro=3 --riprendi > "$3" 2>&1
tail -2 "$3" | cut -c1-300
