import { motion } from 'framer-motion';
import { Home, Search, AlertCircle, Bell, Construction, Users } from 'lucide-react';
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
          className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Construction className="w-16 h-16 text-amber-600" />
        </motion.div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          System Under Construction
        </h2>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-gray-700 mb-3">
            We're building an amazing experience for you!
          </p>
          <div className="flex items-center justify-center space-x-2 text-amber-700 bg-amber-50 rounded-lg p-3">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">
              All users on the waitlist will be notified when the system is ready
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter email to join waitlist..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <button className="mt-2 w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
              Join Waitlist
            </button>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 w-full"
          >
            <Home className="w-5 h-5" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>We'll notify you as soon as we're ready!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;