/**
 * Hybrid Search Service
 *
 * Combines two independent retrieval signals over the same chunk corpus:
 *   - Dense: cosine similarity over embeddings (semantic meaning)
 *   - Sparse: BM25 over raw tokens (exact keyword/name matches embeddings can blur)
 *
 * The two rankings are merged with Reciprocal Rank Fusion (RRF) rather than
 * a weighted score blend, since cosine similarity and BM25 scores live on
 * incomparable scales — fusing by rank position avoids having to tune a
 * blend weight by hand.
 */

const Embedding = require('../models/Embedding');
const { cosineSimilarity } = require('./vectorSearch');

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on',
  'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'it', 'this', 'that',
  'be', 'been', 'has', 'have', 'had', 'not', 'no',
]);

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => !STOPWORDS.has(t));
}

/**
 * Score every chunk against the query using Okapi BM25.
 * k1 and b use the standard textbook defaults.
 */
function bm25Scores(queryTokens, docs, k1 = 1.5, b = 0.75) {
  const N = docs.length;
  const tokenizedDocs = docs.map((d) => tokenize(d.chunkText));
  const docLengths = tokenizedDocs.map((t) => t.length);
  const avgdl = docLengths.reduce((a, l) => a + l, 0) / N;

  // Document frequency: how many chunks contain each query term at least once
  const df = new Map();
  for (const term of new Set(queryTokens)) {
    let count = 0;
    for (const tokens of tokenizedDocs) {
      if (tokens.includes(term)) count++;
    }
    df.set(term, count);
  }

  return tokenizedDocs.map((tokens, i) => {
    const docLen = docLengths[i];
    let score = 0;
    for (const term of queryTokens) {
      const termDf = df.get(term) || 0;
      if (termDf === 0) continue;
      const idf = Math.log((N - termDf + 0.5) / (termDf + 0.5) + 1);
      const tf = tokens.filter((t) => t === term).length;
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + (b * docLen) / avgdl);
      score += idf * (numerator / denominator);
    }
    return score;
  });
}

/**
 * Merge two rankings (arrays of indices, best-first) into one via
 * Reciprocal Rank Fusion: score(d) = sum over rankings of 1 / (k + rank).
 */
function reciprocalRankFusion(rankingsList, k = 60) {
  const fused = new Map();
  for (const ranking of rankingsList) {
    ranking.forEach((idx, rank) => {
      fused.set(idx, (fused.get(idx) || 0) + 1 / (k + rank + 1));
    });
  }
  return fused;
}

function rankIndicesByScore(scores) {
  return scores
    .map((score, idx) => ({ idx, score }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.idx);
}

/**
 * Hybrid retrieval: fuse dense (cosine) and sparse (BM25) rankings via RRF.
 *
 * @param {number[]} queryVector - embedding of the query
 * @param {string} queryText - raw query text (for BM25)
 * @param {number} topN - number of fused candidates to return
 * @param {Array<{chunkText: string, vector: number[]}>} [extraChunks] - ad-hoc
 *   chunks to search alongside the stored corpus (e.g. a user-uploaded
 *   reference document for this one request). Never persisted to Mongo —
 *   scored in the same BM25+cosine+RRF pass as everything else, so they
 *   compete for rank on equal footing rather than being tacked on after.
 * @returns {Array<{chunkText, documentId, chunkIndex, cosineScore, bm25Score, fusedScore}>}
 */
async function searchHybrid(queryVector, queryText, topN = 10, extraChunks = []) {
  const stored = await Embedding.find({}).limit(2000).lean();
  const userChunks = extraChunks.map((c, i) => ({
    chunkText: c.chunkText,
    documentId: 'user-reference',
    chunkIndex: i,
    vector: c.vector,
  }));
  const allEmbeddings = [...userChunks, ...stored];
  if (allEmbeddings.length === 0) return [];

  const cosine = allEmbeddings.map((e) => cosineSimilarity(queryVector, e.vector));
  const bm25 = bm25Scores(tokenize(queryText), allEmbeddings);

  const cosineRanking = rankIndicesByScore(cosine);
  const bm25Ranking = rankIndicesByScore(bm25);

  const fused = reciprocalRankFusion([cosineRanking, bm25Ranking]);

  const results = allEmbeddings.map((e, i) => ({
    chunkText: e.chunkText,
    documentId: e.documentId,
    chunkIndex: e.chunkIndex,
    cosineScore: cosine[i],
    bm25Score: bm25[i],
    fusedScore: fused.get(i) || 0,
  }));

  results.sort((a, b) => b.fusedScore - a.fusedScore);

  const top = results.slice(0, topN);
  console.log(`🔀 Hybrid search fused ${top.length} candidates (top fused score: ${top[0]?.fusedScore.toFixed(4)})`);
  return top;
}

module.exports = { searchHybrid, bm25Scores, reciprocalRankFusion, tokenize };
