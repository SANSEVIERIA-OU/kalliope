# Correzioni ai fatti del sito (coordinatore, 12/11/2026, dopo la rilettura dei testi)

Da applicare insieme ai difetti della revisione visiva. Fonti verificate dal coordinatore.

1. **Installa, «Per togliere Kalliope».** Togliere il pacchetto o lanciare `./install --remove` non cancella mai le
   preferenze né la voce: stanno nella cartella personale, che i gestori dei pacchetti non toccano, e lo script lo dice
   (`packaging/linux/install`, riga 6). Scrivilo con certezza, con le due cartelle da cancellare per toglierle:
   `~/.config/kalliope` (preferenze) e `~/.local/share/kalliope` (la voce, 53 MB). Togli «Non abbiamo verificato…».
2. **Installa, archivio.** Al posto di `cd "$(basename kalliope-….tar.gz .tar.gz)"` usa `cd {{kalliope.tar.dir}}`
   (nuovo segnaposto di `tools/site.py`: la cartella in cui si apre l'archivio, verificata sul file della release).
3. **Stato, «Cosa esce dal computer».** Kalliope non ha servizi in background né avvio automatico: è un solo programma.
   Quando chiudi la finestra si chiude del tutto, e il microfono «Kalliope» sparisce con lui (PipeWire toglie i nodi di
   un programma che esce; `crates/mic/src/lib.rs`: «Dropping it removes the microphone»). Scrivilo con certezza al posto
   di «Non risulta alcun servizio… non l'abbiamo verificato».
4. Verificati e giusti, da non cambiare: glibc 2.39 (il binario della release usa al massimo GLIBC_2.39), `./install
   --remove`, il nome della cartella dell'archivio, «Kalliope diventa il microfono predefinito solo se è l'unico»
   (`docs/virtual-microphone.md`), l'ordine dell'elenco (la più recente in alto), «Ferma» svuota la coda, la licenza.
