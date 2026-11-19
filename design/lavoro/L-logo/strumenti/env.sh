# source env.sh — ambiente delle prove dell'incarico L-1 (nessuna finestra: niente DISPLAY né WAYLAND_DISPLAY)
unset DISPLAY WAYLAND_DISPLAY
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
export SKILL=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator
export L1=/workspace/kalliope/design/lavoro/L-logo
