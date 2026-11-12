#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Affianca N foto in un'immagine sola per la revisione (ImageMagick, nessun browser).
# Uso: [RID=60] visita4-foglio.sh <uscita.jpg> <foto1> <foto2> ...   (RID = percentuale di riduzione, default 100)
OUT="$1"; shift
env -u DISPLAY -u WAYLAND_DISPLAY convert "$@" -resize "${RID:-100}%" -background '#777' -splice 6x0 +append -quality 85 "$OUT"
identify -format '%wx%h\n' "$OUT"
