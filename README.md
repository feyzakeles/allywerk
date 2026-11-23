# Allywerk – Website

Die Website von Allywerk, veröffentlicht über GitHub Pages auf
https://allywerk.de

## Aufbau

    index.html          die Startseite
    impressum.html      Impressum nach § 5 DDG
    datenschutz.html    Datenschutzerklärung
    css/stil.css        Schriften, Farben, Abstände
    js/navigation.js    markiert den Bereich, in dem man gerade ist
    img/                Logo (hell und dunkel) und Favicon
    fonts/              die beiden Schriften, mitgeliefert
    CNAME               die Domain für GitHub Pages
    sitemap.xml         eine URL – Impressum und Datenschutz stehen auf noindex
    robots.txt          verweist auf die Sitemap
    .htaccess           nur für den Fall eines Umzugs auf Apache-Webspace

Kein Baukasten, keine Abhängigkeiten. JavaScript steckt nur in
`js/navigation.js` und nur für die Markierung in der Navigation –
ohne die Datei funktioniert alles andere weiter. `index.html`
doppelklicken reicht zum Anschauen. Zum Veröffentlichen den ganzen
Ordner auf den Webspace laden – oder einfach pushen, GitHub Pages
veröffentlicht `main` von selbst.

## Eine Person, nicht zwei

Bis zum 22.11.2026 verkaufte die Seite „zwei Prüferinnen“. Allywerk ist
aber Feyzas eigenes Gewerbe, angemeldet als Einzelunternehmen; ihre
Freundin hat eine eigene Website. Alle Stellen, die zwei Menschen
behaupteten, sind entfernt: Seitenbeschreibung, Hero-Zeile, die
Überschrift „Zwei Menschen, ein Bericht“, die zweite Personenkarte, der
Ablaufschritt und der Paket-Stichpunkt. Die Fähigkeiten beider Karten
stehen jetzt in einer.

Die Klasse `offen` (orange gepunktet) markierte unfertige Stellen. Sie
wird zurzeit nirgends benutzt, die Regel steht aber weiter in
`css/stil.css` für den nächsten Entwurf.

Seit dem 22.11.2026 spricht die Seite durchgehend in der **Ich-Form**,
auch Impressum und Datenschutzerklärung. Wer Text ergänzt, bleibt dabei –
ein einzelnes „wir“ fällt sofort auf.

## Zwei Angebote, nicht eins

Seit dem 22.11.2026 verkauft die Seite beides: **Prüfen** (Abschnitt
`#leistungen`) und **Bauen** (`#bauen`). Die Navigation heißt deshalb
„Prüfen · Bauen · Ablauf · Preise · Kontakt“.

Alle Preise stehen im Abschnitt `#preise`, in zwei Gruppen (`.preisgruppe`).
Die Prüf-Preise stammen von Merve (`~/Downloads/eser-digital-website`),
die Bau-Preise aus `~/Desktop/Allywerk-Preisliste.pages` vom 21.11.2026.
Die Paketnamen sind dort `h4`, weil die Gruppenüberschrift `h3` ist –
Reihenfolge der Überschriften geprüft, keine Sprünge.

**Umbauen ist nicht dasselbe wie neu bauen.** Bestehende Seiten
barrierefrei nachrüsten gehört nicht zum Angebot, neue Seiten schon.
Der Punkt unter „Was ich nicht mache“ sagt genau das – nicht
verwässern.

## Statistik: Google Tag Manager, nur mit Einwilligung

Container `GTM-THVG4P38`, geladen von `js/statistik.js`.

**Der Container darf nicht fest im `<head>` stehen.** Genau so stand er vom
22. bis 23.11.2026 auf der Live-Seite und hat ungefragt zwei Cookies
gesetzt – gemessen an `allywerk.de`: zwei Anfragen an
`googletagmanager.com` und `region1.google-analytics.com`, dazu die
Cookies `_ga` und `_ga_SQ1DGKBGX5`. Gleichzeitig stand in der
Datenschutzerklärung „keine Cookies". Das ist genau der Befund, für den
Feyza Kunden prüft, und nach § 25 TDDDG braucht es die Einwilligung
**vor** dem Zugriff aufs Endgerät.

