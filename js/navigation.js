/* Markiert den Navigationspunkt des Bereichs, in dem man gerade ist.
   Das Einzige auf dieser Seite, das JavaScript braucht. Ohne das Skript
   funktionieren die Links weiterhin, nur die Markierung fehlt. */
(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.kopf nav a[href^="#"]')
  );
  if (!links.length) return;

  var ziele = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });
  var kopf = document.querySelector('.kopf');
  var wartet = false;

  function aktualisieren() {
    wartet = false;
    // Die Linie liegt knapp unter dem festen Kopf. Aktiv ist der letzte
    // Bereich, dessen Anfang sie schon passiert hat.
    var linie = (kopf ? kopf.offsetHeight : 0) + 48;
    var aktiv = -1;
    ziele.forEach(function (ziel, i) {
      if (ziel && ziel.getBoundingClientRect().top <= linie) aktiv = i;
    });
    links.forEach(function (a, i) {
      if (i === aktiv) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function anstossen() {
    if (wartet) return;
    wartet = true;
    requestAnimationFrame(aktualisieren);
  }

  addEventListener('scroll', anstossen, { passive: true });
  addEventListener('resize', anstossen);
  addEventListener('hashchange', anstossen);
  aktualisieren();
})();

/* Menü-Knopf fürs Handy. Der Knopf steht mit `hidden` im HTML und wird
   erst hier freigeschaltet – ohne JavaScript bleibt die Navigation offen
   sichtbar, statt hinter einem toten Knopf zu verschwinden. */
(function () {
  var knopf = document.querySelector('.menue-knopf');
  var kopf = document.querySelector('.kopf');
  var nav = document.getElementById('hauptnav');
  if (!knopf || !kopf || !nav) return;

  document.documentElement.classList.add('js-nav');
  knopf.hidden = false;

  var offen = function () { return knopf.getAttribute('aria-expanded') === 'true'; };

  function zu(fokusZurueck) {
    kopf.classList.remove('kopf--offen');
    knopf.setAttribute('aria-expanded', 'false');
    if (fokusZurueck) knopf.focus();
  }
  function auf() {
    kopf.classList.add('kopf--offen');
    knopf.setAttribute('aria-expanded', 'true');
  }

  knopf.addEventListener('click', function () { offen() ? zu(false) : auf(); });

  // Esc schließt und bringt den Fokus zurück auf den Knopf.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offen()) zu(true);
  });

  // Klick außerhalb des Kopfes schließt. Der Knopf selbst liegt im Kopf,
  // sein eigener Klick schließt also nicht sofort wieder.
  document.addEventListener('click', function (e) {
    if (offen() && !kopf.contains(e.target)) zu(false);
  });

  // Ein Sprung im Menü schließt es, sonst verdeckt es das Sprungziel.
  nav.addEventListener('click', function (e) {
    if (offen() && e.target.closest('a')) zu(false);
  });
})();
