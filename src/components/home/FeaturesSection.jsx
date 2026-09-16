import React from 'react';
import { Sparkles, DollarSign, Map, UtensilsCrossed, Zap, CloudSun } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    color: 'from-sky-400 to-blue-600',
    title: 'Personalized Itineraries',
    description: 'AI analyzes your pace, traveling companions, and style to handcraft schedules tailored to how you truly travel.',
    badge: 'Adaptive AI'
  },
  {
    icon: DollarSign,
    color: 'from-teal-400 to-emerald-600',
    title: 'Smart Budget Planning',
    description: 'Real-time category breakdown across hotels, dining, passes, and transit keeps you fully on budget without surprises.',
    badge: 'Zero Overspending'
  },
  {
    icon: Map,
    color: 'from-amber-400 to-orange-600',
    title: 'Day-by-Day Routes',
    description: 'Intelligently clusters activities in adjacent districts to eliminate back-and-forth transit and save precious vacation hours.',
    badge: 'Route Optimized'
  },
  {
    icon: UtensilsCrossed,
    color: 'from-rose-400 to-pink-600',
    title: 'Local Recommendations',
    description: 'Uncover authentic bistros, neighborhood bakeries, and quiet hidden courtyards away from crowded tourist traps.',
    badge: 'Curated Spots'
  },
  {
    icon: Zap,
    color: 'from-indigo-400 to-cyan-600',
    title: 'Instant Planning',
    description: 'Generate comprehensive multi-day itineraries complete with opening hours, directions, and costs in seconds.',
    badge: 'Under 3 Seconds'
  },
  {
    icon: CloudSun,
    color: 'from-amber-300 to-sky-500',
    title: 'Weather & Climate Sync',
    description: 'Integrated multi-day forecasts suggest indoor museums during rain and outdoor panoramic vistas for golden hour sunsets.',
    badge: 'Forecast Sync'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-navy-950 transition-colors duration-300 border-t border-slate-200/60 dark:border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Travelers Love TripMind</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Travel Planning, Reimagined by AI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Say goodbye to 40 open browser tabs, conflicting travel blogs, and messy spreadsheets. TripMind unifies everything into one seamless itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 hover:border-brand-teal/50 dark:hover:border-brand-teal/50 transition-all duration-300 shadow-sm hover:shadow-glow-teal flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-teal transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
