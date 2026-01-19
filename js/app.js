/**
 * Speed Reader - Main Application
 */

import { state, createTrackedObjectUrl, cleanupObjectUrls, revokeObjectUrl, loadSavedSettings, saveTheme, saveLanguage } from './state.js';
import { translations, t, applyTranslations } from './i18n.js';
import { processFile, processImageOcr, validateFileSize } from './parsers.js';
import { initReader, formatWordWithOrp, play, stop, togglePlay, navigate, jumpToPosition, adjustSpeed, getProgress, getCurrentWord } from './reader.js';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// DOM Elements
const elements = {};

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements.inputScreen = document.getElementById('input-screen');
    elements.readerScreen = document.getElementById('reader-screen');
    elements.textInput = document.getElementById('text-input');
    elements.startBtn = document.getElementById('start-btn');
    elements.backBtn = document.getElementById('back-btn');
    elements.wordDisplay = document.getElementById('word-display');
    elements.chapterIndicator = document.getElementById('chapter-indicator');
    elements.progressFill = document.getElementById('progress-fill');
    elements.progressBar = document.getElementById('progress-bar');
    elements.playPauseBtn = document.getElementById('play-pause-btn');
    elements.prevBtn = document.getElementById('prev-btn');
    elements.nextBtn = document.getElementById('next-btn');
    elements.jumpBackBtn = document.getElementById('jump-back-btn');
    elements.jumpForwardBtn = document.getElementById('jump-forward-btn');
    elements.wordCounter = document.getElementById('word-counter');
    elements.currentWpmDisplay = document.getElementById('current-wpm');
    elements.speedUp = document.getElementById('speed-up');
    elements.speedDown = document.getElementById('speed-down');
    elements.toast = document.getElementById('toast');

    // Sliders
    elements.wpmSlider = document.getElementById('wpm-slider');
    elements.wpmValue = document.getElementById('wpm-value');
    elements.chapterPauseSlider = document.getElementById('chapter-pause-slider');
    elements.chapterPauseValue = document.getElementById('chapter-pause-value');
    elements.sentencePauseSlider = document.getElementById('sentence-pause-slider');
    elements.sentencePauseValue = document.getElementById('sentence-pause-value');
    elements.longWordSlider = document.getElementById('long-word-slider');
    elements.longWordValue = document.getElementById('long-word-value');
    elements.longWordThresholdSlider = document.getElementById('long-word-threshold-slider');
    elements.longWordThresholdValue = document.getElementById('long-word-threshold-value');
    elements.highlightCenterCheck = document.getElementById('highlight-center');

    // File upload
    elements.fileUploadZone = document.getElementById('file-upload-zone');
    elements.docInput = document.getElementById('doc-input');
    elements.chooseDocBtn = document.getElementById('choose-doc-btn');
    elements.fileProgress = document.getElementById('file-progress');
    elements.fileProgressFill = document.getElementById('file-progress-fill');
    elements.fileStatus = document.getElementById('file-status');
    elements.fileResult = document.getElementById('file-result');
    elements.fileTextOutput = document.getElementById('file-text-output');
    elements.copyFileBtn = document.getElementById('copy-file-btn');
    elements.editFileBtn = document.getElementById('edit-file-btn');
    elements.readFileBtn = document.getElementById('read-file-btn');

    // OCR
    elements.uploadZone = document.getElementById('upload-zone');
    elements.fileInput = document.getElementById('file-input');
    elements.cameraInput = document.getElementById('camera-input');
    elements.chooseFileBtn = document.getElementById('choose-file-btn');
    elements.cameraBtn = document.getElementById('camera-btn');
    elements.previewContainer = document.getElementById('preview-container');
    elements.imagePreview = document.getElementById('image-preview');
    elements.ocrProgress = document.getElementById('ocr-progress');
    elements.ocrProgressFill = document.getElementById('ocr-progress-fill');
    elements.ocrStatus = document.getElementById('ocr-status');
    elements.ocrResult = document.getElementById('ocr-result');
    elements.ocrTextOutput = document.getElementById('ocr-text-output');
    elements.copyOcrBtn = document.getElementById('copy-ocr-btn');
    elements.editOcrBtn = document.getElementById('edit-ocr-btn');
    elements.readOcrBtn = document.getElementById('read-ocr-btn');
    elements.newScanBtn = document.getElementById('new-scan-btn');
    elements.ocrLangSelect = document.getElementById('ocr-lang');
    elements.galleryHint = document.getElementById('gallery-hint');
}

