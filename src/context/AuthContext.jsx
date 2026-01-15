import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import toast from "react-hot-toast";

import { authAPI } from "../services/api.js";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // === STATES ===
  const [user, setUser] = useState(() => {
    // Restore user from localStorage on page load
    const storedUser = localStorage.getItem("user_data");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("access_token"));

  // === HELPERS ===
  const inferRoleFromEmail = (email) => {
    const emailLower = email?.toLowerCase() || "";
    if (emailLower.includes("super") || emailLower.includes("superadmin")) return "super_admin";
    if (emailLower.includes("admin") || emailLower.includes("school")) return "school_admin";
    if (emailLower.includes("teacher")) return "teacher";
    if (emailLower.includes("student")) return "student";
    if (emailLower.includes("parent")) return "parent";
    return "school_admin";
  };

  // === INITIAL AUTH STATE ===
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoadingAuth(false);
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
          // Ensure user is loaded from localStorage
          const storedUser = localStorage.getItem("user_data");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // If no stored user, fetch from API
            try {
              const userRes = await authAPI.getUser(decoded.user_id);
              const userData = userRes.data;

              if (!userData.role && userData.email) {
                userData.role = inferRoleFromEmail(userData.email);
              }

              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem("user_data", JSON.stringify(userData));
            } catch {
              clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoadingAuth(false);
    };

    initAuth();
  }, []);

  // === LOGIN ===
  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      const { access, refresh } = res.data;

      setTokens({ access, refresh });

      const decoded = jwtDecode(access);
      const userRes = await authAPI.getUser(decoded.user_id);
      const userData = userRes.data;

      if (!userData.role && userData.email) {
        userData.role = inferRoleFromEmail(userData.email);
      }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user_data", JSON.stringify(userData));

      toast.success("Login successful");
      navigate("/dashboard");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || "Login failed");
      return false;
    }
  };

  // === REGISTER ===
  const register = async (userData) => {
    try {
      const registrationData = { ...userData, role: "school_admin" };
      await authAPI.register(registrationData);

      toast.success("Registration successful. Please login.");
      navigate("/login");
      return true;
    } catch (err) {
      const data = err.response?.data;
      const firstError = data ? Object.values(data)[0]?.[0] : null;
      toast.error(firstError || "Registration failed");
      return false;
    }
  };

  // === LOGOUT ===
  const logout = () => {
    clearTokens();
    localStorage.removeItem("user_data");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out");
    navigate("/login");
  };

  // === CHANGE PASSWORD ===
  const changePassword = async (data) => {
    try {
      await authAPI.changePassword(data);
      toast.success("Password changed successfully");
      return true;
    } catch (err) {
      const data = err.response?.data;
      const firstError = data ? Object.values(data)[0]?.[0] : null;
      toast.error(firstError || "Password change failed");
      return false;
    }
  };

  // === UPDATE PROFILE ===
  const updateProfile = async (data) => {
    try {
      if (!user?.user_id) throw new Error("User not loaded");

      const res = await authAPI.updateUser(user.user_id, data);
      const updatedUser = { ...user, ...res.data };

      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      toast.success("Profile updated");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Profile update failed");
      return false;
    }
  };

  // === REFRESH USER DATA ===
  const refreshUserData = async () => {
    if (!user?.email) return;
    try {
      const usersRes = await authAPI.getUsers();
      const allUsers = usersRes.data || [];
      const updatedUser = allUsers.find((u) => u.email === user.email);

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // === CONTEXT VALUE ===
  const value = {
    user,
    loadingAuth,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};
