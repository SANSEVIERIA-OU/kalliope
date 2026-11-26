# Genera osservazioni.json (formato di confronta-riferimenti.mjs) dalle schede della cartella. Uso: python3 osservazioni.py <uscita.json>
import json, sys

RIF = {
 'proloquo4text': ('Proloquo4Text', 'https://assistiveware.com/products/proloquo4text', 'CAA a testo (app e finestra Mac)', 2026, 'nessun premio per l\'app'),
 'predictable': ('Predictable', 'https://www.therapybox.co.uk/predictable-english', 'CAA a testo (app)', 2026, 'nessun premio verificato'),
 'apple-live-speech': ('Apple Live Speech e Personal Voice', 'https://support.apple.com/en-us/105018', 'funzione di sistema', 2026, 'nessun premio'),
 'vocable': ('Vocable AAC', 'https://vocable.app', 'CAA con testa e tocco (app)', 2026, 'Webby 2021 Winner, Experimental & Innovation'),
 'cboard': ('Cboard', 'https://app.cboard.io/', 'CAA a simboli (web app, usata dal vivo)', 2026, 'nessun premio'),
 'grid3': ('Grid 3', 'https://smartboxaac.com/grid-software/', 'CAA (Windows, iPad)', 2026, 'nessun premio'),
 'elevenlabs-ivc': ('ElevenLabs Instant Voice Clone', 'https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/instant-voice-cloning', 'flusso di creazione della voce', 2026, 'non applicabile'),
 'acapela-mov': ('Acapela My Own Voice', 'https://mov.acapela-group.com/faq/faq-computer/', 'flusso di creazione della voce', 2026, 'non applicabile'),
 'speechify': ('Speechify (Mac)', 'https://speechify.com/mac/', 'lettura e dettatura (app)', 2026, 'Apple Design Award 2025, Inclusivity, Winner'),
 'sito-kalliope': ('Sito di Kalliope', 'https://sansevieria-ou.github.io/kalliope/it/', 'termine di paragone: identità', 2026, 'non applicabile'),
 'kalipso': ('Finestra di Kalipso', '/workspace/kalipso/artifacts/design-rebuild/', 'termine di paragone: metro di qualità', 2026, 'non applicabile'),
}
SCRITTURA = ['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','speechify','sito-kalliope','kalipso']
VOCE = ['apple-live-speech','elevenlabs-ivc','acapela-mov']
NP_TXT = 'non pertinente: il riferimento non ha questo compito'
NO_TXT = 'non osservato nelle schermate o nei video disponibili'

def f(caratteristica, ambito, voci, default_motivo=NO_TXT, pertinenti=None, non_pertinente_motivo=NP_TXT):
    """voci: ref -> dict(stato, valore?, descrizione?, evidenze, non_misurati?, motivo?)"""
    out = {}
    for r in RIF:
        if r in voci:
            o = dict(voci[r]); o.setdefault('stato', 'presente')
        elif pertinenti is not None and r not in pertinenti:
            o = {'stato': 'non_osservato', 'motivo': non_pertinente_motivo}
        else:
            o = {'stato': 'non_osservato', 'motivo': default_motivo}
        o['caratteristica'] = caratteristica; o['ambito'] = ambito
        out[r] = o
    return out

