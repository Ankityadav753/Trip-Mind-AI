import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Elena Rostova',
    role: 'Solo Cultural Traveler',
    destination: 'Paris & Provence',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'TripMind planned our entire 7-day trip in minutes. It grouped the Latin Quarter and Saint-Germain on the same day, saving us hours of subway transfers. It felt like having a local friend guide us.',
    rating: 5
  },
  {
    name: 'Marcus & Jessica Vance',
    role: 'Honeymooners',
    destination: 'Tokyo & Kyoto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'The budget breakdown was scarily accurate! We selected the Moderate tier and the dining recommendations matched our exact vibe without blowing past our $3,000 honeymoon budget.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Adventure Explorer',
    destination: 'Swiss Alps & Interlaken',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'I used the "Ask TripMind AI" chat assistant when our mountain pass was rained out. Within seconds it restructured Day 3 with indoor thermal baths and scenic fondue spots. Remarkable product!',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-navy-900/40 transition-colors duration-300 border-t border-slate-200/60 dark:border-navy-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Verified Explorer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Travelers Worldwide
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Over 40,000 vacations planned across 85 countries with seamless AI precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200/70 dark:border-navy-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="w-8 h-8 text-brand-teal/20 absolute right-6 top-6" />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-navy-800 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-teal/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-brand-teal fill-brand-teal/20" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role} • <span className="text-brand-sky">{t.destination}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
