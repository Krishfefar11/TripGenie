import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

const TravelTips = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="card rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 border border-hairline rounded-md flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-ink" />
        </div>
        <h2 className="font-display text-h2 text-ink">Expert Travel Tips</h2>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-3 p-4 card-lift rounded-md">
            <Info className="w-3.5 h-3.5 text-ink-secondary shrink-0 mt-1" />
            <p className="pull-quote text-lg leading-snug">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelTips;
