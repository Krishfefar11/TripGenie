import React from 'react';
import { Cloud, Thermometer, CloudRain, Wind } from 'lucide-react';

const WeatherInfo = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="modern-card overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Weather</h2>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Climate Insider</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-100">
          {weather.month}
        </div>
      </div>

      <div className="relative flex items-center justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-tight">Temperature</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{weather.temperature}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">{weather.condition}</p>
          <div className="flex items-center justify-end gap-1.5 text-slate-500">
            <span className="text-xs font-medium uppercase tracking-tight">{weather.rainfall} Rain</span>
            <CloudRain className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {weather.recommendation.map((rec, i) => (
          <div key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
            {rec}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherInfo;
