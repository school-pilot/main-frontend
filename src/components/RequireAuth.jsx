import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const RequireAuth = () => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // auth gate only
};

export default RequireAuth;
