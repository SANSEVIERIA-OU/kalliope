#!/bin/bash
# Serie E2: gli stati, scenari scelti, alle altre misure di Chromium
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for m in 844x390 360x640 1366x640; do LIMITE=200 bash prove/registra.sh F-stati-chromium-$m node prove/stati.mjs $SITO /tmp/lavoro-3ab-F-stati chromium $m ascolto,errore,copia,copia-no,tentativo,tentativo-ridimensiona,tentativo-nascosto; done
