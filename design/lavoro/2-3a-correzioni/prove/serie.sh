#!/bin/bash
# Le prove di 2-f su un motore, una parte alla volta, su «dopo» (fin2-*) o «prima» (b456308: prima-*).
# Uso: bash serie.sh <motore> <parte> [prima|dopo]    parti: salto cornice suona errore tu copia scelta altezza vetro
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI"; source ./env.sh
M=$1; P=$2; V=${3:-dopo}
if [ "$V" = prima ]; then IT=/tmp/lavoro-2f-sito-prima-it; DIECI=/tmp/lavoro-2f-sito-prima-10; T=prima; else IT=/tmp/lavoro-2f-sito-fin2-it; DIECI=/tmp/lavoro-2f-sito-fin2-10; T=dopo; fi
LING=it,ar,ur,de,fi,el,bg,hi,bn,zh,en-XA,ar-XB
case "$P" in
  salto) LIMITE=420 RIGHE=8 bash registra.sh salto-$M-$T node salto-menu.mjs $IT $M it/,it/non-ancora/,it/stato/ 390x844,844x390,326x326,750x832
         LIMITE=300 RIGHE=6 bash registra.sh salto-lingue-$M-$T node salto-menu.mjs $DIECI $M ar/non-ancora/,de/,ur/,./ 390x844,326x326 ;;
  cornice) LIMITE=300 RIGHE=6 bash registra.sh cornice-$M-$T node senza-cornice.mjs $IT $M it/non-ancora/,it/stato/ 1440x900
         LIMITE=300 RIGHE=6 bash registra.sh cornice-tel-$M-$T node senza-cornice.mjs $IT $M it/non-ancora/,it/stato/ 390x844 ;;
  suona) for g in it,ar,ur,en-XA de,fi,el,bg hi,bn,zh,ar-XB; do for l in ${g//,/ }; do LIMITE=200 RIGHE=2 COL=200 bash registra.sh suona-$l-$M-$T node suona-basso.mjs $DIECI /tmp/lavoro-2f-lavoro/sb-$l-$M-$T $M 326x326,844x390,915x412,360x640,1366x640 suona --percorso=$l/non-ancora/ --senza-foto; done; done ;;
  errore) for l in it ur ar en-XA; do LIMITE=200 RIGHE=2 COL=200 bash registra.sh errore-$l-$M-$T node suona-basso.mjs $DIECI /tmp/lavoro-2f-lavoro/sbe-$l-$M-$T $M 326x326,844x390,915x412,1366x640,1440x500 errore --percorso=$l/non-ancora/ --senza-foto; done ;;
  tu) LIMITE=520 RIGHE=8 bash registra.sh tu-$M-$T node tu-misure.mjs $DIECI $M $LING 844x390,915x412,761x500,1440x900,326x326,390x844 --poco=2 ;;
  copia) LIMITE=400 RIGHE=10 bash registra.sh copia-$M-$T node copia-posto.mjs $DIECI $M it/non-ancora/,en-XA/non-ancora/,ar-XB/non-ancora/ 1440x900,1024x768,844x390,390x844 ;;
  scelta) LIMITE=200 RIGHE=8 bash registra.sh scelta-$M-$T node scelta-barra.mjs $DIECI $M 1440x900,844x390,1280x720,390x844,326x326
          LIMITE=200 RIGHE=8 bash registra.sh scelta-senzajs-$M-$T node scelta-barra.mjs $DIECI $M 1440x900,844x390,326x326 --senzajs ;;
  altezza) LIMITE=300 RIGHE=8 bash registra.sh altezza-$M-$T node altezza-schermo.mjs $DIECI /tmp/lavoro-2f-sito-fin2-10-vh2 /tmp/lavoro-2f-sito-fin2-10-rotto2 $M 844x390,390x844,326x326,1440x900,915x412 ;;
  vetro) LIMITE=200 RIGHE=6 COL=230 bash registra.sh vetro-$M-$T node vetro-menu.mjs $DIECI $M it/non-ancora/,it/ 390x844 --soglia=6 ;;
esac
