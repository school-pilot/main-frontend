import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "https://school-pilot-1.onrender.com";

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
    console.log('[API Interceptor]', {
      url: config.url,
      tokenPresent: !!token,
      tokenLength: token?.length,
      headerBefore: config.headers.Authorization,
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Interceptor] Set Authorization header');
    } else {
      console.warn('[API Interceptor] No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { getAccessToken, setAccessToken, clearTokens };
