/**
 * Itinerary Controller
 * 
 * Handles itinerary generation requests using the RAG pipeline.
 */

const { generateItinerary } = require('../services/ragPipeline');

/**
 * POST /api/generate-itinerary
 * Generate a personalized travel itinerary.
 * 
 * Body: { destination, budget, days, interests, query }
 */
async function generateItineraryHandler(req, res) {
  try {
    const { destination, budget, days, interests, query, mediaContext } = req.body;

    // Validate required fields
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }
    if (!days || days < 1 || days > 30) {
      return res.status(400).json({ error: 'Days must be between 1 and 30' });
    }
    if (!budget || budget < 1) {
      return res.status(400).json({ error: 'Budget must be a positive number' });
    }

    // Generate itinerary via RAG pipeline
    const itinerary = await generateItinerary({
      destination,
      budget: Number(budget),
      days: Number(days),
      interests: Array.isArray(interests) ? interests : interests?.split(',').map((s) => s.trim()) || [],
      query: query || `Plan a ${days}-day trip to ${destination}`,
      mediaContext: mediaContext || undefined,
    });

    res.json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error('❌ Itinerary generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate itinerary. Please try again.' });
  }
}

module.exports = { generateItineraryHandler };
