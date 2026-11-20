#!/bin/bash
# Il primo schermo («installa») a ognuno dei quindici dispositivi e alle finestre basse: dove stanno il pulsante del file e lo stato «Oggi:». Uso: bash primo-dispositivi.sh <sito> <porta> [lingua]
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope-playwright/env.sh
SITO=$1; PORTA=$2; L=${3:-}
node "$AQUI/prove/con-server.mjs" "$PORTA=/tmp/lavoro-3cb-sito-$SITO" -- node "$AQUI/prove/primo.mjs" "http://127.0.0.1:$PORTA/" /tmp/lavoro-3cb-foto-primo-$SITO "${L:-it}/installa/" 390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900,1366x640,1280x720,1024x768,390x667,360x640,320x568,1920x1080 --ridotto --prefisso=${L:-it} 2>&1 | grep -v Skipping
