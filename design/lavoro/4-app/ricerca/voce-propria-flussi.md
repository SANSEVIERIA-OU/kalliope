# Come si crea una voce propria nei servizi di oggi (ricerca del 26/11/2026)

Raccolta fatta da `vibe-next:research` (haiku), solo da fonti ufficiali. I dati segnati «secondario» non sono verificati su una pagina ufficiale.

| Servizio | Registra o importa | Che cosa si legge, quanto | Controlli di qualità | Consenso | Elaborazione | Fonti |
|---|---|---|---|---|---|---|
| Apple Personal Voice | registra soltanto | oggi 10 frasi a caso; esistono frasi di tre parole per chi fatica | nessuno documentato | solo la propria voce; Face ID o codice | sul dispositivo, «in under a minute»; notifica quando è pronta | https://support.apple.com/en-us/104993, https://www.apple.com/accessibility/ |
| ElevenLabs Instant Voice Clone | registra o carica | qualsiasi parlato; 1–2 minuti (non oltre 3); minimo 10 s, 5 s per file | consigli: niente riverbero né rumore, tono costante, −23…−18 dB RMS | casella «ho il diritto e il consenso» | subito | https://elevenlabs.io/docs/product/voices/voice-lab/instant-voice-cloning |
| ElevenLabs Professional | registra o carica | testi proposti o propri; da 30 minuti a 3 ore | indicazione della lunghezza, rimozione del rumore | verifica della voce letta ad alta voce | ore | https://elevenlabs.io/docs/product/voices/pvc-step-by-step-guide |
| Acapela My Own Voice | registra soltanto | 50 frasi, 8–30 minuti, anche in più sedute | calibrazione del microfono a ogni seduta; riascolto delle prime tre; stato di ogni frase (verde, giallo, rosso) | nessuno | pacchetto da scaricare | https://mov.acapela-group.com/faq/faq-computer/ |
| SpeakUnique | registra; «Voice Design» da vecchie registrazioni | 125 frasi (circa mezz'ora); da registrazioni vecchie almeno 5 minuti, meglio 15–20, senza rumore forte né voci sovrapposte | microfono esterno, stanza tranquilla | nessuno | qualche giorno | https://speakunique.co.uk/overview/voice-design/ |
| Microsoft Azure Personal Voice | registra o carica | campione da 5 a 90 s | punteggi di qualità dopo la registrazione | frase di consenso letta e confrontata con la voce | meno di 5 s | https://learn.microsoft.com/en-us/azure/ai-services/speech-service/personal-voice-create-consent |
| Kyutai Pocket TTS (il nostro motore) | un file WAV qualsiasi | nessuna durata ufficiale; le clip di Kyutai durano 10 s; le nostre misure: 12 s utili, oltre 20 s chiude le frasi presto (`benchmarks/voce-propria/README.md`, V-4) | «pulire il campione, perché la qualità della registrazione si riproduce» | solo il divieto d'uso senza consenso esplicito e lecito | nel programma, circa 1 s (`kalliope-cli voice`) | https://github.com/kyutai-labs/pocket-tts, https://huggingface.co/kyutai/pocket-tts |

**Indicazioni ufficiali per la SLA/MND** (MND Association, scheda 7D 2026-01 e tabella 10/25; RCSLT; NHS AAC West):
- registrare il prima possibile, finché la voce è forte, meglio di mattina;
- una stanza tranquilla, sempre la stessa, con tessuti morbidi;
- un microfono a cuffia di lato alla bocca: quelli del portatile «non sono adatti»;
- si può fare in più sedute, e qualcun altro può registrare per conto della persona;
- le vecchie registrazioni (video, messaggi vocali) si possono usare con alcuni servizi.

**In comune** fra i servizi:
- frasi da leggere, tranne nei servizi che accettano qualsiasi parlato;
- stanza tranquilla e microfono esterno;
- si può registrare di nuovo;
- il consenso è previsto solo in ElevenLabs e Azure.

**Le differenze** stanno nella quantità di parlato richiesta, da pochi secondi a migliaia di frasi, e nel tempo di elaborazione. Per Pocket TTS la registrazione è breve, e la qualità della clip conta più della durata.
