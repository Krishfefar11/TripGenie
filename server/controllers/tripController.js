/**
 * Trip Controller
 * 
 * Handles saving, retrieving, and deleting trip itineraries.
 */

const Trip = require('../models/Trip');

/**
 * POST /api/save-trip
 * Save a generated itinerary.
 */
async function saveTrip(req, res) {
  try {
    const {
      destination, days, budget, interests,
      itinerary, budgetBreakdown,
      travelTips, packingList, localFood,
      lessCrowdedPlaces, weatherInfo,
    } = req.body;

    if (!destination || !itinerary) {
      return res.status(400).json({ error: 'Destination and itinerary are required' });
    }

    const trip = await Trip.create({
      destination,
      days: Number(days) || 3,
      budget: Number(budget) || 0,
      interests: interests || [],
      itinerary,
      budgetBreakdown,
      travelTips,
      packingList,
      localFood,
      lessCrowdedPlaces,
      weatherInfo,
    });

    console.log(`💾 Saved trip: ${destination} (${days} days)`);

    res.json({
      success: true,
      message: 'Trip saved successfully',
      trip: {
        id: trip._id,
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
        savedAt: trip.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Save trip error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/trips
 * Get all saved trips.
 */
async function getTrips(req, res) {
  try {
    const trips = await Trip.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/trips/:id
 * Get a single trip by ID.
 */
async function getTripById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id).lean();

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /api/trips/:id
 * Delete a saved trip.
 */
async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { saveTrip, getTrips, getTripById, deleteTrip };
