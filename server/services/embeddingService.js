/**
 * Embedding Service
 * 
 * Generates vector embeddings using @xenova/transformers (all-MiniLM-L6-v2).
 * This runs entirely in Node.js — no Python or external API needed.
 * 
 * The model produces 384-dimensional embeddings suitable for semantic search.
 */

// Dynamic import helper for ESM @xenova/transformers
let transformersModule = null;
let embeddingPipeline = null;

/**
 * Initialize the embedding pipeline (downloads model on first run ~30MB).
 * Subsequent calls use the cached pipeline.
 */
async function getEmbeddingPipeline() {
  if (!transformersModule) {
    // Dynamic import to handle ESM in CommonJS
    const { pipeline } = await import('@xenova/transformers');
    transformersModule = { pipeline };
  }
  
  if (!embeddingPipeline) {
    console.log('🔄 Loading embedding model (all-MiniLM-L6-v2)...');
    embeddingPipeline = await transformersModule.pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    console.log('✅ Embedding model loaded');
  }
  return embeddingPipeline;
}

/**
 * Generate an embedding vector for a single text string.
 * 
 * @param {string} text - Text to embed
 * @returns {number[]} 384-dimensional embedding vector
 */
async function generateEmbedding(text) {
  const extractor = await getEmbeddingPipeline();
  
  // Run inference — output shape is [1, tokens, 384]
  const output = await extractor(text, {
    pooling: 'mean',    // Mean pooling over token embeddings
    normalize: true,     // L2 normalize for cosine similarity
  });

  // Convert from Tensor to plain array
  return Array.from(output.data);
}

/**
 * Generate embeddings for multiple text chunks.
 * 
 * @param {string[]} chunks - Array of text chunks
 * @returns {number[][]} Array of embedding vectors
 */
async function generateEmbeddings(chunks) {
  const embeddings = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    embeddings.push(embedding);
    
    // Log progress for large batches
    if ((i + 1) % 10 === 0) {
      console.log(`  📊 Embedded ${i + 1}/${chunks.length} chunks`);
    }
  }

  console.log(`✅ Generated ${embeddings.length} embeddings`);
  return embeddings;
}

module.exports = { generateEmbedding, generateEmbeddings };