Jetzt lädt `gtm.js` erst nach einem Klick auf „Erlauben“. Wie es gebaut ist:

- **Ohne Einwilligung passiert nichts.** Kein Skript, kein Cookie, keine
  Verbindung. Geprüft, indem der Test jede Netzwerkanfrage und jeden
  Cookie mitschreibt – beim ersten Besuch und nach einem Nein: null.
- Ablehnen und Erlauben sind **gleich groß und stehen nebeneinander**
  (je 159 × 50 px gemessen). Ablehnen muss so leicht sein wie Zustimmen.
- Die Entscheidung steht in `localStorage` unter `allywerk-statistik`.
  Nach einem Nein wird nicht erneut gefragt.
- **Widerruf** über „Statistik-Einstellung ändern“ in der Fußzeile. Der
  Knopf erscheint erst, wenn eine Entscheidung vorliegt, und holt das
  Banner zurück – ein Widerruf muss so einfach sein wie die Erteilung.
- Das Banner steht im HTML **direkt nach dem Sprunglink**, also nach zwei
  Tabs erreichbar. Angezeigt wird es unten. Am Dokumentende müssten
  Tastaturnutzer erst die ganze Seite durchtabben.
- Kein `h2` im Banner – es steht vor dem `h1` und würde die
  Überschriftenfolge zerreißen. `aria-labelledby` zeigt auf ein `<p>`.
- `GTM_ID` leeren schaltet alles ab: kein Banner, kein Skript.

**Wer Tags im GTM ergänzt, prüft die Datenschutzerklärung mit.** Abschnitt 5
nennt die Cookies beim Namen. Kommt ein Dienst dazu, muss er dort stehen.

Zwei Fallen, die beim Bauen zugeschnappt sind:

- **`[hidden]` wirkt nicht, wenn irgendwo ein `display` dafür steht.**
  `.statistik{display:flex}` hat den Browser-Standard überstimmt, das
  Banner war immer sichtbar. Deshalb steht jetzt
  `[hidden]{display:none!important}` ganz oben in `stil.css`.
- **`.knopf` setzte keinen Hintergrund.** An `<a>` egal, an `<button>`
  scheint der graue Browser-Standard `buttonface` durch: im Dunkelmodus
  heller Text auf Hellgrau, 1,01:1. Die Klasse hat jetzt
  `background:transparent`.

## Google Search Console

Angebunden über eine **Domain-Property** (DNS-TXT-Eintrag bei IONOS), nicht
über ein Skript auf der Seite. Deshalb keine Cookies, kein Einwilligungsbanner
und keine Änderung an der Datenschutzerklärung – die fünf Zusagen in
Abschnitt 2 bleiben wahr.

Die Search Console braucht **kein Skript auf der Seite** – daran ändert
auch der Tag Manager nichts. Sie läuft weiter über den DNS-Eintrag.

Impressum und Datenschutzerklärung tragen `noindex`. In der Search Console
tauchen sie deshalb unter „Durch noindex ausgeschlossen“ auf – das ist kein
Fehler.

## Noch offen

- LinkedIn-Profil verlinken
- Steuerliche Behandlung der Preise mit der Steuerberatung klären
- Die Punktzahlen (47 Website-Check, 19 Gestaltung) weichen von denen im
  Prüfwerkzeug ab (45 und 21). Eine der beiden Zahlen stimmt nicht.
- Die Überschrift im Hero („Ein Werkzeug findet einen Teil. Den Rest
  finde ich.“) spricht nur vom Prüfen. Seit es zwei Angebote gibt,
  passt sie nur noch halb.
- Die Leistungs-Karte nennt „47 Punkte“, die Preis-Karte „rund 100
  Einzelprüfungen“. Beides beschreibt denselben Detail-Check.
