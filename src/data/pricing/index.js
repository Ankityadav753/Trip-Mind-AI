/**
 * TripMind AI - Pricing Data Module Index
 * 
 * Provides unified, normalized destination pricing lookup and fallback resolution.
 */

import { DEFAULT_INDIA_PRICING, DEFAULT_MISC_PERCENTAGE } from './defaults.js';
import { REGIONAL_PRICING } from './regions.js';
import { DESTINATION_PRICING } from './destinations.js';

export { DEFAULT_INDIA_PRICING, DEFAULT_MISC_PERCENTAGE, REGIONAL_PRICING, DESTINATION_PRICING };

/**
 * Normalizes destination strings by stripping country suffixes, state names,
 * and punctuation for resilient matching.
 */
export function normalizeDestinationName(rawName) {
  if (!rawName || typeof rawName !== 'string') return '';
  return rawName
    .toLowerCase()
    .replace(/,\s*india$/i, '')
    .replace(/,\s*bharat$/i, '')
    .replace(/,\s*[a-z\s]+$/i, (match) => {
      // If it looks like "City, State", keep the city part
      const parts = match.replace(/^,\s*/, '').trim();
      return parts.length > 0 ? '' : match;
    })
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolves the best available reference pricing record for any destination.
 * Order of resolution:
 *   1. Direct city / alias match in DESTINATION_PRICING
 *   2. Partial / substring match in DESTINATION_PRICING
 *   3. Archetype match in REGIONAL_PRICING (coastal, mountain, heritage, metro)
 *   4. DEFAULT_INDIA_PRICING (guaranteed fallback)
 * 
 * Never returns null, undefined, or zero values.
 */
export function resolveDestinationPricing(destinationName, travelType = 'india') {
  const normalized = normalizeDestinationName(destinationName);
  const rawLower = (destinationName || '').toLowerCase();

  // 1. Direct key match
  if (DESTINATION_PRICING[normalized]) {
    return { ...DESTINATION_PRICING[normalized], matchedBy: 'exact_id' };
  }

  // 2. Alias match
  for (const [key, dest] of Object.entries(DESTINATION_PRICING)) {
    if (dest.aliases?.some(alias => normalized.includes(alias) || alias.includes(normalized) || rawLower.includes(alias))) {
      return { ...dest, matchedBy: `alias:${key}` };
    }
  }

  // 3. Keyword-based Archetype Regional Fallback
  const mountainKeywords = ['hill', 'mountain', 'valley', 'pass', 'himalaya', 'ladakh', 'leh', 'kashmir', 'srinagar', 'shillong', 'tawang', 'gangtok', 'darjeeling', 'ooty', 'kodaikanal', 'munnar', 'coorg', 'mussoorie', 'nainital', 'kasol', 'spiti', 'dharamshala'];
  const coastalKeywords = ['beach', 'island', 'coast', 'sea', 'puri', 'daman', 'diu', 'gokarna', 'pondicherry', 'puducherry', 'andaman', 'havelock', 'neil', 'varkala', 'kovalam'];
  const heritageKeywords = ['fort', 'palace', 'temple', 'heritage', 'ghat', 'jodhpur', 'jaisalmer', 'khajuraho', 'hampi', 'ayodhya', 'mysore', 'mysuru', 'madurai', 'mahabalipuram', 'bhubaneswar', 'chittorgarh', 'bhopal', 'gwalior'];
  const metroKeywords = ['metro', 'city', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'noida', 'gurgaon', 'gurugram', 'chandigarh', 'indore', 'nagpur', 'surat', 'coimbatore', 'kochi'];

  if (mountainKeywords.some(kw => rawLower.includes(kw))) {
    return { ...REGIONAL_PRICING.mountain, matchedBy: 'regional:mountain' };
  }
  if (coastalKeywords.some(kw => rawLower.includes(kw))) {
    return { ...REGIONAL_PRICING.coastal, matchedBy: 'regional:coastal' };
  }
  if (heritageKeywords.some(kw => rawLower.includes(kw))) {
    return { ...REGIONAL_PRICING.heritage, matchedBy: 'regional:heritage' };
  }
  if (metroKeywords.some(kw => rawLower.includes(kw))) {
    return { ...REGIONAL_PRICING.metro, matchedBy: 'regional:metro' };
  }

  // 4. Default India Fallback
  return { ...DEFAULT_INDIA_PRICING, matchedBy: 'fallback:default_india' };
}
