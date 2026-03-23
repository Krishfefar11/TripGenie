/**
 * Document Processor Service
 * 
 * Handles text extraction from uploaded files (PDF and TXT)
 * and splits them into chunks for embedding.
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { splitTextIntoChunks } = require('../utils/textSplitter');

/**
 * Extract text from a file based on its MIME type.
 * 
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {string} Extracted text content
 */
async function extractText(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    return await extractFromPDF(filePath);
  }
  // Default: treat as plain text
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Extract text content from a PDF file.
 */
async function extractFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}

/**
 * Process an uploaded document: extract text and split into chunks.
 * 
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - File MIME type
 * @returns {{ fullText: string, chunks: Array<{text: string, chunkIndex: number}> }}
 */
async function processDocument(filePath, mimeType) {
  // Step 1: Extract raw text
  const fullText = await extractText(filePath, mimeType);
  
  if (!fullText || fullText.trim().length === 0) {
    throw new Error('No text content could be extracted from the document');
  }

  // Step 2: Split into chunks (~250 words each, 50 word overlap)
  const chunkTexts = splitTextIntoChunks(fullText, 250, 50);

  // Step 3: Structure the chunks
  const chunks = chunkTexts.map((text, index) => ({
    text,
    chunkIndex: index,
  }));

  console.log(`📄 Processed document: ${path.basename(filePath)} → ${chunks.length} chunks`);

  return { fullText, chunks };
}

module.exports = { processDocument, extractText };
