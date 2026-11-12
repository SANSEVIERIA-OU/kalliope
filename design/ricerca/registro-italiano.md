# Registro delle fonti italiane G01-G04: come si parla a pazienti e familiari

Visita del 12/11/2026, worker visita-4 (`passo.mjs`, posto `leggero`, senza finestra, Chromium; non c'è Chrome MCP in questo host). Quattro
pagine di associazioni, lette e fotografate al computer (1440x900) e al telefono (430x932 con `passo.mjs`; 390x844 con
`strumenti/visita4-misure.mjs`). Non sono riferimenti di design e non hanno una scheda completa: servono a sapere **come si parla in italiano**
a chi vive con una difficoltà di voce o di comunicazione e a chi gli sta intorno. Piano: `piano.md` §4, compiti C6 e C9. Fonti elencate in
`selezione.md`.

| ID | Associazione e pagina | Condizione | A chi parla | Foto | Testo letto |
|---|---|---|---|---|---|
| G01 | AISLA, home https://www.aisla.it/ e quattro pagine di «Vivere con la SLA»: `/lespressione-dei-propri-diritti-attraverso-la-comunicazione-non-verbale/`, `/chi-e-il-caregiver-familiare/`, `/glossario-sla/`, `/comunicatore-vocale-a-controllo-oculare/` | SLA | persona con SLA, familiare e caregiver, donatori | `prove/G01/desktop/001…018`, `prove/G01/telefono/001…005`, `prove/G01/script/001…004` | `prove/G01/testo-*.txt` |
| G02 | AILAR, https://www.ailar.it/come-si-torna-a-parlare/tornare-a-parlare.html | laringectomia | persona laringectomizzata e famiglia | `prove/G02/desktop/001…004`, `prove/G02/telefono/001…003`, `prove/G02/script/001…004` | `prove/G02/testo-tornare-a-parlare-desktop.txt` |
| G03 | Associazione Vivavoce, https://associazionevivavoce.it/ | balbuzie e difficoltà di comunicazione | persone con balbuzie, famiglie, scuole | `prove/G03/desktop/001…010`, `prove/G03/telefono/006…011` (001-005: con la finestra dei cookie aperta, vedi `prove/G03/LEGGIMI.txt`), `prove/G03/script/001…004` | `prove/G03/testo-home-computer.txt` |
| G04 | A.I.T.A. Umbria OdV, https://sites.google.com/site/aitaumbriaonlus/rubrica/life-participation-approach-to-aphasia | afasia | logopedisti, persone con afasia, familiari | `prove/G04/desktop/001…004`, `prove/G04/telefono/001…003`, `prove/G04/script/001…004` | `prove/G04/testo-pagina-desktop.txt` |

Le statistiche sulle frasi sono in `prove/registro-statistiche.jsonl` (strumento `strumenti/visita4-registro.py`: considera solo i paragrafi di almeno 8
parole, frasi separate da punto, punto esclamativo e interrogativo; la nuvola di tag e i menu sono esclusi). Sono euristiche, non una misura di
leggibilità.

## Numeri

| Fonte e pagina | Frasi | Parole | Parole per frase (media) | Frase più lunga | Frasi oltre 30 parole | Parole «tu» (ti, tuo, ricorda…) |
|---|---|---|---|---|---|---|
| G01 home | 24 | 402 | 17,6 | 40 | 5 (21%) | 2 |
| G01 articolo «L'espressione dei propri diritti…» | 46 | 1.664 | 35,9 | 115 | 23 (50%) | 0 |
| G01 «Chi è il caregiver familiare» | 16 | 253 | 16,8 | 37 | 3 (19%) | 13 |
| G01 «Glossario SLA» | 9 | 146 | 17,0 | 39 | 2 (22%) | 0 |
| G02 «Tornare a parlare» | 19 | 291 | 15,5 | 39 | 1 (5%) | 0 |
| G03 home | 6 | 142 | 24,7 | 38 | 1 (17%) | 0 |
| G04 «Life Participation Approach to Aphasia» | 73 | 1.881 | 25,5 | 82 | 22 (30%) | 1 |

Corpo del testo (lettura `strumenti/visita4-lettura.js`): G01 15 px/1,47 grigio rgb(102,102,102) al telefono; G02 18 px/1,5 con carattere Lato;
G03 13-17 px (a seconda del paragrafo) in peso leggero; G04 16 px/1,38 Open Sans. Al telefono G01 chiede una larghezza di 398 px su 390
(scroll orizzontale di circa 8 px): `prove/G01/script/misure-script.json`.

## Come nominano la condizione

- **SLA (G01)**: «SLA», «sclerosi laterale amiotrofica» (nome intero solo nell'intestazione e nei titoli), «malattia» (3 volte nell'home), «persone con SLA» e
  «persone malate di SLA» nello stesso articolo, ma anche «il malato» (3), «il paziente affetto da SLA» (3), «persone disabili», «grave disabilità».
  La home non usa né «malato» né «paziente» né «disabilità»: parla di «persone» (slogan «Persone che aiutano persone»).
- **Laringectomia (G02)**: «laringectomizzati» (nome dell'associazione), «pazienti», «soggetti laringectomizzati»; la perdita è «mutilazione fortemente
  invalidante», «deficit a carico di uno di questi organi».
- **Balbuzie (G03)**: «balbuzie», «disturbi della voce, dell'apprendimento e della comunicazione», «problemi nella comunicazione», «difficoltà legate alla
  comunicazione»; chi vive la condizione «soffre o ha sofferto» (3 «soffr-»). Nessun «malato» né «disabile».
- **Afasia (G04)**: «persone con afasia» e «persone afasiche» (frase di apertura: «Le persone afasiche comunicano meglio di come parlano», citazione di
  Audrey Holland), «assistiti» e «pazienti» (18) per chi riceve la terapia, «logopedista» per chi la dà; «handicap comunicativi» in una citazione di legge.

## Come nominano gli ausili

- **G01**: «comunicatori a puntamento oculare», «puntatore oculare» (5), «comunicatore» (4), «sistemi di comunicazione alternativi», «dispositivo informatico»
  (4), «tecnologia» (4), «sintetizzatore vocale» (1: «coloro che si esprimono tramite puntatore oculare e sintetizzatore vocale (ad esempio le persone affette da SLA)»); la voce è nella definizione del glossario: «Comunicatore vocale a controllo oculare: dispositivo informatico che
  consente, attraverso il movimento degli occhi, di riprodurre il suono della voce.» L'articolo chiama il tutto «comunicazione non verbale» (la
  sintesi vocale non è il tema: il tema è la firma davanti al notaio). La sigla «CAA» non compare nelle pagine lette; «comunicazioni aumentative ed alternative» compare una sola volta, dentro la citazione della
  Convenzione ONU nell'articolo (G01), e «supporto aumentativo-alternativo» una volta in G04 (informazioni «nel formato più accessibile (ad esempio, scritto o con
  modalità di supporto aumentativo-alternativo)»). La guida «CAA nella SLA» di AISLA in PDF non è stata letta: nessun estrattore PDF.
