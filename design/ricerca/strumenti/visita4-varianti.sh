#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Varianti di §7.3 su un riferimento, col posto in $POSTO: testo 200%, zoom 200%, colori forzati (e scuro se richiesto).
# Uso: POSTO=l4:xxxx visita4-varianti.sh <ID> <url> <dy-scorrimento> [scuro]
ID="$1"; URL="$2"; DY="${3:-900}"
V=/workspace/kalliope/design/ricerca/strumenti/visita4-p.sh
P=/workspace/kalliope/design/ricerca/prove/$ID
LET="innerWidth+'x'+innerHeight+' scrollW='+document.documentElement.scrollWidth+' scrollH='+document.documentElement.scrollHeight+' zoomdpr='+devicePixelRatio+' fs='+getComputedStyle(document.documentElement).fontSize+' bodyfs='+getComputedStyle(document.body).fontSize"
for VAR in "carattere200:--carattere=200" "zoom200:--zoom=200" "forzati:--colori-forzati" ${4:+"scuro:--scuro"}; do
  N="${VAR%%:*}"; OPT="${VAR#*:}"
  echo "=== $ID $N"
  $V $ID avvia desktop $P/$N $OPT | tail -1
  LUNGO=100 $V $ID vai "$URL" 3000 | grep "FOTO"
  $V $ID valuta "$LET" | tail -1
  LUNGO=100 $V $ID scorri $DY 900 | grep "FOTO\|^scroll"
done
