import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, Calendar, DollarSign, Heart, Loader2 } from 'lucide-react';
import { itineraryService } from '../services/api';
import { motion } from 'framer-motion';

const TripForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 1000,
    interests: '',
    query: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await itineraryService.generate(formData);
      // Navigate to itinerary page with the result data
      navigate('/itinerary', { state: { itinerary: result.data } });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2rem] shadow-2xl border-white/40"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Destination */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-primary" />
              Where to?
            </label>
            <input
              type="text"
              name="destination"
              placeholder="e.g. Paris, Bali, Tokyo..."
              required
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-lg"
            />
          </div>

          {/* Days */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-primary" />
                Duration
              </label>
              <input
                type="number"
                name="days"
                min="1"
                max="30"
                required
                value={formData.days}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-primary" />
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                min="100"
                step="100"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-primary" />
            Interests
          </label>
          <input
            type="text"
            name="interests"
            placeholder="e.g. Food, Culture, Adventure, Nightlife..."
            value={formData.interests}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
          />
        </div>

        {/* Custom Query */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1 uppercase tracking-wider">
            Custom Message (Optional)
          </label>
          <textarea
            name="query"
            placeholder="Any specific requests? e.g. 'Highly local experience', 'Kid-friendly places', 'Vegan food focus'..."
            value={formData.query}
            onChange={handleChange}
            rows={3}
            className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-3 text-xl py-5 rounded-[1.25rem] group"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Manifesting Your Trip...
            </>
          ) : (
            <>
              Generate Itinerary
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default TripForm;
