# source env.sh — l'ambiente delle prove (Playwright, Firefox senza librerie di sistema). Incarico 2-f: cartelle /tmp/lavoro-2f-*, porte 8890-8899.
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
export LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu
export P2F=/workspace/kalliope/design/lavoro/2-3a-correzioni/prove
export SKILL=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator
export PORTA_2F=${PORTA_2F:-8891}   # i programmi di prova che avviano da sé il server lo mettono qui (8890-8899 sono le mie porte; uno alla volta)
