import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, MapPin, Calendar, DollarSign, Heart, Loader2,
  MessageSquareMore, AlertCircle, Minus, Plus,
} from 'lucide-react';
import { itineraryService } from '../services/api';
import MediaUpload from './MediaUpload';
import { cn } from '../utils/cn';

/** Curated starting points — still free-text editable via the input below. */
const INTEREST_PRESETS = [
  'Food', 'Culture', 'History', 'Nature', 'Adventure',
  'Nightlife', 'Art', 'Shopping', 'Beaches', 'Architecture',
];

const BUDGET_PRESETS = [500, 1000, 2500, 5000];

const TripForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 1000,
    interests: '',
    query: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [mediaContext, setMediaContext] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (tag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const stepDays = (delta) => {
    setFormData((prev) => ({
      ...prev,
      days: Math.min(30, Math.max(1, Number(prev.days) + delta)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Chips and the free-text field both feed the same `interests` value the
    // API already expects — merged and de-duplicated.
    const merged = [
      ...selectedInterests,
      ...formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
    ];
    const interests = [...new Set(merged)].join(', ');

    try {
      const result = await itineraryService.generate({ ...formData, interests, mediaContext });
      navigate('/itinerary', { state: { itinerary: result.data } });
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(
        err.response?.data?.error ||
        'Could not generate your itinerary. The server may be waking up — please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="card-gradient overflow-hidden rounded-xl">
        <div className="space-y-7 p-6 sm:p-9">

          {/* ── Destination ── */}
          <div className="space-y-2">
            <label htmlFor="destination" className="label-form">
              <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
              Where to?
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                aria-hidden="true"
              />
              <input
                id="destination"
                type="text"
                name="destination"
                placeholder="Paris, Bali, Tokyo, Rome…"
                required
                value={formData.destination}
                onChange={handleChange}
                className="input input-icon-pad text-lead"
              />
            </div>
          </div>

          {/* ── Duration + Budget ── */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Days stepper */}
            <div className="space-y-2">
              <label htmlFor="days" className="label-form">
                <Calendar className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                Duration
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepDays(-1)}
                  disabled={Number(formData.days) <= 1}
                  aria-label="Decrease duration by one day"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-line bg-white text-ink-soft transition-all duration-base hover:border-line-strong hover:text-ink disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="relative flex-1">
                  <input
                    id="days"
                    type="number"
                    name="days"
                    min="1"
                    max="30"
                    required
                    value={formData.days}
                    onChange={handleChange}
                    className="input text-center font-semibold tabular-nums"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-caption text-ink-faint">
                    {Number(formData.days) === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => stepDays(1)}
                  disabled={Number(formData.days) >= 30}
                  aria-label="Increase duration by one day"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-line bg-white text-ink-soft transition-all duration-base hover:border-line-strong hover:text-ink disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Budget with quick presets */}
            <div className="space-y-2">
              <label htmlFor="budget" className="label-form">
                <DollarSign className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                Total budget
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-small font-semibold text-ink-faint">
                  $
                </span>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  min="100"
                  step="100"
                  required
                  value={formData.budget}
                  onChange={handleChange}
                  className="input pl-8 font-semibold tabular-nums"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {BUDGET_PRESETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, budget: b }))}
                    aria-pressed={Number(formData.budget) === b}
                    className={cn(
                      'rounded-pill border px-2.5 py-1 text-caption font-semibold transition-all duration-base',
                      Number(formData.budget) === b
                        ? 'border-amber-500/30 bg-amber-500/12 text-amber-700'
                        : 'border-line bg-white text-ink-muted hover:border-line-strong hover:text-ink'
                    )}
                  >
                    ${b.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rule" />

          {/* ── Interests as chips ── */}
          <fieldset className="space-y-3">
            <legend className="label-form">
              <Heart className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
              What are you into?
              <span className="ml-1 font-normal text-ink-faint">(optional)</span>
            </legend>

            <div className="flex flex-wrap gap-2">
              {INTEREST_PRESETS.map((tag) => {
                const active = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    aria-pressed={active}
                    className={cn('chip', active && 'chip-active')}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              name="interests"
              aria-label="Additional interests, comma separated"
              placeholder="Anything else? Comma separated — e.g. jazz bars, street markets"
              value={formData.interests}
              onChange={handleChange}
              className="input text-small"
            />
          </fieldset>

          <div className="rule" />

          {/* ── Media upload ── */}
          <MediaUpload onContextChange={setMediaContext} />

          <div className="rule" />

          {/* ── Custom query ── */}
          <div className="space-y-2">
            <label htmlFor="query" className="label-form">
              <MessageSquareMore className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
              Anything specific?
              <span className="ml-1 font-normal text-ink-faint">(optional)</span>
            </label>
            <textarea
              id="query"
              name="query"
              placeholder="e.g. “Highly local experience, avoid tourist traps”, “Kid-friendly”, “Vegan food focus”…"
              value={formData.query}
              onChange={handleChange}
              rows={3}
              className="input resize-none text-small"
            />
          </div>

          {/* ── Error state ── */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-md border border-error/22 bg-error/[0.055] px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
              <p className="text-small text-ink-soft">{error}</p>
            </div>
          )}
        </div>

        {/* ── Submit bar ── */}
        <div className="border-t border-line bg-surface-sunken px-6 py-5 sm:px-9">
          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Retrieving sources & generating…
              </>
            ) : (
              <>
                Generate my itinerary
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-caption text-ink-muted">
            {loading
              ? 'Hybrid search → cross-encoder rerank → grounded generation'
              : 'Free · No signup · Takes about 20–60 seconds'}
          </p>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
