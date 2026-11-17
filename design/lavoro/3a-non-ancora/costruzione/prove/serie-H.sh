#!/bin/bash
# Serie H: robustezza in WebKit e Firefox
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for mo in webkit firefox; do for m in 1440x900 390x844; do LIMITE=540 bash prove/registra.sh F-robustezza-$mo-$m node prove/robustezza.mjs $SITO /tmp/lavoro-3ab-F-rob $mo $m tutti; done; done
