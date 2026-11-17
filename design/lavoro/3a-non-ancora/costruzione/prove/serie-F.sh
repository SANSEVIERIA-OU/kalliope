#!/bin/bash
# Serie F: gli stati in WebKit e Firefox (Firefox senza uscita audio: il suono vero non si prova)
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for mo in webkit firefox; do for m in 1440x900 390x844; do LIMITE=250 bash prove/registra.sh F-stati-$mo-$m node prove/stati.mjs $SITO /tmp/lavoro-3ab-F-stati $mo $m tutti; done; done
