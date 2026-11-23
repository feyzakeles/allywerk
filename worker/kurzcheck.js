/* Allywerk Kurzcheck – Cloudflare Worker.

   Einzige Aufgabe: eine fremde Startseite abrufen, acht Kernpunkte aus dem
   Quelltext prüfen, das Ergebnis als JSON zurückgeben. Es wird nichts
   gespeichert, es gibt keine Datenbank, keine Kundendaten.

   Warum überhaupt ein Dienst: Der Browser des Besuchers darf fremde Seiten
   nicht abrufen, das verbietet CORS. Der Worker darf es.

   Warum kein Browser auf dem Server: Titel, Sprache, Alt-Texte,
   Überschriften, Beschriftungen und Rechtstexte stehen alle im Quelltext.
   Kontraste und Tastaturbedienung nicht – die gehören in den Detail-Check.

   Hochladen: Cloudflare-Konto → Workers → Create → diesen Inhalt einfügen →
   Deploy. Die ERLAUBT-Liste unten anpassen, falls die Adresse wechselt.   */

const ERLAUBT = ['https://allywerk.de', 'https://www.allywerk.de'];
const ZEITGRENZE = 12000;      // ms, danach gilt die Seite als nicht erreichbar
const MAX_BYTES = 2_000_000;   // größere Seiten werden abgeschnitten

export default {
  async fetch(anfrage) {
    const herkunft = anfrage.headers.get('Origin') || '';
    const kopf = {
      'Access-Control-Allow-Origin': ERLAUBT.includes(herkunft) ? herkunft : ERLAUBT[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    };
    if (anfrage.method === 'OPTIONS') return new Response(null, { headers: kopf });
    if (anfrage.method !== 'POST') return fehler('Nur POST.', 405, kopf);

    let adresse;
    try { adresse = (await anfrage.json()).url; } catch { return fehler('Keine Adresse übergeben.', 400, kopf); }

    const ziel = pruefeAdresse(adresse);
    if (ziel.fehler) return fehler(ziel.fehler, 400, kopf);

    let antwort, html;
    try {
      antwort = await fetch(ziel.url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(ZEITGRENZE),
        headers: { 'User-Agent': 'AllywerkKurzcheck/1.0 (+https://allywerk.de/check)' },
      });
      const typ = antwort.headers.get('content-type') || '';
      if (!typ.includes('text/html')) return fehler('Unter dieser Adresse liegt keine Webseite.', 400, kopf);
      html = (await antwort.text()).slice(0, MAX_BYTES);
    } catch (e) {
      return fehler('Die Seite war nicht erreichbar. Stimmt die Adresse?', 502, kopf);
    }
    if (!antwort.ok) return fehler(`Die Seite antwortet mit Fehler ${antwort.status}.`, 502, kopf);

    const ergebnis = kurzcheck(html, antwort.url);
    return new Response(JSON.stringify({ geprueft: antwort.url, ...ergebnis }), { headers: kopf });
  },
};

const fehler = (text, code, kopf) =>
  new Response(JSON.stringify({ fehler: text }), { status: code, headers: kopf });

/* Adresse prüfen. Private Netze sind gesperrt – Cloudflare routet dorthin
   zwar ohnehin nicht, aber darauf allein will ich mich nicht verlassen. */
function pruefeAdresse(roh) {
  if (typeof roh !== 'string' || !roh.trim()) return { fehler: 'Bitte eine Adresse eingeben.' };
  let s = roh.trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { return { fehler: 'Das sieht nicht nach einer Internetadresse aus.' }; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return { fehler: 'Nur http und https.' };
  const h = u.hostname.toLowerCase();
  const gesperrt =
    h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') ||
    h === '0.0.0.0' || h === '[::1]' ||
    /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) || /^169\.254\./.test(h) ||
    !h.includes('.');
  if (gesperrt) return { fehler: 'Diese Adresse lässt sich nicht von außen prüfen.' };
  return { url: u.toString() };
}

