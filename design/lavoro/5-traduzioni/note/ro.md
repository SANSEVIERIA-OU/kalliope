# Romeno

Ho usato il romeno standard contemporaneo della Romania e il «tu». Le istruzioni si rivolgono direttamente a chi legge con verbi come „scrie”, „apasă” e „alege”. Nei messaggi in cui parla Kalliope ho mantenuto la prima persona, per esempio „Pregătesc vocea” e „Vorbesc”.

## Glossario

| Italiano | Romeno |
| --- | --- |
| riunione | întâlnire |
| app della riunione | aplicație de întâlniri |
| chiamata | apel |
| voce | voce |
| voce propria | voce proprie |
| frase | frază |
| frase della finestra, nella guida ai problemi | mesaj |
| microfono virtuale | microfon virtual |
| microfono del computer | microfonul calculatorului |
| registrazione | înregistrare |
| messaggio vocale | mesaj vocal |
| tratto di una registrazione | fragment |
| riga di stato | bară de stare |
| bolla | balon |
| cronologia | istoric |
| impostazioni audio | setări audio |
| cartella | dosar |
| pacchetto | pachet |
| impronta di un file | amprentă |
| scarica | Descarcă |
| copia | Copiază |
| Invio | Enter |
| Di’ | Spune |
| Ferma | Oprește |
| Altro | Altele |
| Torna a scrivere | Înapoi la scris |
| Pronta | Gata |
| Come si risolve | Cum rezolvi problema |
| Sempre in primo piano | Întotdeauna deasupra |

## Scelte e dubbi

Le registrazioni e gli esempi di testo da far pronunciare a Kalliope restano in italiano, compresa la frase digitata nella figura della pagina «Stato e limiti». Il brano di `programma.crea.ciao-sono-io-questa` è in romeno perché lo legge la persona al microfono per registrare la propria voce. La voce sintetica parla soltanto italiano.

Per il menu della finestra ho usato „Întotdeauna deasupra”, la traduzione di «Always on Top» nel catalogo romeno di GTK installato. I tre plurali distinguono, per esempio, „1 mesaj”, „2 mesaje” e „20 de mesaje”.

La simulazione di installazione riporta per intero il messaggio sui file mancanti. La guida cita lo stesso incipit, „Nu găsesc fișierele vocii”, e i due errori del motore, „Nu pot pregăti vocea: …” e „Nu am reușit să rostesc această frază: …”. Questo risolve i dubbi della prima traduzione. Sotto il terzo campione, „Rostit:” introduce le parole effettivamente pronunciate in italiano.

## Testi rivisti nelle foto

| Scena | Correzione e motivo |
| --- | --- |
| Barra principale a 360×320 | „Altele” occupa una sola parola al posto di „Mai multe” e lascia più spazio ai comandi del testo sulla destra. La descrizione per chi usa un lettore di schermo e le tre citazioni sul sito seguono il nuovo nome. |
| `voce-importa`, `voce-3`, `voce-nome`, `voce-tratti` | Il nome del passo usciva dal bordo destro. Il primo ora appare come „1/3 · Înregistrare sau import” e l’ultimo come „3/3 · Ascultă și dă-i un nume”. |
| `voce-1`, `voce-errore` | „Înregistrează-ți vocea acum” si spezzava sul trattino e invadeva il bordo della scheda. „Te înregistrezi acum” usa parole più strette. Ho accorciato le istruzioni mantenendo la lettura ad alta voce, i 12 secondi e il consiglio su quando registrarsi. L’altra scelta usa lo stesso tu, „Folosești înregistrări vechi”. |
| `voce-mic`, `voce-2`, `voce-suggerimento` | „Apasă pe cerc și citește” identifica il pulsante rotondo. Durante la registrazione „7,4 s · încă 6 s” distingue il tempo trascorso da quello ancora necessario. La vecchia formula mandava la durata su più righe, fino al bordo inferiore. Ho accorciato anche la spiegazione del misuratore. |
| `voce-3`, `voce-nome`, `voce-crea` | Il pulsante „Ascultă înregistrarea” lasciava alla forma d’onda lo spazio di una sola barretta a 360×320. „Ascultă” e „Oprește” indicano le due azioni. „Refă” invita a rifare la registrazione. Il titolo „Ascult-o și dă-i un nume” evita di ripetere „vocea”. |
| `voce-tratti` | Nel primo frammento anche l’intervallo di tempo andava a capo prima di „voce”. „Fragment 1 · cel mai clar” e „0:12–0:24 · 12 s de voce” conservano numero, confronto e durata. |

## Limiti visibili nei sei fogli

- In `ro_360x320_s1_scuro_1.png`, la barra si interrompe all’altezza di „100%” e „A+” resta fuori vista. Nelle scene di scrittura e cronologia le frasi italiane mostrano solo una parte del testo. Sono il contenuto digitato o pronunciato dalla persona.
- In `ro_360x320_s1_scuro_2.png`, il titolo di `info` taglia „dimostrazione”. La demo aggiunge quella parola alla versione nel codice. Anche i nomi italiani dei dispositivi, del file importato e della voce di Anna provengono dai dati della demo. In `voce-mic` e durante la registrazione si vede solo la fine del brano. In `voce-3` e `voce-nome` il campo del nome è sotto il limite visibile, appena sopra il pulsante fisso. Queste schermate dei passi hanno scorrimento verticale.
- In `ro_920x640_s1.75_scuro_1.png` la frase italiana digitata in `scrive` continua sotto il bordo del campo, e la bolla compatta ne mostra una sola riga. In `ro_920x640_s1.75_scuro_2.png` l’inquadratura della registrazione inizia a metà del brano e lascia parte dei suggerimenti sotto il bordo. In `voce-tratti` si vede il primo frammento sopra il pulsante fisso.
- In `ro_920x640_s1_scuro_1.png` la bolla compatta mostra una parte della frase italiana sulla sua unica riga. In `ro_920x640_s1_scuro_2.png` le etichette romene sono leggibili al 100%. In `voce-tratti` il campo del nome prosegue sotto il limite visibile della zona scorrevole.

I sei fogli documentano la versione precedente alle correzioni. Per le nuove etichette ho confrontato anche le larghezze con il carattere Lexend del progetto. La resa finale della barra e delle schede a 360×320 resta da verificare in una nuova cattura.

## Applications menu

| Campo | Testo del menu | Retrotraduzione inglese |
| --- | --- | --- |
| GenericName | Voce pentru apeluri video | Voice for video calls |
| Comment | Scrii, iar ceilalți te aud în apelurile video | You type, and the others hear you on video calls |
| Keywords | `sinteză vocală;tts;voce;vorbire;microfon;apel video;comunicare augmentativă și alternativă;caa;aac;nu pot vorbi;` | speech synthesis; TTS; voice; speaking; microphone; video call; augmentative and alternative communication; CAA; AAC; I can’t speak |

«Sinteză vocală» nomina la tecnologia. «Apel video» viene dalla finestra e «nu pot vorbi» esprime il bisogno con le parole del sito.
Accanto alla locuzione romena ho incluso «caa» e «aac», entrambe usate nella stessa guida scolastica. [CJRAE Ilfov](https://www.cjrae-ilfov.ro/wp-content/uploads/2026/09/GHID_AMBASADORII-ANTIBULLYING-SI-MEDIEREA-INTRE-EGALI.pdf)

Review: no change. «Scrii, iar ceilalți te aud» riprende il tu della home e colloca l’ascolto nella videochiamata. La guida citata usa entrambe le sigle, CAA e AAC.
