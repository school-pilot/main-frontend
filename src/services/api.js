import axios from "axios";

// Get API URL from environment variables
const API_URL =  import.meta.env.VITE_API_URL|| "https://school-pilot-2.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management functions
const getAccessToken = () => localStorage.getItem("access_token");
const setAccessToken = (token) => localStorage.setItem("access_token", token);
const clearTokens = () => localStorage.removeItem("access_token");

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH API ====================

export const authAPI = {
  // Register new school and admin
  register: async (userData) => {
    const response = await api.post("auth/school/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("auth/login", credentials);
    
    // Store token if returned
    if (response.data.data) {
      setAccessToken(response.data.data);
    }
    
    return response.data;
  },

  // Get current user (from token)
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Note: default axios instance export removed — only `authAPI` is exported from this module.