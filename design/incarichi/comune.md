# Regole comuni a ogni incarico del sito di Kalliope

- Skill del metodo: `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator`
  (chiamata `<skill>` sotto). Leggi `SKILL.md` e i riferimenti che il tuo incarico indica.
- Progetto: `/workspace/kalliope` (repository pubblico SANSEVIERIA-OU/kalliope). Lavoro di design in
  `/workspace/kalliope/design/`, sito pubblicato in `/workspace/kalliope/site/`.
- Lingua: documenti di lavoro e testi del sito in italiano.
- **Schermo: `DISPLAY=:0` e `WAYLAND_DISPLAY=wayland-1` sono il desktop VERO dell'utente, montato in questo
  ambiente. Non aprire mai finestre lì.** Ogni browser gira senza finestra; lancia ogni comando con
  `env -u DISPLAY -u WAYLAND_DISPLAY …`. Non usare la modalità `finestra` di `passo.mjs`. Se un sito chiede una
  verifica anti-bot, registra schermata e limite e vai avanti.
- Playwright: `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs` (1.60.0).
  Firefox e WebKit sono già preparati in `/tmp/metodo-motori` (prepara-motori.sh). **Esporta anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`**: senza, Playwright rifiuta Firefox perché non vede libgtk-3, che sta
  nella cartella preparata (verificato 12/11 alle 20:10: Firefox 150.0.2 parte e disegna). Capacità misurata in
  `design/metodo-capacita.json` (Chromium fino a 24 insieme, WebKit fino a 7).
- Non cancellare file, non usare comandi che chiedono conferma, non avviare lavori in background da aspettare,
  non fare commit né push (li fa il coordinatore), non creare altri agenti.
- Tieni `progresso.md` nella tua area e aggiornalo a ogni unità finita (fatto, in corso, prossimo passo,
  ultimo comando, problemi). Scrivi i risultati su file mentre li trovi.
- Il progetto ha codebase separate dalla sorella Kalipso (`/workspace/kalipso`, sito sansevieria-ou.github.io/kalipso):
  non copiarne codice, identità o meccanismi. Si può leggere per sapere che esiste, non come modello.
