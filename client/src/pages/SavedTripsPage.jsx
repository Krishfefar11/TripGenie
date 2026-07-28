import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, MapPin, Calendar, DollarSign, Trash2, ArrowRight,
  PlaneTakeoff, Sparkles,
} from 'lucide-react';
import { tripService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import IconBadge from '../components/ui/IconBadge';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';

/** Rotating accent per card so a grid of saved trips reads as distinct items. */
const ACCENTS = ['brand', 'indigo', 'violet', 'sky', 'amber', 'teal', 'rose'];
const RAIL = {
  brand: 'bg-grad-brand', indigo: 'bg-grad-indigo', violet: 'bg-grad-violet',
  sky: 'bg-grad-sky', amber: 'bg-grad-amber', teal: 'bg-grad-teal', rose: 'bg-grad-rose',
};

const SavedTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripService.getAll();
      setTrips(response.trips || []);
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
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const openTrip = (trip) => navigate('/itinerary', { state: { itinerary: trip } });

  if (loading) {
    return <LoadingSpinner message="Loading your journeys…" sub="Fetching saved itineraries." />;
  }

  return (
    <div className="relative overflow-x-clip">
      <div className="absolute inset-x-0 top-0 h-72 bg-mesh" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-72 bg-grid" aria-hidden="true" />

      <div className="relative mx-auto max-w-wide px-5 py-12 sm:px-8 sm:py-16">

        {/* ── Header ── */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3.5">
            <IconBadge icon={Heart} accent="rose" size="lg" />
            <div>
              <Reveal><h1 className="text-h1 text-ink">Saved Journeys</h1></Reveal>
              <Reveal delay={0.06}>
                <p className="mt-1 text-small text-ink-soft">
                  {trips.length > 0
                    ? `${trips.length} itinerar${trips.length === 1 ? 'y' : 'ies'} in your collection`
                    : 'Your collection of AI-crafted itineraries'}
                </p>
              </Reveal>
            </div>
          </div>

          {trips.length > 0 && (
            <Reveal direction="left" delay={0.1}>
              <button onClick={() => navigate('/')} className="btn-primary shrink-0">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Plan another
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </button>
            </Reveal>
          )}
        </div>

        {/* ── Content ── */}
        {trips.length === 0 ? (
          <Reveal direction="up" delay={0.14} className="mt-12">
            <div className="card-gradient relative overflow-hidden rounded-xl px-7 py-20 text-center">
              <div className="orb -left-12 -top-12 h-56 w-56 bg-brand-400/16" aria-hidden="true" />
              <div className="orb -bottom-14 -right-10 h-56 w-56 bg-indigo-500/14" aria-hidden="true" />

              <div className="relative mx-auto max-w-md">
                <span className="icon-box mx-auto h-[4.5rem] w-[4.5rem] rounded-xl bg-grad-brand text-white shadow-glow-brand">
                  <PlaneTakeoff className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
                </span>
                <h2 className="mt-7 text-h1 text-ink">No saved trips yet</h2>
                <p className="mx-auto mt-3 max-w-sm text-body text-ink-soft">
                  Generate an itinerary and hit <span className="font-semibold text-ink">Save trip</span> —
                  it'll live here so you can pull it up on the road.
                </p>
                <button onClick={() => navigate('/')} className="btn-primary btn-lg mt-8">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Plan your first trip
                  <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" gap={0.07}>
            {trips.map((trip, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <StaggerItem key={trip._id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openTrip(trip)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openTrip(trip);
                      }
                    }}
                    aria-label={`Open itinerary for ${trip.destination}`}
                    className="card card-hover group relative flex h-full cursor-pointer flex-col overflow-hidden p-6"
                  >
                    {/* Top accent rail */}
                    <span
                      className={`absolute inset-x-0 top-0 h-[3px] ${RAIL[accent]}`}
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <IconBadge icon={MapPin} accent={accent} size="md" />
                      <button
                        type="button"
                        onClick={(e) => handleDelete(trip._id, e)}
                        aria-label={`Delete trip to ${trip.destination}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-faint opacity-0 transition-all duration-base hover:bg-error/10 hover:text-error focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className="mt-4 truncate text-h2 text-ink">{trip.destination}</h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="pill">
                        <Calendar className="h-3 w-3 text-indigo-600" aria-hidden="true" />
                        <span className="data-num font-semibold">{trip.days}</span> days
                      </span>
                      <span className="pill">
                        <DollarSign className="h-3 w-3 text-amber-600" aria-hidden="true" />
                        <span className="data-num font-semibold">
                          ${Number(trip.budget)?.toLocaleString()}
                        </span>
                      </span>
                    </div>

                    {Array.isArray(trip.interests) && trip.interests.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {trip.interests.slice(0, 3).map((interest, idx) => (
                          <span
                            key={idx}
                            className="rounded-pill bg-ink/[0.05] px-2 py-0.5 text-caption font-medium text-ink-muted"
                          >
                            {interest}
                          </span>
                        ))}
                        {trip.interests.length > 3 && (
                          <span className="rounded-pill bg-ink/[0.05] px-2 py-0.5 text-caption font-medium text-ink-muted">
                            +{trip.interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-tiny font-semibold text-ink">
                      <span>View itinerary</span>
                      <ArrowRight
                        className="h-4 w-4 -translate-x-1 text-ink-faint opacity-0 transition-all duration-base group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </div>
  );
};

export default SavedTripsPage;
