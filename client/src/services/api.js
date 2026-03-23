import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
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
