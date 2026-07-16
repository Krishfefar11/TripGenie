import React from 'react';
import { Sunrise, Sun, Moon, DollarSign } from 'lucide-react';

const ItineraryCard = ({ dayData, index }) => {
  return (
    <div className="ml-10 relative card rounded-lg p-6 md:p-8">
      {/* Timeline marker */}
      <div className="absolute -left-[53px] top-6 w-9 h-9 bg-pearl border border-ink rounded-md flex items-center justify-center z-10 data-figure text-ink">
        {dayData.day}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-h2 text-ink">
            {dayData.title}
          </h3>
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-hairline text-ink-secondary rounded caption">
            <DollarSign className="w-3.5 h-3.5" />
            Est. ${dayData.estimatedCost}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-ink caption">
              <Sunrise className="w-4 h-4" /> Morning
            </div>
            <p className="text-body text-ink-secondary text-sm leading-relaxed">
              {dayData.morning}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-ink caption">
              <Sun className="w-4 h-4" /> Afternoon
            </div>
            <p className="text-body text-ink-secondary text-sm leading-relaxed">
              {dayData.afternoon}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-ink caption">
              <Moon className="w-4 h-4" /> Evening
            </div>
            <p className="text-body text-ink-secondary text-sm leading-relaxed">
              {dayData.evening}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