- **G02**: «voce esofagea», «protesi tracheo esofagea», «laringofono» (2), «riabilitazione fonatoria»; per loro «parlare» e «voce» sono due cose
  diverse: «Per "parlare" si intende la produzione di suoni a contenuto verbale…», «la voce, cioè il suono emesso dall'uomo mentre parla… Questo non significa
  compromettere la possibilità di parlare.»
- **G03, G04**: nessun ausilio nominato (G03: «servizio di supporto gratuito»; G04: «sistemi di comunicazione» assenti).

Per Kalliope: le persone di G01 conoscono già «comunicatore», «puntatore oculare» e «sintetizzatore vocale»; nessuna fonte usa «voce sintetica», «voce
neurale» o «microfono» (0 occorrenze nelle quattro pagine e nelle altre pagine G01 lette), né «tablet» (0), «riunione» (0) o «videochiamata» (0); «app» compare solo come voce
della nuvola di tag di AISLA.

## Parole usate ed evitate

| Si usa | Dove | Si evita o compare poco |
|---|---|---|
| «persone» + condizione («persone con SLA», «persone con afasia») | G01 (articolo), G04 | «malato» sulla home di G01, «disabile» in G03 |
| «comunicare», «comunicazione» (12 in G01 articolo, 3 in G03, 6 in G04) | tutte | «parlare» come compito (solo G02: 9 occorrenze) |
| «partecipare», «partecipazione» (11 in G04, 2 in G01) | G04, G01 | «autonomia», «indipendenza» (2+2 in G01, 1+1 in G04) quasi solo negli articoli lunghi |
| «diritto», «diritti» (13+8 in G01 articolo) | G01 | termini medici tecnici nelle pagine per il pubblico (sigle: DAT, ADI, PEG, NIV, PAI, PCC… presenti nel glossario di G01) |
| «caregiver» (11 nella pagina dedicata) con spiegazione al primo uso | G01 | «assistente» senza spiegazione |
| «vogliamo» (1ª plurale: valori e missione) | G03 | seconda persona («tu») in G02, G03, G04 |
| «dona ora», «cosa puoi fare tu» come azione per chi sostiene | G01 | nessuna istruzione d'uso di strumenti (nessuna fonte spiega come si usa un comunicatore) |

