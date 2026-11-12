# Progresso visita-3 (R20 Ottografie, R21 Lonely Planet Venezia, R22 Searching for Birds)

Ruolo: design-visual. Modello: l'ambiente dichiara Sonnet 5.5 (`claude-sonnet-5-5`); **non verificato a runtime** (nessun metadato nativo esposto al worker).
Strumento: `passo.mjs` posto `leggero` (l1), senza finestra, Chromium 148; nessun Chrome MCP in questo host. Posto liberato alle 19:32 (`liberato l1`).
Prove con script Playwright (Chromium) a posto libero: `design/ricerca/strumenti/visita-3-script.mjs` (+ `-misure-extra`, `-meta`, `-404-R22`).
Inizio 12/11/2026 19:10 UTC, fine 19:5x UTC.

## Stato: FATTO (3 riferimenti su 3)
| ID | Scheda | Osservazioni (controllate) | Movimento | Prove |
|---|---|---|---|---|
| R20 | `ricerca/schede/R20.md` | `ricerca/osservazioni/R20.json` (51 righe, `--controlla` pulito) | `ricerca/movimento/R20.md` (15 effetti) | `ricerca/prove/R20/` |
| R21 | `ricerca/schede/R21.md` | `ricerca/osservazioni/R21.json` (44 righe, pulito) | `ricerca/movimento/R21.md` (8 voci) | `ricerca/prove/R21/` |
| R22 | `ricerca/schede/R22.md` | `ricerca/osservazioni/R22.json` (43 righe, pulito) | `ricerca/movimento/R22.md` (11 voci) | `ricerca/prove/R22/` |

Ogni file citato in `evidenze` esiste (`strumenti/visita-3-prove-esistono.py R20 R21 R22`: 0 mancanti). Le osservazioni sono generate da `strumenti/visita-3-osservazioni/R2x.py`.

## Ultimo comando
`node confronta-riferimenti.mjs --controlla osservazioni/R2{0,1,2}.json` → «Formato pulito» ×3.

## Avvisi dell'evidenza (da riportare)
- `⚠ OROLOGIO 0,22×` sulla prima foto dell'arrivo di R20 (intro pesante a freddo): da quel gesto nessun tempo; dopo, orologio attendibile.
- Registrazione del movimento troncata a ~17300-17900 bersagli su ogni caricamento di R22 (mutazioni dei primi secondi incomplete).
- Macchina condivisa (carico fino a 16 su 12 CPU): i tempi della rete lenta sono indicativi.
- `passo.mjs mobile` è 430×932, non 390×844: il 390×844 è rifatto dallo script (R22 risulta 391×847).
- Nessun Chrome MCP; Firefox/WebKit non provati (non si avviano); rete lenta e stampa solo in Chromium; PDF di stampa non rasterizzabile (manca Ghostscript).

## Problemi aperti / lacune principali
- R20: interruzioni delle transizioni non provate; intro a telefono non misurata; foto a 0,8 s in rete lenta non salvata; clic dei link senza JS non provato.
- R21: ricerca senza risultati e finestra del consenso non provate; durata di «Share» non misurata.
- R22: assistente IA non interrogato (invia testo a un servizio esterno); clic sull'uccello non provato; mutazioni dell'arrivo troncate.
- Regole @media lette solo al primo livello dei fogli (non dentro @layer).
