/**
 * Media Analysis Service
 *
 * Extracts travel-relevant context from an uploaded file so it can be fed
 * into the RAG itinerary prompt as extra context alongside destination/budget/interests.
 *
 *  - PDF / TXT        → reuses the existing document text extractor
 *  - Image            → Gemini vision (identifies place/food/culture) + OCR
 *                        (catches menus, screenshots, brochure text)
 *  - Video            → Gemini vision, sent as inline base64 — no frame
 *                        extraction or ffmpeg needed, Gemini accepts video directly
 */

const fs = require('fs');
const Tesseract = require('tesseract.js');
const { generateWithGeminiVision } = require('./ollamaService');
const { extractText: extractDocText } = require('./documentProcessor');

const VISION_PROMPT = `You are analyzing a travel-related photo or video for a trip-planning app.
Describe, in 2-4 concise sentences:
1. The specific place, landmark, or city shown, if identifiable.
2. Any food or cuisine visible.
3. Cultural, seasonal, or time-of-day details relevant to a traveler.
Be factual — do not invent a location you are not reasonably confident about. If nothing travel-relevant is visible, say so plainly in one sentence.`;

/**
 * Run Gemini vision analysis on an image or video file.
 */
async function analyzeVisually(filePath, mimeType) {
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  return generateWithGeminiVision(VISION_PROMPT, base64, mimeType);
}

/**
 * OCR an image for any embedded text (menus, screenshots, signage, brochures).
 * Returns '' if the result doesn't look like real text — OCR run on a plain
 * photo (no actual text present) tends to produce short, low-confidence noise
 * ("f = [ie a]") rather than an empty string, so length alone isn't a safe filter.
 */
async function extractTextViaOCR(filePath) {
  const { data } = await Tesseract.recognize(filePath, 'eng');
  const text = data.text.trim();

  const realWords = text.match(/[A-Za-z]{3,}/g) || [];
  const looksLikeText = realWords.length >= 2 && (data.confidence ?? 0) >= 60;

  return looksLikeText ? text : '';
}

/**
 * Analyze an uploaded file and return travel-relevant context as plain text.
 *
 * @param {string} filePath
 * @param {string} mimeType
 * @returns {{ context: string, source: 'document'|'vision'|'vision+ocr' }}
 */
async function analyzeMedia(filePath, mimeType) {
  if (mimeType === 'application/pdf' || mimeType === 'text/plain') {
    const text = await extractDocText(filePath, mimeType);
    return { context: text.slice(0, 4000), source: 'document' };
  }

  if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
    const parts = [];

    try {
      const visionResult = await analyzeVisually(filePath, mimeType);
      parts.push(`Visual analysis: ${visionResult}`);
    } catch (err) {
      console.error('⚠️ Vision analysis failed:', err.message);
    }

    if (mimeType.startsWith('image/')) {
      try {
        const ocrText = await extractTextViaOCR(filePath);
        if (ocrText.length > 3) {
          parts.push(`Text found in image: ${ocrText}`);
        }
      } catch (err) {
        console.error('⚠️ OCR failed:', err.message);
      }
    }

    if (parts.length === 0) {
      throw new Error('Could not extract any travel-relevant context from this file');
    }

    return {
      context: parts.join('\n\n'),
      source: parts.length > 1 ? 'vision+ocr' : 'vision',
    };
  }

  throw new Error(`Unsupported media type: ${mimeType}`);
}

module.exports = { analyzeMedia };
