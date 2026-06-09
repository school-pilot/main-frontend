import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { authAPI } from "../services/authApi";

const AuthContext = createContext(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Token utilities
const getAccessToken = () => localStorage.getItem("access_token");
const setAccessToken = (token) => localStorage.setItem("access_token", token);
const clearTokens = () => localStorage.removeItem("access_token");

// Helper function to get role-based dashboard route
const getDashboardRoute = (role) => {
  if (!role) return "/";
  
  const roleLower = role.toLowerCase();
  
  const roleRoutes = {
    super_admin: "/super-admin",
    school_admin: "/school-admin",
    teacher: "/teacher",
    student: "/student",
    parent: "/parent",
  };
  
  return roleRoutes[roleLower] || "/";
};

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
          firstName: decoded.firstName,
          lastName: decoded.lastName,
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
        toast.success(response.message || "Registration successful! Redirecting to login.");
        navigate("/login", { replace: true });
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
     LOGIN - Navigate to role-based dashboard
  ========================================= */
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        // Token is already stored in api interceptor
        const token = getAccessToken();
        
        if (token) {
          const decoded = jwtDecode(token);
          
          // Set user state with all available info
          const userData = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            schoolId: decoded.schoolId,
            firstName: decoded.firstName || decoded.first_name,
            lastName: decoded.lastName || decoded.last_name,
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          toast.success(response.message || `Welcome back, ${userData.firstName || 'User'}!`);
          
          // Navigate to role-based dashboard
          const dashboardRoute = getDashboardRoute(decoded.role);
          navigate(dashboardRoute, { replace: true });
          
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
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const value = {
    user,
    isAuthenticated,
    loadingAuth,
    loading: loadingAuth,
    register,
    login,
    logout,
    getDashboardRoute, // Expose helper if needed in components
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};