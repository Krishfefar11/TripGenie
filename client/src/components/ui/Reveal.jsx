import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal built on IntersectionObserver + CSS transitions.
 *
 * Deliberately NOT a JS-interpolated animation. A JS animation library writes
 * `opacity: 0` inline on mount and relies on requestAnimationFrame to walk it
 * back up — so if rAF is throttled (backgrounded tab, heavy main thread) or a
 * script fails mid-flight, the content is stranded invisible. Here the hidden
 * and visible states are both declarative CSS; the observer only flips an
 * attribute, and the browser owns the transition. Worst case the transition
 * doesn't render and the element simply appears.
 *
 * Falls back to immediately-visible when IntersectionObserver is unavailable,
 * and prefers-reduced-motion is handled in CSS (see index.css).
 */

function useReveal({ once = true, amount = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IO support → show immediately rather than risk hiding content.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Synchronous first check. IntersectionObserver only delivers entries once
    // the rendering pipeline runs, which a backgrounded tab suspends — so
    // anything already on screen is revealed here rather than waiting on it.
    const inViewport = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh && r.bottom > 0;
    };
    if (inViewport()) setShown(true);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);

    // A tab restored from the background may have scrolled past this element
    // while observation was suspended; re-check so nothing stays stranded.
    const onVisible = () => {
      if (!document.hidden && inViewport()) setShown(true);
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [once, amount, rootMargin]);

  return [ref, shown];
}

export const Reveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  amount = 0.15,
  once = true,
}) => {
  const [ref, shown] = useReveal({ once, amount });

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={direction}
      data-revealed={shown ? '' : undefined}
      style={delay ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

/**
 * Staggered container. Children inherit incremental transition-delay from CSS
 * nth-child rules, so no per-child JS bookkeeping is needed.
 */
export const Stagger = ({
  children,
  className = '',
  gap = 0.08,
  delay = 0,
  amount = 0.12,
  once = true,
}) => {
  const [ref, shown] = useReveal({ once, amount });

  return (
    <div
      ref={ref}
      className={className}
      data-stagger=""
      data-revealed={shown ? '' : undefined}
      style={{
        '--stagger-gap': `${Math.round(gap * 1000)}ms`,
        '--stagger-base': `${Math.round(delay * 1000)}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const StaggerItem = ({ children, className = '', direction = 'up' }) => (
  <div className={className} data-stagger-item={direction}>
    {children}
  </div>
);

export default Reveal;
