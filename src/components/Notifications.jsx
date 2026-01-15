import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  School,
  FileText,
  Calendar,
  Megaphone,
  CheckCircle,
  Trash2,
  MailCheck,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { communicationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Notifications = ({ limit = null, showActions = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await communicationsAPI.getNotifications();
      // Transform API data to match expected format
      const transformedNotifications = (response.data || []).map(notification => ({
        id: notification.id,
        message: notification.message || notification.title || '',
        type: notification.type || 'info',
        read: !notification.unread,
        created_at: notification.timestamp || new Date().toISOString(),
        title: notification.title || '',
        unread: notification.unread || false
      }));
      setNotifications(transformedNotifications);
    } catch (error) {
      toast.error('Failed to fetch notifications');
      // Fallback mock data for development
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => {
    const now = new Date();
    return [
      {
        id: 1,
        title: 'New Assignment Posted',
        message: 'Mathematics assignment for Chapter 3 has been posted',
        type: 'assignment',
        read: false,
        unread: true,
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Exam Schedule',
        message: 'Mid-term exams will begin next week',
        type: 'academic',
        read: true,
        unread: false,
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Sports Day',
        message: 'Annual sports day scheduled for Friday',
        type: 'event',
        read: false,
        unread: true,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        title: 'School Announcement',
        message: 'Parent-teacher meeting on Saturday',
        type: 'announcement',
        read: true,
        unread: false,
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        title: 'Fee Payment Reminder',
        message: 'Last date for fee payment is approaching',
        type: 'academic',
        read: false,
        unread: true,
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await communicationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, unread: false } : n
      ));
      toast.success('Marked as read');
    } catch (error) {
      console.error('Mark as read failed:', error);
      // Update local state even if API fails (for demo)
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, unread: false } : n
      ));
      toast.success('Marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => communicationsAPI.markAsRead(n.id)));
      
      setNotifications(notifications.map(n => ({ ...n, read: true, unread: false })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Mark all as read failed:', error);
      // Update local state even if API fails (for demo)
      setNotifications(notifications.map(n => ({ ...n, read: true, unread: false })));
      toast.success('All notifications marked as read');
    }
  };

  const handleDelete = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'academic':
        return <School className="w-5 h-5 text-blue-500" />;
      case 'assignment':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeColor = (type) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 0, label: 'All', filter: () => true },
    { id: 1, label: 'Unread', filter: (n) => !n.read },
    { id: 2, label: 'Academic', filter: (n) => n.type === 'academic' },
    { id: 3, label: 'Events', filter: (n) => n.type === 'event' },
    { id: 4, label: 'Announcements', filter: (n) => n.type === 'announcement' },
  ];

  const filteredNotifications = notifications.filter(tabs[activeTab].filter);
  const displayedNotifications = limit ? filteredNotifications.slice(0, limit) : filteredNotifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with school activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MailCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
          <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            {unreadCount} unread
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
            <p className="text-sm text-gray-400 mt-2">
              {activeTab === 1 ? 'No unread notifications' : 'No notifications in this category'}
            </p>
          </div>
        ) : (
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
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {notification.title && (
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                        )}
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
                              New
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getNotificationBadgeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center space-x-1 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Notifications are automatically deleted after 30 days
        </p>
        {limit && filteredNotifications.length > limit && (
          <p className="text-sm text-primary-600 mt-2">
            Showing {limit} of {filteredNotifications.length} notifications
          </p>
        )}
      </div>

      {/* Quick Filter Actions */}
      {displayedNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
            </div>
            <div className="flex space-x-2">
              {tabs.slice(1).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;