import React from 'react';
import { Sunrise, Sun, Moon, DollarSign } from 'lucide-react';
import IconBadge from './ui/IconBadge';

/** Time-of-day blocks, each with its own accent for quick visual scanning. */
const BLOCKS = [
  { key: 'morning',   label: 'Morning',   icon: Sunrise, accent: 'amber'  },
  { key: 'afternoon', label: 'Afternoon', icon: Sun,     accent: 'sky'    },
  { key: 'evening',   label: 'Evening',   icon: Moon,    accent: 'violet' },
];

const ItineraryCard = ({ dayData }) => {
  return (
    // No `overflow-hidden` here: the day node is positioned outside the card's
    // own box and would be clipped by it.
    <article className="card card-hover group relative ml-12 p-6 sm:ml-14 sm:p-7">
      {/* Timeline node — sits in the rail drawn by the parent */}
      <div
        className="absolute -left-12 top-6 flex h-9 w-9 items-center justify-center rounded-sm bg-grad-brand text-small font-bold text-white shadow-glow-brand transition-transform duration-slow ease-spring group-hover:scale-110 sm:-left-14"
        aria-hidden="true"
      >
        {dayData.day}
      </div>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="caption-meta">Day {dayData.day}</p>
          <h3 className="mt-1 text-h2 text-ink">{dayData.title}</h3>
        </div>
        {dayData.estimatedCost != null && (
          <span className="pill shrink-0 border-brand-500/20 bg-brand-500/[0.07] text-brand-700">
            <DollarSign className="h-3 w-3" aria-hidden="true" />
            <span className="data-num font-semibold">
              Est. ${Number(dayData.estimatedCost).toLocaleString()}
            </span>
          </span>
        )}
      </header>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {BLOCKS.map(({ key, label, icon, accent }) => (
          <div key={key} className="flex gap-3 sm:flex-col sm:gap-2.5">
            <IconBadge icon={icon} accent={accent} variant="tint" size="xs" lift={false} />
            <div className="min-w-0">
              <p className="text-caption font-bold uppercase tracking-wide text-ink-muted">
                {label}
              </p>
              <p className="mt-1 text-tiny leading-relaxed text-ink-soft">
                {dayData[key] || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ItineraryCard;
