/**
 * Rerank Service
 *
 * Cross-encoder reranking over hybrid search's fused candidate list.
 *
 * Bi-encoders (the embedding model used for retrieval) score query and
 * passage independently, then compare vectors — fast, but blind to
 * query/passage interaction. A cross-encoder scores the (query, passage)
 * pair jointly through one forward pass, which is far more accurate but
 * too slow to run over an entire corpus — so it only reranks the small
 * candidate set hybrid search already narrowed down.
 *
 * Runs locally via @xenova/transformers, same pattern as embeddingService.js —
 * no external API, no extra cost.
 */

let transformersModule = null;
let tokenizer = null;
let model = null;

const RERANK_MODEL = 'Xenova/ms-marco-MiniLM-L-6-v2';

// Cross-encoder logits below this are not a weak match, they're noise: probed
// scores for real corpus destinations (Bangkok, Tokyo, Paris) never dropped
// below -0.7, while destinations absent from the corpus (Ahmedabad, Reykjavik,
// Nairobi, and even a near-miss like Venice) never rose above -8.7. Without
// this gate, out-of-corpus queries still got 5 "relevant" chunks — just the
// least-irrelevant chunks in the whole corpus — which the prompt then forced
// the LLM to build the itinerary's landmarks and restaurants out of.
const RELEVANCE_THRESHOLD = -5;

async function getReranker() {
  if (!transformersModule) {
    const { AutoTokenizer, AutoModelForSequenceClassification } = await import('@xenova/transformers');
    transformersModule = { AutoTokenizer, AutoModelForSequenceClassification };
  }

  if (!tokenizer || !model) {
    console.log(`🔄 Loading reranker model (${RERANK_MODEL})...`);
    tokenizer = await transformersModule.AutoTokenizer.from_pretrained(RERANK_MODEL);
    model = await transformersModule.AutoModelForSequenceClassification.from_pretrained(RERANK_MODEL);
    console.log('✅ Reranker model loaded');
  }

  return { tokenizer, model };
}

/**
 * Rerank candidates by their cross-encoder relevance score against the query.
 *
 * @param {string} queryText - the user's search query
 * @param {Array<{chunkText: string}>} candidates - hybrid search's fused top-N
 * @param {number} topK - number of final results to keep
 * @returns {Array} candidates sorted by rerankScore desc, sliced to topK
 */
async function rerank(queryText, candidates, topK = 5) {
  if (candidates.length === 0) return [];

  const { tokenizer: tok, model: crossEncoder } = await getReranker();

  const scored = [];
  for (const candidate of candidates) {
    const inputs = tok(queryText, { text_pair: candidate.chunkText, padding: true, truncation: true });
    const { logits } = await crossEncoder(inputs);
    scored.push({ ...candidate, rerankScore: logits.data[0] });
  }

  scored.sort((a, b) => b.rerankScore - a.rerankScore);

  const relevant = scored.filter((c) => c.rerankScore >= RELEVANCE_THRESHOLD);
  const top = relevant.slice(0, topK);

  if (relevant.length === 0) {
    console.log(`🎯 Reranked ${candidates.length} candidates → 0 relevant (top score: ${scored[0]?.rerankScore.toFixed(3)}, below threshold ${RELEVANCE_THRESHOLD}) — no grounded context for this query`);
  } else {
    console.log(`🎯 Reranked ${candidates.length} candidates → top ${top.length} (top score: ${top[0]?.rerankScore.toFixed(3)})`);
  }
  return top;
}

module.exports = { rerank };
