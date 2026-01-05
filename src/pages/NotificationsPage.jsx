import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import Notifications from '../components/Notifications';
import { useNotification } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead } = useNotification();

  const handleMarkAllAsRead = () => {
    markAsRead('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </motion.button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-primary-500 text-primary-600 px-1 py-4 text-sm font-medium">
            All
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
            Unread
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
            Announcements
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
            Results
          </button>
        </nav>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
        </div>
        <Notifications limit={null} showActions={true} />
      </div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Email notifications', enabled: true },
            { label: 'Push notifications', enabled: true },
            { label: 'Results announcements', enabled: true },
            { label: 'Fee reminders', enabled: false },
            { label: 'Attendance alerts', enabled: true },
          ].map((preference, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{preference.label}</span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preference.enabled ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preference.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationsPage;