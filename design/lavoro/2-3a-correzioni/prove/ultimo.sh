#!/bin/bash
# Gli ultimi pezzi per motore: la copia di «prima» di L1 (suona, quattro lingue) e di L2 (tu), poi finale.sh. Uso: PORTA_2F=<porta> bash ultimo.sh <motore>
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI"; source ./env.sh; M=$1; PR=/tmp/lavoro-2f-sito-prima-10
if [ "$M" != firefox ]; then
  for l in it ar ur en-XA; do LIMITE=250 RIGHE=1 COL=200 bash registra.sh suona-$l-$M-prima node suona-basso.mjs $PR /tmp/lavoro-2f-lavoro/sb-$l-$M-prima $M 326x326,844x390,915x412,360x640,1366x640 suona --percorso=$l/non-ancora/ --senza-foto; done
fi
LIMITE=560 RIGHE=2 bash registra.sh tu-$M-prima node tu-misure.mjs $PR $M it,ar,ur,de,fi,el,bg,hi,bn,zh,en-XA,ar-XB 844x390,915x412,761x500,1440x900,326x326,390x844 --poco=2
bash finale.sh $M
echo "== fine ultimo $M"
