import React, { useState } from 'react';
import { Briefcase, Check } from 'lucide-react';
import IconBadge from './ui/IconBadge';
import { cn } from '../utils/cn';

/**
 * Packing list with genuinely checkable items. Previously the checkmark only
 * appeared on hover and tracked nothing — a packing list you can't tick off
 * is decoration, so this holds real state.
 */
const PackingList = ({ items }) => {
  const [packed, setPacked] = useState(() => new Set());

  if (!items || items.length === 0) return null;

  const toggle = (i) => {
    setPacked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const done = packed.size;
  const pct = Math.round((done / items.length) * 100);

  return (
    <section className="card flex h-full flex-col p-6" aria-label="Packing list">
      <div className="flex items-center gap-3">
        <IconBadge icon={Briefcase} accent="amber" size="sm" />
        <div className="min-w-0 flex-1">
          <h2 className="text-h3 text-ink">Packing List</h2>
          <p className="caption-meta mt-0.5">
            {done} of {items.length} packed
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-pill bg-ink/[0.06]">
        <div
          className="h-full rounded-pill bg-grad-amber transition-all duration-slow ease-smooth"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Packing progress"
        />
      </div>

      <ul className="mt-4 space-y-0.5">
        {items.map((item, i) => {
          const isPacked = packed.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isPacked}
                className="group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors duration-base hover:bg-ink/[0.03]"
              >
                <span
                  className={cn(
                    'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-base',
                    isPacked
                      ? 'border-transparent bg-grad-brand text-white'
                      : 'border-line-strong bg-surface group-hover:border-brand-400'
                  )}
                >
                  <Check
                    className={cn(
                      'h-2.5 w-2.5 transition-opacity duration-fast',
                      isPacked ? 'opacity-100' : 'opacity-0'
                    )}
                    strokeWidth={3.5}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={cn(
                    'text-tiny transition-all duration-base',
                    isPacked ? 'text-ink-faint line-through' : 'text-ink-soft'
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default PackingList;
