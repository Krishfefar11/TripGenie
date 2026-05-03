import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatService } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = ({ injectedMessage = '', onInjectedMessageUsed }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 Welcome to TripGenie. I'm your AI travel assistant powered by real travel documents. Ask me anything about destinations, budgets, packing, local customs, or hidden gems!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Handle injected suggestion from parent ChatPage — FIX: wire up suggestion buttons
  useEffect(() => {
    if (injectedMessage && injectedMessage.trim()) {
      setInput(injectedMessage);
      inputRef.current?.focus();
      onInjectedMessageUsed?.();
    }
  }, [injectedMessage]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(text, sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I encountered a connection issue. Please check the server and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white/60 to-white/40">

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-secondary text-white'
                    : 'bg-white text-indigo-500 border border-indigo-100'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-4 h-4" />
                    : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-tr-md'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="shrink-0 w-9 h-9 rounded-2xl bg-white text-indigo-500 border border-indigo-100 flex items-center justify-center shadow-md">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"
                      style={{ animationDelay: `${n * 0.15}s` }}
                    />
                  ))}
                </span>
                <span className="text-xs text-slate-400 italic">TripGenie is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 py-4 bg-white/80 border-t border-slate-100/80 backdrop-blur-sm">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about destinations, packing, budgets..."
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="shrink-0 w-11 h-11 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-center text-slate-400 tracking-widest uppercase font-semibold">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
