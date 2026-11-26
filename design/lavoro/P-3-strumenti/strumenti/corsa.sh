#!/bin/bash
# Una corsa di foto (home, stato, non ancora a 1440 e 390 nei tre motori) con la 1.60.0 («vecchio») o la 1.65.1 («nuovo»).
# Uso: corsa.sh vecchio|nuovo <sito costruito> <uscita> [altri argomenti di foto-motori.mjs]
set -euo pipefail
quale="${1:?vecchio o nuovo}"; sito="${2:?}"; uscita="${3:?}"; shift 3
unset DISPLAY WAYLAND_DISPLAY PLAYWRIGHT_BROWSERS_PATH METODO_MOTORI
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
case "$quale" in
  vecchio) export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs METODO_MOTORI=/tmp/metodo-motori; cd /workspace/test-playwright ;;
  nuovo)   source /workspace/kalliope/materiali-locali/playwright/env.sh; cd /workspace/kalliope/materiali-locali/playwright ;;
  *) echo "vecchio o nuovo"; exit 2 ;;
esac
node /workspace/kalliope/design/lavoro/P-3-strumenti/strumenti/foto-motori.mjs "$sito" "$uscita" "$@" 2>&1 | grep -v Skipping
