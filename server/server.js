/**
 * TripGenie Server Entry Point
 * 
 * Express server that connects to MongoDB, mounts all API routes,
 * and serves the RAG-powered travel planning application.
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- API Routes ---------------
const documentRoutes = require('./routes/documentRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const chatRoutes = require('./routes/chatRoutes');
const tripRoutes = require('./routes/tripRoutes');

app.use('/api', documentRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', chatRoutes);
app.use('/api', tripRoutes);

// Root route for better DX
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>🧞 TripGenie Backend is Live</h1>
      <p>The API is running on port 5001.</p>
      <p>Please visit the <b>frontend</b> at <a href="http://localhost:5173">http://localhost:5173</a> to use the app.</p>
    </div>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TripGenie server is running 🧞' });
});

// --------------- MongoDB Connection ---------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripgenie';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🧞 TripGenie server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
