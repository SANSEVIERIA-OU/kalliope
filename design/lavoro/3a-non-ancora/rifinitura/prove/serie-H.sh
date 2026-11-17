#!/bin/bash
# La batteria in Chromium sulla copia H (le stesse file finali): l'esame dell'impaginazione alle larghezze delle soglie, alle altezze e ai dispositivi, i dispositivi con gli stati.
# Uso: bash serie-H.sh <parte>   parti: larghezze altezze1 altezze2 misure dispositivi
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI/.."
export RADICE=/tmp/lavoro-3ar-lavoro/radice-H; SITO=/tmp/lavoro-3ar-sito-H
H="500 501 699 700 759 760 799 800 802 803 819 820"
case "$1" in
  larghezze) RIGHE=1 bash prove/corsa.sh H-larghezze 8850 $SITO esame-impaginazione.mjs chromium normale non-ancora 320x900,334x900,349x900,350x900,355x900,360x900,361x900,367x900,374x900,375x900,397x900,420x900,421x900,430x900,440x900,441x900,600x900,760x900,761x900,860x900,959x900,960x900,979x900,999x900,1000x900,1005x900,1010x900,1011x900,1095x900,1180x900,1181x900,1195x900,1209x900,1210x900,1565x900,1920x900 ;;
  altezze1) L=$(for h in $H; do printf "390x$h,844x$h,"; done | sed 's/,$//'); RIGHE=1 bash prove/corsa.sh H-altezze-1 8851 $SITO esame-impaginazione.mjs chromium normale non-ancora "$L" ;;
  altezze2) L=$(for h in $H; do printf "1366x$h,1440x$h,"; done | sed 's/,$//'); RIGHE=1 bash prove/corsa.sh H-altezze-2 8852 $SITO esame-impaginazione.mjs chromium normale non-ancora "$L" ;;
  misure) RIGHE=1 bash prove/corsa.sh H-misure-varie 8853 $SITO esame-impaginazione.mjs chromium normale non-ancora 390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900,360x640,390x667,375x812,320x568,1024x600,915x412,1366x640 ;;
  dispositivi) RIGHE=1 bash prove/corsa.sh H-dispositivi-chromium 8854 $SITO dispositivi-qa.mjs chromium non-ancora ;;
esac
