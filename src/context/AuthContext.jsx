import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Token utilities
const getAccessToken = () => localStorage.getItem("access_token");
const setAccessToken = (token) => localStorage.setItem("access_token", token);
const clearTokens = () => localStorage.removeItem("access_token");

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* =========================================
     INITIAL AUTH CHECK
  ========================================= */
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          clearTokens();
          setLoadingAuth(false);
          return;
        }

        // Set user from decoded token
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          schoolId: decoded.schoolId,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth init failed:", error);
        clearTokens();
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  /* =========================================
     REGISTER
  ========================================= */
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        toast.success(response.message || "Registration successful! Please login.");
        navigate("/login");
        return true;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || error.message || "Registration failed");
      return false;
    }
  };

  /* =========================================
     LOGIN
  ========================================= */
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        // Token is already stored in api interceptor
        const token = getAccessToken();
        
        if (token) {
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            schoolId: decoded.schoolId,
          });
          setIsAuthenticated(true);
          toast.success(response.message || "Login successful");
          navigate("/dashboard");
          return true;
        } else {
          throw new Error("No token received");
        }
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
      return false;
    }
  };

  /* =========================================
     LOGOUT
  ========================================= */
  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isAuthenticated,
    loadingAuth,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};