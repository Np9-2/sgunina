/* =========================================================
   STUDENTI GIURISPRUDENZA - comportamento del sito
   ========================================================= */

(function(){

  const testata = document.querySelector('.testata');
  const hamburger = document.querySelector('.hamburger');
  const conEroe = !!document.querySelector('.eroe');


  /* ---------- Barra: trasparente sopra la foto, scura scorrendo ---------- */

  function aggiornaBarra(){
    testata.classList.toggle('piena', !conEroe || window.scrollY > 10);
  }

  aggiornaBarra();
  window.addEventListener('scroll', aggiornaBarra, { passive: true });


  /* ---------- Menu su telefono ---------- */

  function chiudiMenu(){
    testata.classList.remove('menu-aperto');
    document.body.classList.remove('menu-aperto');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function(){
    const aperto = testata.classList.toggle('menu-aperto');
    document.body.classList.toggle('menu-aperto', aperto);
    hamburger.setAttribute('aria-expanded', aperto ? 'true' : 'false');
  });

  window.addEventListener('resize', function(){
    if(window.innerWidth > 960){
      chiudiMenu();
    }
  });


  /* ---------- Sottomenu "I anno" ---------- */

  document.querySelectorAll('.apri-sottomenu').forEach(function(btn){

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const li = btn.parentElement;
      const aperto = li.classList.toggle('aperto');
      btn.setAttribute('aria-expanded', aperto ? 'true' : 'false');
    });

  });

  document.addEventListener('click', function(e){
    document.querySelectorAll('.ha-sottomenu.aperto').forEach(function(li){
      if(!li.contains(e.target) && window.innerWidth > 960){
        li.classList.remove('aperto');
        li.querySelector('.apri-sottomenu').setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    chiudiMenu();
    document.querySelectorAll('.ha-sottomenu.aperto').forEach(function(li){
      li.classList.remove('aperto');
    });
  });


  /* ---------- Easter egg: codice Konami ----------
     Digitando  ↑ ↑ ↓ ↓ ← → ← → B A  si apre la pagina segreta.
     - per cambiare la sequenza: modifica SEQUENZA_SEGRETA
       (frecce = 'ArrowUp' 'ArrowDown' 'ArrowLeft' 'ArrowRight', lettere in minuscolo)
     - per cambiare la pagina: modifica PAGINA_SEGRETA */

  const SEQUENZA_SEGRETA = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  const PAGINA_SEGRETA = '/uovo/';
  const ultimiTasti = [];

  document.addEventListener('keydown', function(e){

    /* non intercettare chi sta scrivendo in un campo */
    if(e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;

    ultimiTasti.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);

    if(ultimiTasti.length > SEQUENZA_SEGRETA.length){
      ultimiTasti.shift();
    }

    /* gli ultimi tasti premuti coincidono con la sequenza? */
    if(ultimiTasti.join(',') === SEQUENZA_SEGRETA.join(',')){
      window.location.href = PAGINA_SEGRETA;
    }

  });


  /* ---------- Pagine "app": mostra l'app quando è caricata ---------- */

  document.querySelectorAll('.app-cornice').forEach(function(cornice){

    const riquadro = cornice.querySelector('iframe');

    function pronta(){
      cornice.classList.add('pronta');
    }

    riquadro.addEventListener('load', pronta);

    /* per sicurezza, non lasciare mai la rotella all'infinito */
    setTimeout(pronta, 10000);

  });

})();
