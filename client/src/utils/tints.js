// Shared icon-badge tint map — Tailwind needs full static class names to
// generate them, so lookups stay here rather than building classes with
// template strings (e.g. `bg-${tint}/12` is invisible to Tailwind's JIT).
export const TINTS = {
  gold: { badge: 'bg-gold/12', icon: 'text-gold' },
  sky: { badge: 'bg-sky/12', icon: 'text-sky' },
  coral: { badge: 'bg-coral/12', icon: 'text-coral' },
  sage: { badge: 'bg-sage/12', icon: 'text-sage' },
};
