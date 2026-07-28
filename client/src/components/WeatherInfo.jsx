import React from 'react';
import { Cloud, Thermometer, CloudRain, Info } from 'lucide-react';
import IconBadge from './ui/IconBadge';

const WeatherInfo = ({ weather }) => {
  if (!weather) return null;

  return (
    <section className="card overflow-hidden p-6" aria-label="Weather outlook">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={Cloud} accent="sky" size="sm" />
          <div>
            <h2 className="text-h3 text-ink">Weather</h2>
            <p className="caption-meta mt-0.5">Climate outlook</p>
          </div>
        </div>
        {weather.month && <span className="pill">{weather.month}</span>}
      </div>

      {/* Temperature panel */}
      <div className="mt-5 flex items-end justify-between gap-4 rounded-md border border-sky-500/16 bg-sky-500/[0.05] p-4">
        <div>
          <p className="flex items-center gap-1.5 text-caption uppercase text-ink-muted">
            <Thermometer className="h-3 w-3" aria-hidden="true" />
            Temperature
          </p>
          <p className="data-num mt-1 text-h1 font-bold text-ink">{weather.temperature}</p>
        </div>
        <div className="text-right">
          <p className="text-small font-semibold text-ink">{weather.condition}</p>
          {weather.rainfall && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-caption text-ink-muted">
              <CloudRain className="h-3 w-3" aria-hidden="true" />
              {weather.rainfall} rain
            </p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {Array.isArray(weather.recommendation) && weather.recommendation.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {weather.recommendation.map((rec, i) => (
            <li key={i} className="flex gap-2.5 text-tiny leading-relaxed text-ink-soft">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden="true" />
              {rec}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WeatherInfo;
