/**
 * Ollama Service
 * 
 * HTTP client for communicating with a locally running Ollama instance.
 * Supports text generation with configurable model and parameters.
 * Includes a fallback mock mode when Ollama is unavailable.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3:latest';

/**
 * Check if Ollama is running and accessible.
 * @returns {boolean}
 */
async function isOllamaAvailable() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate a text response using Ollama.
 * Falls back to a mock response if Ollama is not available.
 * 
 * @param {string} prompt - The full prompt to send to the model
 * @param {object} options - Optional parameters (temperature, etc.)
 * @returns {string} The generated text response
 */
async function generateWithOllama(prompt, options = {}) {
  const available = await isOllamaAvailable();

  if (!available) {
    console.log('⚠️ Ollama not available, using mock response');
    return generateMockResponse(prompt);
  }

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`❌ Ollama generation error (${OLLAMA_MODEL}):`, error.message);
    return generateMockResponse(prompt, error.message);
  }
}

/**
 * Generate a mock travel response (used when Ollama is unavailable).
 * Parses the prompt for destination/days/budget to produce a realistic mock.
 */
function generateMockResponse(prompt, errorMsg = 'No connection') {
  console.log('👷 Using fallback mock due to:', errorMsg);
  
  // Try to extract destination from the prompt
  const destMatch = prompt.match(/Destination[:\s]+([A-Za-z\s]+)/i) || prompt.match(/for\s+([A-Za-z\s]+)/i);
  const daysMatch = prompt.match(/(\d+)\s*days?/i);
  const budgetMatch = prompt.match(/budget[:\s]*\$?(\d+)/i);

  const destination = destMatch ? destMatch[1].trim().split('\n')[0].replace(/^- /, '') : 'your destination';
  const days = daysMatch ? parseInt(daysMatch[1]) : 3;
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : 1000;

  // Build a structured mock itinerary
  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    itinerary.push({
      day: d,
      title: `Adventure Day ${d}: Exploring ${destination}`,
      morning: d === 1
        ? `Arrive and settle into your ${destination} base. Orientation walk through the historic district.`
        : `Early start with local specialty breakfast. Visit a major landmark identified from your interests.`,
      afternoon: `Deep dive into the local culture. Visit a curated selection of galleries or local markets.`,
      evening: `Spectacular sunset dinner followed by a guided evening walk to discover hidden night gems.`,
      estimatedCost: Math.round(budget / days),
    });
  }

  return JSON.stringify({
    destination,
    summary: `[DRAFT MODE] Here's a high-level ${days}-day plan for ${destination}. NOTE: Ollama was unavailable during generation, so this is a simplified template.`,
    itinerary,
    travelTips: [
      `Learn a few basic phrases in the local language`,
      `Keep copies of important documents`,
      `Try street food for authentic local flavors`,
      `Book accommodations in advance during peak season`,
      `Use public transport to save money and experience local life`,
    ],
    packingList: [
      'Comfortable walking shoes',
      'Weather-appropriate clothing',
      'Universal power adapter',
      'Reusable water bottle',
      'Basic first aid kit',
      'Sunscreen and sunglasses',
      'Small daypack/backpack',
      'Travel documents & copies',
    ],
    localFood: [
      `Try the local street food scene`,
      `Visit the central market for fresh produce`,
      `Ask locals for restaurant recommendations`,
      `Don't miss the traditional breakfast dishes`,
      `Sample local desserts and sweets`,
    ],
    lessCrowdedPlaces: [
      `Visit popular spots early morning (before 8 AM)`,
      `Explore neighborhoods outside the main tourist areas`,
      `Check out local parks and gardens`,
      `Visit museums on weekday mornings`,
      `Discover hidden cafes in side streets`,
    ],
  });
}

module.exports = { generateWithOllama, isOllamaAvailable };
