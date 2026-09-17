/**
 * TripMind AI - Smart Estimated Budget Engine
 * 
 * Deterministic, generic, permanent free reference pricing engine.
 * Serves as the SINGLE SOURCE OF TRUTH for all estimated trip budgets.
 * 
 * Provider Architecture:
 *   BudgetProviderRegistry
 *      ↓
 *   TripMindEstimatedProvider (Active free reference engine)
 *   [Future: LiveHotelProvider, LiveFlightProvider, LiveActivityProvider]
 */

import { resolveDestinationPricing, DEFAULT_MISC_PERCENTAGE } from '../data/pricing/index.js';

/**
 * Base Budget Provider Interface
 */
export class BaseBudgetProvider {
  constructor(name = 'BaseBudgetProvider') {
    this.name = name;
  }

  // eslint-disable-next-line no-unused-vars
  calculate(tripPreferences, itinerary) {
    throw new Error(`calculate() must be implemented by ${this.name}`);
  }
}

/**
 * TripMind Estimated Provider (Deterministic, Reference Pricing)
 */
export class TripMindEstimatedProvider extends BaseBudgetProvider {
  constructor() {
    super('TripMind Estimated Pricing');
  }

  calculate(tripPreferences = {}, itinerary = {}) {
    // 1. Normalize Inputs
    const destination = (
      tripPreferences.destination ||
      tripPreferences.city ||
      itinerary.destination ||
      itinerary.city ||
      'Goa'
    );

    const travelType = (
      tripPreferences.travelType ||
      itinerary.travelType ||
      'india'
    ).toLowerCase();

    // Standardize travelers
    const adults = Math.max(1, Number(tripPreferences.travelers?.adults || itinerary.travelers?.adults || 1));
    const children = Math.max(0, Number(tripPreferences.travelers?.children || itinerary.travelers?.children || 0));
    const totalTravelers = adults + children;
    const applicableDiningTravelers = adults + Math.round(children * 0.75);

    // Standardize duration
    const rawDays = Number(
      tripPreferences.durationDays ||
      itinerary.durationDays ||
      (itinerary.days && itinerary.days.length) ||
      5
    );
    const numberOfDays = Math.max(1, Math.min(Number.isFinite(rawDays) ? rawDays : 5, 30));
    
    const rawNights = Number(
      tripPreferences.durationNights ||
      itinerary.durationNights ||
      Math.max(1, numberOfDays - 1)
    );
    const numberOfNights = Math.max(1, Number.isFinite(rawNights) ? rawNights : numberOfDays - 1);

    // Standardize budget tier
    const rawTier = (
      tripPreferences.budgetTier ||
      itinerary.budgetTier ||
      'comfort'
    ).toLowerCase();
    
    let budgetTier = 'comfort';
    if (rawTier.includes('budget') || rawTier.includes('economy') || rawTier.includes('backpack')) {
      budgetTier = 'budget';
    } else if (rawTier.includes('premium') || rawTier.includes('luxury')) {
      budgetTier = 'premium';
    }

    // Currency determination
    const currency = (
      tripPreferences.currency ||
      itinerary.currency ||
      (travelType === 'india' ? 'INR' : 'USD')
    ).toUpperCase();

    // 2. Resolve Calibrated Reference Pricing
    const destPricing = resolveDestinationPricing(destination, travelType);
    const tierAccommodation = destPricing.accommodation[budgetTier] || destPricing.accommodation.comfort;
    const tierFood = destPricing.food[budgetTier] || destPricing.food.comfort;
    const tierTransport = destPricing.localTransport[budgetTier] || destPricing.localTransport.comfort;
    const tierActivities = destPricing.activityDefaults[budgetTier] || destPricing.activityDefaults.comfort;

    // -------------------------------------------------------------
    // 3. Calculate Components with Explicit Units
    // -------------------------------------------------------------

    // A. ACCOMMODATION
    // Unit: per room per night
    // Rooms: 1-2 adults = 1 room, 3-4 adults = 2 rooms, etc.
    const numberOfRooms = Math.max(1, Math.ceil(adults / 2));
    const nightlyRate = Math.max(500, Number(tierAccommodation.perNight) || 3200);
    const accommodation = Math.round(nightlyRate * numberOfRooms * numberOfNights);

    // B. FOOD & DINING
    // Unit: per person per day
    const foodPerPersonPerDay = Math.max(200, Number(tierFood.perPersonPerDay) || 1100);
    const food = Math.round(foodPerPersonPerDay * applicableDiningTravelers * numberOfDays);

    // C. LOCAL TRANSPORTATION
    // Unit: per group / vehicle per day (cabs/autos carry up to 4 travelers)
    const vehicles = Math.max(1, Math.ceil(totalTravelers / 4));
    const perGroupPerDay = Math.max(150, Number(tierTransport.perGroupPerDay) || 1200);
    const localTransport = Math.round(perGroupPerDay * vehicles * numberOfDays);

    // D. INTERCITY TRANSPORTATION
    // Current free engine default: 0 (clearly identified as not included in reference estimate)
    const intercityTransport = 0;

    // E. ACTIVITIES & ADMISSIONS
    // Inspect actual itinerary activities if present
    let activities = 0;
    const daysArray = itinerary.days || [];
    let hasExplicitActivityCosts = false;
    let totalParsedActivitiesCost = 0;

    if (Array.isArray(daysArray) && daysArray.length > 0) {
      let activityCount = 0;
      for (const day of daysArray) {
        if (Array.isArray(day.activities)) {
          for (const act of day.activities) {
            activityCount++;
            const cost = Number(act.estimatedCost);
            // Sanity check: cost must be finite, non-negative, and under realistic single-activity cap (₹15,000)
            if (Number.isFinite(cost) && cost >= 0 && cost < 15000) {
              const costType = act.costType || (cost > 0 ? 'per_person' : 'free');
              if (costType === 'per_group') {
                totalParsedActivitiesCost += cost;
              } else if (costType === 'per_person') {
                totalParsedActivitiesCost += cost * totalTravelers;
              }
              if (cost > 0) hasExplicitActivityCosts = true;
            }
          }
        }
      }

      // If itinerary had activities with explicit, sane costs, use them
      if (hasExplicitActivityCosts && totalParsedActivitiesCost > 0) {
        // Guard against runaway sums: cap within reasonable ratio of reference pricing
        const refBenchmark = tierActivities.averagePerPerson * totalTravelers * numberOfDays;
        activities = Math.round(Math.min(totalParsedActivitiesCost, refBenchmark * 2.2));
      }
    }

    // Fallback if no valid explicit activities parsed
    if (!hasExplicitActivityCosts || activities <= 0) {
      const avgActivityPerPerson = Math.max(100, Number(tierActivities.averagePerPerson) || 700);
      activities = Math.round(avgActivityPerPerson * totalTravelers * numberOfDays);
    }

    // F. SUBTOTAL & MISCELLANEOUS (Controlled 8% contingency)
    const subtotal = accommodation + food + localTransport + intercityTransport + activities;
    const miscellaneous = Math.round(subtotal * DEFAULT_MISC_PERCENTAGE);
    const total = subtotal + miscellaneous;

    // -------------------------------------------------------------
    // 4. Validation Layer
    // -------------------------------------------------------------
    const validated = validateBudgetOutput({
      accommodation,
      food,
      localTransport,
      intercityTransport,
      activities,
      miscellaneous,
      subtotal,
      total,
      currency,
      numberOfDays,
      totalTravelers,
      source: this.name,
      destPricing
    });

    return validated;
  }
}

