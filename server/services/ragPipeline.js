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
const { searchSimilarChunks } = require('./vectorSearch');
const { generateWithOllama } = require('./ollamaService');
const { calculateBudgetBreakdown } = require('../utils/budgetUtils');
const { getWeatherInfo } = require('../utils/weatherUtils');
const { repairJson } = require('../utils/jsonFixer');

/**
 * Build the system prompt for itinerary generation.
 * Injects retrieved context chunks into the prompt.
 */
function buildItineraryPrompt(query, context, options = {}) {
  const { destination, budget, days, interests, budgetBreakdown } = options;

  const contextBlock = context.length > 0
    ? `\n\nRELEVANT TRAVEL CONTEXT (EXTRACT NAMES AND GEMS FROM HERE):\n${context.map((c, i) => `[CLIP ${i + 1}] ${c.chunkText}`).join('\n\n')}`
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

${contextBlock}

CRITICAL INSTRUCTIONS:
1. USE THE CONTEXT: You MUST prioritize specific names of landmarks, restaurants, and "hidden gems" mentioned in the RELEVANT TRAVEL CONTEXT clips.
2. NO REPETITIONS: Every day must feature DIFFERENT landmarks and restaurants. Do not recommend the same place twice.
3. FACTUAL ACCURACY: Ensure restaurants and spots are correctly located. ALERT: Avoid recommending ultra-luxury restaurants (like Michelin-starred ones) for budget/moderate trips unless they have a known affordable takeaway/cafe.
4. BUDGET ALIGNMENT: The "estimatedCost" for each day should covers ONLY activities and admissions (not food/hotel). It MUST stay close to the "Activities & Admissions" allocation ($${budgetBreakdown?.perDayBreakdown?.activities || 'budget-appropriate'}/day).
5. SPECIFICITY: Name specific streets, specific dishes, and specific times.
6. FORMAT: Respond ONLY with valid JSON. No conversational filler.

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
      "estimatedCost": number
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
 * @param {object} params - { destination, budget, days, interests, query }
 * @returns {object} Structured itinerary with all advanced features
 */
async function generateItinerary(params) {
  const { destination, budget, days, interests, query } = params;

  console.log(`\n🧞 Generating itinerary for ${destination} (${days} days, $${budget})`);

  // Step 1: Calculate preliminary budget breakdown
  const budgetBreakdown = calculateBudgetBreakdown(budget, days);

  // Step 2: Generate embedding for the search query (include specific user query)
  const searchQuery = `${destination} ${interests?.join(' ')} ${query || ''}`.trim();
  let context = [];

  try {
    const queryVector = await generateEmbedding(searchQuery);

    // Step 3: Retrieve relevant chunks from vector store
    context = await searchSimilarChunks(queryVector, 5);
    console.log(`📚 Retrieved ${context.length} context chunks using query: "${searchQuery}"`);
  } catch (error) {
    console.log('⚠️ Embedding/search skipped:', error.message);
  }

  // Step 4: Build augmented prompt
  const prompt = buildItineraryPrompt(
    query || `Plan a ${days}-day trip to ${destination}`,
    context,
    { destination, budget, days, interests, budgetBreakdown }
  );

  // Step 5: Generate response with LLM (Groq → Ollama → Mock)
  console.log('🤖 Sending prompt to LLM...');
  const rawResponse = await generateWithOllama(prompt, { temperature: 0.7, maxTokens: 4096 });
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

  return {
    ...itineraryData,
    budgetBreakdown,
    weatherInfo,
    destination: itineraryData.destination || destination,
    days,
    budget,
    interests,
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
    context = await searchSimilarChunks(queryVector, 3);
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
