/**
 * Media Routes
 */
const express = require('express');
const router = express.Router();
const { upload, analyzeMediaHandler } = require('../controllers/mediaController');

// Analyze an uploaded photo/video/document for trip-planning context.
// Multer's fileFilter/size-limit errors are caught explicitly here so they
// come back as a clean JSON 400 instead of Express's default HTML 500.
router.post('/analyze-media', (req, res, next) => {
  upload.single('media')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, analyzeMediaHandler);

module.exports = router;
