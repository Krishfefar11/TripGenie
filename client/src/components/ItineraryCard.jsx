import React from 'react';
import { Sunrise, Sun, Moon, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const ItineraryCard = ({ dayData, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="ml-10 relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Timeline Circle */}
      <div className="absolute -left-[53px] top-6 w-9 h-9 bg-white border-[3px] border-primary rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/10 z-10 font-bold text-primary text-sm">
        {dayData.day}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 underline decoration-indigo-200 underline-offset-8">
            {dayData.title}
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            Est. ${dayData.estimatedCost}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Sunrise className="w-4 h-4" /> Morning
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {dayData.morning}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Sun className="w-4 h-4" /> Afternoon
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {dayData.afternoon}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Moon className="w-4 h-4" /> Evening
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {dayData.evening}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryCard;
