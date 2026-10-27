/* =========================================================
   STUDENTI GIURISPRUDENZA - pagina Redazione (TG SG)
   Gli articoli arrivano dall'Area Riservata (PDF caricati
   dai redattori). Impostazioni in /redazione/notizie.js
   ========================================================= */

(function(){

  const config = window.REDAZIONE || {};

  /* ogni quanti secondi il TG passa da solo all'articolo successivo */
  const SECONDI_PER_SERVIZIO = 9;

  const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = function(id){ return document.getElementById(id); };

  const CARTELLA_COPERTINE = config.copertine || '/img/redazione/';

  const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

  function due(n){
    return String(n).padStart(2, '0');
  }

  function dataEstesa(iso){
    const d = new Date(iso);
    return isNaN(d) ? '' : d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* "oggi", "ieri" oppure "22 ott" */
  function dataBreve(iso){
    const d = new Date(iso);
    if(isNaN(d)) return '';
    const inizio = function(x){ return new Date(x.getFullYear(), x.getMonth(), x.getDate()); };
    const giorni = Math.round((inizio(new Date()) - inizio(d)) / 86400000);
    if(giorni === 0) return 'oggi';
    if(giorni === 1) return 'ieri';
    return d.getDate() + ' ' + MESI[d.getMonth()].slice(0, 3);
  }

  function crea(tag, classe, testo){
    const el = document.createElement(tag);
    if(classe) el.className = classe;
    if(testo != null) el.textContent = testo;
    return el;
  }

  /* mostra la copertina; se l'immagine della categoria non c'è, ripiega sulla prima pagina del PDF */
  function mettiCopertina(img, s){
    img.classList.remove('nascosto');
    img.dataset.riserva = s.copertina === s.primaPagina ? '' : s.primaPagina;
    img.src = s.copertina;
  }

  /* da collegare all'evento "error" dell'immagine; vale true se ha ripiegato sul PDF */
  function copertinaMancante(img){
    const riserva = img.dataset.riserva;
    img.dataset.riserva = '';
    if(riserva){
      img.src = riserva;
      return true;
    }
    img.classList.add('nascosto');
    return false;
  }

  /* "Attualità · 22 ott": la categoria, se c'è, davanti alla data */
  function conCategoria(s, testo){
    return s.categoriaNome ? s.categoriaNome + ' · ' + testo : testo;
  }

  function link(classe, testo, href, nuovaScheda){
    const a = crea('a', classe, testo);
    a.href = href;
    if(nuovaScheda){
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  }

  /* i PDF stanno su Google Drive: da qui lettore e download.
     La copertina è l'immagine della categoria (vedi notizie.js);
     senza categoria, o se l'immagine manca, la prima pagina del PDF */
  function daArticolo(a){
    const id = encodeURIComponent(a.id);
    const primaPagina = 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1600';
    const categoria = /^[a-z0-9-]+$/.test(a.categoria || '') ? a.categoria : '';
    return {
      id: a.id,
      titolo: a.titolo,
      categoriaNome: categoria ? (a.categoriaNome || '') : '',
      data: a.data,
      inArchivioDal: a.inArchivioDal,
      rimossoIl: a.rimossoIl,
      copertina: categoria ? CARTELLA_COPERTINE + categoria + '.jpg' : primaPagina,
      primaPagina: primaPagina,
      lettore: 'https://drive.google.com/file/d/' + id + '/preview',
      apri: 'https://drive.google.com/file/d/' + id + '/view',
      scarica: 'https://drive.google.com/uc?export=download&id=' + id
    };
  }


  /* ---------- Orologio ed edizione ---------- */

  function aggiornaOrologio(){
    const ora = new Date();
    const h = ora.getHours();
    $('tg-ora').textContent = due(h) + ':' + due(ora.getMinutes());
    $('tg-data').textContent = ora.toLocaleDateString('it-IT', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
      .replace(/\./g, '').toUpperCase();
    $('tg-edizione').textContent =
      h < 5 ? 'della notte' :
      h < 12 ? 'del mattino' :
      h < 19 ? 'del pomeriggio' : 'della sera';
  }

  aggiornaOrologio();
  setInterval(aggiornaOrologio, 10000);


  /* ---------- Barra "Ultim'ora" ---------- */

  function preparaUltimora(frasi){
    if(!frasi.length) return;

    const ticker = $('tg-ticker');
    const nastro = $('tg-nastro');
    const pausa = $('tg-pausa');

    /* le notizie compaiono due volte di fila: così il giro è continuo */
    [false, true].forEach(function(copia){
      frasi.forEach(function(testo){
        const voce = crea('span', '', testo);
        if(copia) voce.setAttribute('aria-hidden', 'true');
        nastro.appendChild(voce);
      });
    });

    /* velocità costante, qualunque sia la lunghezza delle notizie */
    nastro.style.setProperty('--durata', Math.max(20, frasi.join('').length * 0.2) + 's');

    pausa.addEventListener('click', function(){
      const ferma = ticker.classList.toggle('in-pausa');
      pausa.setAttribute('aria-pressed', ferma ? 'true' : 'false');
      pausa.setAttribute('aria-label', ferma ? 'Fai ripartire la barra delle notizie' : 'Ferma la barra delle notizie');
      pausa.firstElementChild.textContent = ferma ? '▶' : '❚❚';
    });

    ticker.classList.remove('nascosto');
  }


  /* ---------- Archivio ---------- */

  function preparaArchivio(archivio){
    if(!archivio.length) return;

    const griglia = $('tg-archivio');

    archivio.forEach(function(a){
      const voce = link('edizione', null, a.apri, true);

      const copertina = crea('div', 'copertina');
      const foto = crea('img', 'copertina-foto');
      foto.alt = '';
      foto.loading = 'lazy';
      foto.addEventListener('error', function(){ copertinaMancante(foto); });
      mettiCopertina(foto, a);
      copertina.appendChild(foto);

      voce.appendChild(copertina);
      voce.appendChild(crea('p', 'copertina-titolo', a.titolo));
      voce.appendChild(crea('div', 'edizione-leggi', conCategoria(a, 'Uscito il ' + dataEstesa(a.data))));
      griglia.appendChild(voce);
    });

    $('archivio-sezione').classList.remove('nascosto');
  }


  /* ---------- TG: monitor, scaletta e articolo ---------- */

  const monitor = $('tg-monitor');
  const sottopancia = $('tg-sottopancia');
  const scaletta = $('tg-scaletta');
  const scatola = $('tg-scaletta-box');
  const palco = document.querySelector('.palco');

  let servizi = [];
  let pulsanti = [];
  let attuale = -1;
  let cambio = null;

  function messaggioMonitor(titolo){
    $('tg-etichetta').textContent = 'TG SG';
    $('tg-titolo').textContent = titolo;
    $('tg-titolo').removeAttribute('href');
    scatola.classList.add('nascosto');
    palco.classList.add('senza-scaletta');
    $('servizio').classList.add('nascosto');
  }

  function preparaScaletta(){
    pulsanti = servizi.map(function(s, i){
      const li = crea('li');
      const btn = crea('button');
      btn.type = 'button';
      btn.appendChild(crea('span', 'scaletta-numero', due(i + 1)));

      const testi = crea('span');
      testi.appendChild(crea('b', '', s.titolo));
      testi.appendChild(crea('small', '', (i === 0 ? 'Ultima uscita · ' : '') + conCategoria(s, dataBreve(s.data))));
      btn.appendChild(testi);

      const barra = crea('span', 'scaletta-avanzamento');
      barra.setAttribute('aria-hidden', 'true');
      btn.appendChild(barra);

      /* finita la barretta, il TG passa all'articolo successivo */
      barra.addEventListener('animationend', function(){
        mostra((i + 1) % servizi.length);
      });

      btn.addEventListener('click', function(){
        fermaGiro();
        mostra(i, true);
      });

      li.appendChild(btn);
      scaletta.appendChild(li);
      return btn;
    });
  }

  /* sotto il monitor: copertina e pulsanti, oppure il PDF da leggere */
  function scriviArticolo(s, conLettore){
    const box = $('tg-articolo');
    box.textContent = '';

    const testa = crea('div', 'servizio-testa');
    testa.appendChild(crea('p', 'servizio-rubrica', (s.categoriaNome || 'Scaletta del mese') + ' · ' + dataEstesa(s.data)));
    testa.appendChild(crea('h2', '', s.titolo));
    box.appendChild(testa);

    const azioni = crea('div', 'servizio-azioni');

    if(conLettore){
      const cornice = crea('div', 'lettore');
      const riquadro = document.createElement('iframe');
      riquadro.src = s.lettore;
      riquadro.title = 'Articolo: ' + s.titolo;
      riquadro.loading = 'lazy';
      riquadro.allow = 'fullscreen';
      cornice.appendChild(riquadro);
      box.appendChild(cornice);
    } else {
      const leggi = crea('button', 'pulsante', 'LEGGI L\'ARTICOLO');
      leggi.type = 'button';
      leggi.addEventListener('click', function(){
        fermaGiro();
        scriviArticolo(s, true);
      });
      azioni.appendChild(leggi);
    }

    azioni.appendChild(link('pulsante pulsante-chiaro', 'APRI A SCHERMO INTERO', s.apri, true));
    azioni.appendChild(link('pulsante pulsante-chiaro', 'SCARICA IL PDF', s.scarica, false));
    box.appendChild(azioni);

    box.appendChild(crea('p', 'servizio-firma', 'In scaletta fino al ' + dataEstesa(s.inArchivioDal) + ', poi in archivio.'));
  }

  function riempiMonitor(i){
    const s = servizi[i];
    /* foto della categoria a tutto schermo; la pagina del PDF resta intera */
    monitor.classList.toggle('con-categoria', s.copertina !== s.primaPagina);
    mettiCopertina($('tg-foto'), s);
    mettiCopertina($('tg-sfondo'), s);
    $('tg-numero').textContent = 'Articolo ' + due(i + 1);
    $('tg-etichetta').textContent = i === 0 ? 'Ultima uscita' : 'In scaletta';
    $('tg-rubrica').textContent = s.categoriaNome || dataBreve(s.data);
    $('tg-titolo').textContent = s.titolo;
    $('tg-titolo').href = '#servizio';
    $('tg-occhiello').textContent = 'Pubblicato il ' + dataEstesa(s.data);

    /* fa ripartire l'animazione del titolo */
    sottopancia.classList.remove('entra');
    void sottopancia.offsetWidth;
    sottopancia.classList.add('entra');
  }

  function mostra(i, daUtente){
    if(i === attuale) return;
    const primaVolta = attuale === -1;
    attuale = i;

    pulsanti.forEach(function(btn, n){
      btn.setAttribute('aria-current', n === i ? 'true' : 'false');
      const barra = btn.querySelector('.scaletta-avanzamento');
      barra.classList.remove('parte');
      if(n === i){
        void barra.offsetWidth;
        barra.classList.add('parte');
      }
    });

    /* il PDF si apre subito solo se l'ha scelto chi legge */
    scriviArticolo(servizi[i], !!daUtente);

    if(daUtente){
      history.replaceState(null, '', '#' + servizi[i].id);
    }

    clearTimeout(cambio);
    if(primaVolta || menoMovimento){
      riempiMonitor(i);
    } else {
      /* la tendina copre il monitor, poi scopre il nuovo articolo */
      monitor.classList.remove('cambia');
      void monitor.offsetWidth;
      monitor.classList.add('cambia');
      cambio = setTimeout(function(){ riempiMonitor(i); }, 320);
    }
  }

  /* chi sceglie un articolo lo vuole leggere: il TG non va più avanti da solo */
  function fermaGiro(){
    scatola.classList.add('ferma');
  }

  const motiviPausa = new Set();

  function pausa(motivo, attiva){
    if(attiva) motiviPausa.add(motivo); else motiviPausa.delete(motivo);
    scatola.classList.toggle('in-pausa', motiviPausa.size > 0);
  }

  palco.addEventListener('mouseenter', function(){ pausa('mouse', true); });
  palco.addEventListener('mouseleave', function(){ pausa('mouse', false); });
  palco.addEventListener('focusin', function(){ pausa('focus', true); });
  palco.addEventListener('focusout', function(){ pausa('focus', false); });

  /* non cambiare articolo mentre si legge più in basso */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(voci){
      pausa('fuori', !voci[0].isIntersecting);
    }, { threshold:.5 }).observe(monitor);
  }

  /* su computer la scaletta è alta quanto il monitor e scorre al suo interno */
  function allineaScaletta(){
    scatola.style.maxHeight = window.innerWidth > 960 ? monitor.offsetHeight + 'px' : '';
  }

  if('ResizeObserver' in window){
    new ResizeObserver(allineaScaletta).observe(monitor);
  }

  window.addEventListener('resize', allineaScaletta);

  ['tg-foto', 'tg-sfondo'].forEach(function(id){
    $(id).addEventListener('error', function(){
      if(copertinaMancante($(id)) && id === 'tg-foto'){
        monitor.classList.remove('con-categoria');
      }
    });
  });

  $('tg-titolo').addEventListener('click', fermaGiro);


  /* ---------- Avvio ---------- */

  function avvia(dati){
    servizi = (dati.scaletta || []).map(daArticolo);

    preparaUltimora(
      (config.ultimora || []).concat(servizi.slice(0, 8).map(function(s){ return s.titolo; }))
    );
    preparaArchivio((dati.archivio || []).map(daArticolo));

    if(!servizi.length){
      messaggioMonitor('Nessun articolo in scaletta questo mese');
      return;
    }

    preparaScaletta();
    allineaScaletta();

    document.documentElement.style.setProperty('--durata', SECONDI_PER_SERVIZIO + 's');

    const richiesto = servizi.findIndex(function(s){
      return '#' + s.id === location.hash;
    });

    if(richiesto >= 0 || menoMovimento || servizi.length < 2){
      fermaGiro();
    }

    mostra(Math.max(richiesto, 0), richiesto >= 0);

    if(richiesto >= 0){
      $('servizio').scrollIntoView();
    }
  }

  if(!config.fonte){
    messaggioMonitor('Redazione non configurata');
    return;
  }

  fetch(config.fonte)
    .then(function(r){
      if(!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(avvia)
    .catch(function(){
      messaggioMonitor('Le notizie non sono disponibili in questo momento');
    });

})();
