// Re-export main API and auth API from separate modules for compatibility.
export { default as api } from "./mainApi";
export { authAPI } from "./authApi";
export { getAccessToken, setAccessToken, clearTokens } from "./mainApi";