#!/bin/bash
# Le impronte (sha256) dei file del sito: website/, design-system/ (senza i documenti .md), tools/ (senza __pycache__) di una radice, e in coda l'impronta dell'insieme.
# Uso: impronte.sh <radice> > file
set -euo pipefail
R="${1:?radice}"
cd "$R"
find website design-system tools -type f ! -path '*/__pycache__/*' ! -name '*.md' ! -path 'website/lingue/*.po' -print0 | sort -z | xargs -0 sha256sum
echo "---"
find website/lingue -type f \( -name 'it.po' -o -name 'site.pot' \) -print0 | sort -z | xargs -0 sha256sum
echo "---"
echo "insieme: $(find website design-system tools -type f ! -path '*/__pycache__/*' ! -name '*.md' ! -path 'website/lingue/*.po' -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
