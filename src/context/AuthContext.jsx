import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import api, { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user from token
  useEffect(() => {
    console.log("🔑 Initializing Auth Context...");
    console.log("Stored Token:", token ? "Present" : "Not Present");

    if (token) {
      try {
        // Decode token to get user info
        const decoded = jwtDecode(token);
        console.log("👤 Decoded User:", decoded);
        setUser(decoded);
      } catch (error) {
        console.error("❌ Token Decode Error:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Axios interceptor for token refresh (already handled in api.js)
  // No need to duplicate here

  const login = async (credentials) => {
    try {
      console.log("🔐 Login Attempt:", {
        email: credentials.email,
        password: credentials.password ? "[HIDDEN]" : "Missing",
      });

      // Use the api instance directly for login
      const response = await api.post("/api/accounts/token/", credentials);
      const { access, refresh } = response.data;

      console.log("✅ Login Successful:", {
        tokenReceived: !!access,
        refreshTokenReceived: !!refresh,
      });

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      setToken(access); // This will trigger useEffect to decode user

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("❌ Login Failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed";
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log("📝 Registration attempt:", {
        email: userData.email,
        username: userData.username,
        hasPassword: !!userData.password,
      });

      const response = await axios.post("/api/accounts/register/", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Registration successful:", response.data);

      // Check if response contains tokens (some APIs return tokens on registration)
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setToken(response.data.access);

        if (response.data.user) {
          setUser(response.data.user);
        }

        toast.success("Registration successful!");
        return { success: true, data: response.data };
      }

      toast.success("Registration successful! Please login.");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Registration Failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Registration failed";

      if (error.response?.data) {
        // Handle Django/DRF validation errors
        const errorData = error.response.data;

        if (typeof errorData === "object") {
          // Extract first error message
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log("👋 Logging out...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const changePassword = async (passwords) => {
    try {
      console.log("🔑 Password Change Attempt");

      await api.post("/api/accounts/users/change-password/", passwords);
      console.log("✅ Password Change Successful");
      toast.success("Password changed successfully");
      return true;
    } catch (error) {
      console.error("❌ Password Change Failed:", {
        status: error.response?.status,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Password change failed";
      toast.error(errorMessage);
      return false;
    }
  };

  const updateProfile = async (userData) => {
    try {
      console.log("📋 Profile Update Attempt:", {
        userData,
        userId: user?.user_id,
      });

      const response = await api.patch(
        `/api/accounts/users/${user.user_id}/update/`,
        userData
      );

      console.log("✅ Profile Update Successful:", response.data);

      // Update user state with new data
      setUser((prev) => ({
        ...prev,
        ...response.data,
        // Ensure we keep the user_id from token
        user_id: prev.user_id,
      }));

      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Profile Update Failed:", {
        status: error.response?.status,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Update failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Fetch user profile from API
  const fetchUserProfile = async (userId) => {
    try {
      const response = await api.get(`/api/accounts/users/${userId}/`);
      setUser((prev) => ({ ...prev, ...response.data }));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  // Refresh user data from token
  const refreshUserData = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    fetchUserProfile,
    refreshUserData,
  };

  console.log("🚀 Auth Provider State:", {
    user: user?.email,
    isAuthenticated: !!token,
    loading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
