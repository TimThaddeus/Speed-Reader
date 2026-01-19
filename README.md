# Speed Reader App

**RSVP Speed Reading Web-App** (Rapid Serial Visual Presentation) - Wörter werden einzeln an derselben Stelle angezeigt für schnelleres Lesen.

## Aktuelle Version
- `speed-reader-9.html`

## Features

### Kernfunktionen
- RSVP Speed Reading - Wörter einzeln anzeigen
- Geschwindigkeit einstellbar: 100-1000 WPM
- ORP Fokuspunkt - Roter Buchstabe für schnellere Erkennung

### Pausen & Timing
- Pause bei Satzende: 0-1s einstellbar
- Pause bei Kapitel: 0-5s einstellbar
- Lange Wörter verlangsamen: ms pro Zeichen + Mindestlänge

### Navigation
- Play/Pause
- Vor/Zurück
- 10er Sprünge
- Klickbarer Fortschrittsbalken

### Keyboard Shortcuts
- Space - Play/Pause
- Pfeiltasten - Navigation

### Text-Input
- Manuell per Textfeld
- Datei-Support: PDF, EPUB, TXT, DOCX
- Bild scannen (OCR) via Tesseract.js

### UI
- Mehrsprachig: Deutsch/Englisch
- Light/Dark Mode Toggle
- PWA-ready

## Dateien

| Datei | Beschreibung |
|-------|--------------|
| `speed-reader-9.html` | Die App |
| `manifest.json` | PWA-Konfiguration |
| `icon-192.png` | Android Homescreen Icon |
| `icon-512.png` | Splash Screen Icon |

## Deployment

1. Alle 4 Dateien in einen Ordner
2. [netlify.com](https://netlify.com) → Sign up → "Add new site" → "Deploy manually"
3. Ordner reinziehen
4. URL erhalten → Im Handy öffnen → "Zum Homescreen hinzufügen"

## Noch offen
- Online stellen auf Netlify
- Handschrift-Erkennung mit Claude Vision (braucht API-Key)
