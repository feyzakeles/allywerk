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
    .htaccess           nur für den Fall eines Umzugs auf Apache-Webspace

Kein Baukasten, keine Abhängigkeiten. JavaScript steckt nur in
`js/navigation.js` und nur für die Markierung in der Navigation –
ohne die Datei funktioniert alles andere weiter. `index.html`
doppelklicken reicht zum Anschauen. Zum Veröffentlichen den ganzen
Ordner auf den Webspace laden – oder einfach pushen, GitHub Pages
veröffentlicht `main` von selbst.

## Noch offen

- Name und Kurzvorstellung der Partnerin
- E-Mail, Telefon, LinkedIn-Profile
- Preis fürs gemeinsame Paket
- Steuerliche Behandlung der Preise mit der Steuerberatung klären

Alles davon steht in `index.html` mit der Klasse `offen` markiert und
ist auf der Seite orange gepunktet zu sehen.

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

## Zwei Dinge, die man leicht kaputtmacht

Die Dateien brauchen `<!doctype html>` und `<html lang="de">`. Beides
fehlte bis zum 22.11.2026 – das ist WCAG 3.1.1 auf Stufe A, der
Screenreader liest die Seite sonst auf Englisch vor.

Falls `index.html` je wieder als claude.ai-Artifact veröffentlicht
wird: Dort darf der Doctype **nicht** hinein, den setzt die
Artifact-Hülle selbst. Repo-Fassung und Artifact-Fassung laufen seit
dem 22.11.2026 auseinander; führend ist das Repo.
