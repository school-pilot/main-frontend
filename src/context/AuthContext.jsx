import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import { authAPI } from "../services/api";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

/* =====================================================
   AUTH PROVIDER
===================================================== */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =====================================================
     INIT AUTH STATE
  ===================================================== */

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expired
      if (decoded.exp * 1000 < Date.now()) {
        clearTokens();
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch {
      clearTokens();
      setUser(null);
    }

    setLoading(false);
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);

      const { access, refresh } = res.data;
      setTokens({ access, refresh });

      const decoded = jwtDecode(access);
      setUser(decoded);

      toast.success("Login successful");
      navigate("/dashboard");

      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Invalid login credentials"
      );
      return false;
    }
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const register = async (userData) => {
    try {
      await authAPI.register(userData);

      toast.success("Registration successful. Please login.");
      navigate("/login");

      return true;
    } catch (err) {
      const data = err.response?.data;

      if (data) {
        const firstError = Object.values(data)[0]?.[0];
        toast.error(firstError || "Registration failed");
      } else {
        toast.error("Network error");
      }

      return false;
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    clearTokens();
    setUser(null);
    navigate("/login");
    toast.success("Logged out");
  };

  /* =====================================================
     CHANGE PASSWORD
  ===================================================== */

  const changePassword = async (data) => {
    try {
      await authAPI.changePassword(data);
      toast.success("Password changed successfully");
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Password change failed"
      );
      return false;
    }
  };

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */

  const updateProfile = async (data) => {
    try {
      if (!user?.user_id) throw new Error("User not loaded");

      const res = await authAPI.updateUser(user.user_id, data);

      setUser((prev) => ({ ...prev, ...res.data }));
      toast.success("Profile updated");

      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Profile update failed"
      );
      return false;
    }
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    user,
    loading,
    isAuthenticated: !!getAccessToken(),
    login,
    register,
    logout,
    changePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
