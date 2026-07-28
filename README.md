# 🧞 TripGenie – AI Travel Planner (RAG-based)

TripGenie is a full-stack MERN application that leverages **Retrieval-Augmented Generation (RAG)** to create highly personalized, data-driven travel itineraries.

The system retrieves context from uploaded travel documents (PDF/TXT) and sends it to an LLM to generate context-aware, budget-friendly, and comprehensive travel plans — with a resilient multi-provider fallback chain so it keeps working even if one AI provider has an outage or deprecates a model.

## 🚀 Key Features

- **AI Trip Planning**: Generate day-wise itineraries with specific morning, afternoon, and evening activities.
- **RAG Pipeline**: Semantic search over travel document chunks using local vector embeddings.
- **Budget Intelligence**: Automatic budget breakdown for hotels, food, travel, and activities.
- **AI Chat Assistant**: Ask follow-up questions or get travel tips in real-time.
- **Advanced Insights**: Weather recommendations, local food spotlights, packing lists, and hidden gems.
- **Resilient AI backend**: Tries **Groq** → **Gemini** → local **Ollama** → a templated mock, in that order, so generation never hard-fails. Embeddings run locally via `@xenova/transformers` — no external embedding API or per-call cost.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Multer, PDF-Parse.
- **AI/ML**: Groq + Gemini (cloud LLMs, free tiers) with local Ollama as a dev-only fallback, `@xenova/transformers` (all-MiniLM-L6-v2) for embeddings, custom cosine similarity search.

## 📋 Prerequisites

1. **Node.js**: v18.x or higher.
2. **MongoDB**: Local instance or Atlas URI.
3. **A free LLM API key** — pick at least one:
   - **Groq** (fastest): [console.groq.com](https://console.groq.com) → API Keys
   - **Gemini** (recommended fallback, no credit card): [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
4. *(Optional, local dev only)* **Ollama**: [Download Ollama](https://ollama.com/) and run `ollama pull llama3` — only used if no cloud key is set, and only reachable when running locally.

## ⚙️ Setup Instructions

1. **Clone & Install Dependencies**:
   ```bash
   # From root directory
   npm run install-all
   ```

2. **Configuration**:
   - Create a `.env` file in the root directory (copy from `.env.example`).
   - Set `MONGODB_URI`, and at least one of `GROQ_API_KEY` / `GEMINI_API_KEY`.

3. **Seed Knowledge Base**:
   ```bash
   cd server
   node seed.js
   ```

4. **Start the project** (runs server + client together):
   ```bash
   # From root directory
   npm run dev
   ```
   - Server: http://localhost:5001
   - Client: http://localhost:5173

## 🏗️ Project Structure

```text
server/
  controllers/   # API logic
  routes/        # API endpoints
  services/      # RAG pipeline, embeddings, Ollama client
  models/        # MongoDB schemas
  utils/         # Text splitting, weather data, budget logic
  data/          # Sample travel documents for seeding

client/
  src/
    components/  # UI components (ItineraryCard, Chat, Form, etc.)
    pages/       # Page views (Home, Chat, Itinerary, Saved)
    services/    # Axios API client
```

## 🧠 How RAG Works in TripGenie

1. **Ingestion**: Documents are uploaded/seeded, split into 250-word chunks.
2. **Embeddings**: Each chunk is converted into a 384-dimensional vector using `all-MiniLM-L6-v2`.
3. **Retrieval**: When you plan a trip, your query is embedded and matched against chunks using cosine similarity.
4. **Generation**: The top-5 most relevant chunks are fed into the LLM as context for generating the final itinerary.

---
Plan your next adventure with TripGenie.
