# Ungherese (hu)

Ho usato l’ungherese standard contemporaneo e il *tegezés*, il «tu» al singolare. Di solito basta il verbo per rivolgersi alla persona («nyomj Entert», premi Invio). Il pronome «Te» compare nel riquadro che identifica chi scrive. Kalliope parla in prima persona negli stati in cui annuncia cosa sta facendo («Előkészítem a hangot», preparo la voce).

## Glossario

| Italiano | Ungherese |
| --- | --- |
| voce | hang |
| voce propria | saját hang |
| registrazione | felvétel |
| messaggio vocale | hangüzenet |
| tratto di una registrazione | részlet |
| microfono virtuale | virtuális mikrofon |
| riunione | értekezlet |
| chiamata | hívás |
| impostazioni audio | hangbeállítások |
| riga di stato | állapotsor |
| area di scrittura | írómező |
| bolla | buborék |
| cronologia | előzmények |
| Pronta | Kész |
| Sto parlando | Beszélek |
| Nessuno ti sente | Senki sem hall |
| Manca il microfono | Nincs mikrofon |
| La voce non parte | Nem indul a hang |
| Di’ | Mondd |
| Ferma | Állj |
| Altro | Egyéb |
| Come si risolve | Így oldhatod meg |
| Crea la tua voce | Saját hang létrehozása |
| Senti anche tu la voce | Én is halljam a hangot |
| Sempre in primo piano | Mindig felül |
| Aiuto | Súgó |
| pacchetto | csomag |
| impronta SHA-256 | SHA-256 ellenőrzőösszeg |

## Scelte di traduzione

I campioni e le frasi digitate per la sintesi sono in italiano, compresa la frase nella figura sulla riservatezza (`st.varco.scritto`). Il breve brano in `programma.crea.ciao-sono-io-questa` è in ungherese perché è la persona a leggerlo nel microfono per registrarsi. Le voci sintetiche parlano solo italiano.

L’ungherese usa il singolare dopo un numero. Per questo entrambe le forme del contatore di ricerca sono «{n} üzenet». Nella guida ogni citazione di un pulsante conserva la dicitura del programma. Quando serve una desinenza, la prende la parola che segue la citazione, come in «az „Egyéb” menüben» (nel menu «Altro»).

## Seconda lettura nella finestra

- «Mondd», «Állj», «Ismételd», «Töröld» e «Hallgasd meg» sono comandi rivolti a chi deve compiere l’azione. «Kezdd újra» fa ricominciare il percorso. «Vissza az íráshoz» riporta all’area di scrittura. Durante l’importazione è Kalliope a dire «Beolvasom».
- L’installazione riporta per intero il messaggio sui file mancanti. La guida ne cita l’inizio, «Nem találom a hang fájljait». Per gli altri due errori riproduce le parole della finestra fino ai due punti, con i puntini al posto della causa variabile. «Elhangzott:» introduce la frase effettivamente pronunciata nel campione italiano.

## Riscontro sui sei fogli

| Foto | Scena e intervento |
| --- | --- |
| `hu_360x320_s1_scuro_1.png` | Nella barra principale si vede solo una parte di «100%» e A+ resta fuori. «Egyéb» accorcia «Továbbiak» di circa 31 px, ma per mostrare tutti i comandi serve ancora spazio nella barra. Le bolle compatte mostrano una porzione della frase italiana. |
| `hu_360x320_s1_scuro_2.png` | In `voce-importa`, `voce-3` e `voce-nome` il titolo del passaggio finiva oltre il bordo destro. Le forme brevi sono «1/3 · Felvétel vagy import» e «3/3 · Lejátszás és névadás». In `voce-1` «Vedd fel most» evita che il titolo occupi tre righe. In `voce-3` «Hallgasd meg» lascia più spazio alla forma d’onda, ridotta a una barretta. In `voce-tratti` l’articolo di «a legtisztább» resta unito all’aggettivo quando il testo va a capo. |
| `hu_360x320_s1_scuro_2.png` | Nel titolo di `info` la parola italiana «dimostrazione» esce dal riquadro. Fa parte della versione dimostrativa. In `voce-3` e `voce-nome` il bordo sfumato sopra il pulsante lascia intravedere appena la domanda sul nome. Il campo e il consenso sono più in basso nell’area scorrevole. |
| `hu_920x640_s1.75_scuro_1.png` | I comandi e gli stati ungheresi sono leggibili. In `scrive` il testo digitato arriva al bordo inferiore dell’area di scrittura. In modalità compatta la bolla mostra solo parte della frase italiana. |
| `hu_920x640_s1.75_scuro_2.png` | In `voce-suggerimento` la parola «kell» restava da sola sulla seconda riga. Il contatore ora mostra, per esempio, «5,2 s · még 12 s». Il numero resta unito all’unità. Qui e a 360×320 ho accorciato anche le istruzioni sul livello audio e sul microfono. Nelle foto il bordo inferiore taglia parte delle istruzioni di registrazione. |
| `hu_920x640_s1_scuro_1.png` e `hu_920x640_s1_scuro_2.png` | A scala normale i pulsanti e le citazioni degli stati si leggono. In `voce-mic` l’istruzione sotto il comando tondo arriva oltre il bordo inferiore. «Cuffia USB», «La voce di Anna» e il nome del file importato sono dati della dimostrazione. |

Le foto precedono le modifiche. Ho misurato le nuove diciture con Lexend del progetto. A corpo 15 le due intestazioni occupano circa 194 e 197 px, su circa 231 disponibili. A corpo 24 «5,2 s · még 12 s» occupa circa 172 px, contro i 282 precedenti. La resa finale di Slint e lo scorrimento restano da verificare in una nuova esecuzione.

## Dubbio aperto

«Mindig felül» è la dicitura presente nel catalogo ungherese di GTK. Per Zoom ho usato «Beállítások, Hang, Mikrofon». La dicitura esatta dei menu nella versione ungherese di Zoom resta da verificare.

## Applications menu

| Campo | Testo del menu | Retrotraduzione inglese |
| --- | --- | --- |
| GenericName | Hang videóhívásokhoz | Voice for video calls |
| Comment | Írj, és a többiek hallani fognak a videóhívásban | Type and the others on the video call will hear you |
| Keywords | `szövegfelolvasó;beszédszintézis;tts;hang;beszéd;mikrofon;videóhívás;augmentatív és alternatív kommunikáció;aak;nem tudok beszélni;` | text-to-speech reader; speech synthesis; TTS; voice; speech; microphone; video call; augmentative and alternative communication; AAK; I can’t speak |

«Szövegfelolvasó» è il programma che legge il testo ad alta voce. «Beszédszintézis» è il nome della tecnologia.
«Nem tudok beszélni» usa in prima persona il verbo del sito. Il nome locale della comunicazione aumentativa accompagna la sigla «aak».

Review: no change. «Írj» dà del tu come la finestra e «a többiek» identifica chi ascolta. «Szövegfelolvasó» indica il programma cercato e «nem tudok beszélni» esprime il bisogno.
