/**
 * ChatHistory Model
 * 
 * Stores chat messages for the AI travel assistant.
 * Groups messages by sessionId for context-aware conversations.
 */

const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    // Session identifier to group related messages
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    // Role: 'user' or 'assistant'
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    // The message content
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