/* Die acht Kernpunkte. */
export function kurzcheck(h, url) {
  const hol = (re) => { const m = h.match(re); return m ? m[1].trim() : null; };
  const alle = (re) => [...h.matchAll(re)];
  const p = [];
  const setze = (ampel) => (id, titel, info, wcag) => p.push({ id, titel, info, wcag: wcag || null, ampel });
  const gruen = setze('gruen'), gelb = setze('gelb'), rot = setze('rot');

  const lang = hol(/<html[^>]*\slang=["']([^"']+)["']/i);
  lang ? gruen('lang', 'Seitensprache gesetzt', `lang="${lang}"`)
       : rot('lang', 'Seitensprache fehlt', 'Screenreader lesen die Seite sonst in der falschen Sprache vor.', '3.1.1 (A)');

  const titel = hol(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titel) rot('titel', 'Seitentitel fehlt', 'Der Titel steht im Browsertab und in der Google-Trefferliste.', '2.4.2 (A)');
  else if (titel.length > 60) gelb('titel', 'Seitentitel ist lang', `${titel.length} Zeichen – Google kürzt bei etwa 60.`);
  else gruen('titel', 'Seitentitel vorhanden', `${titel.length} Zeichen`);

  const besch = hol(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  besch ? gruen('beschreibung', 'Meta-Beschreibung vorhanden', `${besch.length} Zeichen`)
        : gelb('beschreibung', 'Meta-Beschreibung fehlt', 'Google zeigt sie unter dem Titel; ohne sie entscheidet Google selbst.');

  const bilder = alle(/<img\b[^>]*>/gi).map((m) => m[0]).filter((t) => !/\brole=["']presentation["']/i.test(t));
  const ohne = bilder.filter((t) => !/\salt\s*=/i.test(t));
  if (!bilder.length && /<svg[\s>]/i.test(h))
    gruen('alt', 'Keine Bilddateien, nur eingebettete Grafiken', 'SVG im Quelltext braucht keinen Alternativtext, wenn es rein schmückend ist.');
  else if (!bilder.length) gelb('alt', 'Keine Bilder im Quelltext', 'Entweder gibt es keine, oder sie werden per Skript nachgeladen.');
  else if (ohne.length) rot('alt', 'Bilder ohne Alternativtext', `${ohne.length} von ${bilder.length}. Screenreader lesen dann den Dateinamen vor.`, '1.1.1 (A)');
  else gruen('alt', 'Alle Bilder haben einen Alternativtext', `${bilder.length} von ${bilder.length}`);

  const u = alle(/<h([1-6])\b[^>]*>/gi).map((m) => +m[1]);
  const h1 = u.filter((n) => n === 1).length;
  let spruenge = 0, vorher = 0;
  for (const n of u) { if (vorher && n > vorher + 1) spruenge++; vorher = n; }
  if (!u.length) rot('ueberschriften', 'Keine Überschriften gefunden', 'Ohne Überschriften kann niemand die Seite überfliegen.', '1.3.1 (A)');
  else if (!h1) rot('ueberschriften', 'Keine Hauptüberschrift (h1)', 'Screenreader springen zuerst zur h1. Fehlt sie, fehlt der Einstieg.', '1.3.1 (A)');
  else if (h1 > 1) gelb('ueberschriften', `${h1} Hauptüberschriften`, 'Üblich ist genau eine h1 je Seite.');
  else if (spruenge) gelb('ueberschriften', 'Überschriftenebenen übersprungen', `${spruenge}× – etwa h2 direkt auf h4.`);
  else gruen('ueberschriften', 'Überschriftenstruktur sauber', `${u.length} Überschriften, eine h1, keine Sprünge`);

  const felder = alle(/<(input|select|textarea)\b[^>]*>/gi).map((m) => m[0])
    .filter((t) => !/type=["'](hidden|submit|button|image|reset)["']/i.test(t));
  const ids = new Set(alle(/<label[^>]*\sfor=["']([^"']+)["']/gi).map((m) => m[1]));
  const nackt = felder.filter((t) => {
    const id = (t.match(/\sid=["']([^"']+)["']/i) || [])[1];
    return !(id && ids.has(id)) && !/aria-label|aria-labelledby|\btitle=/i.test(t);
  });
  if (!felder.length) gruen('labels', 'Keine Formularfelder auf der Startseite', '—');
  else if (nackt.length) rot('labels', 'Formularfelder ohne Beschriftung', `${nackt.length} von ${felder.length}. Screenreader sagen dann nur „Eingabefeld“.`, '3.3.2 (A)');
  else gruen('labels', 'Alle Formularfelder beschriftet', `${felder.length} von ${felder.length}`);

  const impr = /impressum|imprint/i.test(h), dsgv = /datenschutz|privacy/i.test(h);
  if (impr && dsgv) gruen('recht', 'Impressum und Datenschutz verlinkt', '—');
  else rot('recht', 'Pflichtangaben fehlen',
    `${!impr ? 'Impressum' : ''}${!impr && !dsgv ? ' und ' : ''}${!dsgv ? 'Datenschutzerklärung' : ''} nicht gefunden. Pflicht nach § 5 DDG.`);

  url.startsWith('https://') ? gruen('https', 'Verschlüsselt übertragen', 'HTTPS')
                             : rot('https', 'Keine Verschlüsselung', 'Browser warnen Besucher bei unverschlüsselten Seiten.');

  const rote = p.filter((x) => x.ampel === 'rot').length;
  const gelbe = p.filter((x) => x.ampel === 'gelb').length;
  return { punkte: p, note: rote ? 'rot' : gelbe ? 'gelb' : 'gruen', rote, gelbe, zeitpunkt: new Date().toISOString() };
}
