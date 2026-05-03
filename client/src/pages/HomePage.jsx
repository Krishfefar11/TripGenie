import React from 'react';
import TripForm from '../components/TripForm';
import { Sparkles, Shield, Zap, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// FIX: Removed unused 'Globe' import

const FEATURES = [
  {
    title: 'Smart RAG Intelligence',
    desc: 'Retrieves information from real travel guides and documents, so every recommendation is grounded in genuine knowledge.',
    icon: Zap,
    gradient: 'from-orange-400 to-rose-500',
    shadow: 'shadow-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    title: 'Budget Optimizer',
    desc: 'Every itinerary is precision-crafted within your financial limits, with per-category cost breakdowns for full transparency.',
    icon: Shield,
    gradient: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    title: 'Contextual AI Chat',
    desc: 'Follow up with our travel assistant at any time — modify plans, ask for tips, or explore hidden gems by simply chatting.',
    icon: MessageSquare,
    gradient: 'from-indigo-400 to-purple-500',
    shadow: 'shadow-indigo-200',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
];

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-24 py-10">

      {/* ── Hero Section ── */}
      <section className="text-center space-y-8 px-4 relative">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-100/60 via-purple-100/40 to-pink-100/60 rounded-full blur-3xl opacity-80" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 text-primary border border-indigo-100 rounded-full text-sm font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-4 h-4" />
            Next-Gen AI Travel Planning
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
            Your Personal <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Travel Architect
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            TripGenie uses advanced Retrieval-Augmented Generation to craft deeply personalised
            travel itineraries from real-world data and your unique preferences.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 pt-2"
        >
          {[
            { value: '50+', label: 'Destinations' },
            { value: 'RAG', label: 'Powered' },
            { value: '100%', label: 'Personalised' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center px-6 py-3 bg-white/80 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-sm">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Trip Planning Form ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 px-4"
      >
        <TripForm />
      </motion.section>

      {/* ── Features Grid ── */}
      <section className="px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why TripGenie?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Built on cutting-edge AI, it goes beyond generic itineraries to deliver travel plans that actually fit you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              className="modern-card group relative overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

              <div className={`w-12 h-12 bg-gradient-to-br ${feat.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${feat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feat.desc}</p>

              <div className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${feat.text} ${feat.bg} px-3 py-1.5 rounded-full`}>
                <feat.icon className="w-3 h-3" />
                Explore feature
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
