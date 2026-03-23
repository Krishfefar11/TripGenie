/**
 * Trip Routes
 */
const express = require('express');
const router = express.Router();
const { saveTrip, getTrips, getTripById, deleteTrip } = require('../controllers/tripController');

// Save a trip
router.post('/save-trip', saveTrip);

// Get all saved trips
router.get('/trips', getTrips);

// Get a single trip
router.get('/trips/:id', getTripById);

// Delete a trip
router.delete('/trips/:id', deleteTrip);

module.exports = router;
