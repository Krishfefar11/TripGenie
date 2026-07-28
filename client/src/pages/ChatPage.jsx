import React, { useState } from 'react';
import { MessageSquare, Database, Sparkles } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import IconBadge from '../components/ui/IconBadge';
import { Reveal } from '../components/ui/Reveal';
import { cn } from '../utils/cn';

const SUGGESTIONS = [
  { label: 'Street food in Tokyo',     text: 'What are the best street foods in Tokyo, and where do I find them?', accent: 'rose' },
  { label: 'Budget stays in Paris',    text: 'What are the most budget-friendly places to stay in Paris?', accent: 'sky' },
  { label: 'Getting around Bali',      text: 'How do I get around Bali safely on a scooter?', accent: 'brand' },
  { label: 'Quiet spots in Rome',      text: 'What are the least crowded, most authentic spots in Rome?', accent: 'teal' },
  { label: 'Temple etiquette',         text: 'What should I know about temple etiquette in Bangkok?', accent: 'amber' },
  { label: 'NYC on a budget',          text: 'How do I do New York City on a tight daily budget?', accent: 'violet' },
];

const CHIP_TINTS = {
  rose:   'hover:border-rose-400 hover:bg-rose-500/[0.06] hover:text-rose-700',
  sky:    'hover:border-sky-400 hover:bg-sky-500/[0.06] hover:text-sky-700',
  brand:  'hover:border-brand-400 hover:bg-brand-500/[0.06] hover:text-brand-700',
  teal:   'hover:border-teal-400 hover:bg-teal-500/[0.06] hover:text-teal-700',
  amber:  'hover:border-amber-400 hover:bg-amber-500/[0.07] hover:text-amber-700',
  violet: 'hover:border-violet-400 hover:bg-violet-500/[0.06] hover:text-violet-700',
};

const ChatPage = () => {
  const [injectedMessage, setInjectedMessage] = useState('');

  return (
    <div className="relative overflow-x-clip">
      {/* Ambient background */}
      <div className="absolute inset-x-0 top-0 h-80 bg-mesh" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-80 bg-grid" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">

        {/* ── Header ── */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <IconBadge icon={MessageSquare} accent="brand" size="lg" />
            <div>
              <Reveal>
                <h1 className="text-h1 text-ink">Travel Assistant</h1>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-1 text-small text-ink-soft">
                  Grounded answers from real destination guides.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal direction="left" delay={0.1}>
            <span className="pill shrink-0 border-indigo-500/18 bg-indigo-500/[0.07] text-indigo-700">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Hybrid retrieval + rerank
            </span>
          </Reveal>
        </div>

        {/* ── Suggestions ── */}
        <Reveal direction="up" delay={0.14} className="mt-8">
          <div>
            <p className="caption-meta mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-brand-600" aria-hidden="true" />
              Try one of these
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setInjectedMessage(s.text)}
                  className={cn('chip', CHIP_TINTS[s.accent])}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Chat shell ── */}
        <Reveal direction="up" delay={0.2} className="mt-7">
          <div className="card overflow-hidden rounded-xl shadow-lg">
            {/* Shell header */}
            <div className="flex items-center justify-between border-b border-line bg-surface-sunken px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="status-dot animate-pulse bg-brand-500" aria-hidden="true" />
                <span className="text-caption font-bold uppercase tracking-wide text-ink-soft">
                  TripGenie · online
                </span>
              </div>
              <span className="font-mono text-[0.625rem] text-ink-faint">RAG-backed</span>
            </div>

            <div className="h-[min(62vh,560px)] min-h-[400px]">
              <ChatInterface
                injectedMessage={injectedMessage}
                onInjectedMessageUsed={() => setInjectedMessage('')}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default ChatPage;
