/**
 * RAG Pipeline Service
 * 
 * Orchestrates the full Retrieval-Augmented Generation flow:
 * 1. Embed the user query
 * 2. Retrieve relevant chunks via vector search
 * 3. Build an augmented prompt with context
 * 4. Generate a response using Ollama
 */

const { generateEmbedding } = require('./embeddingService');
const { searchHybrid } = require('./hybridSearch');
const { rerank } = require('./rerankService');
const { generateWithOllama } = require('./ollamaService');
const { geocodeItinerary } = require('./geocodeService');
const { calculateBudgetBreakdown } = require('../utils/budgetUtils');
const { getWeatherInfo } = require('../utils/weatherUtils');
const { repairJson } = require('../utils/jsonFixer');

/**
 * Build the system prompt for itinerary generation.
 * Injects retrieved context chunks into the prompt.
 */
function buildItineraryPrompt(query, context, options = {}) {
  const { destination, budget, days, interests, budgetBreakdown, mediaContext } = options;

  const contextBlock = context.length > 0
    ? `\n\nRELEVANT TRAVEL CONTEXT (EXTRACT NAMES AND GEMS FROM HERE):\n${context.map((c, i) => `[CLIP ${i + 1}] ${c.chunkText}`).join('\n\n')}`
    : '';
  const hasGroundedContext = context.length > 0;

  // Context derived from a user-uploaded photo/video/document — treated as a
  // stronger signal than the general RAG corpus since it's the user's own reference.
  const mediaBlock = mediaContext
    ? `\n\nCONTEXT FROM USER'S UPLOADED PHOTO/VIDEO/DOCUMENT (HIGH PRIORITY — this is what inspired their trip, prioritize it over generic suggestions):\n${mediaContext}`
    : '';

  const budgetContext = budgetBreakdown ? `
BUDGET GUIDELINES (FOR ${days} DAYS TOTAL):
- Accommodation Allocation: $${budgetBreakdown.breakdown.hotel} (approx. $${budgetBreakdown.perDayBreakdown.hotel}/night)
- Food & Dining Allocation: $${budgetBreakdown.breakdown.food} (approx. $${budgetBreakdown.perDayBreakdown.food}/day)
- Activities & Admissions Allocation: $${budgetBreakdown.breakdown.activities} (approx. $${budgetBreakdown.perDayBreakdown.activities}/day)
` : `- Total Budget: $${budget}`;

  return `You are TripGenie, a meticulous AI travel architect. Your goal is to create a realistic, immersive ${days}-day itinerary for ${destination}.

USER PREFERENCES:
- Destination: ${destination}
- Interests: ${interests?.join(', ') || 'General exploration'}
- Specific Focus: ${query}
${budgetContext}

${mediaBlock}
${contextBlock}

CRITICAL INSTRUCTIONS:
1. ${hasGroundedContext
    ? `USE THE CONTEXT: You MUST prioritize specific names of landmarks, restaurants, and "hidden gems" mentioned in the RELEVANT TRAVEL CONTEXT clips.${mediaContext ? ' Give the highest priority to anything in the CONTEXT FROM USER\'S UPLOADED PHOTO/VIDEO/DOCUMENT section — weave the specific place/food/culture it mentions directly into the itinerary.' : ''}`
    : `NO RETRIEVED CONTEXT: No context clips were provided because nothing in the retrieval corpus was relevant to ${destination}. Rely entirely on your own general knowledge of ${destination} for every landmark, restaurant, and neighborhood you name. Do NOT borrow, adapt, or reference place names, dishes, or details from any other city or country — every recommendation must be real and specific to ${destination} itself.`}
2. NO REPETITIONS: Every day must feature DIFFERENT landmarks and restaurants. Do not recommend the same place twice.
3. FACTUAL ACCURACY: Ensure restaurants and spots are correctly located. ALERT: Avoid recommending ultra-luxury restaurants (like Michelin-starred ones) for budget/moderate trips unless they have a known affordable takeaway/cafe.
4. BUDGET ALIGNMENT: The "estimatedCost" for each day should covers ONLY activities and admissions (not food/hotel). It MUST stay close to the "Activities & Admissions" allocation ($${budgetBreakdown?.perDayBreakdown?.activities || 'budget-appropriate'}/day).
5. SPECIFICITY: Name specific streets, specific dishes, and specific times.
6. MAP QUERY: "mapQuery" must be a short, real, geocodable string for that day's primary area — a landmark or neighborhood name plus the city, e.g. "Colosseum, Rome" or "Shibuya, Tokyo". It gets passed directly to a geocoder, so it must name a real, mappable place, never something vague like "city center" or "local market".
7. FORMAT: Respond ONLY with valid JSON. No conversational filler.

RESPONSE FORMAT (STRICT JSON ONLY):
{
  "destination": "${destination}",
  "summary": "A creative 2-sentence hook",
  "itinerary": [
    {
      "day": 1,
      "title": "Creative Theme Name",
      "morning": "Specific activity with location",
      "afternoon": "Specific activity with location",
      "evening": "Specific activity with location (dinner spot name)",
      "estimatedCost": number,
      "mapQuery": "Short geocodable place name, e.g. 'Colosseum, Rome'"
    }
  ],
  "travelTips": ["Tip 1", "Tip 2"],
  "packingList": ["Item 1", "Item 2"],
  "localFood": ["Specific dish name (brief description)", "Another dish"],
  "lessCrowdedPlaces": ["Quiet spot 1", "Quiet spot 2"]
}

Generate ONLY the JSON.`;
}

