import { motion } from 'framer-motion';
import { 
  Users, 
  UserCircle, 
  CreditCard, 
  BarChart3,
  TrendingUp,
  BookOpen,
  Clock,
  Calendar
} from 'lucide-react';
import StatCard from './analytics/StatCard';
import AttendanceChart from './analytics/AttendanceChart';
import FeesChart from './analytics/FeesChart';
import AcademicsChart from './analytics/AcademicsChart';
import { useEffect, useState } from 'react';
import { studentsAPI, teachersAPI, feesAPI, attendanceAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [studentsRes, teachersRes, invoicesRes, attendanceRes] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        feesAPI.getInvoices(),
        attendanceAPI.getSummary()
      ]);

      // Calculate total revenue from paid invoices
      const totalRevenue = invoicesRes.data.reduce((sum, invoice) => {
        if (invoice.status === 'paid') {
          return sum + invoice.amount;
        }
        return sum;
      }, 0);

      setStats({
        totalStudents: studentsRes.data.length,
        totalTeachers: teachersRes.data.length,
        totalRevenue,
        attendanceRate: attendanceRes.data.average_rate || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCircle,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      change: '+18%',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ];

  const quickActions = [
    { icon: Users, label: 'Add Student', color: 'bg-blue-100 text-blue-600', path: '/admin/students' },
    { icon: UserCircle, label: 'Add Teacher', color: 'bg-green-100 text-green-600', path: '/admin/teachers' },
    { icon: CreditCard, label: 'Create Invoice', color: 'bg-purple-100 text-purple-600', path: '/admin/fees' },
    { icon: BookOpen, label: 'Enter Results', color: 'bg-yellow-100 text-yellow-600', path: '/admin/results' },
    { icon: Clock, label: 'Timetable', color: 'bg-indigo-100 text-indigo-600', path: '/admin/timetable' },
    { icon: Calendar, label: 'Attendance', color: 'bg-pink-100 text-pink-600', path: '/admin/attendance' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold">Welcome back, Administrator!</h1>
        <p className="text-primary-100 mt-2">
          Here's what's happening with your school today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <AttendanceChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fees Collection</h3>
          <FeesChart />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.label}
              href={action.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {action.label}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Academic Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
        <AcademicsChart />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;