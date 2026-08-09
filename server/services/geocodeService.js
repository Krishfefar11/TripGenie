/**
 * Geocode Service
 *
 * Turns place names into coordinates for the itinerary map, via Nominatim
 * (OpenStreetMap's free geocoder — no API key). Nominatim's usage policy
 * caps the public instance at 1 request/second and requires an identifying
 * User-Agent, so calls are made sequentially with a spacing delay rather
 * than in parallel — see https://operations.osmfoundation.org/policies/nominatim/
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'TripGenie/1.0 (AI travel itinerary planner; RAG demo project)';
const REQUEST_SPACING_MS = 1100;

// Longer trips are capped so a single generation can't turn into 30+
// sequential geocode calls — days beyond this simply have no marker.
const MAX_DAYS_TO_GEOCODE = 14;

async function geocode(query) {
  if (!query) return null;
  try {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const results = await res.json();
    const first = results[0];
    if (!first) return null;
    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A landmark name qualified with its city (e.g. "Vatican Museums, Rome")
 * sometimes over-constrains Nominatim's free-text search and returns
 * nothing, even though the landmark alone resolves fine — verified
 * directly. So a failed lookup gets one retry on just the part before the
 * first comma before giving up.
 */
async function geocodeWithRetry(query) {
  const direct = await geocode(query);
  if (direct) return direct;

  const landmarkOnly = query?.split(',')[0]?.trim();
  if (landmarkOnly && landmarkOnly !== query) {
    await sleep(REQUEST_SPACING_MS);
    return geocode(landmarkOnly);
  }
  return null;
}

/**
 * Small deterministic offset so multiple fallback markers (days whose
 * geocoding failed entirely) fan out around the city center instead of
 * stacking exactly on top of each other.
 */
function jitter(coords, index) {
  const angle = (index * 137.5 * Math.PI) / 180; // golden-angle spiral
  const radius = 0.006 * (1 + Math.floor(index / 8));
  return { lat: coords.lat + radius * Math.cos(angle), lng: coords.lng + radius * Math.sin(angle) };
}

/**
 * Geocode each day's mapQuery in place (mutating copies, not the originals),
 * plus the overall destination as a map-center fallback.
 *
 * @param {Array} itineraryDays - day objects, each optionally carrying mapQuery
 * @param {string} destination
 * @returns {{ days: Array, destinationCoords: {lat,lng}|null }}
 */
async function geocodeItinerary(itineraryDays, destination) {
  const destinationCoords = await geocode(destination);
  await sleep(REQUEST_SPACING_MS);

  const days = [];
  let fallbackIndex = 0;
  for (let i = 0; i < itineraryDays.length; i++) {
    const day = itineraryDays[i];
    if (i >= MAX_DAYS_TO_GEOCODE) {
      days.push(day);
      continue;
    }

    const coords = await geocodeWithRetry(day.mapQuery);
    if (coords) {
      days.push({ ...day, coords });
    } else if (destinationCoords) {
      // Neither the full query nor the landmark alone resolved — still
      // give this day a marker rather than leaving it off the map.
      days.push({ ...day, coords: jitter(destinationCoords, fallbackIndex++), coordsApproximate: true });
    } else {
      days.push(day);
    }

    if (i < itineraryDays.length - 1) await sleep(REQUEST_SPACING_MS);
  }

  return { days, destinationCoords };
}

module.exports = { geocode, geocodeItinerary };
