#!/bin/bash
# Le prove che dipendono dall'ultima correzione (il fuoco del piede e del menu, punto 8 e il punto in più di chi coordina: `.piede a { scroll-margin-bottom }` al posto di
# `html { scroll-padding-bottom }`; la misura della larghezza del comando nel catalogo) sulla copia L. Il resto della batteria è stato fatto sulla copia J, che differisce da L
# in questi tre file soltanto (token.css, pagina.css, catalogo-pagine.js): vedi progresso.md.
# Uso: bash serie-L.sh <motore> <parte>   parti: esame misure piede menu lingua catalogo rob
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI/.."
export RADICE=/tmp/lavoro-3ar-lavoro/radice-L; SITO=/tmp/lavoro-3ar-sito-L; LING=/tmp/lavoro-3ar-sito-L-LL; VERE=/tmp/lavoro-3ar-sito-V-L; FOTO=/tmp/lavoro-3ar-L-foto; M=$1
case "$M" in firefox) PORTA=8855;; webkit) PORTA=8856;; *) PORTA=8859;; esac
S2=/workspace/kalliope/design/lavoro/2-lingue-aspetto/costruzione/prove/selettore-barra.mjs
case "$2" in
  esame) RIGHE=1 bash prove/corsa.sh L-esame-$M $PORTA $SITO esame-impaginazione.mjs $M normale non-ancora 1440x900,390x844,844x390,360x640,326x326,1440x500,1366x640 ;;
  misure) RIGHE=1 bash prove/corsa.sh L-misure-varie $PORTA $SITO esame-impaginazione.mjs chromium normale non-ancora 390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900,360x640,390x667,375x812,320x568,1024x600,915x412,1366x640 ;;
  piede) LIMITE=150 bash prove/registra.sh L-piede-$M node prove/piede-fuoco.mjs $LING $M 390x844 ;;
  menu) LIMITE=170 bash prove/registra.sh L-menu-fuoco-$M node prove/menu-fuoco.mjs $LING $M 844x390,326x326,390x844,360x640,750x832 ;;
  lingua) LIMITE=200 bash prove/registra.sh L-lingua-barra-$M node prove/lingua-barra.mjs $LING $FOTO/lingua $M 1440x900,390x844
          LINGUA_ALTRA=de N_LINGUE=10 LIMITE=250 bash prove/registra.sh L-lingua-barra-vere-$M node prove/lingua-barra.mjs $VERE $FOTO/lingua-vere $M 1440x900,390x844 ;;
  selettore2b) [ "$M" = chromium ] && { { timeout 280 node $S2 $VERE --motori chromium --pagina non-ancora/ --lingue it,ar,ur --porta 8858 --sezioni tastiera,telefono,basso,resize,senzajs,ridotto,scorrimento,ritmo 2>&1 | grep -E "ROSSO|^lingue|^chromium|basso" ; } > esiti/L-selettore-barra-2b-chromium.txt; grep -c ROSSO esiti/L-selettore-barra-2b-chromium.txt; } ;;
  catalogo) LIMITE=200 bash prove/registra.sh L-catalogo-$M node prove/catalogo.mjs $SITO $FOTO/catalogo $M 1440x900 ;;
  rob) for m in 1440x900 390x844; do LIMITE=540 bash prove/registra.sh L-robustezza-$M-$m node prove/robustezza.mjs $SITO $FOTO/rob $M $m tutti; done ;;
  rob2) for m in 390x667 844x390 360x640; do LIMITE=150 bash prove/registra.sh L-robustezza-$M-$m node prove/robustezza.mjs $SITO $FOTO/rob $M $m tastiera,tastiera-veloce,senza-js,senza-stili; done ;;
esac
