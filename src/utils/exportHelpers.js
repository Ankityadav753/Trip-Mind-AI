/**
 * Export and sharing utilities
 */

export function exportTripAsJSON(trip) {
  if (!trip) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trip, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `TripMind-${(trip.destination || 'trip').replace(/\s+/g, '_')}-${trip.id || 'itinerary'}.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function triggerPrint() {
  window.print();
}

export function getShareableUrl(trip) {
  if (!trip) return window.location.href;
  const baseUrl = window.location.origin + window.location.pathname;
  // If trip has an id, point to /itinerary?id={trip.id}
  return `${window.location.origin}/itinerary?id=${trip.id || 'sample'}`;
}
