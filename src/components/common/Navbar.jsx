import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Moon, Sun, Menu, X, Bookmark, Globe } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useSavedTrips } from '../../hooks/useLocalStorage';
import AuthModal from './AuthModal';

export default function Navbar({ travelType = 'india', onTravelTypeChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { trips } = useSavedTrips();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plan a Trip', path: '/planner' },
    { name: 'Explore', path: '/explore' },
    { name: 'My Trips', path: '/my-trips', count: trips.length },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleToggleTravelType = (type) => {
    if (onTravelTypeChange) {
      onTravelTypeChange(type);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-navy-950/80 border-b border-slate-200/60 dark:border-navy-800/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-400 p-0.5 shadow-glow-teal flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-brand-teal group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ✦ TripMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky to-brand-teal font-black">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                India & Global Travel SaaS
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-navy-900/60 p-1.5 rounded-full border border-slate-200/50 dark:border-navy-800/60">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-navy-800/40'
                  }`}
                >
                  {link.name}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[11px] font-semibold rounded-full bg-brand-teal/15 text-brand-teal border border-brand-teal/30">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* 🌍 India / International Mode Selector */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200/60 dark:border-navy-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleTravelType('india')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  travelType === 'india'
                    ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>🇮🇳 India</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleTravelType('international')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  travelType === 'international'
                    ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>🌍 Global</span>
              </button>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900 border border-transparent hover:border-slate-200 dark:hover:border-navy-800 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
            >
              Sign In
            </button>

            {/* Start Planning CTA */}
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Planning</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-navy-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-navy-800 px-4 py-5 space-y-3 animate-fadeIn">
            {/* Travel Type in Mobile Drawer */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-navy-900 mb-2">
              <span className="text-xs font-semibold text-slate-500">Destination Focus:</span>
              <div className="flex items-center gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleTravelType('india')}
                  className={`px-3 py-1 rounded-lg ${travelType === 'india' ? 'bg-brand-teal text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  🇮🇳 India
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTravelType('international')}
                  className={`px-3 py-1 rounded-lg ${travelType === 'international' ? 'bg-brand-teal text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  🌍 Global
                </button>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-teal/10 text-brand-teal font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900'
                }`}
              >
                <span>{link.name}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-brand-teal/20 text-brand-teal">
                    {link.count}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 py-2"
              >
                Sign In
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-2"
              >
                <span>Theme:</span>
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
