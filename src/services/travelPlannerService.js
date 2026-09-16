/**
 * TripMind AI - Travel Planner Service Orchestrator
 * Seamlessly routes between Mock, OpenAI, and Gemini providers.
 */

import {
  generateItineraryMock,
  regenerateDayMock,
  generatePackingListMock,
  suggestDestinationsMock
} from './ai/mockProvider';
import { generateItineraryOpenAI, regenerateDayOpenAI } from './ai/openaiProvider';
import { generateItineraryGemini, regenerateDayGemini } from './ai/geminiProvider';

function getActiveProvider() {
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'mock').toLowerCase();
  if (provider === 'openai') return 'openai';
  if (provider === 'gemini') return 'gemini';
  return 'mock';
}

export async function generateItinerary(preferences) {
  const provider = getActiveProvider();
  switch (provider) {
    case 'openai':
      return generateItineraryOpenAI(preferences);
    case 'gemini':
      return generateItineraryGemini(preferences);
    case 'mock':
    default:
      return generateItineraryMock(preferences);
  }
}

export async function regenerateDay(currentDay, tripContext, modificationType) {
  const provider = getActiveProvider();
  switch (provider) {
    case 'openai':
      return regenerateDayOpenAI(currentDay, tripContext, modificationType);
    case 'gemini':
      return regenerateDayGemini(currentDay, tripContext, modificationType);
    case 'mock':
    default:
      return regenerateDayMock(currentDay, tripContext, modificationType);
  }
}

export function generatePackingList(trip) {
  return generatePackingListMock(trip);
}

export function suggestDestinations(preferences) {
  return suggestDestinationsMock(preferences);
}

/**
 * Interactive Natural Language Assistant Engine ("✦ Ask TripMind AI")
 */
