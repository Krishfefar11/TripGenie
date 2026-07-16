import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, Calendar, DollarSign, Heart, Loader2 } from 'lucide-react';
import { itineraryService } from '../services/api';

const inputClass =
  'w-full px-4 py-3 bg-pearl border border-hairline rounded text-body text-ink placeholder:text-ink-secondary/60 outline-none transition-colors duration-base hover:border-ink/40 focus:border-ink focus:bg-ink/5';

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
    <div className="max-w-3xl mx-auto card rounded-lg p-6 md:p-10">
      <p className="caption mb-6">Plan a New Trip</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-ui uppercase text-ink-secondary">
              <MapPin className="w-3.5 h-3.5" />
              Where To?
            </label>
            <input
              type="text"
              name="destination"
              placeholder="e.g. Paris, Bali, Tokyo..."
              required
              value={formData.destination}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Days */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-ui uppercase text-ink-secondary">
                <Calendar className="w-3.5 h-3.5" />
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
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-ui uppercase text-ink-secondary">
                <DollarSign className="w-3.5 h-3.5" />
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
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-ui uppercase text-ink-secondary">
            <Heart className="w-3.5 h-3.5" />
            Interests
          </label>
          <input
            type="text"
            name="interests"
            placeholder="e.g. Food, Culture, Adventure, Nightlife..."
            value={formData.interests}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Custom Query */}
        <div className="space-y-2">
          <label className="text-ui uppercase text-ink-secondary">Custom Message (Optional)</label>
          <textarea
            name="query"
            placeholder="Any specific requests? e.g. 'Highly local experience', 'Kid-friendly places', 'Vegan food focus'..."
            value={formData.query}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Itinerary
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
