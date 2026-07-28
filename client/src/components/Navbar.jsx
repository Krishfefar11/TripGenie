import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Heart, Menu, X, Sparkles, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';

const NAV_LINKS = [
  { name: 'Plan Trip',   path: '/',            icon: Compass },
  { name: 'AI Chat',     path: '/chat',        icon: MessageSquare },
  { name: 'Saved Trips', path: '/saved-trips', icon: Heart },
];

const Navbar = () => {
  const location = useLocation();
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Glass/shadow only kicks in once the page has moved — at rest the nav
  // sits flush with the hero instead of floating on a seam.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on route change and lock body scroll while it's open.
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Escape closes the drawer — keyboard parity with the close button.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 print:hidden',
          'transition-all duration-slow ease-smooth',
          scrolled
            ? 'border-b border-line bg-white/78 backdrop-blur-xl backdrop-saturate-150 shadow-sm'
            : 'border-b border-transparent bg-transparent'
        )}
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="mx-auto flex h-full max-w-shell items-center justify-between gap-4 px-5 sm:px-8">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="TripGenie home"
          >
            <span className="relative">
              <span className="icon-box icon-box-lift h-9 w-9 rounded-sm bg-grad-brand text-white shadow-glow-brand">
                <Compass className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.2} aria-hidden="true" />
              </span>
              {/* Soft halo on hover */}
              <span
                className="absolute inset-0 -z-10 rounded-sm bg-brand-500/40 opacity-0 blur-lg transition-opacity duration-slow group-hover:opacity-100"
                aria-hidden="true"
              />
            </span>
            <span className="text-[1.0625rem] font-bold tracking-tight text-ink">TripGenie</span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map(({ name, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-tiny font-semibold',
                    'transition-colors duration-base',
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {/* Shared layoutId makes the pill slide between tabs */}
                  {isActive && (
                    <motion.span
                      layoutId={reduce ? undefined : 'nav-pill'}
                      className="absolute inset-0 -z-10 rounded-pill border border-line bg-surface-sunken"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link to="/" className="btn-primary btn-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              New Trip
              <ArrowUpRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line bg-white text-ink-soft transition-colors duration-base hover:text-ink md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              className="fixed inset-x-3 z-50 rounded-xl border border-line bg-white p-3 shadow-2xl md:hidden"
              style={{ top: 'calc(var(--nav-h) + 6px)' }}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              {NAV_LINKS.map(({ name, path, icon: Icon }, i) => {
                const isActive = location.pathname === path;
                return (
                  <motion.div
                    key={path}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={path}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3.5 py-3.5 text-small font-semibold transition-colors duration-base',
                        isActive
                          ? 'bg-brand-500/10 text-brand-700'
                          : 'text-ink-soft hover:bg-surface-sunken hover:text-ink'
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                      {name}
                      {isActive && (
                        <span className="ml-auto status-dot bg-brand-500" aria-hidden="true" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="rule my-2.5" />
              <Link to="/" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Start a New Trip
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
