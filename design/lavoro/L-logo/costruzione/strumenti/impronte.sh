#!/usr/bin/env bash
# Le impronte dei file del lavoro L-3: per ogni file modificato o nuovo rispetto a HEAD, l'identificatore del file in HEAD (git, «-» se nuovo) e lo sha256 di adesso.
# Si registrano prima e dopo l'ultima prova, per dire che le prove sono girate sugli stessi file finali. Uso: impronte.sh > uscita.txt
set -euo pipefail
cd "$(dirname "$0")/../../../../.."
{
    git diff --name-only --diff-filter=M HEAD
    git ls-files --others --exclude-standard
} | grep -v -e '^design/STATO.md$' -e '^design/lavoro/L-logo/costruzione/\(foto\|sequenze\|confronto\|impronte\|progresso\)' | sort | while read -r f; do
    [ -f "$f" ] || continue
    old=$(git rev-parse -q --verify "HEAD:$f" 2>/dev/null || echo '-')
    printf '%s  %s  %s\n' "$(sha256sum "$f" | cut -d' ' -f1)" "${old:0:12}" "$f"
done
