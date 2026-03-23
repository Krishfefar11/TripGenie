/**
 * Weather Utilities
 * 
 * Provides simple month-based weather predictions for popular destinations.
 * No external API needed — uses a curated dataset of typical weather patterns.
 */

// Month-based weather data for popular travel regions
const weatherData = {
  tropical: {
    description: 'Tropical climate with warm temperatures year-round',
    months: {
      jan: { temp: '28-32°C', condition: 'Warm & Humid', rain: 'Moderate' },
      feb: { temp: '28-33°C', condition: 'Warm & Dry', rain: 'Low' },
      mar: { temp: '29-34°C', condition: 'Hot & Humid', rain: 'Low' },
      apr: { temp: '30-35°C', condition: 'Hot', rain: 'Moderate' },
      may: { temp: '29-34°C', condition: 'Hot & Wet', rain: 'High' },
      jun: { temp: '27-31°C', condition: 'Warm & Wet', rain: 'High' },
      jul: { temp: '26-30°C', condition: 'Warm & Wet', rain: 'Very High' },
      aug: { temp: '26-30°C', condition: 'Warm & Wet', rain: 'Very High' },
      sep: { temp: '27-31°C', condition: 'Warm & Wet', rain: 'High' },
      oct: { temp: '28-32°C', condition: 'Warm & Humid', rain: 'Moderate' },
      nov: { temp: '28-32°C', condition: 'Warm & Pleasant', rain: 'Low' },
      dec: { temp: '27-31°C', condition: 'Warm & Dry', rain: 'Low' },
    },
  },
  temperate: {
    description: 'Temperate climate with four distinct seasons',
    months: {
      jan: { temp: '0-5°C', condition: 'Cold', rain: 'Moderate' },
      feb: { temp: '1-7°C', condition: 'Cold', rain: 'Low' },
      mar: { temp: '5-12°C', condition: 'Cool & Breezy', rain: 'Moderate' },
      apr: { temp: '10-18°C', condition: 'Mild & Pleasant', rain: 'Moderate' },
      may: { temp: '15-23°C', condition: 'Warm & Sunny', rain: 'Low' },
      jun: { temp: '20-28°C', condition: 'Hot & Sunny', rain: 'Low' },
      jul: { temp: '22-30°C', condition: 'Hot', rain: 'Low' },
      aug: { temp: '21-29°C', condition: 'Hot & Humid', rain: 'Moderate' },
      sep: { temp: '17-24°C', condition: 'Warm & Pleasant', rain: 'Moderate' },
      oct: { temp: '12-18°C', condition: 'Cool & Crisp', rain: 'Moderate' },
      nov: { temp: '6-12°C', condition: 'Cool & Cloudy', rain: 'High' },
      dec: { temp: '2-7°C', condition: 'Cold', rain: 'Moderate' },
    },
  },
  arid: {
    description: 'Arid/desert climate with hot days and cool nights',
    months: {
      jan: { temp: '15-25°C', condition: 'Mild', rain: 'Very Low' },
      feb: { temp: '17-27°C', condition: 'Pleasant', rain: 'Very Low' },
      mar: { temp: '20-30°C', condition: 'Warm', rain: 'Very Low' },
      apr: { temp: '25-35°C', condition: 'Hot', rain: 'Very Low' },
      may: { temp: '30-40°C', condition: 'Very Hot', rain: 'None' },
      jun: { temp: '33-43°C', condition: 'Extremely Hot', rain: 'None' },
      jul: { temp: '35-45°C', condition: 'Extremely Hot', rain: 'None' },
      aug: { temp: '34-44°C', condition: 'Extremely Hot', rain: 'None' },
      sep: { temp: '30-40°C', condition: 'Hot', rain: 'Very Low' },
      oct: { temp: '25-35°C', condition: 'Warm', rain: 'Very Low' },
      nov: { temp: '20-28°C', condition: 'Pleasant', rain: 'Very Low' },
      dec: { temp: '16-24°C', condition: 'Mild', rain: 'Very Low' },
    },
  },
  cold: {
    description: 'Cold climate with long winters and short summers',
    months: {
      jan: { temp: '-10--2°C', condition: 'Freezing & Snowy', rain: 'Snow' },
      feb: { temp: '-8-0°C', condition: 'Cold & Snowy', rain: 'Snow' },
      mar: { temp: '-3-5°C', condition: 'Cold', rain: 'Snow/Rain' },
      apr: { temp: '3-10°C', condition: 'Cool', rain: 'Moderate' },
      may: { temp: '8-16°C', condition: 'Mild', rain: 'Moderate' },
      jun: { temp: '13-22°C', condition: 'Pleasant', rain: 'Moderate' },
      jul: { temp: '16-25°C', condition: 'Warm', rain: 'Low' },
      aug: { temp: '15-24°C', condition: 'Warm', rain: 'Moderate' },
      sep: { temp: '10-18°C', condition: 'Cool', rain: 'Moderate' },
      oct: { temp: '4-10°C', condition: 'Cold', rain: 'High' },
      nov: { temp: '-2-4°C', condition: 'Cold & Grey', rain: 'Snow/Rain' },
      dec: { temp: '-8--1°C', condition: 'Freezing', rain: 'Snow' },
    },
  },
};

