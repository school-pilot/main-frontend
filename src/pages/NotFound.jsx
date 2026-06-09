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