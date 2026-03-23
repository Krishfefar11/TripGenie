/**
 * Text Splitter Utility
 * 
 * Splits large text documents into smaller chunks suitable for embedding.
 * Uses word-count-based splitting with configurable overlap for context continuity.
 */

/**
 * Split text into chunks of approximately `chunkSize` words
 * with `overlap` words of overlap between consecutive chunks.
 * 
 * @param {string} text - The full text to split
 * @param {number} chunkSize - Target words per chunk (default: 250)
 * @param {number} overlap - Words of overlap between chunks (default: 50)
 * @returns {string[]} Array of text chunks
 */
function splitTextIntoChunks(text, chunkSize = 250, overlap = 50) {
  if (!text || text.trim().length === 0) return [];

  // Clean up the text: normalize whitespace
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  const words = cleanedText.split(' ');

  // If text is shorter than chunk size, return it as a single chunk
  if (words.length <= chunkSize) {
    return [cleanedText];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + chunkSize, words.length);
    const chunk = words.slice(startIndex, endIndex).join(' ');

    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Move start forward by (chunkSize - overlap) for the next chunk
    startIndex += chunkSize - overlap;
  }

  return chunks;
}

module.exports = { splitTextIntoChunks };
