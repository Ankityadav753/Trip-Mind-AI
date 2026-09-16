/**
 * Map Service for TripMind AI
 * Powered by OpenStreetMap and Leaflet.
 * Reuses coordinate resolution and provides waypoint extraction,
 * distance calculation, and map provider status utilities.
 */

import { resolveCoordinates } from './weatherService.js';

export { resolveCoordinates };

/**
 * Calculates Great-Circle distance between two coordinates in km using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 1.5;
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Normalizes coordinate objects ({ lat, lng } or { latitude, longitude })
 * Returns valid { lat: number, lng: number } or null.
 */
export function normalizeCoordinates(coords) {
  if (!coords || typeof coords !== 'object') return null;
  const lat = Number(coords.lat ?? coords.latitude);
  const lng = Number(coords.lng ?? coords.longitude);
  if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
    return { lat, lng };
  }
  return null;
}

/**
 * Resolves destination coordinates for a trip using the existing multi-tier geocoding flow:
 * 1. trip.coordinates
 * 2. destination repositories
 * 3. Open-Meteo Geocoding API
 * 4. null if unresolvable
 */
export async function resolveTripCoordinates(trip) {
  if (!trip) return null;
  const queryName = trip.destination || trip.city || trip.title || '';
  return resolveCoordinates(queryName, trip.coordinates);
}

/**
 * Extracts and normalizes waypoints for the given day filter.
 * If multiple activities share the exact same city-level coordinates,
 * applies a deterministic micro-radial offset so all numbered markers are distinct and visible.
 */
export function extractTripWaypoints(trip, selectedDay = 'all') {
  if (!trip || !trip.days) return [];

  const baseCoords = normalizeCoordinates(trip.coordinates);
  const waypoints = [];
  const coordsUsageCount = new Map();

  trip.days.forEach((day) => {
    if (selectedDay === 'all' || String(day.dayNumber) === String(selectedDay)) {
      (day.activities || []).forEach((act, actIdx) => {
        let rawCoords = normalizeCoordinates(act.coordinates) || baseCoords;
        let finalLat = rawCoords?.lat;
        let finalLng = rawCoords?.lng;

        if (finalLat != null && finalLng != null) {
          const key = `${finalLat.toFixed(3)}_${finalLng.toFixed(3)}`;
          const count = coordsUsageCount.get(key) || 0;
          coordsUsageCount.set(key, count + 1);

          // If this coordinate is reused on the same day, fan out slightly so pins don't overlap completely
          if (count > 0) {
            const angle = (count * 60) * (Math.PI / 180);
            const radius = 0.0035 * Math.ceil(count / 6); // ~350m offset
            finalLat += Math.cos(angle) * radius;
            finalLng += Math.sin(angle) * radius;
          }
        }

        waypoints.push({
          id: act.id || `act-${day.dayNumber}-${actIdx}`,
          dayNumber: day.dayNumber,
          stopIndex: waypoints.length + 1,
          time: act.time || '10:00 AM',
          title: act.title || 'Itinerary Stop',
          category: act.category || 'Sightseeing',
          location: act.location || trip.destination,
          description: act.description || '',
          estimatedCost: act.estimatedCost || 0,
          coordinates: finalLat != null && finalLng != null ? { lat: finalLat, lng: finalLng } : null,
          hasValidCoordinates: finalLat != null && finalLng != null
        });
      });
    }
  });

  return waypoints;
}

/**
 * Returns active map provider status (OpenStreetMap via Leaflet)
 */
export function getMapProviderStatus() {
  return {
    provider: 'openstreetmap',
    library: 'leaflet',
    isLive: true,
    attribution: '© OpenStreetMap contributors',
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };
}
