import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role?.toLowerCase();
    const hasRole = allowedRoles.some(role => 
      role.toLowerCase() === userRole
    );
    
    if (!hasRole) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'super_admin':
          return <Navigate to="/super-admin" />;
        case 'school_admin':
          return <Navigate to="/school-admin" />;
        case 'teacher':
          return <Navigate to="/teacher" />;
        case 'student':
          return <Navigate to="/student" />;
        case 'parent':
          return <Navigate to="/parent" />;
        default:
          return <Navigate to="/" />;
      }
    }
  }

  return children;
};

export default PrivateRoute;