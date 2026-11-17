#!/bin/bash
# Serie C: misure varie in Chromium, i 15 dispositivi in Chromium
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
RIGHE=1 bash prove/corsa.sh F-misure-varie 8810 $SITO esame-impaginazione.mjs chromium normale non-ancora 360x640,390x667,375x812,412x915,915x412,320x568,1024x600,820x1180,1366x640,861x609,421x616,951x669,466x678 | grep -E "uscita|cose da guardare|Tutto pulito"
RIGHE=1 bash prove/corsa.sh F-dispositivi-chromium 8811 $SITO dispositivi-qa.mjs chromium non-ancora | grep -E "uscita|cose da guardare|casi puliti|LIMITE NON USATO"
