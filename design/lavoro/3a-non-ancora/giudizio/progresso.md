# Progresso · incarico 3a-g (giudizio della pagina «non ancora»)

Ruolo: design-judge. Area: `design/lavoro/3a-non-ancora/giudizio/`. Prove: `prove/` (copie scelte da `/tmp/lavoro-3ag-*`).

**Stato: consegnato** (16/11/2026, notte). Esito: nessun bloccante, 6 importanti, 8 minori (`GIUDIZIO.md`).

## Fatto

- Letti `CLAUDE.md`, `design/lavoro/STATO.md`, la skill (`giudizio.md` intero, `direzione.md` §5 e §6), `progetto.md`
  (§0, §1.4, §5–§10, P6, §12).
- Sito costruito in `/tmp/lavoro-3ag-sito` (alle 23:04); sito del commit HEAD (la home scelta) in `/tmp/lavoro-3ag-head/`.
- Registrati da me, prima di leggere qualunque nota: arrivo (anche fitto, 1,8–10 s), scorrimento intero e gesto «Ascolta
  Giulia» a 1440×900 e 390×844 (`prove/sequenze/`); strada e versioni fotogramma per fotogramma (`prove/strada/`); la
  home, arrivo e scorrimento.
- Percorso P6: tastiera, telefono (menu, comandi), senza JavaScript, script, audio, `tempi.json`, caratteri e CSS
  bloccati, movimento ridotto (`prove/percorso/`, `prove/robustezza/`); Firefox; vista `dir=rtl`. WebKit non parte qui.
- Larghezze dalle soglie e schermi bassi (`prove/larghezze/`).
- Coppie con R01, R03, R05 e con la home, nei due versi, primo schermo e sotto (`prove/coppie/`).
- `confronta-scelta.mjs` sulla home (HEAD contro adesso, y 0, 1800, 3600): cambiano solo «Italiano» e il piede delle
  lingue (incarico 1). `controlla-sorgenti.mjs`: verde. Catalogo aperto: i componenti nuovi non ci sono.
- `GIUDIZIO.md` scritto guardando; poi lette le note di chi ha reso e scritta la sezione sulla loro corrispondenza;
  riassunto per il proprietario.

## In corso

- Niente.

## Prossimo passo

- Correzioni (direzione: I3, I5, I6; contenuti: I1, I2 con chi coordina; costruzione: I4 e minori), poi secondo sguardo.

## Ultimo comando

- `node sequenza.mjs /tmp/lavoro-3ag-sito /tmp/lavoro-3ag-seq/arrivo-fitto --pagina it/non-ancora/index.html --misure 1440x900 --istanti 1.8,…,10 --senza-video`

## Problemi aperti

- La porta 8799 è occupata da qualcun altro: ho usato 8811 e 8812.
- Nessuna richiesta esterna fatta: il feed `releases.atom` non l'ho riaperto (l'autore l'ha verificato).
- Dopo la mia costruzione l'incarico 1 ha cambiato `tools/site.py`, `scena.js`, `SISTEMA.md` (la pagina non usa
  `scena.js`).
