/**
 * TravelDocument Model
 * 
 * Stores uploaded travel documents (PDF/TXT).
 * Each document has its extracted full text and chunked segments.
 */

const mongoose = require('mongoose');

const travelDocumentSchema = new mongoose.Schema(
  {
    // Original filename of the uploaded document
    filename: {
      type: String,
      required: true,
    },
    // MIME type (application/pdf, text/plain, etc.)
    mimeType: {
      type: String,
      default: 'text/plain',
    },
    // Full extracted text from the document
    fullText: {
      type: String,
      required: true,
    },
    // Text split into manageable chunks for embedding
    chunks: [
      {
        text: String,
        chunkIndex: Number,
      },
    ],
    // Whether embeddings have been generated for this document
    isEmbedded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TravelDocument', travelDocumentSchema);
