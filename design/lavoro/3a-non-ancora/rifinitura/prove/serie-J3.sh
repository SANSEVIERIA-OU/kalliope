#!/bin/bash
# La batteria nei due altri motori (Firefox, WebKit) sulla copia J: le misure principali. Uso: bash serie-H3.sh <motore> <parte>   parti: esame stati rob sonde catalogo
# (Firefox senza uscita audio su questa macchina: ogni suono dà errore, e gli esiti che dipendono dal suono vero sono «non verificati», non difetti.)
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI/.."
export RADICE=/tmp/lavoro-3ar-lavoro/radice-J; SITO=/tmp/lavoro-3ar-sito-J; LING=/tmp/lavoro-3ar-sito-L-J; FOTO=/tmp/lavoro-3ar-J-foto; M=$1
PORTA=$([ "$M" = firefox ] && echo 8855 || echo 8856)
case "$2" in
  esame) RIGHE=1 bash prove/corsa.sh J-esame-$M $PORTA $SITO esame-impaginazione.mjs $M normale non-ancora 1440x900,390x844,844x390,360x640,326x326,1440x500,1366x640 ;;
  stati) for m in 1440x900 390x844; do LIMITE=250 bash prove/registra.sh J-stati-$M-$m node prove/stati.mjs $SITO $FOTO/stati $M $m tutti; done
         for m in 844x390 326x326; do LIMITE=150 bash prove/registra.sh J-stati-$M-$m node prove/stati.mjs $SITO $FOTO/stati $M $m ascolto,errore,copia,copia-no; done ;;
  rob) for m in 1440x900 390x844; do LIMITE=540 bash prove/registra.sh J-robustezza-$M-$m node prove/robustezza.mjs $SITO $FOTO/rob $M $m tutti; done ;;
  sonde) LIMITE=150 bash prove/registra.sh J-bassi-suona-$M node prove/bassi.mjs $SITO $FOTO/bassi $M 1440x500,844x390,915x412,326x326,320x568 suona --senza-foto
         LIMITE=150 bash prove/registra.sh J-bassi-errore-$M node prove/bassi.mjs $SITO $FOTO/bassi $M 1440x500,844x500,844x390,326x326,320x568,390x667 errore --senza-foto
         LIMITE=150 bash prove/registra.sh J-etichetta-$M node prove/etichetta.mjs $SITO $FOTO/etichetta $M 390x844,326x326,1440x900
         LIMITE=300 bash prove/registra.sh J-versioni-$M node prove/versioni.mjs $SITO $FOTO/versioni $M 1440x900
         LIMITE=100 bash prove/registra.sh J-primo-$M node prove/primo.mjs $SITO $FOTO/primo $M 390x844,375x812,412x915,360x740,390x667,360x640,320x568,326x326
         LIMITE=150 bash prove/registra.sh J-piede-$M node prove/piede-fuoco.mjs $LING $M 390x844
         LIMITE=200 bash prove/registra.sh J-lingua-barra-$M node prove/lingua-barra.mjs $LING $FOTO/lingua $M 1440x900,390x844 ;;
  catalogo) LIMITE=200 bash prove/registra.sh J-catalogo-$M node prove/catalogo.mjs $SITO $FOTO/catalogo $M 1440x900 ;;
esac
