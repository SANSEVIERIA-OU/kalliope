# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Dati scritti a mano della direzione di Kalliope: criteri, regole, ambizione, decisioni.
Le fonti (riferimento, caratteristica, ambito) si prendono dalle righe di confronto.json con F() e FE().
"""
from direzione_lib import F, FE, unisci

F1 = 'F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità)'
F2 = 'F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento'
F3 = 'F3 chi controlla (IT, privacy, legale, acquisti)'
F4 = 'F4 chi installa, per sé o per un altro, e chi pacchettizza'
F5 = 'F5 chi guarda da fuori (stampa, associazioni, ricercatori)'

CONCORRENTI = ['R50', 'R51', 'R52']

CRITERI = [
    {'id': 'K1', 'testo': 'Compito: la persona arriva in pochi minuti dal capire all\'avere la voce in una riunione (P1-P6 di progetto.md), e ogni pagina dice qual è la prossima azione.'},
    {'id': 'K2', 'testo': 'Leggerezza: nessuna richiesta a terzi, nessun cookie, nessun carattere remoto, nessun passo di build (progetto.md §9, vincolo del proprietario).'},
    {'id': 'K3', 'testo': 'Leggibilità: testo del corpo con contrasto di almeno 7:1, elementi grafici con almeno 3:1, nessuna informazione affidata al solo colore.'},
    {'id': 'K4', 'testo': 'Distinzione: il sito non si confonde con i concorrenti diretti (R50 Text-to-Mic, R51 Proloquo, R52 Grid) né con un modello generico di vetrina di prodotto.'},
    {'id': 'K5', 'testo': 'Continuità: l\'unico segno di marca esistente, l\'icona dell\'app (bolla verde acqua con cinque barre), guida colore, forma e motivo.'},
    {'id': 'K6', 'testo': 'Prevedibilità: nulla si muove, suona o compare senza che la persona lo abbia chiesto (persone con mutismo selettivo e autismo, interruttori e tremore).'},
]

REGOLE = [
    {'id': 'RG1', 'testo': 'Ogni valore ha una fonte oppure una motivazione progettuale dichiarata, legata a persona, compito o ambizione.', 'fonte': 'references/direzione.md §3'},
    {'id': 'RG2', 'testo': 'Movimento ridotto, senza JavaScript, tastiera, testo grande, colori forzati e dispositivi lenti sono ripieghi, non divieti: ogni effetto ha un equivalente che conserva informazione e controllo.', 'fonte': 'references/direzione.md §2'},
    {'id': 'RG3', 'testo': 'Nessun suono parte da solo e nessun video si avvia senza un gesto; ogni suono ha accanto il testo identico, la durata e un solo ascolto per volta.', 'fonte': 'progetto.md P2, regole'},
    {'id': 'RG4', 'testo': 'Lo stato (versione di prova, solo Linux, non provato in una riunione vera) sta prima di ogni promessa, nella stessa schermata, senza ritardo.', 'fonte': 'progetto.md P1 e §9'},
    {'id': 'RG5', 'testo': 'Il contenuto non dipende da un effetto né da uno script: tutto il testo e i comandi essenziali stanno nel documento HTML e si vedono subito; gli script aggiungono, non sostituiscono.', 'fonte': 'progetto.md §9; references/direzione.md §2'},
    {'id': 'RG6', 'testo': 'Nessun movimento che la persona non ha provocato. Ogni movimento porta un\'informazione (un cambio di stato), dura al più 240 ms, salvo quello legato a un suono che dura quanto il suono; con movimento ridotto è sostituito, non solo tolto.', 'fonte': 'progetto.md §4.2 (mutismo selettivo, autismo, interruttore); decisione progettuale di design-build'},
    {'id': 'RG7', 'testo': 'Nessuna richiesta a terzi, nessun cookie, nessuna statistica, nessun embed: i collegamenti in uscita sono azioni della persona.', 'fonte': 'progetto.md §9, vincolo [P]'},
    {'id': 'RG8', 'testo': 'Frasi di 15-20 parole al massimo nei testi che servono un\'azione, un\'idea per frase, parole comuni; il termine nuovo si spiega al primo uso con una frase sola; seconda persona nelle istruzioni.', 'fonte': 'ricerca/registro-italiano.md (G01-G04); progetto.md §4.2 (afasia)'},
    {'id': 'RG9', 'testo': 'Ogni comando si raggiunge da tastiera, ha un bersaglio di almeno 44×44 px con 8 px di distanza, non dipende dal passaggio del mouse né dal tempo, e lo scorrimento resta quello nativo.', 'fonte': 'progetto.md §4.2 (SLA, sensori, puntamento oculare); WCAG 2.5.8'},
    {'id': 'RG10', 'testo': 'I nomi del prodotto sono identici a quelli dell\'app: Kalliope, «Scarica la voce», «Parla», «Ferma», «Senti anche tu», «Già detto», Giulia, Marco; le frasi di stato citate sono quelle vere della finestra.', 'fonte': 'progetto.md §5, contratto di identità'},
    {'id': 'RG11', 'testo': 'Versioni, nomi di file, dimensioni, collegamenti di scarico e impronte vengono solo dai segnaposto di tools/site.py, mai scritti a mano.', 'fonte': 'progetto.md §9; tools/site.py'},
    {'id': 'RG12', 'testo': 'Le promesse che il sito non può fare (funziona con Zoom, Teams o Meet; open source; gratis per ogni uso; Windows, macOS o telefono; con la tua voce; in tempo reale; nessuna connessione; dispositivo medico) non compaiono mai come fatti.', 'fonte': 'progetto.md §7'},
    {'id': 'RG13', 'testo': 'Le persone sono «persone»: la condizione si nomina solo quando serve e con il nome che usano loro; mai «malato» o «paziente» per chi usa Kalliope.', 'fonte': 'ricerca/registro-italiano.md, «Cosa si porta a Kalliope»'},
    {'id': 'RG14', 'testo': 'Ogni cifra dice dove è stata misurata e dove si rifà; ciò che non è stato misurato lo dice.', 'fonte': 'progetto.md P8 e §2.3'},
]

REGOLE_PROPOSTE = [
    {'id': 'RG15', 'testo': 'Un ripiego per il movimento ridotto sostituisce l\'effetto con un equivalente che porta la stessa informazione (per esempio, evidenziazione fissa al posto del movimento), non si limita a toglierlo.',
     'fonte': 'design-build (costruzione): nei 13 siti con la riga «effetti con movimento ridotto» misurata dai visitatori nessuno sostituisce un effetto (sostituiti 0 in tutte le varianti); references/direzione.md §2 chiede di ridurre o sostituire, non togliere. Da accogliere in references/direzione.md come esempio di ripiego.'},
    {'id': 'RG16', 'testo': 'Quando un sito deve dire «non è per te», lo dice al primo incontro, nella stessa schermata della promessa, con il motivo e un passo successivo.',
     'fonte': 'design-build (costruzione): nessuno dei 13 riferimenti dice «non è per te» al primo schermo (confronto.json, riga «stato e limiti dichiarati · arrivo computer»); progetto.md P6.'},
]

AMBIZIONE = [
    {'id': 'A1', 'cosa': 'Mostra la frase scritta e la stessa frase detta, una accanto all\'altra, con la voce vera: sotto ogni campione compare ciò che la persona digita («14/3», «15:30», «1.250 € + IVA») e ciò che la voce pronuncia («quattordici marzo», «quindici e trenta», «milleduecentocinquanta euro più IVA»), e la frase in corso si evidenzia mentre suona. Un solo ascolto per volta, mai automatico, sei registrazioni vere di Kalliope 0.1-rc.1 senza ritocchi.',
     'persone': [F1, F2, F3], 'dove': 'Primo schermo della pagina iniziale, sul computer e sul telefono (una frase con cifre e importi, una voce, il comando «Ascolta Giulia» senza scorrere) e pagina «Ascolta» (due voci, tre frasi); momento: appena arrivati, prima di decidere di installare.',
     'come_si_riconosce': 'Chi ha ascoltato ricorda che le cifre erano state lette come parole e ha visto quali; chi non può ascoltare ha già letto la stessa cosa. Nessun riferimento mostra la trasformazione da scritto a detto: R03 accoppia suono e testo solo in una conversazione registrata; R05 e R51 hanno suono senza testo; R50 ha la voce soltanto nel video di 8 minuti.',
     'destinazioni': ['componente ascolto (variante del primo schermo)', 'componente scritto-detto', 'token colore voce e barre', 'pagina Ascolta']},
    {'id': 'A2', 'cosa': 'Mette lo stato prima della promessa, con la prova: nella stessa schermata che dice cosa fa Kalliope, un cartellino a tre colonne dice che cosa è provato (voce fino al microfono, con un PipeWire privato), che cosa non è ancora provato (Zoom, Teams, Meet su un desktop reale) e che cosa non esiste (Windows, macOS, telefono, clonazione); chi non può usarlo ancora lo legge subito, con il motivo e un passo.',
     'persone': [F1, F2, F3, F5], 'dove': 'Home: riga di stato sotto il titolo nel primo schermo (anche al telefono) e cartellino subito dopo; pagina «Stato e limiti» con la tabella app per app; ogni pagina del percorso porta la riga corta dello stato.',
     'come_si_riconosce': 'Una persona vede «non ancora provato in una riunione vera» prima di vedere «Scarica» e ricorda che il sito non ha promesso. Solo R21 e R22 mettono una dichiarazione prima del testo (generato da IA, sponsor, commissioni) e nessuno dichiara cosa non è stato provato; R53 scrive il limite in fondo alla pagina; R50 non dice nulla su qualità o ritardo; nessuno dice «non è per te» al primo schermo.',
     'destinazioni': ['componente stato (cartellino)', 'componente tabella provato/non provato', 'composizione apertura', 'pagina Stato e limiti', 'pagina Non ancora']},
    {'id': 'A3', 'cosa': 'Riconosce le frasi che la finestra di Kalliope mostra: la pagina Aiuto è un indice delle frasi vere dell\'app («Nessuna chiamata sta usando il microfono «Kalliope»…», «La voce è pronta, ma PipeWire is not available…»), ciascuna con la causa e l\'azione; chi legge la frase la trova scrivendone una parte (con JavaScript) o scorrendo un elenco di soli collegamenti (senza).',
     'persone': [F1, F2, F4], 'dove': 'Pagina Aiuto, raggiunta anche da un segnalibro e dal piede di ogni pagina; momento: la persona è in una riunione o sta per entrarvi e qualcosa non va.',
     'come_si_riconosce': 'La persona dice «ha riconosciuto il mio messaggio». R52 (Hub) indicizza per domande dei prodotti, R51 e R52 hanno una ricerca che a vuoto non propone alternative; nessuno indicizza l\'aiuto sulle parole che il prodotto stesso mostra, né dichiara «non so» per le cause non provate.',
     'destinazioni': ['componente scheda-frase', 'componente filtro', 'pagina Aiuto']},
    {'id': 'A4', 'cosa': 'Fa vedere la voce senza imporre movimento: le cinque barre dell\'icona diventano l\'indicatore del suono (si alzano seguendo la voce mentre suona, con JavaScript), e il ripiego per il movimento ridotto le sostituisce con la frase evidenziata e la posizione scritta («frase 1 di 2, 00:03»), perché porta la stessa informazione: dove siamo nella voce.',
     'persone': [F1, F2], 'dove': 'Componente ascolto, in ogni pagina in cui compare; è l\'unico movimento espressivo del sito.',
     'come_si_riconosce': 'Una persona sorda vede la voce muoversi e leggere; una persona con mutismo selettivo o autismo vede muoversi qualcosa solo dopo averlo chiesto. Dei 13 siti con la riga «effetti con movimento ridotto» misurata, 0 sostituiscono un effetto (7 non cambiano nulla, 6 ne tolgono almeno uno); R06 usa barrette per l\'interruttore del suono ma non le lega a una voce.',
     'destinazioni': ['componente ascolto (barre e frase evidenziata)', 'token durate e movimento', 'variante prefers-reduced-motion', 'motivo barre (token forma)']},
    {'id': 'A5', 'cosa': 'Guida l\'installazione con comandi veri e un controllo dopo ogni passo: per Debian/Ubuntu, Fedora, Arch e le altre distribuzioni, ogni passo ha il comando copiabile, «come sai che è andata bene», «se non è andata» e il punto da cui riprendere; un familiare che si ferma al terminale sa che cosa fare.',
     'persone': [F2, F4, F1], 'dove': 'Pagina Installa e pagina Usalo in una riunione; momento: dopo aver deciso, davanti al terminale o a un messaggio di errore.',
     'come_si_riconosce': 'Chi installa per un altro dice «mi diceva come capire se era riuscito». Nei due siti con una guida all\'installazione (R05 un paragrafo, R50 quattro passi) non c\'è alcun comando da copiare, nessuna verifica del risultato, nessuna ripresa; R53 non ha installazione.',
     'destinazioni': ['componente passi', 'componente comando copiabile', 'componente controllo/se-non-va', 'pagine Installa e Riunione']},
]

# Gruppi di fonti per righe di struttura (tutte le varianti della riga)
TUTTI = None

D = []


def d(id, esito, fonti, destinazione, persona, compito, motivo, **k):
    x = {'id': id, 'esito': esito, 'fonti': fonti, 'destinazione': destinazione, 'persona': persona, 'compito': compito, 'motivo': motivo}
    x.update(k)
    D.append(x)


SENZA_JS = ['senza_js']
RIDOTTO = ['movimento_ridotto']

# ---------------------------------------------------------------- Primo schermo, navigazione, struttura
d('D01', 'adattata', unisci(F('proposta del primo schermo')), 'composizione Apertura (home): titolo, riga di stato, riquadro «Tu scrivi / Kalliope dice» con il comando d\'ascolto, frase, cartellino, azioni',
  F1 + ' / ' + F2, 'P1 capire in pochi secondi cosa fa, per chi è, cosa serve',
  'La proposta dei riferimenti va da 3 a 75 parole; la persona di Kalliope ha bisogno di una sola frase chiara e del limite (solo Linux) nello stesso schermo.',
  adattamento='Titolo corto; sotto, una riga di stato («Versione di prova: solo per Linux, non ancora provata in una riunione vera»); accanto (computer) o subito dopo (telefono) il riquadro scritto/detto con una frase, una voce e il comando «Ascolta Giulia» interi nel primo schermo a 1440×900 e a 390×844; la frase che dice cosa fa e per chi è viene dopo il riquadro al telefono; il cartellino segue. La foto della finestra, per due terzi vuota, scende più in basso e si rimpicciolisce. Nessun testo sopra un\'immagine.',
  ambizione=['A2'], regole=['RG4', 'RG8', 'RG12'], prova='site/sistema/#c-apertura', verifica='esame-impaginazione a 1440×900 e 390×844; lettura a testo 200%')
d('D02', 'adattata', unisci(F('comandi visibili al primo schermo')), 'composizione Apertura: tre comandi + barra a cinque voci',
  F1 + ' / ' + F2, 'P1 scegliere la prossima azione',
  'I riferimenti mostrano da 1 a 21 comandi al primo schermo; le barre aziendali di R50 e R51 aggiungono scelte che non servono al compito.',
  adattamento='Cinque voci di navigazione per compito e nel corpo: il comando d\'ascolto del riquadro (principale), «Scarica e installa» e «Non uso Linux: cosa posso fare» (collegamento). Al telefono «Scarica e installa» viene dopo il cartellino di stato. Nessun comando flottante né chat.',
  ambizione=['A2'], regole=['RG9'], prova='site/sistema/#c-nav', verifica='conteggio dei comandi al primo schermo con esame-impaginazione')
d('D03', 'adattata', unisci(F('comando principale')), 'componente bottone primario nella composizione Apertura',
  F1, 'P1 arrivare all\'ascolto con un gesto',
  'Il comando principale dei riferimenti sta al centro o in basso, spesso fisso allo scorrimento; per chi usa un interruttore un comando che si sposta o copre il testo è un ostacolo.',
  adattamento='Il comando principale è «Ascolta Giulia» dentro il riquadro del primo schermo, non fisso allo scorrimento, 48 px di altezza, etichetta con il verbo; «Scarica e installa» è il secondo bottone pieno, dopo lo stato. Nessuna barra fissa che copra il testo a zoom 200%.',
  requisiti_funzionali=['zoom', 'tastiera'], ripiego='Senza script il riquadro ha i controlli nativi dell\'audio e il collegamento al file; «Scarica e installa» è un collegamento. Funzionano con tastiera e a qualunque ingrandimento.',
  ambizione=['A1'], regole=['RG9'], prova='site/sistema/#c-bottone', verifica='prova tastiera: Tab fino al comando; testo 200%')
d('D04', 'adattata', unisci(F('struttura della navigazione')), 'componente nav: elenco di cinque voci per compito, sempre visibile',
  F1 + ' / ' + F2, 'P1-P6 sapere dove andare',
  'Menu a comparsa e pannelli dei riferimenti dipendono da JavaScript o dal passaggio del mouse; cinque voci stanno in due righe anche a 360 px.',
  adattamento='Elenco semplice di cinque voci (Ascolta, Stato e limiti, Installa, Usalo in una riunione, Aiuto) più «Come è fatto questo sito» nel piede; la voce corrente è segnata con testo e sottolineatura, non solo con il colore. Nessun menu a tre barre.',
  requisiti_funzionali=SENZA_JS + ['tastiera', 'testo_grande'], ripiego='La barra è già un elenco di collegamenti: senza script resta uguale; a testo grande va a capo.',
  ambizione=['A2'], regole=['RG5', 'RG9'], prova='site/sistema/#c-nav', verifica='esame-impaginazione a 390×844 e testo 200%')
d('D05', 'adattata', unisci(F('porte per pubblici diversi')), 'componente nav per compito + elenco «Chi sei?» con quattro collegamenti nella home',
  F2 + ' / ' + F3, 'P3 e P7 trovare le informazioni che servono al proprio ruolo',
  'Le porte per compito (R01, R03, R05, R52) e per argomento (R20, R21) funzionano senza etichettare chi legge; la sola porta per ruolo (R06, facilitatori) e i testi per famiglie (R51) mostrano che il ruolo si dichiara nel testo.',
  adattamento='Navigazione per compito; nella home quattro collegamenti con parole della persona («Scrivo per parlare», «Leggo per un\'altra persona», «Devo controllare», «Installo per un altro») che portano a sezioni della pagina Stato e limiti, dove la tabella «la stessa cosa detta a chi» dà le stesse informazioni a ciascuno. Nessuna etichetta clinica.',
  ambizione=['A2'], regole=['RG8', 'RG13'], prova='site/sistema/#c-nav', verifica='lettura delle quattro porte; prova tastiera')
d('D06', 'adattata', unisci(F('segnale di posizione e di avanzamento')), 'componente percorso: riga «Passo N di 5» in cima e «Indietro / Avanti» in fondo a ogni pagina del cammino',
  F1 + ' / ' + F2, 'P1-P5 sapere dove sono e cosa viene dopo',
  'R20 tiene in un solo oggetto dove sei e cosa succede dopo, ma con scorrimento virtuale e movimento; R21, R50 e R52 mostrano il segnale con numeri o indici.',
  adattamento='Una riga di testo («Passo 2 di 5: Stato e limiti») e un collegamento «Avanti» grande a fine pagina; l\'elenco delle cinque tappe non si ripete perché la barra principale in cima ha già le stesse voci (la revisione visiva ha misurato 318 px di doppia navigazione su telefono). L\'informazione dell\'isola contestuale, senza oggetti che si muovono o seguono lo scorrimento.',
  requisiti_funzionali=['tastiera', 'senza_js'], ripiego='È testo: nessuna parte dipende da script. La barra principale conserva aria-current sulla voce corrente.',
  ambizione=['A5'], regole=['RG5', 'RG6', 'RG9'], prova='site/sistema/#c-percorso', verifica='prova senza JavaScript; esame-impaginazione')
d('D07', 'adattata', unisci(F('comando proprio «indietro»')), 'componente percorso: collegamenti «Indietro» e «Avanti» a fine pagina',
  F1, 'P4-P5 tornare alla tappa precedente senza perdere il posto',
  'I comandi «indietro» dei riferimenti sono pulsanti che dipendono da script o da stati interni; qui basta un collegamento e il tasto del browser.',
  adattamento='Due collegamenti testuali grandi, «Indietro: <pagina>» e «Avanti: <pagina>»; nessun dato da conservare perché il sito non ha moduli.',
  ambizione=['A5'], regole=['RG5', 'RG9'], prova='site/sistema/#c-percorso', verifica='prova tastiera; link-spenti-qa')
d('D08', 'adattata', unisci(F('pagina inesistente')), 'pagina 404 con una frase senza colpa e cinque collegamenti',
  F1 + ' / ' + F2, 'P1 recuperare da un indirizzo sbagliato',
  'Le 404 utili dei riferimenti (R21 una frase che non colpevolizza, R51 e R52 elenco di destinazioni) riportano la persona nel sito; quelle inutili (R53 «click here», R06 nero su nero) la lasciano sola.',
  adattamento='Una frase («Questa pagina non esiste o è stata spostata.»), l\'elenco delle cinque pagine del cammino e il collegamento alla home; senza campo di ricerca perché il sito è piccolo e la ricerca richiederebbe script.',
  requisiti_funzionali=SENZA_JS, ripiego='Solo HTML: nessun comportamento da recuperare senza script.',
  ambizione=['A2'], regole=['RG5'], prova='site/404.html e site/sistema/#c-404', verifica='apertura di un indirizzo inesistente con il server locale; foto')
d('D09', 'adattata', unisci(F('messaggio di errore')), 'componente filtro dell\'Aiuto: messaggio «nessun risultato» con tre passi',
  F1 + ' / ' + F2, 'P5 trovare la causa quando la frase digitata non coincide',
  'R51 e R52 rispondono «No results found» senza proporre altro; R22 mostra suggerimenti mentre si digita.',
  adattamento='Il filtro riguarda solo le frasi della finestra. Se non ne trova, sparisce il gruppo (titolo, indice e schede) e il messaggio dice cosa fare: provare una parola sola («pronta», «scarico»), guardare i tre casi «La mia frase non c\'è», che restano sempre in vista, o segnalare. Il numero detto è quello delle voci mostrate.',
  requisiti_funzionali=SENZA_JS + RIDOTTO, ripiego='Senza script non c\'è filtro: l\'elenco completo di collegamenti è l\'unico comando e basta. Il messaggio compare senza movimento.',
  ambizione=['A3'], regole=['RG5'], prova='site/sistema/#c-filtro', verifica='prova con filtro vuoto, parziale e senza risultati; prova senza JavaScript')
d('D10', 'adattata', unisci(F('stampa')), 'foglio di stile di stampa: navigazione nascosta, indirizzi dei collegamenti scritti, colori a nero',
  F2 + ' / ' + F4, 'P4 stampare la guida all\'installazione e consegnarla a chi installerà',
  'I riferimenti si stampano senza accorgimenti (barre, banner, sfondi); chi installa per un altro potrebbe volere la guida su carta.',
  adattamento='In stampa spariscono navigazione, stepper e barre; i collegamenti mostrano l\'indirizzo; i comandi restano in carattere a spaziatura fissa con bordo; il cartellino di stato si stampa.',
  ambizione=['A5'], regole=['RG2'], prova='site/sistema/#c-stampa', verifica='emulazione media print con foto')
d('D11', 'trasferita', unisci(F('anteprima del collegamento')), 'meta title, description e Open Graph di ogni pagina',
  F2, 'P1 inoltrare un collegamento con un\'anteprima che dica cosa è',
  'Familiari e logopedisti inoltrano collegamenti nei messaggi; l\'anteprima è ciò che il destinatario legge prima di aprirli.',
  ambizione=['A2'], regole=['RG11'], prova='site/sistema/#c-meta', verifica='lettura dei meta di ogni pagina nell\'anteprima locale')
d('D12', 'adattata', unisci(F('albero di accessibilità (proxy)')), 'struttura semantica: banner, nav, main, contentinfo; un solo H1; ordine dei titoli; testi alternativi',
  F1, 'P1-P6 usare il sito con un lettore di schermo (Orca, NVDA, VoiceOver)',
  'Tutti i riferimenti hanno punti di riferimento o li dovrebbero avere; R03 ha 32 immagini su 46 senza alternativa e R05 cinque pulsanti senza nome: sono i difetti da evitare, non solo i modelli.',
  adattamento='Un solo H1 per pagina, titoli in ordine, ogni immagine con alternativa utile (la foto della finestra descrive i controlli), ogni pulsante con nome, l\'audio con etichetta che dice voce e frase.',
  requisiti_funzionali=['lettore_schermo', 'tastiera'], ripiego='La semantica è il livello di base; gli script non cambiano la struttura.',
  ambizione=['A1'], regole=['RG2', 'RG9'], prova='site/sistema/#c-semantica', verifica='albero di accessibilità (proxy) con Playwright; lettore vero non disponibile: dichiarato')
d('D13', 'adattata', unisci(F('percorso da tastiera')), 'componente salta (collegamento «Vai al contenuto») + anello di focus doppio',
  F1, 'P1-P6 arrivare al comando principale con pochi arresti',
  'R03, R21 e R52 hanno un «Skip to content» che compare al focus; R50 e R51 non lo hanno e R50 ha un anello quasi invisibile; R01 e R20 rendono i comandi irraggiungibili.',
  adattamento='Salta-al-contenuto come primo Tab, visibile al focus; anello di focus di 3 px in colore dell\'inchiostro con alone chiaro (contrasto oltre 3:1 su carta e su verde); ordine di Tab uguale all\'ordine visivo.',
  requisiti_funzionali=['tastiera', 'contrasto'], ripiego='Nessuno: la tastiera è il comando di base.',
  ambizione=['A5'], regole=['RG9'], prova='site/sistema/#c-focus', verifica='sequenza di Tab con foto; contrasto-qa')
d('D14', 'adattata', unisci(F('bersagli dei comandi principali')), 'token dimensione-bersaglio e distanza-bersagli',
  F1, 'P1-P5 premere un comando con puntamento impreciso o interruttore',
  'I minimi misurati nei riferimenti vanno da 8 px a 48 px; per un puntamento oculare o un tremore servono bersagli ampi e distanziati.',
  adattamento='Minimo 44×44 px per ogni comando, 8 px fra comandi vicini; collegamenti nel testo con interlinea che lascia una riga libera; nessun comando da 14 px.',
  requisiti_funzionali=['tocco', 'tastiera'], ripiego='Il bersaglio è esteso con padding, non con script.',
  ambizione=['A5'], regole=['RG9'], prova='site/sistema/#t-spazi', verifica='misura dei bersagli con esame-impaginazione')
d('D15', 'adattata', unisci(F('testo corrente')), 'token tipografia: corpo 18-20 px, interlinea 1,6, riga di al più 62 caratteri',
  F1 + ' / ' + F2, 'P1-P6 leggere con lentezza o con difficoltà',
  'I corpi misurati vanno da 13 a 27 px e le righe fino a 104 caratteri; il registro italiano G01-G04 mostra corpi di 13-15 px in grigio come causa di lettura faticosa.',
  adattamento='Corpo 1,125 rem (18 px) a 1,25 rem (20 px), interlinea 1,6, colonna di 62 caratteri, testo in inchiostro con contrasto oltre 7:1; nessun testo grigio chiaro in peso leggero.',
  requisiti_funzionali=['testo_grande', 'zoom', 'contrasto'], ripiego='Unità relative (rem): al 200% il layout si riorganizza senza scorrimento orizzontale.',
  ambizione=['A1'], regole=['RG8', 'RG9'], prova='site/sistema/#t-tipografia', verifica='contrasto-qa; prova testo 200%')
d('D16', 'adattata', unisci(F('testo al 200%')), 'regole di layout: nessuna larghezza in px sui contenitori di testo, intestazione che va a capo',
  F1, 'P1-P6 ingrandire il testo senza perdere contenuto',
  'R52 e R01 mostrano scorrimento orizzontale o sovrapposizioni al 200%; R50, R51 e R53 non scorrono di lato ma rompono la barra o sovrappongono pulsante e paragrafo.',
  adattamento='Intestazione, navigazione e stepper vanno a capo; i comandi non si sovrappongono al testo; nessuna barra fissa che occupi più di un decimo dell\'altezza.',
  requisiti_funzionali=['testo_grande', 'zoom'], ripiego='Layout fluido in rem e clamp; la pagina funziona a 200% di testo e a 400% di zoom.',
  ambizione=['A5'], regole=['RG9'], prova='site/sistema/#t-spazi', verifica='prova testo 200% e zoom 200% con foto')
d('D17', 'esclusa', unisci(F('zoom al 200%'), F('zoom della pagina consentito dal meta viewport')), 'meta viewport senza limiti di ingrandimento',
  F1, 'P1-P6 ingrandire la pagina',
  'R01, R02 e R03 impediscono o limitano lo zoom della pagina: è un difetto da non riprodurre.',
  motivo_tipo='vincolo', motivo_dettaglio='accessibilità massima [P], progetto.md §9: il meta viewport di Kalliope non limita lo zoom.',
  ambizione=['A5'], regole=['RG9'], prova='site/sistema/#c-meta', verifica='lettura del meta viewport')
d('D18', 'adattata', unisci(F('tenuta con colori forzati')), 'regole forced-colors: bordi su bottoni e chip, barre in colore di sistema',
  F1, 'P1-P6 leggere con i colori imposti dal sistema',
  'R01, R02 e R03 sono stati osservati con colori forzati; i bottoni perdono il riempimento ma tengono il bordo, i chip senza bordo perdono ogni segno.',
  adattamento='Ogni bottone, chip e cartellino ha un bordo reale (non solo sfondo); le barre usano CanvasText e Highlight in modalità forzata; l\'icona non dipende dal gradiente.',
  requisiti_funzionali=['colori_forzati', 'contrasto'], ripiego='In modalità forzata i riempimenti diventano contorni e il motivo delle barre usa i colori di sistema.',
  ambizione=['A4'], regole=['RG2'], prova='site/sistema/#c-forzati', verifica='emulazione forced-colors con foto')
d('D19', 'adattata', unisci(F('comportamento senza JavaScript')), 'regola di progetto: HTML completo, script solo per aggiungere',
  F1 + ' / ' + F2 + ' / ' + F3, 'P1-P6 usare il sito senza JavaScript',
  'R21 e R22 hanno il testo intero senza script; R01 e R02 lo nascondono con opacità 0; R04 lascia blocchi vuoti.',
  adattamento='Ogni pagina è documento completo; le sole aggiunte con script sono: evidenziazione e barre dell\'ascolto, filtro dell\'Aiuto, copia dei comandi e rilevazione del sistema operativo. Ognuna ha il suo equivalente senza script.',
  requisiti_funzionali=SENZA_JS, ripiego='Audio con controlli nativi, comandi in testo selezionabile, elenco completo dell\'Aiuto, banner di sistema sostituito da un collegamento fisso «Non uso Linux».',
  ambizione=['A4'], regole=['RG5'], prova='site/sistema/#c-senza-js', verifica='prova con javaScriptEnabled false su ogni pagina')
d('D20', 'adattata', unisci(F('attesa del caricamento')), 'regola di progetto: nessuno scheletro né spinner; testo per primo; audio caricato solo alla richiesta',
  F1, 'P1 vedere il testo subito su rete lenta',
  'Gli scheletri e gli spinner dei riferimenti (R05) e le attese oltre 20 secondi (R02, R20) lasciano la persona senza contenuto.',
  adattamento='Pagine di poche decine di kB senza immagini oltre la foto della finestra; l\'audio ha preload none e un testo «Carico il file…» solo dopo il gesto; la foto ha dimensioni dichiarate per non spostare il testo.',
  requisiti_funzionali=['rete_lenta', 'prestazioni'], ripiego='Il testo è nel primo byte; nessun segnaposto animato è necessario.',
  ambizione=['A4'], regole=['RG5', 'RG7'], prova='site/sistema/#c-prestazioni', verifica='misura delle richieste e prova con rete lenta emulata in Chromium')
d('D21', 'esclusa', unisci(F('richieste e terze parti')), 'nessuna terza parte nel sito',
  F3, 'P7 sapere che il sito non invia dati a terzi',
  'I riferimenti caricano da 4 a 17 domini esterni (strumenti di misura, consenso, chat, mappe, caratteri).',
  motivo_tipo='vincolo', motivo_dettaglio='Nessuna richiesta a terzi, nessun cookie, nessuna statistica [P], progetto.md §9. Il fatto si scrive nel piede del sito.',
  ambizione=['A2'], regole=['RG7'], prova='site/sistema/#c-prestazioni', verifica='richieste di rete della home: tutte verso lo stesso dominio')
d('D22', 'progettuale', [], 'token budget di pagina: al più 200 kB di HTML, CSS e script per pagina, 0 domini esterni, audio escluso',
  F1 + ' / ' + F3, 'P1 e P7 pagine leggere su computer modesti',
  'Kalliope è un programma leggero per computer modesti (README, obiettivi): il sito ne dà l\'esempio. Il valore è scelto dal progetto, non preso da un riferimento; i riferimenti più leggeri misurati sono R51 con 24 richieste e R50 con 66 richieste e 471 kB, ma includono immagini e script di terzi.',
  ambizione=['A2'], regole=['RG1', 'RG7'], prova='site/sistema/#c-prestazioni', verifica='misura del peso di ogni pagina')
d('D23', 'adattata', unisci(F('chi c\'è dietro e le fonti')), 'piede del sito + sezione «Chi c\'è dietro» nella pagina Stato e limiti',
  F3 + ' / ' + F5, 'P7 sapere chi risponde e dove si verifica',
  'Tutti i riferimenti dicono chi c\'è dietro in forme diverse (firma, data, versione, fonti); R22 mette il metodo e nove fonti con scopo.',
  adattamento='SANSEVIERIA OÜ, versione e data della release (segnaposto), collegamenti ai file del repository (README, LICENSE, NOTICE, docs) e alla pagina della release; nessun nome di persona se non quelli già nel repository.',
  ambizione=['A2'], regole=['RG11', 'RG14'], prova='site/sistema/#c-piede', verifica='lettura; segnaposto sostituiti da tools/site.py')
d('D24', 'adattata', unisci(F('stato e limiti dichiarati')), 'componente stato (cartellino a tre colonne: provato, non ancora provato, non esiste)',
  F1 + ' / ' + F2 + ' / ' + F3, 'P1 e P3 sapere cosa si può aspettare, prima di decidere',
  'R21 e R22 dichiarano prima del testo (IA, sponsor, limiti del dato); R53 scrive il limite onesto in fondo; R06 dà l\'avvertenza ma dopo 2-8 secondi; R50 dà solo l\'avviso antivirus; R05, R51 limiti sparsi.',
  adattamento='Il cartellino è nel primo schermo, subito sotto la proposta, senza ritardo né chiusura; tre colonne con parola, simbolo e testo (non solo colore): «Provato» (voce fino al microfono, con un PipeWire privato), «Non ancora provato» (Zoom, Teams, Meet su un desktop reale; lettori di schermo; puntamento oculare) e «Non esiste» (Windows, macOS, telefono, clonazione della voce).',
  ambizione=['A2'], regole=['RG4', 'RG12', 'RG14'], identita=True, distinzione='Il cartellino con tre colonne è proprio di Kalliope; nei concorrenti (R50, R51) lo stato è assente o limitato a requisiti e prezzo.',
  prova='site/sistema/#c-stato', verifica='lettura a 1440×900 e 390×844: il cartellino compare senza scorrere; contrasto-qa',
  candidati=[
      {'valore': 'avviso a scomparsa in alto (come R06 M10)', 'fonte': 'R06', 'eliminato_da': 'RG4'},
      {'valore': 'riga di limiti in fondo alla pagina (come R53)', 'fonte': 'R53', 'eliminato_da': 'RG4'},
      {'valore': 'etichetta «Beta» accanto al nome', 'fonte': 'nessuna: uso comune dei prodotti', 'eliminato_da': 'RG14'},
      {'valore': 'cartellino a tre colonne provato / non ancora provato / non esiste nel primo schermo', 'fonte': 'R21 (dichiarare prima), R53 (parole oneste), R51 (tabella di requisiti)'},
  ], valore='cartellino a tre colonne provato / non ancora provato / non esiste nel primo schermo')
d('D25', 'esclusa', unisci(F('avvertenza sui contenuti con uscita rapida')), 'nessuna uscita rapida',
  F1, 'P1 non applicabile',
  'R06 offre avvertenza con aiuto 24 ore e uscita rapida perché le storie trattano di violenza; il sito di Kalliope non ha contenuti sensibili né pagine da nascondere.',
  motivo_tipo='compito', motivo_dettaglio='Il principio utile, l\'avvertenza presente subito e non ritardata, è già nella decisione D24; l\'uscita rapida non ha un compito qui.',
  ambizione=['A2'], regole=['RG4'], prova='site/sistema/#c-stato', verifica='nessuna: esclusione motivata dal compito')
d('D26', 'adattata', unisci(F('compromessi dichiarati nelle opzioni')), 'componente scelta-sistema: ogni formato dice cosa si guadagna e cosa si perde',
  F2 + ' / ' + F4, 'P4 scegliere il formato giusto per il proprio computer',
  'R05 scrive in ogni opzione cosa si guadagna e cosa si perde; la scelta fra pacchetto e archivio è la stessa decisione.',
  adattamento='Per ciascun formato una riga: .deb e .rpm si aggiornano con il gestore dei pacchetti e chiedono i permessi di amministratore; il .tar.gz con ./install scrive in ~/.local senza amministratore e si toglie con ./install --remove; Arch usa il PKGBUILD senza compilare.',
  ambizione=['A5'], regole=['RG11', 'RG14'], prova='site/sistema/#c-scelta-sistema', verifica='confronto con docs/releasing.md')
d('D27', 'adattata', unisci(F('tabella di compatibilità')), 'componente tabella provato/non provato per app e piattaforma',
  F1 + ' / ' + F3, 'P5 sapere se funziona con la propria app di riunione',
  'Solo R51 ha una tabella, e di requisiti; nessuno dichiara il non provato. Per Kalliope la compatibilità è un fatto da provare app per app (progetto.md §1.4).',
  adattamento='Righe: Zoom, Teams, Meet, Webex, Jitsi, browser; colonne: provato in una riunione vera, provato con un test del microfono, non provato; oggi tutte «non provato in una riunione vera»; la tabella dice la data e come segnalare (P9).',
  ambizione=['A2'], regole=['RG4', 'RG12', 'RG14'], identita=True, distinzione='La tabella dichiara il non provato come dato; nei riferimenti la compatibilità è un elenco di requisiti.',
  prova='site/sistema/#c-tabella', verifica='lettura; aggiornamento previsto quando arrivano segnalazioni',
  candidati=[
      {'valore': 'elenco puntato di app compatibili', 'fonte': 'uso comune dei prodotti', 'eliminato_da': 'RG12'},
      {'valore': 'tabella dei requisiti minimi', 'fonte': 'R51', 'eliminato_da': 'RG4'},
      {'valore': 'tabella provato / non provato per app con data', 'fonte': 'R51 (forma tabellare), R53 (onestà)'},
  ], valore='tabella provato / non provato per app con data')
d('D28', 'esclusa', unisci(F('testimonianze di utenti')), 'nessuna testimonianza',
  F2, 'P3 fidarsi',
  'R50, R51, R52 e R53 usano storie di utenti; il sito di Kalliope non ha materiale di persone reali e non lo inventa.',
  motivo_tipo='vincolo', motivo_dettaglio='Nessun materiale di persone reali (foto, testimonianze, frasi) senza consenso, progetto.md §12; un componente «storia» entrerà solo con un consenso scritto.',
  ambizione=['A2'], regole=['RG1'], prova='site/sistema/#c-stato', verifica='nessuna: esclusione motivata dal vincolo')
d('D29', 'adattata', unisci(F('numeri detti a parole')), 'regola di scrittura e componente misura: ogni cifra accompagnata dalla frase che la dice e da dove è misurata',
  F3 + ' / ' + F5, 'P7 e P8 citare una misura senza fraintenderla',
  'R04, R21 e R22 accompagnano il numero con una frase; per Kalliope la forma detta dei numeri è anche il prodotto (A1).',
  adattamento='Le cifre di Kalliope (2,3% di parole sbagliate su 10 frasi; circa una parola ogni 45 sui sei campioni; 53 MB di voce; 0,07 s di CPU per secondo di voce) hanno la frase intera accanto, il computer su cui sono misurate e il file dove si rifà la misura. Nessun conteggio animato.',
  ambizione=['A1'], regole=['RG14'], prova='site/sistema/#c-misura', verifica='lettura; ogni cifra rimanda a un file del repository')
d('D30', 'adattata', unisci(F('corto subito, lungo a richiesta')), 'componente disclosure (dettagli) su <details>',
  F1 + ' / ' + F2, 'P1-P5 leggere il corto subito e il lungo a richiesta',
  'Le FAQ in fisarmonica dei riferimenti (R01, R04, R05, R06, R50, R53) tengono le risposte lunghe dietro una domanda; per chi ha difficoltà di lettura il corto sta in vista e il lungo si apre quando serve.',
  adattamento='Risposta corta sempre visibile; il «perché» e i dettagli tecnici dentro <details> con etichetta chiara; aprire non muove nient\'altro; apertura con dissolvenza di 120 ms, istantanea con movimento ridotto; mai informazione essenziale solo dentro un dettaglio chiuso.',
  requisiti_funzionali=RIDOTTO + SENZA_JS + ['tastiera'], ripiego='<details> funziona senza script e da tastiera; con movimento ridotto non c\'è dissolvenza.',
  ambizione=['A3'], regole=['RG5', 'RG6', 'RG8'], prova='site/sistema/#c-disclosure', verifica='prova tastiera, senza JavaScript, movimento ridotto')
d('D31', 'adattata', unisci(F('lunghezza e registro delle frasi')), 'regola di scrittura RG8 e glossario dei termini nuovi',
  F1 + ' / ' + F2, 'P1-P6 capire senza fatica',
  'Le frasi dei riferimenti vanno da 3 a 75 parole al primo schermo; le pagine italiane G01-G04 mostrano 15-18 parole per frase dove parlano a una persona sola e 25-36 dove parlano a professionisti.',
  adattamento='Obiettivo di 15-20 parole per frase nei testi che chiedono un\'azione, seconda persona nelle istruzioni, termini nuovi (microfono virtuale, PipeWire) spiegati al primo uso con una frase sola e raccolti nel piede come «Parole usate».',
  ambizione=['A5'], regole=['RG8', 'RG13'], prova='site/sistema/#t-parole', verifica='misura della lunghezza delle frasi di ogni pagina con uno script')
d('D32', 'adattata', unisci(F('prodotto mostrato')), 'componente foto: la foto vera della finestra con didascalia e testo alternativo; elenco delle frasi di stato',
  F1 + ' / ' + F2 + ' / ' + F3, 'P1 e P5 vedere com\'è fatto il prodotto vero, anche quando qualcosa non va',
  'R05 mostra una schermata con gli stati (Uploading, Processing, Downloading); R50 schermate reali e un video; R52 otto schermate nel carosello; solo R05 e R50 mostrano stati diversi dal caso felice.',
  adattamento='La foto vera della finestra (640×500, con «Senti anche tu» acceso) con didascalia e alternativa che nomina i controlli; la foto resta più piccola (24 rem), nella pagina iniziale sotto «Cosa serve» e nella pagina In riunione al primo passo, dove spiega la riga «Pronta»; non è più l\'immagine più grande del primo schermo. Le frasi vere di stato della finestra sono testo (non immagini); nessun video (non esiste una registrazione) e nessuna schermata simulata.',
  ambizione=['A3'], regole=['RG10', 'RG1'], prova='site/sistema/#c-foto', verifica='lettura; alternativa controllata con l\'albero di accessibilità')
d('D33', 'adattata', unisci(F('campione di suono')), 'componente ascolto: due voci, tre frasi, un solo suono per volta, testo scritto e testo detto',
  F1 + ' / ' + F2 + ' / ' + F3, 'P2 capire come suona e se legge bene date, orari e importi',
  'R03 accoppia il suono e il testo (campioni muti con bolle di chat); R05 limita a un suono per volta; R51 offre quattro voci con pulsanti da 44 px. Nessuno mostra la frase scritta e la frase detta insieme.',
  adattamento='Sei registrazioni vere (Giulia e Marco, tre frasi ciascuna) con il testo digitato, il testo pronunciato e la durata (arrotondata ai secondi, uguale nel testo e nella posizione); nel primo schermo della pagina iniziale il riquadro mostra la frase dell\'importo con la voce di Giulia, sulla pagina Ascolta tutte e sei; le cifre trasformate sono evidenziate nelle due righe; il pulsante cambia etichetta («Ascolta» / «Ferma») come «Unmute / Mute» di R03; altri campioni si fermano quando se ne avvia uno.',
  requisiti_funzionali=SENZA_JS + RIDOTTO + ['lettore_schermo', 'tastiera'], ripiego='Senza script: <audio controls preload="none"> nativo per ogni campione e il testo comunque visibile. Con movimento ridotto: nessuna barra in movimento, la frase in corso resta evidenziata e la posizione è scritta.',
  ambizione=['A1', 'A4'], regole=['RG3', 'RG5', 'RG6', 'RG10'], identita=True, distinzione='La coppia scritto/detto con la trasformazione delle cifre evidenziata non esiste in R03, R05, R51 né nei concorrenti.',
  prova='site/sistema/#c-ascolto', verifica='prova tastiera, senza JavaScript, movimento ridotto; riproduzione in Chromium; lacuna: Firefox e WebKit da provare',
  candidati=[
      {'valore': 'lettore con solo i controlli nativi', 'fonte': 'R05 senza testo accanto', 'eliminato_da': 'RG3'},
      {'valore': 'campioni muti con testo in bolle di chat', 'fonte': 'R03', 'eliminato_da': 'K1'},
      {'valore': 'quattro pulsanti rotondi con il nome della voce', 'fonte': 'R51', 'eliminato_da': 'RG3'},
      {'valore': 'testo scritto e testo detto a fianco, con pulsante, barre e frase evidenziata', 'fonte': 'R03 (testo accanto), R05 (un suono per volta), R06 (barrette del suono), progetto.md P2'},
  ], valore='testo scritto e testo detto a fianco, con pulsante, barre e frase evidenziata')
d('D34', 'adattata', unisci(F('scelta del suono prima di entrare')), 'regola RG3: il suono parte solo dal gesto, nessun predefinito',
  F1, 'P1-P2 non essere sorpresa da un suono',
  'R06 chiede la scelta del suono prima di ogni cosa, con due scelte alla pari e nessun predefinito; Kalliope non ha una soglia d\'ingresso, ma ha lo stesso rischio: il suono improvviso.',
  adattamento='Nessuna soglia: il sito è silenzioso finché la persona non preme «Ascolta»; il pulsante dice cosa sta per succedere («Ascolta Giulia, 6 secondi»).',
  ambizione=['A1'], regole=['RG3', 'RG6'], prova='site/sistema/#c-ascolto', verifica='nessun audio in riproduzione al caricamento: prova in Chromium')
d('D35', 'adattata', unisci(F('avvio di audio e video', rx='^media$', siti=['R04', 'R05', 'R06', 'R50', 'R51'])), 'regola RG3 e componente ascolto: avvio solo da gesto, preload none',
  F1, 'P2 avviare e fermare l\'ascolto',
  'R04, R05 e R50 avviano il media solo dopo un gesto (R05 con preload none); R06 e R51 lasciano la scelta alla persona.',
  adattamento='Tutti gli audio hanno preload none; nessun controllo si attiva da solo; l\'avvio è un pulsante con testo. Non c\'è video.',
  ambizione=['A1'], regole=['RG3'], prova='site/sistema/#c-ascolto', verifica='lettura degli attributi degli elementi audio')
d('D36', 'esclusa', unisci(F('avvio di audio e video', siti=['R02', 'R03', 'R53'])), 'nessun video di sottofondo né in ciclo',
  F1, 'P1-P2 non avere movimento imposto',
  'R02, R03 e R53 hanno video muti in ciclo o carosello che parte da solo.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG6 e K6: nessun movimento non provocato. Un ripiego non serve: il video non porta informazione che il testo e la foto non portino.',
  ambizione=['A4'], regole=['RG3', 'RG6'], prova='site/sistema/#c-ascolto', verifica='nessun elemento video nel sito')
d('D37', 'adattata', unisci(F('media non caricato')), 'componente ascolto: collegamento al file e messaggio se la riproduzione non parte',
  F1 + ' / ' + F2, 'P2 sentire anche quando il browser non riproduce',
  'R21, R50, R51, R52 e R53 sono stati osservati con il media non caricato; la riproduzione degli MP3 in Firefox e WebKit su Linux senza codec di sistema è da verificare.',
  adattamento='Il testo resta; sotto ogni campione c\'è «Scarica il file (MP3, <durata>)»; se il browser rifiuta l\'audio, un messaggio dice cosa fare.',
  requisiti_funzionali=['rete_lenta', 'senza_js'], ripiego='Collegamento diretto al file MP3 e testo integrale.',
  ambizione=['A1'], regole=['RG5'], prova='site/sistema/#c-ascolto', verifica='prova con richiesta del file bloccata')
d('D38', 'adattata', unisci(F('guida a passi con ripresa')), 'componente passi: passi numerati con comando, controllo e «se non va»',
  F2 + ' / ' + F4 + ' / ' + F1, 'P4 installare e sapere se è riuscito',
  'R50 ha quattro passi numerati con schermate; R05 un paragrafo; entrambi senza comandi copiabili, senza verifica e senza ripresa; R53 non ha installazione.',
  adattamento='Cinque passi (scarica, controlla l\'impronta, installa, apri e scarica la voce, controlla «Pronta»); sotto ciascuno «Come sai che è andata bene» e «Se non è andata»; in testa a ogni passo il numero e, a fine pagina, «Se ti sei fermato qui» con il passo da cui riprendere. La ripresa è scritta, perché il sito non salva nulla.',
  requisiti_funzionali=SENZA_JS + ['tastiera'], ripiego='Elenco ordinato <ol> di sezioni con titolo e ancora; nessuno stato in script.',
  ambizione=['A5'], regole=['RG5', 'RG8', 'RG11'], identita=True, distinzione='La verifica dopo ogni passo e la ripresa scritta non sono in R05, R50 né in altri riferimenti.',
  prova='site/sistema/#c-passi', verifica='confronto dei comandi con packaging/linux e docs/releasing.md; prova senza JavaScript',
  candidati=[
      {'valore': 'paragrafo unico di istruzioni', 'fonte': 'R05', 'eliminato_da': 'K1'},
      {'valore': 'passi numerati con schermate', 'fonte': 'R50', 'eliminato_da': 'RG11'},
      {'valore': 'passi numerati con comando, controllo del risultato e «se non va»', 'fonte': 'R50 (passi numerati), R05 (data dell\'ultima release), progetto.md P4'},
  ], valore='passi numerati con comando, controllo del risultato e «se non va»')
d('D39', 'adattata', unisci(F('comandi da copiare')), 'componente comando: blocco a spaziatura fissa con pulsante «Copia»',
  F4 + ' / ' + F2, 'P4 eseguire un comando senza sbagliare',
  'R50 non ha comandi da terminale; R05 offre installatori; nessuno ha comandi copiabili con verifica.',
  adattamento='Comandi veri ricavati da packaging/linux e docs/releasing.md in un blocco selezionabile con un clic; con script un pulsante «Copia» che dice «Copiato» a parole; il nome del file e l\'impronta vengono dai segnaposto.',
  requisiti_funzionali=SENZA_JS + ['tastiera'], ripiego='Il testo del comando è selezionabile e si copia con la tastiera; il pulsante è un\'aggiunta.',
  ambizione=['A5'], regole=['RG5', 'RG9', 'RG11'], distinzione='Comandi da terminale veri, con verifica dopo ciascuno: il concorrente R50 guida solo con schermate di Windows e Mac.', prova='site/sistema/#c-comando', verifica='prova senza JavaScript; confronto con i file di packaging')
d('D40', 'adattata', unisci(F('scelta per sistema o versione')), 'componente scelta-sistema: indice di quattro distribuzioni e sezioni sempre visibili',
  F4 + ' / ' + F2, 'P4 trovare il proprio formato',
  'R05 riconosce il sistema e propone il suo pulsante con una tendina; R50 propone Windows di default anche con un browser Linux.',
  adattamento='Nessun riconoscimento automatico della distribuzione (il browser non la dice); quattro collegamenti (Debian/Ubuntu, Fedora, Arch, altre). Con script la scelta tiene in vista solo i blocchi di quella distribuzione nei passi 1-3 («Mostra tutte» li rimette), senza memoria sul dispositivo; senza script le sezioni sono tutte visibili e in ordine. Se il sistema è Windows, macOS o un telefono compare un riquadro compatto che manda alla pagina «Non ancora».',
  requisiti_funzionali=SENZA_JS, ripiego='Le sezioni sono tutte in pagina e raggiungibili da un indice di collegamenti; nessun contenuto nascosto in schede.',
  ambizione=['A2', 'A5'], regole=['RG5'], prova='site/sistema/#c-scelta-sistema', verifica='prova senza JavaScript; prova con user agent Windows e macOS')
d('D41', 'esclusa', unisci(F('finestra del consenso ai cookie'), F('sovrapposizione di messaggi al primo arrivo')), 'nessuna finestra di consenso né sovrapposizione al primo arrivo',
  F1, 'P1 leggere subito',
  'R53 copre parte del testo con la finestra di consenso; R05 sovrappone tre messaggi al telefono.',
  motivo_tipo='vincolo', motivo_dettaglio='Il sito non usa cookie né statistiche [P]: non serve consenso e nulla si sovrappone al primo schermo. Il fatto resta scritto nel piede.',
  ambizione=['A2'], regole=['RG7'], prova='site/sistema/#c-piede', verifica='nessun elemento sovrapposto al primo schermo')
d('D42', 'adattata', unisci(F('tema scelto dalla persona')), 'token colore con variante scura che segue il sistema (prefers-color-scheme)',
  F1, 'P1-P6 leggere con il tema che la persona ha già scelto nel sistema',
  'R52 ha un interruttore sole/luna e segue il tema del sistema; R53 e altri sono scuri per scelta di design.',
  adattamento='Il tema segue il sistema; non c\'è un interruttore perché richiederebbe memoria locale e un comando in più. La variante scura mantiene gli stessi rapporti di contrasto.',
  requisiti_funzionali=['contrasto', 'colori_forzati'], ripiego='In modalità forzata decide il sistema; il sito non impone colori.',
  ambizione=['A4'], regole=['RG2', 'RG7'], distinzione='Il tema non ha interruttore e usa i colori di Kalliope (carta e verde acqua dell\'icona), non gli azzurri di R52.', prova='site/sistema/#t-colori', verifica='contrasto-qa in tema chiaro e scuro')
d('D43', 'esclusa', unisci(F('apertura del menu')), 'nessun menu a pannello o a comparsa',
  F1 + ' / ' + F2, 'P1 raggiungere cinque destinazioni',
  'I menu a pannello dei riferimenti (150-600 ms) nascondono le voci dietro un pulsante.',
  motivo_tipo='compito', motivo_dettaglio='Con cinque voci il compito è raggiungerle in un gesto: nasconderle aggiunge un passo e un comando che dipende da script. Le voci sono sempre in vista (D04).',
  ambizione=['A5'], regole=['RG5', 'RG9'], prova='site/sistema/#c-nav', verifica='nessun elemento a comparsa nella navigazione')

# ---------------------------------------------------------------- Effetti e animazioni (una decisione per classe di effetto)
d('E01', 'adattata', unisci(FE(
    ('R01', 'apertura About'), ('R01', 'Search'), ('R02', 'menu telefono'), ('R04', 'M0[5-9]'), ('R04', 'M15'), ('R05', 'M0[789]'), ('R05', 'M10'), ('R05', 'M13'),
    ('R21', 'pannello Destinations'), ('R21', 'apertura del pannello'), ('R21', 'icone del menu'), ('R50', 'FAQ'), ('R50', 'Solutions'), ('R50', 'velo e voci'),
    ('R50', 'finestra di ingrandimento'), ('R50', 'Full history'), ('R50', 'ingrandimento di una schermata'), ('R51', 'menu telefono'), ('R51', 'finestra di ricerca'),
    ('R51', 'pannello Products'), ('R52', 'menu telefono'), ('R52', 'sottomenu'), ('R53', 'apertura di una domanda'), ('R53', 'riquadro del video'))),
  'componente disclosure: dissolvenza di 120 ms all\'apertura di un dettaglio, istantanea con movimento ridotto',
  F1 + ' / ' + F2, 'P1-P5 aprire un dettaglio e capire che è successo qualcosa',
  'Le aperture di pannelli, menu, finestre e fisarmoniche dei riferimenti durano da 150 a 600 ms (oltre 240 ms solo nei pannelli a tutto schermo): un cambio di stato che la persona ha provocato.',
  adattamento='Un\'unica apertura breve per i dettagli (dissolvenza di 120 ms, curva ease-out) e nessun pannello a tutto schermo; la dissolvenza porta l\'informazione «si è aperto»; senza movimento il dettaglio appare di colpo con il simbolo che cambia da + a −.',
  requisiti_funzionali=RIDOTTO + SENZA_JS + ['tastiera'], ripiego='Con movimento ridotto durata 0 e il cambio del simbolo e dell\'etichetta («Chiudi») porta l\'informazione; senza script <details> funziona.',
  ambizione=['A4'], regole=['RG5', 'RG6'], prova='site/sistema/#c-disclosure', verifica='controllo della durata computata e prova con prefers-reduced-motion')
d('E02', 'esclusa', unisci(FE(
    ('R02', 'contenuto del hero'), ('R02', 'sfondo del hero'), ('R04', 'M02'), ('R04', 'M13'), ('R05', 'M06'), ('R05', 'M11'), ('R05', 'M15'), ('R22', 'sfondi uovo'), ('R22', 'assistente'),
    ('R52', 'comparsa delle sezioni'), ('R53', 'comparse di sezione'))),
  'nessuna comparsa all\'ingresso per scorrimento',
  F1 + ' / ' + F2, 'P1-P6 leggere senza attendere un effetto',
  'Le comparse di sezione dei riferimenti (opacità e traslazione di 25-50 px in 300-1000 ms) nascondono il contenuto finché un evento non lo mostra; senza script o a movimento ridotto restano blocchi vuoti (R01, R02, R04).',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG5 e RG6: il contenuto è visibile subito e nessun movimento è privo di informazione. Un ripiego darebbe il contenuto subito visibile, che è già il comportamento di base.',
  ambizione=['A4'], regole=['RG5', 'RG6'], prova='site/sistema/#c-movimento', verifica='nessuna comparsa: contenuto visibile alla prima foto')
d('E03', 'esclusa', unisci(FE(
    ('R03', 'grana'), ('R03', 'puntini'), ('R05', 'M01'), ('R05', 'M02'), ('R50', 'pulsazione'), ('R52', 'bandiera'), ('R53', 'video di sottofondo'))),
  'nessun movimento ciclico o decorativo',
  F1, 'P1 leggere senza distrazioni',
  'Grana animata, puntini di digitazione, scheletri che pulsano, spinner, anelli che pulsano, dissolvenze infinite e video in ciclo si muovono senza essere stati provocati.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG6 e K6 (persone con mutismo selettivo o autismo, tremore, attenzione fragile): non portano informazione. Dove l\'attesa è vera (il file audio che carica) il testo «Carico il file…» sostituisce lo spinner.',
  ambizione=['A4'], regole=['RG6'], prova='site/sistema/#c-movimento', verifica='nessuna animazione infinita nel sito (controllo con le animazioni computate)')
d('E04', 'esclusa', unisci(FE(
    ('R02', 'dissolvenza del hero'), ('R02', 'pagina in generale'), ('R06', 'M09'), ('R20', 'cursore'), ('R20', 'elenco progetti'), ('R20', 'prossimo progetto'), ('R20', 'apertura pagina Info'),
    ('R20', 'scorrimento computer · pagina Info'), ('R22', 'scorrimento morbido'), ('R04', 'M14'))),
  'scorrimento nativo, senza smorzamento, parallasse, cursore personalizzato né passaggio automatico',
  F1, 'P1-P6 controllare la velocità dello scorrimento',
  'Lenis, scorrimento virtuale, parallasse, cursori che seguono il mouse e il passaggio automatico al progetto seguente tolgono il controllo della velocità a chi ha tremore o usa un interruttore.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG9 (scorrimento nativo) e RG6: la persona controlla ciò che si muove. Il comportamento nativo del browser è già il ripiego.',
  ambizione=['A5'], regole=['RG6', 'RG9'], prova='site/sistema/#c-movimento', verifica='nessuna libreria di scorrimento nel sito')
d('E05', 'esclusa', unisci(FE(
    ('R03', 'navigazione fissa'), ('R04', 'M04'), ('R05', 'M04'), ('R05', 'M05'), ('R05', 'M16'), ('R06', 'M06'), ('R50', 'ombra della barra'), ('R51', 'barra di prodotto'))),
  'intestazione di altezza costante, non fissa e senza trasformazioni allo scorrimento',
  F1 + ' / ' + F2, 'P1-P6 non perdere il testo sotto un elemento fisso',
  'Le intestazioni che si compattano, cambiano con la direzione di scorrimento o diventano barre di prodotto coprono il testo a zoom 200% e al focus; R05 sovrappone un pannello fisso al pulsante di una scheda.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG9 e RG6: un elemento fisso o mobile copre il focus e il testo ingrandito; il ripiego (intestazione ferma in cima alla pagina) non richiede alcuna trasformazione.',
  ambizione=['A5'], regole=['RG6', 'RG9'], prova='site/sistema/#c-nav', verifica='prova a testo 200% e zoom 200%: nessun elemento fisso')
d('E06', 'esclusa', unisci(FE(('R03', 'banner cookie'), ('R03', 'consenso e annulla'), ('R04', 'M01'), ('R05', 'M03'), ('R53', 'entrata della finestra del consenso'), ('R20', 'intro'))),
  'nessun banner di consenso, nessuna introduzione all\'arrivo',
  F1, 'P1 leggere subito',
  'Banner di consenso e introduzioni animate (R20 dura 6-12 secondi) precedono il contenuto.',
  motivo_tipo='vincolo', motivo_dettaglio='Niente cookie né statistiche [P]: nessun consenso da chiedere; il compito P1 chiede di capire in pochi secondi, quindi nessuna introduzione.',
  ambizione=['A2'], regole=['RG4', 'RG7'], prova='site/sistema/#c-piede', verifica='la prima foto mostra già proposta e stato')
d('E07', 'adattata', unisci(FE(('R20', 'apertura isola'), ('R20', 'cambio categoria'), ('R20', 'apertura progetto'), ('R20', 'chiusura progetto'))),
  'componente percorso: posizione («Passo N di 5») e «cosa viene dopo» come informazione fissa, senza transizioni',
  F1 + ' / ' + F2, 'P1-P5 sapere dove sono e dove vado',
  'L\'isola contestuale di R20 tiene in un solo oggetto categoria, anteprima, selettore e contatore, con transizioni di 500-1400 ms.',
  adattamento='Si conserva la funzione (dove sei, cosa succede dopo) e si toglie la forma: «Passo N di 5» e il collegamento «Avanti» sono testo fisso. Dichiarato: l\'attenuazione toglie ciò che rendeva l\'isola spettacolare (la metamorfosi della pillola); resta ciò che serve alla persona.',
  requisiti_funzionali=RIDOTTO + ['tastiera'], ripiego='Nessuna transizione: l\'informazione è già in testo.',
  ambizione=['A5'], regole=['RG6'], prova='site/sistema/#c-percorso', verifica='prova tastiera e movimento ridotto')
d('E08', 'esclusa', unisci(FE(('R03', 'apertura del riquadro voce'))),
  'nessun riquadro di dialogo dal vivo né passo di consenso',
  F1, 'P2 ascoltare un campione registrato',
  'R03 trasforma una pillola fissa in un riquadro con consenso a registrare e a condividere dati con terzi per parlare con un agente.',
  motivo_tipo='compito', motivo_dettaglio='Kalliope non ha una conversazione dal vivo sul sito: i campioni sono registrazioni; non c\'è nulla da registrare né un consenso da chiedere.',
  ambizione=['A1'], regole=['RG3', 'RG7'], prova='site/sistema/#c-ascolto', verifica='nessuna richiesta di microfono né consenso nel sito')
d('E09', 'esclusa', unisci(FE(('R03', 'cambio scheda dei casi d\'uso'), ('R04', 'M10'), ('R04', 'M11'), ('R52', 'carosello'))),
  'nessun carosello né scheda che sostituisce il contenuto',
  F1 + ' / ' + F2, 'P2 e P5 vedere tutte le scelte insieme',
  'Carosello e schede a scambio fanno vedere un solo elemento alla volta e nascondono gli altri.',
  motivo_tipo='compito', motivo_dettaglio='Le sei registrazioni, le cinque distribuzioni e le frasi dell\'Aiuto sono poche e vanno confrontate: devono stare tutte in pagina. Con le schede il contenuto nascosto non si trova con la ricerca del browser.',
  ambizione=['A5'], regole=['RG5'], prova='site/sistema/#c-scelta-sistema', verifica='tutte le sezioni visibili senza gesto')
d('E10', 'adattata', unisci(FE(('R51', 'schede iOS'), ('R05', 'M14'))),
  'componente scelta-sistema: l\'etichetta della voce scelta cambia colore e simbolo in 120 ms',
  F4, 'P4 capire quale sezione è attiva',
  'R51 cambia il colore dell\'etichetta di scheda in 150 ms e dissolve il pannello; R05 sposta un indicatore sulla scheda della FAQ.',
  adattamento='Si conserva solo il segnale di stato sull\'indice delle distribuzioni (testo e sottolineatura quando la sezione è raggiunta), senza sostituire il contenuto.',
  requisiti_funzionali=RIDOTTO, ripiego='Istantaneo con movimento ridotto; il segno non è il solo colore.',
  ambizione=['A5'], regole=['RG6'], prova='site/sistema/#c-scelta-sistema', verifica='prova movimento ridotto')
d('E11', 'esclusa', unisci(FE(('R04', 'M03'))), 'nessun conteggio animato dei numeri',
  F3 + ' / ' + F5, 'P7 leggere una cifra senza attendere',
  'R04 fa crescere la cifra da zero in 1500 ms con le barre, con la frase completa già nel DOM.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG6: contare una cifra non porta informazione e ritarda chi legge con lentezza. Si trasferisce solo il principio (la frase intera già nel documento) con RG5 e D29.',
  ambizione=['A4'], regole=['RG5', 'RG6'], prova='site/sistema/#c-misura', verifica='le cifre sono nel testo al caricamento')
d('E12', 'adattata', unisci(FE(('R22', 'ricerca di un uccello'), ('R04', 'M12'))),
  'componente filtro: scrivendo parte della frase, l\'elenco si restringe e la parte coincidente è in grassetto',
  F1 + ' / ' + F2, 'P5 trovare la frase della finestra',
  'R22 mostra suggerimenti con la parte coincidente in grassetto; R04 mostra l\'incertezza accanto al dato.',
  adattamento='Il filtro dell\'Aiuto riduce l\'elenco mentre si scrive e dichiara quante frasi restano («3 frasi»), con la parte coincidente in grassetto; senza movimento: l\'elenco si aggiorna di colpo.',
  requisiti_funzionali=SENZA_JS + RIDOTTO + ['lettore_schermo'], ripiego='Senza script l\'elenco è completo; il numero di risultati è annunciato con una regione aria-live educata.',
  ambizione=['A3'], regole=['RG5', 'RG6'], prova='site/sistema/#c-filtro', verifica='prova con tastiera, senza JavaScript e lettore (proxy)')
d('E13', 'esclusa', unisci(FE(('R22', 'mappa degli Stati'), ('R22', 'uovo e nido'), ('R22', 'Waves of Interest'))), 'nessun grafico guidato dallo scorrimento né dal puntatore',
  F3, 'P7 leggere le misure',
  'Le uova, i nidi, la mappa e il grafico a linee di R22 cambiano con lo scorrimento o il puntatore e non hanno alternativa da tastiera.',
  motivo_tipo='compito', motivo_dettaglio='Le misure di Kalliope sono sei numeri con metodo: una tabella con la frase accanto serve il compito (D29); non esistono serie geografiche o temporali da disegnare.',
  ambizione=['A2'], regole=['RG14'], prova='site/sistema/#c-misura', verifica='nessuna')
d('E14', 'adattata', unisci(FE(('R01', 'hover pulsante'), ('R03', 'hover pulsante'), ('R02', 'tessera di categoria'), ('R04', 'M16'), ('R21', 'link nel testo'), ('R21', 'focus da tastiera'),
                               ('R50', 'ombra delle schede'), ('R51', 'anello di focus'), ('R51', 'colore dei collegamenti'), ('R53', 'bordo dei collegamenti'))),
  'stato dei comandi: hover e focus identici, transizione di 100 ms su colore e sottolineatura',
  F1, 'P1-P6 sapere cosa è comandabile e cosa ha il focus',
  'I riferimenti cambiano colore, ombra o bordo in 50-300 ms al passaggio e al focus.',
  adattamento='Un solo stato per hover e focus: colore e sottolineatura in 100 ms; il focus ha in più l\'anello. Nessuna informazione esiste solo al passaggio del mouse.',
  requisiti_funzionali=RIDOTTO + ['tastiera', 'tocco'], ripiego='Con movimento ridotto il cambio è istantaneo; su tocco non c\'è passaggio e lo stato premuto lo sostituisce.',
  ambizione=['A5'], regole=['RG6', 'RG9'], prova='site/sistema/#c-bottone', verifica='prova hover, focus e pressione con foto')
d('E15', 'esclusa', unisci(FE(('R01', 'hover carta'), ('R20', 'passaggio sull\'immagine'), ('R22', 'uccelli del titolo'))), 'nessun effetto che segue il puntatore',
  F1, 'P1-P6 usare il sito senza puntatore',
  'Il gradiente che segue il mouse (R01), il cerchio con «+» (R20) e le pupille che seguono il cursore (R22) dipendono dal puntatore e non portano informazione.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG6 e RG9: puntamento oculare, interruttore e tocco non hanno un puntatore che passa; il gesto di ricompensa senza scopo non serve al compito.',
  ambizione=['A5'], regole=['RG6', 'RG9'], prova='site/sistema/#c-movimento', verifica='nessuna regola che segua il puntatore')
d('E16', 'adattata', unisci(FE(('R21', 'condivisione'))), 'componente condividi: indirizzo della pagina in un campo selezionabile e pulsante «Copia l\'indirizzo»',
  F2, 'P3 inoltrare il collegamento a chi installerà',
  'R21 allarga un cerchio «Share» in sei icone di reti sociali e e-mail; per Kalliope serve solo copiare l\'indirizzo.',
  adattamento='Nessuna icona di terzi: un campo di sola lettura con l\'indirizzo e, con script, il pulsante «Copia l\'indirizzo» che risponde a parole.',
  requisiti_funzionali=SENZA_JS + ['tastiera'], ripiego='Il campo è selezionabile con la tastiera; senza script resta il testo.',
  ambizione=['A5'], regole=['RG5', 'RG7'], prova='site/sistema/#c-condividi', verifica='prova senza JavaScript')
d('E17', 'adattata', unisci(FE(('R52', 'cambio tema'))), 'token colore: variante scura con lo stesso schema di ruoli',
  F1, 'P1-P6 leggere con il tema del sistema',
  'R52 scambia le icone e cambia lo sfondo in 200-300 ms al cambio di tema.',
  adattamento='Il cambio avviene con il sistema e non dal sito: nessuna transizione, nessun interruttore.',
  requisiti_funzionali=['contrasto', 'colori_forzati'], ripiego='In modalità forzata decide il sistema.',
  ambizione=['A4'], regole=['RG2'], distinzione='Variante scura nei colori di Kalliope (inchiostro verde scuro e verde acqua), senza interruttore: diversa da R52.', prova='site/sistema/#t-colori', verifica='contrasto-qa in tema scuro')
d('E18', 'esclusa', unisci(FE(('R01', 'caricamento mano e lettere'), ('R01', 'clic sul comando'))), 'nessuna scena WebGL né sequenza di caricamento',
  F1, 'P1 capire senza attendere',
  'R01 carica una scena WebGL (11,4 MB, 1 fotogramma al secondo in software) con una mano che ruota e un titolo che si scrive lettera per lettera.',
  motivo_tipo='vincolo', motivo_dettaglio='Sito statico leggero, nessuna dipendenza né peso inutile (progetto.md §9): la scena richiederebbe una libreria di rendering e megabyte. Il gesto «il prodotto che lavora davanti a te» si conserva in A4 con le barre della voce, senza WebGL.',
  ambizione=['A4'], regole=['RG7'], prova='site/sistema/#c-movimento', verifica='nessun canvas nel sito')
d('E19', 'adattata', unisci(FE(('R06', 'M07'), ('R06', 'M03'), ('R06', 'M02'), ('R05', 'M12'))), 'componente ascolto: cinque barre dell\'icona come indicatore del suono; il gesto del titolo diventa il gesto «Ascolta»',
  F1 + ' / ' + F2, 'P2 vedere che la voce sta parlando e dove',
  'R06 lega il titolo («sliding doors») a un gesto: la porta si apre al clic sul suono; ha anche barrette che indicano il suono acceso o spento. R05 tiene un solo suono per volta e un riproduttore a pulsanti.',
  adattamento='Cinque barre arrotondate (come l\'icona) che si alzano seguendo il livello della voce mentre suona e restano ferme e piene a suono finito; il gesto è il solo pulsante «Ascolta». Dichiarato: la scenografia della porta è attenuata a una sola animazione di barre; si conserva il legame fra gesto, tema e suono.',
  requisiti_funzionali=RIDOTTO + SENZA_JS + ['lettore_schermo'], ripiego='Con movimento ridotto le barre restano ferme e piene; la frase in corso è evidenziata e la posizione scritta («frase 1 di 2, 00:03»). Senza script: controlli nativi dell\'audio.',
  ambizione=['A1', 'A4'], regole=['RG3', 'RG6'], identita=True, distinzione='Barre dell\'icona di Kalliope legate alla voce vera e al testo in corso; R06 usa barrette per acceso/spento senza voce.',
  prova='site/sistema/#c-ascolto', verifica='prova con e senza movimento ridotto; foto della sequenza a 0, 1, 2 secondi',
  candidati=[
      {'valore': 'sfera di colore come stato della voce (R03)', 'fonte': 'R03', 'eliminato_da': 'K5'},
      {'valore': 'scena animata che racconta il titolo (porta, treno: R06)', 'fonte': 'R06', 'eliminato_da': 'K2'},
      {'valore': 'avatar 3D che esegue il prodotto (R01)', 'fonte': 'R01', 'eliminato_da': 'K2'},
      {'valore': 'cinque barre dell\'icona che seguono il livello della voce', 'fonte': 'icona dell\'app (K5), R06 M07 per l\'idea delle barrette'},
  ], valore='cinque barre dell\'icona che seguono il livello della voce')
d('E20', 'esclusa', unisci(FE(('R06', 'M01'), ('R06', 'M04'), ('R06', 'M05'), ('R06', 'M08'), ('R06', 'M10'), ('R06', 'M11'))), 'nessuna soglia animata, scena di treno, frecce di capitolo né avvertenza ritardata',
  F1, 'P1 capire e decidere con calma',
  'R06 apre con una soglia, una scena di treno, frecce da 1000 ms e un pannello di avvertenza che compare dopo 2-8 secondi e scompare da solo.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG4 (lo stato prima della promessa, senza ritardo né scomparsa) e RG6: la scena e il ritardo sono incompatibili con il cartellino fisso (D24); il tema narrativo non esiste nel sito.',
  ambizione=['A2'], regole=['RG4', 'RG6'], prova='site/sistema/#c-stato', verifica='il cartellino di stato è nella prima foto')
d('E21', 'esclusa', FE(('R20', 'scorrimento telefono')), 'nessuno scorrimento a velocità diverse per elemento',
  F1, 'P1 leggere dal telefono',
  'R20 al telefono mantiene il parallasse del computer.',
  motivo_tipo='conflitto', motivo_dettaglio='Conflitto con RG9: lo scorrimento è quello nativo del telefono.',
  ambizione=['A5'], regole=['RG9'], prova='site/sistema/#c-movimento', verifica='nessuna')

d('D44', 'adattata', unisci(F('effetti con movimento ridotto')), 'regola RG6/RG15 e tutte le varianti prefers-reduced-motion: l\'effetto è sostituito da un equivalente fermo',
  F1 + ' / ' + F2, 'P1-P6 non subire movimento e non perdere informazione',
  'Nei tredici siti con la riga misurata nessuno sostituisce un effetto con un\'alternativa: R52, R21 e in parte R03, R53, R22, R50 lo tolgono; R01, R02, R04, R05, R06, R20 e R51 lo lasciano invariato. Il ripiego richiesto dal metodo è ridurre o sostituire, non solo togliere.',
  adattamento='Ogni effetto del sito ha la sua variante ridotta con lo stesso contenuto: le barre dell\'ascolto restano ferme e piene e la frase in corso resta evidenziata con la posizione scritta; la dissolvenza dei dettagli è istantanea con il cambio di simbolo; lo stato dei comandi cambia colore di colpo.',
  requisiti_funzionali=RIDOTTO, ripiego='Sostituzione, non rimozione: evidenziazione fissa e testo di posizione al posto del movimento delle barre; cambio di simbolo e di etichetta al posto della dissolvenza.',
  ambizione=['A4'], regole=['RG2', 'RG6'], identita=True, distinzione='Nessun riferimento sostituisce: la sostituzione con evidenziazione e posizione scritta è una scelta di Kalliope (regola proposta RG15).',
  prova='site/sistema/#c-movimento', verifica='confronto tra foto normale e foto con prefers-reduced-motion per ogni effetto; verifica delle animazioni computate',
  candidati=[
      {'valore': 'lasciare l\'effetto invariato (R01, R02, R04, R05, R06, R20, R51)', 'fonte': 'R04, R05, R06', 'eliminato_da': 'RG2'},
      {'valore': 'togliere l\'effetto (R52, R21)', 'fonte': 'R52, R21', 'eliminato_da': 'RG15'},
      {'valore': 'sostituire l\'effetto con un equivalente fermo che porta la stessa informazione', 'fonte': 'references/direzione.md §2 (ridurre o sostituire); progetto.md §4.2'},
  ], valore='sostituire l\'effetto con un equivalente fermo che porta la stessa informazione')

# ---------------------------------------------------------------- Valori d'identità e struttura: scelte progettuali dichiarate
d('T01', 'progettuale', [], 'token colore: verde acqua scuro per testo e comandi, verde acqua dell\'icona per barre e grafica',
  F1 + ' / ' + F2 + ' / ' + F3, 'P1-P6 riconoscere Kalliope e leggere con contrasto',
  'L\'unico segno di marca esistente è l\'icona (bolla con gradiente da #2fb39a a #16806f e cinque barre bianche). Il verde chiaro non regge il testo (2,4:1 su carta); la tinta scura derivata (#0a5347, 8,3:1 su carta, 7,5:1 su carta-2, 9,0:1 con testo bianco) regge testo e bottoni; #16806f (4,5:1) resta per barre e grafica.',
  ambizione=['A1', 'A4'], regole=['RG1'], identita=True, prova='site/sistema/#t-colori', verifica='contrasto-qa in tema chiaro e scuro',
  candidati=[
      {'valore': '#2fb39a come colore di testo e di bottone', 'fonte': 'icona dell\'app', 'eliminato_da': 'K3'},
      {'valore': 'blu notte con turchese chiaro', 'fonte': 'R53', 'eliminato_da': 'K4'},
      {'valore': 'rosso pieno per il comando principale', 'fonte': 'R50', 'eliminato_da': 'K4'},
      {'valore': 'bordeaux per collegamenti e comandi', 'fonte': 'R51', 'eliminato_da': 'K5'},
      {'valore': 'viola su vetro scuro', 'fonte': 'R01', 'eliminato_da': 'K5'},
      {'valore': '#0a5347 per testo e comandi, #16806f per barre e grafica', 'fonte': 'derivato dall\'icona dell\'app, verificato per contrasto'},
  ], valore='#0a5347 per testo e comandi, #16806f per barre e grafica')
d('T02', 'progettuale', [], 'token colore: sfondo carta #f8f6f0, inchiostro #1b2623, variante scura che segue il sistema',
  F1 + ' / ' + F2, 'P1-P6 leggere a lungo senza abbagliamento',
  'Una carta calda e un inchiostro verde scurissimo danno 14,4:1 senza il bianco puro dei concorrenti e senza il fondo scuro obbligato; la variante scura (#10181a con testo #e9efec, 15,4:1) segue il sistema.',
  ambizione=['A4'], regole=['RG1'], identita=True, prova='site/sistema/#t-colori', verifica='contrasto-qa in tema chiaro e scuro',
  candidati=[
      {'valore': 'bianco puro con testo nero', 'fonte': 'R50, R51, R52', 'eliminato_da': 'K4'},
      {'valore': 'fondo scuro come tema predefinito', 'fonte': 'R53, R01', 'eliminato_da': 'K4'},
      {'valore': 'carta #f8f6f0 con inchiostro #1b2623', 'fonte': 'scelta progettuale'},
  ], valore='carta #f8f6f0 con inchiostro #1b2623')
d('T03', 'progettuale', [], 'token tipografia: carattere di sistema per il testo, carattere a spaziatura fissa per il testo digitato',
  F1 + ' / ' + F2 + ' / ' + F3, 'P2 distinguere il testo scritto dal testo detto',
  'Nessun carattere ospitato: non c\'è in questo ambiente un file con licenza libera verificata e il vincolo è di non aggiungere peso né richieste. L\'identità tipografica sta nella distinzione fra il testo digitato (spaziatura fissa, come nel campo della finestra) e il testo detto (carattere del corpo).',
  ambizione=['A1'], regole=['RG1', 'RG7'], identita=True, prova='site/sistema/#t-tipografia', verifica='prova nei tre motori (carattere di sistema diverso per sistema): lacuna fino alla matrice completa',
  candidati=[
      {'valore': 'carattere remoto da un servizio di caratteri', 'fonte': 'R50 (Poppins, Open Sans), R52 (Quicksand)', 'eliminato_da': 'K2'},
      {'valore': 'carattere ospitato nel sito con licenza OFL', 'fonte': 'R51 usa un carattere proprio', 'eliminato_da': 'K2'},
      {'valore': 'carattere di sistema per il corpo e a spaziatura fissa per il testo digitato', 'fonte': 'scelta progettuale; campo di testo dell\'app'},
  ], valore='carattere di sistema per il corpo e a spaziatura fissa per il testo digitato')
d('T04', 'progettuale', [], 'token forma: riquadri a bolla di fumetto (raggio 18 px), barre a capsula',
  F1 + ' / ' + F2, 'P1-P6 riconoscere la famiglia visiva',
  'L\'icona è una bolla con angoli ampi e barre a capsula: la stessa geometria dà il carattere ai riquadri, ai cartellini e ai bottoni.',
  ambizione=['A4'], regole=['RG1'], identita=True, prova='site/sistema/#t-forme', verifica='lettura delle foto del percorso',
  candidati=[
      {'valore': 'riquadri a spigolo vivo', 'fonte': 'uso comune dei siti di prodotto', 'eliminato_da': 'K5'},
      {'valore': 'pillole per ogni comando e voce di menu', 'fonte': 'R20, R05', 'eliminato_da': 'K4'},
      {'valore': 'bolla con raggio 18 px e barre a capsula', 'fonte': 'icona dell\'app'},
  ], valore='bolla con raggio 18 px e barre a capsula')
d('T05', 'progettuale', [], 'token motivo: cinque barre a capsula di altezze diverse (come l\'icona) per indicatore del suono, divisore di sezione e segno del cartellino',
  F1 + ' / ' + F2, 'P2 e P1 vedere la voce e riconoscere il prodotto',
  'Le cinque barre dell\'icona sono il solo segno di marca e rappresentano già una voce: usarle come indicatore del suono lega l\'identità al compito.',
  ambizione=['A4'], regole=['RG1', 'RG6'], identita=True, prova='site/sistema/#t-forme', verifica='foto dell\'ascolto a riposo, in riproduzione e con movimento ridotto',
  candidati=[
      {'valore': 'sfera di colore', 'fonte': 'R03', 'eliminato_da': 'K5'},
      {'valore': 'punti braille che formano il marchio', 'fonte': 'R02', 'eliminato_da': 'K5'},
      {'valore': 'cinque barre a capsula dell\'icona', 'fonte': 'icona dell\'app'},
  ], valore='cinque barre a capsula dell\'icona')
d('T06', 'progettuale', [], 'token spazi: scala di 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96), colonna di testo di 62 caratteri, bersagli di 44 px',
  F1 + ' / ' + F2, 'P1-P6 ritmo di lettura prevedibile',
  'Una scala unica evita valori occasionali; la colonna di 62 caratteri e i bersagli di 44 px vengono da RG8 e RG9.',
  ambizione=['A5'], regole=['RG1', 'RG8', 'RG9'], prova='site/sistema/#t-spazi', verifica='esame-impaginazione')
d('T07', 'progettuale', [], 'token movimento: durate 0 (ridotto), 100, 120 e 240 ms; il movimento del suono dura quanto il suono',
  F1, 'P1-P6 movimento breve e prevedibile',
  'RG6 limita ogni cambio di stato a 240 ms; i riferimenti misurati tengono da 100 a 600 ms per le aperture e i cambi di stato.',
  requisiti_funzionali=RIDOTTO, ripiego='Con prefers-reduced-motion tutte le durate vanno a 0 e le informazioni sono portate da simbolo, etichetta ed evidenziazione.',
  ambizione=['A4'], regole=['RG1', 'RG6'], prova='site/sistema/#t-movimento', verifica='verifica delle durate computate')
d('T08', 'progettuale', [], 'composizione del sito: pagina iniziale con l\'ascolto nel primo schermo e cammino in cinque pagine (Ascolta, Stato e limiti, Installa, In riunione, Aiuto), pagina Non ancora, 404, catalogo',
  F1 + ' / ' + F2 + ' / ' + F3, 'P1-P6 un compito per pagina, con indirizzo proprio da inoltrare e conservare',
  'Tre direzioni sono state confrontate sugli stessi contenuti (una pagina narrata, un cammino a pagine per compito, porte per persona); il cammino a pagine vince per inoltro, aiuto da segnalibro, carico di lettura e tastiera (confronto in direzione.md).',
  ambizione=['A2', 'A3', 'A5'], regole=['RG1', 'RG5'], prova='site/index.html', verifica='percorso completo con foto a 1440×900 e 390×844')
