#!/bin/bash
# Le impronte (sha256) dei file su cui girano le prove. Uso: impronte.sh <nome>  → impronte-<nome>.txt accanto a questo file e una riga di riassunto.
cd /workspace/kalliope || exit 1
OUT="/workspace/kalliope/design/lavoro/1-lingue-sito/impronte-$1.txt"
{
  ls website/index.html website/scena.js website/testi.js website/lingua.js website/lingue.html website/lingue/* website/404.html
  ls design-system/token.css design-system/base.css design-system/componenti/*.css design-system/catalogo/*
  ls tools/site.py tools/translations.py tools/cldr_data.py tools/css_logico.py tools/test_translations.py tools/i18n/*.py tools/data/cldr.json
  ls docs/translating.md docs/releasing.md .github/workflows/ci.yml .github/workflows/pages.yml
} | sort | xargs sha256sum > "$OUT"
echo "$1: $(wc -l < "$OUT") file, impronta complessiva $(sha256sum "$OUT" | cut -c1-16)"