/**
 * Show toast notification
 */
function showToast(message, duration = 2000) {
    elements.toast.textContent = message;
    elements.toast.classList.add('visible');
    setTimeout(() => elements.toast.classList.remove('visible'), duration);
}

/**
 * Display current word
 */
function displayWord() {
    const wordObj = getCurrentWord();
    if (!wordObj) return;

    const formatted = formatWordWithOrp(wordObj.text, state.highlightCenter);
    elements.wordDisplay.innerHTML = formatted.html;

    // Animation
    elements.wordDisplay.classList.remove('animate');
    void elements.wordDisplay.offsetWidth;
    elements.wordDisplay.classList.add('animate');

    // Chapter indicator
    if (wordObj.isChapter) {
        elements.chapterIndicator.textContent = t('newChapter', state.currentLang);
        elements.chapterIndicator.classList.add('visible');
        setTimeout(() => elements.chapterIndicator.classList.remove('visible'), 1500);
    }

    // Update counter
    elements.wordCounter.textContent = `${state.currentIndex + 1} / ${state.words.length}`;
}

/**
 * Update progress bar
 */
function updateProgress() {
    elements.progressFill.style.width = `${getProgress()}%`;
}

/**
 * Update UI after word change
 */
function onWordChange() {
    displayWord();
    updateProgress();
}

/**
 * Start reading
 */
function startReading() {
    const text = elements.textInput.value.trim();
    if (!text) return;

    initReader(text);

    elements.inputScreen.classList.remove('active');
    elements.readerScreen.classList.add('active');

    displayWord();
    updateProgress();
    elements.playPauseBtn.textContent = '▶';
}

/**
 * Go back to input screen
 */
function goBack() {
    stop();
    elements.playPauseBtn.textContent = '▶';
    elements.readerScreen.classList.remove('active');
    elements.inputScreen.classList.add('active');

    // Cleanup object URLs when leaving reader
    cleanupObjectUrls();
}

/**
 * Handle play/pause toggle
 */
function handleTogglePlay() {
    const isPlaying = togglePlay(onWordChange, () => {
        elements.playPauseBtn.textContent = '▶';
    });
    elements.playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
}

/**
 * Handle navigation
 */
function handleNavigate(delta) {
    const wasPlaying = navigate(delta);
    onWordChange();
    if (wasPlaying) {
        play(onWordChange, () => {
            elements.playPauseBtn.textContent = '▶';
        });
    }
}

/**
 * Handle speed adjustment
 */
function handleSpeedAdjust(delta) {
    const newWpm = adjustSpeed(delta);
    elements.currentWpmDisplay.textContent = newWpm;
    elements.wpmSlider.value = newWpm;
    elements.wpmValue.textContent = newWpm;
}

/**
 * Handle keyboard controls
 */
