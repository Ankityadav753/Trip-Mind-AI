/**
 * Map Service Abstraction for TripMind AI
 * Bridges interactive SVG mock map to future Mapbox GL or Google Maps JS SDK.
 */

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
  const R = 6371; // Radius of the earth in km
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

export function extractTripWaypoints(trip, selectedDay = 'all') {
  if (!trip || !trip.days) return [];

  const waypoints = [];
  trip.days.forEach((day) => {
    if (selectedDay === 'all' || String(day.dayNumber) === String(selectedDay)) {
      (day.activities || []).forEach((act) => {
        waypoints.push({
          id: act.id,
          dayNumber: day.dayNumber,
          time: act.time,
          title: act.title,
          category: act.category,
          location: act.location,
          description: act.description,
          estimatedCost: act.estimatedCost,
          coordinates: act.coordinates || trip.coordinates,
          stopNumber: waypoints.length + 1
        });
      });
    }
  });

  return waypoints;
}

export function getMapProviderStatus() {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (mapboxToken) return { provider: 'mapbox', isLive: true };
  if (googleKey) return { provider: 'google', isLive: true };
  return { provider: 'mock_vector', isLive: false, notice: 'Interactive SVG Waypoints Visualizer' };
}
