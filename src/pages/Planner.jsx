import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PlannerForm from '../components/planner/PlannerForm';
import GeneratingModal from '../components/planner/GeneratingModal';
import { generateItinerary } from '../services/travelPlannerService';
import { useActiveTrip } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import { updatePageMeta } from '../utils/seo';
import { Sparkles, Shield, Compass } from 'lucide-react';
import AIConfidenceBadge from '../components/common/AIConfidenceBadge';

export default function Planner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setActiveTrip] = useActiveTrip();
  const { addToast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDestination, setCurrentDestination] = useState('');

  const prefillDest = searchParams.get('destination') || '';

  useEffect(() => {
    updatePageMeta('AI Trip Planner', 'Configure your travel dates, budget, travelers, and travel style to generate a custom day-by-day itinerary.');
  }, []);

  const handleGenerate = async (preferences) => {
    setCurrentDestination(preferences.destination);
    setIsGenerating(true);

    try {
      const generatedTrip = await generateItinerary(preferences);
      setActiveTrip(generatedTrip);

      addToast({
        type: 'success',
        title: 'Itinerary Ready!',
        message: `Personalized ${generatedTrip.durationDays}-day plan created for ${generatedTrip.destination}.`
      });

      // Navigate to Itinerary View
      navigate('/itinerary');
    } catch (err) {
      console.error('Generation failed:', err);
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Unable to synthesize itinerary. Please try again or check your preferences.'
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle background ambient glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-brand-sky/10 via-brand-teal/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Planning Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Plan Your Perfect Trip
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Customize your destination, travel pace, budget, and styles. TripMind AI generates an optimized day-by-day itinerary in seconds.
          </p>
        </div>

        {/* Floating Glass Planner Form Card */}
        <div className="backdrop-blur-2xl bg-white/90 dark:bg-navy-900/85 border border-slate-200/90 dark:border-navy-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <PlannerForm
            initialDestination={prefillDest}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* AI Transparency Notice */}
        <div className="flex justify-center">
          <AIConfidenceBadge />
        </div>
      </div>

      {/* Animated Generation Loading Modal */}
      <GeneratingModal
        isOpen={isGenerating}
        destination={currentDestination}
      />
    </div>
  );
}
