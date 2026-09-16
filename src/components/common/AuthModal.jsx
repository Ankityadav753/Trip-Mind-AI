import React, { useState } from 'react';
import Modal from './Modal';
import { Compass, Sparkles, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, isConfigured } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrorMessage('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const data = await signUp(email.trim(), password, fullName.trim());
        // Check if email confirmation is required by Supabase project settings
        if (data?.user && !data.session) {
          addToast({
            type: 'info',
            title: 'Confirmation Email Sent',
            message: 'Please check your email inbox to verify your account.'
          });
        } else {
          addToast({
            type: 'success',
            title: 'Account Created!',
            message: `Welcome to TripMind AI, ${fullName || email.split('@')[0]}!`
          });
        }
        handleClose();
      } else {
        await signIn(email.trim(), password);
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Signed in successfully. Your trips and preferences are synced.'
        });
        handleClose();
      }
    } catch (err) {
      console.error('Authentication error:', err);
      // Clean up Supabase error message if needed
      const msg = err?.message || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'signin' ? 'Sign In to TripMind AI' : 'Create Your TripMind Account'}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Header Icon & Tagline */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-400 flex items-center justify-center shadow-glow-teal mb-3 p-0.5">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-brand-teal" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Welcome Back Traveler' : 'Begin Your AI Journey'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your cloud-saved itineraries, bookmarks, and chat history.'
              : 'Create an account to save custom trips, sync across devices, and unlock AI recommendations.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-navy-950 p-1 border border-slate-200/80 dark:border-navy-800">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Configuration Notice if credentials missing */}
        {!isConfigured && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
            <strong>Supabase Setup:</strong> To enable live authentication, ensure <code className="font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="font-mono text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code> are configured in your <code className="font-mono text-[11px]">.env</code> file.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Password {mode === 'signup' && <span className="text-[10px] text-slate-400 font-normal">(min. 6 characters)</span>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle Text */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signin' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className="font-bold text-brand-teal hover:underline"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className="font-bold text-brand-teal hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}
