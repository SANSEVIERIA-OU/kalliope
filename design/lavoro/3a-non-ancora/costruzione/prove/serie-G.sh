#!/bin/bash
# Serie G: robustezza (tastiera a due ritmi, senza JS, senza stili, ridotto, scorrimento, ritorno, ricarica) in Chromium
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for m in 1440x900 390x844; do LIMITE=270 bash prove/registra.sh F-robustezza-chromium-$m node prove/robustezza.mjs $SITO /tmp/lavoro-3ab-F-rob chromium $m tutti; done
for m in 390x667 844x390 360x640; do LIMITE=150 bash prove/registra.sh F-robustezza-chromium-$m node prove/robustezza.mjs $SITO /tmp/lavoro-3ab-F-rob chromium $m tastiera,tastiera-veloce,senza-js,senza-stili; done
