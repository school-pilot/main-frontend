import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import { authAPI } from "../services/api";
import {
  getAccessToken,
  clearTokens,
} from "../utils/token";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

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

        // Token expired
        if (decoded.exp * 1000 < Date.now()) {
          clearTokens();
          setLoadingAuth(false);
          return;
        }

        // 🔥 Get role + user from backend (NOT email)
        const res = await authAPI.getUser(decoded.user_id);
        const userData = res.data;

        setUser(userData);
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
     LOGIN
  ========================================= */

  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      const { access, refresh } = res.data;

      // Tokens saved in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const decoded = jwtDecode(access);

      // Get full user (includes role from backend)
      const userRes = await authAPI.getUser(decoded.user_id);

      setUser(userRes.data);
      setIsAuthenticated(true);

      toast.success("Login successful");
      navigate("/dashboard");

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Login failed"
      );
      return false;
    }
  };

  /* =========================================
     REGISTER
  ========================================= */

  const register = async (data) => {
    try {
      await authAPI.register(data);

      toast.success("Registration successful. Please login.");
      navigate("/login");
      return true;
    } catch (error) {
      const errData = error.response?.data;
      const firstError = errData
        ? Object.values(errData)[0]?.[0]
        : "Registration failed";

      toast.error(firstError);
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
    toast.success("Logged out");
  };

  /* =========================================
     UPDATE PROFILE
  ========================================= */

  const updateProfile = async (data) => {
    try {
      if (!user?.id) throw new Error("User not loaded");

      const res = await authAPI.updateUser(user.id, data);

      setUser(res.data);
      toast.success("Profile updated");
      return true;
    } catch (error) {
      toast.error("Profile update failed");
      return false;
    }
  };

  /* =========================================
     CHANGE PASSWORD
  ========================================= */

  const changePassword = async (data) => {
    try {
      await authAPI.changePassword(data);
      toast.success("Password changed successfully");
      return true;
    } catch (error) {
      toast.error("Password change failed");
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loadingAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};