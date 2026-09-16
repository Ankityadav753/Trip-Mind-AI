import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ExploreIndia from '../components/ExploreDestinations/ExploreIndia';
import WeekendTripPlanner from '../components/ExploreDestinations/WeekendTripPlanner';
import FestivalTravel from '../components/ExploreDestinations/FestivalTravel';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import { Sparkles, ArrowRight, Compass, Star, MapPin } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta('Smart Travel Planning Agent', 'TripMind AI creates personalized day-by-day travel itineraries in seconds with smart budgeting, weather sync, and local recommendations.');
  }, []);

  const handlePlanDestination = (destName) => {
    navigate(`/planner?destination=${encodeURIComponent(destName)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Explore India with AI Section (India-first experience) */}
      <ExploreIndia />

      {/* 3. Weekend Trip Planner */}
      <WeekendTripPlanner />

      {/* 4. Festival Travel */}
      <FestivalTravel />

      {/* 2. Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Trending Getaways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Popular Destinations
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Select an iconic hotspot to generate an instant AI itinerary.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-sky group transition-colors"
          >
            <span>View All 8+ Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner with Badge */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-slate-200 text-xs font-medium">
                      {dest.priceLevel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs font-semibold text-brand-sky uppercase tracking-wider">
                      {dest.country}
                    </span>
                    <h3 className="text-xl font-bold">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Description & Tags */}
                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan Trip Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handlePlanDestination(dest.name)}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip to {dest.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Section */}
      <FeaturesSection />

      {/* 4. Testimonials Section */}
      <TestimonialsSection />

      {/* 5. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-700/60 p-8 sm:p-14 text-center text-white shadow-2xl space-y-6">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-sky/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free to Use • No Credit Card Required</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Plan Your Next Adventure?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Let AI turn your travel ideas into an unforgettable journey with curated schedules, optimized routes, and budget transparency.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>✨ Start Planning Now</span>
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all"
              >
                <span>Browse Destinations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
