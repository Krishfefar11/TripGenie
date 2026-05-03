import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { label: '🍜 Street food in Tokyo', text: 'What are the best street foods in Tokyo?' },
  { label: '🏨 Budget hotels in Paris', text: 'What are the most budget-friendly hotels in Paris?' },
  { label: '🛵 Getting around Bali', text: 'How do I get around Bali on a scooter safely?' },
  { label: '🎒 5-day trek packing list', text: 'Give me a detailed packing list for a 5-day mountain trek.' },
  { label: '✈️ Cheapest flights tips', text: 'What are the best tips for finding cheap flights?' },
  { label: '🌏 Visa-free countries', text: 'Which countries can I visit visa-free with an Indian passport?' },
];

const ChatPage = () => {
  // Lift input state up so suggestions can populate the chat input
  const [injectedMessage, setInjectedMessage] = useState('');

  const handleSuggestionClick = (text) => {
    setInjectedMessage(text);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300/40">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Smart Travel Assistant
          </h1>
          <p className="text-slate-500 font-medium pl-1">
            Ask anything — destinations, customs, budgets, packing, and more.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-primary rounded-2xl text-sm font-bold border border-indigo-100/60 shadow-sm">
          <Zap className="w-4 h-4" />
          RAG-Powered Retrieval
        </div>
      </motion.div>

      {/* ── Quick Suggestions ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Quick suggestions — click to send
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s.text)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600
                         hover:border-primary hover:text-primary hover:bg-indigo-50/50 hover:shadow-md
                         hover:-translate-y-0.5 transition-all duration-200 shadow-sm font-medium"
            >
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Chat Interface ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/40"
        style={{ height: '62vh', minHeight: '400px' }}
      >
        <ChatInterface injectedMessage={injectedMessage} onInjectedMessageUsed={() => setInjectedMessage('')} />
      </motion.div>
    </div>
  );
};

export default ChatPage;
