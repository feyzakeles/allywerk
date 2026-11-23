/* Kurzcheck auf allywerk.de/check

   Die Seite liegt bei GitHub Pages und kann selbst nichts abrufen – fremde
   Seiten zu laden verbietet CORS. Das übernimmt ein Cloudflare Worker, der
   nur prüft und nichts speichert. Seine Adresse steht unten.

   Solange DIENST leer ist, sagt das Formular ehrlich, dass der Dienst noch
   nicht verbunden ist, statt stumm zu scheitern. */
(function () {
  var DIENST = 'https://kurzcheck.shrill-wind-658d.workers.dev/';

  var form = document.getElementById('pruefform');
  if (!form) return;
  var feld = document.getElementById('adresse');
  var los = document.getElementById('losknopf');
  var stand = document.getElementById('pruefstand');
  var ergebnis = document.getElementById('ergebnis');
  var weiter = document.getElementById('weiter');
  var ampel = document.getElementById('ampel');
  var adresseAus = document.getElementById('ergebnis-adresse');
  var liste = document.getElementById('befunde');
  var pdfknopf = document.getElementById('pdfknopf');
  var letztes = null;

  var WORTE = { gruen: 'In Ordnung', gelb: 'Könnte besser sein', rot: 'Hier ist etwas zu tun' };
  var ZEICHEN = { gruen: '✓', gelb: '!', rot: '✗' };

  function melde(text, art) {
    stand.textContent = text;
    stand.className = 'pruefstand' + (art ? ' pruefstand--' + art : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var wert = feld.value.trim();
    if (!wert) { melde('Bitte tragen Sie die Adresse Ihrer Website ein.', 'fehler'); feld.focus(); return; }
    if (!DIENST) {
      melde('Der Prüfdienst ist noch nicht verbunden. Schreiben Sie mir an info@allywerk.de, ich prüfe Ihre Seite von Hand.', 'fehler');
      return;
    }
    ergebnis.hidden = true; weiter.hidden = true;
    los.disabled = true;
    melde('Ihre Seite wird geladen und geprüft – einen Moment.');

    fetch(DIENST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: wert }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (a) {
        los.disabled = false;
        if (!a.ok || a.d.fehler) { melde(a.d.fehler || 'Das hat nicht geklappt. Bitte später noch einmal.', 'fehler'); return; }
        zeige(a.d);
      })
      .catch(function () {
        los.disabled = false;
        melde('Der Prüfdienst war nicht erreichbar. Bitte später noch einmal.', 'fehler');
      });
  });

  function zeige(d) {
    letztes = d;
    melde('');
    ampel.className = 'ampel ampel--' + d.note;
    adresseAus.textContent = d.geprueft;
    document.getElementById('ergebnis-titel').textContent =
      WORTE[d.note] + ' – ' + d.rote + ' rot, ' + d.gelbe + ' gelb, ' + (d.punkte.length - d.rote - d.gelbe) + ' grün';

    liste.textContent = '';
    d.punkte.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'befund befund--' + p.ampel;
      var z = document.createElement('span');
      z.className = 'befund__zeichen'; z.setAttribute('aria-hidden', 'true');
      z.textContent = ZEICHEN[p.ampel];
      var txt = document.createElement('div');
      var t = document.createElement('p');
      t.className = 'befund__titel';
      // Die Farbe allein darf die Bewertung nicht tragen – WCAG 1.4.1.
      t.textContent = p.titel;
      var sr = document.createElement('span');
      sr.className = 'nur-sr'; sr.textContent = ' – ' + WORTE[p.ampel];
      t.appendChild(sr);
      var i = document.createElement('p');
      i.className = 'befund__info';
      i.textContent = (p.wcag ? 'WCAG ' + p.wcag + ' · ' : '') + p.info;
      txt.appendChild(t); txt.appendChild(i);
      li.appendChild(z); li.appendChild(txt);
      liste.appendChild(li);
    });

    ergebnis.hidden = false;
    weiter.hidden = false;
    document.getElementById('ergebnis-titel').focus();
  }

  /* jsPDF wird erst beim Klick geladen – 420 KB will niemand umsonst holen. */
  pdfknopf.addEventListener('click', function () {
    if (!letztes) return;
    pdfknopf.disabled = true;
    ladeJsPdf().then(function () { bauePdf(letztes); pdfknopf.disabled = false; })
      .catch(function () { melde('Das PDF ließ sich nicht erzeugen.', 'fehler'); pdfknopf.disabled = false; });
  });

  function ladeJsPdf() {
    if (window.jspdf) return Promise.resolve();
    return new Promise(function (fertig, schief) {
      var s = document.createElement('script');
      s.src = '../js/fremd/jspdf.umd.min.js';
      s.onload = fertig; s.onerror = schief;
      document.head.appendChild(s);
    });
  }

  function bauePdf(d) {
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    var R = 18, B = 210 - 2 * R, y = R;
    var datum = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(90, 80, 110);
    doc.text('ALLYWERK', R, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text('Feyza Keles · Köln · Digitale Barrierefreiheit', R, y); y += 12;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(46, 36, 64);
    doc.text('Kurzcheck', R, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(99, 88, 121);
    doc.text(abspecken(d.geprueft), R, y); y += 5;
    doc.text(datum, R, y); y += 10;

    var farbe = d.note === 'gruen' ? [14, 124, 102] : d.note === 'gelb' ? [138, 75, 0] : [176, 42, 42];
    doc.setFillColor(farbe[0], farbe[1], farbe[2]);
    doc.roundedRect(R, y - 5, B, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text(WORTE[d.note] + ':  ' + d.rote + ' rot, ' + d.gelbe + ' gelb, ' +
             (d.punkte.length - d.rote - d.gelbe) + ' grün', R + 4, y + 2.5);
    y += 16;

    d.punkte.forEach(function (p) {
      if (y > 250) { doc.addPage(); y = R; }
      var f = p.ampel === 'gruen' ? [14, 124, 102] : p.ampel === 'gelb' ? [138, 75, 0] : [176, 42, 42];
      doc.setTextColor(f[0], f[1], f[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(ZEICHEN[p.ampel] === '✓' ? 'OK' : ZEICHEN[p.ampel] === '!' ? '!' : 'X', R, y);
      doc.setTextColor(46, 36, 64);
      doc.text(abspecken(p.titel), R + 8, y);
      y += 5;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(99, 88, 121);
      var zeilen = doc.splitTextToSize(abspecken((p.wcag ? 'WCAG ' + p.wcag + ' - ' : '') + p.info), B - 8);
      doc.text(zeilen, R + 8, y);
      y += zeilen.length * 4.4 + 5;
    });

    if (y > 215) { doc.addPage(); y = R; }
    y += 6;
    doc.setDrawColor(228, 223, 237); doc.line(R, y, R + B, y); y += 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(46, 36, 64);
    doc.text('Und wie behebe ich das?', R, y); y += 7;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(99, 88, 121);
    var t = 'Dieser Kurzcheck liest den Quelltext Ihrer Startseite. Ob sich die Seite mit der ' +
            'Tastatur bedienen lässt, ob ein Screenreader sie versteht und ob die Kontraste ' +
            'reichen, kann nur ein Mensch beurteilen, der die Seite wirklich benutzt. ' +
            'Das ist der Detail-Check: rund 100 Einzelprüfungen auf sechs Seiten, automatisch ' +
            'und von Hand, mit Lösungsweg zu jedem Befund, Maßnahmenplan, 30 Minuten Gespräch ' +
            'und Nachkontrolle nach vier Wochen. 149 € einmalig.';
    doc.text(doc.splitTextToSize(t, B), R, y);
    y += doc.splitTextToSize(t, B).length * 4.4 + 8;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(14, 124, 102);
    doc.text('info@allywerk.de  ·  allywerk.de', R, y);

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(140, 132, 158);
    doc.text('Kurzcheck von Allywerk. Ersetzt keine vollständige Prüfung nach BFSG und ist keine Rechtsberatung.',
             R, 287);

    var name = 'Kurzcheck-' + d.geprueft.replace(/^https?:\/\//, '').replace(/[^a-z0-9.-]/gi, '-').replace(/-+$/, '');
    doc.save(name + '.pdf');
  }

  /* jsPDFs Standardschriften rechnen nach WinAnsi um – Umlaute, ß, §, €,
     Gedankenstrich und deutsche Anführungszeichen kommen alle sauber an
     (an jsPDF 4.2.1 nachgemessen). Nur was dort nicht vorkommt, muss weg,
     sonst steht im PDF ein Kästchen. */
  var WINANSI_EXTRA = '\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D' +
                      '\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178';
  function abspecken(s) {
    var aus = '';
    String(s).split('').forEach(function (z) {
      var c = z.charCodeAt(0);
      if ((c >= 0x20 && c <= 0xFF) || WINANSI_EXTRA.indexOf(z) >= 0) aus += z;
      else if (c === 0x00B7 || c === 0x2027) aus += '\u00B7';
      else aus += '';
    });
    return aus;
  }
})();
