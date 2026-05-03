import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Heart, Sparkles, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Plan Trip',    path: '/',           icon: Compass },
  { name: 'AI Chat',      path: '/chat',       icon: MessageSquare },
  { name: 'Saved Trips',  path: '/saved-trips', icon: Heart },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4 print:hidden">
        <div className="glass px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-xl shadow-indigo-500/5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-outfit">
              TripGenie
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ name, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-indigo-50 text-primary shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-slate-400')} />
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-indigo-50 transition-colors"
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
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="mt-2 glass rounded-2xl shadow-xl shadow-indigo-500/10 overflow-hidden"
            >
              {NAV_LINKS.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 text-sm font-medium border-b border-slate-100/60 last:border-0 transition-colors',
                      isActive
                        ? 'text-primary bg-indigo-50/60'
                        : 'text-slate-600 hover:text-primary hover:bg-indigo-50/40'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-slate-400')} />
                    {name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
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
