import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Bookmark, CheckCircle,
  MapPin, Calendar, DollarSign, Sparkles,
  Utensils, Camera, CloudSun
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 animate-fade-in print:py-4 print:space-y-6">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group print:hidden"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Planner</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-outfit leading-tight">
              {destination}
            </h1>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-indigo-200">
              AI Generated
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-500 font-medium text-sm">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {days} Days
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              ${totalBudget?.toLocaleString()} Budget
            </div>
            {weatherInfo?.condition && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <CloudSun className="w-4 h-4 text-amber-400" />
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all duration-300 ${
                saved
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default'
                  : 'bg-white text-primary border-primary/20 hover:bg-indigo-50'
              }`}
            >
              {saved
                ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                : saving
                  ? <><span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Saving...</>
                  : <><Bookmark className="w-4 h-4" /> Save Trip</>
              }
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 btn-primary text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          {saveError && (
            <p className="text-xs text-red-500 font-medium">{saveError}</p>
          )}
        </div>
      </motion.div>

      {/* ── Summary Banner ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-2xl shadow-indigo-300/40"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">AI Trip Summary</p>
            <p className="text-lg md:text-xl leading-relaxed font-medium text-white/95 italic">
              "{summary}"
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left: Day-by-Day Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Day-by-Day Journey</h2>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-indigo-200 before:via-purple-200 before:to-pink-200">
            {Array.isArray(itinerary) && itinerary.map((day, i) => (
              <ItineraryCard key={i} dayData={day} index={i} />
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-10 h-fit">

          <BudgetBreakdown breakdown={budgetBreakdown} />
          <WeatherInfo weather={weatherInfo} />

          {/* Packing + Tips */}
          <div className="bg-slate-50/80 rounded-3xl border border-slate-100 overflow-hidden">
            <p className="px-6 pt-5 pb-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Preparation & Insights
            </p>
            <PackingList items={packingList} />
            <div className="mt-4">
              <TravelTips tips={travelTips} />
            </div>
          </div>

          {/* Local Food */}
          {Array.isArray(localFood) && localFood.length > 0 && (
            <div className="modern-card bg-orange-50/60 border-orange-100/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Local Flavors</h2>
                  <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Culinary Gems</p>
                </div>
              </div>
              <ul className="space-y-3">
                {localFood.map((food, i) => (
                  <li key={i} className="flex group gap-3 p-3 bg-white/80 rounded-2xl border border-orange-100/60 hover:border-orange-300 hover:shadow-sm transition-all">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700 leading-snug font-medium self-center">
                      {typeof food === 'string' ? food : food.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hidden Gems */}
          {Array.isArray(lessCrowdedPlaces) && lessCrowdedPlaces.length > 0 && (
            <div className="modern-card bg-emerald-50/60 border-emerald-100/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hidden Gems</h2>
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Off-the-beaten-path</p>
                </div>
              </div>
              <ul className="space-y-3">
                {lessCrowdedPlaces.map((place, i) => (
                  <li key={i} className="flex group gap-3 p-3 bg-white/80 rounded-2xl border border-emerald-100/60 hover:border-emerald-300 hover:shadow-sm transition-all">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      ★
                    </span>
                    <span className="text-sm text-slate-700 leading-snug font-medium self-center">
                      {typeof place === 'string' ? place : place.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ItineraryPage;