function handleKeyboard(e) {
    if (!elements.readerScreen.classList.contains('active')) return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            handleTogglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            handleNavigate(e.shiftKey ? -10 : -1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            handleNavigate(e.shiftKey ? 10 : 1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            handleSpeedAdjust(25);
            break;
        case 'ArrowDown':
            e.preventDefault();
            handleSpeedAdjust(-25);
            break;
        case 'Escape':
            goBack();
            break;
    }
}

/**
 * Handle file upload
 */
async function handleFileUpload(file) {
    // Validate file size first
    if (!validateFileSize(file)) {
        showToast(t('errorFileTooLarge', state.currentLang));
        return;
    }

    elements.fileUploadZone.style.display = 'none';
    elements.fileProgress.classList.add('active');
    elements.fileResult.classList.remove('active');
    elements.fileProgressFill.style.width = '0%';
    elements.fileStatus.textContent = t('fileLoading', state.currentLang);

    try {
        const text = await processFile(
            file,
            (progress) => {
                elements.fileProgressFill.style.width = `${progress}%`;
                elements.fileStatus.textContent = `${t('fileExtracting', state.currentLang)} ${progress}%`;
            },
            state.currentLang,
            translations
        );

        elements.fileProgress.classList.remove('active');
        elements.fileResult.classList.add('active');
        elements.fileTextOutput.textContent = text.trim();

    } catch (error) {
        console.error('File error:', error);
        elements.fileStatus.textContent = error.message;
        elements.fileProgressFill.style.width = '0%';
    }
}

/**
 * Handle OCR image processing
 */
async function handleImageOcr(file) {
    // Create tracked URL for cleanup
    const url = createTrackedObjectUrl(file);
    elements.imagePreview.src = url;
    elements.uploadZone.style.display = 'none';
    elements.previewContainer.classList.add('active');
    elements.ocrProgress.classList.add('active');
    elements.ocrResult.classList.remove('active');

    const lang = elements.ocrLangSelect.value;

    try {
        const text = await processImageOcr(
            file,
            lang,
            (status, percent) => {
                if (status === 'recognizing') {
                    elements.ocrProgressFill.style.width = `${percent}%`;
                    elements.ocrStatus.textContent = `${t('ocrRecognizing', state.currentLang)} ${percent}%`;
                } else if (status === 'loading') {
                    elements.ocrStatus.textContent = t('ocrInit', state.currentLang);
                }
            },
            (percent) => {
                elements.ocrProgressFill.style.width = `${percent}%`;
            }
        );

        elements.ocrProgress.classList.remove('active');
        elements.ocrResult.classList.add('active');
        elements.ocrTextOutput.textContent = text;

    } catch (error) {
        console.error('OCR Error:', error);
        elements.ocrStatus.textContent = 'Error: ' + error.message;
    }
}

/**
 * Reset file upload UI
 */
function resetFileUpload() {
    elements.fileUploadZone.style.display = 'block';
    elements.fileProgress.classList.remove('active');
    elements.fileResult.classList.remove('active');
    elements.docInput.value = '';
}

/**
 * Reset OCR UI
 */
function resetOcrUpload() {
    // Cleanup old object URL
    if (elements.imagePreview.src.startsWith('blob:')) {
        revokeObjectUrl(elements.imagePreview.src);
    }

    elements.uploadZone.style.display = 'block';
    elements.previewContainer.classList.remove('active');
    elements.ocrProgress.classList.remove('active');
    elements.ocrResult.classList.remove('active');
    elements.ocrProgressFill.style.width = '0%';
    elements.fileInput.value = '';
    elements.cameraInput.value = '';
}

/**
 * Set theme
 */
function setTheme(theme) {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);

    const icon = theme === 'light' ? '🌙' : '☀️';
    document.querySelectorAll('.theme-icon').forEach(el => {
        el.textContent = icon;
    });
}

/**
 * Toggle theme
 */
function toggleTheme() {
    setTheme(state.currentTheme === 'dark' ? 'light' : 'dark');
}

/**
 * Set language
 */
