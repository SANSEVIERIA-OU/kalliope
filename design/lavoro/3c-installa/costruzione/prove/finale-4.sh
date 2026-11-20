#!/bin/bash
# Il giro finale, parte 4, sui file H: le lingue (esame, foto, il primo schermo), il primo schermo ai dispositivi, il confronto con la scelta, le foto della pagina. Esiti in esiti/.
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
until [ -f /tmp/lavoro-3cb-via-libera ]; do sleep 20; done
NOME=$(cat /tmp/lavoro-3cb-via-libera)   # l'albero finale da provare (una cartella /tmp/lavoro-3cb-radice-<NOME>)
source /workspace/kalliope-playwright/env.sh
export RADICE=/tmp/lavoro-3cb-radice-$NOME
H=/tmp/lavoro-3cb-sito-$NOME
# l'esame in ogni lingua (config-lingue.mjs): a tre misure, e alle misure strette e basse per le lingue che le mettono più alla prova
for L in enXA arXB ar ur hi bn zh el de fi bg; do
  MIS=390x844,1440x900,844x390; case $L in enXA|arXB|ar|ur) MIS=$MIS,326x326,1366x640;; esac
  CONFIG=$AQUI/prove/config-lingue.mjs RIGHE=30 bash "$AQUI/prove/corsa.sh" "$NOME-lingue-$L" 8897 $H esame-impaginazione.mjs chromium normale "_${L}_in" "$MIS"
done
node "$AQUI/prove/con-server.mjs" 8896=$H -- node "$AQUI/prove/primo-lingue.mjs" http://127.0.0.1:8896/ it,de,fi,el,bg,ar,ur,hi,bn,zh,en-XA,ar-XB 1440x900,1366x640,1280x720,1024x768,844x390,390x667,360x640 > "$AQUI/esiti/$NOME-primo-lingue.txt" 2>&1
for voce in "en-XA 1366x640" "en-XA 1280x720" "ar-XB 1024x768" "ar-XB 1366x640" "ar 844x390" "ur 1366x640"; do set -- $voce
  F="$AQUI/esiti/robustezza-$NOME-primo-$1-$2.txt"
  { echo "# robustezza · $NOME · primo e stabile in $1 · chromium $2 · $(date '+%d/%m/%Y %H:%M')"; PORTA=8896 timeout 900 node "$AQUI/prove/robustezza.mjs" $H /tmp/lavoro-3cb-rob-$NOME-lingue chromium $2 primo,stabile --lingua=$1 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
  echo "primo $1 $2: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
done
node "$AQUI/prove/foto-lingue.mjs" $H "$AQUI/foto/lingue" 8896 en-XA,ar-XB,ar,ur 390x844,1440x900 > "$AQUI/esiti/$NOME-foto-lingue.txt" 2>&1
node "$AQUI/prove/foto-lingue.mjs" $H /tmp/lavoro-3cb-foto-lingue-altre 8896 de,fi,el,bg,hi,bn,zh 390x844,1440x900 > "$AQUI/esiti/$NOME-foto-lingue-altre.txt" 2>&1
# la robustezza da destra a sinistra: l'arabo e l'urdu del sito di prova (i testi di «installa» vi restano in italiano: si provano lo specchio, le frecce, i comandi da sinistra a destra)
for L in ar ur; do for M in 1440x900 390x844; do
  F="$AQUI/esiti/robustezza-$NOME-$L-rtl-$M.txt"
  { echo "# robustezza · $NOME · $L da destra a sinistra · chromium $M · $(date '+%d/%m/%Y %H:%M')"; PORTA=8896 timeout 1700 node "$AQUI/prove/robustezza.mjs" $H /tmp/lavoro-3cb-rob-$NOME-rtl chromium $M sistema,tastiera-veloce,frasi,copia,ridotto,senza-js --percorso=$L/installa/ --rtl 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$F"
  echo "rtl $L $M: $(grep -c '^ok' "$F") ok, $(grep -c '^NO' "$F") NO"
done; done
bash "$AQUI/prove/primo-dispositivi.sh" $NOME 8896 > "$AQUI/esiti/$NOME-primo-dispositivi.txt" 2>&1
bash "$AQUI/prove/confronti.sh" /tmp/lavoro-3cb-sito-${NOME}i $NOME > /tmp/lavoro-3cb-confronti.txt 2>&1
echo fine
