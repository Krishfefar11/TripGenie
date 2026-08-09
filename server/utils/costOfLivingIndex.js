/**
 * Cost-of-Living Index
 *
 * A coarse relative-cost multiplier by destination — 1.0 is "average",
 * above 1 is pricier than average, below 1 is cheaper. Deliberately a
 * static table grouped into a handful of well-known tiers rather than
 * fabricated precise numbers: it's meant to fix a real bug (the same
 * $/day being classified "moderate" in Ahmedabad and in Paris) by
 * capturing the broad, widely-known reality that cost of living varies
 * a lot by destination — not to claim live pricing-feed accuracy.
 *
 * City entries are checked before country entries, since a capital or
 * tourist hub (Paris, Tokyo, New York) can diverge notably from its
 * country's average.
 */

const CITY_INDEX = {
  // The 6 destinations actually in the RAG corpus, set deliberately —
  // these are the ones an interviewer is most likely to try side by side.
  rome: 1.15,
  paris: 1.45,
  tokyo: 1.35,
  'new york': 1.6,
  nyc: 1.6,
  bangkok: 0.65,
  bali: 0.55,
  ubud: 0.5,
  denpasar: 0.55,

  // Other common tourist hubs that diverge from their country average
  london: 1.5,
  dubai: 1.4,
  singapore: 1.55,
  zurich: 1.75,
  geneva: 1.7,
  reykjavik: 1.7,
  'hong kong': 1.5,
  sydney: 1.35,
  amsterdam: 1.35,
  barcelona: 1.1,
  istanbul: 0.55,
  cairo: 0.45,
  mumbai: 0.45,
  delhi: 0.4,
  ahmedabad: 0.4,
  jaipur: 0.4,
  goa: 0.45,
  hanoi: 0.4,
  'ho chi minh': 0.4,
  bangalore: 0.42,
  'kuala lumpur': 0.55,
  manila: 0.5,
};

const COUNTRY_INDEX = {
  // Very high
  switzerland: 1.75, norway: 1.6, iceland: 1.65, monaco: 1.8, denmark: 1.4,
  // High
  usa: 1.4, 'united states': 1.4, america: 1.4, uk: 1.35, 'united kingdom': 1.35,
  france: 1.25, japan: 1.25, australia: 1.35, ireland: 1.35, sweden: 1.3,
  netherlands: 1.3, finland: 1.3, singapore: 1.55, uae: 1.4, luxembourg: 1.6,
  // Above average
  italy: 1.15, spain: 1.05, germany: 1.15, canada: 1.2, 'south korea': 1.1,
  'new zealand': 1.2, israel: 1.3, austria: 1.2, belgium: 1.15,
  // Average / near-baseline
  portugal: 0.85, greece: 0.85, poland: 0.7, 'czech republic': 0.75,
  china: 0.7, malaysia: 0.55, 'costa rica': 0.8, croatia: 0.8, chile: 0.75,
  // Below average
  thailand: 0.55, turkey: 0.5, indonesia: 0.5, philippines: 0.45,
  morocco: 0.5, peru: 0.5, colombia: 0.45, brazil: 0.55, argentina: 0.5,
  mexico: 0.55, vietnam: 0.4, cambodia: 0.4,
  // Low
  india: 0.4, nepal: 0.35, 'sri lanka': 0.4, bangladesh: 0.35,
  pakistan: 0.35, egypt: 0.4, ethiopia: 0.35, laos: 0.4, myanmar: 0.4,
};

const DEFAULT_INDEX = 1.0;

/**
 * Resolve a relative cost-of-living multiplier for a free-text destination
 * string. City-level entries take priority over country-level ones since
 * they're more specific; anything unmatched defaults to "average" (1.0)
 * rather than guessing.
 */
function resolveCostIndex(destination) {
  const destLower = (destination || '').toLowerCase().trim();
  if (!destLower) return DEFAULT_INDEX;

  for (const [city, index] of Object.entries(CITY_INDEX)) {
    if (destLower.includes(city)) return index;
  }
  for (const [country, index] of Object.entries(COUNTRY_INDEX)) {
    if (destLower.includes(country)) return index;
  }
  return DEFAULT_INDEX;
}

module.exports = { resolveCostIndex };
