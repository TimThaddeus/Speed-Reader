# Speed Reader App - Projektstand

## Links
- **Live:** https://speed-reader-tim.netlify.app
- **GitHub:** https://github.com/TimThaddeus/Speed-Reader
- **Lokal:** `/home/tim/Speed-Reader`

## Fertig implementiert

### Core Features
- RSVP Speed Reading (Wörter einzeln anzeigen)
- Geschwindigkeit: 100-1000 WPM
- ORP Fokuspunkt (roter Buchstabe)
- Pausen: Satzende (0-1s), Kapitel (0-5s)
- Lange Wörter verlangsamen (0-100ms, ab X Zeichen)

### Navigation
- Play/Pause, Vor/Zurück, 10er Sprünge
- Keyboard: Space, Pfeiltasten
- Klickbarer Fortschrittsbalken

### Input
- Textfeld (manuell)
- Dateien: PDF, EPUB, TXT, DOCX
- OCR: Bild scannen (Tesseract.js)

### UI/UX
- Deutsch/Englisch
- Light/Dark Mode
- Hasen-Logo (Header + PWA Icons)

### Deployment
- PWA (installierbar)
- Netlify Hosting
- Auto-Deploy bei GitHub Push

## Noch offen

| Feature | Benötigt |
|---------|----------|
| Handschrift-Erkennung | Claude API-Key |

## Repo-Struktur

```
Speed-Reader/
├── index.html          # HTML-Struktur
├── manifest.json       # PWA-Config
├── css/
│   └── styles.css      # Alle Styles
├── js/
│   ├── app.js          # Hauptlogik & Events
│   ├── state.js        # Zentrales State-Management
│   ├── reader.js       # RSVP Reader Engine
│   ├── parsers.js      # PDF/EPUB/DOCX/OCR Parser
│   └── i18n.js         # Übersetzungen (DE/EN)
├── icon-192.png        # Hasen-Icon
├── icon-512.png        # Hasen-Icon
├── logo.png            # Header-Logo
└── README.md           # Doku
```

## Workflow

```bash
# Änderungen pushen:
cd /home/tim/Speed-Reader
git add .
git commit -m "Beschreibung"
git push
# → Netlify deployed automatisch
```

---

**Kopiere das in den nächsten Chat und sag was du brauchst!**
