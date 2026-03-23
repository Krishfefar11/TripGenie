# 🧞 TripGenie – AI Travel Planner (RAG-based)

TripGenie is a production-ready MERN stack application that leverages **Retrieval-Augmented Generation (RAG)** to create highly personalized, data-driven travel itineraries. 

The system retrieves context from uploaded travel documents (PDF/TXT) and uses a local LLM (Ollama) to generate context-aware, budget-friendly, and comprehensive travel plans.

## 🚀 Key Features

- **AI Trip Planning**: Generate day-wise itineraries with specific morning, afternoon, and evening activities.
- **RAG Pipeline**: Semantic search over thousands of travel chunks using local vector embeddings.
- **Budget Intelligence**: Automatic budget breakdown for hotels, food, travel, and activities.
- **AI Chat Assistant**: Ask follow-up questions or get travel tips in real-time.
- **Advanced Insights**: Weather recommendations, local food spotlights, packing lists, and hidden gems.
- **Local-First AI**: Uses Ollama for generation and `@xenova/transformers` for JS-based embeddings (No paid API required).

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Multer, PDF-Parse.
- **AI/ML**: Ollama (llama3), `@xenova/transformers` (all-MiniLM-L6-v2), Cosine Similarity Search.

## 📋 Prerequisites

1. **Node.js**: v18.x or higher.
2. **MongoDB**: Local instance or Atlas URI.
3. **Ollama**: [Download Ollama](https://ollama.com/) and run `ollama pull llama3`.

## ⚙️ Setup Instructions

1. **Clone & Install Dependencies**:
   ```bash
   # From root directory
   npm run install-all
   ```

2. **Configuration**:
   - Create a `.env` file in the root directory (copy from `.env.example`).
   - Ensure `MONGODB_URI` and `OLLAMA_URL` are correct.

3. **Seed Knowledge Base**:
   ```bash
   cd server
   node seed.js
   ```

4. **Run Application**:
   ```bash
   # From root directory
   npm run dev
   ```
   - Server: http://localhost:5000
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
Built with ❤️ by AI for Travelers.