## Lunghezza delle frasi e persona

- Le pagine che si rivolgono a una persona sola sono le più corte: G01 «caregiver» 16,8 parole per frase, G02 15,5, G01 glossario 17,0, G01 home 17,6.
  Le pagine dei contenuti per professionisti o giuridici sono le più lunghe: G01 articolo 35,9 (metà delle frasi oltre 30 parole, la più lunga di 115), G04 25,5
  con frasi fino a 82 parole.
- La **seconda persona** compare in G01 («Se ti trovi nella condizione di assistere un proprio caro, ricorda che…», «Rispettati ed apprezzati», «Non permettere che la
  malattia del tuo caro sia costantemente al centro della tua attenzione», «ti ascoltiamo», «dove sei?»); G03 usa «Non sei l'Unico !» (seconda persona) ma poi la
  prima plurale («Vogliamo contribuire…»); G02 e G04 parlano di una terza persona astratta («il paziente», «l'assistito», «le persone afasiche»).
- G01 mescola due registri nello stesso sito: tessere colorate dell'home in seconda persona e in poche parole («ti ascoltiamo», «dove sei?», «dona ora»), e
  articoli giuridici in terza persona con commi e leggi (L. 3 marzo 2009 n. 18, artt. 2 e 3 della Costituzione).

## Cosa spiegano prima

1. **G01 glossario**: perché servono le parole. «Per COMUNICARE correttamente, occorre innanzitutto CAPIRE! Ecco perché abbiamo deciso di realizzare il "Glossario
   della SLA"», con una voce per ciascun termine (da «Accompagnamento» a «Ventilazione meccanica», 58 voci tra cui «Comunicatore», «Disartria», «Brain Computer
   Interface», sigle «ADI», «PEG», «NIV»).
