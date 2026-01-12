import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../dashboards/admin/AdminDashboard';
import TeacherDashboard from '../dashboards/teacher/TeacherDashboard';
import StudentDashboard from '../dashboards/student/StudentDashboard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  const renderDashboard = () => {
    if (user?.role === 'super_admin') {
  return <SuperAdminDashboard />;
}

if (['school_admin', 'admin'].includes(user?.role)) {
  return <AdminDashboard />;
}
    
    if (user?.role === 'teacher') {
      return <TeacherDashboard />;
    }
    
    if (user?.role === 'student') {
      return <StudentDashboard />;
    }
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to SchoolPilot</h2>
        <p className="text-gray-600 mt-2">Please contact your administrator for access.</p>
      </div>
    );
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


