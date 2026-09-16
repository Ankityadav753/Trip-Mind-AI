import React, { useState } from 'react';
import { Sparkles, Star, Bed, Utensils, Landmark, Compass, Bookmark, Plus, Check } from 'lucide-react';
import AIConfidenceBadge from '../common/AIConfidenceBadge';
import { useToast } from '../../hooks/useToast';

export default function AIRecommendations({ recommendations = {}, onAddToDay }) {
  const [activeTab, setActiveTab] = useState('hotels');
  const [savedItems, setSavedItems] = useState({});
  const { addToast } = useToast();

  const tabs = [
    { id: 'hotels', label: 'Stays & Hotels', icon: Bed, items: recommendations.hotels || [] },
    { id: 'restaurants', label: 'Bistros & Dining', icon: Utensils, items: recommendations.restaurants || [] },
    { id: 'attractions', label: 'Key Attractions', icon: Landmark, items: recommendations.attractions || [] },
    { id: 'hiddenGems', label: 'Hidden Gems', icon: Compass, items: recommendations.hiddenGems || [] },
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const items = currentTabObj.items;

  const toggleSave = (id, name) => {
    setSavedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        addToast({
          type: 'success',
          title: 'Saved to Bookmarks',
          message: `Added "${name}" to your trip favorites.`
        });
      }
      return next;
    });
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Curated by AI
            </span>
            <AIConfidenceBadge size="sm" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Picks For You
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Handpicked verified accommodations, authentic dining, and quiet architectural spots
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-navy-950 p-1.5 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-white dark:bg-navy-850 text-brand-teal shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
                  {tab.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const isBookmarked = !!savedItems[item.id];

          return (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 overflow-hidden hover:border-brand-teal/40 dark:hover:border-brand-teal/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                {/* Photo with Overlay Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating || '4.8'}</span>
                    </span>
                    {item.priceLevel && (
                      <span className="px-2 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold font-mono">
                        {item.priceLevel}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSave(item.id, item.name)}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                      isBookmarked
                        ? 'bg-brand-teal text-white'
                        : 'bg-navy-900/70 text-white hover:bg-navy-900'
                    }`}
                    aria-label="Save to bookmarks"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-semibold text-brand-sky">
                      📍 {item.neighborhood || 'Central Neighborhood'}
                    </div>
                    <h4 className="text-base font-bold truncate">
                      {item.name}
                    </h4>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-navy-800/80 mt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.pricePerNight ? (
                    <span><strong>${item.pricePerNight}</strong> / night</span>
                  ) : item.type ? (
                    <span>{item.type}</span>
                  ) : (
                    <span>{item.cuisine || 'Local Pick'}</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (onAddToDay) {
                      onAddToDay(item);
                    } else {
                      toggleSave(item.id, item.name);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Itinerary</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
