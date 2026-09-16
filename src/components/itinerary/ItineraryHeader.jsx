import React from 'react';
import { Calendar, Users, DollarSign, Bookmark, Share2, Printer, Download, Sparkles, ArrowLeft, RefreshCw, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDateRange } from '../../utils/formatters';
import AIConfidenceBadge from '../common/AIConfidenceBadge';

export default function ItineraryHeader({
  trip,
  onSave,
  isSaved,
  onShare,
  onExport,
  onPrint,
  currency = 'USD',
  onCurrencyChange
}) {
  if (!trip) return null;

  const totalTravelers = (trip.travelers?.adults || 1) + (trip.travelers?.children || 0);
  const nights = Math.max((trip.durationDays || 1) - 1, 1);
  const foodCount = trip.days?.reduce((acc, d) => acc + (d.activities?.filter(a => a.category === 'Meal' || a.category?.toLowerCase().includes('food') || a.category?.toLowerCase().includes('dining')).length || 0), 0) || ((trip.durationDays || 3) * 2);
  const transitCount = trip.days?.reduce((acc, d) => acc + (d.activities?.filter(a => a.transitInfo || a.category === 'Transit').length || 0), 0) || (trip.days?.length || 3);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-navy-700/80 bg-navy-950 text-white mb-8">
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={trip.heroImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80'}
          alt={trip.destination}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 space-y-6">
        {/* Navigation & Action Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/planner"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Trip Parameters</span>
          </Link>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange?.(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-navy-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              aria-label="Select currency"
            >
              <option value="USD" className="bg-navy-900 text-white">USD ($)</option>
              <option value="EUR" className="bg-navy-900 text-white">EUR (€)</option>
              <option value="GBP" className="bg-navy-900 text-white">GBP (£)</option>
              <option value="JPY" className="bg-navy-900 text-white">JPY (¥)</option>
              <option value="INR" className="bg-navy-900 text-white">INR (₹)</option>
            </select>

            {/* Save Button */}
            <button
              onClick={onSave}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all backdrop-blur-md border ${
                isSaved
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
              <span>{isSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
            </button>

            {/* Share */}
            <button
              onClick={onShare}
              className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Share Itinerary"
              aria-label="Share Itinerary"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Print */}
            <button
              onClick={onPrint}
              className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Print Itinerary"
              aria-label="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Export JSON */}
            <button
              onClick={onExport}
              className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Export as JSON"
              aria-label="Export as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30 text-xs font-bold uppercase tracking-wider">
              {trip.country?.toLowerCase().includes('india') ? '🇮🇳 ' : '🌍 '}{trip.country || 'International'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-md">
              {trip.durationDays} Days · {nights} Nights
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium">
              🍛 {foodCount} food experiences
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium">
              🚆 {transitCount} transit segments
            </span>
            <AIConfidenceBadge size="sm" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {trip.destination}
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 font-light leading-relaxed">
            {trip.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Route optimized for fewer transfers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30 text-xs font-bold">
              <span>✨ AI Optimized</span>
            </span>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Duration */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-brand-sky" />
              <span>Duration</span>
            </div>
            <div className="text-base font-bold text-white">
              {trip.durationDays} Days
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {formatDateRange(trip.startDate, trip.endDate)}
            </div>
          </div>

          {/* Travelers */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-brand-teal" />
              <span>Travelers</span>
            </div>
            <div className="text-base font-bold text-white">
              {totalTravelers} {totalTravelers === 1 ? 'Guest' : 'Guests'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {trip.travelers?.adults || 2} Adults{trip.travelers?.children ? `, ${trip.travelers.children} Kids` : ''}
            </div>
          </div>

          {/* Estimated Budget */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. Budget</span>
            </div>
            <div className="text-base font-bold text-white">
              {formatCurrency(trip.budgetBreakdown?.totalEstimated, currency)}
            </div>
            <div className="text-[11px] text-slate-400 capitalize mt-0.5">
              {trip.budgetTier || 'Moderate'} Tier
            </div>
          </div>

          {/* Pace & Style */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 text-brand-coral" />
              <span>Trip Pace</span>
            </div>
            <div className="text-base font-bold text-white capitalize">
              {trip.tripPace || 'Balanced'}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {trip.travelStyles?.slice(0, 2).join(', ') || 'Culture, Food'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
