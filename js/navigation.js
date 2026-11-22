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

/* Menü-Schublade fürs Handy.
   Der Knopf steht mit `hidden` im HTML und wird erst hier freigeschaltet –
   ohne JavaScript bleibt die Navigation als normale Leiste sichtbar.
   Eine Schublade, die über der Seite liegt, ist ein Dialog: Der Fokus
   gehört hinein und darf nicht dahinter entwischen, Esc schließt, und der
   Fokus kehrt zum Knopf zurück. Genau daran scheitern die meisten. */
(function () {
  var knopf = document.querySelector('.menue-knopf');
  var kopf = document.querySelector('.kopf');
  var lade = document.getElementById('schublade');
  var schleier = document.querySelector('.schublade__schleier');
  var zuKnopf = document.querySelector('.schublade__zu');
  if (!knopf || !kopf || !lade || !schleier || !zuKnopf) return;

  document.documentElement.classList.add('js-nav');
  knopf.hidden = false;

  function offen() { return knopf.getAttribute('aria-expanded') === 'true'; }

  // Nur was wirklich sichtbar ist, kommt in den Fokuslauf.
  function ziele() {
    return Array.prototype.filter.call(
      lade.querySelectorAll('a[href], button'),
      function (el) { return el.offsetParent !== null || el === zuKnopf; }
    );
  }

  function auf() {
    kopf.classList.add('kopf--offen');
    knopf.setAttribute('aria-expanded', 'true');
    schleier.hidden = false;
    document.body.style.overflow = 'hidden';   // Seite dahinter nicht mitscrollen
    zuKnopf.focus();
  }

  function zu(fokusZurueck) {
    kopf.classList.remove('kopf--offen');
    knopf.setAttribute('aria-expanded', 'false');
    schleier.hidden = true;
    document.body.style.overflow = '';
    if (fokusZurueck) knopf.focus();
  }

  knopf.addEventListener('click', function () { offen() ? zu(false) : auf(); });
  zuKnopf.addEventListener('click', function () { zu(true); });
  schleier.addEventListener('click', function () { zu(false); });

  // Ein Sprung im Menü schließt es, sonst verdeckt es sein eigenes Ziel.
  lade.addEventListener('click', function (e) {
    if (offen() && e.target.closest('a')) zu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!offen()) return;
    if (e.key === 'Escape') { zu(true); return; }
    if (e.key !== 'Tab') return;

    // Fokus im Dialog halten.
    var liste = ziele();
    if (!liste.length) return;
    var erstes = liste[0], letztes = liste[liste.length - 1];
    if (!lade.contains(document.activeElement)) { e.preventDefault(); erstes.focus(); return; }
    if (e.shiftKey && document.activeElement === erstes) { e.preventDefault(); letztes.focus(); }
    else if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
  });
})();
