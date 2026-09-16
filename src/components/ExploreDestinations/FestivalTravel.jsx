import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, ArrowRight, Flame } from 'lucide-react';
import { FESTIVAL_TRAVEL_DATA } from '../../data/festivalTravel';

export default function FestivalTravel() {
  const navigate = useNavigate();
  const [selectedFestival, setSelectedFestival] = useState(FESTIVAL_TRAVEL_DATA[0]);

  const handlePlanFestival = (festival) => {
    const targetCity = festival.topDestinations[0] || 'Varanasi';
    navigate(`/planner?destination=${encodeURIComponent(`${targetCity}, India`)}&type=india&notes=${encodeURIComponent(`Attending ${festival.name}`)}`);
  };

  return (
    <section className="py-16 bg-white dark:bg-navy-900/60 border-t border-slate-200/60 dark:border-navy-850 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Cultural Celebrations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Travel Around Festivals 🎉
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Immerse yourself in India’s vibrant calendar of sacred lights, joyous colors, and heritage fairs
            </p>
          </div>
        </div>

        {/* Festival Cards Horizontal / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FESTIVAL_TRAVEL_DATA.slice(0, 6).map((fest) => (
            <div
              key={fest.id}
              className="group rounded-3xl overflow-hidden bg-slate-50 dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={fest.image}
                    alt={fest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{fest.typicalSeason}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold leading-snug">
                      {fest.name}
                    </h3>
                    <span className="text-xs text-slate-300 font-mono">
                      {fest.approximateDates}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fest.description}
                  </p>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 font-semibold">Key Hotspots:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {fest.topDestinations.map((city, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-navy-700 font-medium"
                        >
                          📍 {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handlePlanFestival(fest)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Festival Journey</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
