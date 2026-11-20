#!/bin/bash
# Il testo grande e lo zoom a 360x760 sulle pagine che non ho toccato (home, «non ancora», «stato») della partenza P: stesso esame, stesse misure di «installa»;
# serve a dire se i segnali dello zoom (la finestra a 288, 240 e 180 px) sono di «installa» o della cornice e dei componenti comuni.
# Uso: bash testo-confronto.sh <porta>   (un browser: lanciarlo quando il giro finale è finito)
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
export RADICE=/tmp/lavoro-3cb-radice-P
PAGINE=home,non-ancora,stato RIGHE=60 bash "$AQUI/prove/corsa.sh" P-esame-testo-grande-altre "$1" /tmp/lavoro-3cb-sito-P esame-impaginazione.mjs chromium tutti "" 360x760
echo fine
