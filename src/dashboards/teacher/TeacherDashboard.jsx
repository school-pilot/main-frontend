// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import {
//   Clock,
//   Users,
//   BookOpen,
//   Calendar,
//   Bell,
//   TrendingUp,
//   FileText,
//   CheckCircle,
// } from 'lucide-react';
// import { teachersAPI, attendanceAPI, resultsAPI } from '../../services/api';
// import Loader from '../../components/Loader';

// const TeacherDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [teacherData, setTeacherData] = useState({});
//   const [upcomingClasses, setUpcomingClasses] = useState([]);
//   const [recentAttendance, setRecentAttendance] = useState({});
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     classesAssigned: 0,
//     attendanceRate: 0,
//     averageScore: 0,
//   });

//   useEffect(() => {
//     fetchTeacherData();
//   }, []);

//   const fetchTeacherData = async () => {
//     try {
//       setLoading(true);
//       const [classesRes, attendanceRes] = await Promise.all([
//         teachersAPI.getClasses(1), // Assuming teacher ID is 1
//         attendanceAPI.getSummary(),
//       ]);

//       // Mock data for demonstration
//       setTeacherData({
//         name: 'John Smith',
//         subjects: ['Mathematics', 'Physics'],
//         department: 'Science',
//       });

//       setUpcomingClasses([
//         { time: '08:00 AM', class: 'Grade 10A', subject: 'Mathematics', room: 'Room 101' },
//         { time: '10:00 AM', class: 'Grade 11B', subject: 'Physics', room: 'Lab 2' },
//         { time: '01:00 PM', class: 'Grade 9C', subject: 'Mathematics', room: 'Room 102' },
//       ]);

//       setRecentAttendance({
//         present: 45,
//         absent: 5,
//         late: 2,
//       });

