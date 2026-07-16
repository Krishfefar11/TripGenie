import React from 'react';
import { Briefcase, Check } from 'lucide-react';

const PackingList = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="card rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 border border-hairline rounded-md flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-ink" />
        </div>
        <h2 className="font-display text-h2 text-ink">Packing List</h2>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-ink/[0.03] transition-colors duration-base group">
            <div className="w-4 h-4 border border-hairline rounded-sm flex items-center justify-center group-hover:border-ink transition-colors duration-base">
              <Check className="w-3 h-3 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
            </div>
            <span className="text-ink-secondary text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingList;
