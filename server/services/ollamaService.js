/**
 * LLM Service
 *
 * Supports four backends (priority order):
 *  1. Groq API   — free cloud LLM, used when GROQ_API_KEY is set
 *  2. Gemini API — free cloud LLM (Google AI Studio), used when GROQ fails/absent
 *                  and GEMINI_API_KEY is set. This is the real production
 *                  fallback — unlike Ollama it works on a deployed server.
 *  3. Ollama     — local LLM, only reachable in local dev; harmless to keep
 *                  as a tertiary check since it fails fast when unreachable.
 *  4. Mock       — structured fallback when nothing else is available.
 */

const GROQ_API_URL   = 'https://api.groq.com/openai/v1/chat/completions';
// llama-3.3-70b-versatile was deprecated by Groq (announced 2026-06-17,
// decommissioned 2026-08) — openai/gpt-oss-120b is Groq's recommended replacement.
const GROQ_MODEL     = process.env.GROQ_MODEL     || 'openai/gpt-oss-120b';
const GROQ_API_KEY   = process.env.GROQ_API_KEY   || '';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL   = process.env.GEMINI_MODEL   || 'gemini-flash-lite-latest';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

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
// Gemini (free cloud LLM — production fallback)
// ─────────────────────────────────────────────

/**
 * Generate a response using Google's Gemini API (AI Studio free tier).
 * @param {string} prompt
 * @param {object} options
 * @returns {string}
 */
async function generateWithGemini(prompt, options = {}) {
  const model = options.model || GEMINI_MODEL;
  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          // Note: thinkingConfig is deliberately omitted. It worked earlier
          // against gemini-flash-lite-latest, then started failing every
          // request (even trivial ones) with 400 INVALID_ARGUMENT later the
          // same day — "-latest" aliases can shift which model version they
          // point to without notice, and the new one rejects this field.
          // Omitting it is unconditionally safe; the field was a minor quota
          // optimization, not a correctness requirement.
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini API returned no content');
  return text;
}

/**
 * Generate a response from Gemini given a text prompt plus inline image/video data.
 * Gemini is the only backend here with native multimodal understanding, so this
 * bypasses the Groq-first fallback chain and always targets Gemini directly.
 *
 * @param {string} prompt
 * @param {string} mediaBase64 - base64-encoded file contents (no data: prefix)
 * @param {string} mimeType - e.g. 'image/jpeg', 'video/mp4'
 * @param {object} options
 * @returns {string}
 */
async function generateWithGeminiVision(prompt, mediaBase64, mimeType, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured — media analysis requires Gemini');
  }

  const model = options.model || GEMINI_MODEL;
  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: mediaBase64 } },
          ],
        }],
        generationConfig: {
          // Note: thinkingConfig is NOT included here — combining it with
          // inline image/video data causes a 400 INVALID_ARGUMENT on
          // gemini-flash-lite-latest (verified directly; text-only requests
          // in generateWithGemini() are unaffected).
          temperature: options.temperature || 0.4,
          maxOutputTokens: options.maxTokens || 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini Vision API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini Vision API returned no content');
  return text;
}

// ─────────────────────────────────────────────
// Ollama (local dev only)
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
// Main entry point — tries Groq → Gemini → Ollama → Mock
// ─────────────────────────────────────────────

/**
 * Generate a response using the best available LLM backend.
 * Priority: Groq → Gemini → local Ollama → mock fallback.
 *
 * @param {string} prompt
 * @param {object} options - { temperature, maxTokens, model }
 * @returns {string}
 */
async function generateWithOllama(prompt, options = {}) {
  // 1️⃣  Groq (free cloud LLM — fastest, tried first)
  if (GROQ_API_KEY) {
    try {
      console.log(`🤖 Using Groq API (${GROQ_MODEL})`);
      const result = await generateWithGroq(prompt, options);
      console.log('✅ Groq response received');
      return result;
    } catch (err) {
      console.error('❌ Groq API failed:', err.message);
      // fall through to Gemini
    }
  }

  // 2️⃣  Gemini (free cloud LLM — real production fallback, works when deployed)
  if (GEMINI_API_KEY) {
    try {
      console.log(`🤖 Using Gemini API (${GEMINI_MODEL})`);
      const result = await generateWithGemini(prompt, options);
      console.log('✅ Gemini response received');
      return result;
    } catch (err) {
      console.error('❌ Gemini API failed:', err.message);
      // fall through to Ollama
    }
  }

  // 3️⃣  Local Ollama (dev convenience only — unreachable in production)
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

  // 4️⃣  Mock fallback
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
    summary: `[DRAFT — No LLM configured] A ${days}-day overview for ${destination}. Add a GROQ_API_KEY or GEMINI_API_KEY to your .env to get real AI-generated itineraries.`,
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

module.exports = { generateWithOllama, isOllamaAvailable, generateWithGeminiVision };
