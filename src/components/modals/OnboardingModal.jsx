import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Compass, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onSavePreferences }) {
  const [preferredRegion, setPreferredRegion] = useState('india');
  const [favoriteStyles, setFavoriteStyles] = useState(['food', 'culture']);

  const stylesList = [
    { id: 'adventure', label: 'Adventure 🏔️' },
    { id: 'food', label: 'Food & Dining 🍛' },
    { id: 'nature', label: 'Nature & Hills 🌿' },
    { id: 'culture', label: 'Heritage & Culture 🏛️' },
    { id: 'relaxation', label: 'Beaches & Relaxation 🏖️' },
    { id: 'spiritual', label: 'Spiritual Shrines 🛕' }
  ];

  const toggleStyle = (id) => {
    setFavoriteStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onSavePreferences({
      preferredRegion,
      favoriteStyles
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to TripMind AI ✦" maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-400 p-0.5 shadow-glow-teal mx-auto flex items-center justify-center mb-3">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-brand-teal" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Personalize Your AI Agent
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tailor future itinerary recommendations to your travel patterns.
          </p>
        </div>

        {/* Question 1: Region */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Where do you travel most?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'india', label: '🇮🇳 India' },
              { id: 'international', label: '🌍 International' },
              { id: 'both', label: 'Both' }
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setPreferredRegion(opt.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  preferredRegion === opt.id
                    ? 'border-brand-teal bg-brand-teal/10 text-brand-teal ring-1 ring-brand-teal'
                    : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Favorite Styles */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            What's your primary travel style?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stylesList.map((st) => {
              const isSelected = favoriteStyles.includes(st.id);
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => toggleStyle(st.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                      : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{st.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal flex items-center justify-center gap-2"
        >
          <span>Save & Start Exploring</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
}
