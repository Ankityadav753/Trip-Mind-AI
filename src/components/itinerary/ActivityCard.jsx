import React from 'react';
import { Clock, MapPin, DollarSign, ChevronUp, ChevronDown, Edit2, Trash2, Footprints, Info, Sparkles, Navigation } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ActivityCard({
  activity,
  index,
  totalActivities,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onHighlightMap,
  currency = 'USD'
}) {
  if (!activity) return null;

  return (
    <div className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 hover:border-brand-teal/40 dark:hover:border-brand-teal/40 transition-all shadow-xs hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
        {/* Time & Category */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-brand-teal" />
            <span>{activity.time}</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-sky/10 text-brand-sky border border-brand-sky/20">
            {activity.category}
          </span>

          {activity.isAiEstimated && (
            <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-950">
              AI Estimated
            </span>
          )}
        </div>

        {/* Cost & Reordering / Edit Tools */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {activity.estimatedCost > 0
              ? formatCurrency(activity.estimatedCost, currency)
              : <span className="text-emerald-500 font-semibold">Free</span>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-navy-950 p-1 rounded-xl">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
              title="Move activity earlier"
              aria-label="Move earlier"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalActivities - 1}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
              title="Move activity later"
              aria-label="Move later"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(activity)}
              className="p-1 rounded text-slate-400 hover:text-brand-teal transition-colors"
              title="Edit activity"
              aria-label="Edit activity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
              title="Remove activity"
              aria-label="Delete activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Details */}
      <div className="pt-3 space-y-2">
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-teal transition-colors">
          {activity.title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {activity.description}
        </p>

        {/* Location & Opening hours & Transit distance */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
          {/* Location */}
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-brand-coral shrink-0" />
            <span className="truncate max-w-[200px]">{activity.location}</span>
          </div>

          {/* Transit distance / walking */}
          {activity.transitInfo && (
            <div className="flex items-center gap-1 text-brand-teal font-medium">
              <Footprints className="w-3.5 h-3.5 shrink-0" />
              <span>{activity.transitInfo}</span>
            </div>
          )}

          {/* Opening Hours */}
          {activity.openingHours && (
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{activity.openingHours}</span>
            </div>
          )}

          {/* Map view trigger */}
          <button
            type="button"
            onClick={() => onHighlightMap?.(activity)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-sky hover:underline ml-auto"
          >
            <Navigation className="w-3 h-3" />
            <span>View on Map</span>
          </button>
        </div>

        {/* Custom notes if any */}
        {activity.notes && (
          <div className="mt-2 text-[11px] p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>{activity.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
