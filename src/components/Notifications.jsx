import { motion } from 'framer-motion';
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '../context/NotificationContext';

const Notifications = ({ limit = null, showActions = true }) => {
  const { notifications, markAsRead } = useNotification();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const displayedNotifications = limit ? notifications.slice(0, limit) : notifications;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayedNotifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-4 rounded-lg border ${
            notification.read
              ? 'bg-white border-gray-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {showActions && !notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Mark as read
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Notifications;