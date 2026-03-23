import React from 'react';
import { PieChart, Wallet, CreditCard } from 'lucide-react';

const BudgetBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  const categories = [
    { name: 'Hotels', key: 'hotel', color: 'bg-primary' },
    { name: 'Food', key: 'food', color: 'bg-orange-500' },
    { name: 'Travel', key: 'travel', color: 'bg-emerald-500' },
    { name: 'Activities', key: 'activities', color: 'bg-secondary' },
    { name: 'Others', key: 'miscellaneous', color: 'bg-slate-400' },
  ];

  const total = breakdown.total;

  return (
    <div className="modern-card">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Budget Breakdown</h2>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Estimated Costs</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span>Category</span>
          <span>EST. Total</span>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const amount = breakdown.breakdown[cat.key];
            const percent = (amount / total) * 100;

            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600">{cat.name}</span>
                  <span className="text-slate-900 font-bold">${amount}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100">
          <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Per Day</p>
                <p className="text-lg font-bold text-slate-900">${breakdown.perDay}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Tier</p>
              <p className="text-sm font-bold text-primary uppercase">{breakdown.tier}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBreakdown;
