/**
 * RAG Retrieval Evaluation Harness
 *
 * Benchmarks the new hybrid (BM25 + cosine, RRF-fused) + cross-encoder
 * reranked retrieval path against the original vector-only baseline,
 * over a hand-labeled test set built from the seeded sample corpus
 * (server/data/sample-travel-docs).
 *
 * Each test query is labeled with the chunk(s) that should be retrieved,
 * identified by (filename, chunkIndex) rather than a Mongo _id so labels
 * stay valid across reseeds of the same source documents.
 *
 * Metrics reported per approach, per query and averaged:
 *   - Precision@5: what fraction of the 5 retrieved chunks are relevant
 *   - Recall@5:    what fraction of the relevant chunks were retrieved
 *   - MRR@5:       reciprocal rank of the first relevant hit (0 if none in top 5)
 *
 * Run: node scripts/evaluate.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const TravelDocument = require('../models/TravelDocument');
const { generateEmbedding } = require('../services/embeddingService');
const { searchSimilarChunks } = require('../services/vectorSearch');
const { searchHybrid } = require('../services/hybridSearch');
const { rerank } = require('../services/rerankService');

const TOP_K = 5;

// gold: array of [filename, chunkIndex] pairs that count as relevant for this query
const TEST_SET = [
  { query: 'affordable Balinese food Nasi Goreng Babi Guling', gold: [['bali-guide.txt', 1]] },
  { query: 'Eiffel Tower Louvre Mona Lisa must see', gold: [['paris-guide.txt', 0]] },
  { query: 'colorful quiet street away from crowds hidden gem in Paris', gold: [['paris-guide.txt', 0]] },
  { query: 'Reclining Buddha Wat Pho massage school', gold: [['bangkok-guide.txt', 0]] },
  { query: 'Pad Thai Tom Yum Goong street cart food', gold: [['bangkok-guide.txt', 1]] },
  { query: 'Cacio e Pepe Carbonara pasta dish', gold: [['rome-guide.txt', 1]] },
  { query: "keyhole view St Peter's dome Aventine Hill", gold: [['rome-guide.txt', 0], ['rome-guide.txt', 1]] },
  { query: 'bagels lox pastrami Katz deli', gold: [['new-york-guide.txt', 1]] },
  { query: 'High Line elevated park Chelsea', gold: [['new-york-guide.txt', 0]] },
  { query: 'capsule hotel budget backpacker Tokyo', gold: [['tokyo-guide.txt', 1], ['tokyo-guide.txt', 2]] },
  { query: 'ramen sushi izakaya yakitori', gold: [['tokyo-guide.txt', 1]] },
  { query: 'Shibuya crossing Meiji Shrine Harajuku', gold: [['tokyo-guide.txt', 0]] },
  { query: 'surfing diving yoga retreat Ubud activities', gold: [['bali-guide.txt', 2]] },
  { query: 'Broadway Times Square Central Park attractions', gold: [['new-york-guide.txt', 0]] },
  { query: 'Colosseum Roman Forum Vatican skip the line', gold: [['rome-guide.txt', 0]] },
  { query: 'Muay Thai boxing floating market day trip', gold: [['bangkok-guide.txt', 2]] },
  { query: 'museum pass free Sunday budget tips Paris', gold: [['paris-guide.txt', 1]] },
  { query: 'scooter rental Grab Gojek getting around Bali', gold: [['bali-guide.txt', 0]] },
];

function keyOf(item, filenameByDocId) {
  return `${filenameByDocId.get(String(item.documentId))}::${item.chunkIndex}`;
}

function evalOne(retrieved, gold, filenameByDocId) {
  const goldKeys = new Set(gold.map(([file, idx]) => `${file}::${idx}`));
  const retrievedKeys = retrieved.map((r) => keyOf(r, filenameByDocId));

  const hits = retrievedKeys.filter((k) => goldKeys.has(k));
  const precision = hits.length / TOP_K;
  const recall = hits.length / goldKeys.size;

  let mrr = 0;
  for (let i = 0; i < retrievedKeys.length; i++) {
    if (goldKeys.has(retrievedKeys[i])) {
      mrr = 1 / (i + 1);
      break;
    }
  }

  return { precision, recall, mrr };
}

function avg(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const docs = await TravelDocument.find({}).lean();
  const filenameByDocId = new Map(docs.map((d) => [String(d._id), d.filename]));

  const rows = [];

  for (const { query, gold } of TEST_SET) {
    const vec = await generateEmbedding(query);

    const baseline = await searchSimilarChunks(vec, TOP_K);
    const baselineMetrics = evalOne(baseline, gold, filenameByDocId);

    const candidates = await searchHybrid(vec, query, 15);
    const rerankedResults = await rerank(query, candidates, TOP_K);
    const hybridMetrics = evalOne(rerankedResults, gold, filenameByDocId);

    rows.push({ query, baseline: baselineMetrics, hybrid: hybridMetrics });
  }

  const summary = {
    baseline: {
      precision: avg(rows.map((r) => r.baseline.precision)),
      recall: avg(rows.map((r) => r.baseline.recall)),
      mrr: avg(rows.map((r) => r.baseline.mrr)),
    },
    hybrid: {
      precision: avg(rows.map((r) => r.hybrid.precision)),
      recall: avg(rows.map((r) => r.hybrid.recall)),
      mrr: avg(rows.map((r) => r.hybrid.mrr)),
    },
  };

  const pct = (n) => `${(n * 100).toFixed(1)}%`;

  let report = `# RAG Retrieval Evaluation\n\n`;
  report += `Corpus: ${docs.length} documents (${docs.map((d) => d.filename).join(', ')}), ${TEST_SET.length} labeled test queries, top-${TOP_K} retrieval.\n\n`;
  report += `| Query | Baseline P@5 | Hybrid+Rerank P@5 | Baseline R@5 | Hybrid+Rerank R@5 | Baseline MRR | Hybrid+Rerank MRR |\n`;
  report += `|---|---|---|---|---|---|---|\n`;
  for (const r of rows) {
    report += `| ${r.query} | ${pct(r.baseline.precision)} | ${pct(r.hybrid.precision)} | ${pct(r.baseline.recall)} | ${pct(r.hybrid.recall)} | ${r.baseline.mrr.toFixed(2)} | ${r.hybrid.mrr.toFixed(2)} |\n`;
  }
  report += `\n## Summary (averaged over ${TEST_SET.length} queries)\n\n`;
  report += `| Metric | Baseline (vector-only) | Hybrid + Rerank | Delta |\n`;
  report += `|---|---|---|---|\n`;
  report += `| Precision@5 | ${pct(summary.baseline.precision)} | ${pct(summary.hybrid.precision)} | ${pct(summary.hybrid.precision - summary.baseline.precision)} |\n`;
  report += `| Recall@5 | ${pct(summary.baseline.recall)} | ${pct(summary.hybrid.recall)} | ${pct(summary.hybrid.recall - summary.baseline.recall)} |\n`;
  report += `| MRR@5 | ${summary.baseline.mrr.toFixed(3)} | ${summary.hybrid.mrr.toFixed(3)} | ${(summary.hybrid.mrr - summary.baseline.mrr).toFixed(3)} |\n`;

  console.log('\n' + report);

  const outPath = path.join(__dirname, '..', 'eval-results.md');
  fs.writeFileSync(outPath, report);
  console.log(`📄 Report written to ${outPath}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Eval error:', err);
  process.exit(1);
});