// Map destinations to climate zones
const destinationClimateMap = {
  // Tropical
  bali: 'tropical', thailand: 'tropical', goa: 'tropical', maldives: 'tropical',
  singapore: 'tropical', 'sri lanka': 'tropical', hawaii: 'tropical',
  'costa rica': 'tropical', phuket: 'tropical', cancun: 'tropical',
  mumbai: 'tropical', chennai: 'tropical', kerala: 'tropical',
  // Temperate
  paris: 'temperate', london: 'temperate', tokyo: 'temperate', rome: 'temperate',
  barcelona: 'temperate', 'new york': 'temperate', istanbul: 'temperate',
  berlin: 'temperate', amsterdam: 'temperate', seoul: 'temperate',
  delhi: 'temperate', jaipur: 'temperate',
  // Arid
  dubai: 'arid', rajasthan: 'arid', egypt: 'arid', morocco: 'arid',
  'las vegas': 'arid', jordan: 'arid', doha: 'arid',
  // Cold
  iceland: 'cold', norway: 'cold', switzerland: 'cold', canada: 'cold',
  alaska: 'cold', finland: 'cold', sweden: 'cold', shimla: 'cold',
  manali: 'cold', ladakh: 'cold',
};

/**
 * Get weather info for a destination and travel month.
 * 
 * @param {string} destination - Travel destination
 * @param {number} month - Month number (1-12), defaults to current month
 * @returns {object} Weather information
 */
function getWeatherInfo(destination, month) {
  const currentMonth = month || new Date().getMonth() + 1;
  const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const monthKey = monthKeys[currentMonth - 1];

  // Find climate zone for destination
  const destLower = destination.toLowerCase().trim();
  let climateZone = 'temperate'; // default

  for (const [place, zone] of Object.entries(destinationClimateMap)) {
    if (destLower.includes(place)) {
      climateZone = zone;
      break;
    }
  }

  const climate = weatherData[climateZone];
  const monthWeather = climate.months[monthKey];

  return {
    destination,
    climate: climate.description,
    month: monthKeys[currentMonth - 1].charAt(0).toUpperCase() + monthKeys[currentMonth - 1].slice(1),
    temperature: monthWeather.temp,
    condition: monthWeather.condition,
    rainfall: monthWeather.rain,
    recommendation: generateWeatherRecommendation(monthWeather, climateZone),
  };
}

/**
 * Generate weather-based travel recommendations
 */
function generateWeatherRecommendation(weather, climateZone) {
  const recommendations = [];

  if (weather.rain === 'Very High' || weather.rain === 'High') {
    recommendations.push('🌧️ Pack rain gear and waterproof shoes');
    recommendations.push('☂️ Consider indoor activities as backup plans');
  }
  if (weather.condition.includes('Hot') || weather.condition.includes('Extremely')) {
    recommendations.push('🧴 Carry sunscreen and stay hydrated');
    recommendations.push('🕐 Plan outdoor activities for early morning or evening');
  }
  if (weather.condition.includes('Cold') || weather.condition.includes('Freezing')) {
    recommendations.push('🧥 Pack heavy winter clothing and layers');
    recommendations.push('☕ Enjoy indoor attractions and warm cafes');
  }
  if (weather.condition.includes('Pleasant') || weather.condition.includes('Sunny')) {
    recommendations.push('☀️ Great weather for outdoor exploration!');
    recommendations.push('📸 Perfect conditions for photography');
  }

  return recommendations;
}

module.exports = { getWeatherInfo };
