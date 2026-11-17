#!/bin/bash
# Serie D: Firefox e WebKit: l'esame alle quattro misure principali e i dispositivi principali
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for m in firefox webkit; do
  RIGHE=1 bash prove/corsa.sh F-esame-$m 8810 $SITO esame-impaginazione.mjs $m normale non-ancora 390x844,1440x900,844x390,360x640 | grep -E "uscita|cose da guardare|Tutto pulito|NON USATO"
  for d in "Telefono" "Telefono girato" "Computer"; do
    RIGHE=1 bash prove/corsa.sh "F-dispositivi-$m-${d// /-}" 8811 $SITO dispositivi-qa.mjs $m non-ancora "$d" | grep -E "uscita|cose da guardare|casi puliti|NON USATO"
  done
done
