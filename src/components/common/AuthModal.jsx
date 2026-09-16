import React, { useState } from 'react';
import Modal from './Modal';
import { Compass, Sparkles, Mail, Lock, Check } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('traveler@tripmind.ai');
  const [password, setPassword] = useState('••••••••');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { addToast } = useToast();

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    addToast({
      type: 'success',
      title: 'Welcome back, Alex!',
      message: 'Signed in successfully. Your trips and preferences are synced.'
    });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In to TripMind AI">
      <div className="space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-brand-sky to-brand-teal flex items-center justify-center shadow-glow-teal mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">Unlock TripMind Pro</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Save unlimited itineraries, collaborate with friends, and sync offline maps.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            Sign In with Demo Account
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400">
            Demo credentials are pre-filled for instant testing. No registration required.
          </p>
        </div>
      </div>
    </Modal>
  );
}
