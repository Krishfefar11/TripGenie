import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { chatService } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! welcome to TripGenie. I can help you plan your travel based on your uploaded documents and my travel knowledge. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage, sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/40">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-secondary border border-indigo-100'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-primary to-secondary text-white' 
                    : 'bg-white border border-slate-100 text-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-2xl bg-white text-secondary border border-indigo-100 flex items-center justify-center shrink-0 shadow-lg">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-500 text-sm flex items-center gap-2 italic">
                Manifesting thoughts...
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/80 border-t border-indigo-50">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your travel question here..."
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all pr-14 text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1.5 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
          Tip: You can ask about locations mentioned in your uploaded documents
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
