# Progresso: incarico ricerca-c (fonti Gruppo C e registro italiano)

Data: 12/11/2026 · Ruolo: vibe-next:research (raccolta fonti, senza visita visiva)

## Stato: completato (tempo 1), in attesa di revisione del coordinatore
- Risultato: `design/ricerca/fonti-c.md` (prodotti, pagine italiane, non trovati, categorie, conflitti, lacune, appendici A e B con tutti gli URL).
- Prodotti verificati: 4 primari (Proloquo, Grid, Text-to-Mic, Voiceitt) più 1 riserva (Predictable). TD Snap non verificato (HTTP 429 su tre host). Zip Speech non verificato (verifica JavaScript su AMO).
- Pagine italiane aperte: AISLA, AILAR, A.I.T.A. Umbria, Vivavoce, FLI (professionale). Guida AISLA CAA (PDF) scaricata ma non letta (nessun estrattore di testo).
- Ricerche: 18 query web; 280 URL distinti, tutti interrogati via HTTP (curl) o letti via WebFetch quando citati; esiti in appendice A.

## Cronologia delle esecuzioni HTTP (cartelle run-http-*)
- run-http-01: esecuzione superata (parser difettoso). Usare run-http-01b.
- run-http-01b, 02, 03a, 03b, 04a, 05: esecuzioni valide (66, 72, 41, 40, 37, 23 URL).
- run-http-03, run-http-04, run-http-04b: cartelle vuote create per errore, non usate.

## Vincoli rispettati
- Nessuna finestra sul DISPLAY dell'utente; nessun browser grafico; nessun passo.mjs in modalità finestra.
- Nessun file cancellato; nessun commit, nessun push; nessun agente creato.
- Non letti di proposito: ricerca-a.md, ricerca-b.md, fonti-b.md, selezione.md (liste degli altri gruppi).

## Problemi aperti (per il coordinatore)
- Browser interattivo (Chrome MCP) non disponibile in questa sessione: TD Snap e Zip Speech restano non verificati; il ruolo visivo dovrà riaprirli.
- Il criterio «prova della vittoria» dell'incarico non si applica al gruppo C (piano §4): ogni prodotto è registrato come «non Webby».
- Vocable AAC (Webby 2021 winner, 2023 nominee) e Proloquo2Go (Webby 2013 honoree): segnalati per deduplica con i gruppi A e B.
- Lacune: disartria non cercata; sito nazionale A.I.T.A. e associazione balbuzie non trovati; AILO non trovato.
- Conflitti di fonte elencati in fonti-c.md §8 (TD Snap iPadOS, Voiceitt registrazioni e Teams, Predictable switch e editore).
