/**
 * Internationalization (i18n) for Speed Reader
 */

export const translations = {
    de: {
        title: 'Speed Reader',
        subtitle: 'RSVP-Technik für schnelleres Lesen',
        placeholder: 'Füge hier deinen Text ein...\n\nDu kannst ganze Bücher, Artikel oder beliebige Texte einfügen. Kapitel werden automatisch erkannt.',
        settings: 'Einstellungen',
        speed: 'Geschwindigkeit',
        chapterPause: 'Pause bei Kapitel',
        sentencePause: 'Pause bei Satzende',
        longWordBonus: 'Lange Wörter verlangsamen',
        longWordThreshold: 'Lange Wörter ab',
        chars: 'Zeichen',
        highlight: 'Fokuspunkt hervorheben',
        fontSize: 'Schriftgröße',
        start: '▶ Lesen starten',
        back: '← Zurück',
        ready: 'Bereit',
        newChapter: '📖 Neues Kapitel',
        hintPlayPause: 'Play/Pause',
        hintBack: 'Zurück',
        hintForward: 'Vorwärts',
        hintFaster: 'Schneller',
        hintSlower: 'Langsamer',
        tabText: 'Text einfügen',
        tabFile: 'Datei öffnen',
        tabOCR: 'Bild scannen',
        ocrLang: 'Textsprache:',
        uploadText: 'Bild hierher ziehen oder klicken',
        uploadHint: 'JPG, PNG, WebP – oder Kamera nutzen',
        fileUploadText: 'Datei hierher ziehen oder klicken',
        fileUploadHint: 'PDF, EPUB, TXT, DOCX werden unterstützt',
        chooseFile: 'Datei wählen',
        chooseImage: 'Bild wählen',
        takePhoto: 'Foto aufnehmen',
        newScan: '← Neues Bild',
        ocrLoading: 'Text wird erkannt...',
        ocrInit: 'OCR wird initialisiert...',
        ocrRecognizing: 'Text wird gelesen...',
        fileLoading: 'Datei wird geladen...',
        fileExtracting: 'Text wird extrahiert...',
        copyText: 'Text kopieren',
        editText: 'Bearbeiten',
        readNow: 'Jetzt lesen',
        copied: '✓ Kopiert!',
        galleryHintText: 'Nach unten wischen für Kamera',
        galleryHintSubtext: 'oder wähle ein Foto aus deiner Galerie',
        errorPdf: 'Fehler beim Lesen der PDF',
        errorEpub: 'Fehler beim Lesen der EPUB',
        errorDocx: 'Fehler beim Lesen der DOCX',
        errorFile: 'Dateiformat nicht unterstützt',
        errorFileTooLarge: 'Datei zu groß (max. 50MB)'
    },
    en: {
        title: 'Speed Reader',
        subtitle: 'RSVP technique for faster reading',
        placeholder: 'Paste your text here...\n\nYou can paste entire books, articles, or any text. Chapters are automatically detected.',
        settings: 'Settings',
        speed: 'Speed',
        chapterPause: 'Chapter pause',
        sentencePause: 'Sentence pause',
        longWordBonus: 'Slow down long words',
        longWordThreshold: 'Long words from',
        chars: 'chars',
        highlight: 'Highlight focus point',
        fontSize: 'Font size',
        start: '▶ Start reading',
        back: '← Back',
        ready: 'Ready',
        newChapter: '📖 New Chapter',
        hintPlayPause: 'Play/Pause',
        hintBack: 'Back',
        hintForward: 'Forward',
        hintFaster: 'Faster',
        hintSlower: 'Slower',
        tabText: 'Paste text',
        tabFile: 'Open file',
        tabOCR: 'Scan image',
        ocrLang: 'Text language:',
        uploadText: 'Drag image here or click',
        uploadHint: 'JPG, PNG, WebP – or use camera',
        fileUploadText: 'Drag file here or click',
        fileUploadHint: 'PDF, EPUB, TXT, DOCX supported',
        chooseFile: 'Choose file',
        chooseImage: 'Choose image',
        takePhoto: 'Take photo',
        newScan: '← New image',
        ocrLoading: 'Recognizing text...',
        ocrInit: 'Initializing OCR...',
        ocrRecognizing: 'Reading text...',
        fileLoading: 'Loading file...',
        fileExtracting: 'Extracting text...',
        copyText: 'Copy text',
        editText: 'Edit',
        readNow: 'Read now',
        copied: '✓ Copied!',
        galleryHintText: 'Swipe down for camera',
        galleryHintSubtext: 'or select a photo from your gallery',
        errorPdf: 'Error reading PDF',
        errorEpub: 'Error reading EPUB',
        errorDocx: 'Error reading DOCX',
        errorFile: 'File format not supported',
        errorFileTooLarge: 'File too large (max. 50MB)'
    }
};

/**
 * Get translation for a key
 */
export function t(key, lang) {
    return translations[lang]?.[key] || translations['de'][key] || key;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key, lang);
        if (translation) {
            el.textContent = translation;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = t(key, lang);
        if (translation) {
            el.placeholder = translation;
        }
    });

    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}
