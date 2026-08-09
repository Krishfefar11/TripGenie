import React from 'react';
import {
  Wallet, CreditCard, Building2, UtensilsCrossed, Plane, Ticket, ShoppingBag,
} from 'lucide-react';
import IconBadge from './ui/IconBadge';

/**
 * Each spend category owns an accent so the chart reads as color-coded data,
 * not decoration. "Miscellaneous" is deliberately neutral — it's the
 * unranked catch-all, so it shouldn't compete for attention.
 */
const CATEGORIES = [
  { name: 'Accommodation', key: 'hotel',         icon: Building2,      accent: 'sky',    bar: 'bg-grad-sky' },
  { name: 'Food & Dining', key: 'food',          icon: UtensilsCrossed, accent: 'rose',   bar: 'bg-grad-rose' },
  { name: 'Transport',     key: 'travel',        icon: Plane,          accent: 'amber',  bar: 'bg-grad-amber' },
  { name: 'Activities',    key: 'activities',    icon: Ticket,         accent: 'brand',  bar: 'bg-grad-brand' },
  { name: 'Miscellaneous', key: 'miscellaneous', icon: ShoppingBag,    accent: 'neutral', bar: 'bg-ink/28' },
];

const BudgetBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  // Handles both nested (fresh generation) and flat (legacy saved trips) shapes
  const values = breakdown.breakdown || {
    hotel: breakdown.hotel,
    food: breakdown.food,
    travel: breakdown.travel,
    activities: breakdown.activities,
    miscellaneous: breakdown.miscellaneous,
  };

  const total = breakdown.total || Object.values(values).reduce((a, b) => a + (b || 0), 0);
  const perDay = breakdown.perDay || (total && breakdown.days ? Math.round(total / breakdown.days) : null);
  const tier = breakdown.tier || 'budget';

  // Only worth a note when cost of living actually pulled the tier away
  // from what the raw $/day number alone would suggest — stay quiet for
  // destinations near the 1.0 (average) baseline, or legacy saved trips
  // from before this was tracked.
  const costNote = breakdown.costIndex >= 1.3
    ? 'Higher cost-of-living destination — budgeted accordingly.'
    : breakdown.costIndex <= 0.7
      ? 'Lower cost-of-living destination — this budget goes further.'
      : null;

  const topKey = CATEGORIES.reduce((max, cat) => {
    const amt = values?.[cat.key] ?? 0;
    return amt > (values?.[max] ?? 0) ? cat.key : max;
  }, CATEGORIES[0].key);

  return (
    <section className="card overflow-hidden p-6" aria-label="Budget breakdown">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={Wallet} accent="amber" size="sm" />
          <div>
            <h2 className="text-h3 text-ink">Budget</h2>
            <p className="caption-meta mt-0.5">Estimated costs</p>
          </div>
        </div>
        <span className="pill capitalize">{tier}</span>
      </div>

      {costNote && (
        <p className="mt-3 text-caption text-ink-muted">{costNote}</p>
      )}

      {/* Total — the headline number */}
      <div className="mt-5 rounded-md border border-line bg-mesh-soft p-4">
        <p className="caption-meta">Total budget</p>
        <p className="stat-num mt-1">${total?.toLocaleString()}</p>
        {perDay && (
          <p className="mt-1.5 flex items-center gap-1.5 text-caption text-ink-muted">
            <CreditCard className="h-3 w-3" aria-hidden="true" />
            <span className="data-num font-semibold text-ink-soft">${perDay.toLocaleString()}</span>
            per day
            {breakdown.days && <>· {breakdown.days} days</>}
          </p>
        )}
      </div>

      {/* Category rows */}
      <ul className="mt-6 space-y-4">
        {CATEGORIES.map((cat, i) => {
          const amount = values?.[cat.key] ?? 0;
          const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
          const isTop = cat.key === topKey;

          return (
            <li key={cat.key}>
              <div className="mb-2 flex items-center justify-between gap-2 text-tiny">
                <span className="flex min-w-0 items-center gap-2">
                  <IconBadge icon={cat.icon} accent={cat.accent} variant="tint" size="xs" lift={false} />
                  <span className="truncate font-medium text-ink-soft">{cat.name}</span>
                  {isTop && (
                    <span className="shrink-0 rounded-pill bg-ink px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-white">
                      Top
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="text-caption text-ink-faint">{percent}%</span>
                  <span className="data-num w-14 text-right font-semibold text-ink">
                    ${amount?.toLocaleString()}
                  </span>
                </span>
              </div>

              {/* Width is the real value in the DOM; the grow effect is a CSS
                  scaleX animation, so a stalled animation still shows the
                  correct bar rather than an empty track. */}
              <div className="h-2 overflow-hidden rounded-pill bg-ink/[0.06]">
                <div
                  className={`h-full origin-left animate-bar-grow rounded-pill ${cat.bar} ${isTop ? '' : 'opacity-55'}`}
                  style={{ width: `${percent}%`, animationDelay: `${i * 70}ms` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BudgetBreakdown;
