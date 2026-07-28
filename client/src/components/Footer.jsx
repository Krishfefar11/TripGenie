import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Linkedin, Twitter, Mail, ArrowUpRight, Sparkles } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Plan a Trip', to: '/' },
      { label: 'AI Chat', to: '/chat' },
      { label: 'Saved Journeys', to: '/saved-trips' },
    ],
  },
  {
    title: 'How It Works',
    links: [
      { label: 'RAG Retrieval', to: '/#how-it-works' },
      { label: 'Plan from Media', to: '/#features' },
      { label: 'Budget Engine', to: '/#features' },
    ],
  },
];

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Krishfefar11/TripGenie' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Mail, label: 'Email', href: '#' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-deep bg-noise text-white print:hidden">
      {/* Ambient orbs — keeps the dark band from reading as a flat slab */}
      <div className="orb -left-24 top-0 h-72 w-72 bg-brand-500/20" aria-hidden="true" />
      <div className="orb -right-16 bottom-0 h-80 w-80 bg-indigo-500/14" aria-hidden="true" />

      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        {/* ── Newsletter / CTA row ── */}
        <Reveal direction="up">
          <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between md:py-14">
            <div className="max-w-lg">
              <h3 className="text-h2 text-white">Ready to plan your next trip?</h3>
              <p className="mt-2.5 text-body text-white/60">
                Build a grounded, budget-aware itinerary in under a minute — no signup required.
              </p>
            </div>
            <Link to="/" className="btn-primary btn-lg shrink-0 self-start md:self-auto">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start Planning
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-2 md:grid-cols-4 md:py-14">
          {/* Brand blurb spans wider on desktop */}
          <div className="col-span-2 md:col-span-2 md:pr-10">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="icon-box h-9 w-9 rounded-sm bg-grad-brand text-white shadow-glow-brand">
                <Compass className="h-4.5 w-4.5" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="text-[1.0625rem] font-bold tracking-tight text-white">TripGenie</span>
            </Link>
            <p className="mt-4 max-w-sm text-small leading-relaxed text-white/55">
              An AI travel planner built on Retrieval-Augmented Generation. Every
              recommendation is grounded in real travel guides — retrieved, reranked,
              then written into a day-by-day plan that respects your budget.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/12 bg-white/[0.06] text-white/65 transition-all duration-base hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/12 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h4 className="text-caption uppercase tracking-[0.045em] text-white/40">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-small text-white/62 transition-colors duration-base hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-base group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Legal bar ── */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-7 text-caption text-white/42 sm:flex-row sm:items-center">
          <p>© {year} TripGenie. Built as a full-stack RAG demonstration.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <span className="status-dot animate-pulse bg-brand-400" aria-hidden="true" />
              All systems operational
            </span>
            <span className="hidden sm:inline">MERN · RAG · Groq</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
