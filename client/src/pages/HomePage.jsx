import React from 'react';
import TripForm from '../components/TripForm';
import { Zap, Shield, MessageSquare, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    title: 'Smart RAG Intelligence',
    desc: 'Retrieves information from real travel guides and documents, so every recommendation is grounded in genuine knowledge.',
    icon: Zap,
  },
  {
    title: 'Budget Optimizer',
    desc: 'Every itinerary is precision-crafted within your financial limits, with per-category cost breakdowns for full transparency.',
    icon: Shield,
  },
  {
    title: 'Contextual AI Chat',
    desc: 'Follow up with our travel assistant at any time — modify plans, ask for tips, or explore hidden gems by simply chatting.',
    icon: MessageSquare,
  },
];

const HomePage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-24 md:space-y-[128px] py-16 md:py-24">

      {/* ── Hero Section ── */}
      <section className="text-center space-y-8 px-4">
        <p className="caption">Next-Gen AI Travel Planning</p>

        <h1 className="font-display text-hero-sm md:text-hero text-ink">
          Your Personal<br />Travel Architect
        </h1>

        <p className="text-body text-ink-secondary max-w-2xl mx-auto">
          TripGenie uses advanced Retrieval-Augmented Generation to craft deeply personalised
          travel itineraries from real-world data and your unique preferences.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {[
            { value: '50+', label: 'Destinations' },
            { value: 'RAG', label: 'Powered' },
            { value: '100%', label: 'Personalised' },
          ].map((stat, i) => (
            <div key={i} className="card-lift rounded-lg px-8 py-5 min-w-[130px]">
              <div className="data-figure text-ink text-lg">{stat.value}</div>
              <div className="caption mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trip Planning Form ── */}
      <section className="px-4">
        <TripForm />
      </section>

      {/* ── Features Grid ── */}
      <section className="px-4 pb-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-h2 text-ink mb-3">Why TripGenie?</h2>
          <p className="text-body text-ink-secondary max-w-xl mx-auto">
            Built on cutting-edge AI, it goes beyond generic itineraries to deliver travel plans that actually fit you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => (
            <div key={i} className="card rounded-lg p-7">
              <div className="w-9 h-9 border border-hairline rounded-md flex items-center justify-center mb-5">
                <feat.icon className="w-4 h-4 text-ink" />
              </div>

              <h3 className="font-display text-h2 text-ink mb-2">{feat.title}</h3>
              <p className="text-body text-ink-secondary text-sm leading-relaxed">{feat.desc}</p>

              <div className="mt-5 inline-flex items-center gap-1 text-ui uppercase text-ink-secondary hover:text-ink transition-colors duration-base">
                Explore
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
