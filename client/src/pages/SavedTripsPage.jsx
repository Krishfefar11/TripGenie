import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import { 
  Heart, MapPin, Calendar, DollarSign, 
  Trash2, ArrowRight, PlaneTakeoff, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const SavedTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripService.getAll();
      setTrips(response.trips || []); // FIX: guard against undefined trips field
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Remove this trip from your collection?')) return;
    
    try {
      await tripService.delete(id);
      setTrips(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleTripClick = (trip) => {
    navigate('/itinerary', { state: { itinerary: trip } });
  };

  if (loading) return <LoadingSpinner message="Retrieving your saved journeys..." />;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            Saved Journeys
          </h1>
          <p className="text-slate-500 font-medium">Your collection of AI-crafted itineraries</p>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 glass rounded-[2rem] border-white/40 shadow-xl">
          <div className="w-20 h-20 bg-indigo-50 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <PlaneTakeoff className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Saved Trips Yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Start planning your next adventure and save your favorites to view them here.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Start Planning
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {trips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => handleTripClick(trip)}
                className="modern-card group cursor-pointer border-indigo-50/50"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(trip._id, e)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">
                      {trip.destination}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary/50" />
                        {trip.days} Days
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-primary/50" />
                        ${trip.budget}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trip.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                        {interest}
                      </span>
                    ))}
                    {trip.interests.length > 3 && (
                      <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md">
                        +{trip.interests.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-primary font-bold text-sm uppercase tracking-widest group-hover:gap-2 transition-all">
                    View Full Itinerary
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SavedTripsPage;
