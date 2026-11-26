# La finestra di Kalipso (il metro di qualità del proprietario; solo idee, mai codice)

Legenda: **[O]** osservato in foto locali copiate in `fonti/kalipso/` · **[I]** interpretazione. Nessuna misura dal DOM (sono schermate di prova di un'altra applicazione); la palette è stimata dai pixel.

## 1. Scheda
- Kalipso (suggeritore, «Teleprompter») su GNOME. Foto locali del progetto di Kalipso: `/workspace/kalipso/artifacts/design-rebuild/` (usate: `gnome-editor-final.png`, `gnome-reader-final.png`, `gnome-settings-final.png`, `gnome-read-progress.png`, `gnome-first.png`, `plasma-first.png`, `gnome-text150.png`, `gnome-font-2.0.png`) e `/workspace/kalipso/artifacts/da-cartelle-extra/library/script-library-review/selezione-copioni.png`. Riunite in `fonti/kalipso/sheet-1.png`, `sheet-2.png`, `sheet-3.png`.
- Strumento: foto salvate; **nessuna prova interattiva** (la finestra non è stata avviata), nessun movimento. Le foto mostrano la finestra dentro la shell di GNOME (barra superiore con data, orologio e icone di sistema), 800×600 e 1440×1000.
- Il progetto di Kalipso e Kalliope sono codici separati: solo le idee.

## 2. Premio
Nessuno.

## 3. Chi lo usa
Chi legge un testo davanti a una telecamera, in riunione (suggeritore): legge un copione e la finestra segue la lettura. Pubblico diverso da Kalliope, ma situazione uguale: **riunione, finestra piccola accanto alla videochiamata, testo grande**.

## 4. Il percorso (dalle foto)
1. [O] `fonti/kalipso/sheet-1.png` in basso a destra (`gnome-read-progress.png`): una **finestra scura compatta** con in alto il titolo «**Teleprompter**» in grassetto e a destra tre pulsanti «Edit script», «Settings», «Hide»; sotto **il testo di lettura in grande** («A little preparation makes room for a better conversation. Take your time. Leave space for a …»); sotto **una riga di comandi**: «**Next words**» (blu pieno, primario), «Previous», «Reset» (grigi) e a destra il contatore «**4 / 27**»; sotto una riga di stato «**Manual · Microphone off**» in azzurro-lilla.
2. [O] **Parole già lette attenuate** (grigio-ardesia), **parole da leggere bianche**: «A little preparation makes **room** for a better…»: la parte letta è tenue, la prossima è piena.
3. [O] In alto a sinistra (`gnome-editor-final.png`): «**Edit script**» apre **lo stesso pannello**, con un campo di testo bianco «SCRIPT» sotto una linea, il pulsante diventa «**Done editing**», e sotto il campo la riga «**Changes appear immediately · This session only**».
4. [O] «**Settings**» (`gnome-settings-final.png`): **si apre nello stesso pannello** sotto la linea: scelta fra «✓ Manual» / «Follow my voice» e «✓ Moonshine» / «Vosk» come **chip con spunta**, una frase di spiegazione («Local speech is not installed. Open Local speech setup to install a companion and language model.»), «Reading size» con «Smaller» / «Larger».
5. [O] **Testo grande** (`gnome-text150.png`, `gnome-font-2.0.png`): a 150% e 200% **tutto cresce insieme** (testo, pulsanti, stato); il pannello non cambia struttura, il testo va a capo in più righe e il contatore resta a destra.
6. [O] `fonti/kalipso/sheet-2.png`: **finestra stretta** (circa 280×380 px nella foto a 1440) con titolo, due pulsanti, testo grande a capo, comandi, stato: **la stessa gerarchia in verticale**.
7. [O] **Libreria dei copioni** (`fonti/kalipso/sheet-3.png`, a destra, tema chiaro): **elenco a sinistra** con caselle di selezione, titolo, «meno di 1 min · 18:08»; **editor a destra** con testo grande su fondo chiaro e un titolo in markdown («# Benvenuti»); barra degli strumenti con **B, I, H, A−, A+, «Sezioni», ingranaggio, «Sotto la webcam»**; in basso «**Scegli la lingua**» (pulsante scuro) e «**Segui la mia voce**» (menu); «Selezionati: 1» con «×» e «Azioni…» per la selezione.

## 5. Come guida la persona
- Una cosa grande (il testo) e **un solo pulsante pieno** («Next words») [O].
- Dove si trova e quanto manca: «**4 / 27**» [O].
- Che risposta dà: la parte letta si attenua [O]; la riga di stato dice «Manual · Microphone off» [O].
- Come torna indietro: «Previous», «Reset», «Done editing», «Hide» [O].
- Spiega: una frase in grigio sotto il campo («Changes appear immediately · This session only») [O].

## 6. L'interfaccia al servizio del compito
- Colore (stima dai pixel di `fonti/kalipso/sheet-1.png`, `valori-da-schermate/kalipso-finestra-scura.json`): fondo **`#17191f` 64%**, bianco 20% (testo), `#2e323c` 7% (pulsanti secondari), **blu `#6174b6` 4,5%** nella stima (il pulsante primario è un blu più saturo, `#2f4bd9` circa, stima visiva), `#d6dfec` per il testo secondario. Tema chiaro nella libreria (fondo bianco-crema).
- Tipografia: **DejaVu Sans** (la shell lo usa, [I] riconoscibile dalla forma delle lettere), titolo in grassetto, testo di lettura in corpo grande (~40 px a 800 px di larghezza, stima).
- Forme: pulsanti con angolo ~8 px, finestra con angolo ~12 px; tutto in stile della shell di GNOME [O].
- Dimensioni: il testo prende ~45% dell'altezza della finestra nella foto; i pulsanti sono alti ~38 px (stima).

## 7. Cosa insegna e cosa non prendere
- Per Kalliope (a cui serve la finestra buona, **non** il suo aspetto): **testo grande con la parte già detta attenuata e quella da dire piena**; **una riga di stato in chiaro** sotto i comandi; **un solo pulsante pieno** e gli altri secondari; **le impostazioni nello stesso pannello, con effetto immediato** e la frase che lo dice («Changes appear immediately»); **il testo grande che fa crescere tutta la finestra**; **un contatore «4 / 27»**; **una finestra stretta che mantiene la stessa gerarchia**.
- Non prendere: l'aspetto della shell di GNOME (è l'aspetto della 0.2 «orripilante»: libadwaita con DejaVu e blu di sistema), il blu come azione, i tre pulsanti in alto a destra («Edit script», «Settings», «Hide»).

## 8. Pubblico
Presentatori, insegnanti, chi parla in riunione con un copione. Livelli: chi scrive i copioni (libreria) e chi legge (pannello compatto).

## 9. Esperienza e sensazioni
Primi cinque secondi: una finestra scura sobria che mostra subito il testo e un pulsante blu. Il controllo è di chi legge (nessun avanzamento automatico a sorpresa: «Manual»). Tre aggettivi: sobria, leggibile, calma. [I] Funziona perché **il testo è il protagonista e la barra dei comandi è piccola**; è anche anonima: «una finestra di GNOME qualsiasi».

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| tipografia | testo di lettura grande, parte letta attenuata | centro della finestra | segue la lettura | calma, chiara | `fonti/kalipso/sheet-1.png` |
| gesto | un solo pulsante blu pieno + due secondari | sotto il testo | avanza, indietro, azzera | ordinato | idem |
| avanzamento | contatore «4 / 27» | a destra dei comandi | dove sei | discreto | idem |
| risposta | riga di stato «Manual · Microphone off» | sotto i comandi | dice la modalità | onesta | idem |
| aiuto | «Changes appear immediately · This session only» | sotto il campo | spiega l'effetto | chiara | idem (in alto a sinistra) |
| struttura | impostazioni aperte nello stesso pannello | sotto la linea | cambia senza cambiare finestra | continua | idem (in basso a sinistra) |
| dimensioni | testo a 150% e 200% | tutta la finestra | ingrandisce tutto | proporzionato | `fonti/kalipso/sheet-3.png` |
| dati | elenco di copioni con ora | libreria | scegliere | familiare | idem |
| struttura | finestra stretta con la stessa gerarchia | mezza larghezza | compatta | ordinata | `fonti/kalipso/sheet-2.png` |

## 11. Cosa serve al sistema
Un campo di testo grande con la parte detta attenuata; una striscia di stato; contatore; pannello delle impostazioni nello stesso corpo con effetto immediato; dimensione del testo che scala tutto. **Non visti:** movimento, transizione fra lettura e modifica, riascolto.

## 12-13. Movimento, suono
Non osservati (solo foto).

## 14. Le 21 dimensioni
impaginazione, tipografia, dimensioni, risposta, avanzamento, aiuto, accessibilita (testo 150%/200%): osservate; colore, forme: stimate dai pixel; movimento, suono, prestazioni: lacune.

## 15. Peculiarità
- **Il testo che si attenua dietro a chi legge** (parte letta tenue / parte da leggere piena).
- **Impostazioni nello stesso pannello, effetto immediato, con una frase che lo dichiara**.
- **Il pannello compatto ha la stessa gerarchia di quello largo**.
