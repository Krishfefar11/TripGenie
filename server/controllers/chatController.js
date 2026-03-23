/**
 * Chat Controller
 * 
 * Handles AI chat conversations with context-aware responses.
 * Uses RAG pipeline for knowledge-augmented answers.
 */

const { v4: uuidv4 } = require('uuid');
const ChatHistory = require('../models/ChatHistory');
const { generateChatResponse } = require('../services/ragPipeline');

/**
 * POST /api/chat
 * Send a message to the AI travel assistant.
 * 
 * Body: { message, sessionId? }
 */
async function chatHandler(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use existing session or create a new one
    const session = sessionId || uuidv4();

    // Get chat history for context (last 10 messages)
    const history = await ChatHistory.find({ sessionId: session })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Reverse to get chronological order
    const chatHistory = history.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Save user message
    await ChatHistory.create({
      sessionId: session,
      role: 'user',
      content: message,
    });

    // Generate AI response using RAG
    const aiResponse = await generateChatResponse(message, chatHistory);

    // Save AI response
    await ChatHistory.create({
      sessionId: session,
      role: 'assistant',
      content: aiResponse,
    });

    res.json({
      success: true,
      sessionId: session,
      response: aiResponse,
    });
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({ error: 'Failed to generate response. Please try again.' });
  }
}

/**
 * GET /api/chat/:sessionId
 * Get chat history for a session.
 */
async function getChatHistory(req, res) {
  try {
    const { sessionId } = req.params;

    const messages = await ChatHistory.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      sessionId,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { chatHandler, getChatHistory };
