#!/bin/bash
# Il giro finale, parte 3, sui file H: la robustezza e gli esami in Firefox e WebKit. Esiti in esiti/.
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
until [ -f /tmp/lavoro-3cb-via-libera ]; do sleep 20; done
NOME=$(cat /tmp/lavoro-3cb-via-libera)   # l'albero finale da provare (una cartella /tmp/lavoro-3cb-radice-<NOME>)
SENZA_LENTA="primo,sistema,ancore,tastiera-veloce,frasi,copia,senza-js,senza-stili,senza-token,ridotto,scorrimento,secondo-piano,ritorno,ricarica,a-meta"
bash "$AQUI/prove/giro.sh" $NOME 8898 firefox:1440x900:tutti firefox:390x844:tutti webkit:1440x900:tutti webkit:390x844:tutti firefox:844x390:primo,sistema,frasi,copia,ridotto,ricarica webkit:844x390:primo,sistema,frasi,copia,ridotto,ricarica
bash "$AQUI/prove/esami.sh" $NOME 8897 motori
echo fine
