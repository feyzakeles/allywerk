/* Google Tag Manager mit Einwilligung.

   Ohne Einwilligung wird NICHTS geladen – kein Skript, kein Cookie, keine
   Verbindung zu Google. Erst ein Klick auf „Erlauben“ holt gtag.js.

   Das Banner erscheint nur, wenn unten eine Container-ID eingetragen ist.
   Ohne ID bleibt die Seite genau so, wie sie ohne diese Datei wäre.

   Der Container darf NICHT fest im <head> stehen. Genau so stand er vom
   22.11.2026 bis heute auf der Seite und hat ungefragt zwei Cookies
   gesetzt (_ga und _ga_SQ1DGKBGX5), gemessen an der Live-Seite.

   § 25 TDDDG verlangt die Einwilligung VOR dem Zugriff auf das Endgerät.
   Ablehnen muss dabei genauso leicht sein wie Zustimmen – deshalb zwei
   gleich große Knöpfe nebeneinander, kein verstecktes „Einstellungen“.
   Die Entscheidung lässt sich über den Link in der Fußzeile ändern;
   ein Widerruf muss so einfach sein wie die Erteilung. */
(function () {
  var GTM_ID = 'GTM-THVG4P38';      // Google-Tag-Manager-Container, leer = alles aus
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
    if (!GTM_ID || window.gtmGeladen) return;
    window.gtmGeladen = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
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

  if (!GTM_ID) return;              // Ohne Container-ID gar nichts anzeigen

  var wahl = gespeichert();
  if (wahl === 'ja') { ladeGA(); if (aendern) aendern.hidden = false; }
  else if (wahl === 'nein') { if (aendern) aendern.hidden = false; }
  else zeigeBanner();
})();