/**
 * Budget Validation Layer
 * Rejects NaN, Infinity, negative values, malformed data, and duplicate multiplications.
 */
function validateBudgetOutput(data) {
  const {
    accommodation,
    food,
    localTransport,
    intercityTransport,
    activities,
    miscellaneous,
    subtotal,
    currency,
    numberOfDays,
    source,
    destPricing
  } = data;

  const safeNumber = (val, fallback = 0) => {
    const num = Number(val);
    return Number.isFinite(num) && num >= 0 ? Math.round(num) : fallback;
  };

  const safeAcc = safeNumber(accommodation);
  const safeFood = safeNumber(food);
  const safeTransport = safeNumber(localTransport);
  const safeIntercity = safeNumber(intercityTransport);
  const safeAct = safeNumber(activities);
  const safeSubtotal = safeAcc + safeFood + safeTransport + safeIntercity + safeAct;
  const safeMisc = safeNumber(miscellaneous, Math.round(safeSubtotal * 0.08));
  const safeTotal = safeSubtotal + safeMisc;

  // Compute category percentages for visual progress bar & legend
  const buildCategory = (name, amount, icon) => {
    const percentage = safeTotal > 0 ? Math.round((amount / safeTotal) * 100) : 0;
    return { name, amount, percentage, icon };
  };

  const categories = [
    buildCategory('Accommodation', safeAcc, 'Bed'),
    buildCategory('Food & Regional Dining', safeFood, 'Utensils'),
    buildCategory('Local Transportation', safeTransport, 'Train'),
    buildCategory('Activities & Sightseeing', safeAct, 'Ticket'),
    buildCategory('Miscellaneous & Contingency', safeMisc, 'ShoppingBag')
  ];

  // Adjust percentage rounding discrepancy if needed
  const sumPct = categories.reduce((sum, c) => sum + c.percentage, 0);
  if (sumPct !== 100 && categories.length > 0 && safeTotal > 0) {
    categories[0].percentage += (100 - sumPct);
  }

  const dailyAverage = Math.round(safeTotal / Math.max(1, numberOfDays));

  return {
    accommodation: safeAcc,
    food: safeFood,
    localTransport: safeTransport,
    intercityTransport: safeIntercity,
    activities: safeAct,
    miscellaneous: safeMisc,
    subtotal: safeSubtotal,
    total: safeTotal,
    totalEstimated: safeTotal, // Backward compatibility alias
    dailyAverage,
    currency: currency || 'INR',
    isEstimated: true,
    source: source || 'TripMind Estimated Pricing',
    categories,
    meta: {
      matchedDestination: destPricing?.city || destPricing?.name || 'Default India Reference',
      matchedBy: destPricing?.matchedBy || 'fallback',
      rateUnits: {
        accommodation: 'per room per night',
        food: 'per person per day',
        localTransport: 'per vehicle/group per day',
        activities: 'per person or parsed activity',
        miscellaneous: '8% contingency reserve'
      }
    }
  };
}

