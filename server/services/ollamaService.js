/**
 * LLM Service
 *
 * Supports two backends (priority order):
 *  1. Groq API  — free cloud LLM (llama3-70b), used when GROQ_API_KEY is set
 *  2. Ollama    — local LLM, used when Groq key is absent and Ollama is running
 *  3. Mock      — structured fallback when neither is available
 */

const GROQ_API_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL     = process.env.GROQ_MODEL     || 'llama-3.3-70b-versatile';
const GROQ_API_KEY   = process.env.GROQ_API_KEY   || '';

const OLLAMA_URL     = process.env.OLLAMA_URL     || 'http://127.0.0.1:11434';
const OLLAMA_MODEL   = process.env.OLLAMA_MODEL   || 'llama3:latest';

// ─────────────────────────────────────────────
// Groq (free cloud LLM)
// ─────────────────────────────────────────────

/**
 * Generate a response using Groq's free OpenAI-compatible API.
 * @param {string} prompt
 * @param {object} options
 * @returns {string}
 */
async function generateWithGroq(prompt, options = {}) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─────────────────────────────────────────────
// Ollama (local fallback)
// ─────────────────────────────────────────────

async function isOllamaAvailable() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

async function generateWithOllamaLocal(prompt, options = {}) {
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

  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const data = await response.json();
  return data.response;
}

// ─────────────────────────────────────────────
// Main entry point — tries Groq → Ollama → Mock
// ─────────────────────────────────────────────

/**
 * Generate a response using the best available LLM backend.
 * Priority: Groq API key → local Ollama → mock fallback.
 *
 * @param {string} prompt
 * @param {object} options - { temperature, maxTokens, model }
 * @returns {string}
 */
async function generateWithOllama(prompt, options = {}) {
  // 1️⃣  Groq (free cloud LLM — preferred for deployed environments)
  if (GROQ_API_KEY) {
    try {
      console.log(`🤖 Using Groq API (${GROQ_MODEL})`);
      const result = await generateWithGroq(prompt, options);
      console.log('✅ Groq response received');
      return result;
    } catch (err) {
      console.error('❌ Groq API failed:', err.message);
      // fall through to Ollama
    }
  }

  // 2️⃣  Local Ollama
  const ollamaUp = await isOllamaAvailable();
  if (ollamaUp) {
    try {
      console.log(`🤖 Using local Ollama (${OLLAMA_MODEL})`);
      return await generateWithOllamaLocal(prompt, options);
    } catch (err) {
      console.error('❌ Ollama failed:', err.message);
      // fall through to mock
    }
  }

  // 3️⃣  Mock fallback
  console.log('⚠️  No LLM available — using mock response');
  return generateMockResponse(prompt);
}

// ─────────────────────────────────────────────
// Mock fallback
// ─────────────────────────────────────────────

function generateMockResponse(prompt, errorMsg = 'No LLM configured') {
  console.log('👷 Mock mode:', errorMsg);

  const destMatch  = prompt.match(/Destination[:\s]+([A-Za-z\s]+)/i) || prompt.match(/for\s+([A-Za-z\s]+)/i);
  const daysMatch  = prompt.match(/(\d+)\s*days?/i);
  const budgetMatch = prompt.match(/budget[:\s]*\$?(\d+)/i);

  const destination = destMatch  ? destMatch[1].trim().split('\n')[0].replace(/^- /, '') : 'your destination';
  const days        = daysMatch  ? parseInt(daysMatch[1])  : 3;
  const budget      = budgetMatch ? parseInt(budgetMatch[1]) : 1000;

  const itinerary = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: Exploring ${destination}`,
    morning:   i === 0 ? `Arrive and settle into ${destination}. Orientation walk through the historic district.` : `Early breakfast at a local café. Visit a key landmark from your interests.`,
    afternoon: `Deep dive into local culture — galleries, markets, or nature trails.`,
    evening:   `Sunset dinner at a recommended local restaurant. Evening stroll.`,
    estimatedCost: Math.round(budget / days),
  }));

  return JSON.stringify({
    destination,
    summary: `[DRAFT — No LLM configured] A ${days}-day overview for ${destination}. Add a GROQ_API_KEY to your .env to get real AI-generated itineraries.`,
    itinerary,
    travelTips: [
      'Learn a few basic phrases in the local language',
      'Keep digital and physical copies of your documents',
      'Try street food for authentic local flavours',
      'Book accommodations in advance during peak season',
      'Use public transport to save money and experience local life',
    ],
    packingList: [
      'Comfortable walking shoes',
      'Weather-appropriate clothing',
      'Universal power adapter',
      'Reusable water bottle',
      'Basic first-aid kit',
      'Sunscreen & sunglasses',
      'Small daypack',
      'Travel documents & copies',
    ],
    localFood: [
      'Explore the local street food scene',
      'Visit the central market for fresh produce',
      'Ask locals for hidden restaurant gems',
      'Don\'t skip the traditional breakfast dishes',
      'Sample local desserts and sweets',
    ],
    lessCrowdedPlaces: [
      'Visit popular spots before 8 AM',
      'Explore residential neighbourhoods off the tourist trail',
      'Check out local parks and botanical gardens',
      'Visit museums on weekday mornings',
      'Discover hidden cafés in side streets',
    ],
  });
}

module.exports = { generateWithOllama, isOllamaAvailable };
