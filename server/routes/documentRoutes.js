/**
 * Document Routes
 */
const express = require('express');
const router = express.Router();
const { upload, uploadDocument, getDocuments } = require('../controllers/documentController');

// Upload a travel document (PDF/TXT)
router.post('/upload-documents', upload.single('document'), uploadDocument);

// List all uploaded documents
router.get('/documents', getDocuments);

module.exports = router;