/**
 * Budget Provider Registry
 * Allows dynamic plugging in of future providers (LiveHotelProvider, LiveFlightProvider)
 * without rewriting UI code.
 */
class BudgetProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.activeProviderName = 'TripMindEstimatedProvider';
    
    // Register default reference provider
    const estimatedProvider = new TripMindEstimatedProvider();
    this.registerProvider('TripMindEstimatedProvider', estimatedProvider);
  }

  registerProvider(name, providerInstance) {
    if (!(providerInstance instanceof BaseBudgetProvider)) {
      throw new Error(`Provider ${name} must extend BaseBudgetProvider`);
    }
    this.providers.set(name, providerInstance);
  }

  getActiveProvider() {
    return this.providers.get(this.activeProviderName) || this.providers.get('TripMindEstimatedProvider');
  }

  setActiveProvider(name) {
    if (!this.providers.has(name)) {
      console.warn(`Budget provider ${name} not found. Keeping ${this.activeProviderName}`);
      return;
    }
    this.activeProviderName = name;
  }
}

export const budgetRegistry = new BudgetProviderRegistry();

/**
 * Public Entry Point: calculateTripBudget
 * Called across the application as the SINGLE SOURCE OF TRUTH for trip budgets.
 */
export function calculateTripBudget(tripPreferences = {}, itinerary = {}) {
  const provider = budgetRegistry.getActiveProvider();
  return provider.calculate(tripPreferences, itinerary);
}

/**
 * Utility to inspect and sanitize legacy / saved trip budgets.
 * If a trip budget is missing, malformed, or carries an old inflated budget,
 * this transparently recalculates it.
 */
export function ensureSmartBudget(trip) {
  if (!trip) return null;

  const currentBudget = trip.budgetBreakdown;
  const isOldInflated = currentBudget && (
    Number(currentBudget.totalEstimated) > 400000 || // Clearly old inflated number
    !currentBudget.source || // Legacy mock without deterministic source
    currentBudget.source !== 'TripMind Estimated Pricing'
  );

  const isMissingOrInvalid = !currentBudget ||
    !Number.isFinite(Number(currentBudget.totalEstimated)) ||
    Number(currentBudget.totalEstimated) <= 0;

  if (isMissingOrInvalid || isOldInflated) {
    const updatedBudget = calculateTripBudget(trip, trip);
    return {
      ...trip,
      budgetBreakdown: updatedBudget
    };
  }

  return trip;
}
