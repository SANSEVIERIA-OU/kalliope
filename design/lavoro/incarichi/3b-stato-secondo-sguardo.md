# Incarico 3b-s · Il secondo sguardo del giudice: la pagina «stato»

- **Attività**: `direction-judgment`, il secondo sguardo (skill `design-system-generator`, `references/giudizio.md`),
  ruolo **design-judge**. Non hai reso né costruito nulla di ciò che guardi.
- **Area tua**: `design/lavoro/3b-stato/secondo-sguardo/` (`GIUDIZIO.md` scritto mentre procedi, e `progresso.md`).
- **Che cosa guardi**: la pagina «stato» (`website/stato/`) al commit `61b6cec`. La sua storia: resa dalla direzione
  (`b456308`), giudicata (`3b-stato/giudizio/GIUDIZIO.md`: I1–I6, M1–M12), corretta dalla direzione (`c8d2aa3`, sezione
  «Correzione dopo il giudizio» di `3b-stato/progresso.md`), completata dalla costruzione (`61b6cec`, note in
  `3b-stato/costruzione/progresso.md`). Il catalogo vivo ha ora la sezione «Pagina «stato»» (`design-system/catalogo/`).

Dopo di te la pagina va al proprietario.

## Il contesto

La direzione è la 2 «Alla pari, in riunione», scelta dal proprietario (`design/direzione-2/D2.md`). La home
(`website/index.html`) e «non ancora» (`website/non-ancora/`, già mostrata al proprietario) sono il termine di confronto:
«stato» usa la stessa cornice. Il sito deve poter ricevere 30 lingue, comprese arabo e urdu da destra a sinistra; le
traduzioni di prova coprono solo la home, quindi in «stato» il testo resta in italiano anche nelle altre lingue, ed è voluto
(il testo più lungo lo provano le pseudo-lingue en-XA e ar-XB). I testi verranno riscritti da capo: non giudicare la
scrittura, ma sì se la pagina inventa funzioni, date o promesse che il programma non ha (`design/progetto.md`). Due
decisioni del proprietario di oggi (17/11/2026) che la pagina deve rispettare: Kalliope è solo per il computer, e il sito
non dice «non ancora» per il telefono; la voce di chi usa Kalliope arriverà, ma oggi il programma non ce l'ha e la pagina
non deve prometterla.

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` (il secondo sguardo, «La pagina intera», il riassunto per il proprietario),
   `references/presidi.md`.
2. **Guarda prima di leggere.** Costruisci da una copia del commit, non dalla cartella di lavoro:
   `mkdir -p /tmp/lavoro-3bs-radice && git -C /workspace/kalliope archive 61b6cec | tar -x -C /tmp/lavoro-3bs-radice`.
   - Il sito vero (solo italiano): `python3 -I /tmp/lavoro-3bs-radice/tools/site.py --out /tmp/lavoro-3bs-sito`.
   - Il sito a dieci lingue: copia `design/lavoro/2-lingue-aspetto/prova-lingue/*.po` della copia in `website/lingue/`
     della copia, poi costruisci in un'altra cartella; per le pseudo-lingue aggiungi `--pseudo`.
   - Servi ciascuno su una porta tua (**8920**–8929).
3. Registra da te (`scripts/sequenza.mjs`) e guarda a grandezza utile, anche accanto alla home e a «non ancora»
   (`scripts/affianca.mjs`):
   - l'arrivo e lo scorrimento della pagina intera a 1440×900 e 390×844, e una larghezza di mezzo (fra 761 e 1180);
   - chi arriva a metà (un'ancora, una ricarica a metà pagina) e chi scorre in fretta;
   - le domande: aprirne una, cambiarla, con il mouse, il tocco e la tastiera; al computer e al telefono;
   - i dettagli a richiesta al telefono, e il passaggio da telefono a computer e ritorno;
   - «Copia il messaggio», e che l'indirizzo mostrato sia quello copiato;
   - le fonti collegate: dove portano, e come appaiono a riposo, al passaggio e al fuoco;
   - gli schermi bassi (844×390, 326×326);
   - la pagina in arabo e in en-XA a 390×844 e 1440×900;
   - la sezione «Pagina «stato»» del catalogo.
4. Poi rileggi il giudizio precedente: per ogni problema (I1–I6, M1–M12) dì se è risolto, come lo vedi, con la foto.
   Guarda anche ciò che la correzione e la costruzione hanno aggiunto o cambiato: un problema nuovo conta come gli altri.
5. Le questioni che la costruzione ha lasciato a chi giudica, da valutare una per una (che cosa fare, e se ora o dopo):
   - a 844×390 le due risposte più lunghe («Ha frasi pronte o simboli?», «Chi c'è dietro?») sono più alte dello spazio
     sotto la barra (362 px contro 306): si legge scorrendo ma non si vede intera; la costruzione l'ha dichiarata come
     limite: confermi il limite o va corretta?
   - a 326×326, con la risposta in vista, la domanda premuta resta 10 px sopra la barra (dichiarato come limite);
   - a 326×326 i dettagli aperti non stanno interi in en-XA, ar-XB, urdu, hindi e bengali (in italiano sì);
   - l'indirizzo ora è intero («https://…/it/stato/»): al telefono va su due righe e alza il tratto del messaggio di 22 px;
     mostrarlo più corto vorrebbe dire che mostrato e copiato non sono più la stessa stringa;
   - le fonti collegate hanno la linea dei collegamenti sotto il nome, dove prima l'etichetta era piatta;
   - «README» compare come nome di sei fonti diverse (il percorso è nel `title`).
6. Solo alla fine leggi le note di chi ha costruito (`3b-stato/costruzione/progresso.md`) e dì se corrispondono a ciò che
   hai visto.

## Che cosa consegni

`GIUDIZIO.md`: lo stato di ogni problema del giudizio precedente; i problemi nuovi in ordine di gravità (**bloccante**,
**importante**, **minore**), con foto, dove stanno, perché e la correzione proposta (che cosa, non come); le risposte al
punto 5; se la pagina è pronta per il proprietario; il riassunto per il proprietario (breve, in chiaro, in italiano
semplice, senza nomi di file né sigle).

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3bs-*`; porte dalla **8920** alla 8929. Non toccare le porte 8765, 8766 e 8767 né
  `/tmp/kalliope-site` e `/tmp/kalliope-lingue` (del proprietario); 8900–8909 sono di una misura della voce che usa la CPU
  in parallelo (un modello pesante alla volta): misura i tempi delle sequenze con questo in mente.
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo. Niente
  commit, niente push, niente comandi che chiedono conferma, nessun altro agente.
