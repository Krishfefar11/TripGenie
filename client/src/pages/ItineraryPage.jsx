import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Bookmark, CheckCircle,
  MapPin, Calendar, DollarSign,
  Utensils, Camera, CloudSun, Briefcase
} from 'lucide-react';
import ItineraryCard from '../components/ItineraryCard';
import BudgetBreakdown from '../components/BudgetBreakdown';
import PackingList from '../components/PackingList';
import TravelTips from '../components/TravelTips';
import WeatherInfo from '../components/WeatherInfo';
import LoadingSpinner from '../components/LoadingSpinner';
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
    if (location.state && location.state.itinerary) {
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

  // Fix: working Download PDF using window.print()
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner message="Finalizing your itinerary..." />;

  const {
    destination,
    summary,
    itinerary,
    budgetBreakdown,
    travelTips,
    packingList,
    localFood,
    lessCrowdedPlaces,
    weatherInfo,
    days,
    budget: totalBudget,
  } = data;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 print:py-4 print:space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors duration-base print:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Planner</span>
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <h1 className="font-display text-h1-sm md:text-h1 text-ink leading-none">
              {destination}
            </h1>
            <span className="px-2.5 py-1 border border-ink text-ink caption rounded mb-1">
              AI Generated
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-ink-secondary text-sm">
            <div className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 rounded">
              <Calendar className="w-3.5 h-3.5" />
              {days} Days
            </div>
            <div className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 rounded">
              <DollarSign className="w-3.5 h-3.5" />
              ${totalBudget?.toLocaleString()} Budget
            </div>
            {weatherInfo?.condition && (
              <div className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 rounded">
                <CloudSun className="w-3.5 h-3.5" />
                {weatherInfo.condition}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="btn-primary"
            >
              {saved
                ? <><span className="status-dot bg-success" /> Saved</>
                : saving
                  ? <><Bookmark className="w-4 h-4" /> Saving...</>
                  : <><Bookmark className="w-4 h-4" /> Save Trip</>
              }
            </button>

            <button
              onClick={handleDownloadPDF}
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          {saveError && (
            <p className="text-xs text-error">{saveError}</p>
          )}
        </div>
      </div>

      {/* ── Summary Pull Quote ── */}
      <section className="card-lift rounded-lg p-8 md:p-10">
        <p className="caption mb-3">AI Trip Summary</p>
        <p className="pull-quote">
          "{summary}"
        </p>
      </section>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left: Day-by-Day Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-hairline rounded-md flex items-center justify-center">
              <MapPin className="w-4 h-4 text-ink" />
            </div>
            <h2 className="font-display text-h2 text-ink">Day-by-Day Journey</h2>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-px before:bg-hairline">
            {Array.isArray(itinerary) && itinerary.map((day, i) => (
              <ItineraryCard key={i} dayData={day} index={i} />
            ))}
          </div>
        </div>

        {/* Right: Sidebar — quick-glance stats only, sticky against the day list */}
        <aside className="space-y-8 lg:sticky lg:top-20 h-fit">
          <BudgetBreakdown breakdown={budgetBreakdown} />
          <WeatherInfo weather={weatherInfo} />
        </aside>
      </div>

      {/* ── Trip Essentials — full-width, decoupled from the day-count-dependent column above ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-hairline rounded-md flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-ink" />
          </div>
          <h2 className="font-display text-h2 text-ink">Trip Essentials</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          <PackingList items={packingList} />
          <TravelTips tips={travelTips} />

          {/* Local Food */}
          {Array.isArray(localFood) && localFood.length > 0 && (
            <div className="card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 border border-hairline rounded-md flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-ink" />
                </div>
                <div>
                  <h2 className="font-display text-h2 text-ink">Local Flavors</h2>
                  <p className="caption">Culinary Gems</p>
                </div>
              </div>
              <ul className="space-y-3">
                {localFood.map((food, i) => (
                  <li key={i} className="flex gap-3 p-3 card-lift rounded-md">
                    <span className="shrink-0 w-6 h-6 border border-hairline rounded-md text-ink-secondary flex items-center justify-center data-figure">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink-secondary leading-snug self-center">
                      {typeof food === 'string' ? food : food.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hidden Gems */}
          {Array.isArray(lessCrowdedPlaces) && lessCrowdedPlaces.length > 0 && (
            <div className="card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 border border-hairline rounded-md flex items-center justify-center">
                  <Camera className="w-4 h-4 text-ink" />
                </div>
                <div>
                  <h2 className="font-display text-h2 text-ink">Hidden Gems</h2>
                  <p className="caption">Off-the-beaten-path</p>
                </div>
              </div>
              <ul className="space-y-3">
                {lessCrowdedPlaces.map((place, i) => (
                  <li key={i} className="flex gap-3 p-3 card-lift rounded-md">
                    <span className="shrink-0 w-6 h-6 border border-hairline rounded-md text-ink flex items-center justify-center text-xs">
                      ★
                    </span>
                    <span className="text-sm text-ink-secondary leading-snug self-center">
                      {typeof place === 'string' ? place : place.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ItineraryPage;
