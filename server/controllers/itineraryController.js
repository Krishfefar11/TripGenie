/**
 * Itinerary Controller
 * 
 * Handles itinerary generation requests using the RAG pipeline.
 */

const { generateItinerary } = require('../services/ragPipeline');
const referenceDocCache = require('../services/referenceDocCache');

/**
 * POST /api/generate-itinerary
 * Generate a personalized travel itinerary.
 *
 * Body: { destination, budget, days, interests, query, referenceId? }
 * referenceId (optional): from a prior /api/analyze-reference-doc upload —
 * resolved to that document's embedded chunks. Only removed from the cache
 * once generation actually succeeds, so a failed/retried request doesn't
 * make the user re-upload.
 */
async function generateItineraryHandler(req, res) {
  try {
    const { destination, budget, days, interests, query, mediaContext, referenceId } = req.body;
    const extraChunks = referenceId ? referenceDocCache.get(referenceId) || [] : [];

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
      extraChunks,
    });

    if (referenceId) referenceDocCache.remove(referenceId);

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