OBS = []
P = lambda *a: list(a)
# ---- scrittura e voce
OBS.append(f('area di scrittura più grande di ogni altro elemento della finestra', 'finestra di scrittura', {
 'proloquo4text': dict(valore={'dominante': True}, descrizione='stima visiva: la colonna centrale è circa il 69% della larghezza della finestra Mac', non_misurati=['quota esatta'], evidenze=P('fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'dominante': False}, descrizione='su iPad la tastiera a schermo prende circa metà dell\'altezza', non_misurati=['quota esatta'], evidenze=P('fonti/pred/sheet-ipad-1-6.png')),
 'grid3': dict(valore={'dominante': False}, descrizione='la finestra del messaggio è circa il 40% dell\'altezza, sopra funzioni e tastiera', non_misurati=['quota esatta'], evidenze=P('fonti/grid/sheet-grid.png')),
 'sito-kalliope': dict(valore={'dominante': False}, descrizione='nella demo il campo è una riga dentro la ricostruzione della finestra 0.1', evidenze=P('foto/kal-01-home-scuro.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','grid3','sito-kalliope','kalipso','cboard'], default_motivo='non osservata la finestra intera', non_pertinente_motivo='non pertinente: il riferimento non ha un campo di scrittura'))
OBS.append(f('tasto dedicato per dire la frase', 'finestra di scrittura', {
 'proloquo4text': dict(valore={'presente': True, 'forma': 'tondo'}, descrizione='play blu sotto il testo, al centro', evidenze=P('fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'presente': True, 'forma': 'quadrato'}, descrizione='altoparlante giallo nella colonna a destra del testo; con anello ciano e tondo nel tema scuro', evidenze=P('fonti/pred/sheet-ipad-1-6.png','foto/pred-03-hero.png')),
 'apple-live-speech': dict(valore={'presente': True, 'forma': 'tasto della tastiera'}, descrizione='il tasto Invio si chiama «send» (iPhone); «Speak» o Invio sul Mac [L]', evidenze=P('fonti/apple/sheet-livespeech.png')),
 'vocable': dict(valore={'presente': True, 'forma': 'quadrato'}, descrizione='tasto ciano con altoparlante, in basso a destra della tastiera', evidenze=P('fonti/vocable/sheet-showcase.png')),
 'cboard': dict(stato='assente', descrizione='la barra di uscita ha solo «Backspace» e «Clear»; si parla toccando la tessera o la barra', evidenze=P('foto/cboard-03-yes.png')),
 'grid3': dict(valore={'presente': True, 'forma': 'icona con etichetta'}, descrizione='«Speak», fumetto nero con etichetta, colonna a destra del testo', evidenze=P('fonti/grid/sheet-grid.png')),
 'sito-kalliope': dict(valore={'presente': True, 'forma': 'rettangolo'}, descrizione='«Parla» e «Ferma» nella finestra 0.1 ricostruita; Invio parla', evidenze=P('video/kalliope-demo-home-mv/tratto-3.jpg')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope'], non_pertinente_motivo='non pertinente: il riferimento non fa parlare chi scrive'))
OBS.append(f('evidenziazione di ciò che si sta dicendo mentre la voce parla', 'voce in corso', {
 'proloquo4text': dict(valore={'unita': 'parola', 'segno': 'sfondo colorato'}, descrizione='schermo intero: sfondo verde acceso dietro la parola in corso; opzionale (testo ufficiale)', evidenze=P('fonti/p4t/sheet-ipad-5-7.png')),
 'apple-live-speech': dict(valore={'unita': 'parola', 'segno': 'parte detta piena, parte da dire attenuata'}, descrizione='immagine ferma di Live Speech durante la voce', non_misurati=['velocità di avanzamento'], evidenze=P('fonti/apple/sheet-livespeech.png')),
 'cboard': dict(stato='assente', descrizione='nello screencast della frase detta dalla barra lo schermo cambia solo all\'inizio, poi resta fermo per tutta la voce', evidenze=P('video/cboard-output-speak-mv/misure.json')),
 'sito-kalliope': dict(valore={'unita': 'parola', 'segno': 'parole dette scure, da dire chiare'}, descrizione='demo della home: 17 parole in circa 6085 ms visibili (tratto 4), con anelli e barre', evidenze=P('video/kalliope-demo-home-mv/tratto-4.jpg','video/kalliope-demo-home-mv/misure.json')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope','speechify'], default_motivo='nelle schermate disponibili non si vede la voce in corso'))
OBS.append(f('pausa o arresto della voce mentre parla', 'voce in corso', {
 'proloquo4text': dict(valore={'comando': 'pausa'}, descrizione='pausa blu nello schermo intero; «play, pause and speak-as-you-type» [L]', evidenze=P('fonti/p4t/sheet-ipad-5-7.png')),
 'apple-live-speech': dict(valore={'comando': 'pausa', 'forma': 'tondo rosso accanto alla frase'}, evidenze=P('fonti/apple/sheet-livespeech.png')),
 'sito-kalliope': dict(valore={'comando': 'ferma'}, descrizione='«Ferma» si accende mentre parla; interruzione non provata', evidenze=P('video/kalliope-demo-home-mv/tratto-3.jpg')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope','speechify'], default_motivo='nelle schermate disponibili non si vede un comando di arresto'))
OBS.append(f('Invio come gesto che fa parlare', 'finestra di scrittura', {
 'apple-live-speech': dict(valore={'invio_parla': True}, descrizione='[L] Mac: «click the Speak button or press Return»; iPhone: il tasto Invio è «send»', evidenze=P('https://support.apple.com/en-us/105018','fonti/apple/sheet-livespeech.png')),
 'sito-kalliope': dict(valore={'invio_parla': True}, descrizione='demo: «Scrivi qui e premi Invio per parlare»', evidenze=P('foto/kal-01-home-scuro.png','video/kalliope-demo-home-mv/tratto-3.jpg')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope'], default_motivo='tastiera fisica e Invio non descritti nelle schermate disponibili', non_pertinente_motivo='non pertinente: il riferimento non fa parlare chi scrive'))
OBS.append(f('finestra o pannello compatto', 'modalità compatta', {
 'apple-live-speech': dict(valore={'compatto': True}, descrizione='pannello di scrittura sopra la chiamata FaceTime, che lascia vedere la persona; sul Mac la finestra non è stata vista', non_misurati=['resta sopra le altre finestre'], evidenze=P('fonti/apple/sheet-livespeech.png')),
 'kalipso': dict(valore={'compatto': True}, descrizione='pannello stretto con la stessa gerarchia del largo', non_misurati=['resta sopra le altre finestre'], evidenze=P('fonti/kalipso/sheet-2.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope','kalipso'], default_motivo='non si vede una modalità compatta nelle schermate disponibili'))
OBS.append(f('cronologia delle frasi già dette', 'finestra di scrittura', {
 'proloquo4text': dict(valore={'posizione': 'colonna a sinistra', 'raggruppo': 'ultimi 15 minuti'}, evidenze=P('fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'posizione': 'striscia sopra il testo', 'voci': 3}, descrizione='«History 1 | 2 | 3» nel tema scuro; «How are you? | Thanks | Yes | No» nel chiaro', evidenze=P('foto/pred-03-hero.png','fonti/pred/sheet-ipad-1-6.png')),
 'speechify': dict(valore={'posizione': 'elenco nella vista Home', 'raggruppo': 'giorni'}, descrizione='ora a sinistra, chip «Dictated in <app>», testo sotto (cronologia di dettatura e ascolto, non di voce per chi non parla)', evidenze=P('fonti/speechify/mac-hero-1400.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','speechify','sito-kalliope'], default_motivo='non si vede una cronologia nelle schermate disponibili'))
OBS.append(f('frasi salvate o preferite', 'finestra di scrittura', {
 'proloquo4text': dict(valore={'posizione': 'colonna a destra', 'forma': 'griglia di 2 colonne'}, descrizione='«Quick Talk»', evidenze=P('fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'posizione': 'griglia per categorie', 'forma': 'griglia'}, descrizione='più linguette «Notes» per testi preparati', evidenze=P('fonti/pred/sheet-ipad-1-6.png','fonti/pred/sheet-ipad-7-10.png')),
 'apple-live-speech': dict(valore={'posizione': 'chip «Phrases» nel pannello', 'forma': 'elenco'}, evidenze=P('fonti/apple/sheet-livespeech.png')),
 'vocable': dict(valore={'posizione': 'icona fumetto nella tastiera', 'forma': 'elenco'}, descrizione='«My Sayings», con avviso «Saved to My Sayings»', evidenze=P('fonti/vocable/sheet-showcase.png')),
 'cboard': dict(valore={'posizione': 'tavola «quick chat»', 'forma': 'griglia di tessere'}, evidenze=P('foto/cboard-09-quickchat.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','sito-kalliope','speechify'], default_motivo='non si vede nelle schermate disponibili'))
OBS.append(f('stato scritto in parole nella schermata di uso', 'schermata principale', {
 'sito-kalliope': dict(valore={'forma': 'striscia sopra il campo'}, descrizione='«Pronta. In Zoom, Teams, Meet…» e «Sto parlando…»', evidenze=P('video/kalliope-demo-home-mv/tratto-3.jpg')),
 'kalipso': dict(valore={'forma': 'riga sotto i comandi'}, descrizione='«Manual · Microphone off»', evidenze=P('fonti/kalipso/sheet-1.png')),
 'proloquo4text': dict(stato='assente', descrizione='nelle 14 schermate dello store non c\'è una riga di stato', evidenze=P('fonti/p4t/sheet-ipad-1-4.png','fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(stato='assente', descrizione='nelle schermate dello store non c\'è una riga di stato', evidenze=P('fonti/pred/sheet-ipad-1-6.png')),
 'apple-live-speech': dict(stato='assente', descrizione='nel pannello di Live Speech (2 immagini) non c\'è testo di stato; sulla registrazione c\'è «Listening…»', evidenze=P('fonti/apple/sheet-livespeech.png')),
 'cboard': dict(stato='assente', descrizione='sulla tavola, dal vivo, nessuna riga di stato', evidenze=P('foto/cboard-03-yes.png')),
 'grid3': dict(stato='assente', descrizione='nella schermata di scrittura non c\'è una riga di stato', evidenze=P('fonti/grid/sheet-grid.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','cboard','grid3','sito-kalliope','kalipso','vocable'], default_motivo='nelle schermate principali disponibili', non_pertinente_motivo='non pertinente: non è una schermata di uso quotidiano'))
# ---- aspetto
OBS.append(f('temi di colore offerti', 'aspetto della finestra', {
 'proloquo4text': dict(valore={'temi': ['chiaro','scuro']}, descrizione='modo scuro e aspetto personalizzato in crema', evidenze=P('fonti/p4t/sheet-ipad-5-7.png','fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'temi': ['chiaro','scuro','alto contrasto','bassa visione']}, descrizione='modelli «Dark», «High Contrast», «Low vision»', evidenze=P('fonti/pred/sheet-ipad-1-6.png')),
 'vocable': dict(valore={'temi': ['scuro']}, descrizione='un solo aspetto, indaco', evidenze=P('fonti/vocable/sheet-showcase.png')),
 'cboard': dict(valore={'temi': ['chiaro']}, descrizione='esiste «Enable dark theme», ma dopo «SAVE» il tema scuro non risultava applicato', evidenze=P('foto/cboard-08-display.png','foto/cboard-12-tema-scuro.png')),
 'sito-kalliope': dict(valore={'temi': ['scuro']}, descrizione='tema chiaro assente: nessun prefers-color-scheme nel sistema; la home «chiara» emulata è uguale alla scura', evidenze=P('valori/kalliope-sito-home-chiaro-desktop.json','valori/kalliope-sito-home-scuro-desktop.json')),
 'kalipso': dict(valore={'temi': ['chiaro','scuro']}, descrizione='suggeritore scuro, libreria chiara', evidenze=P('fonti/kalipso/sheet-1.png','fonti/kalipso/sheet-3.png')),
 'acapela-mov': dict(valore={'temi': ['chiaro']}, descrizione='finestra chiara con pannello scuro', evidenze=P('fonti/acapela/sheet-monitor.png')),
 'elevenlabs-ivc': dict(valore={'temi': ['chiaro']}, descrizione='modale bianca', evidenze=P('fonti/elevenlabs/ivc-modal-crop.png')),
 'speechify': dict(valore={'temi': ['chiaro']}, descrizione='la finestra dell\'app è chiara; il tema scuro non è stato visto', evidenze=P('fonti/speechify/mac-hero-1400.png')),
}, default_motivo='non osservato'))
OBS.append(f('dimensione del testo regolabile dalla persona', 'impostazioni', {
 'cboard': dict(valore={'modo': 'gradini', 'gradini': 3}, descrizione='Standard / Large / Extra Large, effetto dopo «SAVE»', evidenze=P('foto/cboard-11-fontsize-menu.png')),
 'proloquo4text': dict(valore={'modo': 'impostazione'}, descrizione='«Adjust appearance (font, color, text size)» [L]', non_misurati=['gradini'], evidenze=P('fonti/p4t-lookup.json')),
 'predictable': dict(valore={'modo': 'impostazione'}, descrizione='«Customise the layout and appearance … font size, colours» [L]', non_misurati=['gradini'], evidenze=P('fonti/pred/lookup.json')),
 'kalipso': dict(valore={'modo': 'più piccolo / più grande'}, descrizione='«Smaller» / «Larger», con prove a 150% e 200% in cui tutta la finestra cresce', evidenze=P('fonti/kalipso/sheet-1.png','fonti/kalipso/sheet-3.png')),
}, default_motivo='non osservato'))
OBS.append(f('classe di carattere del testo dell\'interfaccia', 'tipografia', {
 'proloquo4text': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/p4t-mac/sheet-1-4.png')),
 'predictable': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/pred/sheet-ipad-1-6.png')),
 'apple-live-speech': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/apple/sheet-livespeech.png')),
 'vocable': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/vocable/sheet-showcase.png')),
 'cboard': dict(valore={'classe': 'sans-serif'}, descrizione='misurato con valori.js: Montserrat', evidenze=P('valori/cboard-board-desktop.json')),
 'grid3': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/grid/sheet-grid.png')),
 'elevenlabs-ivc': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/elevenlabs/ivc-modal-crop.png')),
 'acapela-mov': dict(valore={'classe': 'sans-serif'}, descrizione='testo delle frasi e dei comandi; il logo «acapela Recorder» ha un carattere con le grazie', non_misurati=['famiglia'], evidenze=P('fonti/acapela/sheet-monitor.png')),
 'speechify': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva', non_misurati=['famiglia'], evidenze=P('fonti/speechify/mac-hero-1400.png')),
 'sito-kalliope': dict(valore={'classe': 'sans-serif'}, descrizione='misurato con valori.js: Lexend; la finestra imitata usa DejaVu Sans', evidenze=P('valori/kalliope-sito-home-scuro-desktop.json')),
 'kalipso': dict(valore={'classe': 'sans-serif'}, descrizione='classificazione visiva (sembra DejaVu Sans)', non_misurati=['famiglia'], evidenze=P('fonti/kalipso/sheet-1.png')),
}, default_motivo='non osservato'))
OBS.append(f('famiglia di carattere misurata dal DOM', 'tipografia', {
 'cboard': dict(valore={'famiglia': 'Montserrat', 'pesi': [700, 400], 'grandezze_px': [14, 16]}, descrizione='tavola; impostazioni 400/500 a 12, 14, 18 px', evidenze=P('valori/cboard-board-desktop.json','valori/cboard-impostazioni-desktop.json')),
 'sito-kalliope': dict(valore={'famiglia': 'Lexend', 'pesi': [700, 400, 500, 600]}, descrizione='97% del testo; titolo 62 px, interlettera -1,116 px', non_misurati=['grandezze di tutte le righe'], evidenze=P('valori/kalliope-sito-home-scuro-desktop.json')),
}, default_motivo='non misurabile dal DOM: il riferimento è un\'app mostrata da schermate'))
# ---- scelta della voce
OBS.append(f('scelta della voce con un elenco', 'impostazioni di voce', {
 'proloquo4text': dict(valore={'elenco': True, 'filtri': True, 'scarico_con_avanzamento': True}, descrizione='pagina «Choose a voice», filtri Boy/Girl/Man/Woman, MB per voce, elenco di scaricamenti', evidenze=P('fonti/p4t/sheet-ipad-5-7.png','fonti/p4t/sheet-ipad-1-4.png')),
 'predictable': dict(valore={'elenco': True, 'tono_velocita': True}, descrizione='motore voce (Standard, Acapela, ModelTalker, SpeakUnique, The Voice Keeper) + «Speaking pitch» + cursori; filtri non visti', non_misurati=['filtri'], evidenze=P('fonti/pred/sheet-ipad-1-6.png')),
 'apple-live-speech': dict(valore={'elenco': True, 'tono_velocita': True}, descrizione='«dozens of system voices»; «Voice Settings» per tono e velocità [L]', evidenze=P('foto/apple-01-accessibility-speech.png')),
 'cboard': dict(valore={'elenco': True, 'tono_velocita': True}, descrizione='«Voice», «Pitch», «Rate»; campo per la chiave ElevenLabs', evidenze=P('foto/cboard-07-speech.png')),
}, pertinenti=['proloquo4text','predictable','apple-live-speech','vocable','cboard','grid3','speechify'], default_motivo='non si vede nelle schermate disponibili'))
# ---- creazione della voce
A='creazione della voce propria'
OBS.append(f('frase da leggere mostrata durante la registrazione', A, {
 'apple-live-speech': dict(valore={'frasi_per_schermata': 1, 'corpo': 'grande, grassetto', 'contatore': True}, descrizione='«1 of 150» nella versione 2023', evidenze=P('fonti/apple/sheet-livespeech.png')),
 'acapela-mov': dict(valore={'frasi_per_schermata': 3, 'corrente_evidenziata': True, 'contatore': True}, descrizione='precedente e successiva attenuate; 50 frasi [L]', evidenze=P('fonti/acapela/sheet-monitor.png')),
}, pertinenti=VOCE, default_motivo='la schermata di registrazione non è pubblica (serve un account)'))
OBS.append(f('avanzamento della creazione sempre visibile', A, {
 'apple-live-speech': dict(valore={'forma': 'contatore «n of N»'}, evidenze=P('fonti/apple/sheet-livespeech.png')),
 'acapela-mov': dict(valore={'forma': 'quadrante con percentuale e conteggio'}, descrizione='«24% 359/1501» in un cerchio turchese', evidenze=P('fonti/acapela/sheet-monitor.png')),
 'elevenlabs-ivc': dict(valore={'forma': 'elenco di passi con tre stati'}, descrizione='Upload audio (puntino verde), Voice Information (grassetto), Finish up (grigio)', evidenze=P('fonti/elevenlabs/ivc-modal-crop.png')),
}, pertinenti=VOCE))
OBS.append(f('riascolto della propria registrazione', A, {
 'acapela-mov': dict(valore={'forma': 'tasto tondo dedicato (cuffia con microfono)'}, evidenze=P('fonti/acapela/sheet-monitor.png')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
OBS.append(f('anteprima della voce creata prima di salvare', A, {
 'elevenlabs-ivc': dict(valore={'forma': 'tasto «Preview voice» accanto al nome'}, evidenze=P('fonti/elevenlabs/ivc-modal-crop.png')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
OBS.append(f('consenso esplicito prima di salvare la voce', A, {
 'elevenlabs-ivc': dict(valore={'forma': 'casella con testo legale intero'}, evidenze=P('fonti/elevenlabs/ivc-modal-crop.png')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
OBS.append(f('ripresa della registrazione in più sedute', A, {
 'apple-live-speech': dict(valore={'comando': '«Done» salva, «Continue Recording» riprende'}, descrizione='[L] pagina di supporto 104993', evidenze=P('https://support.apple.com/en-us/104993')),
 'acapela-mov': dict(valore={'comando': 'più sedute, calibrazione a ogni seduta'}, descrizione='[L] FAQ', evidenze=P('https://mov.acapela-group.com/faq/faq-computer/')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
OBS.append(f('controllo del microfono prima di registrare', A, {
 'acapela-mov': dict(valore={'forma': 'calibrazione contando', 'conta_fino_a': 6}, descrizione='tutti i tasti spenti tranne «avanti»', evidenze=P('fonti/acapela/sheet-monitor.png')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
OBS.append(f('consigli di qualità mostrati a chi registra', A, {
 'elevenlabs-ivc': dict(valore={'forma': 'consigli corti con numeri', 'numeri': ['1-2 minuti', 'oltre 3 minuti peggiora', '-23...-18 dB RMS']}, evidenze=P('foto/el-01-ivc-modal.png')),
 'acapela-mov': dict(valore={'forma': 'FAQ: stanza, microfono a cuffia, stessa distanza'}, evidenze=P('https://mov.acapela-group.com/faq/faq-computer/')),
}, pertinenti=VOCE, default_motivo='non visto nelle schermate disponibili'))
# ---- movimento
OBS.append(f('durata visibile del cambio di vista', 'cambio di vista', {
 'cboard': dict(valore={'durata_visibile_ms': 383, 'punti_che_saltano_pct': 92}, descrizione='apertura di una cartella; ritorno e interruzione non provati', evidenze=P('video/cboard-folder-open-mv/misure.json')),
}, default_motivo='non misurato: nessuna sequenza del gesto'))
OBS.append(f('movimento mentre la voce parla', 'voce in corso', {
 'sito-kalliope': dict(valore={'parole_in_sequenza': True, 'anelli': True, 'barre': True, 'durata_visibile_ms': 6085}, descrizione='17 parole; anelli menta dal riquadro «Tu»; equalizzatore', evidenze=P('video/kalliope-demo-home-mv/misure.json','video/kalliope-demo-home-mv/tratto-4.jpg')),
 'cboard': dict(stato='assente', descrizione='nessuna variazione dello schermo durante la voce', evidenze=P('video/cboard-output-speak-mv/misure.json')),
}, default_motivo='nessuna sequenza del movimento (solo immagini ferme o video non accessibili)'))

# ---- composizione
rif = []
for rid, (nome, url, cat, anno, premio) in RIF.items():
    rif.append({'id': rid, 'nome': nome, 'fonte': url, 'categoria': cat, 'anno': anno, 'premio': premio, 'osservazioni': [o[rid] for o in OBS]})
json.dump({'riferimenti': rif}, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
print(len(rif), 'riferimenti', len(OBS), 'caratteristiche')
