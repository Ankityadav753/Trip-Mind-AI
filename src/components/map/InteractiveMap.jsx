import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Layers, Compass, ZoomIn, ZoomOut, Maximize2, Sparkles, Footprints, Clock, DollarSign, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function InteractiveMap({ trip, activeHighlight = null, currency = 'USD' }) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [selectedStop, setSelectedStop] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync when activeHighlight is clicked from an activity card
  useEffect(() => {
    if (activeHighlight) {
      setSelectedStop(activeHighlight);
    }
  }, [activeHighlight]);

  if (!trip) return null;

  // Flatten activities based on filter
  const allStops = [];
  (trip.days || []).forEach((day) => {
    if (selectedDayFilter === 'all' || selectedDayFilter === String(day.dayNumber)) {
      (day.activities || []).forEach((act, actIdx) => {
        allStops.push({
          ...act,
          dayNumber: day.dayNumber,
          stopIndex: allStops.length + 1,
        });
      });
    }
  });

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Route Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
              API-Ready Provider
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Interactive Itinerary Map</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Numbered stops arranged in optimal geographic sequence to avoid backtrack transit
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedDayFilter('all');
              setSelectedStop(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-white dark:bg-navy-850 text-brand-teal shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Days
          </button>
          {(trip.days || []).map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setSelectedDayFilter(String(day.dayNumber));
                setSelectedStop(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDayFilter === String(day.dayNumber)
                  ? 'bg-white dark:bg-navy-850 text-brand-teal shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Visual Area */}
      <div className="relative h-96 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-navy-950 border border-slate-200 dark:border-navy-800 shadow-inner flex items-center justify-center select-none">
        {/* Stylized Vector Grid Background / Map Projection */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out opacity-40 mix-blend-luminosity filter contrast-125"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px), radial-gradient(circle, rgba(20, 184, 166, 0.1) 1px, transparent 1px)`,
            backgroundSize: `${32 * zoomLevel}px ${32 * zoomLevel}px`,
            backgroundColor: '#070C1B',
            transform: `scale(${zoomLevel})`
          }}
        ></div>

        {/* Abstract Vector River / Terrain Contours */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-brand-teal/25" fill="none">
          <path d="M 0 120 Q 200 80, 450 180 T 900 240 T 1400 210" strokeWidth="16" strokeLinecap="round" opacity="0.2" />
          <path d="M 0 120 Q 200 80, 450 180 T 900 240 T 1400 210" strokeWidth="4" strokeLinecap="round" opacity="0.6" strokeDasharray="8 6" />
          
          {/* Animated Route Line Connecting Pins */}
          {allStops.length > 1 && (
            <polyline
              points={allStops.map((_, i) => {
                const step = 800 / (allStops.length + 1);
                const x = 70 + i * step;
                const y = 140 + Math.sin(i * 1.3) * 90;
                return `${x},${y}`;
              }).join(' ')}
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Numbered Pins */}
        <div className="absolute inset-0 p-8 flex items-center justify-around pointer-events-none">
          {allStops.slice(0, 7).map((stop, i) => {
            const isSelected = selectedStop?.id === stop.id;
            const topOffset = 25 + (Math.sin(i * 1.5) + 1) * 22; // deterministic varied vertical offset

            return (
              <div
                key={stop.id || i}
                style={{ top: `${topOffset}%` }}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              >
                <button
                  onClick={() => setSelectedStop(stop)}
                  className={`group relative flex flex-col items-center focus:outline-none transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                  aria-label={`Stop ${stop.stopIndex}: ${stop.title}`}
                >
                  {/* Outer pulse */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-brand-teal animate-ping opacity-60"></span>
                  )}

                  {/* Pin Circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors border-2 ${
                    isSelected
                      ? 'bg-brand-teal border-white text-navy-950 font-extrabold shadow-glow-teal'
                      : 'bg-navy-900/90 border-brand-sky text-white hover:bg-brand-sky hover:text-navy-950'
                  }`}>
                    {stop.stopIndex}
                  </div>

                  {/* Tooltip Label */}
                  <div className={`mt-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap shadow-md transition-all ${
                    isSelected
                      ? 'bg-brand-teal text-navy-950 font-bold opacity-100'
                      : 'bg-navy-900/90 text-slate-200 opacity-90 group-hover:opacity-100'
                  }`}>
                    Day {stop.dayNumber} • {stop.time}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Stop Card Floating Inspector */}
        {selectedStop && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-navy-900/95 backdrop-blur-xl border border-brand-teal/40 rounded-2xl p-4 text-white shadow-2xl z-40 animate-fadeIn space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-teal text-navy-950 text-xs font-bold flex items-center justify-center shrink-0">
                  {selectedStop.stopIndex || 1}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-sky">
                    Day {selectedStop.dayNumber} • {selectedStop.time}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {selectedStop.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedStop(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
                aria-label="Close stop preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {selectedStop.description}
            </p>

            <div className="pt-1.5 border-t border-navy-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">📍 {selectedStop.location}</span>
              <span className="font-bold text-emerald-400">
                {selectedStop.estimatedCost > 0 ? formatCurrency(selectedStop.estimatedCost, currency) : 'Free'}
              </span>
            </div>
          </div>
        )}

        {/* Map Control Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))}
            className="p-2 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-700 text-white backdrop-blur-md shadow-md"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-2 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-700 text-white backdrop-blur-md shadow-md"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Compass / Orientation */}
        <div className="absolute top-4 left-4 p-2 rounded-xl bg-navy-900/80 border border-slate-700 text-slate-300 backdrop-blur-md flex items-center gap-1.5 text-xs font-mono">
          <Compass className="w-4 h-4 text-brand-teal animate-pulse" />
          <span>{trip.destination}</span>
        </div>
      </div>

      {/* Integration Note for Developers */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
        <span>✦ Interactive mock visualizer active. Fully structured for Mapbox GL / Google Maps JavaScript SDK injection.</span>
        <span className="font-mono text-brand-sky">{allStops.length} Total Waypoints</span>
      </div>
    </div>
  );
}
