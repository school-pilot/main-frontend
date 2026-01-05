import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <AlertCircle className="w-16 h-16 text-red-600" />
        </motion.div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </Link>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/students"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Students</h4>
            <p className="text-sm text-gray-600">Manage student records</p>
          </Link>
          <Link
            to="/admin/teachers"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Teachers</h4>
            <p className="text-sm text-gray-600">View teaching staff</p>
          </Link>
          <Link
            to="/admin/reports"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Reports</h4>
            <p className="text-sm text-gray-600">Analytics & insights</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;