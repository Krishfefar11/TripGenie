/**
 * Reference Document Routes
 */
const express = require('express');
const router = express.Router();
const { upload, analyzeReferenceDocHandler } = require('../controllers/referenceDocController');

// Upload a reference document (blog export, PDF, or plain text) to ground
// the next itinerary generation — not added to the shared RAG corpus.
router.post('/analyze-reference-doc', (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, analyzeReferenceDocHandler);

module.exports = router;
