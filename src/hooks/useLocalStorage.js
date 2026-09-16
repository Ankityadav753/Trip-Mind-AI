import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_ITINERARIES } from '../data/sampleItineraries';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserTrips,
  saveTripToSupabase,
  updateTripTitleInSupabase,
  deleteTripFromSupabase,
  duplicateTripInSupabase
} from '../services/tripService';

const STORAGE_KEY = 'tripmind_saved_trips';
const ACTIVE_TRIP_KEY = 'tripmind_active_trip';
const SYNC_EVENT = 'tripmind_trips_changed';

export function useSavedTrips() {
  let auth = null;
  try {
    auth = useAuth();
  } catch {
    // Graceful fallback if called outside AuthProvider
  }
  const user = auth?.user;
  const isAuthenticated = Boolean(user?.id);

  // Helper to read initial local trips
  const getLocalTrips = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      const initial = [SAMPLE_ITINERARIES.paris];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.warn('Failed to parse saved trips from localStorage', e);
      return [SAMPLE_ITINERARIES.paris];
    }
  };

  const [trips, setTrips] = useState(() => getLocalTrips());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notifyChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    }
  };

  const loadTrips = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      setLoading(true);
      setError(null);
      try {
        const cloudTrips = await fetchUserTrips(user.id);
        setTrips(cloudTrips);
      } catch (err) {
        console.error('TripMind AI: Failed to load user trips from Supabase:', err);
        setError(err?.message || 'Failed to load trips from Supabase.');
        setTrips(getLocalTrips());
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(null);
      setTrips(getLocalTrips());
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    loadTrips();

    const handleSync = () => {
      loadTrips();
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
    };
  }, [loadTrips]);

  const persistLocal = (updatedList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write trips to localStorage', e);
    }
  };

  const saveTrip = async (newTrip) => {
    if (!newTrip) return;

    if (isAuthenticated && user?.id) {
      try {
        const savedCloudTrip = await saveTripToSupabase(newTrip, user.id);
        setTrips((prev) => {
          const existsIndex = prev.findIndex((t) => t.id === savedCloudTrip.id);
          let updated;
          if (existsIndex >= 0) {
            updated = [...prev];
            updated[existsIndex] = savedCloudTrip;
          } else {
            updated = [savedCloudTrip, ...prev];
          }
          return updated;
        });
        notifyChange();
        return savedCloudTrip;
      } catch (err) {
        console.error('Failed to save trip to Supabase:', err);
        throw err;
      }
    } else {
      const existsIndex = trips.findIndex((t) => t.id === newTrip.id);
      let updated;
      if (existsIndex >= 0) {
        updated = [...trips];
        updated[existsIndex] = { ...newTrip, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...newTrip, savedAt: new Date().toISOString() }, ...trips];
      }
      setTrips(updated);
      persistLocal(updated);
      notifyChange();
      return updated;
    }
  };

  const deleteTrip = async (tripId) => {
    if (isAuthenticated && user?.id) {
      try {
        await deleteTripFromSupabase(tripId, user.id);
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        notifyChange();
      } catch (err) {
        console.error('Failed to delete trip from Supabase:', err);
        throw err;
      }
    } else {
      const updated = trips.filter((t) => t.id !== tripId);
      setTrips(updated);
      persistLocal(updated);
      notifyChange();
      return updated;
    }
  };

  const duplicateTrip = async (tripId) => {
    const original = trips.find((t) => t.id === tripId);
    if (!original) return;

    if (isAuthenticated && user?.id) {
      try {
        const duplicatedCloud = await duplicateTripInSupabase(original, user.id);
        setTrips((prev) => [duplicatedCloud, ...prev]);
        notifyChange();
        return duplicatedCloud;
      } catch (err) {
        console.error('Failed to duplicate trip in Supabase:', err);
        throw err;
      }
    } else {
      const duplicated = {
        ...JSON.parse(JSON.stringify(original)),
        id: `trip-${Date.now()}`,
        destination: `${original.destination} (Copy)`,
        savedAt: new Date().toISOString()
      };
      const updated = [duplicated, ...trips];
      setTrips(updated);
      persistLocal(updated);
      notifyChange();
      return duplicated;
    }
  };

  const renameTrip = async (tripId, newName) => {
    if (isAuthenticated && user?.id) {
      try {
        await updateTripTitleInSupabase(tripId, newName, user.id);
        setTrips((prev) =>
          prev.map((t) =>
            t.id === tripId ? { ...t, destination: newName, title: newName, updatedAt: new Date().toISOString() } : t
          )
        );
        notifyChange();
      } catch (err) {
        console.error('Failed to rename trip in Supabase:', err);
        throw err;
      }
    } else {
      const updated = trips.map((t) => {
        if (t.id === tripId) {
          return { ...t, destination: newName, title: newName, updatedAt: new Date().toISOString() };
        }
        return t;
      });
      setTrips(updated);
      persistLocal(updated);
      notifyChange();
    }
  };

  const getTrip = (tripId) => {
    return trips.find((t) => t.id === tripId) || null;
  };

  return {
    trips,
    loading,
    error,
    refreshTrips: loadTrips,
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
