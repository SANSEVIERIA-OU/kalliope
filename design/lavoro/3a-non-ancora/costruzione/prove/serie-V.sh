#!/bin/bash
# Serie V: la verifica rapida sull'albero vivo dopo che l'incarico 2 ha toccato di nuovo i file condivisi (barra.css, lingue.css, riunione.css, scena.js, site.py)
# dopo l'istantanea delle prove (01:44): il sito costruito dall'albero vivo, alle misure e negli stati principali, in Chromium
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=${1:-/tmp/lavoro-3ab-sito-vivo-2}
cd "$AQUI/.."
RIGHE=1 RADICE=/workspace/kalliope bash prove/corsa.sh V-esame 8810 $SITO esame-impaginazione.mjs chromium normale non-ancora 390x844,1440x900,844x390,360x640,1366x640,820x1180 | grep -E "uscita|cose da guardare|Tutto pulito"
for m in 1440x900 390x844; do LIMITE=200 bash prove/registra.sh V-stati-$m node prove/stati.mjs $SITO /tmp/lavoro-3ab-V-stati chromium $m ascolto,errore,lento,copia,copia-no,tentativo,tentativo-ridimensiona,tentativo-nascosto; done
for m in 1440x900 390x844; do LIMITE=200 bash prove/registra.sh V-robustezza-$m node prove/robustezza.mjs $SITO /tmp/lavoro-3ab-V-rob chromium $m tastiera-veloce,senza-js,scorrimento,ritorno; done
