import { Outlet } from "react-router-dom";

const RequireRole = ({ allowedRoles }) => {
  return <Outlet />; // role check removed
};

export default RequireRole;
