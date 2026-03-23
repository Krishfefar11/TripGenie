/**
 * Chat Routes
 */
const express = require('express');
const router = express.Router();
const { chatHandler, getChatHistory } = require('../controllers/chatController');

// Send a message to the AI assistant
router.post('/chat', chatHandler);

// Get chat history for a session
router.get('/chat/:sessionId', getChatHistory);

module.exports = router;
