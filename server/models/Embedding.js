/**
 * Embedding Model
 * 
 * Stores vector embeddings for each text chunk.
 * Used for semantic similarity search in the RAG pipeline.
 */

const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema(
  {
    // Reference to the source travel document
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelDocument',
      required: true,
    },
    // The original text chunk this embedding represents
    chunkText: {
      type: String,
      required: true,
    },
    // Index of the chunk within its parent document
    chunkIndex: {
      type: Number,
      required: true,
    },
    // The embedding vector (array of floats)
    // all-MiniLM-L6-v2 produces 384-dimensional vectors
    vector: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by document
embeddingSchema.index({ documentId: 1 });

module.exports = mongoose.model('Embedding', embeddingSchema);
