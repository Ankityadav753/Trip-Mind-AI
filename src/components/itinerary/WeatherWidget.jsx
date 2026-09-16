import React, { useState } from 'react';
import { CloudSun, Sun, Wind, Droplets, Thermometer, ShieldAlert, Sparkles, CloudRain, CloudDrizzle } from 'lucide-react';

const WEATHER_ICONS = {
  Sun,
  CloudSun,
  Wind,
  CloudRain,
  CloudDrizzle
};

export default function WeatherWidget({ weather }) {
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  if (!weather) return null;

  const toF = (c) => Math.round((c * 9) / 5 + 32);
  const currentTemp = unit === 'C' ? `${weather.tempC || 20}°C` : `${toF(weather.tempC || 20)}°F`;

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Destination Weather Forecast</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-teal/10 text-brand-teal font-semibold">
                Live Sync
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {weather.condition} • {weather.humidity} humidity • Wind {weather.wind}
            </p>
          </div>
        </div>

        {/* Temperature Unit Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-navy-950 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setUnit('C')}
            className={`px-2 py-0.5 rounded ${unit === 'C' ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs' : 'text-slate-400'}`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2 py-0.5 rounded ${unit === 'F' ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs' : 'text-slate-400'}`}
          >
            °F
          </button>
        </div>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {(weather.forecast || []).map((dayForecast, idx) => {
          const Icon = WEATHER_ICONS[dayForecast.icon] || Sun;
          const displayTemp = unit === 'C' ? `${dayForecast.tempC || 20}°` : `${dayForecast.tempF || 68}°`;

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/50 dark:border-navy-800/60 text-center space-y-1.5"
            >
              <div className="text-[11px] font-semibold text-slate-400">{dayForecast.day}</div>
              <div className="flex justify-center text-amber-400 py-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{displayTemp}</div>
              <div className="text-[10px] text-slate-500 truncate">{dayForecast.condition}</div>
            </div>
          );
        })}
      </div>

      {/* AI Packing Advice */}
      {weather.packingAdvice && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-teal/5 dark:bg-brand-teal/10 border border-brand-teal/20 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white">AI Packing Advice: </strong>
            {weather.packingAdvice}
          </div>
        </div>
      )}
    </div>
  );
}
