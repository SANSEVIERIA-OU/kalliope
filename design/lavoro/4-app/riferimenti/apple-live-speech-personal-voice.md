# Apple Live Speech e Personal Voice

Legenda: **[O]** osservato in una foto salvata · **[L]** letto nella pagina di supporto · **[I]** interpretazione.

## 1. Scheda
- Categoria: funzioni di sistema (iPhone, iPad, Mac, Watch). Indirizzi: https://support.apple.com/en-us/105018 (Live Speech) e https://support.apple.com/en-us/104993 (Personal Voice), entrambe lette in Chrome il 26/11/2026; immagini ufficiali dalla newsroom https://www.apple.com/newsroom/2023/05/apple-previews-live-speech-personal-voice-and-more-new-accessibility-features/ (`fonti/apple/`); https://www.apple.com/accessibility/speech/ (pagina di indice, `foto/apple-01-accessibility-speech.png`, senza immagini utili).
- Strumento: Chrome MCP sul Chrome della skill, schermo virtuale. Le immagini sono **del 2023 (anteprima)** e mostrano iPhone: **non esiste un'immagine ufficiale della finestra Mac di Live Speech** (lacuna: solo il testo del supporto).
- Non visto: il movimento (nessun video ufficiale di Live Speech trovato; il video della newsroom è di «Point and Speak»), l'audio, la finestra su Mac.

## 2. Premio
Nessuno (ricerca del 26/11). Motivazione: non applicabile.

## 3. Chi lo usa
[L] Chi «can't speak or has lost speech»; Live Speech: «type what you want to say and have it spoken out loud in FaceTime and phone calls, in supported assistive communication apps, or from your device's speakers for in-person conversations». Personal Voice: voce sintetica «that sounds like you», usabile da Live Speech, Read & Speak, VoiceOver e app di CAA di terzi.

## 4. Il percorso

**Live Speech, iPhone** (`fonti/apple/sheet-livespeech.png`)
1. [L] Si attiva in Impostazioni → Accessibilità → Live Speech; poi **triplo clic sul tasto laterale** (o scorciatoia) apre il pannello di scrittura.
2. [O] Un **pannello scuro semitrasparente sopra la chiamata** (lascia vedere la persona in FaceTime): in alto a sinistra la chip «Phrases» con segnalibro, in alto a destra «×»; il testo scritto in grande, bianco e in grassetto, «You weren't kidding about the view|»; sotto la tastiera a schermo con la striscia di previsione («The», «the», «to»); **il tasto Invio della tastiera si chiama «send» ed è blu**.
3. [O] **Mentre parla** (`fonti/apple/sheet-livespeech.png`, al centro): il pannello mostra la frase con **la parte già detta in bianco pieno e la parte da dire attenuata** («**How** are you doing?»); a destra della chip compaiono **un tasto rosso tondo di pausa** e «×»; il tasto «send» diventa grigio (spento).
4. [L] Frasi preferite: tocco su «Phrases», poi tocco sulla frase. [L] Mac: campo «Type to Speak» in una finestra di Live Speech, **Invio o tasto «Speak»**, «Show Saved Phrases», icona nella barra dei menu per mostrare/nascondere la finestra.
5. [L] Voce: «dozens of system voices or a customized Personal Voice»; tono e velocità dal bottone «Voice Settings».

**Personal Voice, registrazione** (`fonti/apple/sheet-livespeech.png`, a destra; [L] supporto 104993)
1. [L] Impostazioni → Accessibilità → Personal Voice → «Create a Personal Voice»; si può usare il microfono incorporato, uno esterno o una cuffia.
2. [O] Schermata **«Read the Phrase»** (versione 2023): titolo, **contatore «1 of 150»** con frecce indietro/avanti, la frase in grande e grassetto («Grabbing a cup of coffee this afternoon sounds great.»), in basso **un'onda verde con «Listening…»** e un **tasto rosso tondo di stop** con anello. In alto a sinistra «Done».
3. [L] **«To pause recording and automatically save your progress, tap Done or close the Settings app.»** Per riprendere: «Continue Recording». La ripresa è un passo previsto.
4. [L] Elaborazione sul dispositivo; «You'll receive a notification when your Personal Voice is ready». [L] «Share Across Devices», «Allow Apps to Request to Use». Cancellare: «Delete Voice And Recordings» con conferma; «Once deleted, a Personal Voice can't be recovered.»
5. [L] Requisiti: Face ID, Touch ID o codice del dispositivo.
6. Consenso: nessuna casella di consenso; la registrazione è della propria voce, protetta dal codice (ricerca del 26/11, `ricerca/voce-propria-flussi.md`).

