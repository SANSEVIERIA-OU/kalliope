# Portoghese di Kalliope

## Variante e tono

Un solo catalogo `pt` per Portogallo e Brasile. Il sito si rivolge a una persona con il **tu**, di solito sottinteso («escreve», «escolhe», «podes»). Nei pulsanti l’azione è all’infinito («Falar», «Parar», «Ouvir»). «Pronta» si riferisce alla voce.

Ho preferito parole comuni ai due paesi, fra cui «computador», «microfone», «gravação», «pasta», «teclado» e «navegador». Dove l’uso diverge ho scelto il portoghese europeo. Vale per «ficheiro», «descarregar», «palavra-passe», «aplicação», «telemóvel», «auscultadores», «altifalantes», «leitor de ecrã» e «terapeuta da fala». Anche «Transferências» per la cartella dei download, «carregar em Enter» e la forma progressiva «Estou a falar» seguono l’uso europeo. Nelle istruzioni uso «definições de áudio». Per il menu del prodotto cito «Configurações» in Zoom e «Sempre no topo» per la finestra.

## Glossario

| Italiano | Portoghese |
| --- | --- |
| voce | voz |
| voce propria | voz própria |
| registrazione | gravação |
| messaggio vocale | mensagem de voz |
| tratto di una registrazione | trecho |
| microfono virtuale | microfone virtual |
| riunione | reunião |
| finestra | janela |
| bolla | balão |
| riga di stato | linha de estado |
| cronologia | histórico |
| Invio | Enter |
| Di’ | Falar |
| Ferma | Parar |
| Altro | Mais |
| Crea la tua voce | Criar a tua voz |
| Senti anche tu la voce | Ouvir também a voz |
| Preparo la voce | Preparo a voz |
| Pronta | Pronta |
| Sto parlando | Estou a falar |
| La voce non parte | A voz não funciona |
| Manca il microfono | Falta o microfone |
| Nessuno ti sente | Ninguém te ouve |
| Attenzione | Atenção |
| Come si risolve | Como resolver |
| Torna a scrivere | Voltar à escrita |
| file | ficheiro |
| archivio da installare | ficheiro compactado |
| impronta SHA-256 | soma de controlo SHA-256 |

## Campioni e messaggi della finestra

Le frasi digitate, i frammenti pronunciati e i testi delle registrazioni restano in italiano. Fra questi c’è anche «Ci sono anch'io, scusate il ritardo.» nella pagina sullo stato. Il brano di `programma.crea.ciao-sono-io-questa` è invece in portoghese perché lo legge la persona al microfono quando registra la propria voce. Il programma continua a parlare solo italiano.

«A voz disse:» introduce le parole pronunciate nella terza registrazione. La spiegazione sotto i campioni usa la stessa etichetta. In `in.stato.voce.detto` compare il messaggio completo di `programma.voce.file-mancanti`. La guida cita la sua apertura «Não encontro os ficheiros da voz» in `ai.testo.21`. In `ai.testo.54` le due citazioni sono «Não consigo preparar a voz: …» e «Não consegui dizer esta frase: …». I puntini occupano il posto della causa che il sistema fornisce.

## Seconda lettura nella finestra

«Voltar à escrita» indica la destinazione del pulsante che chiude i passi della voce. «Expandir» riapre la finestra completa dalla modalità compatta. Per il lettore di schermo, «Diminuir o texto» e «Aumentar o texto» dicono che cosa fanno i due comandi. Negli stati «Preparo a voz» e «Estou a falar» è Kalliope a parlare in prima persona.

| Dove | Scelta e motivo |
| --- | --- |
| `pt_360x320_s1_scuro_2.png`, voce-1 e voce-errore | «Grava a tua voz agora» occupava tre righe nella scheda. «Grava já» conserva l’invito a registrare subito. |
| Stesso foglio, voce-2 e voce-suggerimento | Il conteggio andava su tre righe e il numero di secondi mancanti cadeva sotto il bordo. Con «7,4 s · +6 s», il primo valore indica il tempo registrato e il secondo quanti secondi di voce servono ancora. Ho accorciato anche le indicazioni sul livello e sul microfono. |
| Stesso foglio, voce-3, voce-nome e voce-crea | Tra «Ouvir a gravação» e «Recomeçar» restava una sola barretta della forma d’onda. «Ouvir», «Parar» e «Refazer» lasciano più spazio all’ascolto. «Ouve e dá-lhe nome» accorcia il titolo e «Que nome dás à voz?» la domanda sopra il campo. |
| Stesso foglio, voce-tratti | «Encontrei 3 trechos com voz» evita un giro di parole accanto a «Refazer». «Ouve e escolhe» mantiene esplicito il passo successivo. |

### Osservazioni sulle foto

- In `pt_360x320_s1_scuro_1.png` e `pt_920x640_s1.75_scuro_1.png`, scena «scrive», la riga inferiore del testo digitato si vede solo in parte sopra il pulsante. Le bolle su una sola riga mostrano solo una porzione delle frasi italiane lunghe, anche nella modalità compatta di `pt_920x640_s1_scuro_1.png`.
- In «info» di `pt_360x320_s1_scuro_2.png` il titolo della demo si interrompe dopo poche lettere di «dimostrazione». La parola è intera nei due fogli `pt_920x640_s1_scuro_2.png` e `pt_920x640_s1.75_scuro_2.png`. Il titolo e i nomi dei dispositivi «Cuffia USB» e «Microfono del portatile» arrivano dai dati dimostrativi in `crates/app/src/vista.rs`, come «La voce di Anna» e il nome del file Opus importato.
- In `pt_360x320_s1_scuro_2.png` e `pt_920x640_s1.75_scuro_2.png`, le scene della registrazione inquadrano solo parte del brano e dei comandi. Nei passi del nome e dei tratti, il margine sfumato sopra il pulsante fisso nasconde parte del contenuto nella posizione fotografata. Anche «voce-tratti» in `pt_920x640_s1_scuro_2.png` mostra solo l’inizio del campo del nome. Il pannello prevede lo scorrimento. Le foto documentano la posizione acquisita prima delle modifiche.

## Dubbio residuo

La dicitura del primo menu audio di Zoom può variare con la localizzazione di Zoom. Nel percorso ho usato «Configurações», «Áudio», «Microfone». Non ho verificato la dicitura in una sessione Zoom in portoghese.