- Der Gestaltungs-Check ist am 22.11.2026 von der Seite genommen
  worden, Karte und Preis. Im Prüfwerkzeug gibt es ihn weiter als
  eigene Prüfart – dort steht er unverändert.
- Der kostenlose Kurz-Check war am 30.09.2026 bewusst abgeschafft
  worden (siehe CLAUDE.md im Hauptprojekt). Mit Merves Preisen ist er
  wieder da – bewusst so lassen oder streichen.
- „Komplett mit SEO“ ist ein Monatsmodell (449 € × 6). Feyza wollte
  monatliche Posten eigentlich nicht.
- Der Redaktionsbereich steht jetzt bei **Paket 2**, so wie die
  Preistabelle in `Allywerk-Preisliste.pages` es sagt („+ CMS“). Die
  Zeile „In jedem Paket enthalten: Redaktionsbereich“ aus demselben
  Dokument wurde deshalb nicht übernommen – beides zusammen hätte sich
  widersprochen. Falls der Redaktionsbereich doch in beide Pakete soll:
  eine Zeile in `#preise` und in der Preisliste.
- Preise stehen an drei Stellen: hier, in
  `~/Desktop/Allywerk-Preisliste.pages` und im Prüfwerkzeug unter
  Einstellungen. Bei Änderungen alle drei nachziehen.

## Farben

Alle Werte stehen oben in `css/stil.css` als Variablen. Sie sind gegen
WCAG 2.2 AA gemessen: Text mindestens 4,5:1, Rahmen und Bedienelemente
mindestens 3:1. Wer eine Farbe ändert, misst nach.

## Schrift

Atkinson Hyperlegible (Text) und IBM Plex Mono (Zahlen), beide unter
SIL Open Font License 1.1 und **mitgeliefert in `fonts/`**, nicht von
Google geladen. Die Seite stellt damit keine einzige Anfrage an einen
fremden Server – genau das sagt die Datenschutzerklärung zu, also beim
Ändern aufpassen.

Dort liegen nur die Schnitte, die wirklich benutzt werden: Atkinson 400
und 700, Plex Mono 400, 500 und 600, je latin und latin-ext, kein
Kursiv. Zusammen rund 90 KB. Wer eine Schriftstärke ergänzt, lädt die
Datei dazu und trägt sie oben in `css/stil.css` als `@font-face` ein.

## Breite und Geräte

Mit axe geprüft über alle drei Seiten, hell und dunkel, bei 375 und
1280 Pixeln: keine Verstöße. Zusätzlich von Hand bei 320, 390, 640,
768, 1024 und 1280 Pixeln: kein Querscrollen,
keine Bedienfläche unter 24 x 24 Pixeln (WCAG 2.5.8), kein Text, der
aus seinem Kasten läuft. Die Umbruchpunkte stehen in `css/stil.css`:

    38 rem   Ablauf wird zweispaltig
    44 rem   Personen, Leistungen und das dunkle Band werden zweispaltig
    46 rem   Farbbelege werden dreispaltig
    56 rem   Ablauf fünfspaltig, Preispakete nebeneinander
    62 rem   Hero bekommt das Prüffenster daneben

Unter 34 rem rutscht die Navigation in eine eigene Zeile, unter 30 rem
schrumpft der Nach-oben-Knopf auf einen runden Pfeil.

**Menü-Schublade bis 34 rem (544 px).** Darüber stehen alle fünf Links
offen im Kopf, darunter fährt eine Schublade von links über die Seite –
runder Knopf links, Schublade mit Markenkopf und Schließen-Knopf,
Symbol plus Text je Eintrag, darunter Impressum und Datenschutz,
dahinter die Seite abgedunkelt. Der Kopf ist dadurch auf jeder Breite
66 bis 67 px hoch.

Eine Schublade über der Seite ist ein Dialog. Das sind die Stellen, an
denen so etwas üblicherweise durch eine Prüfung fällt:

- Der Knopf steht mit `hidden` im HTML und wird erst von
  `js/navigation.js` freigeschaltet, das dazu `js-nav` auf `<html>` setzt.
  **Ohne JavaScript bleibt die Navigation als normale Leiste sichtbar.**
