# Speed Reader App

## Links
- **Live:** https://speed-reader-tim.netlify.app
- **GitHub:** https://github.com/TimThaddeus/Speed-Reader

---

## Changelog

### v1.1 (21.01.2026)

**ORP (Fokuspunkt) verbessert:**
- Vorher: Feste Position bei 30-40% des Wortes
- Jetzt: Wortlängenabhängig (basierend auf Leseforschung)
  - 1-2 Zeichen → 1. Buchstabe
  - 3-6 Zeichen → 2. Buchstabe
  - 7-9 Zeichen → 3. Buchstabe
  - 10+ Zeichen → 4. Buchstabe
- **Warum:** Forschung zeigt, dass der optimale Fokuspunkt je nach Wortlänge variiert

**Fokuspunkt fixiert:**
- Vorher: Roter Buchstabe sprang je nach Wort hin und her
- Jetzt: Fokuspunkt bleibt immer in der Bildschirmmitte, Wort bewegt sich drum herum
- **Warum:** Auge muss nicht mehr wandern, flüssigeres Lesen

**Schriftgröße einstellbar:**
- Neuer Slider (25-200%)
- A+/A- Buttons während dem Lesen
- Auto-Skalierung: Lange Wörter werden automatisch kleiner, damit sie passen
- **Warum:** Flexibilität für verschiedene Bildschirmgrößen und Vorlieben

**Neue Standardeinstellungen:**
- 500 WPM (vorher 300)
- Lange Wörter: 40ms ab 5 Zeichen (vorher 10ms ab 8)
- Schriftgröße: 150% (vorher 100%)

---

## Features

### Core
- RSVP Speed Reading (Wörter einzeln anzeigen)
- Geschwindigkeit: 100-1000 WPM
- Intelligenter ORP Fokuspunkt (roter Buchstabe)
- Pausen: Satzende (0-1s), Kapitel (0-5s)
- Lange Wörter verlangsamen (0-100ms, ab X Zeichen)
- Einstellbare Schriftgröße mit Auto-Skalierung

### Navigation
- Play/Pause, Vor/Zurück, 10er Sprünge
- Keyboard: Space, Pfeiltasten
- Klickbarer Fortschrittsbalken
- Schriftgröße während Lesen anpassbar (A+/A-)

### Input
- Textfeld (manuell)
- Dateien: PDF, EPUB, TXT, DOCX
- OCR: Bild scannen (Tesseract.js)

### UI/UX
- Deutsch/Englisch
- Light/Dark Mode
- PWA (installierbar)
- Responsive (Desktop + Mobile)

---

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
└── README.md
```

---

## Noch offen

| Feature | Status |
|---------|--------|
| Handschrift-Erkennung | Benötigt Claude API-Key |
