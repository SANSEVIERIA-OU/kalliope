# Gaeilge · irlandese

Ho usato l’irlandese scritto standard, secondo l’uso del *Caighdeán Oifigiúil*. Mi rivolgo a una persona con *tú* e *do*, e con l’imperativo singolare nei pulsanti e nelle istruzioni (*Scríobh*, *Roghnaigh*, *Éist*). Nel riquadro della persona che scrive uso la forma enfatica *Tusa*. Quando Kalliope riferisce ciò che sta facendo, uso la prima persona. *Táim ag ullmhú an ghutha* significa «Sto preparando la voce» e *Táim ag caint* significa «Sto parlando».

## Glossario

| Italiano | Gaeilge |
| --- | --- |
| voce | guth |
| la tua voce | do ghuth féin |
| voce propria, nel menu | guth pearsanta |
| frase | abairt |
| registrazione | taifeadadh |
| tratto di registrazione | sliocht |
| messaggio vocale | teachtaireacht ghutha |
| microfono | micreafón |
| microfono virtuale | micreafón fíorúil |
| riunione | cruinniú |
| app della riunione | aip an chruinnithe |
| finestra | fuinneog |
| riga di stato | líne stádais |
| cronologia | stair |
| impostazioni audio | socruithe fuaime |
| pacchetto | pacáiste |
| impronta | méarlorg |
| cartella | fillteán |
| scarica | Íoslódáil |
| ascolta | Éist |
| di’ | Abair |
| ferma | Stad |
| pronta | Réidh |
| sto parlando | Táim ag caint |
| nessuno ti sente | Ní chloistear thú |
| come si risolve | An réiteach |
| altro | Eile |

## Casi particolari

- Le tre frasi della dimostrazione, i frammenti sincronizzati, le abbreviazioni e la frase digitata in `st.varco.scritto` restano in italiano. L’etichetta `frase.3.detto-etichetta` è *Ráite:*. La voce `frase.3.detto-frase` contiene la frase italiana esattamente come viene pronunciata, con la punteggiatura dell’originale. Il breve testo di `programma.crea.ciao-sono-io-questa` è in irlandese perché è la persona a leggerlo al microfono per registrare il proprio timbro. Il programma parla solo italiano.
- Per i tasti ho usato *Enter*, *Esc*, *Tab* e *Alt+Space*. Per il comando della finestra ho seguito la dicitura del catalogo irlandese di Mutter, *Ar Barr i gCónaí*. In Zoom le istruzioni descrivono in irlandese i socruithe fuaime e riportano il percorso inglese *Settings → Audio → Microphone*.
- Le guide riportano i messaggi nella lingua della finestra. `in.stato.voce.detto` riproduce per intero il messaggio sui file mancanti e `ai.testo.21` ne cita l’inizio. In `ai.testo.54` i due esempi riprendono alla lettera gli errori del motore e i puntini di sospensione occupano il posto della causa fornita dal sistema.

## Seconda lettura con la finestra

Ho confrontato le 175 voci del programma con l’italiano, le annotazioni disponibili e la funzione del testo. *Fill ar an mbosca téacs* riporta al campo dove si scrive. *Cén guth?* introduce l’elenco delle voci tra cui scegliere. Le citazioni e le ricostruzioni sul sito usano le stesse parole della finestra.

| Dove | Testi accorciati | Motivo |
| --- | --- | --- |
| Barra e messaggi | *Tuilleadh* → *Eile*, *Conas é a réiteach* → *An réiteach*, *I gceann nóiméid.* → *Go luath.* | Nella barra stretta manca spazio a destra per A+. Il pulsante di aiuto deve lasciare posto alla causa del problema. Il segnaposto indica un’attesa breve senza promettere un minuto. |
| Informazioni e scelta della registrazione | *Suíomh Kalliope*, *Má tá guth agat fós*, *Taifead anois* | Il pannello ha una colonna stretta. Sul primo pulsante della procedura si può sottintendere il pronome che indica la voce. |
| Registrazione | *Brúigh an ciorcal agus léigh*, *{0} · {n} s eile* | A 360×320 il conteggio mandava *shoicind eile* su righe diverse fino al bordo. Il simbolo dei secondi è lo stesso usato per il tempo trascorso. Ho ridotto anche le istruzioni sul livello audio e l’avviso del microfono. |
| Ascolto e nome | *Éist agus ainmnigh*, *Éist agus ainmnigh é*, *Éist siar*, *Stad*, *Cén t-ainm atá air?* | Nel terzo passo il nome della tappa usciva a destra. Il pulsante di ascolto comprimeva la forma d’onda e spingeva *Déan arís* fuori dalla finestra. Il titolo e la domanda più brevi lasciano spazio al campo del nome. |
| Scelta del tratto e attesa | *An sliocht is soiléire · {numero}*, *sliocht cainte*, *Ainmnigh an guth* | Nel primo tratto *soiléire* rimaneva da solo sulla riga successiva. Ho accorciato anche il riepilogo dei tratti, la nota sulla ricerca nei primi minuti e il messaggio di attesa per ridurre le righe sopra il pulsante finale. |

### Cosa mostrano i sei fogli

Le osservazioni si riferiscono alle foto fornite, precedenti alle correzioni. Nel codice le viste della procedura e i crediti hanno un’area scorrevole. La posizione raggiungibile con mouse o tastiera richiede una prova nella finestra aggiornata.

- `ga_360x320_s1_scuro_1.png` — La barra termina dopo «100%» e A+ resta fuori dall’immagine. In `scrive` si vede solo parte della bozza. Le bolle della cronologia e del parlato mostrano una sola riga della frase italiana.
- `ga_360x320_s1_scuro_2.png` — In `voce-3`, `voce-nome` e `voce-crea` il comando *Déan arís* esce a destra. Nei primi due riquadri il piè di pagina lascia appena intravedere la domanda sul nome. In `voce-2` e `voce-suggerimento` si vedono la fine del brano da leggere e una parte dei controlli di registrazione. In `voce-1`, `voce-errore` e `voce-tratti` le scelte proseguono oltre il bordo inferiore. In `info` si tronca il titolo dopo il numero di versione. Il suffisso italiano «dimostrazione» viene aggiunto direttamente dalla demo.
- `ga_920x640_s1.75_scuro_1.png` — Nella bozza lunga il margine inferiore attraversa una riga. Nelle due viste compatte la bolla mostra solo una porzione della frase italiana.
- `ga_920x640_s1.75_scuro_2.png` — In `info` l’elenco dei componenti si interrompe sopra *Dún*. In `voce-mic`, `voce-2` e `voce-suggerimento` l’inizio del brano è fuori vista e negli ultimi due casi il consiglio accanto al pulsante di registrazione è tagliato in basso. In `voce-3` e `voce-nome` il piè di pagina è subito sotto il campo e il consenso non compare nello scatto. Si vede solo il primo tratto in `voce-tratti`.
- `ga_920x640_s1_scuro_1.png` — Nella finestra normale i comandi e gli stati sono leggibili. In modalità compatta il testo italiano della bolla continua oltre la singola riga.
- `ga_920x640_s1_scuro_2.png` — Le tre tappe e i comandi di ascolto sono leggibili. In `voce-tratti` la sfumatura del piè di pagina copre gran parte del campo del nome. I nomi dei dispositivi, del file e della voce di esempio sono dati della demo.

## Dubbio residuo

I nomi dei menu audio possono variare con la lingua e la versione di Zoom. Non ho verificato una dicitura ufficiale irlandese per quel percorso.
