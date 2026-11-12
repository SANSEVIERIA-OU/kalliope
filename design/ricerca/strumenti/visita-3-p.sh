#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Scorciatoia del worker visita-3: lancia passo.mjs col posto in uso, senza DISPLAY, e riassume l'uscita.
# Uso: visita-3-p.sh <comando> [args…]   (valuta e avvia/libera/stato: uscita intera)
# L'uscita va in un file (non in una pipe): node tronca a 64 KB lo stdout di una pipe se il processo termina subito.
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
POSTO="${POSTO_V3:-l1:e5de8794}"
PASSO=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts/passo.mjs
case "$1" in
  valuta|avvia|libera|schede|scheda|stato|aspetta) exec env -u DISPLAY -u WAYLAND_DISPLAY node $PASSO "$POSTO" "$@";;
  *) T=$(mktemp /tmp/v3-out.XXXXXX); env -u DISPLAY -u WAYLAND_DISPLAY node $PASSO "$POSTO" "$@" > "$T" 2>&1; python3 -I /workspace/kalliope/design/ricerca/strumenti/visita-3-riassumi.py "${LUNGO:-300}" < "$T"; cp "$T" "/tmp/v3-ultimo.txt";;
esac
