import React, { useState } from 'react';
import Modal from '../common/Modal';
import {
  DollarSign,
  Coffee,
  UtensilsCrossed,
  Compass,
  Footprints,
  Sparkles,
  Loader2,
  Gem,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const REGENERATE_OPTIONS = [
  {
    id: 'cheaper',
    title: 'Make It Cheaper',
    desc: 'Swap ticketed entry attractions for free public viewpoints, gardens, and authentic budget street eats.',
    icon: DollarSign,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'relaxed',
    title: 'Make It More Relaxed',
    desc: 'Slow down pacing to 2–3 unhurried stops with generous cafe terrace breaks.',
    icon: Coffee,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
  },
  {
    id: 'food',
    title: 'Add More Food & Dining',
    desc: 'Infuse local culinary specialties, street food walks, tea tasting, and dinner reservations.',
    icon: UtensilsCrossed,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'adventure',
    title: 'Add More Adventure',
    desc: 'Replace passive museum stops with e-bike discovery, nature treks, or thrilling viewpoints.',
    icon: Compass,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  },
  {
    id: 'reduce_travel',
    title: 'Reduce Travel Time',
    desc: 'Cluster all activities within a single walkable 500-meter neighborhood radius.',
    icon: Footprints,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
  },
  {
    id: 'hidden_gems',
    title: 'Add Hidden Gems',
    desc: 'Discover secret artisan alleys, quiet sunset terraces, and authentic non-touristy corners.',
    icon: Gem,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  }
];

export default function RegenerateDayModal({
  isOpen,
  onClose,
  dayNumber,
  day,
  onApplyChanges,
  currency = 'INR'
}) {
  const [selectedOption, setSelectedOption] = useState('relaxed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diffPreview, setDiffPreview] = useState(null);

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    // Simulate smart AI optimization
    setTimeout(() => {
      if (!day) {
        setIsGenerating(false);
        return;
      }

      const activities = day.activities || [];
      const option = REGENERATE_OPTIONS.find(o => o.id === selectedOption);

      // Construct realistic added and removed items based on option
      let removedItems = [];
      let addedItems = [];
      let oldCost = activities.reduce((sum, a) => sum + (Number(a.estimatedCost) || 0), 0);
      let newCost = oldCost;
      let transit = 'Route optimized for fewer transfers';

      if (selectedOption === 'cheaper') {
        const expensive = [...activities].sort((a, b) => (b.estimatedCost || 0) - (a.estimatedCost || 0))[0];
        if (expensive) removedItems.push(expensive);
        addedItems.push({
          id: `act-gen-${Date.now()}-1`,
          time: expensive?.time || '03:00 PM',
          title: 'Heritage Scenic Promenade & Gardens',
          category: 'Sightseeing',
          duration: '1.5 hrs',
          estimatedCost: 0,
          location: day.neighborhood || 'City Center',
          description: 'Relaxing free public promenade with scenic architecture and artisan street performers.',
          transitInfo: '10 min walk'
        });
        newCost = Math.max(oldCost - 450, 200);
        transit = 'Reduced transit transfers';
      } else if (selectedOption === 'relaxed') {
        if (activities.length > 2) {
          removedItems.push(activities[activities.length - 1]);
        }
        addedItems.push({
          id: `act-gen-${Date.now()}-2`,
          time: '04:00 PM',
          title: 'Riverside Café & Sunset Terrace',
          category: 'Relaxation',
          duration: '1.5 hrs',
          estimatedCost: 350,
          location: day.neighborhood || 'Riverside',
          description: 'Unhurried terrace lounge with regional snacks, tea, and sunset vista.',
          transitInfo: '5 min walk'
        });
        newCost = oldCost - 100;
        transit = 'Reduced (Slow-paced clustering)';
      } else if (selectedOption === 'food') {
        addedItems.push({
          id: `act-gen-${Date.now()}-3`,
          time: '01:30 PM',
          title: 'Iconic Regional Culinary Food Crawl',
          category: 'Meal',
          duration: '2 hrs',
          estimatedCost: 650,
          location: day.neighborhood || 'Old Market',
          description: 'Curated tasting walk through top heritage food stalls and secret bakeries.',
          transitInfo: 'Walkable alleyways'
        });
        newCost = oldCost + 300;
        transit = 'Optimized culinary path';
      } else if (selectedOption === 'hidden_gems') {
        if (activities.length > 1) {
          removedItems.push(activities[0]);
        }
        addedItems.push({
          id: `act-gen-${Date.now()}-4`,
          time: '10:30 AM',
          title: 'Secret Artisan Courtyard & Antique Market',
          category: 'Culture',
          duration: '2 hrs',
          estimatedCost: 200,
          location: 'Old Quarter',
          description: 'Quiet tucked-away heritage courtyard featuring traditional generational craftsmen.',
          transitInfo: 'Short rickshaw ride'
        });
        newCost = oldCost - 150;
        transit = 'Less crowded route';
      } else if (selectedOption === 'adventure') {
        if (activities.length > 1) {
          removedItems.push(activities[1]);
        }
        addedItems.push({
          id: `act-gen-${Date.now()}-5`,
          time: '02:00 PM',
          title: 'Guided Wilderness Trail & Viewpoint Climb',
          category: 'Activity',
          duration: '2.5 hrs',
          estimatedCost: 500,
          location: 'Hilltop Overlook',
          description: 'Scenic ridge trek with panoramic views and wildlife spotting.',
          transitInfo: 'Direct transfer provided'
        });
        newCost = oldCost + 200;
        transit = 'Direct transfer';
      } else {
        // reduce_travel
        if (activities.length > 2) {
          removedItems.push(activities[activities.length - 1]);
        }
        addedItems.push({
          id: `act-gen-${Date.now()}-6`,
          time: '03:30 PM',
          title: 'Historic Neighborhood Artisan Walk',
          category: 'Sightseeing',
          duration: '1.5 hrs',
          estimatedCost: 150,
          location: day.neighborhood || 'Central Square',
          description: 'Compact walkable loop connecting colonial landmarks and town gardens.',
          transitInfo: '100% walkable within 400m'
        });
        transit = 'Reduced by 45 min transit time';
      }

      // Build proposed day
      const removedIds = removedItems.map(r => r.id);
      const remainingActivities = activities.filter(a => !removedIds.includes(a.id));
      const proposedDay = {
        ...day,
        activities: [...remainingActivities, ...addedItems]
      };

      setDiffPreview({
        dayNumber,
        optionTitle: option?.title || 'AI Regeneration',
        removedItems,
        addedItems,
        oldCost,
        newCost,
        transit,
        proposedDay
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleApply = () => {
    if (diffPreview?.proposedDay && onApplyChanges) {
      onApplyChanges(dayNumber, diffPreview.proposedDay);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setDiffPreview(null);
    setSelectedOption('relaxed');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={diffPreview ? `Day ${dayNumber} Changes Preview` : `AI Regenerate Day ${dayNumber}`}
      maxWidth="max-w-xl"
    >
      {!diffPreview ? (
        /* STEP 1: SELECT OPTIMIZATION FOCUS */
        <div className="space-y-5">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose an optimization focus. TripMind AI will recalculate Day {dayNumber}’s timing, activities, and budget with a live diff preview.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REGENERATE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedOption === opt.id;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/15 ring-1 ring-brand-teal'
                      : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-xl shrink-0 ${opt.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGeneratePreview}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 rounded-xl shadow-glow-teal hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Schedule Diff...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Preview Day {dayNumber} Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: DIFF PREVIEW (Prompt Requirement 19) */
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-teal" />
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                DAY {dayNumber} CHANGES ({diffPreview.optionTitle})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Review before applying
            </span>
          </div>

          {/* Diff Content Box */}
          <div className="space-y-4 text-xs">
            {/* Removed Items */}
            {diffPreview.removedItems.length > 0 && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Removed:</span>
                </span>
                <ul className="space-y-1 pl-2">
                  {diffPreview.removedItems.map((item, idx) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="line-through text-slate-500">❌ {item.title}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.duration || '2 hrs'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Added Items */}
            {diffPreview.addedItems.length > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Added:</span>
                </span>
                <ul className="space-y-1 pl-2">
                  {diffPreview.addedItems.map((item, idx) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">✨ {item.title}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.duration || '1.5 hrs'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics Impact Grid: Budget & Transit */}
            <div className="grid grid-cols-2 gap-3">
              {/* Budget Impact */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">Budget Impact:</div>
                <div className="flex items-center gap-2">
                  <span className="line-through text-slate-400 font-mono">
                    {formatCurrency(diffPreview.oldCost, currency)}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(diffPreview.newCost, currency)}
                  </span>
                </div>
              </div>

              {/* Transit Impact */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750">
                <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">Transit:</div>
                <div className="font-bold text-brand-teal flex items-center gap-1">
                  <span>✨</span>
                  <span className="truncate">{diffPreview.transit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Apply Changes & Discard */}
          <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
