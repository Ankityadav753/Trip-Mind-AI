import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Itinerary from './pages/Itinerary';
import Explore from './pages/Explore';
import MyTrips from './pages/MyTrips';
import OnboardingModal from './components/modals/OnboardingModal';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('tripmind_onboarded');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setOnboardingOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveOnboarding = (prefs) => {
    localStorage.setItem('tripmind_onboarded', 'true');
    localStorage.setItem('tripmind_user_prefs', JSON.stringify(prefs));
    if (prefs.preferredRegion && prefs.preferredRegion !== 'both') {
      localStorage.setItem('tripmind_travel_type', prefs.preferredRegion);
    }
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 transition-colors duration-300">
            <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />

          {/* First visit Onboarding (Prompt Requirement 36) */}
          <OnboardingModal
            isOpen={onboardingOpen}
            onClose={() => {
              setOnboardingOpen(false);
              localStorage.setItem('tripmind_onboarded', 'true');
            }}
            onSavePreferences={handleSaveOnboarding}
          />
        </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
