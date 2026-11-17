#!/bin/bash
# Serie B: l'esame in Chromium alle altezze delle soglie (a 390, 844, 1366, 1440 di larghezza) e a misure varie
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
RIGHE=1 bash prove/corsa.sh F-altezze-1 8810 $SITO esame-impaginazione.mjs chromium normale non-ancora 390x500,390x501,390x699,390x700,390x759,390x760,390x799,390x800,390x802,390x803,390x819,390x820 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-altezze-2 8811 $SITO esame-impaginazione.mjs chromium normale non-ancora 844x500,844x501,844x699,844x700,844x759,844x760,844x799,844x800,844x802,844x803,844x819,844x820 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-altezze-3 8812 $SITO esame-impaginazione.mjs chromium normale non-ancora 1366x500,1366x501,1366x699,1366x700,1366x759,1366x760,1366x799,1366x800,1366x802,1366x803,1366x819,1366x820 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-altezze-4 8813 $SITO esame-impaginazione.mjs chromium normale non-ancora 1440x500,1440x501,1440x699,1440x700,1440x759,1440x760,1440x799,1440x800,1440x802,1440x803,1440x819,1440x820 | grep -E "uscita|cose da guardare|Tutto pulito"
