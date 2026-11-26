# Vocable AAC (WillowTree)

Legenda: **[O]** osservato in foto o video salvati · **[M]** misurato · **[L]** letto · **[I]** interpretazione.

## 1. Scheda
- Vocable AAC, app per iOS e Android, a codice aperto. Indirizzo: https://vocable.app (visitato 26/11/2026, 1440 px); immagini «showcase» del sito in `fonti/vocable/`; **due video Vimeo registrati** in Chrome: «origine» (102 s, `video/vocable-demo.mp4`, foglio `video/vocable-frames/foglio-1.png`) e «Listening Mode» (46 s, `video/vocable-listening.mp4`, foglio `video/vocable-listening-frames/foglio-1.png`).
- Strumento: Chrome MCP sul Chrome della skill. Le app non girano in un browser: le schermate sono marketing e filmati ufficiali. Non c'è una versione desktop.
- Non misurato: il movimento nei filmati (non è un gesto del prodotto ripreso con cura); non registrato l'audio.

## 2. Premio
Webby 2021, **Winner**, Experimental & Innovation (https://winners.webbyawards.com/2021/apps-and-software/mobile-ott-app-features/experimental-innovation/168530/vocable-aac); poi candidata 2023, 2024, 2025 (ricerca del 26/11). Motivazione della giuria: non disponibile.

## 3. Chi lo usa
[L] «Vocable AAC allows those with conditions such as MS, stroke, ALS, or spinal cord injuries to communicate using an app that tracks head movements, without the need to spend tens of thousands of dollars on technology». Nata dall'esperienza di una persona con sindrome di Guillain-Barré [L, video].

## 4. Il percorso
1. [O] Schermo «categorie» (`fonti/vocable/sheet-showcase.png`, primo): titolo grande «**Select something below to speak**»; in alto a destra due icone (tastiera, ingranaggio); fila di categorie (**General**, Basic Needs, Personal Care, Conversation) con frecce; griglia 3×3 di frasi grandi («Yes», «No», «Maybe», «Please», «Thank you», «I didn't mean to say that», «Please be patient»…); paginatore «‹ Page 1 of 2 ›».
2. [O] **Selezione a sosta** (dwell): la tessera su cui si ferma il puntatore (un **pallino arancione** = la testa) prende un **contorno arancione** (primo schermo) o diventa **verde** (categoria attiva; parola in previsione). Come la tessera si riempie durante la sosta: **non osservato** (nessuna sequenza del gesto).
3. [O] **Tastiera** (secondo schermo): il testo scritto in alto a sinistra («I want pizza|»), **la parola in corso in ciano**; sotto, una fila di 5 parole previste tra virgolette («"p" "part" "people" "pizza" "pictures"») con quella sotto il puntatore verde; in alto a destra stella (salva), fumetto (frasi salvate), ingranaggio; in basso **cestino, spazio, cancella, e il tasto di voce ciano con altoparlante**.
4. [O] **Salvare**: la stella dà un avviso al centro «**Saved to My Sayings**» con una stella: velo scuro, bordo arrotondato, centrato sulla tastiera (terzo schermo).
5. [O, video «Listening Mode»] Impostazioni: «Listening Mode» con interruttore verde; «“Hey Vocable” shortcut». Poi lo schermo «**Listening…**» («When someone asks a question out loud, Vocable will offer quick response options»); **la domanda sentita compare in alto in verde** («how many blankets would you like»); sotto, **risposte grandi** (Yes/No, oppure una tastiera numerica, oppure «Blue Blanket / Red Blanket / Both / Neither»); la risposta scelta compare in alto in bianco («Both»); si torna a «General». In fondo «Share with Developers».
6. [O, video «origine»] Prototipi: tavole di simboli, tastiera a sguardo, lavoro in Figma e in Xcode, persone che provano con la testa.

## 5. Come guida la persona
- Una domanda per schermo: la prima riga **dice che cosa fare** («Select something below to speak») [O].
- Dove si trova: la categoria attiva è verde; «Page 1 of 2» [O].
- Risposta all'azione: l'avviso «Saved to My Sayings»; la domanda sentita in verde [O].
- Se sbaglia: «Please be patient», «I didn't mean to say that» sono frasi di serie [O].
- Stato: «Listening…» in un messaggio centrale con la riga di spiegazione sotto [O].
- Aiuto: la spiegazione sta sotto il comando («When listening mode is enabled, anyone can ask a question out loud…») [O].

## 6. L'interfaccia al servizio del compito
- Colore (da foto): fondo **indaco** (stima dai pixel `valori-da-schermate/vocable-schermo.json`: `#3b369c` 36%, `#26265b` 20%, `#4f4d91`, `#191934`), tessere indaco più chiare, **un solo accento verde acido acceso** per ciò che è attivo, **ciano** per il tasto di voce, **arancione** per il puntatore. Tre accenti con tre compiti [I].
- Tipografia: un sans geometrico, titolo grande e grassetto; le tessere in testo bianco centrato di medio-grande [O].
- Forma: tessere rettangolari con **angolo piccolo (circa 4 px, stima)** e **un bordo che si accende**; pulsanti piccoli ad angolo uguale [O, I].
- Dimensioni: le tessere sono molto grandi (3×3 su un tablet): ogni bersaglio di circa un nono dello schermo [O, I]; testo delle tessere piccolo rispetto al bersaglio [O].
- Tema: **una sola variante scura** (nessun tema chiaro osservato) [O].

## 7. Cosa insegna / cosa non prendere
- Chi deve parlare in una riunione potrebbe ricavarne: **la parola che si sta scrivendo in un colore diverso (ciano)**; **la frase salvata con un avviso centrato breve e il nome del posto dove va («My Sayings»)**; **l'accento verde riservato a ciò che è scelto/attivo**; **«Listening Mode»**: chi ascolta un'altra persona vede la domanda in un colore e risponde con tasti grandi.
- Non prendere: la selezione a sosta (controllo con la testa); il titolo «Select something below to speak» (non c'è una scelta, c'è la scrittura).

## 8. Pubblico
Persone con SLA, sclerosi multipla, lesioni del midollo spinale, ictus: alcune senza mani, che usano la testa; caregiver [L].

## 9. Esperienza e sensazioni
Calma, notturna, sicura. Tre aggettivi: scura, grande, gentile. I primi cinque secondi (video «origine»): racconta una storia personale, non l'interfaccia. [I] La sensazione di «prodotto fatto con attenzione da persone che conoscono il problema».

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| testo | titolo che dice cosa fare | in alto nello schermo categorie | orienta | chiaro | `fonti/vocable/sheet-showcase.png` |
| colore | accento verde per ciò che è attivo | categoria, parola prevista | dice cosa è scelto | vivo | idem |
| colore | parola in corso in ciano | tastiera | mostra dove si scrive | leggero | idem |
| risposta | avviso «Saved to My Sayings» | centro, dopo la stella | conferma e dice dove | breve | idem (terzo) |
| gesto | sosta con pallino arancione e contorno | tessere | seleziona senza mani | ingegnoso | idem |
| dati | frasi salvate («My Sayings») | fumetto in alto a destra | ridire | semplice | idem |
| risposta | domanda sentita in verde in alto | Listening Mode | dà contesto alla risposta | utile | `video/vocable-listening-frames/foglio-1.png` |
| avanzamento | «Page 1 of 2» | sotto la griglia | dove sei | semplice | `fonti/vocable/sheet-showcase.png` |

## 11. Cosa serve al sistema
Parola in corso con un colore proprio; avviso di conferma centrato che nomina il luogo; un solo colore per «scelto/attivo»; riga di spiegazione sotto un comando. Stati non visti: errore, nessuna voce, nessuna rete.

## 12. Video
Origine (102 s): montaggio di dati, persone, prototipi, schermate; l'interfaccia compare solo nella seconda metà del filmato (dal foglio: schermate dall'ottavo riquadro in poi). Listening Mode (46 s): una sequenza di schermate dell'app in uso. Non si è ripreso il movimento dell'interfaccia (cambi di schermata) con `movimento-visibile.mjs`: **non misurato**.

## 13. Inventario del motion design
Non misurato. Visibile dai fogli: schermo categorie → tastiera con cambio vista [I: sul telefono, nel filmato, a taglio]; riempimento della tessera durante la sosta [L, non osservato in una sequenza].

## 14. 21 dimensioni
impaginazione, colore, forme, dimensioni, risposta, parole, interazione: osservate; movimento, suono, prestazioni: lacune; persone, fiducia (open source), aiuto: lette/osservate; accessibilita: osservata (testa, tocco, Listening Mode, tessere grandi, contrasto alto) ma nessuna tastiera fisica.

## 15. Peculiarità
- **Una frase che dice cosa fare** come titolo dello schermo.
- **Un accento verde solo per ciò che è scelto**, e un altro colore (ciano) solo per il tasto di voce.
- «Saved to My Sayings»: la conferma dice dove è finita la frase.
- «Listening Mode»: l'app ascolta la domanda dell'altro e offre le risposte (idea di dialogo a due sensi).
