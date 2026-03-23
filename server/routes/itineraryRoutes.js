/**
 * Itinerary Routes
 */
const express = require('express');
const router = express.Router();
const { generateItineraryHandler } = require('../controllers/itineraryController');

// Generate a personalized travel itinerary
router.post('/generate-itinerary', generateItineraryHandler);

module.exports = router;
