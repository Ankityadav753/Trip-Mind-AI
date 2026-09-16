import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Compass } from 'lucide-react';

const STEPS = [
  'Understanding your travel preferences & pacing...',
  'Sourcing neighborhood spots & local verified highlights...',
  'Clustering activities to minimize transit time...',
  'Optimizing category budget & dining estimates...',
  'Finalizing your personalized day-by-day itinerary...'
];

export default function GeneratingModal({ isOpen, destination = 'your destination' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(15);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
      setProgress((prev) => Math.min(prev + 20, 95));
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Glow animated icon */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-400 blur-lg opacity-60 animate-pulse"></div>
          <div className="relative w-full h-full rounded-2xl bg-navy-950 flex items-center justify-center border border-brand-teal/40">
            <Compass className="w-8 h-8 text-brand-teal animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TripMind AI Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Planning Your Journey to {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyzing optimal routes, seasonal weather, and curated local culinary spots...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Synthesizing plan</span>
            <span className="text-brand-teal font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-sky via-brand-teal to-teal-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step-by-step checklist */}
        <div className="space-y-2.5 text-left pt-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-brand-teal/10 dark:bg-brand-teal/15 border border-brand-teal/30 text-brand-teal font-semibold'
                    : isCompleted
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-brand-teal animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-navy-700 shrink-0"></div>
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
