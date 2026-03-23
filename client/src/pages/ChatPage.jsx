import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Info } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Smart Travel Guide
          </h1>
          <p className="text-slate-500 font-medium">
            Ask anything about your upcoming trips, local customs, or hidden gems.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-primary rounded-xl text-sm font-bold border border-indigo-100/50">
          <Info className="w-4 h-4" />
          Intelligent Data Retrieval
        </div>
      </div>

      {/* Chat Interface */}
      <div className="glass h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl border-white/40">
        <ChatInterface />
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Try asking:</span>
        {[
          "What are the best street foods in Tokyo?",
          "Budget-friendly hotels in Paris?",
          "How to get around Bali on a scooter?",
          "Packing list for a 5-day trek?"
        ].map((q, i) => (
          <button 
            key={i}
            className="px-4 py-2 bg-white border border-slate-100 rounded-full text-sm text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
