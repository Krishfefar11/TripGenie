import React from 'react';
import { cn } from '../../utils/cn';

/**
 * The system's icon container. Two fills:
 *   - "gradient": solid gradient + white icon + colored glow (feature-level)
 *   - "tint":     12% wash + solid colored icon (inline/list-level)
 *
 * Accent choice is meaningful: an icon gets a color when it distinguishes
 * one sibling from another. Generic container headers use "neutral".
 */

const GRADIENTS = {
  brand:  'bg-grad-brand shadow-glow-brand',
  jade:   'bg-grad-jade shadow-glow-brand',
  indigo: 'bg-grad-indigo shadow-glow-indigo',
  violet: 'bg-grad-violet shadow-glow-violet',
  sky:    'bg-grad-sky shadow-glow-indigo',
  amber:  'bg-grad-amber shadow-glow-amber',
  rose:   'bg-grad-rose shadow-glow-amber',
  teal:   'bg-grad-teal shadow-glow-brand',
  ink:    'bg-grad-ink shadow-md',
};

const TINTS = {
  brand:  'bg-brand-500/12 text-brand-700',
  jade:   'bg-teal-500/12 text-teal-700',
  indigo: 'bg-indigo-500/12 text-indigo-700',
  violet: 'bg-violet-500/12 text-violet-700',
  sky:    'bg-sky-500/12 text-sky-700',
  amber:  'bg-amber-500/14 text-amber-700',
  rose:   'bg-rose-500/12 text-rose-700',
  teal:   'bg-teal-500/12 text-teal-700',
  neutral:'bg-ink/[0.055] text-ink-soft',
};

const SIZES = {
  xs: { box: 'w-7 h-7 rounded-xs',  icon: 'w-3.5 h-3.5' },
  sm: { box: 'w-9 h-9 rounded-sm',  icon: 'w-4 h-4' },
  md: { box: 'w-11 h-11 rounded-md', icon: 'w-5 h-5' },
  lg: { box: 'w-14 h-14 rounded-lg', icon: 'w-6 h-6' },
  xl: { box: 'w-16 h-16 rounded-lg', icon: 'w-7 h-7' },
};

export const IconBadge = ({
  icon: Icon,
  accent = 'brand',
  variant = 'gradient',
  size = 'md',
  lift = true,
  className = '',
}) => {
  const s = SIZES[size] ?? SIZES.md;
  const isGradient = variant === 'gradient' && accent !== 'neutral';
  const fill = isGradient
    ? cn(GRADIENTS[accent] ?? GRADIENTS.brand, 'text-white')
    : (TINTS[accent] ?? TINTS.neutral);

  return (
    <span className={cn('icon-box', lift && 'icon-box-lift', s.box, fill, className)}>
      <Icon className={s.icon} strokeWidth={2.1} aria-hidden="true" />
    </span>
  );
};

export default IconBadge;
