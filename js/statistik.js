/* Google Analytics 4 mit Einwilligung.

   Ohne Einwilligung wird NICHTS geladen – kein Skript, kein Cookie, keine
   Verbindung zu Google. Erst ein Klick auf „Erlauben“ holt gtag.js.

   Das Banner erscheint nur, wenn unten eine Mess-ID eingetragen ist. Ohne
   ID bleibt die Seite genau so, wie sie ohne diese Datei wäre.

   § 25 TDDDG verlangt die Einwilligung VOR dem Zugriff auf das Endgerät.
   Ablehnen muss dabei genauso leicht sein wie Zustimmen – deshalb zwei
   gleich große Knöpfe nebeneinander, kein verstecktes „Einstellungen“.
   Die Entscheidung lässt sich über den Link in der Fußzeile ändern;
   ein Widerruf muss so einfach sein wie die Erteilung. */
(function () {
  var MESS_ID = '';                 // z. B. 'G-XXXXXXXXXX' – leer = alles aus
  var SCHLUESSEL = 'allywerk-statistik';

  var banner = document.getElementById('statistik-banner');
  var aendern = document.getElementById('statistik-aendern');
  if (!banner) return;

  function gespeichert() {
    try { return localStorage.getItem(SCHLUESSEL); } catch (e) { return null; }
  }
  function merken(wert) {
    try { localStorage.setItem(SCHLUESSEL, wert); } catch (e) { /* Privates Fenster */ }
  }

  function ladeGA() {
    if (!MESS_ID || window.gaGeladen) return;
    window.gaGeladen = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MESS_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MESS_ID);
  }

  function zeigeBanner() {
    banner.hidden = false;
  }
  function versteckeBanner() {
    banner.hidden = true;
  }

  banner.querySelector('[data-statistik="ja"]').addEventListener('click', function () {
    merken('ja'); versteckeBanner(); ladeGA();
    if (aendern) aendern.hidden = false;
  });
  banner.querySelector('[data-statistik="nein"]').addEventListener('click', function () {
    merken('nein'); versteckeBanner();
    if (aendern) aendern.hidden = false;
  });

  // Entscheidung widerrufen oder nachholen
  if (aendern) {
    aendern.addEventListener('click', function () {
      try { localStorage.removeItem(SCHLUESSEL); } catch (err) { /* egal */ }
      aendern.hidden = true;
      zeigeBanner();
      banner.querySelector('[data-statistik="nein"]').focus();
    });
  }

  if (!MESS_ID) return;             // Ohne Mess-ID gar nichts anzeigen

  var wahl = gespeichert();
  if (wahl === 'ja') { ladeGA(); if (aendern) aendern.hidden = false; }
  else if (wahl === 'nein') { if (aendern) aendern.hidden = false; }
  else zeigeBanner();
})();
