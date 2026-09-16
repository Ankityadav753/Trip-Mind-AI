import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Sparkles, Navigation, Route } from 'lucide-react';
import { searchDestinations, INDIAN_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from '../../data/destinations';

export default function DestinationAutocomplete({
  value,
  onChange,
  travelType = 'india',
  placeholder = "Where do you want to go?",
  error
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const searchData = searchDestinations(value || '', travelType);
  const results = searchData.results || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (dest) => {
    onChange(`${dest.city || dest.name}, ${dest.country}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="w-5 h-5 text-brand-teal absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-navy-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-colors ${
            error
              ? 'border-rose-500 focus:ring-rose-500/50'
              : 'border-slate-200 dark:border-navy-700 focus:ring-brand-teal'
          }`}
          aria-label="Destination search"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-2xl z-30 divide-y divide-slate-100 dark:divide-navy-800 animate-fadeIn">
          {searchData.queryMeta && (
            <div className="px-4 py-2 bg-brand-teal/10 text-brand-teal text-xs font-bold flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5" />
              <span>{searchData.queryMeta}</span>
            </div>
          )}

          <div className="px-3.5 py-2 bg-slate-50 dark:bg-navy-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-teal" />
            <span>
              {travelType === 'india' ? 'Suggested Indian Destinations' : 'Popular Global Destinations'}
            </span>
          </div>

          {results.length > 0 ? (
            results.map((dest) => (
              <button
                type="button"
                key={dest.id}
                onClick={() => handleSelect(dest)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dest.image}
                    alt={dest.city || dest.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-navy-700"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-teal transition-colors">
                      {dest.city || dest.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {dest.state ? `${dest.state}, ` : ''}{dest.country} • {dest.region}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                  {dest.startingDailyBudget ? (
                    dest.currency === 'INR' ? `₹${dest.startingDailyBudget}/d` : `${dest.currency} ${dest.startingDailyBudget}/d`
                  ) : 'Recommended'}
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No preset found. TripMind AI can plan an itinerary for <span className="font-semibold text-brand-teal">"{value}"</span>!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
