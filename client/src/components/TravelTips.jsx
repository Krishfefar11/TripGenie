import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

const TravelTips = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="rounded-2xl bg-indigo-50/80 border border-indigo-100 p-6 overflow-hidden relative shadow-sm hover:shadow-md transition-all">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold font-outfit text-indigo-900">Expert Travel Tips</h2>
        </div>

        <div className="space-y-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/60 rounded-xl border border-indigo-100/50 backdrop-blur-sm">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelTips;
