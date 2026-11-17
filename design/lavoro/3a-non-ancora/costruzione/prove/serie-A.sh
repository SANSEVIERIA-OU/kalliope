#!/bin/bash
# Serie A: l'esame dell'impaginazione in Chromium alle larghezze delle soglie (900 px d'altezza)
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
RIGHE=1 bash prove/corsa.sh F-larghezze-1 8810 $SITO esame-impaginazione.mjs chromium normale non-ancora 320x900,334x900,349x900,350x900,355x900,360x900,361x900,367x900,374x900,375x900,397x900,420x900 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-larghezze-2 8811 $SITO esame-impaginazione.mjs chromium normale non-ancora 421x900,430x900,440x900,441x900,600x900,760x900,761x900,860x900,959x900,960x900,979x900,999x900 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-larghezze-3 8812 $SITO esame-impaginazione.mjs chromium normale non-ancora 1000x900,1005x900,1010x900,1011x900,1095x900,1180x900,1181x900,1195x900,1209x900,1210x900,1565x900,1920x900 | grep -E "uscita|cose da guardare|Tutto pulito"
