/**
 * Centralized State Management for Speed Reader
 */

export const state = {
    // Reader state
    words: [],
    currentIndex: 0,
    isPlaying: false,
    timeoutId: null,

    // Settings
    wpm: 500,
    chapterPause: 2,
    sentencePause: 0.3,
    highlightCenter: true,
    longWordBonus: 40,
    longWordThreshold: 5,
    fontSize: 150,

    // UI state
    currentLang: 'de',
    currentTheme: 'dark',

    // Object URLs for cleanup (memory leak prevention)
    activeObjectUrls: []
};

/**
 * Create and track an object URL for later cleanup
 */
export function createTrackedObjectUrl(blob) {
    const url = URL.createObjectURL(blob);
    state.activeObjectUrls.push(url);
    return url;
}

/**
 * Revoke all tracked object URLs to prevent memory leaks
 */
export function cleanupObjectUrls() {
    state.activeObjectUrls.forEach(url => {
        URL.revokeObjectURL(url);
    });
    state.activeObjectUrls = [];
}

/**
 * Revoke a specific object URL
 */
export function revokeObjectUrl(url) {
    const index = state.activeObjectUrls.indexOf(url);
    if (index > -1) {
        URL.revokeObjectURL(url);
        state.activeObjectUrls.splice(index, 1);
    }
}

/**
 * Reset reader state (when going back to input screen)
 */
export function resetReaderState() {
    state.words = [];
    state.currentIndex = 0;
    state.isPlaying = false;
    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
    }
}

/**
 * Load saved settings from localStorage
 */
export function loadSavedSettings() {
    const savedTheme = localStorage.getItem('speedreader-theme');
    if (savedTheme) {
        state.currentTheme = savedTheme;
    }

    const savedLang = localStorage.getItem('speedreader-lang');
    if (savedLang) {
        state.currentLang = savedLang;
    }
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme) {
    state.currentTheme = theme;
    localStorage.setItem('speedreader-theme', theme);
}

/**
 * Save language to localStorage
 */
export function saveLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('speedreader-lang', lang);
}
