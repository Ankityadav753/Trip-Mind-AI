import React, { useState, useEffect, useRef } from 'react';
import {
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  CloudRain,
  CloudDrizzle,
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { getDestinationWeather, getFallbackWeather } from '../../services/weatherService';

const WEATHER_ICONS = {
  Sun,
  CloudSun,
  Wind,
  CloudRain,
  CloudDrizzle
};

export default function WeatherWidget({
  weather,
  destination = '',
  coordinates = null,
  startDate = null,
  endDate = null,
  onWeatherUpdate
}) {
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [weatherData, setWeatherData] = useState(weather || null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  const lastFetchKeyRef = useRef('');

  // Sync state when incoming weather prop changes
  useEffect(() => {
    if (weather) {
      setWeatherData(weather);
      if (weather.forecastSource === 'fallback' && weather.fallbackReason) {
        setErrorNotice(weather.fallbackReason);
      } else {
        setErrorNotice(null);
      }
    }
  }, [weather]);

  // Fetch live weather if missing or when destination/coordinates change
  useEffect(() => {
    const latStr = coordinates?.lat != null ? Number(coordinates.lat).toFixed(3) : '';
    const lngStr = coordinates?.lng != null ? Number(coordinates.lng).toFixed(3) : '';
    const currentKey = `${destination}_${latStr}_${lngStr}_${startDate || ''}_${endDate || ''}`;

    // Prevent retry loops: fetch only if no weather exists or target changed
    if (!weatherData && destination && lastFetchKeyRef.current !== currentKey) {
      lastFetchKeyRef.current = currentKey;
      fetchLiveWeather(false);
    }
  }, [destination, coordinates, startDate, endDate, weatherData]);

  const fetchLiveWeather = async (forceRefresh = false) => {
    if (!destination && !coordinates) return;

    setIsLoading(true);
    setErrorNotice(null);

    try {
      const liveData = await getDestinationWeather(
        destination,
        coordinates,
        { startDate, endDate },
        { forceRefresh }
      );

      setWeatherData(liveData);

      if (liveData.forecastSource === 'fallback' && liveData.fallbackReason) {
        setErrorNotice(liveData.fallbackReason);
      } else {
        setErrorNotice(null);
      }

      if (onWeatherUpdate) {
        onWeatherUpdate(liveData);
      }
    } catch (err) {
      console.warn('TripMind AI: Live weather fetch encountered an error, falling back:', err);
      const fallback = getFallbackWeather(destination, 'Live weather temporarily unreachable. Showing seasonal estimate.');
      setWeatherData(fallback);
      setErrorNotice('Live weather temporarily unreachable. Showing seasonal estimate.');

      if (onWeatherUpdate) {
        onWeatherUpdate(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRetry = () => {
    fetchLiveWeather(true);
  };

  // 1. Loading Skeleton State (Requirement 13)
  if (isLoading && !weatherData) {
    return (
      <div
        className="rounded-2xl p-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4 mb-8 animate-pulse"
        role="status"
        aria-label="Loading weather forecast"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-navy-800" />
            <div className="space-y-1.5">
              <div className="w-44 h-4 rounded bg-slate-200 dark:bg-navy-800" />
              <div className="w-56 h-3 rounded bg-slate-100 dark:bg-navy-800/60" />
            </div>
          </div>
          <div className="w-16 h-7 rounded-lg bg-slate-100 dark:bg-navy-950" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/50 dark:border-navy-800/60 text-center space-y-2"
            >
              <div className="w-10 h-2.5 mx-auto rounded bg-slate-200 dark:bg-navy-800" />
              <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 dark:bg-navy-800" />
              <div className="w-8 h-4 mx-auto rounded bg-slate-200 dark:bg-navy-800" />
              <div className="w-14 h-2.5 mx-auto rounded bg-slate-100 dark:bg-navy-800" />
            </div>
          ))}
        </div>

        <div className="h-10 rounded-xl bg-slate-100 dark:bg-navy-800/40" />
      </div>
    );
  }

  // 2. Unavailable weather state with retry
  if (!weatherData) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-3 mb-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Destination Weather Forecast
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weather forecast is currently unavailable for this destination.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRetry}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Checking...' : 'Check Weather'}</span>
          </button>
        </div>
      </div>
    );
  }

  const toF = (c) => Math.round((c * 9) / 5 + 32);
  const currentTempC = weatherData.tempC ?? weatherData.averageTempC ?? 20;
  const currentTemp = unit === 'C' ? `${currentTempC}°C` : `${toF(currentTempC)}°F`;
  const isLiveSync = Boolean(weatherData.isLive && weatherData.forecastSource === 'live');

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4 mb-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Destination Weather Forecast</span>

              {/* Requirement 15: Show Live Sync badge only when actual live Open-Meteo data is being used */}
              {isLiveSync ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-teal/10 text-brand-teal font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                  Live Sync
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                  Estimated
                </span>
              )}

              {/* Manual refresh button (Requirement 10) */}
              <button
                onClick={handleManualRetry}
                disabled={isLoading}
                title="Refresh live weather forecast"
                aria-label="Refresh weather"
                className="p-1 rounded text-slate-400 hover:text-brand-teal hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors ml-0.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {weatherData.condition || 'Clear & Sunny'} • {weatherData.humidity || '55%'} humidity • Wind {weatherData.wind || '10 km/h'}
            </p>
          </div>
        </div>

        {/* Temperature Unit Toggle (°C / °F) */}
        <div className="flex items-center bg-slate-100 dark:bg-navy-950 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setUnit('C')}
            className={`px-2 py-0.5 rounded transition-colors ${unit === 'C' ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs' : 'text-slate-400'}`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2 py-0.5 rounded transition-colors ${unit === 'F' ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs' : 'text-slate-400'}`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Fallback Notice Banner with Retry (Requirement 14) */}
      {!isLiveSync && errorNotice && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={handleManualRetry}
            disabled={isLoading}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors shrink-0"
          >
            {isLoading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {/* 5-Day Forecast Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {(weatherData.forecast || []).map((dayForecast, idx) => {
          const Icon = WEATHER_ICONS[dayForecast.icon] || Sun;
          const dayTempC = dayForecast.tempC ?? parseInt(dayForecast.temp, 10) ?? 20;
          const dayTempF = dayForecast.tempF ?? toF(dayTempC);
          const displayTemp = unit === 'C' ? `${dayTempC}°` : `${dayTempF}°`;

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/50 dark:border-navy-800/60 text-center space-y-1.5"
            >
              <div className="text-[11px] font-semibold text-slate-400 truncate" title={dayForecast.day}>
                {dayForecast.day}
              </div>
              <div className="flex justify-center text-amber-400 py-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{displayTemp}</div>
              <div className="text-[10px] text-slate-500 truncate" title={dayForecast.condition}>
                {dayForecast.condition}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic AI Packing Advice (Requirement 7 & 8) */}
      {(weatherData.packingAdvice || weatherData.packingTip) && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-teal/5 dark:bg-brand-teal/10 border border-brand-teal/20 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white">AI Packing Advice: </strong>
            {weatherData.packingAdvice || weatherData.packingTip}
          </div>
        </div>
      )}
    </div>
  );
}
