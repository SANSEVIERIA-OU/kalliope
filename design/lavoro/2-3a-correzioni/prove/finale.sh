#!/bin/bash
# Le prove di 2-f che girano sulla copia finale della pagina della scelta (fin3: lingue.html e lingue.css cambiati dopo fin2), per motore: il fuoco nella barra (anche a tastiera rapida:
# RITMO=0) e, in Chromium, l'esame dell'impaginazione della pagina della scelta. Uso: bash finale.sh <motore>
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI"; source ./env.sh; M=$1; D=/tmp/lavoro-2f-sito-fin3-10
LIMITE=300 RIGHE=4 bash registra.sh salto-scelta-fin3-$M node salto-menu.mjs $D $M ar/non-ancora/,./ 390x844,326x326,844x390
RITMO=0 LIMITE=300 RIGHE=4 bash registra.sh salto-rapido-fin3-$M node salto-menu.mjs $D $M ar/non-ancora/,de/,./ 390x844,326x326
if [ "$M" = chromium ]; then
  export RADICE=/tmp/lavoro-2f-radice-fin3-10; M22=390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900,360x640,390x667,375x812,320x568,1024x600,915x412,1366x640
  RIGHE=4 LIMITE=520 bash corsa.sh esame-scelta-fin3 ${PORTA_2F:-8891} $D esame-impaginazione.mjs chromium normale scelta-lingua $M22
fi
echo "== fine finale $M"
