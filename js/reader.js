/**
 * RSVP Speed Reader Engine
 */

import { state } from './state.js';

// Chapter detection patterns
const chapterPatterns = [
    /^kapitel\s+\d+/i,
    /^chapter\s+\d+/i,
    /^teil\s+\d+/i,
    /^part\s+\d+/i,
    /^abschnitt\s+\d+/i,
    /^section\s+\d+/i,
    /^\d+\.\s*kapitel/i,
    /^[IVX]+\./,
    /^prologue?$/i,
    /^epilogue?$/i,
    /^einleitung$/i,
    /^fazit$/i
];

/**
 * Parse text into word objects with metadata
 */
export function parseText(text) {
    const rawWords = text.split(/\s+/).filter(w => w.length > 0);

    return rawWords.map((word, index) => {
        const lookAhead = rawWords.slice(index, index + 3).join(' ');
        const isChapter = chapterPatterns.some(pattern => pattern.test(lookAhead));
        const isSentenceEnd = /[.!?]$/.test(word);

        return {
            text: word,
            isChapter,
            isSentenceEnd
        };
    });
}

/**
 * Calculate ORP (Optimal Recognition Point) index
 * ~40% for better centering in RSVP display
 */
export function getOrpIndex(wordLength) {
    return Math.floor(wordLength * 0.4);
}

/**
 * Format word with highlighted ORP character
 * Returns 3 spans: before, highlight (fixed center), after
 */
export function formatWordWithOrp(word, highlight = true) {
    if (!highlight || word.length <= 1) {
        return {
            html: `<span class="orp-before"></span><span class="orp-center">${escapeHtml(word)}</span><span class="orp-after"></span>`,
            plain: word
        };
    }

    const orpIndex = getOrpIndex(word.length);
    const before = escapeHtml(word.slice(0, orpIndex));
    const highlightChar = escapeHtml(word[orpIndex]);
    const after = escapeHtml(word.slice(orpIndex + 1));

    return {
        html: `<span class="orp-before">${before}</span><span class="orp-center highlight">${highlightChar}</span><span class="orp-after">${after}</span>`,
        plain: word
    };
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Calculate delay for current word
 */
export function getDelay() {
    const baseDelay = 60000 / state.wpm;
    const wordObj = state.words[state.currentIndex];

    if (!wordObj) return baseDelay;

    // Chapter pause
    if (wordObj.isChapter && state.chapterPause > 0) {
        return baseDelay + (state.chapterPause * 1000);
    }

    // Sentence end pause
    if (wordObj.isSentenceEnd && state.sentencePause > 0) {
        return baseDelay + (state.sentencePause * 1000);
    }

    // Long word bonus
    const wordLength = wordObj.text.length;
    const lengthBonus = wordLength > state.longWordThreshold
        ? (wordLength - state.longWordThreshold) * state.longWordBonus
        : 0;

    return baseDelay + lengthBonus;
}

/**
 * Start reading playback
 */
export function play(onWordChange, onComplete) {
    if (state.currentIndex >= state.words.length - 1) {
        stop();
        onComplete?.();
        return;
    }

    state.isPlaying = true;

    const advance = () => {
        if (!state.isPlaying) return;

        state.currentIndex++;
        if (state.currentIndex >= state.words.length) {
            stop();
            onComplete?.();
            return;
        }

        onWordChange();
        state.timeoutId = setTimeout(advance, getDelay());
    };

    state.timeoutId = setTimeout(advance, getDelay());
}

/**
 * Stop reading playback
 */
export function stop() {
    state.isPlaying = false;
    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
    }
}

/**
 * Toggle play/pause
 */
export function togglePlay(onWordChange, onComplete) {
    if (state.isPlaying) {
        stop();
    } else {
        play(onWordChange, onComplete);
    }
    return state.isPlaying;
}

/**
 * Navigate by delta words
 */
export function navigate(delta) {
    const wasPlaying = state.isPlaying;
    stop();

    state.currentIndex = Math.max(0, Math.min(state.currentIndex + delta, state.words.length - 1));

    return wasPlaying;
}

/**
 * Jump to specific position (0-1 percentage)
 */
export function jumpToPosition(percent) {
    state.currentIndex = Math.floor(percent * state.words.length);
    state.currentIndex = Math.max(0, Math.min(state.currentIndex, state.words.length - 1));
}

/**
 * Adjust reading speed
 */
export function adjustSpeed(delta) {
    state.wpm = Math.max(100, Math.min(1000, state.wpm + delta));
    return state.wpm;
}

/**
 * Get current progress (0-100)
 */
export function getProgress() {
    if (state.words.length === 0) return 0;
    return ((state.currentIndex + 1) / state.words.length) * 100;
}

/**
 * Get current word info
 */
export function getCurrentWord() {
    if (state.words.length === 0 || state.currentIndex >= state.words.length) {
        return null;
    }
    return state.words[state.currentIndex];
}

/**
 * Initialize reader with text
 */
export function initReader(text) {
    state.words = parseText(text);
    state.currentIndex = 0;
    state.isPlaying = false;
}
