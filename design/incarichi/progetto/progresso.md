# Progresso: scheda del progetto e piano della ricerca (project + research-plan)

Worker: vibe-next:design-build (Sonnet). Incarico: `design/incarichi/progetto.md`. Regole: `design/incarichi/comune.md`.

## Stato

| Unità | Stato | Note |
|---|---|---|
| U0. Lettura di incarico, skill (SKILL, progetto, metodo, riferimenti, confronto, catalogo, scrittura, direzione §1-2, esecuzione) | fatta | |
| U1. Lettura fonti del progetto (README, CHANGELOG, docs, NOTICE, THIRD_PARTY, app.slint, main.rs, engine/audio/download/catalog/settings, metainfo, desktop, icona, LICENSE §2-4, release v0.1-rc.1 via `gh`, campioni voce) | fatta | Discrepanze trovate: vedi «Problemi aperti» |
| U2. `design/progetto.md` | fatta | 549 righe, 10 percorsi (P1-P10), dubbi A,B,E,F,G per il proprietario |
| U3. `design/ricerca/piano.md` (+ `design/ricerca/modello-osservazioni.json`) | fatta | Compiti C1-C14; gruppi A, B (Webby, 10+2 ciascuno) e C (affini non Webby, 4+1); 35 caratteristiche e 20 ambiti fissi (§8); modello controllato con `confronta-riferimenti.mjs --controlla` (uscita 0; copia guastata apposta: uscita 2) |
| U4. Rilettura incrociata | fatta | Nessuna parola di aspetto nella scheda; tabelle regolari; coerenza modello-vocabolario verificata; trovata e corretta l'attestazione di provenienza (assente su rc.1) |

## Ultimo comando
`node <skill>/scripts/confronta-riferimenti.mjs --controlla design/ricerca/modello-osservazioni.json` → «Formato pulito», uscita 0.
Prove temporanee in `/tmp/kalliope-progetto-prova/` (copia guasta). Nessun browser aperto, nessun file cancellato.

## Prossimo passo (coordinatore)
Lanciare i ricercatori A e B (tempo 1, fonti) da `design/ricerca/piano.md` §6; chiedere al proprietario i dubbi A, B, E, F, G di `progetto.md` §12
e i suoi siti di riferimento; riprovare Firefox/WebKit prima della matrice finale.

## Problemi aperti (da riportare al coordinatore)

1. `WebFetch` sul catalogo Webby è stato bloccato da un hook del plugin («delega la ricerca a vibe-next:research»):
   i nomi esatti delle categorie e l'edizione conclusa più recente NON sono stati verificati da me. Il piano li lascia
   ai ricercatori, con i nomi registrati dallo storico della skill (20-21/10/2026) solo come indizio.
2. `design/metodo-capacita.json` (18:29): solo Chromium si è avviato; Firefox ha dato `browserType.launch:` senza
   messaggio e WebKit «Target page, context or browser has been closed». `comune.md` dice «preparati»: da riprovare prima
   di contare su Firefox/WebKit (per le visite basta Chromium; per la matrice finale servono i tre motori).
3. README dice «There is no release yet» ma esiste la prerelease v0.1-rc.1 (pubblicata 12/11/2026 15:57 UTC).
4. README dice voce «52 MB»; CHANGELOG, app e release dicono «circa 53 MB». La somma dei tre file in `catalog.rs` è
   52.974.546 byte (53 MB decimali): 53 è giusto, il README è da correggere (non l'ho toccato).
5. La foto `site/immagini/kalliope-finestra.png` mostra «Senti anche tu» NON selezionato; il codice
   (`Settings::default`) lo imposta SELEZIONATO. Il sito non deve dire quale sia il valore predefinito senza verificarlo.
6. Gli errori del microfono arrivano all'utente in inglese dentro frasi italiane (`crates/mic` → `e.to_string()` in
   `main.rs`: «La voce è pronta, ma PipeWire is not available: …»). Riguarda l'app, non il sito, ma la pagina di aiuto
   dovrà citare il testo vero che la persona vede.
7. Le frasi già dette (30) stanno solo in memoria: si perdono alla chiusura (`main.rs`, `settings.rs` salva solo voce e
   «Senti anche tu»). Va detto con onestà; se sia voluto lo decide il proprietario.
8. L'app, nel dialogo «Informazioni», non rimanda al sito né al repository; il metainfo AppStream punta al repository e
   non ha schermate: il sito sarà il primo posto con un'immagine della finestra (nota per il coordinatore).
9. La v0.1-rc.1 NON ha l'attestazione di provenienza (`gh api repos/SANSEVIERIA-OU/kalliope/attestations/sha256:21718a38…f1b4` → 404,
   12/11/2026): fu pubblicata col repository privato. Il sito non deve citare `gh attestation verify` come disponibile per questa
   versione; vale per le release future (`docs/releasing.md`).
