import React from 'react';
import { cn } from '../../utils/cn';
import { Reveal } from './Reveal';

/**
 * Consistent section header: eyebrow → title → optional lead paragraph.
 * Centered or left-aligned; every section on the site uses this so vertical
 * rhythm between sections stays identical.
 */
export const SectionHeading = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  lead,
  align = 'center',
  className = '',
  titleClass = 'text-display',
}) => {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <Reveal direction="up">
          <span className="eyebrow px-3 py-1.5 rounded-pill bg-brand-500/10 border border-brand-500/16">
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5" aria-hidden="true" />}
            {eyebrow}
          </span>
        </Reveal>
      )}

      <Reveal direction="up" delay={0.06}>
        <h2 className={cn(titleClass, 'text-ink text-balance')}>{title}</h2>
      </Reveal>

      {lead && (
        <Reveal direction="up" delay={0.12}>
          <p className={cn('text-lead text-ink-soft', centered && 'mx-auto text-center', 'max-w-2xl')}>
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
};

export default SectionHeading;
