#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# visita-3-foglio.sh <uscita.jpg> <colonne> <larghezza-cella> <foto…>  → foglio di contatto con ImageMagick (nessun browser)
OUT="$1"; COL="$2"; W="$3"; shift 3
env -u DISPLAY -u WAYLAND_DISPLAY montage "$@" -tile ${COL}x -geometry ${W}x+4+4 -background '#888' -label '%f' -pointsize 11 "$OUT"
