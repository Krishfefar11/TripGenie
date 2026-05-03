import React from 'react';
import { Wallet, CreditCard, TrendingUp } from 'lucide-react';

const BudgetBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  // Handle both nested structure (fresh generation) and flat structure (legacy saved trips)
  const breakdownValues = breakdown.breakdown || {
    hotel: breakdown.hotel,
    food: breakdown.food,
    travel: breakdown.travel,
    activities: breakdown.activities,
    miscellaneous: breakdown.miscellaneous,
  };

  const total = breakdown.total || Object.values(breakdownValues).reduce((a, b) => a + (b || 0), 0);
  const perDay = breakdown.perDay || (total && breakdown.days ? Math.round(total / breakdown.days) : null);
  const tier = breakdown.tier || 'budget';

  const categories = [
    { name: 'Accommodation', key: 'hotel',         color: 'bg-indigo-500',  light: 'bg-indigo-50',  text: 'text-indigo-600',  icon: '🏨' },
    { name: 'Food & Dining', key: 'food',          color: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-600',  icon: '🍽️' },
    { name: 'Transport',     key: 'travel',        color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', icon: '✈️' },
    { name: 'Activities',    key: 'activities',    color: 'bg-purple-500',  light: 'bg-purple-50',  text: 'text-purple-600',  icon: '🎭' },
    { name: 'Miscellaneous', key: 'miscellaneous', color: 'bg-slate-400',   light: 'bg-slate-50',   text: 'text-slate-500',   icon: '🛍️' },
  ];

  const tierColors = {
    budget:   'text-emerald-600 bg-emerald-50 border-emerald-200',
    moderate: 'text-amber-600 bg-amber-50 border-amber-200',
    luxury:   'text-purple-600 bg-purple-50 border-purple-200',
  };

  return (
    <div className="modern-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Budget Breakdown</h2>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Estimated Costs</p>
        </div>
      </div>

      {/* Total + Tier summary */}
      <div className="flex items-center justify-between p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Total Budget</p>
            <p className="text-xl font-bold text-slate-900">${total?.toLocaleString()}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${tierColors[tier] || tierColors.budget}`}>
          {tier}
        </span>
      </div>

      {/* Category bars */}
      <div className="space-y-4 mb-6">
        {categories.map((cat) => {
          const amount = breakdownValues?.[cat.key] ?? 0;
          const percent = total > 0 ? Math.round((amount / total) * 100) : 0;

          return (
            <div key={cat.key} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span className="text-slate-600 font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cat.light} ${cat.text}`}>{percent}%</span>
                  <span className="text-slate-900 font-bold w-16 text-right">${amount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Per day footer */}
      {perDay && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <CreditCard className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Per Day Average</p>
                <p className="text-lg font-bold text-slate-900">${perDay?.toLocaleString()}</p>
              </div>
            </div>
            {breakdown.days && (
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-tight">Duration</p>
                <p className="text-sm font-bold text-slate-700">{breakdown.days} days</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetBreakdown;
