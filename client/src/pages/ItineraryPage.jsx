import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Bookmark, Share2, 
  MapPin, Calendar, DollarSign, Sparkles,
  Plane, Utensils, Hotel, Camera
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

  useEffect(() => {
    if (location.state && location.state.itinerary) {
      setData(location.state.itinerary);
      setLoading(false);
    } else {
      // If no data in state, return home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await tripService.save(data);
      setSaved(true);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip.');
    } finally {
      setSaving(false);
    }
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
    budget: totalBudget
  } = data;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Planner
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-slate-900 font-outfit">
              {destination} Expedition
            </h1>
            <div className="px-3 py-1 bg-indigo-50 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              AI Generated
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {days} Days
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              ${totalBudget} Total Budget
            </div>
            {weatherInfo && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {weatherInfo.condition}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saved || saving}
            className={`btn-secondary flex items-center gap-2 ${saved ? 'bg-green-50 text-green-600 border-green-200 cursor-default' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-green-600' : ''}`} />
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Trip'}
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <section className="modern-card bg-gradient-to-br from-indigo-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-slate-900">Expert Summary</h2>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed italic">
          "{summary}"
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content: Itinerary */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">Your Day-by-Day Journey</h2>
          </div>
          
          <div className="space-y-8 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
            {itinerary.map((day, i) => (
              <ItineraryCard key={i} dayData={day} index={i} />
            ))}
          </div>
        </div>

        {/* Sidebar: Details & Insights */}
        <aside className="space-y-10 lg:sticky lg:top-10 h-fit">
          <BudgetBreakdown breakdown={budgetBreakdown} />
          <WeatherInfo weather={weatherInfo} />
          
          <div className="space-y-10 py-6 px-1 bg-slate-50/50 rounded-3xl border border-slate-100/50">
            <h3 className="px-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Preparation & Insights</h3>
            <PackingList items={packingList} />
            <TravelTips tips={travelTips} />
          </div>
          
          {/* Local Food Spotlight */}
          <div className="modern-card border-none bg-orange-50/50 ring-1 ring-orange-100/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Local Flavors</h2>
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Culinary Gems</p>
              </div>
            </div>
            <ul className="space-y-4">
              {localFood.map((food, i) => (
                <li key={i} className="flex group gap-4 p-4 bg-white/80 rounded-2xl border border-orange-100/50 hover:border-orange-200 transition-all shadow-sm">
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-tight font-medium self-center">{typeof food === 'string' ? food : food.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hidden Gems */}
          <div className="modern-card border-none bg-emerald-50/50 ring-1 ring-emerald-100/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hidden Gems</h2>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Off-the-beaten-path</p>
              </div>
            </div>
            <ul className="space-y-4">
              {lessCrowdedPlaces.map((place, i) => (
                <li key={i} className="flex group gap-4 p-4 bg-white/80 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition-all shadow-sm">
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    ★
                  </span>
                  <span className="text-sm text-slate-700 leading-tight font-medium self-center">{typeof place === 'string' ? place : place.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItineraryPage;
