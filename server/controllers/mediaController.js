/**
 * Media Controller
 *
 * Handles one-off "analyze this photo/video/doc for trip context" uploads.
 * Unlike documentController's uploads, these are NOT added to the shared
 * RAG knowledge base — the file is analyzed, its extracted context returned
 * to the client, and the temp file is deleted immediately after.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeMedia } = require('../services/mediaAnalysisService');

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

const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Use PDF, TXT, JPEG, PNG, WEBP, MP4, or MOV.'));
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — keeps base64-inline payloads to Gemini well under its ~20MB limit
});

/**
 * POST /api/analyze-media
 * Upload a photo, video, or document; return extracted travel-relevant context.
 */
async function analyzeMediaHandler(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path: filePath, mimetype, originalname } = req.file;

  try {
    console.log(`📸 Analyzing uploaded media: ${originalname} (${mimetype})`);
    const { context, source } = await analyzeMedia(filePath, mimetype);
    console.log(`✅ Media analysis complete (${source}): ${context.slice(0, 100)}...`);

    res.json({ success: true, context, source, filename: originalname });
  } catch (error) {
    console.error('❌ Media analysis error:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    // Always clean up — this upload is one-off, not part of the persistent corpus.
    fs.unlink(filePath, (err) => {
      if (err) console.error('⚠️ Failed to delete temp media file:', err.message);
    });
  }
}

module.exports = { upload, analyzeMediaHandler };