- Zugeklappt `visibility:hidden` – das nimmt die Links aus Tabulatorlauf
  und Screenreader und lässt die Bewegung trotzdem zu. Nur verschieben
  würde beides nicht tun.
- **`visibility` schaltet beim Öffnen sofort um, beim Schließen erst nach
  der Fahrt** (`transition:… visibility 0s linear .25s`). Ohne das steht
  die Schublade im Moment des `focus()` noch auf `hidden`, und ein Fokus
  auf etwas Unsichtbares verpufft wirkungslos.
- Beim Öffnen springt der Fokus auf den Schließen-Knopf und **bleibt in
  der Schublade** – Tab und Shift+Tab laufen im Kreis.
- Esc schließt und gibt den Fokus an den Knopf zurück. Klick auf den
  Schleier schließt, Klick auf einen Link auch.
- **`focus()` immer mit `{preventScroll:true}`.** Ohne das scrollt der
  Browser den frisch fokussierten Knopf in den Blick, und die Seite
  springt beim Schließen 434 px nach oben. Gemessen: `knopf.focus()`
  bringt scrollY von 1200 auf 766, mit `preventScroll` bleibt es bei
  1200. Der Schließen-Knopf in der Schublade macht das nicht, der liegt
  fest im Fenster – es trifft nur den Hamburger im Seitenfluss.
- `document.body.style.overflow` sperrt die Seite dahinter.
- `prefers-reduced-motion` schaltet die Fahrt ab.
- Trefferflächen: Knopf 44 × 44, Einträge mindestens 48 px hoch.

Geprüft mit 27 Einzelprüfungen und axe über drei Seiten × hell/dunkel ×
zugeklappt/offen × 320/390/1280 px: 24 Kombinationen, keine Verstöße.

**Vorsicht bei der Spezifität.** `.kopf nav ul` wiegt schwerer als eine
einzelne Klasse. Deshalb steht die Regel für `.schublade__zweit` als
`.kopf nav ul.schublade__zweit` da – sonst stehen Impressum und
Datenschutz auch auf dem Desktop in der Leiste. Und `.schublade__icon`
ist auf dem Desktop ausgeblendet, sonst wachsen die SVGs ungebremst und
machen den Kopf doppelt so hoch.

**Das Logo sitzt auf dem Handy mittig.** Dafür ist `.kopf .bahn` dort ein
Raster aus drei Spalten – Knopf, Logo, Leerraum. Die dritte Spalte ist
leer und sieht überflüssig aus, hält aber die Mitte: ohne sie säße das
Logo nur rechts neben dem Knopf.

**Impressum und Datenschutz stehen nur in der Fußzeile.** Sie waren eine
Zeit lang auch in der Schublade – auf dem Handy also doppelt. Die
Fußzeile ist der Ort, an dem Leute danach suchen, und sie ist auf jeder
Breite da.

**Alle Abschnittsköpfe sind mittig** (`kopfzeile--mitte`), der Text in
den Karten darunter linksbündig. Vorher war die Hälfte der Köpfe links,
die andere mittig – auf dem Handy fiel das sofort auf. Wer einen
Abschnitt ergänzt, nimmt `kopfzeile--mitte`.

**Alle drei Seiten tragen denselben Kopf.** Wer die Navigation ändert,
ändert sie in `index.html`, `impressum.html` und `datenschutz.html`.

## Zwei Dinge, die man leicht kaputtmacht

Die Dateien brauchen `<!doctype html>` und `<html lang="de">`. Beides
fehlte bis zum 22.11.2026 – das ist WCAG 3.1.1 auf Stufe A, der
Screenreader liest die Seite sonst auf Englisch vor.

Falls `index.html` je wieder als claude.ai-Artifact veröffentlicht
wird: Dort darf der Doctype **nicht** hinein, den setzt die
Artifact-Hülle selbst. Repo-Fassung und Artifact-Fassung laufen seit
dem 22.11.2026 auseinander; führend ist das Repo.
