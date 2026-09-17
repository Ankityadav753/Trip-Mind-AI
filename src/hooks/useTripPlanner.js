import { useState, useEffect } from 'react';
import { useActiveTrip, useSavedTrips } from './useLocalStorage';
import { generateItinerary, regenerateDay, askAssistant, generatePackingList } from '../services/travelPlannerService';
import { calculateTripBudget } from '../services/budgetService.js';
import { useToast } from './useToast';

const USER_PREFS_KEY = 'tripmind_user_preferences';

export function useTripPlanner() {
  const [activeTrip, setActiveTrip] = useActiveTrip();
  const { trips, saveTrip } = useSavedTrips();
  const { addToast } = useToast();

  const [travelType, setTravelType] = useState(() => {
    try {
      const stored = localStorage.getItem('tripmind_travel_type');
      return stored || 'india';
    } catch {
      return 'india';
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currency, setCurrency] = useState(travelType === 'india' ? 'INR' : 'USD');
  const [packingList, setPackingList] = useState(() => {
    if (activeTrip?.packingList) return activeTrip.packingList;
    return generatePackingList(activeTrip || { destination: 'Goa, India' });
  });

  const [userPrefs, setUserPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_PREFS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tripmind_travel_type', travelType);
    } catch (e) {
      console.warn('Failed to persist travel type', e);
    }
    // Update default currency
    if (travelType === 'india') {
      setCurrency('INR');
    } else if (currency === 'INR') {
      setCurrency('USD');
    }
  }, [travelType]);

  // Sync packing list when active trip changes
  useEffect(() => {
    if (activeTrip) {
      if (activeTrip.packingList && activeTrip.packingList.length > 0) {
        setPackingList(activeTrip.packingList);
      } else {
        const generated = generatePackingList(activeTrip);
        setPackingList(generated);
      }
      if (activeTrip.currency) {
        setCurrency(activeTrip.currency);
      }
    }
  }, [activeTrip?.id]);

  const saveUserPreferences = (prefs) => {
    setUserPrefs(prefs);
    try {
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save user preferences', e);
    }
  };

  const togglePackedItem = (itemId) => {
    setPackingList((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      );
      if (activeTrip) {
        const updatedTrip = { ...activeTrip, packingList: updated };
        setActiveTrip(updatedTrip);
      }
      return updated;
    });
  };

  const addCustomPackingItem = (text, category = 'General') => {
    if (!text.trim()) return;
    const newItem = {
      id: `pack-custom-${Date.now()}`,
      item: text.trim(),
      category,
      packed: false
    };
    setPackingList((prev) => {
      const updated = [...prev, newItem];
      if (activeTrip) {
        setActiveTrip({ ...activeTrip, packingList: updated });
      }
      return updated;
    });
  };

  const removePackingItem = (itemId) => {
    setPackingList((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      if (activeTrip) {
        setActiveTrip({ ...activeTrip, packingList: updated });
      }
      return updated;
    });
  };

  /**
   * Generates diff preview before applying changes to Day X
   */
  const computeDayDiff = async (dayNumber, modificationType) => {
    if (!activeTrip) return null;
    const currentDay = activeTrip.days.find(d => d.dayNumber === dayNumber);
    if (!currentDay) return null;

    const proposedDay = await regenerateDay(currentDay, activeTrip, modificationType);

    // Calculate diff
    const currentTitles = (currentDay.activities || []).map(a => a.title);
    const proposedTitles = (proposedDay.activities || []).map(a => a.title);

    const removed = (currentDay.activities || []).filter(a => !proposedTitles.includes(a.title));
    const added = (proposedDay.activities || []).filter(a => !currentTitles.includes(a.title));

    const oldCost = (currentDay.activities || []).reduce((sum, a) => sum + (Number(a.estimatedCost) || 0), 0);
    const newCost = (proposedDay.activities || []).reduce((sum, a) => sum + (Number(a.estimatedCost) || 0), 0);

    return {
      dayNumber,
      modificationType,
      currentDay,
      proposedDay,
      removed,
      added,
      oldCost,
      newCost,
      costDifference: newCost - oldCost,
      transitImpact: modificationType === 'reduce_travel' ? 'Clustered in 500m radius' : 'Optimized for fewer transfers'
    };
  };

  const applyDayDiff = (diffResult) => {
    if (!activeTrip || !diffResult) return;
    const updatedDays = activeTrip.days.map(d =>
      d.dayNumber === diffResult.dayNumber ? diffResult.proposedDay : d
    );
    const updatedTrip = { ...activeTrip, days: updatedDays };
    updatedTrip.budgetBreakdown = calculateTripBudget(updatedTrip, updatedTrip);
    setActiveTrip(updatedTrip);
    addToast({
      type: 'success',
      title: `Day ${diffResult.dayNumber} Updated`,
      message: `Changes applied successfully to Day ${diffResult.dayNumber}.`
    });
  };

  return {
    travelType,
    setTravelType,
    activeTrip,
    setActiveTrip,
    isGenerating,
    setIsGenerating,
    currency,
    setCurrency,
    packingList,
    togglePackedItem,
    addCustomPackingItem,
    removePackingItem,
    userPrefs,
    saveUserPreferences,
    computeDayDiff,
    applyDayDiff
  };
}
