import { Outlet } from "react-router-dom";

const RequireAuth = () => {
  return <Outlet />; // auth gate removed
};

export default RequireAuth;
