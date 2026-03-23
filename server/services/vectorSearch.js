/**
 * Vector Search Service
 * 
 * Implements cosine similarity search over stored embeddings.
 * Retrieves the most relevant text chunks for a given query embedding.
 */

const Embedding = require('../models/Embedding');

/**
 * Calculate cosine similarity between two vectors.
 * 
 * Cosine similarity = (A · B) / (||A|| × ||B||)
 * Since our embeddings are L2-normalized, this simplifies to just the dot product.
 * 
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} Similarity score between -1 and 1
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Search for the most semantically similar text chunks.
 * 
 * Loads all embeddings from MongoDB, computes cosine similarity with
 * the query vector, and returns the top-K most relevant chunks.
 * 
 * @param {number[]} queryVector - The query embedding vector
 * @param {number} topK - Number of results to return (default: 5)
 * @returns {Array<{chunkText: string, score: number, documentId: string}>}
 */
async function searchSimilarChunks(queryVector, topK = 5) {
  // Load all embeddings from the database
  const allEmbeddings = await Embedding.find({}).lean();

  if (allEmbeddings.length === 0) {
    console.log('⚠️ No embeddings found in database');
    return [];
  }

  // Calculate similarity scores for each stored embedding
  const scored = allEmbeddings.map((emb) => ({
    chunkText: emb.chunkText,
    documentId: emb.documentId,
    chunkIndex: emb.chunkIndex,
    score: cosineSimilarity(queryVector, emb.vector),
  }));

  // Sort by similarity score (descending) and return top-K
  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.slice(0, topK);
  console.log(`🔍 Found ${topResults.length} relevant chunks (top score: ${topResults[0]?.score.toFixed(4)})`);

  return topResults;
}

module.exports = { searchSimilarChunks, cosineSimilarity };
