import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../utils/useTheme';
import { cn } from '../../utils/cn';

/**
 * Icon is swapped, not rotated — a plain conditional render is trivially
 * correct, where a CSS-transform-driven flip is one more moving part for
 * no real benefit here.
 */
const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-surface text-ink-soft transition-colors duration-base hover:text-ink',
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
