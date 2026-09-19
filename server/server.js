/**
 * TripGenie Server Entry Point
 *
 * Express server that connects to MongoDB, mounts all API routes,
 * and serves the RAG-powered travel planning application.
 */

const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');
const path    = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// --------------- CORS ---------------
// Reflect the request origin back — required when credentials mode may be 'include'.
// origin:true echoes the exact requesting origin, which satisfies the browser's
// "no wildcard with credentials" rule without maintaining a hard-coded list.
app.use(cors({
  origin: true,
  credentials: true,
}));

// --------------- Middleware ---------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- API Routes ---------------
const documentRoutes  = require('./routes/documentRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const chatRoutes      = require('./routes/chatRoutes');
const tripRoutes      = require('./routes/tripRoutes');
const mediaRoutes     = require('./routes/mediaRoutes');
const referenceDocRoutes = require('./routes/referenceDocRoutes');

app.use('/api', documentRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', chatRoutes);
app.use('/api', tripRoutes);
app.use('/api', mediaRoutes);
app.use('/api', referenceDocRoutes);

// Root — useful health/info page
app.get('/', (req, res) => {
  const port = process.env.PORT || 5001;
  res.send(`
    <div style="font-family:sans-serif;text-align:center;padding:50px;max-width:600px;margin:auto">
      <h1>🧞 TripGenie Backend</h1>
      <p>API is live on port <b>${port}</b>.</p>
      <p>LLM backend: <b>${process.env.GROQ_API_KEY ? 'Groq ✅' : process.env.GEMINI_API_KEY ? 'Gemini ✅' : 'Mock (set GROQ_API_KEY or GEMINI_API_KEY for real AI)'}</b></p>
      <p><a href="/api/health">/api/health</a></p>
    </div>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TripGenie server is running 🧞',
    llm: process.env.GROQ_API_KEY ? 'groq' : process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OLLAMA_URL ? 'ollama' : 'mock'),
  });
});

// --------------- MongoDB ---------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripgenie';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🧞 TripGenie server running on http://localhost:${PORT}`);
      console.log(`🤖 LLM backend: ${process.env.GROQ_API_KEY ? 'Groq API' : 'Ollama / Mock'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
