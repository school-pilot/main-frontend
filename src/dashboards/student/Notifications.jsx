// import { motion } from 'framer-motion';
// import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import { useNotification } from '../context/NotificationContext';

// const Notifications = ({ limit = null, showActions = true }) => {
//   const { notifications, markAsRead } = useNotification();

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'success':
//         return <Check className="w-5 h-5 text-green-500" />;
//       case 'error':
//         return <X className="w-5 h-5 text-red-500" />;
//       case 'warning':
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />;
//       default:
//         return <Info className="w-5 h-5 text-blue-500" />;
//     }
//   };

//   const displayedNotifications = limit ? notifications.slice(0, limit) : notifications;

//   if (notifications.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//         <p className="text-gray-500">No notifications yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {displayedNotifications.map((notification, index) => (
//         <motion.div
//           key={notification.id}
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.05 }}
//           className={`p-4 rounded-lg border ${
//             notification.read
//               ? 'bg-white border-gray-200'
//               : 'bg-blue-50 border-blue-200'
//           }`}
//         >
//           <div className="flex items-start justify-between">
//             <div className="flex items-start space-x-3">
//               <div className="mt-1">
//                 {getNotificationIcon(notification.type)}
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-900">{notification.message}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {formatDistanceToNow(new Date(notification.created_at), {
//                     addSuffix: true,
//                   })}
//                 </p>
//               </div>
//             </div>
//             {showActions && !notification.read && (
//               <button
//                 onClick={() => markAsRead(notification.id)}
//                 className="text-xs text-primary-600 hover:text-primary-700"
//               >
//                 Mark as read
//               </button>
//             )}
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default Notifications;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Announcement as AnnouncementIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { communicationsAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await communicationsAPI.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await communicationsAPI.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, unread: false } : n
      ));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'academic': return <SchoolIcon />;
      case 'assignment': return <AssignmentIcon />;
      case 'event': return <EventIcon />;
      case 'announcement': return <AnnouncementIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'academic': return '#1976d2';
      case 'assignment': return '#2e7d32';
      case 'event': return '#ed6c02';
      case 'announcement': return '#9c27b0';
      default: return '#757575';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return n.unread; // Unread
    if (activeTab === 2) return n.type === 'academic'; // Academic
    if (activeTab === 3) return n.type === 'event'; // Events
    return true;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Notifications</Typography>
        <Box>
          <Button
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
            sx={{ mr: 2 }}
          >
            Mark All as Read
          </Button>
          <Chip
            label={`${notifications.filter(n => n.unread).length} unread`}
            color="primary"
          />
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="Unread" />
          <Tab label="Academic" />
          <Tab label="Events" />
          <Tab label="Announcements" />
        </Tabs>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography align="center" py={4}>Loading notifications...</Typography>
        ) : filteredNotifications.length === 0 ? (
          <Box textAlign="center" py={4}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography color="textSecondary">
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.unread ? 'action.hover' : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                  }}
                  secondaryAction={
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                          {notification.title}
                        </Typography>
                        {notification.unread && (
                          <Chip label="New" color="primary" size="small" />
                        )}
                        <Chip
                          label={notification.type}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Notifications are automatically deleted after 30 days
        </Typography>
      </Box>
    </Box>
  );
};

export default Notifications;