2. **G01 caregiver**: prima il nome («Il termine anglosassone "caregiver" è entrato ormai stabilmente nell'uso comune; indica "colui che si prende cura"»), poi i dati
   (donne 74%), poi sei consigli in imperativo.
3. **G02**: prima cosa significa «parlare» (organi, suoni), poi che la laringectomia toglie la voce ma non la possibilità di parlare, poi le alternative
   (protesi, laringofono) e il collegamento a una guida da scaricare.
4. **G03**: prima i numeri («Non sei l'Unico!»: 1,5% nel mondo, 8% che hanno balbettato, 1.000.000 in Italia, 150.000 sotto i 18 anni, animati a
   contatore), poi chi sono e cosa vogliono («La nostra mission», «I nostri valori», «I nostri partner»); l'invito è «CONTATTACI».
5. **G04**: prima la definizione di legge del logopedista, poi la ragione del cambio di approccio (isolamento e perdita dei contatti sociali) e poi sette
   regole per chi cura.

## Tono

- G01: istituzionale e caldo insieme. L'home è un mosaico di tessere colorate con parole brevi in minuscolo («ti ascoltiamo», «dove sei?»), ma la scrittura degli
  articoli è giuridica e lunga. I testi lunghi rimandano a «Leggi anche».
- G02: clinico e rassicurante in poche righe («Questo non significa compromettere la possibilità di parlare»). Usa «mutilazione fortemente invalidante» per
  descrivere l'intervento. Nessun esempio, nessuna frase di incoraggiamento.
- G03: emotivo e giovane: citazione di Fabrizio De André in apertura («Tu prova ad avere un mondo nel cuore e non riesci ad esprimerlo con le parole»), mascotte,
  numeri a contatore, parole come «rivoluzione culturale», «abbattere le discriminazioni».
- G04: accademico (sigla SMARTER, assiomi di Watzlawick, Rogers) per logopedisti; una sola frase calda in apertura (Holland).

## Cosa non funziona per chi legge con difficoltà (osservazioni, non giudizi sulle associazioni)

- Frasi di 40-115 parole in G01 articolo e fino a 82 in G04; elenchi senza punteggiatura che il lettore deve interpretare.
- Corpo di 13-15 px in peso leggero e grigio (G01 telefono rgb(102,102,102) su crema; G03 13 px nello script 390x844): lettura faticosa.
- Finestre dei cookie che coprono parte del testo (G01 semitrasparente sul testo, G02 barra scura in basso, G03 finestra al centro che copre l'arrivo, G04 riquadro in
  basso a sinistra). G03 e G02 chiedono una scelta prima di leggere; nessuna delle quattro rende il rifiuto più difficile dell'accettazione, ma in G03 al
  telefono la finestra copre il primo schermo.
- Parole tecniche e sigle senza spiegazione nel testo (G01: DAT, ADI, PEG; G04: «SMARTER»); G01 le raccoglie nel glossario.
- Informazioni sull'uso quotidiano degli strumenti: assenti. Nessuna fonte spiega come si usa un comunicatore o cosa fare in una riunione.

## Cosa si porta a Kalliope (indicazioni per la scrittura, non decisioni)

- Chiamare le persone «persone», nominare la condizione solo quando serve e con il nome che usano loro (SLA, afasia, laringectomia, balbuzie), e mai «malato»
  o «paziente» per chi usa Kalliope (chi usa Kalliope è una persona che scrive e parla).
- Usare i termini che già conoscono: «comunicatore», «puntatore oculare», «voce» (non «voce sintetica» come primo termine): da verificare con persone
  vere (nessun dato diretto).
- Spiegare un termine nuovo al primo uso con una frase sola, come fanno G01 (caregiver) e G02 (parlare/voce), e raccoglierli in un glossario (G01).
- Frasi di 15-20 parole; la seconda persona è accettata nelle pagine di aiuto (G01) e può essere usata dove si dà un'istruzione; una frase
  istituzionale «ti ascoltiamo» e un'azione per chi sostiene sono compatibili con una pagina semplice.
- Mettere prima una frase sul perché (come fa il glossario di G01: capire per comunicare), poi i fatti.
- Evitare la comunicazione «non verbale» come nome di ciò che Kalliope fa: per AISLA «comunicazione non verbale» è il puntamento oculare; Kalliope fa parlare.

## Lacune

- Quattro pagine non sono un campione dell'italiano rivolto a pazienti; nessuna conferma da persone vere né da logopedisti.
- Non sono state lette: la guida «CAA nella SLA» di AISLA (PDF), il resto del sito AILAR («La mia voce» solo nel menu) e le pagine di attività di Vivavoce
  («Voice Help», «Osservatorio»).
- L'euristica delle frasi può contare come frase voci d'elenco e titoli; le medie sono indicative.
- Le pagine sono lette in browser senza finestra e con il consenso rifiutato dove possibile (G03, G04 mobile); G01 è stata letta con l'avviso dei cookie visibile
  (nessuna scelta fatta) e G02 con la barra dei cookie visibile.
