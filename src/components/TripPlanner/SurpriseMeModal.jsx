import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Sparkles, MapPin, DollarSign, Calendar, Compass, ArrowRight, Loader2 } from 'lucide-react';
import { suggestDestinations } from '../../services/travelPlannerService';
import { TRAVEL_STYLES } from '../../data/travelStyles';

export default function SurpriseMeModal({ isOpen, onClose, onSelectDestination }) {
  const [startingCity, setStartingCity] = useState('Delhi');
  const [budget, setBudget] = useState('20000');
  const [duration, setDuration] = useState('3');
  const [travelStyle, setTravelStyle] = useState('adventure');
  const [suggestions, setSuggestions] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleGenerateSurprise = async (e) => {
    e.preventDefault();
    setIsSuggesting(true);
    await new Promise((r) => setTimeout(r, 600));

    const results = suggestDestinations({
      startingCity,
      budget: Number(budget) || 20000,
      duration: Number(duration) || 3,
      travelStyle
    });

    setSuggestions(results);
    setIsSuggesting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ Surprise Me — AI Destination Matcher"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Not sure where to venture next? Tell us your home city, budget, and travel vibe—TripMind AI will pick ideal destinations.
        </p>

        <form onSubmit={handleGenerateSurprise} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Starting City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Bengaluru"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Approx. Budget (₹)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 20000"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Trip Duration (Days)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Desired Vibe / Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                {TRAVEL_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSuggesting}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSuggesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding Ideal Matches...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find My Surprise Match</span>
              </>
            )}
          </button>
        </form>

        {/* Suggested Results */}
        {suggestions && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-navy-800 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              AI Recommendations from {startingCity}:
            </h4>

            <div className="space-y-2.5">
              {suggestions.map((dest) => (
                <div
                  key={dest.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-navy-700"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {dest.city}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {dest.state} • ~₹{dest.startingDailyBudget}/day
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDestination(`${dest.city}, India`);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-teal text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                  >
                    <span>Plan This Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
