import React from 'react';
import { Wallet, CreditCard, TrendingUp, Building2, UtensilsCrossed, Plane, Ticket, ShoppingBag } from 'lucide-react';

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
    { name: 'Accommodation', key: 'hotel', icon: Building2 },
    { name: 'Food & Dining', key: 'food', icon: UtensilsCrossed },
    { name: 'Transport', key: 'travel', icon: Plane },
    { name: 'Activities', key: 'activities', icon: Ticket },
    { name: 'Miscellaneous', key: 'miscellaneous', icon: ShoppingBag },
  ];

  const topKey = categories.reduce((max, cat) => {
    const amt = breakdownValues?.[cat.key] ?? 0;
    const maxAmt = breakdownValues?.[max] ?? 0;
    return amt > maxAmt ? cat.key : max;
  }, categories[0].key);

  return (
    <div className="card rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 border border-hairline rounded-md flex items-center justify-center">
          <Wallet className="w-4 h-4 text-ink" />
        </div>
        <div>
          <h2 className="font-display text-h2 text-ink">Budget Breakdown</h2>
          <p className="caption">Estimated Costs</p>
        </div>
      </div>

      {/* Total + Tier summary */}
      <div className="flex items-center justify-between p-4 mb-6 card-lift rounded-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pearl border border-hairline rounded-md flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-ink" />
          </div>
          <div>
            <p className="caption">Total Budget</p>
            <p className="font-display text-h2 text-ink">${total?.toLocaleString()}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 caption border border-hairline rounded">
          {tier}
        </span>
      </div>

      {/* Category bars */}
      <div className="space-y-4 mb-6">
        {categories.map((cat) => {
          const amount = breakdownValues?.[cat.key] ?? 0;
          const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
          const isTop = cat.key === topKey;

          return (
            <div key={cat.key} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-ink-secondary">
                  <cat.icon className="w-3.5 h-3.5" />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="caption">{percent}%</span>
                  <span className="data-figure text-ink w-16 text-right">${amount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-[3px] w-full bg-hairline overflow-hidden">
                <div
                  className={`h-full transition-all duration-base ${isTop ? 'bg-sage' : 'bg-ink/18'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Per day footer */}
      {perDay && (
        <div className="pt-4 border-t border-hairline">
          <div className="flex items-center justify-between card-lift p-4 rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pearl border border-hairline rounded-md flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-ink" />
              </div>
              <div>
                <p className="caption">Per Day Average</p>
                <p className="font-display text-h2 text-ink">${perDay?.toLocaleString()}</p>
              </div>
            </div>
            {breakdown.days && (
              <div className="text-right">
                <p className="caption">Duration</p>
                <p className="data-figure text-ink">{breakdown.days} days</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetBreakdown;
