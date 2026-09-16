import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSavedTrips, useActiveTrip } from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { updatePageMeta } from '../utils/seo';
import { exportTripAsJSON } from '../utils/exportHelpers';
import { formatCurrency, formatDateRange } from '../utils/formatters';

import {
  Bookmark,
  Calendar,
  Users,
  DollarSign,
  Trash2,
  Copy,
  Edit3,
  Download,
  ArrowRight,
  Plus,
  Sparkles,
  Plane,
  Search,
  ArrowUpDown,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Modal from '../components/common/Modal';
import AuthModal from '../components/common/AuthModal';

export default function MyTrips() {
  const { trips, loading, error, refreshTrips, deleteTrip, duplicateTrip, renameTrip } = useSavedTrips();
  const [, setActiveTrip] = useActiveTrip();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'india', 'international'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  const [renameModal, setRenameModal] = useState({ isOpen: false, tripId: null, currentName: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tripId: null, tripName: '' });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    updatePageMeta('My Saved Trips', 'View, customize, duplicate, and export your saved AI travel itineraries.');
  }, []);

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip);
    navigate(`/itinerary?id=${trip.id}`);
  };

  const handleDuplicate = async (tripId) => {
    try {
      const duplicated = await duplicateTrip(tripId);
      if (duplicated) {
        addToast({
          type: 'success',
          title: 'Trip Duplicated',
          message: `Created a copy: "${duplicated.destination}".`
        });
      }
    } catch (err) {
      console.error('Duplicate trip error:', err);
      addToast({
        type: 'error',
        title: 'Duplication Failed',
        message: err.message || 'Could not duplicate trip.'
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.tripId) {
      try {
        await deleteTrip(deleteModal.tripId);
        addToast({
          type: 'info',
          title: 'Trip Removed',
          message: `"${deleteModal.tripName}" was deleted.`
        });
        setDeleteModal({ isOpen: false, tripId: null, tripName: '' });
      } catch (err) {
        console.error('Delete trip error:', err);
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err.message || 'Could not delete trip.'
        });
      }
    }
  };

  const handleSaveRename = async (e) => {
    e.preventDefault();
    if (renameModal.tripId && renameModal.currentName.trim()) {
      try {
        await renameTrip(renameModal.tripId, renameModal.currentName.trim());
        addToast({
          type: 'success',
          title: 'Renamed Successfully',
          message: `Trip renamed to "${renameModal.currentName.trim()}".`
        });
        setRenameModal({ isOpen: false, tripId: null, currentName: '' });
      } catch (err) {
        console.error('Rename trip error:', err);
        addToast({
          type: 'error',
          title: 'Rename Failed',
          message: err.message || 'Could not rename trip.'
        });
      }
    }
  };

  // Filter & sort logic
  const filteredTrips = trips
    .filter((trip) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        trip.destination?.toLowerCase().includes(q) ||
        trip.country?.toLowerCase().includes(q) ||
        trip.tagline?.toLowerCase().includes(q);

      const isIndia =
        trip.travelType === 'india' ||
        trip.country?.toLowerCase().includes('india') ||
        trip.currency === 'INR';

      if (filterType === 'india') return matchesSearch && isIndia;
      if (filterType === 'international') return matchesSearch && !isIndia;
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.startDate || 0).getTime();
      const dateB = new Date(b.createdAt || b.startDate || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Travel Portfolio
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal font-semibold">
              {trips.length} Saved {trips.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Saved Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revisit, duplicate, rename, or export your AI-crafted journeys anytime
          </p>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a New Trip</span>
        </Link>
      </div>

      {/* Cloud Account & Sync Notice */}
      {user ? (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Connected as <strong className="font-semibold">{user.user_metadata?.full_name || user.email}</strong> • Cloud Authentication Active
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-navy-900/80 border border-slate-200/80 dark:border-navy-800 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-teal shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              Sign in with your TripMind account to securely authenticate and access cloud features.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 transition-all self-start sm:self-auto shrink-0"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Filter and Search Bar (Prompt Requirement 30) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved trips by destination or keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        {/* Filter Buttons & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-brand-teal text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Trips
            </button>
            <button
              type="button"
              onClick={() => setFilterType('india')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'india'
                  ? 'bg-brand-teal text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇮🇳 India
            </button>
            <button
              type="button"
              onClick={() => setFilterType('international')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'international'
                  ? 'bg-brand-teal text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🌍 International
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Grid or Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-3 rounded-3xl border border-slate-200/80 dark:border-navy-800 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {user ? 'Retrieving your cloud trips from Supabase...' : 'Loading trips...'}
          </p>
          <p className="text-xs text-slate-400">Please wait while we sync your travel portfolio.</p>
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-800 dark:text-rose-200">Failed to load Supabase trips</h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refreshTrips()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 rounded-xl transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => {
            const totalTravelers = (trip.travelers?.adults || 1) + (trip.travelers?.children || 0);
            const isIndia =
              trip.travelType === 'india' ||
              trip.country?.toLowerCase().includes('india') ||
              trip.currency === 'INR';
            const tripCurrency = trip.currency || (isIndia ? 'INR' : 'USD');
            const createdDateFormatted = trip.createdAt
              ? new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recently created';

            return (
              <div
                key={trip.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={trip.heroImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>

                    {/* Quick Menu Tools */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {/* Rename */}
                      <button
                        onClick={() => setRenameModal({ isOpen: true, tripId: trip.id, currentName: trip.destination })}
                        className="p-1.5 rounded-lg bg-navy-900/70 hover:bg-navy-900 text-white backdrop-blur-md transition-colors"
                        title="Rename trip"
                        aria-label="Rename trip"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(trip.id)}
                        className="p-1.5 rounded-lg bg-navy-900/70 hover:bg-navy-900 text-white backdrop-blur-md transition-colors"
                        title="Duplicate itinerary"
                        aria-label="Duplicate itinerary"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Export JSON */}
                      <button
                        onClick={() => exportTripAsJSON(trip)}
                        className="p-1.5 rounded-lg bg-navy-900/70 hover:bg-navy-900 text-white backdrop-blur-md transition-colors"
                        title="Export JSON"
                        aria-label="Export JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, tripId: trip.id, tripName: trip.destination })}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 backdrop-blur-md transition-colors"
                        title="Delete itinerary"
                        aria-label="Delete itinerary"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                        <span>{isIndia ? '🇮🇳 India' : '🌍 Intl'}</span>
                      </span>
                      {(trip.isSupabase || user) && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Cloud</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold truncate">
                        {trip.destination}
                      </h3>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-brand-sky" />
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Parameters Detail */}
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Duration</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {trip.durationDays} Days ({Math.max((trip.durationDays || 1) - 1, 1)} Nights)
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Est. Budget</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {formatCurrency(trip.budgetBreakdown?.totalEstimated || 2400, tripCurrency)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {totalTravelers} Travelers ({trip.tripPace || 'Balanced'})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Saved: {createdDateFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Itinerary Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenTrip(trip)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-slate-900 dark:bg-navy-800 hover:bg-brand-teal dark:hover:bg-brand-teal hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Open Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-navy-700 bg-white/40 dark:bg-navy-900/40 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
            <Plane className="w-8 h-8 -rotate-45" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchTerm || filterType !== 'all' ? 'No matching trips found' : 'No trips yet.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {searchTerm || filterType !== 'all'
                ? 'Try clearing your search keyword or switching between India and International filters.'
                : 'Plan your next getaway with TripMind AI and click "Save Trip" to keep your itineraries here.'}
            </p>
          </div>
          {searchTerm || filterType !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-5 py-2 text-xs font-bold text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 rounded-xl"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 shadow-glow-teal hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Your First Trip</span>
            </Link>
          )}
        </div>
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, tripId: null, currentName: '' })}
        title="Rename Itinerary"
      >
        <form onSubmit={handleSaveRename} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Itinerary Title
            </label>
            <input
              type="text"
              required
              value={renameModal.currentName}
              onChange={(e) => setRenameModal({ ...renameModal, currentName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRenameModal({ isOpen: false, tripId: null, currentName: '' })}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-teal rounded-xl hover:opacity-90"
            >
              Save Name
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tripId: null, tripName: '' })}
        title="Delete Itinerary?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to remove <strong className="text-slate-900 dark:text-white">"{deleteModal.tripName}"</strong> from your saved trips? This cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: false, tripId: null, tripName: '' })}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl"
            >
              Keep Trip
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-sm"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

      {/* Supabase Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
