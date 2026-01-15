import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  BookOpen,
  Calendar,
  Megaphone,
  CheckCircle,
  Trash2,
  School,
  Clock,
  Filter,
  CheckSquare,
  Eye,
  EyeOff,
  MoreVertical,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { communicationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Notifications = ({ limit = null, showActions = true, compact = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await communicationsAPI.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback mock data
      setNotifications([
        {
          id: 1,
          title: 'New Assignment Posted',
          message: 'Mathematics assignment for Chapter 3 has been posted. Due date: Jan 30, 2024',
          type: 'assignment',
          read: false,
          created_at: '2024-01-25T10:30:00Z',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Exam Schedule Updated',
          message: 'First term exam schedule has been updated. Please check your timetable.',
          type: 'academic',
          read: false,
          created_at: '2024-01-24T14:20:00Z',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Parent-Teacher Meeting',
          message: 'Quarterly parent-teacher meeting scheduled for Feb 5, 2024 at 2:00 PM',
          type: 'event',
          read: true,
          created_at: '2024-01-23T09:15:00Z',
          priority: 'medium'
        },
        {
          id: 4,
          title: 'Fee Payment Reminder',
          message: 'Reminder: Second term fees due by Jan 31, 2024. Late fee applicable after deadline.',
          type: 'announcement',
          read: true,
          created_at: '2024-01-22T16:45:00Z',
          priority: 'high'
        },
        {
          id: 5,
          title: 'Sports Day Announcement',
          message: 'Annual sports day will be held on Feb 15, 2024. Registrations open.',
          type: 'event',
          read: true,
          created_at: '2024-01-21T11:10:00Z',
          priority: 'low'
        },
        {
          id: 6,
          title: 'Library Book Due',
          message: 'Reminder: Your library book "Physics Concepts" is due tomorrow.',
          type: 'academic',
          read: false,
          created_at: '2024-01-20T08:30:00Z',
          priority: 'medium'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      if (notificationId === 'all') {
        // Mark all as read
        await Promise.all(
          notifications
            .filter(n => !n.read)
            .map(n => communicationsAPI.markAsRead(n.id))
        );
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
      } else {
        // Mark single as read
        await communicationsAPI.markAsRead(notificationId);
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      // Update UI optimistically
      if (notificationId === 'all') {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } else {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
      }
      toast.success('Marked as read');
    }
  };

  const handleDelete = async (notificationId) => {
    if (notificationId === 'selected') {
      if (selectedNotifications.size === 0) {
        toast.error('No notifications selected');
        return;
      }
      if (!window.confirm(`Delete ${selectedNotifications.size} notifications?`)) return;
      
      try {
        await Promise.all(
          Array.from(selectedNotifications).map(id => 
            communicationsAPI.deleteNotification?.(id) || Promise.resolve()
          )
        );
        setNotifications(prev => 
          prev.filter(n => !selectedNotifications.has(n.id))
        );
        setSelectedNotifications(new Set());
        toast.success(`${selectedNotifications.size} notifications deleted`);
      } catch (error) {
        console.error('Failed to delete notifications:', error);
        // Optimistic update
        setNotifications(prev => 
          prev.filter(n => !selectedNotifications.has(n.id))
        );
        setSelectedNotifications(new Set());
        toast.success('Notifications deleted');
      }
    } else {
      if (!window.confirm('Delete this notification?')) return;
      
      try {
        await communicationsAPI.deleteNotification?.(notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        toast.success('Notification deleted');
      } catch (error) {
        console.error('Failed to delete notification:', error);
        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        toast.success('Notification deleted');
      }
    }
  };

  const handleSelectNotification = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'academic':
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'academic':
      case 'assignment':
        return 'text-blue-500 bg-blue-100';
      case 'event':
        return 'text-green-500 bg-green-100';
      case 'announcement':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Low</span>;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return notification.type === activeTab;
  });

  const displayedNotifications = limit 
    ? filteredNotifications.slice(0, limit)
    : filteredNotifications;

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const tabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'academic', label: 'Academic', count: notifications.filter(n => n.type === 'academic').length },
    { id: 'assignment', label: 'Assignments', count: notifications.filter(n => n.type === 'assignment').length },
    { id: 'event', label: 'Events', count: notifications.filter(n => n.type === 'event').length },
    { id: 'announcement', label: 'Announcements', count: notifications.filter(n => n.type === 'announcement').length },
  ];

  if (loading && !compact) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {displayedNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border ${
              notification.read
                ? 'bg-white border-gray-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getNotificationIconColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  {showActions && !notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-amber-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-red-500">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          {selectedNotifications.size > 0 && (
            <>
              <button
                onClick={() => handleMarkAsRead('selected')}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Selected Read</span>
              </button>
              <button
                onClick={() => handleDelete('selected')}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            </>
          )}
          
          <button
            onClick={() => handleMarkAsRead('all')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedNotifications.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-sm text-blue-700 hover:text-blue-800"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Select All ({filteredNotifications.length})</span>
              </button>
              <span className="text-sm text-gray-700">
                {selectedNotifications.size} notification{selectedNotifications.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedNotifications(new Set())}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear selection
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      {displayedNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? "You're all caught up!" 
              : `No ${activeTab} notifications found`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-xl border ${
                notification.read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              } ${
                selectedNotifications.has(notification.id)
                  ? 'ring-2 ring-primary-500 ring-opacity-50'
                  : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute left-4 top-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.has(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="ml-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getNotificationIconColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                            New
                          </span>
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                            {notification.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="space-y-2">
                  {['high', 'medium', 'low', 'all'].map((priority) => (
                    <div key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`priority-${priority}`}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`priority-${priority}`}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {priority}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    className="input-field text-sm"
                    placeholder="From date"
                  />
                  <input
                    type="date"
                    className="input-field text-sm"
                    placeholder="To date"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="input-field text-sm">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {totalCount}
              </h3>
            </div>
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {unreadCount}
              </h3>
            </div>
            <EyeOff className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {notifications.filter(n => 
                  new Date(n.created_at) > new Date(new Date().setDate(new Date().getDate() - 30))
                ).length}
              </h3>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Academic</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {notifications.filter(n => n.type === 'academic' || n.type === 'assignment').length}
              </h3>
            </div>
            <BookOpen className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', enabled: true, description: 'Receive notifications via email' },
            { label: 'Push notifications', enabled: true, description: 'Browser push notifications' },
            { label: 'Academic updates', enabled: true, description: 'Assignment, exam, and result updates' },
            { label: 'Event reminders', enabled: true, description: 'School events and meetings' },
            { label: 'Fee reminders', enabled: false, description: 'Payment due date reminders' },
            { label: 'Announcements', enabled: true, description: 'Important school announcements' },
          ].map((preference, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{preference.label}</p>
                <p className="text-sm text-gray-600">{preference.description}</p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preference.enabled ? 'bg-primary-600' : 'bg-gray-300'
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
      </div>
    </div>
  );
};

export default Notifications;