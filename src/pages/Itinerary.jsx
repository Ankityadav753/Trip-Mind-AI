import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useActiveTrip, useSavedTrips } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import { updatePageMeta } from '../utils/seo';
import { exportTripAsJSON, triggerPrint } from '../utils/exportHelpers';

import ItineraryHeader from '../components/itinerary/ItineraryHeader';
import WeatherWidget from '../components/itinerary/WeatherWidget';
import DayTimeline from '../components/itinerary/DayTimeline';
import BudgetDashboard from '../components/itinerary/BudgetDashboard';
import AIRecommendations from '../components/itinerary/AIRecommendations';
import InteractiveMap from '../components/map/InteractiveMap';
import FloatingAssistant from '../components/assistant/FloatingAssistant';
import ShareModal from '../components/itinerary/ShareModal';
import RegionalFoodGuide from '../components/Recommendations/RegionalFoodGuide';
import PackingAssistant from '../components/Itinerary/PackingAssistant';
import { Compass, Sparkles, Plus, AlertCircle } from 'lucide-react';

export default function Itinerary() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('id');
  const [activeTrip, setActiveTrip] = useActiveTrip();
  const { trips, saveTrip, getTrip } = useSavedTrips();
  const { addToast } = useToast();

  const [currentTrip, setCurrentTrip] = useState(activeTrip);
  const [currency, setCurrency] = useState(
    activeTrip?.currency || (activeTrip?.country?.toLowerCase().includes('india') ? 'INR' : 'USD')
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mapHighlight, setMapHighlight] = useState(null);

  const mapRef = useRef(null);

  // Sync trip if query parameter ?id=... is specified
  useEffect(() => {
    if (tripIdParam) {
      const found = getTrip(tripIdParam);
      if (found) {
        setCurrentTrip(found);
        setActiveTrip(found);
        if (found.currency) setCurrency(found.currency);
      }
    } else if (activeTrip) {
      setCurrentTrip(activeTrip);
      if (activeTrip.currency) setCurrency(activeTrip.currency);
    }
  }, [tripIdParam, activeTrip]);

  useEffect(() => {
    if (currentTrip?.destination) {
      updatePageMeta(
        `${currentTrip.destination} Itinerary`,
        `Complete day-by-day travel itinerary for ${currentTrip.destination} with route maps, weather forecast, and budget allocation.`
      );
    }
  }, [currentTrip]);

  if (!currentTrip) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            No Itinerary Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You haven’t planned a trip yet. Enter your dream destination and let AI generate your personalized schedule.
          </p>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-sky to-brand-teal shadow-glow-teal"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan a Trip Now</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadySaved = trips.some(t => t.id === currentTrip.id);

  const handleSave = () => {
    saveTrip(currentTrip);
    addToast({
      type: 'success',
      title: 'Trip Saved!',
      message: `"${currentTrip.destination}" is saved to My Trips.`
    });
  };

  const handleUpdateDay = (dayNumber, updatedDay) => {
    const updatedDays = currentTrip.days.map((d) =>
      d.dayNumber === dayNumber ? updatedDay : d
    );
    const updatedTrip = { ...currentTrip, days: updatedDays };
    setCurrentTrip(updatedTrip);
    setActiveTrip(updatedTrip);

    addToast({
      type: 'info',
      title: 'Itinerary Updated',
      message: `Day ${dayNumber} changes saved.`
    });
  };

  const handleApplyAssistantChanges = (targetDayNumber, proposedDay) => {
    handleUpdateDay(targetDayNumber, proposedDay);
  };

  const handleHighlightMap = (activity) => {
    setMapHighlight(activity);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddRecommendationToDay = (item) => {
    if (!currentTrip.days || currentTrip.days.length === 0) return;
    const targetDay = currentTrip.days[0];
    const newActivity = {
      id: `act-rec-${Date.now()}`,
      time: '04:30 PM',
      title: item.name,
      category: item.type || item.cuisine || 'Curated Spot',
      location: item.neighborhood || currentTrip.destination,
      description: item.description,
      estimatedCost: item.pricePerNight ? Math.round(item.pricePerNight / 2) : 25,
      openingHours: '10:00 AM – 09:00 PM',
      transitInfo: 'Walking distance',
      coordinates: currentTrip.coordinates,
      notes: 'Added from AI Recommendations',
      isAiEstimated: true
    };

    handleUpdateDay(targetDay.dayNumber, {
      ...targetDay,
      activities: [...targetDay.activities, newActivity]
    });

    addToast({
      type: 'success',
      title: 'Added to Day 1',
      message: `"${item.name}" has been slotted into Day 1 schedule.`
    });
  };

  const defaultPackingList = [
    { id: 'p1', item: 'Comfortable walking shoes / sneakers', category: 'Footwear', packed: true },
    { id: 'p2', item: 'Light breathable cotton outfits', category: 'Clothing', packed: false },
    { id: 'p3', item: 'SPF 50+ Sunscreen & Sunglasses', category: 'Health & Toiletries', packed: false },
    { id: 'p4', item: 'Universal power adapter & 20,000mAh power bank', category: 'Electronics', packed: true },
    { id: 'p5', item: 'Govt ID / Passport / Train tickets', category: 'Documents', packed: true },
    { id: 'p6', item: 'Refillable insulated water bottle', category: 'Essentials', packed: false },
    { id: 'p7', item: 'Light jacket / Shawl for AC transit', category: 'Clothing', packed: false }
  ];

  const packingList = currentTrip.packingList || defaultPackingList;

  const handleTogglePackingItem = (id) => {
    const updatedList = packingList.map(i =>
      i.id === id ? { ...i, packed: !i.packed } : i
    );
    const updatedTrip = { ...currentTrip, packingList: updatedList };
    setCurrentTrip(updatedTrip);
    setActiveTrip(updatedTrip);
  };

  const handleAddPackingItem = (text, category) => {
    const newItem = {
      id: `pack-${Date.now()}`,
      item: text,
      category: category || 'Essentials',
      packed: false
    };
    const updatedList = [...packingList, newItem];
    const updatedTrip = { ...currentTrip, packingList: updatedList };
    setCurrentTrip(updatedTrip);
    setActiveTrip(updatedTrip);
  };

  const handleRemovePackingItem = (id) => {
    const updatedList = packingList.filter(i => i.id !== id);
    const updatedTrip = { ...currentTrip, packingList: updatedList };
    setCurrentTrip(updatedTrip);
    setActiveTrip(updatedTrip);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header Banner & Stats */}
      <ItineraryHeader
        trip={currentTrip}
        isSaved={isAlreadySaved}
        onSave={handleSave}
        onShare={() => setShareModalOpen(true)}
        onExport={() => exportTripAsJSON(currentTrip)}
        onPrint={() => triggerPrint()}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* 2. Destination Weather Forecast */}
      <WeatherWidget weather={currentTrip.weatherSummary} />

      {/* Main Content Layout: Timeline on Left, Map & Budget on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Day-by-Day Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Day-by-Day Schedule</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                {currentTrip.days?.length} Days
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Drag or reorder stops anytime
            </span>
          </div>

          <DayTimeline
            days={currentTrip.days || []}
            onUpdateDay={handleUpdateDay}
            onHighlightMap={handleHighlightMap}
            currency={currency}
          />
        </div>

        {/* Interactive Map & Budget Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          {/* Interactive Map */}
          <div ref={mapRef}>
            <InteractiveMap
              trip={currentTrip}
              activeHighlight={mapHighlight}
              currency={currency}
            />
          </div>

          {/* Budget Dashboard */}
          <BudgetDashboard
            budgetBreakdown={currentTrip.budgetBreakdown}
            durationDays={currentTrip.durationDays}
            currency={currency}
          />
        </div>
      </div>

      {/* 4. Curated AI Recommendations (Hotels, Dining, Attractions, Hidden Gems) */}
      <div className="pt-6">
        <AIRecommendations
          recommendations={currentTrip.recommendations}
          onAddToDay={handleAddRecommendationToDay}
        />
      </div>

      {/* 5. Regional Food Guide (Prompt Requirement 6) */}
      <div className="pt-2">
        <RegionalFoodGuide
          destination={currentTrip.destination}
        />
      </div>

      {/* 6. AI Packing Assistant (Prompt Requirement 25) */}
      <div className="pt-2">
        <PackingAssistant
          packingList={packingList}
          onToggleItem={handleTogglePackingItem}
          onAddItem={handleAddPackingItem}
          onRemoveItem={handleRemovePackingItem}
        />
      </div>

      {/* 7. Floating "Ask TripMind AI" Assistant */}
      <FloatingAssistant
        trip={currentTrip}
        onApplyDayChanges={handleApplyAssistantChanges}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={currentTrip}
      />
    </div>
  );
}
