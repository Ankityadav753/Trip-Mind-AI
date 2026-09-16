import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, Compass, ShieldCheck, HelpCircle } from 'lucide-react';
import FloatingAICard from './FloatingAICard';
import SurpriseMeModal from '../TripPlanner/SurpriseMeModal';

export default function HeroSection({ travelType = 'india', onTravelTypeChange }) {
  const [destinationInput, setDestinationInput] = useState('');
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (destinationInput.trim()) {
      navigate(`/planner?destination=${encodeURIComponent(destinationInput.trim())}&type=${travelType}`);
    } else {
      navigate(`/planner?type=${travelType}`);
    }
  };

  const handleSelectSurpriseDestination = (destName) => {
    navigate(`/planner?destination=${encodeURIComponent(destName)}&type=india`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8 pb-20 lg:py-24">
      {/* Background Image with Cinematic Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=80"
          alt="Cinematic scenic misty mountain and serene waterways"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Deep navy overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/75 to-slate-50 dark:to-navy-950"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Top Pill with Travel Type Switcher */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/10 dark:bg-navy-900/80 border border-white/20 backdrop-blur-md">
              <button
                type="button"
                onClick={() => onTravelTypeChange?.('india')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  travelType === 'india'
                    ? 'bg-gradient-to-r from-brand-sky to-brand-teal text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇮🇳 India Travel
              </button>
              <button
                type="button"
                onClick={() => onTravelTypeChange?.('international')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  travelType === 'international'
                    ? 'bg-gradient-to-r from-brand-sky to-brand-teal text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🌍 International
              </button>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Your Next Adventure, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky via-brand-teal to-teal-300">
                Planned by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-200/95 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Tell us where you want to go, what you love, and your budget. TripMind AI creates a personalized travel plan in seconds.
            </p>

            {/* Quick Destination Search Form */}
            <form onSubmit={handleQuickSubmit} className="max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white/10 dark:bg-navy-900/90 backdrop-blur-xl border border-white/30 dark:border-navy-700/80 shadow-2xl">
                <div className="flex items-center gap-2.5 px-3 w-full sm:w-auto flex-1">
                  <MapPin className="w-5 h-5 text-brand-teal shrink-0" />
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder={
                      travelType === 'india'
                        ? 'Search Goa, Manali, Kerala, Delhi to Jaipur...'
                        : 'Search Paris, Tokyo, Bali, Dubai, Rome...'
                    }
                    className="w-full py-2 bg-transparent text-white placeholder-slate-300 focus:outline-none text-sm sm:text-base font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal active:scale-95 transition-all shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Plan My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Secondary Action Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 text-sm text-slate-300">
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-medium hover:underline underline-offset-4"
              >
                <Compass className="w-4 h-4 text-brand-sky" />
                <span>Explore Destinations</span>
              </Link>

              <span className="hidden sm:inline text-white/30">•</span>

              <button
                type="button"
                onClick={() => setSurpriseModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium hover:underline underline-offset-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>✨ Surprise Me</span>
              </button>

              <span className="hidden sm:inline text-white/30">•</span>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span>Smart budget in ₹ & USD</span>
              </div>
            </div>
          </div>

          {/* Right Floating Visual Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FloatingAICard />
          </div>
        </div>
      </div>

      <SurpriseMeModal
        isOpen={surpriseModalOpen}
        onClose={() => setSurpriseModalOpen(false)}
        onSelectDestination={handleSelectSurpriseDestination}
      />
    </section>
  );
}
