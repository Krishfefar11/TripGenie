import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Heart, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Plan Trip',   path: '/',            icon: Compass },
  { name: 'AI Chat',     path: '/chat',        icon: MessageSquare },
  { name: 'Saved Trips', path: '/saved-trips', icon: Heart },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-pearl border-b border-hairline print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-ink rounded flex items-center justify-center">
              <Compass className="text-pearl w-4 h-4" />
            </div>
            <span className="font-display text-2xl text-ink">
              TripGenie
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ name, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-1.5 pb-1 text-ui uppercase border-b-2 transition-colors duration-base',
                    isActive
                      ? 'font-display italic text-2xl normal-case tracking-normal text-ink border-ink pb-0'
                      : 'text-ink-secondary border-transparent hover:text-ink'
                  )}
                >
                  {!isActive && <Icon className="w-3.5 h-3.5" />}
                  {isActive ? name : name}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-ink-secondary hover:text-ink transition-colors duration-base"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="md:hidden border-t border-hairline bg-pearl"
            >
              {NAV_LINKS.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 text-ui uppercase border-b border-hairline last:border-0 transition-colors duration-base',
                      isActive ? 'text-ink bg-pearl-lift' : 'text-ink-secondary hover:text-ink'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-pill bg-sage" />}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
