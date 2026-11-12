#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Estrae il testo (innerText) di un selettore con `passo.mjs valuta`, a pezzi da 5000 caratteri (valuta taglia a 6000),
# e lo salva in un file. Uso: POSTO=<posto:segno> visita2-testo.sh <selettore> <file-uscita>
SK=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
SEL="$1"; OUT="$2"; cd "$SK"
LEN=$(env -u DISPLAY -u WAYLAND_DISPLAY node passo.mjs "$POSTO" valuta "document.querySelector('$SEL').innerText.length" 2>&1 | grep -E '^[0-9]+$' | tail -1)
: > "$OUT"
I=0
while [ "$I" -lt "$LEN" ]; do
  env -u DISPLAY -u WAYLAND_DISPLAY node passo.mjs "$POSTO" valuta "document.querySelector('$SEL').innerText.slice($I,$((I+5000)))" 2>&1 | grep '^"' | head -1 | python3 -c "import sys,json; sys.stdout.write(json.loads(sys.stdin.read()))" >> "$OUT"
  I=$((I+5000))
done
echo "lunghezza dichiarata $LEN, scritti $(wc -c < "$OUT") byte in $OUT"
