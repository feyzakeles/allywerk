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
