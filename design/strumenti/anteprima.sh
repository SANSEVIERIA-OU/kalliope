#!/bin/sh
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Costruisce il sito con tools/site.py in una cartella nuova (site.py non scrive in site/) e stampa il percorso della cartella da servire.
# Uso: sh design/strumenti/anteprima.sh NOME   -> /tmp/kalliope-anteprima/NOME  (contiene kalliope/, come sotto /kalliope/ su Pages)
# Serve un file con la risposta dell'API delle release: /tmp/kalliope-lavoro/releases.json (gh api repos/SANSEVIERIA-OU/kalliope/releases)
set -e
dest=/tmp/kalliope-anteprima/$1
[ -e "$dest" ] && { echo "esiste già: $dest (scegli un altro nome)" >&2; exit 2; }
env -u DISPLAY -u WAYLAND_DISPLAY python3 -I /workspace/kalliope/tools/site.py --out "$dest/kalliope" --release-json /tmp/kalliope-lavoro/releases.json >&2
echo "$dest"
