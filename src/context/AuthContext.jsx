import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
    role: "super_admin" // or any role to access all
  });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  /* =========================================
     INITIAL AUTH CHECK - REMOVED
  ========================================= */

  // Auth removed, always authenticated

  /* =========================================
     LOGIN - DISABLED
  ========================================= */

  const login = async (credentials) => {
    // Auth removed
    return true;
  };

  /* =========================================
     REGISTER - DISABLED
  ========================================= */

  const register = async (data) => {
    // Auth removed
    return true;
  };

  /* =========================================
     LOGOUT - DISABLED
  ========================================= */

  const logout = () => {
    // Auth removed
  };

  /* =========================================
     UPDATE PROFILE - DISABLED
  ========================================= */

  const updateProfile = async (data) => {
    // Auth removed
    return true;
  };

  /* =========================================
     CHANGE PASSWORD - DISABLED
  ========================================= */

  const changePassword = async (data) => {
    // Auth removed
    return true;
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