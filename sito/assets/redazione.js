/* =========================================================
   STUDENTI GIURISPRUDENZA - pagina Redazione (TG SG)
   I contenuti stanno in /redazione/notizie.js
   ========================================================= */

(function(){

  const dati = window.REDAZIONE || {};
  const servizi = dati.servizi || [];
  const ultimora = dati.ultimora || [];
  const edizioni = dati.edizioni || [];

  /* ogni quanti secondi il TG passa da solo al servizio successivo */
  const SECONDI_PER_SERVIZIO = 9;

  const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = function(id){ return document.getElementById(id); };

  const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

  function due(n){
    return String(n).padStart(2, '0');
  }

  /* "2026-10-25" -> Date (ora locale) */
  function leggiData(testo){
    const parti = String(testo || '').split('-').map(Number);
    if(parti.length !== 3 || parti.some(isNaN)) return null;
    return new Date(parti[0], parti[1] - 1, parti[2]);
  }

  function dataEstesa(testo){
    const d = leggiData(testo);
    return d ? d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear() : '';
  }

  /* "oggi", "ieri" oppure "22 ott" */
  function dataBreve(testo){
    const d = leggiData(testo);
    if(!d) return '';
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const giorni = Math.round((oggi - d) / 86400000);
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

  if(ultimora.length){
    const ticker = $('tg-ticker');
    const nastro = $('tg-nastro');
    const pausa = $('tg-pausa');

    /* le notizie compaiono due volte di fila: così il giro è continuo */
    [false, true].forEach(function(copia){
      ultimora.forEach(function(testo){
        const voce = crea('span', '', testo);
        if(copia) voce.setAttribute('aria-hidden', 'true');
        nastro.appendChild(voce);
      });
    });

    /* velocità costante, qualunque sia la lunghezza delle notizie */
    const lettere = ultimora.join('').length;
    nastro.style.setProperty('--durata', Math.max(20, lettere * 0.2) + 's');

    pausa.addEventListener('click', function(){
      const ferma = ticker.classList.toggle('in-pausa');
      pausa.setAttribute('aria-pressed', ferma ? 'true' : 'false');
      pausa.setAttribute('aria-label', ferma ? 'Fai ripartire la barra delle notizie' : 'Ferma la barra delle notizie');
      pausa.firstElementChild.textContent = ferma ? '▶' : '❚❚';
    });

    ticker.classList.remove('nascosto');
  }


  /* ---------- Edizioni del giornale ---------- */

  if(edizioni.length){
    const griglia = $('tg-edizioni');

    edizioni.forEach(function(ed, i){
      const link = crea('a', 'edizione');
      link.href = ed.pdf || '#';
      link.target = '_blank';
      link.rel = 'noopener';

      const copertina = crea('div', 'copertina');
      if(i === 0) copertina.appendChild(crea('span', 'copertina-nuovo', 'NUOVO'));
      copertina.appendChild(crea('div', 'copertina-testata', dati.testata || 'TG SG'));
      copertina.appendChild(crea('div', 'copertina-numero', 'N° ' + ed.numero + ' · ' + (ed.mese || '')));
      if(ed.copertina){
        const foto = crea('img', 'copertina-foto');
        foto.src = ed.copertina;
        foto.alt = '';
        foto.loading = 'lazy';
        copertina.appendChild(foto);
      }
      copertina.appendChild(crea('p', 'copertina-titolo', ed.titolo || ''));

      link.appendChild(copertina);
      link.appendChild(crea('div', 'edizione-leggi', 'Leggi il numero ' + ed.numero + ' in PDF'));
      griglia.appendChild(link);
    });
  } else {
    $('edizioni-sezione').classList.add('nascosto');
  }


  /* ---------- Servizi: monitor, scaletta e articolo ---------- */

  const monitor = $('tg-monitor');
  const sottopancia = $('tg-sottopancia');
  const scaletta = $('tg-scaletta');
  const play = $('tg-play');
  const video = $('tg-video');

  if(!servizi.length){
    $('tg-titolo').textContent = 'Nessun servizio in onda';
    $('tg-titolo').removeAttribute('href');
    document.querySelector('.scaletta').classList.add('nascosto');
    document.querySelector('.palco').style.gridTemplateColumns = '1fr';
    $('servizio').classList.add('nascosto');
    return;
  }

  let attuale = -1;
  let cambio = null;

  /* link YouTube -> codice del video */
  function codiceYoutube(link){
    const trovato = String(link || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return trovato ? trovato[1] : null;
  }

  const pulsanti = servizi.map(function(s, i){
    const li = crea('li');
    const btn = crea('button');
    btn.type = 'button';
    btn.appendChild(crea('span', 'scaletta-numero', due(i + 1)));

    const testi = crea('span');
    testi.appendChild(crea('b', '', s.titolo));
    testi.appendChild(crea('small', '', [s.rubrica, dataBreve(s.data)].filter(Boolean).join(' · ')));
    btn.appendChild(testi);

    const barra = crea('span', 'scaletta-avanzamento');
    barra.setAttribute('aria-hidden', 'true');
    btn.appendChild(barra);

    /* finita la barretta, il TG passa al servizio successivo */
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

  function scriviArticolo(s){
    const box = $('tg-articolo');
    box.textContent = '';
    if(s.rubrica) box.appendChild(crea('p', 'servizio-rubrica', s.rubrica));
    box.appendChild(crea('h2', '', s.titolo));
    if(s.occhiello) box.appendChild(crea('p', 'servizio-occhiello', s.occhiello));
    const firma = [s.autore ? 'di ' + s.autore : '', dataEstesa(s.data)].filter(Boolean).join(' · ');
    if(firma) box.appendChild(crea('p', 'servizio-firma', firma));
    const testo = crea('div', 'servizio-testo');
    (s.testo || []).forEach(function(par){
      testo.appendChild(crea('p', '', par));
    });
    box.appendChild(testo);
  }

  function riempiMonitor(i){
    const s = servizi[i];
    $('tg-foto').src = s.immagine || '';
    $('tg-numero').textContent = 'Servizio ' + due(i + 1);
    $('tg-rubrica').textContent = s.rubrica || '';
    $('tg-titolo').textContent = s.titolo;
    $('tg-occhiello').textContent = s.occhiello || '';
    video.textContent = '';
    play.classList.toggle('nascosto', !codiceYoutube(s.video));

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

    scriviArticolo(servizi[i]);

    if(daUtente){
      history.replaceState(null, '', '#' + servizi[i].id);
    }

    clearTimeout(cambio);
    if(primaVolta || menoMovimento){
      riempiMonitor(i);
    } else {
      /* la tendina copre il monitor, poi scopre il nuovo servizio */
      monitor.classList.remove('cambia');
      void monitor.offsetWidth;
      monitor.classList.add('cambia');
      cambio = setTimeout(function(){ riempiMonitor(i); }, 320);
    }
  }

  /* chi sceglie un servizio lo vuole leggere: il TG non va più avanti da solo */
  function fermaGiro(){
    scaletta.parentElement.classList.add('ferma');
  }

  const scatola = scaletta.parentElement;
  const palco = document.querySelector('.palco');
  const motiviPausa = new Set();

  function pausa(motivo, attiva){
    if(attiva) motiviPausa.add(motivo); else motiviPausa.delete(motivo);
    scatola.classList.toggle('in-pausa', motiviPausa.size > 0);
  }

  palco.addEventListener('mouseenter', function(){ pausa('mouse', true); });
  palco.addEventListener('mouseleave', function(){ pausa('mouse', false); });
  palco.addEventListener('focusin', function(){ pausa('focus', true); });
  palco.addEventListener('focusout', function(){ pausa('focus', false); });

  /* non cambiare servizio mentre si legge l'articolo più in basso */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(voci){
      pausa('fuori', !voci[0].isIntersecting);
    }, { threshold:.5 }).observe(monitor);
  }

  play.addEventListener('click', function(){
    const codice = codiceYoutube(servizi[attuale].video);
    if(!codice) return;
    fermaGiro();
    const riquadro = document.createElement('iframe');
    riquadro.src = 'https://www.youtube-nocookie.com/embed/' + codice + '?autoplay=1&rel=0';
    riquadro.title = servizi[attuale].titolo;
    riquadro.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    riquadro.allowFullscreen = true;
    video.appendChild(riquadro);
    play.classList.add('nascosto');
  });

  $('tg-titolo').addEventListener('click', fermaGiro);


  /* ---------- Avvio ---------- */

  const richiesto = servizi.findIndex(function(s){
    return '#' + s.id === decodeURIComponent(location.hash);
  });

  document.documentElement.style.setProperty('--durata', SECONDI_PER_SERVIZIO + 's');

  if(richiesto >= 0 || menoMovimento || servizi.length < 2){
    fermaGiro();
  }

  mostra(Math.max(richiesto, 0));

  if(richiesto >= 0){
    $('servizio').scrollIntoView();
  }

})();
