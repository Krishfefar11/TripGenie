/**
 * Document Controller
 * 
 * Handles document upload, text extraction, chunking, and embedding generation.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TravelDocument = require('../models/TravelDocument');
const Embedding = require('../models/Embedding');
const { processDocument } = require('../services/documentProcessor');
const { generateEmbeddings } = require('../services/embeddingService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/**
 * POST /api/upload-documents
 * Upload a travel document, extract text, generate embeddings.
 */
async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path: filePath, mimetype, originalname } = req.file;

    // Step 1: Extract text and split into chunks
    console.log(`📤 Processing uploaded file: ${originalname}`);
    const { fullText, chunks } = await processDocument(filePath, mimetype);

    // Step 2: Save document to MongoDB
    const doc = await TravelDocument.create({
      filename: originalname,
      mimeType: mimetype,
      fullText,
      chunks,
    });

    // Step 3: Generate embeddings for all chunks
    console.log(`🔄 Generating embeddings for ${chunks.length} chunks...`);
    const chunkTexts = chunks.map((c) => c.text);
    const vectors = await generateEmbeddings(chunkTexts);

    // Step 4: Store embeddings in MongoDB
    const embeddingDocs = chunks.map((chunk, i) => ({
      documentId: doc._id,
      chunkText: chunk.text,
      chunkIndex: chunk.chunkIndex,
      vector: vectors[i],
    }));

    await Embedding.insertMany(embeddingDocs);

    // Mark document as embedded
    doc.isEmbedded = true;
    await doc.save();

    console.log(`✅ Document processed: ${originalname} → ${chunks.length} embeddings stored`);

    res.json({
      message: 'Document uploaded and processed successfully',
      document: {
        id: doc._id,
        filename: doc.filename,
        chunksCount: chunks.length,
        isEmbedded: true,
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/documents
 * List all uploaded documents.
 */
async function getDocuments(req, res) {
  try {
    const docs = await TravelDocument.find({})
      .select('filename mimeType isEmbedded createdAt chunks')
      .sort({ createdAt: -1 });

    const result = docs.map((d) => ({
      id: d._id,
      filename: d.filename,
      mimeType: d.mimeType,
      isEmbedded: d.isEmbedded,
      chunksCount: d.chunks?.length || 0,
      uploadedAt: d.createdAt,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { upload, uploadDocument, getDocuments };
