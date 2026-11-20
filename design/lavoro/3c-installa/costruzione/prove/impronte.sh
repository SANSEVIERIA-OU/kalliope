#!/bin/bash
# Le impronte dei file su cui girano le prove: i file di questo incarico (nella copia provata e nell'albero vivo) e gli alberi e i siti interi.
# Uso: RADICE=<copia provata> bash impronte.sh [<sito costruito> …] > esiti/impronte-….txt
R=${RADICE:?la copia provata}; V=/workspace/kalliope
echo "# impronte $(date '+%d/%m/%Y %H:%M:%S')"
echo "## i file di questo incarico, nella copia provata (${R}) e nell'albero vivo (${V}): se le due colonne coincidono la copia è quella viva (primi 16 caratteri di sha256)"
for f in website/installa/index.html website/installa/installa.js website/cornice.js website/componenti.js design-system/token.css design-system/base.css \
         design-system/componenti/scelta-sistema.css design-system/componenti/comando.css design-system/componenti/terminale.css design-system/componenti/installazione.css \
         design-system/componenti/pagina.css design-system/catalogo/catalogo-installa.js design-system/catalogo/catalogo-installa.css design-system/catalogo/index.html \
         design-system/metodo.config.mjs design-system/SISTEMA.md design-system/TOKEN.md tools/site.py tools/test_translations.py website/lingue/site.pot website/lingue/it.po \
         website/index.html website/non-ancora/index.html website/stato/index.html; do
  a=$(sha256sum "$R/$f" | cut -c1-16); b=$(sha256sum "$V/$f" 2>/dev/null | cut -c1-16); echo "$a  $b  $([ "$a" = "$b" ] && echo = || echo DIVERSO)  $f"
done
echo "## la copia provata intera (website, design-system, tools): una sola impronta"
(cd $R && find website design-system tools -type f -not -name '*.pyc' -not -path '*__pycache__*' | sort | xargs sha256sum | sha256sum | cut -c1-32)
echo "## l'albero vivo intero (website, design-system, tools): una sola impronta"
(cd $V && find website design-system tools -type f -not -name '*.pyc' -not -path '*__pycache__*' | sort | xargs sha256sum | sha256sum | cut -c1-32)
for S in "$@"; do echo "## il sito costruito ($S): una sola impronta"; (cd $S && find . -type f | sort | xargs sha256sum | sha256sum | cut -c1-32); done
