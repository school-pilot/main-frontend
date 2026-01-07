import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';



// Add this at the top to debug API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-pilot-api.vercel.app';
console.log('API Base URL:', API_BASE_URL);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Debug function for all API calls
  const debugApiCall = (method, url, data = null, config = null) => {
    console.log(`📡 API ${method.toUpperCase()} Request:`, {
      url: `${API_BASE_URL}${url}`,
      data,
      config,
      timestamp: new Date().toISOString()
    });
  };

  // Configure axios
  useEffect(() => {
    console.log('🔑 Initializing Auth Context...');
    console.log('Stored Token:', token ? 'Present' : 'Not Present');
    
    if (token) {
      try {
        axios.defaults.baseURL = API_BASE_URL;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decoded = jwtDecode(token);
        console.log('👤 Decoded User:', decoded);
        setUser(decoded);
      } catch (error) {
        console.error('❌ Token Decode Error:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  // Axios interceptor for token refresh
  useEffect(() => {
    console.log('🔄 Setting up response interceptor');
    
    const interceptor = axios.interceptors.response.use(
      response => {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      async error => {
        console.error('❌ API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          timestamp: new Date().toISOString()
        });

        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('🔄 Attempting token refresh...');
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            console.log('Refresh Token Present:', !!refreshToken);
            
            debugApiCall('post', '/api/accounts/token/refresh/', { refresh: refreshToken });
            
            const response = await axios.post('/api/accounts/token/refresh/', {
              refresh: refreshToken
            });
            
            const newToken = response.data.access;
            console.log('🆕 New Token Received');
            
            localStorage.setItem('access_token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('❌ Token Refresh Failed:', refreshError);
            logout();
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      console.log('🧹 Cleaning up response interceptor');
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const login = async (credentials) => {
    try {
      console.log('🔐 Login Attempt:', { credentials });
      debugApiCall('post', '/api/accounts/token/', credentials);
      
      const response = await axios.post('/api/accounts/token/', credentials);
      const { access, refresh } = response.data;
      
      console.log('✅ Login Successful:', { 
        tokenReceived: !!access,
        refreshTokenReceived: !!refresh 
      });
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('❌ Login Failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      toast.error(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

const register = async (userData) => {
  try {
    // Use authAPI.register which should use the publicApi instance (without auth header)
    const response = await authAPI.register(userData);
    
    if (response.data && response.data.access) {
      // Save tokens if API returns them on registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Update auth state
      setUser(response.data.user || { 
        username: userData.username,
        email: userData.email,
        role: userData.role 
      });
      setAuthenticated(true);
      
      return true;
    }
    
    // If no tokens returned, just show success
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    
    // Show specific error messages
    if (error.response) {
      if (error.response.status === 400) {
        const errorData = error.response.data;
        // Handle specific validation errors
        if (errorData.username) {
          alert(`Username error: ${errorData.username[0]}`);
        } else if (errorData.email) {
          alert(`Email error: ${errorData.email[0]}`);
        } else if (errorData.password) {
          alert(`Password error: ${errorData.password[0]}`);
        } else {
          alert("Registration failed. Please check your details.");
        }
      } else {
        alert(`Registration failed: ${error.response.statusText}`);
      }
    } else {
      alert("Network error. Please check your connection.");
    }
    
    return false;
  }
};

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const changePassword = async (passwords) => {
    try {
      console.log('🔑 Password Change Attempt');
      debugApiCall('post', '/api/accounts/users/change-password/', passwords);
      
      await axios.post('/api/accounts/users/change-password/', passwords);
      console.log('✅ Password Change Successful');
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('❌ Password Change Failed:', {
        status: error.response?.status,
        data: error.response?.data
      });
      toast.error(error.response?.data?.detail || 'Password change failed');
      return false;
    }
  };

  const updateProfile = async (userData) => {
    try {
      console.log('📋 Profile Update Attempt:', { userData, userId: user?.user_id });
      debugApiCall('patch', `/api/accounts/users/${user.user_id}/update/`, userData);
      
      const response = await axios.patch(
        `/api/accounts/users/${user.user_id}/update/`,
        userData
      );
      
      console.log('✅ Profile Update Successful:', response.data);
      setUser(prev => ({ ...prev, ...response.data }));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Profile Update Failed:', {
        status: error.response?.status,
        data: error.response?.data
      });
      toast.error(error.response?.data?.detail || 'Update failed');
      return false;
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
    // Export debug function if needed elsewhere
    debugApiCall
  };

  console.log('🚀 Auth Provider Rendered:', { 
    user: user?.email, 
    isAuthenticated: !!token,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};