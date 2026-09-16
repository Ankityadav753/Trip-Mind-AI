import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal mb-3" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Verifying authentication session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Authentication Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in to your TripMind AI account to view your cloud-synchronized travel portfolio and personal itineraries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 shadow-glow-teal hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sign In or Sign Up</span>
          </button>

          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  return children;
}
