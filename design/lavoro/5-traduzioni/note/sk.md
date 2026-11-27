# Slovacco (sk)

Ho usato lo slovacco standard della Slovacchia e il *vykanie*, la forma di cortesia comune nelle istruzioni rivolte al pubblico. I verbi sono alla seconda persona plurale, come in «Napíšte vetu a stlačte Enter». I pronomi nel corpo della frase hanno la minuscola (*vy*, *vás*, *váš*). Sui pulsanti uso l’infinito, per esempio *Vysloviť* e *Zastaviť*. Quando Kalliope parla in prima persona, uso il femminile (*Našla som*). Lo stato *Pripravený* concorda invece con *hlas*, il nome maschile della voce pronta a parlare.

## Glossario

| Italiano | Slovacco |
| --- | --- |
| voce | hlas |
| voce propria | vlastný hlas |
| Crea la tua voce | Vytvoriť vlastný hlas |
| Senti anche tu la voce | Počuť hlas aj u seba |
| registrazione | nahrávka |
| registrare | nahrať |
| messaggio vocale | hlasová správa |
| tratto di una registrazione | úsek nahrávky |
| microfono virtuale | virtuálny mikrofón |
| riunione | stretnutie |
| app della riunione | aplikácia na stretnutia |
| frase | veta |
| frase della finestra (nell’aiuto) | hlásenie |
| riga di stato | stavový riadok |
| cronologia | história |
| Di’ | Vysloviť |
| Ferma | Zastaviť |
| Altro | Viac |
| Pronta | Pripravený |
| Preparo la voce | Pripravujem hlas |
| Sto parlando | Hovorím |
| Nessuno ti sente | Nikto vás nepočuje |
| Manca il microfono | Chýba mikrofón |
| La voce non parte | Hlas sa nespustil |
| Attenzione | Upozornenie |
| Come si risolve | Ako to vyriešiť |
| impronta del file | kontrolný súčet |
| pacchetto | balík |

## Esempi vocali e nomi dei comandi

Gli esempi che Kalliope deve pronunciare sono in italiano, compresa la frase digitata nella pagina «Stato e limiti» (`st.varco.scritto`) e la parola del comando `kalliope --say "prova"`. Il brano di `programma.crea.ciao-sono-io-questa` è in slovacco perché lo legge la persona davanti al microfono per registrare la propria voce. La sintesi continua a parlare soltanto italiano.

Per «Sempre in primo piano» ho usato *Vždy navrchu*, la dicitura del catalogo slovacco di GTK. Per Zoom la guida spiega il percorso in slovacco e riporta anche le etichette inglesi *Settings*, *Audio* e *Microphone*. Non ho verificato le diciture in un client Zoom in slovacco.

## Revisione della finestra

Ho riletto le 175 voci del programma con le rispettive note. *Späť k písaniu* riporta al campo di scrittura. *Začať znova* fa ripartire la creazione della voce. *Rozbaliť* riapre la finestra intera dal modo compatto. Sul sito lo stato *Pripravený* ha la stessa forma anche nel testo alternativo dell’immagine e nell’esempio di ricerca dell’aiuto.

I tre messaggi aggiornati della guida riprendono le parole della finestra. Il testo sui file mancanti in «Installa» è integrale. L’aiuto ne cita l’inizio, *Nenašla som súbory hlasu*, e per i due errori del motore mostra i due incipit con i puntini al posto della causa di sistema. *Vyslovené:* è l’etichetta slovacca. La frase che la segue riproduce l’italiano, virgolette comprese.

### Testi accorciati

| Scena | Scelta e motivo |
| --- | --- |
| Prima fase della creazione | *Nahrať či importovať* conserva le due alternative nel titolo di passo che usciva a destra in `voce-importa`. *Čítať nahlas* e *Prehrať a pomenovať* usano la stessa forma negli altri due passi. *Nahrajte sa teraz* accorcia il titolo della scheda e «12» lascia più spazio alle istruzioni. |
| Registrazione | In `voce-2` e `voce-suggerimento` il conto «7,4 s · chýba 6 sekúnd» occupava tre righe. Ora si legge *7,4 s · ešte 6 s*. La prima durata è il tempo registrato, la seconda è il parlato che manca. Il simbolo *s* vale per tutte e quattro le forme plurali e resta unito al numero. *Stlačte kruh a čítajte* indica il pulsante rotondo. Ho accorciato anche le istruzioni sul livello e sul secondo tocco che ferma la registrazione. |
| Ascolto e nome | In `voce-3`, `voce-nome` e `voce-crea` il lungo *Vypočuť si nahrávku* lasciava visibile solo l’inizio del comando a destra. Con *Prehrať* e *Zastaviť* il primo pulsante resta corto in entrambi gli stati. *Začať znova* distingue il comando accanto da un secondo ascolto della stessa registrazione. |
| Importazione e scelta del tratto | In `voce-importa`, *Čítam „{}“…* lascia più spazio al nome del file. *Hľadám úsek, kde hlas počuť najlepšie* spiega la ricerca. In `voce-tratti` ho accorciato *najzreteľnejší hlas* in *najčistejší hlas* accanto al pulsante *Prehrať*. Anche l’avviso di creazione in corso è più breve nel pannello stretto. |
| Informazioni | Ho accorciato il paragrafo che in `info` appariva già a metà. Conserva chi sente la voce, dove viene generata e dove resta il testo. |

### Cosa mostrano i sei fogli

- `sk_360x320_s1_scuro_1.png` e `sk_920x640_s1.75_scuro_1.png` — in `scrive` l’ultima riga italiana visibile è tagliata in basso sopra i comandi. Il campo scorre per seguire il cursore. In modalità compatta la bolla mostra una sola riga e, durante la lettura, segue la parola pronunciata.
- `sk_360x320_s1_scuro_2.png` — il titolo fisso «Kalliope 0.4.0 · dimostrazione» esce dal bordo di `info`. Il suffisso è scritto nel codice della demo. In `voce-mic`, `voce-2` e `voce-suggerimento` si vede soltanto la fine del brano da leggere. In `voce-3` e `voce-nome` il bordo sfumato sopra il pulsante fisso intercetta l’etichetta del nome. La pagina delle voci prevede lo scorrimento verticale.
- `sk_920x640_s1.75_scuro_2.png` — con il testo al 175% in `voce-2` e `voce-suggerimento` la spiegazione sotto il conteggio prosegue oltre il bordo. In `voce-tratti` si vede soltanto il primo tratto prima del piè di pagina fisso. I nomi dei microfoni e del file sono dati della demo.
- `sk_920x640_s1_scuro_1.png` e `sk_920x640_s1_scuro_2.png` — a dimensione normale i comandi principali sono leggibili. In `compatta-parla` si vede parte della frase italiana sulla riga che scorre. In `voce-tratti` si vedono tutte e tre le opzioni, mentre il campo del nome continua sotto il bordo visibile del pannello.

Le foto documentano la traduzione precedente alle correzioni. Ho confrontato la larghezza delle etichette di ascolto con il carattere Lexend del progetto. Rimane da verificare su un nuovo fotogramma la resa finale a 360×320. L’unica dicitura esterna non verificata nel relativo programma è il percorso di Zoom indicato sopra.
