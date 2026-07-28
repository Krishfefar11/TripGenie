import React from 'react';
import { Lightbulb } from 'lucide-react';
import IconBadge from './ui/IconBadge';

const TravelTips = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="card flex h-full flex-col p-6" aria-label="Travel tips">
      <div className="flex items-center gap-3">
        <IconBadge icon={Lightbulb} accent="violet" size="sm" />
        <div>
          <h2 className="text-h3 text-ink">Travel Tips</h2>
          <p className="caption-meta mt-0.5">Know before you go</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {tips.map((tip, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-md border border-line bg-surface-sunken p-3.5"
          >
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-pill bg-violet-500/14 text-[0.5625rem] font-bold text-violet-700">
              {i + 1}
            </span>
            <p className="text-tiny leading-relaxed text-ink-soft">{tip}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TravelTips;