/**
 * Build the system prompt for chat conversations.
 */
function buildChatPrompt(userMessage, context, chatHistory = []) {
  const contextBlock = context.length > 0
    ? `\n\nRELEVANT TRAVEL INFORMATION:\n${context.map((c, i) => `[${i + 1}] ${c.chunkText}`).join('\n\n')}`
    : '';

  const historyBlock = chatHistory.length > 0
    ? `\n\nCONVERSATION HISTORY:\n${chatHistory.map((m) => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  return `You are TripGenie, a friendly and knowledgeable AI travel assistant. Help users plan their trips with detailed, practical advice.
${contextBlock}
${historyBlock}

USER: ${userMessage}

Provide a helpful, detailed response about travel planning. Be specific with recommendations, costs, and practical tips. Keep your response conversational and engaging.`;
}

/**
 * Generate a travel itinerary using the full RAG pipeline.
 *
 * @param {object} params - { destination, budget, days, interests, query, mediaContext }
 * @param {string} [params.mediaContext] - Extracted text from a user-uploaded
 *   photo/video/document (see mediaAnalysisService) — folded into both the
 *   retrieval query and the generation prompt when present.
 * @returns {object} Structured itinerary with all advanced features
 */
async function generateItinerary(params) {
  const { destination, budget, days, interests, query, mediaContext } = params;

  console.log(`\n🧞 Generating itinerary for ${destination} (${days} days, $${budget})${mediaContext ? ' [with uploaded media context]' : ''}`);

  // Step 1: Calculate preliminary budget breakdown, adjusted for the
  // destination's relative cost of living
  const budgetBreakdown = calculateBudgetBreakdown(budget, days, destination);

  // Step 2: Generate embedding for the search query — folding in media context
  // so retrieval can surface corpus chunks about a place identified in the upload.
  const searchQuery = `${destination} ${interests?.join(' ')} ${query || ''} ${mediaContext || ''}`.trim();
  let context = [];

  try {
    const queryVector = await generateEmbedding(searchQuery);

    // Step 3: Retrieve relevant chunks — hybrid (dense + BM25 via RRF) fused
    // candidates first, then a cross-encoder reranks down to the final top-K.
    const candidates = await searchHybrid(queryVector, searchQuery, 15);
    context = await rerank(searchQuery, candidates, 5);
    if (context.length === 0) {
      console.log(`⚠️ No relevant corpus context for "${destination}" — falling back to the LLM's general knowledge`);
    } else {
      console.log(`📚 Retrieved ${context.length} context chunks using query: "${searchQuery}"`);
    }
  } catch (error) {
    console.log('⚠️ Embedding/search skipped:', error.message);
  }

  // Step 4: Build augmented prompt
  const prompt = buildItineraryPrompt(
    query || `Plan a ${days}-day trip to ${destination}`,
    context,
    { destination, budget, days, interests, budgetBreakdown, mediaContext }
  );

  // Step 5: Generate response with LLM (Groq → Ollama → Mock)
  //
  // maxTokens scales with `days`: a flat 4096 silently truncated longer trips
  // mid-JSON (verified directly — a 7-day request hit finish_reason: "length"
  // at 4096 and failed to parse). gpt-oss-120b is a reasoning model that spends
  // a large, fairly constant chunk of its budget (~2600-2700 tokens, measured)
  // on hidden reasoning before it writes any JSON, so short trips need a floor
  // well above their actual content size too. The 7-day case needed 4323
  // completion tokens end-to-end; this formula clears that with headroom.
  // Capped below Groq's free-tier 8000 TPM ceiling — very long trips (15-30
  // days) may still exceed it and fall through to Gemini, which already
  // handles that gracefully via the existing fallback chain.
  const maxTokens = Math.min(7000, Math.max(4096, 3400 + days * 280));
  console.log('🤖 Sending prompt to LLM...');
  const rawResponse = await generateWithOllama(prompt, { temperature: 0.7, maxTokens });
  console.log('📥 Raw LLM response (first 100 chars):', rawResponse.substring(0, 100));

  // Step 6: Parse the response
  let itineraryData;
  try {
    // Try to extract JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : rawResponse;
    
    // Attempt to repair common JSON errors
    const repairedJson = repairJson(jsonString);
    
    itineraryData = JSON.parse(repairedJson);
  } catch (error) {
    console.log('⚠️ Could not parse JSON response:', error.message);
    itineraryData = {
      destination,
      summary: rawResponse,
      itinerary: [],
      travelTips: [],
      packingList: [],
      localFood: [],
      lessCrowdedPlaces: [],
    };
  }

  // Step 7: Enhance with final data
  const weatherInfo = getWeatherInfo(destination);

  // Step 8: Geocode each day's mapQuery for the itinerary map. Runs after
  // parsing so a bad/missing LLM field just means one fewer marker, never
  // a failed generation.
  let geocodedDays = itineraryData.itinerary;
  let destinationCoords = null;
  if (Array.isArray(itineraryData.itinerary) && itineraryData.itinerary.length > 0) {
    console.log(`📍 Geocoding ${Math.min(itineraryData.itinerary.length, 14)} day location(s)...`);
    const geocoded = await geocodeItinerary(itineraryData.itinerary, itineraryData.destination || destination);
    geocodedDays = geocoded.days;
    destinationCoords = geocoded.destinationCoords;
    console.log(`📍 Geocoded ${geocodedDays.filter((d) => d.coords).length}/${geocodedDays.length} days`);
  }

  return {
    ...itineraryData,
    itinerary: geocodedDays,
    destinationCoords,
    budgetBreakdown,
    weatherInfo,
    destination: itineraryData.destination || destination,
    days,
    budget,
    interests,
    retrievedSources: context.length,
  };
}

/**
 * Generate a chat response using the RAG pipeline.
 * 
 * @param {string} userMessage - The user's chat message
 * @param {Array} chatHistory - Previous messages in the conversation
 * @returns {string} AI-generated response
 */
async function generateChatResponse(userMessage, chatHistory = []) {
  console.log(`\n💬 Chat query: "${userMessage.substring(0, 50)}..."`);

  // Step 1: Generate embedding & retrieve context
  let context = [];
  try {
    const queryVector = await generateEmbedding(userMessage);
    const candidates = await searchHybrid(queryVector, userMessage, 10);
    context = await rerank(userMessage, candidates, 3);
  } catch (error) {
    console.log('⚠️ Context retrieval skipped:', error.message);
  }

  // Step 2: Build prompt with context and history
  const prompt = buildChatPrompt(userMessage, context, chatHistory);

  // Step 3: Generate response
  const response = await generateWithOllama(prompt, { temperature: 0.8 });

  return response;
}

module.exports = { generateItinerary, generateChatResponse };
