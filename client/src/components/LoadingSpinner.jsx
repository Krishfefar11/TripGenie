import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Branded loader: concentric pulsing rings behind the compass mark, plus a
 * shimmering label. Reads as "the product is working," not "the page hung."
 */
const LoadingSpinner = ({ message = 'Loading…', sub }) => {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-28"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Expanding halo rings, offset so they cascade */}
        <span className="absolute inset-0 rounded-pill bg-brand-500/22 animate-pulse-ring" aria-hidden="true" />
        <span
          className="absolute inset-0 rounded-pill bg-brand-500/16 animate-pulse-ring"
          style={{ animationDelay: '0.8s' }}
          aria-hidden="true"
        />
        {/* Slow-spinning gradient ring */}
        <span
          className="absolute inset-1.5 rounded-pill bg-grad-brand opacity-16 animate-spin-slow"
          aria-hidden="true"
        />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-pill bg-grad-brand text-white shadow-glow-brand">
          <Compass className="h-5 w-5 animate-spin-slow" strokeWidth={2.2} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-7 text-h3 text-ink">{message}</p>
      {sub && <p className="mt-1.5 max-w-sm text-center text-small text-ink-muted">{sub}</p>}

      {/* Indeterminate track */}
      <div className="sheen-wrap mt-6 h-1 w-44 overflow-hidden rounded-pill bg-ink/[0.07]">
        <div className="h-full w-1/2 rounded-pill bg-grad-brand" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