//       setStats({
//         totalStudents: 152,
//         classesAssigned: 6,
//         attendanceRate: 92,
//         averageScore: 85,
//       });
//     } catch (error) {
//       console.error('Failed to fetch teacher data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Loader fullScreen />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">Good morning, {teacherData.name}!</h1>
//             <p className="text-primary-100 mt-2">
//               {teacherData.subjects?.join(', ')} • {teacherData.department}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-primary-100">Today</p>
//             <p className="text-xl font-bold">
//               {new Date().toLocaleDateString('en-US', {
//                 weekday: 'long',
//                 month: 'long',
//                 day: 'numeric',
//               })}
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           {
//             title: 'Total Students',
//             value: stats.totalStudents,
//             icon: Users,
//             color: 'bg-blue-500',
//             change: '+5',
//           },
//           {
//             title: 'Classes Assigned',
//             value: stats.classesAssigned,
//             icon: BookOpen,
//             color: 'bg-green-500',
//             change: '+2',
//           },
//           {
//             title: 'Attendance Rate',
//             value: `${stats.attendanceRate}%`,
//             icon: TrendingUp,
//             color: 'bg-orange-500',
//             change: '+3%',
//           },
//           {
//             title: 'Average Score',
//             value: `${stats.averageScore}%`,
//             icon: FileText,
//             color: 'bg-purple-500',
//             change: '+2%',
//           },
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             whileHover={{ y: -5 }}
//             className="bg-white rounded-xl shadow-sm p-6"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">{stat.title}</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
//                 {stat.change && (
//                   <div className="flex items-center mt-2">
//                     <span className="text-sm text-green-600 font-medium">
//                       {stat.change}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-1">this month</span>
//                   </div>
//                 )}
//               </div>
//               <div className={`p-3 rounded-lg ${stat.color}`}>
//                 <stat.icon className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Upcoming Classes & Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Upcoming Classes */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
//             <button className="text-sm text-primary-600 hover:text-primary-700">
//               View Full Timetable →
//             </button>
//           </div>

//           <div className="space-y-4">
//             {upcomingClasses.map((classItem, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-primary-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
//                     <p className="text-sm text-gray-600">{classItem.class}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-gray-900">{classItem.time}</p>
//                   <p className="text-sm text-gray-600">{classItem.room}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
//           <div className="space-y-3">
//             <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
//               <div className="flex items-center">
//                 <Users className="w-5 h-5 mr-3" />
//                 <span>Take Attendance</span>
//               </div>
//               <Bell className="w-4 h-4" />
//             </button>
//             <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
//               <div className="flex items-center">
//                 <FileText className="w-5 h-5 mr-3" />
//                 <span>Enter Scores</span>
//               </div>
//               <TrendingUp className="w-4 h-4" />
//             </button>
//             <button className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
//               <div className="flex items-center">
//                 <Calendar className="w-5 h-5 mr-3" />
//                 <span>View Calendar</span>
//               </div>
//               <CheckCircle className="w-4 h-4" />
//             </button>
//             <button className="w-full flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
//               <div className="flex items-center">
//                 <BookOpen className="w-5 h-5 mr-3" />
//                 <span>Upload Materials</span>
//               </div>
//               <BookOpen className="w-4 h-4" />
//             </button>
//           </div>
//         </motion.div>
//       </div>

//       {/* Recent Attendance */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm p-6"
//       >
//         <h2 className="text-lg font-semibold text-gray-900 mb-6">
//           Recent Attendance
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-green-50 p-4 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-600">Present</p>
//                 <p className="text-2xl font-bold text-green-900">
//                   {recentAttendance.present}
//                 </p>
//               </div>
//               <CheckCircle className="w-10 h-10 text-green-500" />
//             </div>
//             <div className="mt-2">
//               <div className="h-2 bg-green-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-green-500"
//                   style={{
//                     width: `${(recentAttendance.present / (recentAttendance.present + recentAttendance.absent + recentAttendance.late)) * 100}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-red-50 p-4 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-red-600">Absent</p>
//                 <p className="text-2xl font-bold text-red-900">
//                   {recentAttendance.absent}
//                 </p>
//               </div>
//               <Users className="w-10 h-10 text-red-500" />
//             </div>
//             <div className="mt-2">
//               <div className="h-2 bg-red-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-red-500"
//                   style={{
//                     width: `${(recentAttendance.absent / (recentAttendance.present + recentAttendance.absent + recentAttendance.late)) * 100}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-yellow-50 p-4 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-yellow-600">Late</p>
//                 <p className="text-2xl font-bold text-yellow-900">
//                   {recentAttendance.late}
//                 </p>
//               </div>
//               <Clock className="w-10 h-10 text-yellow-500" />
//             </div>
//             <div className="mt-2">
//               <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-yellow-500"
//                   style={{
//                     width: `${(recentAttendance.late / (recentAttendance.present + recentAttendance.absent + recentAttendance.late)) * 100}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default TeacherDashboard;


import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { teachersAPI, attendanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    pendingAttendance: 0,
    pendingScores: 0,
  });
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const teacherId = user.id;
      
      const [classesResponse, attendanceResponse] = await Promise.all([
        teachersAPI.getTeacherClasses(teacherId),
        attendanceAPI.getAttendance({ teacher_id: teacherId, date: new Date().toISOString().split('T')[0] }),
      ]);
      
      const classes = classesResponse.data || [];
      const todaysAttendance = attendanceResponse.data || [];
      
      setStats({
        totalStudents: classes.reduce((acc, cls) => acc + (cls.student_count || 0), 0),
        totalClasses: classes.length,
        pendingAttendance: todaysAttendance.filter(a => !a.marked).length,
        pendingScores: 5, // This would come from results API
      });
      
      setTodaysClasses(classes.slice(0, 3));
      
      // Mock notifications
      setNotifications([
        { id: 1, message: 'Staff meeting tomorrow at 10 AM', time: '2 hours ago', type: 'meeting' },
        { id: 2, message: 'Exam papers due for submission', time: '1 day ago', type: 'assignment' },
        { id: 3, message: 'Parent-teacher meeting scheduled', time: '2 days ago', type: 'meeting' },
      ]);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <PeopleIcon />,
      color: '#1976d2',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: <BookIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Pending Attendance',
      value: stats.pendingAttendance,
      icon: <AssignmentIcon />,
      color: '#ed6c02',
      action: '/teacher/mark-attendance',
    },
    {
      title: 'Pending Scores',
      value: stats.pendingScores,
      icon: <TrendingUpIcon />,
      color: '#9c27b0',
      action: '/teacher/enter-scores',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color, fontSize: 40 }}>
                    {card.icon}
                  </Box>
                </Box>
                {card.action && (
                  <Button
                    size="small"
                    href={card.action}
                    sx={{ mt: 1 }}
                  >
                    Take Action
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Classes
            </Typography>
            
            <List>
              {todaysClasses.map((cls, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      href={`/teacher/mark-attendance?class=${cls.id}`}
                    >
                      Mark Attendance
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <BookIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={cls.name}
                    secondary={`Time: ${cls.time || '10:00 AM'} | Students: ${cls.student_count || 0}`}
                  />
                </ListItem>
              ))}
              
              {todaysClasses.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No classes scheduled for today"
                    secondary="Enjoy your day off!"
                  />
                </ListItem>
              )}
            </List>
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<CalendarIcon />}
                href="/teacher/timetable"
              >
                View Full Timetable
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Notifications</Typography>
              <Chip
                label={`${notifications.length} new`}
                color="primary"
                size="small"
              />
            </Box>
            
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    borderLeft: '4px solid',
                    borderColor: notification.type === 'meeting' ? '#1976d2' : '#2e7d32',
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              href="/teacher/notifications"
            >
              View All Notifications
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;