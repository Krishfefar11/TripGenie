import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatService } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const ChatInterface = ({ injectedMessage = '', onInjectedMessageUsed }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! Welcome to TripGenie. I'm your AI travel assistant powered by real travel documents. Ask me anything about destinations, budgets, packing, local customs, or hidden gems!",
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
    <div className="flex flex-col h-full bg-pearl">

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              <div className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                msg.role === 'user'
                  ? 'bg-ink text-pearl'
                  : 'bg-pearl text-ink border border-hairline'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-3.5 h-3.5" />
                  : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div className={`px-4 py-2.5 rounded-md text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-ink text-pearl'
                  : 'bg-pearl-lift border border-hairline text-ink'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-md bg-pearl text-ink border border-hairline flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-md bg-pearl-lift border border-hairline flex items-center gap-2">
                <span className="caption">TripGenie is thinking</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="px-4 py-4 border-t border-hairline">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about destinations, packing, budgets..."
            className="flex-1 px-4 py-2.5 bg-pearl border border-hairline rounded text-sm text-ink placeholder:text-ink-secondary/60 outline-none transition-colors duration-base hover:border-ink/40 focus:border-ink focus:bg-ink/5"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 bg-ink text-pearl rounded flex items-center justify-center transition-colors duration-base hover:bg-ink/85 disabled:opacity-35"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 caption text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
