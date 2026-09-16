import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, MapPin, ArrowRight, Compass, IndianRupee } from 'lucide-react';
import { INDIAN_DESTINATIONS, POPULAR_INDIA_DESTINATIONS } from '../../data/destinations';

const INDIA_CATEGORIES = [
  { id: 'all', label: 'All Experiences' },
  { id: 'nature', label: 'Mountains 🏔️' },
  { id: 'relaxation', label: 'Beaches 🏖️' },
  { id: 'culture', label: 'Heritage 🏛️' },
  { id: 'spiritual', label: 'Spiritual 🛕' },
  { id: 'wildlife', label: 'Wildlife 🐅' },
  { id: 'food', label: 'Food 🍛' },
  { id: 'adventure', label: 'Adventure ⛺' }
];

export default function ExploreIndia() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? POPULAR_INDIA_DESTINATIONS
    : INDIAN_DESTINATIONS.filter(d => (d.travelStyles || []).includes(activeCategory)).slice(0, 8);

  const handlePlan = (destCity) => {
    navigate(`/planner?destination=${encodeURIComponent(`${destCity}, India`)}&type=india`);
  };

  return (
    <section className="py-16 bg-white dark:bg-navy-900/40 border-t border-slate-200/60 dark:border-navy-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider">
              <span>🇮🇳 India-First Journeys</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore India with AI 🇮🇳
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From the Himalayas to tropical beaches, discover personalized Indian journeys planned around your budget and interests.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-navy-900 p-1.5 rounded-2xl">
            {INDIA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl overflow-hidden bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Banner */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold">
                    ₹{dest.startingDailyBudget.toLocaleString('en-IN')}/day
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sky">
                      {dest.state} • {dest.region}
                    </span>
                    <h3 className="text-xl font-bold truncate">
                      {dest.city}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">Best Season: </strong>
                      {dest.bestMonths}
                    </div>
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">Duration: </strong>
                      {dest.typicalDuration}
                    </div>
                  </div>

                  {/* Highlights / Popular Activities */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Activities:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(dest.sampleActivities || []).slice(0, 2).map((act, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-navy-800 text-slate-600 dark:text-slate-300 truncate max-w-full"
                        >
                          • {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Trip CTA */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => handlePlan(dest.city)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip to {dest.city}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
