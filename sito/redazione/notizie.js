/* =========================================================
   TG SG - contenuti della pagina Redazione
   ---------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare la
   pagina /redazione. Regole d'oro:
   - ogni testo va tra virgolette "..."
   - ogni voce di un elenco finisce con una virgola ,
   - per andare a capo in un articolo, aggiungi un nuovo
     paragrafo nell'elenco "testo"
   ATTENZIONE: i contenuti qui sotto sono di ESEMPIO.
   ========================================================= */

window.REDAZIONE = {

  /* nome del giornale, scritto sulle copertine */
  testata: "TG SG",


  /* ---------- Barra "Ultim'ora" che scorre ----------
     Frasi brevi, una per notizia. Lascia [] per nasconderla. */
  ultimora: [
    "Biblioteca di Via Porta di Massa: orario prolungato fino alle 22",
    "Pubblicato il calendario degli appelli della sessione invernale",
    "Nuova convenzione SG con la copisteria di Corso Umberto",
    "La redazione cerca nuovi redattori: scrivici su Instagram"
  ],


  /* ---------- I servizi (gli articoli) ----------
     Il PRIMO dell'elenco è quello "in onda" all'apertura.
     id         parola unica senza spazi, diventa l'indirizzo
                (es. /redazione#elezioni)
     rubrica    etichetta rossa (Ateneo, Didattica, Eventi...)
     titolo     il titolo del servizio
     occhiello  una riga di sottotitolo
     data       "AAAA-MM-GG"
     autore     chi l'ha scritto
     immagine   foto caricata nella cartella /img
     video      (facoltativo) link YouTube del servizio
     testo      i paragrafi dell'articolo */
  servizi: [
    {
      id: "elezioni",
      rubrica: "Ateneo",
      titolo: "Elezioni studentesche: si vota il 18 e 19 novembre",
      occhiello: "Liste, seggi e candidati: la guida completa della redazione",
      data: "2026-10-25",
      autore: "La redazione",
      immagine: "/img/home-sfondo.jpg",
      testo: [
        "Mancano poche settimane all'appuntamento che chiama le studentesse e gli studenti a scegliere chi li rappresenterà negli organi del Dipartimento e dell'Ateneo.",
        "Si potrà votare nelle aule del complesso di Via Porta di Massa e nella sede centrale, con un documento di riconoscimento. I risultati saranno pubblicati entro la settimana successiva.",
        "Nei prossimi giorni pubblicheremo le interviste ai candidati e un piccolo glossario degli organi collegiali."
      ]
    },
    {
      id: "appelli-invernali",
      rubrica: "Didattica",
      titolo: "Sessione invernale, pubblicato il calendario degli appelli",
      occhiello: "Tutte le date, cattedra per cattedra",
      data: "2026-10-24",
      autore: "La redazione",
      immagine: "/img/i-anno-sfondo.jpg",
      testo: [
        "È online il calendario degli appelli della sessione invernale. Abbiamo raccolto le date per tutte le cattedre del primo anno.",
        "Ricordate di prenotarvi sul portale entro i termini indicati da ciascun docente."
      ]
    },
    {
      id: "convegno-pessina",
      rubrica: "Eventi",
      titolo: "“Costituzione e futuro”: il convegno in Aula Pessina",
      occhiello: "Giovedì alle 15, ingresso libero",
      data: "2026-10-22",
      autore: "La redazione",
      immagine: "/img/giurisprudenza-sfondo.jpg",
      testo: [
        "Giovedì l'Aula Pessina ospita un convegno dedicato alla Costituzione e alle sfide dei prossimi anni.",
        "L'ingresso è libero fino a esaurimento posti."
      ]
    },
    {
      id: "intervista-cds",
      rubrica: "Rappresentanza",
      titolo: "Intervista doppia ai rappresentanti del CdS",
      occhiello: "Cosa è cambiato in un anno di mandato",
      data: "2026-10-20",
      autore: "La redazione",
      immagine: "/img/home-squadra.jpg",
      testo: [
        "Abbiamo incontrato i nostri rappresentanti nel Consiglio di Corso di Studi per fare un bilancio del primo anno di mandato.",
        "Dalle aule studio ai calendari d'esame: ecco cosa ci hanno raccontato."
      ]
    }
  ],


  /* ---------- Le edizioni del giornale (PDF) ----------
     Carica il PDF nella cartella /redazione/pdf e la copertina
     nella cartella /img. La PRIMA edizione è la più recente. */
  edizioni: [
    {
      numero: 7,
      mese: "Ottobre 2026",
      titolo: "Si torna alle urne: tutto sulle elezioni",
      copertina: "/img/home-sfondo.jpg",
      pdf: "/redazione/pdf/numero-7.pdf"
    },
    {
      numero: 6,
      mese: "Giugno 2026",
      titolo: "Sessione estiva: sopravvivere agli esami",
      copertina: "/img/home-squadra.jpg",
      pdf: "/redazione/pdf/numero-6.pdf"
    },
    {
      numero: 5,
      mese: "Aprile 2026",
      titolo: "Dentro il Consiglio di Dipartimento",
      copertina: "/img/rappresentante-cds.jpg",
      pdf: "/redazione/pdf/numero-5.pdf"
    },
    {
      numero: 4,
      mese: "Febbraio 2026",
      titolo: "Matricole: il primo semestre raccontato",
      copertina: "/img/i-anno-sfondo.jpg",
      pdf: "/redazione/pdf/numero-4.pdf"
    }
  ]

};
