# ElevenLabs Instant Voice Cloning (flusso di creazione della voce)

Legenda: **[O]** osservato in un'immagine ufficiale salvata · **[L]** letto nella documentazione · **[I]** interpretazione.

## 1. Scheda
- Documentazione: https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/instant-voice-cloning (letta in Chrome il 26/11/2026; banner cookie rifiutato «Reject all»; foto `foto/el-01-ivc-modal.png`). Due immagini ufficiali scaricate in `fonti/elevenlabs/` (`ivc-modal.webp` con ritaglio `ivc-modal-crop.png`, `ivc-feature.png`).
- **Bloccato / non visto:** la schermata di **registrazione/caricamento dell'audio** (passo 2) **non è nella documentazione** (c'è solo la frase «Follow the on-screen instructions to upload or record your audio») e vederla richiede un account: **non creato** (regola della visita). **Non visti:** misuratore di livello, avanzamento, riascolto, nuovo tentativo della schermata di caricamento. Il prodotto è una console web, non un'app.

## 2. Premio
Non applicabile (documentazione, non un prodotto premiato).

## 3. Chi lo usa
Chi vuole una voce sintetica a partire da 1-2 minuti di parlato. Non è pensato per una persona con SLA; il consenso richiesto è per la voce di cui si hanno i diritti.

## 4. Il percorso (4 passi, [L])
1. **Vai alla pagina «Instant Voice Cloning»:** «In the ElevenLabs dashboard, select the Voices section on the left, then click the plus icon. From the modal, select Instant Voice Clone.» [L]. [O] L'elenco «My Voices» (`fonti/elevenlabs/ivc-feature.png`) ha un grande tasto nero «**+ Create Voice**» in alto a destra, i filtri «Created by | Me» e «Type | Instant Voice Clone» come chip con «×», la voce «My Voice - IVC» con un'età «0d» e due icone.
2. **Carica o registra l'audio:** «Follow the on-screen instructions to upload or record your audio.» [L]. **Schermata non vista.**
3. **Conferma i dettagli** (`fonti/elevenlabs/ivc-modal-crop.png`): [O] finestra modale; **a sinistra un elenco dei passi** («Instant Voice Clone»: **Upload audio** con un puntino **verde** = fatto, **Voice Information** in **grassetto** = ora, **Finish up** in grigio chiaro = poi) e un tasto «Feedback»; a destra **un cerchio verde generato** (l'avatar della voce) con «▶ Preview voice», poi i campi: **Name** (esempio in grigio «e.g. old British man»), **Label** «Language» con il suo **Value** (menu) e «+ Add label», **Description** (area di testo); in basso **una casella di consenso** con il testo legale intero: «I hereby confirm that I have all necessary rights or consents to upload and clone these voice samples and that I will not use the platform-generated content for any illegal, fraudulent, or harmful purpose. I reaffirm my obligation to abide by ElevenLabs' Terms of Service, Prohibited Content and Uses Policy and Privacy Policy.»; poi **«Back»** e **«Save voice»** (nero) [O: `foto/el-01-ivc-modal.png`, tagliato a destra]. [L] «Name and label your voice clone, confirm that you have the right and consent to clone the voice, then click Save voice.»
4. **Usa la voce:** «Under the Voices section in the dashboard, click the My Voices then click Use voice to begin using it.» [L] Elaborazione: immediata.

## 5. Come guida la persona
- Dove si trova: elenco di passi con tre stati visibili (fatto verde, ora grassetto, poi grigio) [O].
- Quanto manca: tre passi (non una percentuale) [O].
- Come torna indietro: «Back» [O].
- Spiega: **consigli corti sotto «Best practices»**, lunghi a richiesta (menu a fisarmonica) [L]: «**Record at least 1 minute of audio**» (da 1 a 2 minuti puliti, evitare oltre 3 minuti: «little improvement and can, in some cases, even be detrimental»); «**Keep the audio consistent**» («the AI will attempt to mimic everything it hears … speed, inflections, accent, tonality, breathing pattern … noise and mouth clicks»); «**Replicate your performance**»; «**Find a good balance for the volume**: between −23 dB and −18 dB RMS with a true peak of −3 dB»; MP3 a 128 kbps o più.
- Consenso: **una casella obbligata con testo legale**, prima di salvare [O].
- Nome: **campo con esempio in grigio** («e.g. old British man»), più etichette e descrizione [O].

## 6. L'interfaccia
- Colore [O, `fonti/elevenlabs/ivc-modal-crop.png`]: modale **bianca**, testo **nero**, campi con bordo grigio chiaro, **un solo verde** per il puntino «fatto» e per l'avatar; tasto principale **nero**. Palette non misurata.
- Tipografia: un sans neutro (stile Inter) con titoli di campo in grassetto medio [O, stima visiva].
- Forme: campi e tasti con **angolo di 8-10 px** (stima), tasto «Preview voice» a pillola con bordo; casella di consenso rotonda [O].
- Sfondo della documentazione: immagini su fondo grigio scuro ondulato (decorazione).

## 7. Cosa insegna / cosa non prendere
- Chi deve **creare la propria voce nell'app** potrebbe ricavarne: **tre passi nominati con stati (fatto / ora / poi) a sinistra**, **anteprima «Preview voice» con un'immagine che rappresenta la voce nella stessa schermata del nome**, **casella di consenso con testo intero prima di «Save voice»**, **consigli corti con un numero preciso** («−23…−18 dB RMS», «1-2 minuti», «oltre 3 minuti peggiora»).
- Non prendere: etichette e descrizione (non servono a chi ha una voce sola), un consenso legale generico su «diritti» (per Kalliope il consenso è «questa è la mia voce»).

## 8. Pubblico
Creatori e sviluppatori; non persone con SLA. [I] La scelta di un passo di consenso resta pertinente a Kalliope.

## 9. Esperienza (dalla documentazione)
Pulita, da console. Tre aggettivi: ordinata, neutra, tecnica. Tono: istruzioni in imperativo, con un avvertimento legale.

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| avanzamento | elenco passi a sinistra con puntino verde | modale | dove sei | semplice | `fonti/elevenlabs/ivc-modal-crop.png` |
| risposta | «Preview voice» con avatar | modale, passo 3 | ascolta prima di salvare | rassicurante | idem |
| fiducia | casella di consenso con testo intero | prima di salvare | consenso esplicito | legale | idem |
| aiuto | «Best practices» a fisarmonica | documentazione | consigli corti con numeri | chiaro | `foto/el-01-ivc-modal.png` |
| gesto | «Create Voice» nero | elenco My Voices | avvia | netto | `fonti/elevenlabs/ivc-feature.png` |
| dati | nome con esempio in grigio | modale | dà l'idea | gentile | `fonti/elevenlabs/ivc-modal-crop.png` |

## 11. Cosa serve al sistema
Un passo di consenso con testo; un passo di anteprima; un elenco di passi con tre stati; consigli numerici brevi. Non visti: caricamento, registrazione, misuratore, errori di qualità, nuovo tentativo.

## 12. Movimento, suono
Non osservati. Il pulsante «Preview voice» suona un campione (non registrato).

## 13. Motion design
Non osservato.

## 14. 21 dimensioni
avanzamento, risposta, fiducia, aiuto, parole, forme, tipografia: osservate; movimento, suono, prestazioni (elaborazione immediata [L]), accessibilita: lacune o lette.

## 15. Peculiarità
- Il **nome della voce è nello stesso schermo dell'anteprima e del consenso**: l'ultimo passo è «dai un nome, ascolta, conferma, salva».
- «Qualità prima della quantità»: «How the audio was recorded is more important than the total length» [L].
