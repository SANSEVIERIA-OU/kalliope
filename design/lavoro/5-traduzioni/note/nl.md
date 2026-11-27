# Neerlandese · Nederlands

Ho usato il neerlandese standard comune ai Paesi Bassi e alle Fiandre. Il sito e il programma si rivolgono a una persona con *je*. Uso *jij* per dare risalto a chi scrive («Jij typt») e come nome sulla tessera della riunione. Per le istruzioni uso l’imperativo breve, come in «Typ een zin en druk op Enter».

## Glossario

| Italiano | Nederlands |
| --- | --- |
| voce | stem |
| voce propria | eigen stem |
| Crea la tua voce | Maak je eigen stem |
| frase | zin |
| scrivere (alla tastiera) | typen |
| bolla | tekstballon |
| cronologia | geschiedenis |
| registrazione | opname |
| messaggio vocale | spraakbericht |
| tratto di registrazione | fragment |
| microfono virtuale | virtuele microfoon |
| app della riunione | vergaderapp |
| riga di stato | statusregel |
| Pronta | Klaar |
| Preparo la voce | Ik laad de stem |
| Sto parlando | Ik spreek |
| Nessuno ti sente | Niemand hoort je |
| Manca il microfono | Microfoon ontbreekt |
| La voce non parte | De stem start niet |
| Come si risolve | Bekijk de uitleg |
| Di’ | Spreek |
| Ferma | Stop |
| Riunione | Vergadering |
| Altro | Meer |
| Senti anche tu la voce | Luister zelf mee |
| Sempre in primo piano | Altijd bovenop |
| pacchetto | pakket |
| impronta (SHA-256) | controlesom |

## Scelte di traduzione

Le voci parlano solo italiano. Ho conservato anche la frase digitata nella scena sulla riservatezza (`st.varco.scritto`) e la parola pronunciata dal comando `kalliope --say "prova"`. Il brano della registrazione guidata (`programma.crea.ciao-sono-io-questa`) è in neerlandese perché lo legge la persona al microfono per registrare la propria voce.

Per il menu della finestra ho scelto «Altijd bovenop», presente nel catalogo neerlandese di GTK. Lo stesso nome compare nella guida alla riunione.

## Seconda lettura con la finestra

Ho riletto le 529 voci del sito e le 175 del programma. Per lo stato di avvio ho scelto «Ik laad de stem», così è Kalliope a dire che sta caricando la voce. «Terug naar het tekstvak» indica dove riporta la freccia. «Overdoen» permette di rifare la registrazione o la scelta del file. La pagina di installazione e la guida ora citano le parole della finestra anche per i file mancanti e i due errori del motore. «Uitgesproken:» introduce la frase pronunciata in italiano.

- In `nl_360x320_s1_scuro_2.png` la riga del passo perdeva le ultime lettere in *voce-importa*, *voce-3* e *voce-nome*. «3/3 · Luister en kies een naam» conserva l’azione e il numero totale di passi. Con Lexend a 15 px la riga misura circa 227 px, contro i 255 px della precedente.
- In *voce-2* e *voce-suggerimento* dello stesso foglio, «seconden» finiva su una riga tagliata in basso. «nog 12 s» conserva l’unità accanto al numero e occupa circa 99 px contro 200 a 24 px. Ho accorciato anche il brano letto al microfono e le istruzioni di registrazione per ridurre le righe da scorrere.
- In *voce-3* e *voce-nome*, «Afspelen» al posto di «Opname beluisteren» lascia più spazio alla forma d’onda fra i pulsanti. Il titolo «Luister en kies een naam» e la scelta «Neem nu op» richiedono meno spazio verticale. In *voce-tratti* l’intervallo «0:12–0:24» lascia più spazio alla durata del parlato.
- In `nl_360x320_s1_scuro_2.png` e `nl_920x640_s1.75_scuro_2.png`, il campo del nome è sotto il bordo sfumato che precede il pulsante fisso. Anche l’elenco dei componenti in *info* e parte dei comandi di registrazione proseguono fuori dall’inquadratura. Queste aree sono scorrevoli nel sorgente. Ho accorciato il testo introduttivo e usato «Onderdelen» per il titolo dell’elenco.
- In *info* il titolo «Kalliope 0.4.0 · dimostrazione» è tagliato a 360×320. Il suffisso italiano e i nomi dei dispositivi in *voce-mic* vengono dai dati della demo. In `nl_360x320_s1_scuro_1.png` e `nl_920x640_s1.75_scuro_1.png` anche la frase italiana lunga in *scrive* continua oltre la parte visibile del campo. Nei fogli `nl_920x640_s1_scuro_1.png` e `nl_920x640_s1_scuro_2.png` a grandezza normale i comandi neerlandesi risultano leggibili.

## Dubbi residui

Nessun dubbio linguistico aperto. Le osservazioni visive si riferiscono ai sei fogli forniti prima delle correzioni. Le larghezze delle nuove diciture sono misure del carattere del programma.

## Applications menu

| Voce | Testo esatto | English back-translation |
| --- | --- | --- |
| GenericName | Spraaksynthese voor videobellen | Speech synthesis for video calling |
| Comment | Typ wat je wilt zeggen tijdens het videobellen | Type what you want to say during video calls |
| Keywords | tekst-naar-spraak;spraaksynthese;tts;stem;spreken;microfoon;videobellen;ondersteunde communicatie;oc;niet kunnen praten; | text to speech;speech synthesis;tts;voice;speak;microphone;video calling;augmentative and alternative communication;aac;being unable to talk; |

«Tekst-naar-spraak» descrive la funzione, «spraaksynthese» la tecnologia. «Niet kunnen praten» usa il verbo con cui il sito parla del bisogno della persona.
Il nome «ondersteunde communicatie» e la sigla OC permettono la ricerca con il lessico neerlandese degli ausili. [Regelhulp](https://www.regelhulp.nl/onderwerpen/welke-soort/communicatie/ondersteunde-communicatie)

Review: «Typ wat je wilt zeggen tijdens het videobellen» diventa «Typ zodat de anderen je kunnen horen tijdens het videobellen». «Typ» e «videobellen» riprendono la finestra. Come nella guida, «de anderen je kunnen horen» chiarisce che il testo arriva agli altri come voce.
