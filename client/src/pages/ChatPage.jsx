import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Zap } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Street food in Tokyo', text: 'What are the best street foods in Tokyo?' },
  { label: 'Budget hotels in Paris', text: 'What are the most budget-friendly hotels in Paris?' },
  { label: 'Getting around Bali', text: 'How do I get around Bali on a scooter safely?' },
  { label: '5-day trek packing list', text: 'Give me a detailed packing list for a 5-day mountain trek.' },
  { label: 'Cheapest flights tips', text: 'What are the best tips for finding cheap flights?' },
  { label: 'Visa-free countries', text: 'Which countries can I visit visa-free with an Indian passport?' },
];

const ChatPage = () => {
  // Lift input state up so suggestions can populate the chat input
  const [injectedMessage, setInjectedMessage] = useState('');

  const handleSuggestionClick = (text) => {
    setInjectedMessage(text);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-h1-sm text-ink flex items-center gap-3">
            <div className="w-9 h-9 bg-ink rounded-md flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-pearl" />
            </div>
            Smart Travel Assistant
          </h1>
          <p className="text-body text-ink-secondary text-sm pl-1">
            Ask anything — destinations, customs, budgets, packing, and more.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 border border-hairline rounded caption">
          <Zap className="w-3.5 h-3.5" />
          RAG-Powered Retrieval
        </div>
      </div>

      {/* ── Quick Suggestions ── */}
      <div className="space-y-2">
        <p className="caption">Quick Suggestions — Click to Send</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s.text)}
              className="px-3 py-1.5 border border-hairline rounded text-sm text-ink-secondary hover:border-ink hover:text-ink transition-colors duration-base"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Interface ── */}
      <div
        className="card rounded-lg overflow-hidden"
        style={{ height: '62vh', minHeight: '400px' }}
      >
        <ChatInterface injectedMessage={injectedMessage} onInjectedMessageUsed={() => setInjectedMessage('')} />
      </div>
    </div>
  );
};

export default ChatPage;
