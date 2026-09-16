import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  MapPin,
  AlertCircle,
  RotateCw,
  Navigation
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  extractTripWaypoints,
  resolveTripCoordinates,
  normalizeCoordinates
} from '../../services/mapService';
import { formatCurrency } from '../../utils/formatters';

export default function InteractiveMap({ trip, activeHighlight = null, currency = 'USD' }) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [selectedStop, setSelectedStop] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isResolvingCoords, setIsResolvingCoords] = useState(false);
  const [coordError, setCoordError] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersMapRef = useRef(new Map());

  // 1. Resolve destination coordinates using existing multi-tier geocoding flow
  useEffect(() => {
    let isCancelled = false;

    async function loadCoords() {
      if (!trip) return;

      const directCoords = normalizeCoordinates(trip.coordinates);
      if (directCoords) {
        setDestinationCoords(directCoords);
        setCoordError(null);
        return;
      }

      setIsResolvingCoords(true);
      setCoordError(null);

      try {
        const resolved = await resolveTripCoordinates(trip);
        if (!isCancelled) {
          if (resolved) {
            setDestinationCoords({ lat: resolved.lat, lng: resolved.lng });
            setCoordError(null);
          } else {
            setCoordError('Coordinates for this destination could not be resolved.');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('TripMind AI: Map coordinate resolution error:', err);
          setCoordError('Unable to resolve map coordinates.');
        }
      } finally {
        if (!isCancelled) {
          setIsResolvingCoords(false);
        }
      }
    }

    loadCoords();

    return () => {
      isCancelled = true;
    };
  }, [trip?.destination, trip?.coordinates]);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization if already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false, // We supply custom styled controls matching TripMind UI
        attributionControl: false
      });

      // Standard OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Attribution control in bottom right
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false
        })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Invalidate size once rendered into layout
    const timer = setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Cleanup map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Extract waypoints based on selected day filter
  const allStops = extractTripWaypoints(trip, selectedDayFilter);

  // 4. Update Map Markers and Route Polyline when stops or coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersMapRef.current.clear();

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const boundsPoints = [];

    // Add Destination Marker
    if (destinationCoords) {
      const destLatLng = [destinationCoords.lat, destinationCoords.lng];
      boundsPoints.push(destLatLng);

      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer" title="${trip.destination}">
            <span class="absolute -inset-2 rounded-full bg-brand-teal animate-ping opacity-50"></span>
            <div class="w-8 h-8 rounded-full bg-navy-950 border-2 border-brand-teal flex items-center justify-center shadow-2xl text-brand-teal font-extrabold text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const destMarker = L.marker(destLatLng, { icon: destIcon }).addTo(markersGroup);
      destMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; font-weight: bold; color: #0f172a; padding: 2px;">
          📍 ${trip.destination || 'Destination'}
        </div>
      `);
    }

    // Add Activity Stop Markers
    const routeCoords = [];

    allStops.forEach((stop) => {
      if (!stop.hasValidCoordinates || !stop.coordinates) return;

      const stopLatLng = [stop.coordinates.lat, stop.coordinates.lng];
      boundsPoints.push(stopLatLng);
      routeCoords.push(stopLatLng);

      const isSelected = selectedStop?.id === stop.id;

      const activityIcon = L.divIcon({
        className: `custom-activity-pin-${stop.stopIndex}`,
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'}">
            ${isSelected ? '<span class="absolute -inset-2 rounded-full bg-brand-teal animate-ping opacity-60"></span>' : ''}
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shadow-xl border-2 transition-all ${
              isSelected
                ? 'bg-brand-teal border-white text-navy-950 ring-4 ring-brand-teal/40'
                : 'bg-navy-900 border-brand-sky text-white hover:bg-brand-sky hover:text-navy-950'
            }">
              ${stop.stopIndex}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(stopLatLng, { icon: activityIcon }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedStop(stop);
        map.panTo(stopLatLng, { animate: true });
      });

      markersMapRef.current.set(stop.id, { marker, latLng: stopLatLng });
    });

    // Add route line connecting activity waypoints
    if (routeCoords.length > 1) {
      const polyline = L.polyline(routeCoords, {
        color: '#38BDF8',
        weight: 3,
        opacity: 0.85,
        dashArray: '8, 8',
        lineJoin: 'round'
      }).addTo(markersGroup);
      routeLineRef.current = polyline;
    }

    // Fit map bounds to encompass all points
    if (boundsPoints.length > 1) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
      } catch (e) {}
    } else if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 13, { animate: true });
    }
  }, [allStops, destinationCoords, selectedStop?.id]);

  // 5. Sync when activeHighlight is clicked from an external activity card
  useEffect(() => {
    if (!activeHighlight) return;

    // Match stop in current list
    const found = allStops.find((s) => s.id === activeHighlight.id || s.title === activeHighlight.title);
    if (found) {
      setSelectedStop(found);
      const markerInfo = markersMapRef.current.get(found.id);
      if (markerInfo && mapInstanceRef.current) {
        mapInstanceRef.current.setView(markerInfo.latLng, Math.max(mapInstanceRef.current.getZoom(), 14), {
          animate: true
        });
      }
    } else {
      setSelectedStop(activeHighlight);
      if (activeHighlight.coordinates && mapInstanceRef.current) {
        const coords = normalizeCoordinates(activeHighlight.coordinates);
        if (coords) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 14, { animate: true });
        }
      }
    }
  }, [activeHighlight]);

  // Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const boundsPoints = [];
    if (destinationCoords) boundsPoints.push([destinationCoords.lat, destinationCoords.lng]);
    allStops.forEach((s) => {
      if (s.coordinates) boundsPoints.push([s.coordinates.lat, s.coordinates.lng]);
    });

    if (boundsPoints.length > 1) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(boundsPoints), { padding: [50, 50], maxZoom: 15 });
    } else if (boundsPoints.length === 1) {
      mapInstanceRef.current.setView(boundsPoints[0], 13);
    }
  };

  const handleRetryCoordinates = async () => {
    setIsResolvingCoords(true);
    setCoordError(null);
    const resolved = await resolveTripCoordinates(trip);
    if (resolved) {
      setDestinationCoords({ lat: resolved.lat, lng: resolved.lng });
      setCoordError(null);
    } else {
      setCoordError('Coordinates for this destination could not be resolved.');
    }
    setIsResolvingCoords(false);
  };

  if (!trip) return null;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Route Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              OpenStreetMap • Live
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Interactive Itinerary Map</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Numbered stops arranged in optimal geographic sequence to avoid backtrack transit
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedDayFilter('all');
              setSelectedStop(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-white dark:bg-navy-850 text-brand-teal shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Days
          </button>
          {(trip.days || []).map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setSelectedDayFilter(String(day.dayNumber));
                setSelectedStop(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDayFilter === String(day.dayNumber)
                  ? 'bg-white dark:bg-navy-850 text-brand-teal shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Visual Area */}
      <div className="relative h-96 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-navy-800 shadow-inner">
        {/* Leaflet DOM container */}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-0"
          style={{ minHeight: '384px' }}
        />

        {/* Compass / Destination Chip (Top Left) */}
        <div className="absolute top-4 left-4 p-2 rounded-xl bg-navy-900/85 backdrop-blur-md border border-slate-700/80 text-slate-200 flex items-center gap-1.5 text-xs font-mono shadow-md z-[400] pointer-events-auto">
          <Compass className="w-4 h-4 text-brand-teal animate-pulse" />
          <span className="font-semibold">{trip.destination}</span>
        </div>

        {/* Map Control Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[400] pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-navy-900/85 hover:bg-navy-800 border border-slate-700/80 text-white backdrop-blur-md shadow-md transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-navy-900/85 hover:bg-navy-800 border border-slate-700/80 text-white backdrop-blur-md shadow-md transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-navy-900/85 hover:bg-navy-800 border border-slate-700/80 text-white backdrop-blur-md shadow-md transition-colors"
            title="Reset Map View"
            aria-label="Reset map view"
          >
            <Navigation className="w-4 h-4 text-brand-sky" />
          </button>
        </div>

        {/* Unresolved Coordinates Notice (Requirement 18) */}
        {coordError && (
          <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-md bg-amber-500/90 backdrop-blur-md text-navy-950 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center justify-between gap-2 z-[400]">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{coordError}</span>
            </div>
            <button
              onClick={handleRetryCoordinates}
              disabled={isResolvingCoords}
              className="px-2 py-0.5 rounded bg-navy-950 text-white text-[10px] font-bold hover:bg-navy-900 transition-colors"
            >
              {isResolvingCoords ? 'Searching...' : 'Retry'}
            </button>
          </div>
        )}

        {/* Floating Selected Stop Inspector Card (Bottom) */}
        {selectedStop && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-navy-900/95 backdrop-blur-xl border border-brand-teal/40 rounded-2xl p-4 text-white shadow-2xl z-[400] animate-fadeIn space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-teal text-navy-950 text-xs font-bold flex items-center justify-center shrink-0">
                  {selectedStop.stopIndex || 1}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-sky">
                    Day {selectedStop.dayNumber || 1} • {selectedStop.time || 'Scheduled'}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {selectedStop.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedStop(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                aria-label="Close stop preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {selectedStop.description}
            </p>

            <div className="pt-1.5 border-t border-navy-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate max-w-[160px]">
                📍 {selectedStop.location || trip.destination}
              </span>
              <span className="font-bold text-emerald-400">
                {selectedStop.estimatedCost > 0
                  ? formatCurrency(selectedStop.estimatedCost, currency)
                  : 'Free'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Integration Note & Status */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5">
          ✦ OpenStreetMap live tiles active. Powered by Leaflet.
        </span>
        <span className="font-mono text-brand-sky">
          {allStops.filter((s) => s.hasValidCoordinates).length} Live Waypoints
        </span>
      </div>
    </div>
  );
}
