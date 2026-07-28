import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Bookmark, MapPin, Calendar, DollarSign,
  Utensils, Camera, CloudSun, Briefcase, Star, Sparkles, CheckCircle2, AlertCircle,
} from 'lucide-react';
import ItineraryCard from '../components/ItineraryCard';
import BudgetBreakdown from '../components/BudgetBreakdown';
import PackingList from '../components/PackingList';
import TravelTips from '../components/TravelTips';
import WeatherInfo from '../components/WeatherInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import IconBadge from '../components/ui/IconBadge';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { tripService } from '../services/api';

const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (location.state?.itinerary) {
      setData(location.state.itinerary);
      setLoading(false);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await tripService.save(data);
      setSaved(true);
    } catch (error) {
      console.error('Error saving trip:', error);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => window.print();

  if (loading) {
    return <LoadingSpinner message="Finalizing your itinerary…" sub="Assembling the day-by-day plan." />;
  }

  const {
    destination, summary, itinerary, budgetBreakdown, travelTips, packingList,
    localFood, lessCrowdedPlaces, weatherInfo, days, budget: totalBudget,
    retrievedSources,
  } = data;
  const isGrounded = retrievedSources > 0;

  return (
    <div className="overflow-x-clip">

      {/* ═══════════════ HEADER BAND ═══════════════ */}
      <section className="relative isolate overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-grid" aria-hidden="true" />

        <div className="relative mx-auto max-w-wide px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost -ml-3 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to planner
          </button>

          <div className="mt-5 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <Reveal>
                {isGrounded ? (
                  <span className="eyebrow rounded-pill border border-brand-500/18 bg-white/70 px-3 py-1.5 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Grounded in {retrievedSources} retrieved source{retrievedSources === 1 ? '' : 's'}
                  </span>
                ) : (
                  <span className="eyebrow rounded-pill border border-ink-faint/25 bg-white/70 px-3 py-1.5 text-ink-muted backdrop-blur">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    No matching guide in corpus — built from general knowledge
                  </span>
                )}
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-4 text-hero text-ink text-balance">
                  <span className="text-gradient">{destination}</span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="pill">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                    <span className="data-num font-semibold">{days}</span> days
                  </span>
                  <span className="pill">
                    <DollarSign className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                    <span className="data-num font-semibold">${totalBudget?.toLocaleString()}</span> budget
                  </span>
                  {weatherInfo?.condition && (
                    <span className="pill">
                      <CloudSun className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
                      {weatherInfo.condition}
                    </span>
                  )}
                  {Array.isArray(itinerary) && itinerary.length > 0 && (
                    <span className="pill">
                      <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                      <span className="data-num font-semibold">{itinerary.length * 3}</span> activities
                    </span>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Actions */}
            <Reveal direction="left" delay={0.1} className="shrink-0 print:hidden">
              <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                <button onClick={handleSave} disabled={saved || saving} className="btn-primary">
                  {saved ? (
                    <><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved</>
                  ) : saving ? (
                    <><Bookmark className="h-4 w-4 animate-pulse" aria-hidden="true" /> Saving…</>
                  ) : (
                    <><Bookmark className="h-4 w-4" aria-hidden="true" /> Save trip</>
                  )}
                </button>
                <button onClick={handleDownloadPDF} className="btn-secondary">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PDF
                </button>
              </div>
              {saveError && (
                <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-caption text-error">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {saveError}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ SUMMARY ═══════════════ */}
      {summary && (
        <section className="mx-auto max-w-wide px-5 pt-10 sm:px-8">
          <Reveal direction="up">
            <div className="card-gradient relative overflow-hidden rounded-xl p-7 sm:p-9">
              <div className="orb -right-14 -top-14 h-48 w-48 bg-brand-400/16" aria-hidden="true" />
              <div className="relative flex gap-4">
                <IconBadge icon={Sparkles} accent="brand" size="md" />
                <div className="min-w-0">
                  <p className="caption-meta">Trip summary</p>
                  <p className="pull-quote mt-2">{summary}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ═══════════════ MAIN GRID ═══════════════ */}
      <section className="mx-auto max-w-wide px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-12">

          {/* ── Day-by-day timeline ── */}
          <div className="min-w-0">
            <div className="mb-8 flex items-center gap-3">
              <IconBadge icon={MapPin} accent="brand" size="sm" />
              <div>
                <h2 className="text-h1 text-ink">Day-by-Day</h2>
                <p className="caption-meta mt-0.5">Your full route</p>
              </div>
            </div>

            {/* Gradient rail runs behind the day nodes */}
            <div className="relative">
              <span
                className="absolute left-[17px] top-3 bottom-3 w-[2px] rounded-pill bg-gradient-to-b from-brand-500/45 via-indigo-500/28 to-transparent sm:left-[19px]"
                aria-hidden="true"
              />
              <div className="space-y-5">
                {Array.isArray(itinerary) && itinerary.map((day, i) => (
                  <Reveal key={i} direction="up" delay={i * 0.06} amount={0.15}>
                    <ItineraryCard dayData={day} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sticky sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <Reveal direction="left"><BudgetBreakdown breakdown={budgetBreakdown} /></Reveal>
            <Reveal direction="left" delay={0.08}><WeatherInfo weather={weatherInfo} /></Reveal>
          </aside>
        </div>
      </section>

      {/* ═══════════════ ESSENTIALS ═══════════════ */}
      <section className="relative overflow-hidden bg-mesh-soft py-16 sm:py-20">
        <div className="relative mx-auto max-w-wide px-5 sm:px-8">
          <div className="mb-9 flex items-center gap-3">
            <IconBadge icon={Briefcase} accent="indigo" size="sm" />
            <div>
              <h2 className="text-h1 text-ink">Trip Essentials</h2>
              <p className="caption-meta mt-0.5">Everything else you'll want on hand</p>
            </div>
          </div>

          <Stagger className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4" gap={0.08}>
            <StaggerItem><PackingList items={packingList} /></StaggerItem>
            <StaggerItem><TravelTips tips={travelTips} /></StaggerItem>

            {/* Local flavors */}
            {Array.isArray(localFood) && localFood.length > 0 && (
              <StaggerItem>
                <section className="card flex h-full flex-col p-6" aria-label="Local flavors">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={Utensils} accent="rose" size="sm" />
                    <div>
                      <h2 className="text-h3 text-ink">Local Flavors</h2>
                      <p className="caption-meta mt-0.5">What to eat</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {localFood.map((food, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-md border border-line bg-surface-sunken p-3"
                      >
                        <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-rose-500/12 text-[0.625rem] font-bold text-rose-700">
                          {i + 1}
                        </span>
                        <span className="text-tiny leading-relaxed text-ink-soft">
                          {typeof food === 'string' ? food : food.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </StaggerItem>
            )}

            {/* Hidden gems */}
            {Array.isArray(lessCrowdedPlaces) && lessCrowdedPlaces.length > 0 && (
              <StaggerItem>
                <section className="card flex h-full flex-col p-6" aria-label="Hidden gems">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={Camera} accent="teal" size="sm" />
                    <div>
                      <h2 className="text-h3 text-ink">Hidden Gems</h2>
                      <p className="caption-meta mt-0.5">Off the beaten path</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {lessCrowdedPlaces.map((place, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-md border border-line bg-surface-sunken p-3"
                      >
                        <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-teal-500/22 text-teal-600" aria-hidden="true" />
                        <span className="text-tiny leading-relaxed text-ink-soft">
                          {typeof place === 'string' ? place : place.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </StaggerItem>
            )}
          </Stagger>
        </div>
      </section>
    </div>
  );
};

export default ItineraryPage;
