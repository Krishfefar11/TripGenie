import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Map, Heart, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Plan Trip', path: '/', icon: Compass },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Saved Trips', path: '/saved-trips', icon: Heart },
  ];

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
      <div className="glass px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl shadow-indigo-500/5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-outfit">
            TripGenie
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium",
                  isActive 
                    ? "bg-indigo-50/80 text-primary" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex md:hidden">
          {/* Mobile menu could go here, but keeping it simple for now */}
          <button className="p-2 text-slate-500 hover:text-primary transition-colors">
            <Map className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
