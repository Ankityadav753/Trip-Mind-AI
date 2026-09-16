import React, { useState, useEffect } from 'react';
import { Calendar, Users, Sparkles, DollarSign, Gauge, Sliders, MessageSquare, AlertCircle, Train, Plane, Car, Bus, Compass } from 'lucide-react';
import DestinationAutocomplete from './DestinationAutocomplete';
import StyleSelector from './StyleSelector';
import { INDIA_BUDGET_TIERS, INTERNATIONAL_BUDGET_TIERS, TRIP_PACES, PREFERENCE_CHIPS, INDIAN_TRANSPORT_MODES } from '../../data/travelStyles';
import { calculateDaysCount } from '../../utils/formatters';

export default function PlannerForm({
  initialDestination = '',
  initialTravelType = 'india',
  onSubmit,
  isGenerating = false
}) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fiveDaysLater = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];

  const [travelType, setTravelType] = useState(initialTravelType || 'india');
  const [destination, setDestination] = useState(initialDestination || (initialTravelType === 'international' ? 'Paris, France' : 'Goa, India'));
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(fiveDaysLater);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budgetTier, setBudgetTier] = useState('comfort');
  const [currency, setCurrency] = useState(initialTravelType === 'international' ? 'USD' : 'INR');
  const [travelStyles, setTravelStyles] = useState(['food', 'relaxation']);
  const [tripPace, setTripPace] = useState('balanced');
  const [transport, setTransport] = useState(initialTravelType === 'india' ? 'train' : 'cab');
  const [specialPreferences, setSpecialPreferences] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  useEffect(() => {
    if (travelType === 'india') {
      setCurrency('INR');
      if (!destination || destination.includes('France') || destination.includes('Japan')) {
        setDestination('Goa, India');
      }
    } else {
      setCurrency('USD');
      if (!destination || destination.includes('India')) {
        setDestination('Paris, France');
      }
    }
  }, [travelType]);

  const durationDays = calculateDaysCount(startDate, endDate);
  const durationNights = Math.max(1, durationDays - 1);

  const activeBudgetTiers = travelType === 'india' ? INDIA_BUDGET_TIERS : INTERNATIONAL_BUDGET_TIERS;

  const validate = () => {
    const errs = {};
    if (!destination.trim()) errs.destination = 'Destination is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    else if (new Date(endDate) < new Date(startDate)) errs.endDate = 'End date cannot be before start date';
    if (adults < 1) errs.travelers = 'At least 1 adult traveler is required';
    if (travelStyles.length === 0) errs.travelStyles = 'Please select at least 1 travel style';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      travelType,
      destination: destination.trim(),
      startDate,
      endDate,
      durationDays,
      durationNights,
      travelers: { adults, children },
      budgetTier,
      currency,
      travelStyles,
      tripPace,
      transport,
      specialPreferences: specialPreferences.trim(),
      specialNotes: specialPreferences.trim()
    });
  };

  const addChip = (chip) => {
    if (!specialPreferences.includes(chip)) {
      setSpecialPreferences(prev => prev ? `${prev}, ${chip}` : chip);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Travel Type Toggle: [ 🇮🇳 India ] [ 🌍 International ] */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Where are you travelling?
        </label>
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
          <button
            type="button"
            onClick={() => setTravelType('india')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              travelType === 'india'
                ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-sm ring-1 ring-brand-teal/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🇮🇳 India Travel (Default)</span>
          </button>

          <button
            type="button"
            onClick={() => setTravelType('international')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              travelType === 'international'
                ? 'bg-white dark:bg-navy-800 text-brand-teal shadow-sm ring-1 ring-brand-teal/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🌍 International</span>
          </button>
        </div>
      </div>

      {/* 2. Destination Search Input */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Destination</span>
          <span className="text-xs text-slate-400 font-normal">
            {travelType === 'india' ? 'Search city, state or "Delhi to Jaipur"' : 'Search international city'}
          </span>
        </label>
        <DestinationAutocomplete
          value={destination}
          travelType={travelType}
          onChange={(val) => {
            setDestination(val);
            if (errors.destination) setErrors({ ...errors, destination: null });
          }}
          error={errors.destination}
          placeholder={
            travelType === 'india'
              ? 'e.g. Goa, Manali, Kerala, or "Delhi to Jaipur"'
              : 'e.g. Paris, Tokyo, Bali, Dubai, Switzerland'
          }
        />
        {errors.destination && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.destination}
          </p>
        )}
      </div>

      {/* 3. Travel Dates & Auto Duration Calculation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              End Date
            </label>
            <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-md">
              {durationDays} Days / {durationNights} Nights
            </span>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
        </div>
      </div>

      {/* 4. Travelers Stepper (Adults & Children) */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-teal" />
            Travelers
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Total: {adults + children} {adults + children === 1 ? 'Traveler' : 'Travelers'}
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Adults</div>
              <div className="text-[11px] text-slate-400">Age 13+</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Children</div>
              <div className="text-[11px] text-slate-400">Age 0–12</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(Math.min(8, children + 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Budget Tier (INR for India, USD/EUR/GBP/JPY for Intl) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-teal" />
            Budget Tier
          </label>
          {travelType === 'international' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-100 dark:bg-navy-950 px-2 py-0.5 rounded border border-slate-200 dark:border-navy-700 font-bold text-brand-teal"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeBudgetTiers.map((tier) => {
            const isSelected = budgetTier === tier.id;
            return (
              <button
                type="button"
                key={tier.id}
                onClick={() => setBudgetTier(tier.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/15 ring-1 ring-brand-teal shadow-xs'
                    : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-brand-teal">
                    {tier.symbol}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {tier.range}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {tier.label}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {tier.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Travel Styles (12 multi-select styles) */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Travel Styles</span>
          <span className="text-xs text-slate-400 font-normal">Select all that apply</span>
        </label>
        <StyleSelector selectedStyles={travelStyles} onChange={setTravelStyles} />
        {errors.travelStyles && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.travelStyles}
          </p>
        )}
      </div>

      {/* 7. Trip Pace */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-teal" />
            Trip Pace
          </span>
          <span className="text-xs text-slate-400 font-normal">Density of daily stops</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TRIP_PACES.map((pace) => {
            const isSelected = tripPace === pace.id;
            return (
              <button
                type="button"
                key={pace.id}
                onClick={() => setTripPace(pace.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/15 ring-1 ring-brand-teal'
                    : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{pace.label}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                    {pace.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{pace.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. India Transportation Preference */}
      {travelType === 'india' && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Train className="w-4 h-4 text-brand-teal" />
              Primary Transportation Mode
            </span>
            <span className="text-xs text-slate-400 font-normal">Affects route transit costs</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INDIAN_TRANSPORT_MODES.slice(0, 4).map((tm) => {
              const isSelected = transport === tm.id;
              return (
                <button
                  type="button"
                  key={tm.id}
                  onClick={() => setTransport(tm.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-teal bg-brand-teal/10 text-brand-teal ring-1 ring-brand-teal font-bold'
                      : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-base mb-1">{tm.emoji}</div>
                  <div className="text-xs truncate">{tm.label.split('(')[0].trim()}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. Special Preferences Textarea & Chips */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-teal" />
            Special Preferences
          </span>
          <span className="text-xs text-slate-400 font-normal">Optional</span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PREFERENCE_CHIPS.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => addChip(chip)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 hover:bg-brand-teal/15 hover:text-brand-teal text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-navy-700"
            >
              + {chip}
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={specialPreferences}
          onChange={(e) => setSpecialPreferences(e.target.value)}
          placeholder="Tell TripMind AI anything else you want (e.g. Pure vegetarian dining, avoid steep climbs, prioritize Vande Bharat trains, sunset boat rides)..."
          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        ></textarea>
      </div>

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 shadow-glow-teal active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span>✨ Generate My Itinerary</span>
      </button>
    </form>
  );
}
