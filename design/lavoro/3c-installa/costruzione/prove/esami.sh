#!/bin/bash
# Gli esami d'impaginazione e dei dispositivi di «installa» sull'albero provato: soglie, altezze, misure dei dispositivi e finestre basse, dispositivi, testo grande, Firefox e WebKit.
# Uso: bash esami.sh <nome-albero> <porta> <blocco>   blocchi: chromium-soglie, chromium-altezze, chromium-misure, chromium-dispositivi, chromium-testo, motori (Firefox e WebKit: esame e dispositivi)
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
NOME=$1; PORTA=$2; BLOCCO=$3
export RADICE=/tmp/lavoro-3cb-radice-$NOME; SITO=/tmp/lavoro-3cb-sito-$NOME
C() { bash "$AQUI/prove/corsa.sh" "$@"; }
source /workspace/kalliope/materiali-locali/playwright/env.sh
DISP="390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900"
EXTRA="1366x640,1280x720,1024x768,390x667,360x640,320x568,1920x1080"
case "$BLOCCO" in
  chromium-soglie)
    # Con un indirizzo `soglie.mjs` ignora --pagina e legge la pagina di quell'indirizzo (la radice: la scelta della lingua, o la home): le soglie vanno chieste per l'indirizzo della pagina
    # (scoperto il 20/11/2026: le liste di H5 e di `H6-soglie.txt` erano quelle della radice, non di «installa»)
    node "$AQUI/prove/con-server.mjs" "$PORTA=$SITO" -- node "$SKILL/scripts/soglie.mjs" "http://127.0.0.1:$PORTA/it/installa/" --altezza 900 > "$AQUI/esiti/$NOME-soglie-installa.txt" 2>&1
    cat "$AQUI/esiti/$NOME-soglie-installa.txt" | cut -c1-200
    MIS=$(awk '/^Misure da provare/{getline; print; exit}' "$AQUI/esiti/$NOME-soglie-installa.txt" | tr -d ' ')
    echo "misure: $MIS" | tee "$AQUI/esiti/$NOME-soglie-installa-misure.txt"
    [ -z "$MIS" ] && { echo "nessuna misura letta da soglie.mjs: vedi esiti/$NOME-soglie-installa.txt"; exit 3; }
    RIGHE=60 C "$NOME-esame-soglie-installa" "$PORTA" "$SITO" esame-impaginazione.mjs chromium normale installa "$MIS" ;;
  chromium-altezze)
    for w in 390 844 1366 1440; do M=""; for h in 500 501 699 700 759 760 799 800 802 803 819 820; do M="$M,${w}x$h"; done
      RIGHE=40 C "$NOME-esame-altezze-$w" "$PORTA" "$SITO" esame-impaginazione.mjs chromium normale installa "${M#,}"; done ;;
  chromium-misure)
    RIGHE=60 C "$NOME-esame-misure" "$PORTA" "$SITO" esame-impaginazione.mjs chromium normale installa "$DISP,$EXTRA" ;;
  chromium-dispositivi)
    RIGHE=60 C "$NOME-dispositivi-chromium" "$PORTA" "$SITO" dispositivi-qa.mjs chromium installa ;;
  chromium-testo)
    PAGINE=installa,installa-frase,installa-copia-non-riuscita,installa-archivio RIGHE=60 C "$NOME-esame-testo-grande" "$PORTA" "$SITO" esame-impaginazione.mjs chromium tutti installa 360x760,820x1180,1440x900 ;;
  motori)
    for m in firefox webkit; do
      RIGHE=40 C "$NOME-esame-$m" "$PORTA" "$SITO" esame-impaginazione.mjs $m normale installa 390x844,1440x900,844x390,360x640
      for d in "Telefono" "Telefono girato" "Computer"; do RIGHE=20 C "$NOME-dispositivi-$m-${d// /-}" "$PORTA" "$SITO" dispositivi-qa.mjs $m installa "$d"; done
    done ;;
esac
