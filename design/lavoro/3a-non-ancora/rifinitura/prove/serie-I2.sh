#!/bin/bash
# La batteria funzionale in Chromium sulla copia I: gli stati (ascolto, errore, lento, attesa, copia…), la tastiera a due ritmi, senza JavaScript, senza stili, ridotto,
# scorrimento veloce, ritorno, ricarica; il catalogo. Uso: bash serie-H2.sh <parte>   parti: stati1 stati2 rob1 rob2 catalogo
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI/.."
export RADICE=/tmp/lavoro-3ar-lavoro/radice-I; SITO=/tmp/lavoro-3ar-sito-I; FOTO=/tmp/lavoro-3ar-I-foto
case "$1" in
  stati1) for m in 1440x900 390x844; do LIMITE=270 bash prove/registra.sh I-stati-chromium-$m node prove/stati.mjs $SITO $FOTO/stati chromium $m tutti; done ;;
  stati2) for m in 844x390 360x640 1366x640 326x326 1440x500; do LIMITE=200 bash prove/registra.sh I-stati-chromium-$m node prove/stati.mjs $SITO $FOTO/stati chromium $m ascolto,errore,copia,copia-no,tentativo,tentativo-ridimensiona,tentativo-nascosto; done ;;
  rob1) for m in 1440x900 390x844; do LIMITE=270 bash prove/registra.sh I-robustezza-chromium-$m node prove/robustezza.mjs $SITO $FOTO/rob chromium $m tutti; done ;;
  rob2) for m in 390x667 844x390 360x640; do LIMITE=150 bash prove/registra.sh I-robustezza-chromium-$m node prove/robustezza.mjs $SITO $FOTO/rob chromium $m tastiera,tastiera-veloce,senza-js,senza-stili; done ;;
  catalogo) LIMITE=200 bash prove/registra.sh I-catalogo-chromium node prove/catalogo.mjs $SITO $FOTO/catalogo chromium 1440x900; LIMITE=120 bash prove/registra.sh I-catalogo-chromium-390 node prove/catalogo.mjs $SITO $FOTO/catalogo chromium 390x844 ;;
  pseudo) for L in en-XA ar-XB; do PSEUDO=$L CONFIG=$AQUI/../config-pseudo.mjs RIGHE=1 bash prove/corsa.sh I-pseudo-esame-$L 8857 /tmp/lavoro-3ar-sito-I-pseudo esame-impaginazione.mjs chromium normale non-ancora 390x844,1440x900,844x390,360x640,1366x640 ; done
          bash prove/registra.sh I-pseudo-testi-en-XA node prove/pseudo-testi.mjs /tmp/lavoro-3ar-sito-I-pseudo en-XA ;;
esac
