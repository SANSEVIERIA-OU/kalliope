# Appunti R04 (lavoro, non la scheda) - 12/11/2026

Strumento: passo.mjs posto leggero l2, senza finestra, desktop 1440x900. Registri integrali: design/incarichi/visita-2/log/NNNN-R04-*.txt
Foto in design/ricerca/prove/R04/ (NNN-gesto.jpg, .movimento.json accanto, -seq-NN.jpg le sequenze).

## Pagine visitate
- https://waymo.com/safety/ (titolo "Safety – Waymo"): pagina vetrina di 5322 px; 001 arrivo con banner cookie (Accept All / Reject All / Manage Preferences); 005 dopo Reject All; 006-015 scorrimento; 010 carosello; 012 accordion.
- https://waymo.com/safety/impact (titolo hub "Waymo Safety Impact"): 13982 px (con accordion aperto); e' il vero "Safety Hub" ("This hub compares ..."). 037-045.
- https://waymo.com/safety/questa-pagina-non-esiste: 404 (035).

## Misure (computer)
- Tab: primo Tab = "Skip to main content" (@617,20 207x58), outline 4px solid rgb(0,232,157); 71 tab stops totali (calcolo approssimato), "Explore our safety dashboard" e' il 28esimo; sottovoci dei menu a comparsa sono tab stop.
- Landmark 9, titoli H1,H2x4,H3...; 25 img, 0 senza alt, 6 alt vuoto; 11 comandi senza nome accessibile (calcolo semplice).
- Testo: GT-Walsheim 400 + Simplon Mono 400; corpo 16/24 px, colonna 461 px ~58 car (stima); h1 120px; h2 50/40px; sfondo scuro rgb(5,15,30).
- Bersagli: 72 comandi visibili; min 20x16 px (link in linea 18 px alti; voci di menu 350x20; nav 32-68 px larghi x90 alti); carosello frecce ~48 px.
- Richieste (ricarica, cache): 82; waymo.com 58, storage.googleapis.com 10, lh3.googleusercontent.com 12 (486 kB), fonts.googleapis.com 1; transfer 494 kB, encoded 1582 kB; fcp 716 ms (headless).
- Meta: description si', og:title/og:image/og:description si', twitter:card si'. lang=en. Nessuna versione italiana (select lingua nel footer).

## Movimento (misurato con API Web Animations/CSS)
- Entrata allo scroll (Q20): opacity 0->1 + translateY(30px)->0, 400ms ease-in-out; titolo 0 delay, corpo delay 300, 4 statistiche delay 100/200/300/400; asset opacity 0->0.4 300ms; elenco download delay 200..1000 passo 200.
- Header: nasconde con translateY(calc(-100% - 50px)) 200ms ease delay 400 in scorrimento verso il basso; ritorna in su (var CSS --scroll-direction 1/-1 su body).
- Contatore statistiche: --stat 0->95 (proprieta' CSS registrata) 1500ms ease + barre scale 1 0 -> 1 0.95 1500ms ease x6; il testo DOM porta i valori finali (95% ... 55 fewer) mentre la foto a 1200ms mostrava 92%: conteggio a meta.
- Menu a comparsa: ::before height 0->248px 150ms ease; ::after (velo sul contenuto) opacity 0->1 200ms; contenuto opacity 0->1 200ms ritardo 100; var --safe-triangle-origin (hover intent).
- Modale YouTube: opacity 0->1 + scale 1.15->1, 300ms cubic-bezier(0.83,0,0.17,1); chiusura inversa; Escape chiude e il fuoco torna sul pulsante play (outline 3px rgb(0,232,157)); play icon scale 1.1 300ms ease all'hover.
- Accordion: icona + e - dissolvenza incrociata 200ms ease; altezza del pannello cresce in ~170-300 ms (stima da fotogrammi; non esposta dalle API); immagine appare dopo.
- Carosello: lista scrollabile (ul overflow-x scroll, w-carousel); freccia avanti sposta ~462 px, circa 80% in 190 ms (stima da fotogrammi); freccia indietro 0.5->1 opacity 200ms.
- Hub: tabpanel _fade-out-to-left (opacity 1->0, translate 0 -> -30px, 300ms ease-in) + _fade-in-from-right (translate 30px->0, 300ms ease-out, ritardo 300 ms).
- Grafici: puntini con barre d'errore 95% CI; tooltip all'hover con IPMM, LOWER, UPPER (es. SF benchmark 0.395, 0.360, 0.432).

## Aggiunte (stesso giorno)
- Telefono (passo.mjs mobile = 430x932, NON 390x844: dichiarato): prove/R04/telefono/001-010. Menu a pannello intero: ::before/ pannello height 0->852px 250ms ease; voci opacity 0->1 100ms ritardo 100; filetto scaleX 0->1 200ms; tap su "Safety" porta alla pagina Safety con view transition di documento (root fade 250ms ease, plus-lighter). ⚠ OROLOGIO 0.8x in quel gesto. Pagina 8328 px; singola colonna; statistiche 2x2.
- Ridotto (prove/R04/ridotto): matchMedia reduce = true. All'arrivo 34 transizioni registrate (entrate + --stat 1500ms + barre) invece di partire allo scroll; menu a comparsa, modale, play invariati (stesse durate/curve). A scroll 1600 i valori sono gia' finali (95/82/82/93/86/82). Header ancora translateY 200ms.
- Testo 200% (prove/R04/carattere-200): body 32px, scrollWidth 1440 = innerWidth, pagina 9813 px (da 5322): nessuno scorrimento orizzontale; nav entra a fatica (voci a 32px). Zoom 200% (prove/R04/zoom-200: viewport 720x450): scrollWidth 720; il banner cookie occupa circa 280 px su 450 (62%) dell'altezza.
- Colori forzati (prove/R04/colori-forzati/002-scorri.jpg): barre e icone delle statistiche spariscono (restano numeri e "55 FEWER"); un moncone in 443,286.
- Tema scuro: prefers-color-scheme dark = true ma nessun cambio (pagina gia' scura rgb(5,15,30); 404 resta bianca con header rgb(255,255,255)): nessun tema doppio.
- Ricerca: icona in header apre pannello (height 0->356px 150ms ease) con "Search Waymo" e Quick links; "zzzqqq" Invio -> pagina «No results for “zzzqqq”» / «Sorry, try a different or more general search.» + Quick links + illustrazione (051), view transition 250ms.
- Modulo "Keep in touch" (pagina aggiornamenti, raggiunta dal Sign up del footer, 055): First/Last name, Email, Zipcode obbligatori, form novalidate, POST /form-submit/submit, reCAPTCHA; due caselle preselezionate. NON inviato (regola). Blur dei campi vuoti: nessun errore in linea (057-058). Pagina con marquee 50000ms/60000ms lineari e city-cards in rotazione.
