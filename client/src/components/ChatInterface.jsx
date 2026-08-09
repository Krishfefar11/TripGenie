import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp, User, Sparkles } from 'lucide-react';
import { chatService } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../utils/cn';

const GREETING = {
  role: 'assistant',
  content:
    "Hi — I'm TripGenie's travel assistant. I answer from real travel guides, not from memory alone, so ask me anything specific: hidden neighbourhoods, what a dish actually is, realistic daily budgets, or local etiquette.",
};

const ChatInterface = ({ injectedMessage = '', onInjectedMessageUsed }) => {
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [messages, loading, reduce]);

  // Suggestion chips from the parent land in the input, focused and ready.
  useEffect(() => {
    if (injectedMessage?.trim()) {
      setInput(injectedMessage);
      inputRef.current?.focus();
      onInjectedMessageUsed?.();
    }
  }, [injectedMessage, onInjectedMessageUsed]);

  // Auto-grow the textarea up to a ceiling, then let it scroll.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

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
        {
          role: 'assistant',
          content: 'Sorry — I hit a connection issue. The server may be waking up; please try again in a moment.',
          isError: true,
        },
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
    <div className="flex h-full flex-col bg-surface">
      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
            >
              {/* Avatar */}
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm',
                  isUser
                    ? 'bg-grad-ink text-white'
                    : msg.isError
                      ? 'bg-error/12 text-error'
                      : 'bg-grad-brand text-white shadow-glow-brand'
                )}
                aria-hidden="true"
              >
                {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </span>

              {/* Bubble */}
              <div className={cn('max-w-[82%] sm:max-w-[75%]', isUser && 'flex flex-col items-end')}>
                <div
                  className={cn(
                    'whitespace-pre-wrap rounded-lg px-4 py-3 text-small leading-relaxed',
                    isUser
                      ? 'rounded-tr-xs bg-grad-ink text-white shadow-md'
                      : msg.isError
                        ? 'rounded-tl-xs border border-error/22 bg-error/[0.05] text-ink-soft'
                        : 'rounded-tl-xs border border-line bg-surface-sunken text-ink-soft'
                  )}
                >
                  {msg.content}
                </div>
                <span className="mt-1.5 px-1 text-caption text-ink-faint">
                  {isUser ? 'You' : 'TripGenie'}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="flex gap-3"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-grad-brand text-white shadow-glow-brand" aria-hidden="true">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-2.5 rounded-lg rounded-tl-xs border border-line bg-surface-sunken px-4 py-3.5">
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-pill bg-brand-500 animate-dot-bounce"
                      style={{ animationDelay: `${d * 0.16}s` }}
                    />
                  ))}
                </span>
                <span className="text-caption text-ink-muted">Retrieving sources…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Composer ── */}
      <div className="border-t border-line bg-surface px-4 py-4 sm:px-6">
        <form onSubmit={handleSend}>
          <div className="flex items-end gap-2.5 rounded-lg border border-line bg-surface-sunken p-2 transition-all duration-base focus-within:border-brand-500 focus-within:bg-surface focus-within:shadow-[0_0_0_3.5px_rgba(18,183,106,0.12)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask about neighbourhoods, dishes, budgets, etiquette…"
              aria-label="Message"
              className="max-h-[140px] flex-1 resize-none bg-transparent px-2.5 py-2 text-small text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-grad-brand text-white shadow-glow-brand transition-all duration-fast ease-spring hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-35 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </form>
        <p className="mt-2.5 text-center text-caption text-ink-faint">
          <kbd className="rounded-xs border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.625rem]">Enter</kbd>
          {' '}to send ·{' '}
          <kbd className="rounded-xs border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.625rem]">Shift + Enter</kbd>
          {' '}for a new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
