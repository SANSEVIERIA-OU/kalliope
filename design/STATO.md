# Stato del lavoro: sito di Kalliope (GitHub Pages)

Richiesta dell'utente (12/11/2026): «rendiamo la repo pubblica e fai il sito su github pages».
Metodo: skill vibe-next design-system-generator 0.45.0.

| Fase (metodo.md) | Stato | Worker | Inizio → fine | Esito / prossimo passo |
|---|---|---|---|---|
| 0. Repository pubblico | fatto | coordinatore | 12/11 18:25 | storia controllata (nessun segreto), visibilità PUBLIC, ramo ci-release eliminato |
| Materiale vero | fatto | coordinatore | 12/11 18:30 → 18:34 | 6 campioni MP3 (Whisper 2,2%), foto della finestra |
| Capacità macchina | fatto | coordinatore | 12/11 18:27 | chromium fino a 24 insieme; firefox/webkit preparati in /tmp/metodo-motori |
| 1. Scheda del progetto + piano ricerca | fatto | design-build (sonnet) | 12/11 18:36 → 18:50 (14 min, 44 comandi, 224k token) | progetto.md (10 percorsi), ricerca/piano.md (14 compiti, 3 gruppi). Nomi delle categorie Webby non verificati: un hook ha riservato la lettura del catalogo al ruolo di ricerca |
| 2. Fonti (vincitori Webby + affini) | fatto | research ×3 (haiku): A, B, C | 12/11 18:52 → 19:15 (18-23 min ciascuno; 250k, 250k, 338k token) | A: 18 Webby 2026 verificati (`incarichi/ricerca-a/fonti-a.json`), B: 20 (`ricerca/fonti-b.md`), C: 5 prodotti + 5 pagine italiane (`ricerca/fonti-c.md`). Scelta: `ricerca/selezione.md` (9 Webby + 4 affini + 4 pagine di registro) |
| 2. Visite e schede | fatto | design-visual ×4 (sonnet): R01-R03, R04-R06, R20-R22, R50-R53+G01-G04 | 12/11 19:05 → 20:30 (45, 55, 49, 64 min; 484k, 569k, 492k, 639k token) | 13 schede, osservazioni valide (--controlla uscita 0), inventari del movimento, registro italiano. Solo Chromium, senza finestra (nessun Chrome MCP). Limiti: R06 WebGL a 4-5 fps; telefono 390×844 solo con script; nessun audio ascoltato |
| 3. Confronto | fatto | design-build (sonnet) | 12/11 20:20 → 20:30 | 13 riferimenti: 0 identici, 16 meccanismi comuni, 432 varianti; `confronto.{json,md}`, `copertura.md` (C4 2/3, C2 con testo accanto 1, C7 ausili veri mai osservati) |
| 4. Direzione | fatto | design-build (sonnet) | 12/11 20:30 → 20:35 | «Carta e voce»: cammino a pagine per compito (scartate: pagina narrata, porte per persona); ambizione A1-A5; controlla-direzione uscita 0, 73 decisioni, copertura 432/432 |
| 5. Primo percorso completo (cancello) | in correzione | design-build (sonnet) → design-visual (sonnet) → design-build | 20:36 → 22:06 costruzione (91 min, 687k token); 22:15 → 22:45 revisione (28 min, 355k); 22:50 → correzioni | 8 pagine + catalogo; revisione: 2 bloccanti (Aiuto senza risultato, telefono), 9 importanti, riconoscibilità media; il coordinatore ha verificato i fatti (3 correzioni) |
| 6. Prove complete (15 dispositivi × 3 motori) | da fare, dopo l'approvazione | | | |
| 7. Pubblicazione su Pages | da fare | coordinatore | | |

Correzioni al prodotto nate dalla scheda (coordinatore, 12/11): README «52 MB» → 53 MB; errori del microfono spiegati
in italiano e avvisi che non bloccano la scrittura (commit 3701c7b); foto della finestra rifatta con le impostazioni
iniziali («Senti anche tu» acceso). Restano: le frasi già dette non si conservano alla chiusura (scelta di privacy
da confermare).

Motori: WebKit si avvia dopo prepara-motori.sh; Firefox si avvia solo con PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
(lib/comune.mjs della skill lo mette per WebKit ma non per Firefox: miglioramento da proporre allo strumento).

Tempo perso: le visite R01-R06 e R20-R22 sono state fatte solo in Chromium perché Firefox e WebKit sembravano guasti
(vedi sopra): per la ricerca basta, per la matrice finale servono tutti e tre.
