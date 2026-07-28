import axios from 'axios';

// In development: Vite proxies /api → http://localhost:5001 (see vite.config.js)
// In production:  points directly to Render backend
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://tripgenie-k0hi.onrender.com/api'
    : '/api');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 min — Render free tier can take 60s+ on cold start
  // withCredentials not needed — TripGenie uses UUID sessionIds in request body, not cookies
});

export const itineraryService = {
  generate: async (data) => {
    const response = await api.post('/generate-itinerary', data);
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (message, sessionId) => {
    const response = await api.post('/chat', { message, sessionId });
    return response.data;
  },
  getHistory: async (sessionId) => {
    const response = await api.get(`/chat/${sessionId}`);
    return response.data;
  },
};

export const tripService = {
  save: async (tripData) => {
    const response = await api.post('/save-trip', tripData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/trips');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

export const mediaService = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('media', file);
    const response = await api.post('/analyze-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const documentService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await api.post('/upload-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
};

export default api;
