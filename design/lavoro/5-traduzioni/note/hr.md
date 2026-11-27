# Croato (hr)

Ho usato il croato standard di Croazia, in alfabeto latino, e il **tu** informale con la minuscola. Le istruzioni si rivolgono a una persona sola, con verbi come *Napiši*, *Odaberi* e *Pritisni*. Evito di dover scegliere il genere della persona che legge. Kalliope parla di sé al femminile (*Našla sam*, *Nisam uspjela*). Nello stato *Spreman*, «pronto», l’aggettivo concorda con *glas*, «voce», che in croato è maschile.

## Glossario

| Italiano | Croato |
| --- | --- |
| voce | glas |
| voce propria | vlastiti glas |
| Crea la tua voce | Stvori svoj glas |
| registrazione | snimka |
| messaggio vocale | glasovna poruka |
| tratto di una registrazione | isječak |
| microfono virtuale | virtualni mikrofon |
| microfono del computer | mikrofon računala |
| app della riunione | aplikacija za sastanke |
| Riunione | Sastanak |
| area di scrittura | polje za pisanje |
| bolla | oblačić |
| riga di stato | redak statusa |
| cronologia | povijest |
| Di’ | Reci |
| Ferma | Zaustavi |
| Altro | Više |
| Senti anche tu la voce | Glas i na zvučnicima |
| Preparo la voce | Pripremam glas |
| Pronta | Spreman |
| Sto parlando | Govorim |
| Nessuno ti sente | Nitko te ne čuje |
| Manca il microfono | Nema mikrofona |
| La voce non parte | Glas se ne pokreće |
| Attenzione | Upozorenje |
| Come si risolve | Kako to riješiti |
| pacchetto | paket |
| impronta SHA-256 | kontrolni zbroj SHA-256 |
| Sempre in primo piano | Uvijek na vrhu |

## Scelte di traduzione

Le frasi digitate per la sintesi e quelle delle registrazioni restano in italiano, compreso l’esempio nella chiave `st.varco.scritto`. Il breve brano in `programma.crea.ciao-sono-io-questa` è in croato perché lo legge la persona al microfono per registrare il proprio timbro. La voce sintetizzata continua a parlare soltanto italiano.

Per i tasti uso *Enter*, *Esc*, *Tab* e *Alt+razmaknica*. *Uvijek na vrhu* è la dicitura di «Always on Top» nel catalogo croato di GTK. L’interruttore *Glas i na zvučnicima* indica che il suono si sente anche dagli altoparlanti del proprio computer. Nelle tre forme di plurale, per esempio, l’interfaccia mostra *1 poruka*, *2 poruke*, *5 poruka* e poi *21 poruka*.

## Revisione della finestra e del sito

- Il pulsante *Natrag na pisanje* indica il ritorno all’area di scrittura. *Reci* è l’imperativo breve per far pronunciare la frase. Il sito riprende *Reci* e *Spreman* anche nella ricostruzione e nella descrizione del programma.
- La pagina di installazione riporta per intero il messaggio sulle voci mancanti. L’aiuto ne cita l’inizio, *Ne mogu naći datoteke s glasom*, e riporta i due messaggi del motore con la stessa formulazione della finestra. Nei campioni della home, *Izgovoreno:* introduce la trascrizione italiana esatta.
- In `hr_360x320_s1_scuro_2.png`, nelle scene `voce-3`, `voce-nome` e `voce-crea`, il bordo destro taglia *Pokušaj ponovo*. Ho usato *Ponovi* e, per il comando accanto, *Poslušaj* e *Zaustavi*. Così resta più spazio anche alla forma d’onda. Ho ridotto il titolo a *Poslušaj i imenuj glas* per lasciare più spazio al campo del nome.
- Nello stesso foglio, in `voce-2` e `voce-suggerimento`, *preostaje 6 sekundi* va su più righe e il numero finisce fuori dalla foto. La nuova dicitura *još 6 s* mantiene il numero accanto all’unità in tutte e tre le forme plurali. Ho accorciato anche la spiegazione del cerchio e del livello del microfono, visibile solo in parte al 175 %.
- In `voce-1` e `voce-errore`, *Snimi sada* sostituisce *Snimi ga sada*, che andava su due righe. Ho accorciato le istruzioni di lettura e il titolo della scelta delle vecchie registrazioni. In `voce-tratti` ho abbreviato la nota sulla durata e la frase sul numero di tratti in cui si sente la voce. L’intervallo *0:12–0:24* libera spazio per la durata del parlato nella scheda.

