/**
 * File Parsers for Speed Reader
 * Handles PDF, EPUB, TXT, DOCX extraction
 */

// Max file size: 50MB
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Validate file size
 */
export function validateFileSize(file) {
    return file.size <= MAX_FILE_SIZE;
}

/**
 * Extract text from PDF file
 */
export async function extractPdfText(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + '\n\n';
        onProgress(Math.round((i / totalPages) * 100));
    }

    return text;
}

/**
 * Extract text from EPUB file
 */
export async function extractEpubText(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find content.opf
    let opfPath = '';
    const containerXml = await zip.file('META-INF/container.xml')?.async('text');
    if (containerXml) {
        const match = containerXml.match(/full-path="([^"]+\.opf)"/);
        if (match) opfPath = match[1];
    }

    // Get spine order from OPF
    let spineItems = [];
    if (opfPath) {
        const opfContent = await zip.file(opfPath)?.async('text');
        if (opfContent) {
            const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

            // Parse manifest
            const manifest = {};
            const manifestMatches = opfContent.matchAll(/<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"[^>]*>/g);
            for (const m of manifestMatches) {
                manifest[m[1]] = opfDir + m[2];
            }

            // Parse spine
            const spineMatches = opfContent.matchAll(/<itemref[^>]+idref="([^"]+)"[^>]*>/g);
            for (const m of spineMatches) {
                if (manifest[m[1]]) {
                    spineItems.push(manifest[m[1]]);
                }
            }
        }
    }

    // Fallback: find all HTML/XHTML files
    if (spineItems.length === 0) {
        zip.forEach((path, file) => {
            if (path.match(/\.(x?html?)$/i) && !path.includes('nav')) {
                spineItems.push(path);
            }
        });
        spineItems.sort();
    }

    let text = '';
    let processed = 0;

    for (const path of spineItems) {
        const zipFile = zip.file(path);
        if (zipFile) {
            const html = await zipFile.async('text');
            // Extract text from HTML
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const bodyText = doc.body?.textContent || '';
            text += bodyText.trim() + '\n\n';
        }
        processed++;
        onProgress(Math.round((processed / spineItems.length) * 100));
    }

    return text;
}

/**
 * Extract text from DOCX file
 */
export async function extractDocxText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

/**
 * Extract text from TXT file
 */
export async function extractTxtText(file) {
    return await file.text();
}

/**
 * Process any supported file type
 */
export async function processFile(file, onProgress, lang, translations) {
    // Validate file size
    if (!validateFileSize(file)) {
        throw new Error(translations[lang].errorFileTooLarge);
    }

    const ext = file.name.split('.').pop().toLowerCase();

    switch (ext) {
        case 'txt':
            const txtText = await extractTxtText(file);
            onProgress(100);
            return txtText;

        case 'pdf':
            return await extractPdfText(file, onProgress);

        case 'epub':
            return await extractEpubText(file, onProgress);

        case 'docx':
        case 'doc':
            const docxText = await extractDocxText(file);
            onProgress(100);
            return docxText;

        default:
            throw new Error(translations[lang].errorFile);
    }
}

/**
 * Process image with OCR (Tesseract.js)
 */
export async function processImageOcr(file, lang, onStatus, onProgress) {
    const result = await Tesseract.recognize(file, lang, {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                const percent = Math.round(m.progress * 100);
                onProgress(percent);
                onStatus('recognizing', percent);
            } else if (m.status === 'loading language traineddata') {
                onStatus('loading');
            }
        }
    });

    return result.data.text.trim();
}
