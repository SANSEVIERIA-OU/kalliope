#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# One sheet per group of languages from the photos of foto.sh: two rows per language (kalliope, a keyword), labelled by code.
# fogli.sh PHOTOS OUT "de fr …" NAME
set -u
F=$(realpath "$1"); OUT=$(realpath -m "$2"); LANGS="$3"; N="$4"
mkdir -p "$OUT"
T=$(mktemp -d)
args=()
for c in $LANGS; do
  for v in nome cerca; do
    convert "$F/$c-$v.png" -crop 1000x92+50+20 +repage "$T/$c-$v.png"
    args+=(-label "$c · $v" "$T/$c-$v.png")
  done
done
montage "${args[@]}" -tile 2x -geometry +6+6 -pointsize 18 -background '#202020' -fill white "$OUT/$N.png"
rm -rf "$T"
echo "$OUT/$N.png"
