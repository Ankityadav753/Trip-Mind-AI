import React from 'react';
import { Sparkles, Compass, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function FloatingAICard() {
  return (
    <div className="relative animate-float">
      {/* Outer glow ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>

      {/* Main Glass Card */}
      <div className="relative backdrop-blur-2xl bg-white/80 dark:bg-navy-900/80 border border-white/40 dark:border-navy-700/80 p-5 sm:p-6 rounded-2xl shadow-glass dark:shadow-glass-dark text-slate-800 dark:text-slate-100 max-w-sm w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-sky flex items-center justify-center text-white shadow-glow-teal">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                ✦ AI Travel Assistant
              </h4>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Planning your perfect trip...
              </p>
            </div>
          </div>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal"></span>
          </span>
        </div>

        {/* Live generation feed items */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-navy-950/60 border border-slate-200/40 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Clustered 4 stops in Le Marais</span>
            </div>
            <span className="text-[10px] font-mono text-brand-sky">-45m transit</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-navy-950/60 border border-slate-200/40 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Verified sunset timing at Sacré-Cœur</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400">07:42 PM</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-navy-950/60 border border-slate-200/40 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Budget balanced under $2,500</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">On Target</span>
          </div>
        </div>

        {/* Mini progress footer */}
        <div className="pt-2">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span>Optimization Progress</span>
            <span className="font-semibold text-brand-teal">94%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-navy-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-sky via-brand-teal to-teal-400 rounded-full w-[94%] transition-all duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
