import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import {
  Heart, MapPin, Calendar, DollarSign,
  Trash2, ArrowRight, PlaneTakeoff
} from 'lucide-react';
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-h1-sm text-ink flex items-center gap-3">
            <Heart className="w-6 h-6 text-ink" />
            Saved Journeys
          </h1>
          <p className="text-body text-ink-secondary text-sm">Your collection of AI-crafted itineraries</p>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-24 card rounded-lg">
          <div className="w-16 h-16 border border-hairline rounded-md flex items-center justify-center mx-auto mb-6">
            <PlaneTakeoff className="w-7 h-7 text-ink" />
          </div>
          <h2 className="font-display text-h2 text-ink mb-3">No Saved Trips Yet</h2>
          <p className="text-ink-secondary max-w-sm mx-auto mb-8 text-sm">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <div
              key={trip._id}
              onClick={() => handleTripClick(trip)}
              className="card-suite rounded-lg p-6 group cursor-pointer"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 border border-hairline rounded-md flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-ink" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(trip._id, e)}
                    className="p-1.5 text-ink-secondary hover:text-ink hover:bg-ink/5 rounded transition-colors duration-base"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-h2 text-ink mb-2 truncate">
                    {trip.destination}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-ink-secondary">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.days} days
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      ${trip.budget}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trip.interests.slice(0, 3).map((interest, idx) => (
                    <span key={idx} className="border border-hairline text-ink-secondary caption px-2 py-0.5 rounded">
                      {interest}
                    </span>
                  ))}
                  {trip.interests.length > 3 && (
                    <span className="border border-hairline text-ink-secondary caption px-2 py-0.5 rounded">
                      +{trip.interests.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-5 border-t border-hairline flex items-center justify-between text-ink text-ui uppercase">
                  View Itinerary
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTripsPage;
