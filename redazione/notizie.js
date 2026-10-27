/* =========================================================
   TG SG - impostazioni della pagina Redazione
   ---------------------------------------------------------
   Gli articoli NON si scrivono qui: i redattori caricano i
   PDF da Area Riservata > Redazione, scegliendo la categoria,
   e la pagina si aggiorna da sola.
   - per 30 giorni l'articolo è nella "scaletta del mese"
   - poi passa nell'"archivio" per altri 30 giorni
   - poi sparisce dal sito
   ========================================================= */

window.REDAZIONE = {

  /* Indirizzo dell'Area Riservata che fornisce l'elenco degli
     articoli. Cambialo solo se cambia l'indirizzo dell'app. */
  fonte: "https://script.google.com/macros/s/AKfycbx4Q1AYzAWOMBGjDUK9BdAhe3JaQciIZLbbub-yZ1-2jsHrKcvT0YzW4oqnmZgRsxqd/exec?azione=redazione",

  /* Frasi fisse da aggiungere alla barra "Ultim'ora" (facoltative).
     I titoli degli articoli nuovi ci finiscono già da soli.
     Esempio: ["Cercasi nuovi redattori: scrivici su Instagram"] */
  ultimora: [],

  /* Cartella delle copertine delle categorie. Per ogni categoria
     (elenco in Redazione.gs, su Google Apps Script) serve un file
     <codice-categoria>.jpg, ad esempio /img/redazione/attualita.jpg
     Se l'immagine manca si vede la prima pagina del PDF. */
  copertine: "/img/redazione/"

};
