import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';

const PackingList = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="px-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-slate-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Packing List</h2>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors group">
            <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <CheckCircle2 className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-slate-600 text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingList;
