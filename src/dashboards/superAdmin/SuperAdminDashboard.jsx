import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  School,
  Users,
  CheckCircle,
  Clock,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { schoolsAPI, authAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader.jsx';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    pendingSchools: 0,
    totalUsers: 0,
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all schools by making multiple requests (since we don't have getAllSchools endpoint)
      // We'll create a helper to fetch schools based on known IDs or implement a different approach
      const schoolsData = await fetchAllSchools();
      
      // Get all users
      const usersResponse = await authAPI.getUsers();
      const usersData = usersResponse.data || [];
      
      setStats({
        totalSchools: schoolsData.length,
        activeSchools: schoolsData.filter(s => s.is_active).length,
        pendingSchools: schoolsData.filter(s => !s.is_active).length,
        totalUsers: usersData.length,
      });
      
      setSchools(schoolsData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fetch all schools (since we don't have a getAll endpoint)
  const fetchAllSchools = async () => {
    try {
      // In a real application, you might have a list of school IDs stored somewhere
      // For now, we'll create a mock array of schools to demonstrate
      // You should replace this with actual API calls when available
      const mockSchools = [
        {
          id: 1,
          name: 'Greenwood High School',
          email: 'admin@greenwood.edu',
          address: '123 Education St, Cityville',
          is_active: true,
          created_at: '2024-01-15',
        },
        {
          id: 2,
          name: 'Riverside Academy',
          email: 'contact@riverside.edu',
          address: '456 Learning Ave, Townsville',
          is_active: false,
          created_at: '2024-02-20',
        },
        {
          id: 3,
          name: 'Sunshine International',
          email: 'info@sunshine.edu',
          address: '789 Knowledge Rd, Metrocity',
          is_active: true,
          created_at: '2024-01-10',
        },
      ];
      
      // If you have actual school IDs, you can fetch them like this:
      // const schoolIds = [1, 2, 3]; // This should come from your application state
      // const schoolsPromises = schoolIds.map(id => schoolsAPI.get(id));
      // const schoolsResponses = await Promise.all(schoolsPromises);
      // return schoolsResponses.map(res => res.data);
      
      return mockSchools;
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  };

  const handleActivateSchool = async (schoolId) => {
    try {
      await schoolsAPI.update(schoolId, { is_active: true });
      toast.success('School activated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to activate school');
    }
  };

  const handleDeactivateSchool = async (schoolId) => {
    try {
      await schoolsAPI.update(schoolId, { is_active: false });
      toast.success('School deactivated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to deactivate school');
    }
  };

  const statCards = [
    {
      title: 'Total Schools',
      value: stats.totalSchools,
      icon: School,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+2',
      icon_c: "text-blue-600"
    },
    {
      title: 'Active Schools',
      value: stats.activeSchools,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+1',
      icon_c: "text-green-600"
    },
    {
      title: 'Pending Schools',
      value: stats.pendingSchools,
      icon: Clock,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+1',
       icon_c: "text-orange-600"
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+15',
       icon_c: "text-purple-600"
    },
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage schools and system-wide operations</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create School</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`${card.color} rounded-xl p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                {card.change && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm ml-1 opacity-90">{card.change}</span>
                    <span className="text-xs opacity-75 ml-1">this month</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <card.icon className={`w-6 h-6 ${card.icon_c}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schools Management */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Schools Management</h2>
              <p className="text-gray-600">Manage school accounts and status</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school, index) => (
                <motion.tr
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <School className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {school.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      school.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {school.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(school.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleActivateSchool(school.id)}
                        disabled={school.is_active}
                        className={`p-2 rounded-lg ${
                          school.is_active
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title="Activate School"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivateSchool(school.id)}
                        disabled={!school.is_active}
                        className={`p-2 rounded-lg ${
                          !school.is_active
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title="Deactivate School"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === school.id ? null : school.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        
                        {showActions === school.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit School
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {schools.length === 0 && (
          <div className="text-center py-12">
            <School className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No schools found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first school to get started</p>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            {
              id: 1,
              school: 'Greenwood High School',
              action: 'School activated',
              time: '2 hours ago',
              icon: CheckCircle,
              color: 'text-green-500',
            },
            {
              id: 2,
              school: 'Riverside Academy',
              action: 'New user registered',
              time: '1 day ago',
              icon: Users,
              color: 'text-blue-500',
            },
            {
              id: 3,
              school: 'Sunshine International',
              action: 'Subscription renewed',
              time: '2 days ago',
              icon: TrendingUp,
              color: 'text-purple-500',
            },
          ].map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-opacity-20 rounded-lg flex items-center justify-center ${activity.color.replace('text-', 'bg-')}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{activity.school}</h4>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Average Users per School</p>
              <h4 className="text-2xl font-bold text-blue-900 mt-2">42</h4>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active Subscriptions</p>
              <h4 className="text-2xl font-bold text-green-900 mt-2">2/3</h4>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Pending Actions</p>
              <h4 className="text-2xl font-bold text-orange-900 mt-2">3</h4>
            </div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboard;