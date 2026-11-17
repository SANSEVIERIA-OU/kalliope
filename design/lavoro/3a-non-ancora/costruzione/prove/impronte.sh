#!/bin/bash
# Le impronte dei file su cui girano le prove: i file di questo incarico (nella copia di lavoro e nell'albero vivo) e l'intero sito costruito.
# Uso: bash impronte.sh <sito-costruito> > esiti/impronte-….txt
R=${RADICE:-/tmp/lavoro-3ab-lavoro/radice-F}; V=/workspace/kalliope; SITO=${1:-}
echo "# impronte $(date '+%d/%m/%Y %H:%M:%S')"
echo "## i file di questo incarico, nella copia di lavoro (${R}) e nell'albero vivo (${V}): se le due colonne coincidono la copia è quella viva"
for f in website/non-ancora/index.html website/non-ancora/non-ancora.js website/cornice.js design-system/componenti/pagina.css design-system/componenti/riunione-ferma.css \
         design-system/componenti/strada-ferma.css design-system/componenti/versioni.css design-system/catalogo/catalogo-pagine.js design-system/catalogo/catalogo-pagine.css \
         design-system/metodo.config.mjs website/lingue/site.pot website/lingue/it.po; do
  a=$(sha256sum "$R/$f" | cut -c1-16); b=$(sha256sum "$V/$f" 2>/dev/null | cut -c1-16); echo "$a  $b  $([ "$a" = "$b" ] && echo = || echo DIVERSO)  $f"
done
echo "## la copia di lavoro intera (website, design-system, tools): una sola impronta"
(cd $R && find website design-system tools -type f -not -name '*.pyc' | sort | xargs sha256sum | sha256sum | cut -c1-32)
[ -n "$SITO" ] && { echo "## il sito costruito ($SITO): una sola impronta"; (cd $SITO && find . -type f | sort | xargs sha256sum | sha256sum | cut -c1-32); }
