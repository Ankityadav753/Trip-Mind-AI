import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function AIConfidenceBadge({ size = 'md', className = '' }) {
  if (size === 'sm') {
    return (
      <span 
        title="AI-Generated travel suggestion. Operating hours, rates, and availability should be verified before booking."
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-teal/10 text-brand-teal border border-brand-teal/20 backdrop-blur-sm ${className}`}
      >
        <Sparkles className="w-3 h-3 text-brand-teal animate-pulse" />
        AI Estimated
      </span>
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-800/60 border border-slate-700/60 text-slate-300 backdrop-blur-md ${className}`}
      role="note"
      aria-label="AI Transparency Notice"
    >
      <Sparkles className="w-3.5 h-3.5 text-brand-teal shrink-0" />
      <span>
        <strong className="text-white font-medium">AI Simulated Itinerary:</strong> Pricing, opening hours & routes are dynamic estimates. Please verify before travel.
      </span>
      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
    </div>
  );
}
