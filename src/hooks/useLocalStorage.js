import { useState, useEffect } from 'react';
import { SAMPLE_ITINERARIES } from '../data/sampleItineraries';

const STORAGE_KEY = 'tripmind_saved_trips';
const ACTIVE_TRIP_KEY = 'tripmind_active_trip';

export function useSavedTrips() {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Pre-seed with flagship Paris itinerary if fresh
      const initial = [SAMPLE_ITINERARIES.paris];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.warn('Failed to parse saved trips from localStorage', e);
      return [SAMPLE_ITINERARIES.paris];
    }
  });

  const persist = (updatedList) => {
    setTrips(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write trips to localStorage', e);
    }
  };

  const saveTrip = (newTrip) => {
    if (!newTrip) return;
    const existsIndex = trips.findIndex(t => t.id === newTrip.id);
    let updated;
    if (existsIndex >= 0) {
      updated = [...trips];
      updated[existsIndex] = { ...newTrip, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...newTrip, savedAt: new Date().toISOString() }, ...trips];
    }
    persist(updated);
    return updated;
  };

  const deleteTrip = (tripId) => {
    const updated = trips.filter(t => t.id !== tripId);
    persist(updated);
    return updated;
  };

  const duplicateTrip = (tripId) => {
    const original = trips.find(t => t.id === tripId);
    if (!original) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: `trip-${Date.now()}`,
      destination: `${original.destination} (Copy)`,
      savedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...trips];
    persist(updated);
    return duplicated;
  };

  const renameTrip = (tripId, newName) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return { ...t, destination: newName, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    persist(updated);
  };

  const getTrip = (tripId) => {
    return trips.find(t => t.id === tripId) || null;
  };

  return {
    trips,
    saveTrip,
    deleteTrip,
    duplicateTrip,
    renameTrip,
    getTrip
  };
}

export function useActiveTrip() {
  const [activeTrip, setActiveTripState] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_TRIP_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to read active trip', e);
    }
    return SAMPLE_ITINERARIES.paris;
  });

  const setActiveTrip = (trip) => {
    setActiveTripState(trip);
    try {
      if (trip) {
        localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
      } else {
        localStorage.removeItem(ACTIVE_TRIP_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active trip', e);
    }
  };

  return [activeTrip, setActiveTrip];
}
