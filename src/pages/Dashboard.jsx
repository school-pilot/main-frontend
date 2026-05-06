import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from '../dashboards/superAdmin/SuperAdminDashboard';
import SchoolAdminDashboard from '../dashboards/admin/SchoolAdminDashboard';
import TeacherDashboard from '../dashboards/teacher/TeacherDashboard';
import StudentDashboard from '../dashboards/student/StudentDashboard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Not logged in</h2>
        <p className="text-gray-600 mt-2">Please login to access your dashboard.</p>
      </div>
    );
  }

  // Debug logging
  console.log('Dashboard - User:', user);
  console.log('Dashboard - User role:', user.role);

  const renderDashboard = () => {
    if (!user.role) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to SchoolPilot</h2>
          <p className="text-gray-600 mt-2">
            Your account role is not set. Please contact your administrator.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-left">
            <p className="text-sm text-gray-700">
              User Information:
            </p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    const userRole = user.role.toLowerCase();
    
    switch (userRole) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      
      case 'school_admin':
      case 'admin':
        return <SchoolAdminDashboard />;
      
      case 'teacher':
        return <TeacherDashboard />;
      
      case 'student':
        return <StudentDashboard />;
      
      case 'parent':
        return <StudentDashboard />; // Reusing student dashboard for parents
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to SchoolPilot</h2>
            <p className="text-gray-600 mt-2">
              Role "{userRole}" not recognized. Please contact your administrator.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {renderDashboard()}
    </motion.div>
  );
};

export default Dashboard;