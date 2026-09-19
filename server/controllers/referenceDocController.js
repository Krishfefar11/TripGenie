/**
 * Reference Document Controller
 *
 * Lets a user attach their own raw content (a blog post, PDF, or plain text)
 * to ground ONE itinerary request — separate from documentController's
 * uploads, which permanently join the shared RAG corpus everyone else's
 * searches draw from. This one never touches that corpus: extract, chunk,
 * embed, hold in memory just long enough for generate-itinerary to use it
 * (see referenceDocCache), then the temp file is deleted immediately.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processDocument } = require('../services/documentProcessor');
const { generateEmbeddings } = require('../services/embeddingService');
const referenceDocCache = require('../services/referenceDocCache');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'media-temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * POST /api/analyze-reference-doc
 * Upload a reference document; embed its chunks and hold them for the next
 * generate-itinerary call to use as extra grounding, alongside the seeded
 * corpus. Returns a short-lived referenceId, not the chunks/vectors
 * themselves — the client never sees or resends raw embeddings.
 */
async function analyzeReferenceDocHandler(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path: filePath, mimetype, originalname } = req.file;

  try {
    console.log(`📄 Processing reference doc: ${originalname}`);
    const { chunks } = await processDocument(filePath, mimetype);

    if (chunks.length === 0) {
      return res.status(400).json({ error: 'Could not extract any text from that file.' });
    }

    const vectors = await generateEmbeddings(chunks.map((c) => c.text));
    const embeddedChunks = chunks.map((c, i) => ({ chunkText: c.text, vector: vectors[i] }));

    const referenceId = referenceDocCache.put(embeddedChunks);
    console.log(`✅ Reference doc ready: ${originalname} → ${embeddedChunks.length} chunks (${referenceId})`);

    res.json({
      success: true,
      referenceId,
      filename: originalname,
      chunkCount: embeddedChunks.length,
    });
  } catch (error) {
    console.error('❌ Reference doc processing error:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('⚠️ Failed to delete temp reference file:', err.message);
    });
  }
}

module.exports = { upload, analyzeReferenceDocHandler };
