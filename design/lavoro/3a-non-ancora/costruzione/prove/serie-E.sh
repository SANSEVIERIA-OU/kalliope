#!/bin/bash
# Serie E: gli stati (ascolto, errore, lento, attesa, nascosto, copia, tentativo…) in Chromium
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for m in 1440x900 390x844; do LIMITE=270 bash prove/registra.sh F-stati-chromium-$m node prove/stati.mjs $SITO /tmp/lavoro-3ab-F-stati chromium $m tutti; done