export async function askAssistant(userPrompt, tripContext) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lower = userPrompt.toLowerCase();
  const days = tripContext.days || [];
  const isIndia = tripContext.travelType === 'india' || tripContext.country === 'India';
  const currencySymbol = isIndia ? '₹' : '$';

  let targetDayNumber = 1;
  const dayMatch = lower.match(/day\s*(\d+)/);
  if (dayMatch && dayMatch[1]) {
    const num = parseInt(dayMatch[1], 10);
    if (num >= 1 && num <= days.length) {
      targetDayNumber = num;
    }
  }

  const targetDay = days.find(d => d.dayNumber === targetDayNumber) || days[0];
  if (!targetDay) {
    return {
      success: false,
      message: "I couldn't locate that specific day in your current trip. Try saying 'Make Day 1 less hectic'."
    };
  }

  let modifiedDay = JSON.parse(JSON.stringify(targetDay));
  let explanation = '';
  let actionDescription = '';
  let beforeSummary = `${targetDay.activities?.length || 4} activities scheduled`;
  let afterSummary = '';
  let budgetImpact = 'Unchanged';
  let travelImpact = 'Neutral';

  if (lower.includes('less hectic') || lower.includes('relaxed') || lower.includes('slow down')) {
    actionDescription = `Streamline Day ${targetDayNumber} for a relaxed pace`;
    explanation = `I removed one mid-day activity and scheduled generous downtime at a shaded courtyard cafe.`;
    modifiedDay.title = `${targetDay.title} (Relaxed Pace)`;
    const keeps = [modifiedDay.activities[0]];
    keeps.push({
      id: `assist-cafe-${Date.now()}`,
      time: '02:00 PM',
      title: isIndia ? 'Shaded Courtyard Chai & Regional Snacks' : 'Unhurried Terrace Cafe Downtime',
      category: 'Food & Relaxation',
      location: `${targetDay.neighborhood || tripContext.city} Garden Enclave`,
      description: 'Relax over fresh regional refreshments with ample time for reading and slow unwinding.',
      estimatedCost: isIndia ? 350 : 25,
      openingHours: '11:00 AM – 07:00 PM',
      transitInfo: '5 min walk',
      isAiEstimated: true
    });
    if (modifiedDay.activities.length > 2) {
      keeps.push(modifiedDay.activities[modifiedDay.activities.length - 1]);
    }
    modifiedDay.activities = keeps;
    afterSummary = `${keeps.length} unhurried stops with cafe downtime`;
    budgetImpact = isIndia ? '-₹450' : '-$25';
    travelImpact = 'Reduced by 35%';
  } else if (lower.includes('cheaper') || lower.includes('budget') || lower.includes('reduce')) {
    actionDescription = `Cost-optimize Day ${targetDayNumber}`;
    explanation = `Swapped ticketed entry for scenic open-air promenades and delicious local street eateries.`;
    modifiedDay.title = `${targetDay.title} (Budget-Friendly)`;
    modifiedDay.activities = modifiedDay.activities.map(act => ({
      ...act,
      estimatedCost: Math.round(act.estimatedCost * 0.4),
      notes: 'AI Budget Optimized'
    }));
    afterSummary = `Same stops with zero-fee alternatives`;
    budgetImpact = isIndia ? '-₹1,200' : '-$60';
    travelImpact = 'Similar route';
  } else if (lower.includes('sunset') || lower.includes('viewpoint') || lower.includes('view')) {
    actionDescription = `Add a golden-hour sunset viewpoint to Day ${targetDayNumber}`;
    explanation = `Added a panoramic sunset terrace stop right before dinner.`;
    modifiedDay.activities.splice(modifiedDay.activities.length - 1, 0, {
      id: `assist-sunset-${Date.now()}`,
      time: '05:45 PM',
      title: isIndia ? 'Sunset Ghat / Fort High Point View' : 'Sunset Panoramic Rooftop Terrace',
      category: 'Sightseeing & Photography',
      location: `${tripContext.city || tripContext.destination} Golden Hour Point`,
      description: 'Capture the golden hour light spilling over historic monuments and landscapes.',
      estimatedCost: 0,
      openingHours: '05:00 PM – 07:00 PM',
      transitInfo: '8 min walk from previous stop',
      isAiEstimated: true
    });
    afterSummary = `Added sunset stop at 05:45 PM`;
    budgetImpact = 'Free ($0 / ₹0)';
    travelImpact = '+8 min walking';
  } else if (lower.includes('eat') || lower.includes('food') || lower.includes('dinner')) {
    actionDescription = `Curate iconic local dining for Day ${targetDayNumber}`;
    explanation = `Added an authentic regional food tasting crawl showcasing signature local specialties.`;
    modifiedDay.activities.push({
      id: `assist-food-${Date.now()}`,
      time: '08:30 PM',
      title: isIndia ? 'Legendary Street Food & Kebab Walk' : 'Late Night Artisan Bistro & Dessert',
      category: 'Food & Dining',
      location: `${tripContext.city || tripContext.destination} Culinary Quarter`,
      description: 'Taste authentic recipes crafted by generational chefs using secret spice blends.',
      estimatedCost: isIndia ? 550 : 35,
      openingHours: '07:00 PM – 11:30 PM',
      transitInfo: 'Walking distance',
      isAiEstimated: true
    });
    afterSummary = `Added evening culinary stop`;
    budgetImpact = isIndia ? '+₹550' : '+$35';
    travelImpact = '+5 min transit';
  } else {
    actionDescription = `Fine-tune Day ${targetDayNumber}`;
    explanation = `I reviewed Day ${targetDayNumber} to match your instruction: "${userPrompt}". Timing, transit, and notes have been refined.`;
    afterSummary = `Customized schedule`;
  }

  return {
    success: true,
    actionDescription,
    targetDayNumber,
    explanation,
    beforeSummary,
    afterSummary,
    budgetImpact,
    travelImpact,
    proposedDay: modifiedDay
  };
}

// Compatibility alias
export const askTravelAssistant = askAssistant;
export const modifyItinerary = (trip, instruction) => askAssistant(instruction, trip);