## 5. Come guida la persona
- Una cosa per schermata: il pannello di scrittura ha la frase, un solo bottone (send), una chiusura [O]; la schermata di registrazione ha una frase, un contatore, un tasto [O].
- Dove si trova / quanto manca: «1 of 150» [O] (oggi, secondo la ricerca, **10 frasi**; il numero del 2023 non è più quello); l'avanzamento è salvato [L].
- Risposta a ogni azione: parte attenuata/piena nel testo; «Listening…» e onda; notifica a lavoro finito [O, L].
- Se sbaglia: frecce indietro/avanti sul contatore [O]; l'annullamento della frase registrata: non osservato.

## 6. L'interfaccia
- Colore [O, stima visiva]: pannello scuro vetrificato con la tinta della foto sotto; testo bianco; **rosso per ciò che interrompe** (pausa, stop) e **blu per ciò che invia**. La palette del pannello non si legge in modo affidabile (è traslucida su una foto): `valori-da-schermate/apple-live-speech-pannello.json` è **da non usare**.
- Tipografia: San Francisco in grassetto grande per la frase [O].
- Forma: pannello con angolo molto arrotondato, chip e tasti a pillola, tasto rosso tondo [O].
- Materiali: vetro scuro sfocato sopra il contenuto della chiamata [O].

## 7. Cosa insegna / cosa non prendere
- Chi deve parlare in una riunione potrebbe ricavarne: **la frase mentre parla resta lì, le parole già dette si fissano e quelle da dire restano tenui; pausa rossa vicino alla frase; il tasto di invio si spegne mentre parla**. Per la registrazione: **frase grande, una per schermata, contatore, onda, un solo tasto di stop; «Done» salva e si riprende da dove si era arrivati**.
- Non prendere: il vetro sfocato sopra la chiamata (Kalliope non vede la chiamata); il codice del dispositivo.

## 8. Pubblico
Utenti di iPhone con SLA o altre perdite di voce che registrano la voce «finché è forte» (indicazione ufficiale delle associazioni, `ricerca/voce-propria-flussi.md`).

## 9. Esperienza e sensazioni
Calma, silenziosa, sicura. Tre aggettivi: essenziale, protettiva, quieta. Il pannello non copre la chiamata (lascia vedere il volto). A chi non è il pubblico: sembra un campo messaggi qualunque.

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| risposta | parole dette piene, da dire attenuate | pannello durante la voce | seguire la voce | preciso | `fonti/apple/Apple-accessibility-Lock-Screen-Live-Speech_inline.jpg` |
| gesto | pausa rossa tonda vicino alla frase | in alto a destra del pannello | ferma | evidente | idem |
| gesto | «send» al posto di Invio, spento mentre parla | tastiera | impedisce un secondo invio | chiaro | idem |
| dati | chip «Phrases» | pannello | frasi preferite | discreta | `fonti/apple/Apple-accessibility-FaceTime-Live-Speech_inline.jpg` |
| avanzamento | «1 of 150», frecce | Personal Voice | dove sei | semplice | `fonti/apple/Apple-accessibility-Personal-Voice_inline.jpg` |
| risposta | onda verde «Listening…» | registrazione | sta ascoltando | viva | idem |
| gesto | stop rosso tondo con anello | registrazione | ferma | grande | idem |
| fiducia | «Delete Voice And Recordings», «can't be recovered» | impostazioni | dice la conseguenza | onesta | [L] |
| aiuto | notifica a elaborazione finita | sistema | non aspettare davanti allo schermo | rispettosa | [L] |

## 11. Cosa serve al sistema
Stato «sta parlando» con parti dette/da dire; pausa; sequenza di registrazione con una frase, contatore, onda, stop, salvataggio e ripresa; avviso a fine elaborazione. Non visto: errore, microfono assente, riascolto, nome della voce.

## 12. Movimento, video, suono
Nessun video di Live Speech trovato. L'onda verde è un'immagine ferma: **se si muova e come, non osservato**.

## 13. Inventario del motion design
Non osservato: l'evidenziazione che avanza (parola per parola o con una transizione continua) è documentata solo dall'immagine ferma.

## 14. 21 dimensioni
impaginazione, forme, tipografia, colore, risposta, avanzamento: osservate in 3 immagini; navigazione, interazione, parole, fiducia, aiuto, accessibilita (Face ID, voci, triplo clic): lette; movimento, suono, prestazioni (elaborazione «in under a minute», ricerca): lacune o lette.

## 15. Peculiarità
- **Parola detta piena / parola da dire attenuata** dentro il campo di scrittura stesso.
- **Il salvataggio automatico e la ripresa** della registrazione («Done»/«Continue Recording»).
- Frase di registrazione **grande e grassetto, una per schermata**.
- Notifica quando la voce è pronta (non si aspetta).
