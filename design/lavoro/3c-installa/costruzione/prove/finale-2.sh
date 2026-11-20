#!/bin/bash
# Il giro finale, parte 2: gli esami dell'impaginazione e dei dispositivi in Chromium sull'albero finale (il nome sta in /tmp/lavoro-3cb-via-libera). Esiti in esiti/.
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
until [ -f /tmp/lavoro-3cb-via-libera ]; do sleep 20; done
NOME=$(cat /tmp/lavoro-3cb-via-libera)
for blocco in chromium-soglie chromium-misure chromium-altezze chromium-dispositivi chromium-testo; do bash "$AQUI/prove/esami.sh" $NOME 8897 $blocco; done
echo fine
