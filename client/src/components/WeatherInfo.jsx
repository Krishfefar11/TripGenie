import React from 'react';
import { Cloud, Thermometer, CloudRain } from 'lucide-react';

const WeatherInfo = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-hairline rounded-md flex items-center justify-center">
            <Cloud className="w-4 h-4 text-ink" />
          </div>
          <div>
            <h2 className="font-display text-h2 text-ink">Weather</h2>
            <p className="caption">Climate Insider</p>
          </div>
        </div>
        <div className="px-2.5 py-1 caption border border-hairline rounded">
          {weather.month}
        </div>
      </div>

      <div className="flex items-center justify-between card-lift p-4 rounded-md mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <Thermometer className="w-3.5 h-3.5" />
            <span className="caption">Temperature</span>
          </div>
          <p className="font-display text-h2 text-ink">{weather.temperature}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{weather.condition}</p>
          <div className="flex items-center justify-end gap-1.5 text-ink-secondary mt-1">
            <span className="caption">{weather.rainfall} Rain</span>
            <CloudRain className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {weather.recommendation.map((rec, i) => (
          <div key={i} className="flex gap-3 text-sm text-ink-secondary leading-relaxed items-start">
            <div className="w-1 h-1 rounded-pill bg-ink mt-2 shrink-0" />
            {rec}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherInfo;
