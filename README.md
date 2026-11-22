# Allywerk – Website

Konzeptseite, Entwurf vom 12.11.2026.

## Aufbau

    index.html          die ganze Seite, ein Dokument
    css/stil.css        alle Farben, Schriften und Abstände
    js/navigation.js    markiert den Bereich, in dem man gerade ist
    img/                Logo (hell und dunkel) und Favicon

Kein Baukasten, keine Abhängigkeiten. JavaScript steckt nur in
`js/navigation.js` und nur für die Markierung in der Navigation –
ohne die Datei funktioniert alles andere weiter. `index.html`
doppelklicken reicht zum Anschauen. Zum Veröffentlichen den ganzen
Ordner auf den Webspace laden.

## Noch offen

- Name und Kurzvorstellung der Partnerin
- E-Mail, Telefon, LinkedIn-Profile
- Preis fürs gemeinsame Paket
- Impressum und Datenschutzerklärung (Pflicht vor dem Online-Gehen)
- Steuerliche Behandlung der Preise mit der Steuerberatung klären

Alles davon steht in `index.html` mit der Klasse `offen` markiert und
ist auf der Seite orange gepunktet zu sehen.

## Farben

Alle Werte stehen oben in `css/stil.css` als Variablen. Sie sind gegen
WCAG 2.2 AA gemessen: Text mindestens 4,5:1, Rahmen und Bedienelemente
mindestens 3:1. Wer eine Farbe ändert, misst nach.

## Schrift

Atkinson Hyperlegible (Text) und IBM Plex Mono (Zahlen), beide über
Google Fonts. Ohne Internet nimmt der Browser die Systemschrift.

## Breite und Geräte

Geprüft bei 320, 390, 640, 768, 1024 und 1280 Pixeln: kein Querscrollen,
keine Bedienfläche unter 24 x 24 Pixeln (WCAG 2.5.8), kein Text, der
aus seinem Kasten läuft. Die Umbruchpunkte stehen in `css/stil.css`:

    38 rem   Ablauf wird zweispaltig
    44 rem   Personen, Leistungen und das dunkle Band werden zweispaltig
    46 rem   Farbbelege werden dreispaltig
    56 rem   Ablauf fünfspaltig, Preispakete nebeneinander
    62 rem   Hero bekommt das Prüffenster daneben

Unter 34 rem rutscht die Navigation in eine eigene Zeile, unter 30 rem
schrumpft der Nach-oben-Knopf auf einen runden Pfeil.
