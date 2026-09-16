import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Globe, Shield, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-400 p-0.5 shadow-glow-teal flex items-center justify-center">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-brand-teal" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                TripMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky to-brand-teal font-black">AI</span>
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Next-generation AI travel planning agent. Tell us where you want to go, your budget, and travel style—TripMind orchestrates optimal day-by-day itineraries in seconds.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <Shield className="w-4 h-4 text-brand-teal" />
              <span>AI itineraries are simulated estimates. Verify local hours & pricing.</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore & Plan
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/planner" className="hover:text-brand-teal transition-colors">
                  AI Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-teal transition-colors">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-brand-teal transition-colors">
                  My Saved Trips
                </Link>
              </li>
              <li>
                <Link to="/planner?destination=Paris" className="hover:text-brand-teal transition-colors">
                  Paris Itinerary
                </Link>
              </li>
              <li>
                <Link to="/planner?destination=Tokyo" className="hover:text-brand-teal transition-colors">
                  Tokyo Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Technology & AI
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-500">Route Optimization Engine</span>
              </li>
              <li>
                <span className="text-slate-500">Weather Forecast Service</span>
              </li>
              <li>
                <span className="text-slate-500">Budget Analytics Dashboard</span>
              </li>
              <li>
                <span className="text-slate-500">Multi-Provider AI Architecture</span>
              </li>
              <li>
                <span className="text-slate-500">Local Cache & Export Studio</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Stay in touch */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Get Travel Insights
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Weekly handpicked hidden gems & AI flight planning hacks.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to TripMind AI Travel Dispatch!');
              }}
              className="space-y-2"
            >
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-full pl-3 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-brand-teal hover:text-brand-sky"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} TripMind AI Inc. All rights reserved. Crafted for global explorers.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-teal transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
