#!/bin/bash
# Serie J: le pseudo-lingue en-XA (testo +40%) e ar-XB (da destra a sinistra), una lingua con un .po completo
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
cd "$AQUI/.."
for L in en-XA ar-XB; do PSEUDO=$L CONFIG=$PWD/config-pseudo.mjs RIGHE=1 bash prove/corsa.sh F-pseudo-esame-$L 8810 $SITO esame-impaginazione.mjs chromium normale non-ancora 390x844,1440x900,844x390,360x640,1366x640 | grep -E "uscita|cose da guardare|Tutto pulito"; done
bash prove/registra.sh F-pseudo-testi-en-XA node prove/pseudo-testi.mjs $SITO en-XA
python3 -I prove/prova-lingua.py /tmp/lavoro-3ab-lavoro/radice-F /tmp/lavoro-3ab-sito-lingue-G de,ar > esiti/F-lingua-completa.txt 2>&1; tail -4 esiti/F-lingua-completa.txt | cut -c1-200
