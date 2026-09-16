import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { INDIAN_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from '../data/destinations';
import {
  Compass,
  Search,
  Star,
  Sparkles,
  MapPin,
  ArrowRight,
  IndianRupee,
  Globe2,
  Calendar,
  Layers,
  Filter
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import { formatCurrency } from '../utils/formatters';

const INDIA_CATEGORIES = [
  { id: 'all', label: 'All Destinations' },
  { id: 'nature', label: 'Mountains 🏔️' },
  { id: 'relaxation', label: 'Beaches 🏖️' },
  { id: 'culture', label: 'Heritage 🏛️' },
  { id: 'spiritual', label: 'Spiritual 🛕' },
  { id: 'wildlife', label: 'Wildlife 🐅' },
  { id: 'food', label: 'Food 🍛' },
  { id: 'adventure', label: 'Adventure ⛺' },
  { id: 'wellness', label: 'Wellness 🧘' }
];

const INTL_REGIONS = ['All', 'Europe', 'Asia', 'Middle East', 'Americas', 'Oceania'];
const INTL_STYLES = ['All', 'culture', 'food', 'nature', 'relaxation', 'adventure', 'nightlife'];

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'world' ? 'world' : 'india';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [indiaCategory, setIndiaCategory] = useState('all');
  const [intlRegion, setIntlRegion] = useState('All');
  const [intlStyle, setIntlStyle] = useState('All');

  useEffect(() => {
    updatePageMeta(
      activeTab === 'india' ? 'Explore India with AI 🇮🇳' : 'Explore the World 🌍',
      'Discover personalized journeys, starting budgets, and seasonal travel advice across India and global destinations.'
    );
  }, [activeTab]);

  // Filtered India destinations
  const filteredIndia = INDIAN_DESTINATIONS.filter((dest) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      dest.city.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q) ||
      dest.region.toLowerCase().includes(q) ||
      dest.travelStyles.some(s => s.toLowerCase().includes(q));

    const matchesCategory =
      indiaCategory === 'all' ||
      dest.travelStyles.includes(indiaCategory);

    return matchesSearch && matchesCategory;
  });

  // Filtered World destinations
  const filteredWorld = INTERNATIONAL_DESTINATIONS.filter((dest) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      dest.city.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.region.toLowerCase().includes(q) ||
      dest.travelStyles.some(s => s.toLowerCase().includes(q));

    const matchesRegion = intlRegion === 'All' || dest.region.toLowerCase().includes(intlRegion.toLowerCase());
    const matchesStyle = intlStyle === 'All' || dest.travelStyles.includes(intlStyle);

    return matchesSearch && matchesRegion && matchesStyle;
  });

  const handlePlan = (destCity, isIndia) => {
    const destName = isIndia ? `${destCity}, India` : destCity;
    const typeParam = isIndia ? 'india' : 'international';
    navigate(`/planner?destination=${encodeURIComponent(destName)}&type=${typeParam}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>TripMind Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {activeTab === 'india' ? 'Explore India with AI 🇮🇳' : 'Explore the World 🌍'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          {activeTab === 'india'
            ? 'From the Himalayas to tropical beaches, discover personalized Indian journeys planned around your budget and interests.'
            : 'Explore world-renowned capitals, cultural wonders, and tropical getaways with multi-currency smart budgeting.'}
        </p>

        {/* Primary Travel Mode Switcher */}
        <div className="pt-3 flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-700 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('india')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'india'
                  ? 'bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇮🇳 Explore India</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">35+ Hubs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('world')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'world'
                  ? 'bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🌍 Explore the World</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">14+ Icons</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'india' ? 'Search city, state, or style (e.g. Manali, Kerala, Food)...' : 'Search Paris, Tokyo, Bali, Europe...'}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          {/* Quick Count Badge */}
          <div className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center">
            Showing <span className="font-bold text-slate-900 dark:text-white">{activeTab === 'india' ? filteredIndia.length : filteredWorld.length}</span> destinations
          </div>
        </div>

        {/* Categories Bar */}
        {activeTab === 'india' ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INDIA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setIndiaCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  indiaCategory === cat.id
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold mr-1">Region:</span>
              {INTL_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setIntlRegion(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    intlRegion === r
                      ? 'bg-brand-teal text-white shadow-xs'
                      : 'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Travel Style Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold mr-1">Style:</span>
              {INTL_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setIntlStyle(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    intlStyle === s
                      ? 'bg-brand-sky text-white shadow-xs'
                      : 'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESTINATIONS GRID */}
      {activeTab === 'india' ? (
        /* INDIA DESTINATIONS (Prompt Requirement 28) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIndia.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold flex items-center gap-0.5">
                      <IndianRupee className="w-3 h-3" />
                      <span>{dest.startingDailyBudget?.toLocaleString('en-IN')}/day</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/80 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider">
                      {dest.region}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-brand-sky uppercase tracking-wider">
                      {dest.state}
                    </span>
                    <h3 className="text-xl font-bold">
                      {dest.city}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span>Best: <strong className="text-slate-700 dark:text-slate-300">{dest.bestMonths?.slice(0, 3).join(', ')}</strong></span>
                    </div>
                    <div className="truncate">
                      <span>Cuisine: <strong className="text-slate-700 dark:text-slate-300">{dest.cuisine?.slice(0, 2).join(', ')}</strong></span>
                    </div>
                  </div>

                  {/* Highlights / Activities */}
                  <div className="flex flex-wrap gap-1">
                    {(dest.popularAttractions || []).slice(0, 2).map((att, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                      >
                        • {att}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => handlePlan(dest.city, true)}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip to {dest.city}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* INTERNATIONAL DESTINATIONS (Prompt Requirement 29) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorld.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold">
                      {dest.currency} {dest.startingDailyBudget}/day
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-sky/80 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider">
                      {dest.region}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-brand-sky uppercase tracking-wider">
                      {dest.country}
                    </span>
                    <h3 className="text-xl font-bold">
                      {dest.city}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-sky shrink-0" />
                      <span>Best: <strong className="text-slate-700 dark:text-slate-300">{dest.bestMonths?.slice(0, 3).join(', ')}</strong></span>
                    </div>
                    <div className="truncate">
                      <span>Attractions: <strong className="text-slate-700 dark:text-slate-300">{dest.popularAttractions?.slice(0, 2).join(', ')}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(dest.travelStyles || []).slice(0, 3).map((st, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 capitalize"
                      >
                        #{st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => handlePlan(dest.city, false)}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip to {dest.city}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'india' && filteredIndia.length === 0) ||
        (activeTab === 'world' && filteredWorld.length === 0)) && (
        <div className="text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-navy-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No destinations found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or category filters to find the right travel destination.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setIndiaCategory('all');
              setIntlRegion('All');
              setIntlStyle('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
