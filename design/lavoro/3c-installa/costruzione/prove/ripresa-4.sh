#!/bin/bash
# La parte «lingue, primo schermo ai dispositivi, confronto con la scelta» del giro finale (era finale-4.sh), a pezzi: ogni pezzo è un comando in primo piano, senza attese di file.
# Uso: bash ripresa-4.sh <nome albero, es. H6> <pezzo>   pezzi: lingue-a (en-XA, ar-XB, ar, ur), lingue-b (hi bn zh el de fi bg), lingue-rtl (ar, ur), primo-lingue, primo-robustezza, foto, rtl, dispositivi, confronti
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
NOME=$1; PEZZO=$2
source /workspace/kalliope-playwright/env.sh
export RADICE=/tmp/lavoro-3cb-radice-$NOME
H=/tmp/lavoro-3cb-sito-$NOME
lingue_esame() {
  for L in "$@"; do
    MIS=390x844,1440x900,844x390; case $L in enXA|arXB|ar|ur) MIS=$MIS,326x326,1366x640;; esac
    CONFIG=$AQUI/prove/config-lingue.mjs RIGHE=30 bash "$AQUI/prove/corsa.sh" "$NOME-lingue-$L" 8897 $H esame-impaginazione.mjs chromium normale "${L}_in" "$MIS"
  done
}
case "$PEZZO" in
  lingue-a) lingue_esame enXA arXB ar ur ;;
  lingue-b) lingue_esame hi bn zh el de fi bg ;;
  lingue-rtl) lingue_esame ar ur ;;
  primo-lingue)
    node "$AQUI/prove/con-server.mjs" 8896=$H -- node "$AQUI/prove/primo-lingue.mjs" http://127.0.0.1:8896/ it,de,fi,el,bg,ar,ur,hi,bn,zh,en-XA,ar-XB 1440x900,1366x640,1280x720,1024x768,844x390,390x667,360x640 > "$AQUI/esiti/$NOME-primo-lingue.txt" 2>&1
    tail -3 "$AQUI/esiti/$NOME-primo-lingue.txt" | cut -c1-200 ;;
  primo-robustezza)
    for voce in "en-XA 1366x640" "en-XA 1280x720" "ar-XB 1024x768" "ar-XB 1366x640" "ar 844x390" "ur 1366x640"; do set -- $voce
      F="$AQUI/esiti/robustezza-$NOME-primo-$1-$2.txt"
      { echo "# robustezza · $NOME · primo e stabile in $1 · chromium $2 · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"; PORTA=8896 timeout 900 node "$AQUI/prove/robustezza.mjs" $H /tmp/lavoro-3cb-rob-$NOME-lingue chromium $2 primo,stabile --lingua=$1 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
      echo "primo $1 $2: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
    done ;;
  foto)
    node "$AQUI/prove/foto-lingue.mjs" $H "$AQUI/foto/lingue" 8896 en-XA,ar-XB,ar,ur 390x844,1440x900 > "$AQUI/esiti/$NOME-foto-lingue.txt" 2>&1; tail -2 "$AQUI/esiti/$NOME-foto-lingue.txt" | cut -c1-200
    node "$AQUI/prove/foto-lingue.mjs" $H /tmp/lavoro-3cb-foto-lingue-altre-$NOME 8896 de,fi,el,bg,hi,bn,zh 390x844,1440x900 > "$AQUI/esiti/$NOME-foto-lingue-altre.txt" 2>&1; tail -2 "$AQUI/esiti/$NOME-foto-lingue-altre.txt" | cut -c1-200 ;;
  rtl)
    for L in ar ur; do for M in 1440x900 390x844; do
      F="$AQUI/esiti/robustezza-$NOME-$L-rtl-$M.txt"
      { echo "# robustezza · $NOME · $L da destra a sinistra · chromium $M · $(date '+%d/%m/%Y %H:%M') · $(bash "$AQUI/prove/carico.sh")"; PORTA=8896 timeout 1700 node "$AQUI/prove/robustezza.mjs" $H /tmp/lavoro-3cb-rob-$NOME-rtl chromium $M sistema,tastiera-veloce,frasi,copia,appunti,ridotto,senza-js --percorso=$L/installa/ --rtl 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
      echo "rtl $L $M: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
    done; done ;;
  dispositivi) bash "$AQUI/prove/primo-dispositivi.sh" $NOME 8896 > "$AQUI/esiti/$NOME-primo-dispositivi.txt" 2>&1; tail -3 "$AQUI/esiti/$NOME-primo-dispositivi.txt" | cut -c1-200 ;;
  confronti) bash "$AQUI/prove/confronti.sh" /tmp/lavoro-3cb-sito-${NOME}i $NOME ;;
  *) echo "pezzo sconosciuto: $PEZZO"; exit 2 ;;
esac