### Osservazioni sui sei fogli in tema scuro

| Foto | Cosa si vede |
| --- | --- |
| `hr_360x320_s1_scuro_1.png` | Le etichette croate dei comandi si leggono. In `scrive` il testo italiano si interrompe all’altezza dei pulsanti. Nelle bolle della cronologia e del parlato si vede una porzione della frase italiana su una sola riga. |
| `hr_360x320_s1_scuro_2.png` | In `info` si interrompe il suffisso italiano *dimostrazione*, inserito dalla demo. In `voce-mic`, `voce-2` e `voce-suggerimento` si vede soltanto la fine del brano da leggere. In `voce-1` e `voce-errore` la prima scheda continua oltre il bordo inferiore. In `voce-importa` il bordo inferiore taglia il pulsante *Odustani*. In `voce-3`, `voce-nome` e `voce-tratti` il piede fisso lascia visibile solo una parte del modulo. |
| `hr_920x640_s1.75_scuro_1.png` | In `scrive` l’ultima riga visibile si interrompe sopra i pulsanti. In `compatta` e `compatta-parla` la frase italiana supera la larghezza della bolla. |
| `hr_920x640_s1.75_scuro_2.png` | Il bordo inferiore limita la seconda scelta in `voce-1` e i comandi di registrazione in `voce-2` e `voce-suggerimento`. In `voce-errore` l’indicatore del passo è visibile solo in parte sul bordo superiore. Il piede fisso delimita l’elenco dei componenti in `info` e il modulo del nome o dei tratti in `voce-3`, `voce-nome` e `voce-tratti`. |
| `hr_920x640_s1_scuro_1.png` | Le etichette croate si leggono. Nelle due scene compatte la bolla su una riga mostra solo parte della frase italiana. |
| `hr_920x640_s1_scuro_2.png` | In `info` l’elenco dei componenti prosegue sotto la parte visibile. In `voce-tratti` si vede solo l’inizio del campo del nome sopra il piede fisso. |

Le foto documentano la versione precedente alla revisione. Mostrano la posizione visibile di ciascuna area scorrevole in un solo istante. I nomi italiani dei dispositivi, del file importato e della voce personale provengono dai dati dimostrativi.

## Dubbi aperti

Nessun dubbio linguistico rimasto aperto.

## Applications menu

| Campo | Testo del menu | Retrotraduzione inglese |
| --- | --- | --- |
| GenericName | Glas za videopozive | Voice for video calls |
| Comment | Piši da te drugi čuju u videopozivima | Type so others can hear you on video calls |
| Keywords | `pretvaranje teksta u govor;tts;glas;govoriti;mikrofon;videopoziv;potpomognuta komunikacija;pk;aac;ne mogu govoriti;` | converting text to speech; TTS; voice; speak; microphone; video call; supported communication (Croatian term for AAC); PK; AAC; I can’t speak |

«Pretvaranje teksta u govor» descrive ciò che fa il programma. «Ne mogu govoriti» riprende in prima persona la formulazione del sito.
«Potpomognuta komunikacija» e «pk» sono il nome e la sigla croati per l’ambito della CAA. «aac» permette la ricerca anche con la sigla internazionale.

Review: no change. «Piši» si rivolge alla stessa persona della finestra e «drugi čuju» rende esplicito l’ascolto. «Potpomognuta komunikacija» e la sigla PK sono attestate nell’uso croato. [Manuale CARNET](https://www.carnet.hr/wp-content/uploads/2025/09/udzbenik_obrazovanje_ucenika_s_teskocama_web-3.pdf)