function setLanguage(lang) {
    saveLanguage(lang);
    applyTranslations(lang);
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // Sliders
    elements.wpmSlider.addEventListener('input', () => {
        state.wpm = parseInt(elements.wpmSlider.value);
        elements.wpmValue.textContent = state.wpm;
        elements.currentWpmDisplay.textContent = state.wpm;
    });

    elements.chapterPauseSlider.addEventListener('input', () => {
        state.chapterPause = parseFloat(elements.chapterPauseSlider.value);
        elements.chapterPauseValue.textContent = state.chapterPause;
    });

    elements.sentencePauseSlider.addEventListener('input', () => {
        state.sentencePause = parseFloat(elements.sentencePauseSlider.value);
        elements.sentencePauseValue.textContent = state.sentencePause;
    });

    elements.longWordSlider.addEventListener('input', () => {
        state.longWordBonus = parseInt(elements.longWordSlider.value);
        elements.longWordValue.textContent = state.longWordBonus;
    });

    elements.longWordThresholdSlider.addEventListener('input', () => {
        state.longWordThreshold = parseInt(elements.longWordThresholdSlider.value);
        elements.longWordThresholdValue.textContent = state.longWordThreshold;
    });

    elements.highlightCenterCheck.addEventListener('change', () => {
        state.highlightCenter = elements.highlightCenterCheck.checked;
        if (!state.isPlaying && state.words.length > 0) displayWord();
    });

    // Text input
    elements.textInput.addEventListener('input', () => {
        elements.startBtn.disabled = elements.textInput.value.trim().length === 0;
    });

    // Main buttons
    elements.startBtn.addEventListener('click', startReading);
    elements.backBtn.addEventListener('click', goBack);

    // Playback controls
    elements.playPauseBtn.addEventListener('click', handleTogglePlay);
    elements.prevBtn.addEventListener('click', () => handleNavigate(-1));
    elements.nextBtn.addEventListener('click', () => handleNavigate(1));
    elements.jumpBackBtn.addEventListener('click', () => handleNavigate(-10));
    elements.jumpForwardBtn.addEventListener('click', () => handleNavigate(10));

    // Speed controls
    elements.speedUp.addEventListener('click', () => handleSpeedAdjust(25));
    elements.speedDown.addEventListener('click', () => handleSpeedAdjust(-25));

    // Progress bar click
    elements.progressBar.addEventListener('click', (e) => {
        const rect = elements.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        jumpToPosition(percent);
        onWordChange();
    });

    // Keyboard
    document.addEventListener('keydown', handleKeyboard);

    // File upload
    elements.chooseDocBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.docInput.click();
    });

    elements.fileUploadZone.addEventListener('click', () => elements.docInput.click());

    elements.fileUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.fileUploadZone.classList.add('dragover');
    });

    elements.fileUploadZone.addEventListener('dragleave', () => {
        elements.fileUploadZone.classList.remove('dragover');
    });

    elements.fileUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.fileUploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    });

    elements.docInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFileUpload(e.target.files[0]);
    });

    // File result buttons
    elements.copyFileBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.fileTextOutput.textContent);
        showToast(t('copied', state.currentLang));
    });

    elements.editFileBtn.addEventListener('click', () => {
        elements.textInput.value = elements.fileTextOutput.textContent;
        elements.startBtn.disabled = false;
        document.querySelector('[data-tab="text"]').click();
    });

    elements.readFileBtn.addEventListener('click', () => {
        elements.textInput.value = elements.fileTextOutput.textContent;
        startReading();
    });

    // OCR
    elements.chooseFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.fileInput.click();
    });

    elements.cameraBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.galleryHint.classList.add('visible');
        elements.cameraInput.click();
    });

    window.addEventListener('focus', () => {
        elements.galleryHint.classList.remove('visible');
    });

    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());

    elements.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadZone.classList.add('dragover');
    });

    elements.uploadZone.addEventListener('dragleave', () => {
        elements.uploadZone.classList.remove('dragover');
    });

    elements.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageOcr(file);
        }
    });

    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleImageOcr(e.target.files[0]);
    });

    elements.cameraInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleImageOcr(e.target.files[0]);
    });

    elements.newScanBtn.addEventListener('click', resetOcrUpload);

    elements.copyOcrBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.ocrTextOutput.textContent);
        showToast(t('copied', state.currentLang));
    });

    elements.editOcrBtn.addEventListener('click', () => {
        elements.textInput.value = elements.ocrTextOutput.textContent;
        elements.startBtn.disabled = false;
        document.querySelector('[data-tab="text"]').click();
    });

    elements.readOcrBtn.addEventListener('click', () => {
        elements.textInput.value = elements.ocrTextOutput.textContent;
        startReading();
    });

    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Language toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });
}

/**
 * Initialize application
 */
function init() {
    cacheElements();
    loadSavedSettings();
    initEventListeners();

    // Apply saved settings
    setTheme(state.currentTheme);
    applyTranslations(state.currentLang);
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
