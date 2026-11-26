#!/bin/bash
# Simula un riavvio per gli strumenti: in uno spazio di mount proprio (unshare, senza permessi di amministratore) /tmp è vuoto,
# come dopo un riavvio, e senza altro che env.sh si controlla che i tre motori partano (motori-test.mjs: un suono e due video).
# Non tocca il /tmp vero. Uso: dopo-riavvio.sh
set -euo pipefail
unshare -Urm bash -c '
  mount -t tmpfs tmpfs /tmp
  echo "file in /tmp dentro lo spazio di prova: $(ls -A /tmp | wc -l)"
  env -i HOME="$HOME" PATH="$PATH" bash -c "source /workspace/kalliope/materiali-locali/playwright/env.sh && cd /workspace/kalliope/materiali-locali/playwright && node \$SKILL/scripts/motori-test.mjs" 2>&1 | grep -v Skipping
'
