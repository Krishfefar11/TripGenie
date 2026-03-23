import React from 'react';
import TripForm from '../components/TripForm';
import { Sparkles, Globe, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 bg-indigo-50 text-primary rounded-full text-sm font-semibold tracking-wide uppercase">
            Next-Gen Travel Planning
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
            Your Personal <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Travel Architect
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            TripGenie uses advanced data retrieval to craft personalized travel itineraries 
            based on real travel data and your unique preferences.
          </p>
        </motion.div>
      </section>

      {/* Planning Form Section */}
      <section className="relative z-10 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-tr from-indigo-50/50 via-purple-50/50 to-pink-50/50 -z-10 blur-3xl opacity-60 rounded-full" />
        <TripForm />
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 px-4 pb-20">
        {[
          {
            title: 'Smart Intelligence',
            desc: 'Our system retrieves information from thousands of travel blogs and documents to ensure accuracy.',
            icon: Zap,
            color: 'bg-orange-50 text-orange-500'
          },
          {
            title: 'Budget Optimization',
            desc: 'Every itinerary is crafted within your financial boundaries, suggesting costs for each activity.',
            icon: Shield,
            color: 'bg-green-50 text-green-500'
          },
          {
            title: 'Contextual Chat',
            desc: 'Follow up with our smart assistant anytime to modify your plans or ask for specific tips.',
            icon: MessageSquare,
            color: 'bg-blue-50 text-blue-500'
          }
        ].map((feat, i) => (
          <div key={i} className="modern-card group">
            <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

const MessageSquare = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default HomePage;
