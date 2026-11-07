import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for logging & graceful error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[MemoraDesk API] Request error or backend unreachable:', error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
