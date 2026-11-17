# source env.sh — ambiente delle prove dell'incarico 3b (nessuna finestra: niente DISPLAY né WAYLAND_DISPLAY)
unset DISPLAY WAYLAND_DISPLAY
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
export LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
export SKILL=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator
