import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import { authAPI } from "../services/api.js"; // Make sure authAPI is imported
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // Helper function to infer role from email
  const inferRoleFromEmail = (email) => {
    const emailLower = email.toLowerCase();

    if (emailLower.includes("super") || emailLower.includes("superadmin")) {
      return "super_admin";
    }
    if (emailLower.includes("admin") || emailLower.includes("school")) {
      return "school_admin";
    }
    if (emailLower.includes("teacher")) {
      return "teacher";
    }
    if (emailLower.includes("student")) {
      return "student";
    }
    if (emailLower.includes("parent")) {
      return "parent";
    }

    // Default for registration is school_admin
    return "school_admin";
  };

  /* =====================================================
     LOAD USER FROM STORAGE
  ===================================================== */

  const loadUserFromStorage = async () => {
    const token = getAccessToken();
    const storedUser = localStorage.getItem('user_data');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user_data');
      }
    }
  };

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
        setIsAuthenticated(false);
      } else {
        // Try to load user from localStorage first
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        } else {
          // If no stored user, just use decoded token
          setUser(decoded);
          setIsAuthenticated(true);
        }
      }
    } catch {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
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

      // Store tokens
      setTokens({ access, refresh });

      // Decode token to get user_id
      const decoded = jwtDecode(access);

      let userData = null;

      try {
        // Try to fetch user profile from API
        // Check if authAPI has a getUser method or similar
        if (authAPI && authAPI.getUser) {
          const userRes = await authAPI.getUser(decoded.user_id);
          userData = userRes.data;
        } else {
          // If no getUser method, try getUsers and find by email
          const usersRes = await authAPI.getUsers();
          const allUsers = usersRes.data || [];
          userData = allUsers.find(u => u.email === credentials.email);
        }
      } catch (profileError) {
        console.warn("Could not fetch user profile:", profileError);
      }

      // If still no user data, create basic user object
      if (!userData) {
        userData = {
          user_id: decoded.user_id,
          email: credentials.email,
          role: inferRoleFromEmail(credentials.email),
          is_active: true,
        };
      }

      // Ensure role is set
      if (!userData.role) {
        userData.role = inferRoleFromEmail(credentials.email);
      }

      // Store user in state and localStorage
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user_data', JSON.stringify(userData));

      toast.success("Login successful");
      navigate("/dashboard");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid login credentials");
      return false;
    }
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const register = async (userData) => {
    try {
      // Ensure role is set for registration (school_admin by default)
      const registrationData = {
        ...userData,
        role: 'school_admin', // Auto-assign school_admin role for registrations
      };

      await authAPI.register(registrationData);

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
    setIsAuthenticated(false);
    localStorage.removeItem('user_data');
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
      const data = err.response?.data;

      if (data) {
        const firstError = Object.values(data)[0]?.[0];
        toast.error(firstError || "Password change failed");
      } else {
        toast.error("Network error");
      }

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

      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      toast.success("Profile updated");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Profile update failed");
      return false;
    }
  };

  /* =====================================================
     REFRESH USER DATA
  ===================================================== */

  const refreshUserData = async () => {
    if (!user?.email) return;
    
    try {
      const usersRes = await authAPI.getUsers();
      const allUsers = usersRes.data || [];
      const updatedUser = allUsers.find(u => u.email === user.email);
      
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    refreshUserData,
    loadUserFromStorage, // Export if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};