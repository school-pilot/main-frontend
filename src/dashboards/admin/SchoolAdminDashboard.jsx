// import { motion } from 'framer-motion';
// import { 
//   Users, 
//   UserCircle, 
//   CreditCard, 
//   BarChart3,
//   TrendingUp,
//   BookOpen,
//   Clock,
//   Calendar,
//   School,
//   Book
// } from 'lucide-react';
// import StatCard from './analytics/StatCard';
// import AttendanceChart from './analytics/AttendanceChart';
// import FeesChart from './analytics/FeesChart';
// import AcademicsChart from './analytics/AcademicsChart';
// import { useEffect, useState } from 'react';
// import { studentsAPI, teachersAPI, feesAPI, attendanceAPI, schoolsAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     totalTeachers: 0,
//     totalRevenue: 0,
//     attendanceRate: 0,
//     totalClasses: 10, // Default value
//     totalSubjects: 15, // Default value
//   });
//   const [recentStudents, setRecentStudents] = useState([]);
//   const [recentTeachers, setRecentTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch all data in parallel
//       const [studentsRes, teachersRes, invoicesRes, attendanceRes] = await Promise.all([
//         studentsAPI.getAll(),
//         teachersAPI.getAll(),
//         feesAPI.getInvoices(),
//         attendanceAPI.getSummary()
//       ]);

//       // Calculate total revenue from paid invoices
//       const totalRevenue = invoicesRes.data.reduce((sum, invoice) => {
//         if (invoice.status === 'paid') {
//           return sum + invoice.amount;
//         }
//         return sum;
//       }, 0);

//       const students = studentsRes.data || [];
//       const teachers = teachersRes.data || [];

//       setStats({
//         totalStudents: students.length,
//         totalTeachers: teachers.length,
//         totalRevenue,
//         attendanceRate: attendanceRes.data.average_rate || 0,
//         totalClasses: 10, // You would fetch this from classes API
//         totalSubjects: 15, // You would fetch this from subjects API
//       });
      
//       setRecentStudents(students.slice(0, 5));
//       setRecentTeachers(teachers.slice(0, 5));
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//       toast.error('Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: 'Total Students',
//       value: stats.totalStudents,
//       icon: Users,
//       color: 'bg-blue-500',
//       change: '+12%',
//       action: '/admin/students',
//       actionLabel: 'View Students'
//     },
//     {
//       title: 'Total Teachers',
//       value: stats.totalTeachers,
//       icon: UserCircle,
//       color: 'bg-green-500',
//       change: '+5%',
//       action: '/admin/teachers',
//       actionLabel: 'View Teachers'
//     },
//     {
//       title: 'Total Revenue',
//       value: `$${stats.totalRevenue.toLocaleString()}`,
//       icon: CreditCard,
//       color: 'bg-purple-500',
//       change: '+18%',
//       action: '/admin/fees',
//       actionLabel: 'View Fees'
//     },
//     {
//       title: 'Attendance Rate',
//       value: `${stats.attendanceRate}%`,
//       icon: TrendingUp,
//       color: 'bg-orange-500',
//       change: '+3%',
//       action: '/admin/attendance',
//       actionLabel: 'View Attendance'
//     },
//     {
//       title: 'Total Classes',
//       value: stats.totalClasses,
//       icon: School,
//       color: 'bg-red-500',
//       change: '+2%',
//       action: '/admin/classes',
//       actionLabel: 'View Classes'
//     },
//     {
//       title: 'Total Subjects',
//       value: stats.totalSubjects,
//       icon: Book,
//       color: 'bg-indigo-500',
//       change: '+4%',
//       action: '/admin/subjects',
//       actionLabel: 'View Subjects'
//     },
//   ];

//   const quickActions = [
//     { icon: Users, label: 'Add Student', color: 'bg-blue-100 text-blue-600', path: '/admin/students/create' },
//     { icon: UserCircle, label: 'Add Teacher', color: 'bg-green-100 text-green-600', path: '/admin/teachers/create' },
//     { icon: CreditCard, label: 'Create Invoice', color: 'bg-purple-100 text-purple-600', path: '/admin/fees/create' },
//     { icon: BookOpen, label: 'Enter Results', color: 'bg-yellow-100 text-yellow-600', path: '/admin/results' },
//     { icon: Clock, label: 'Timetable', color: 'bg-indigo-100 text-indigo-600', path: '/admin/timetable' },
//     { icon: Calendar, label: 'Attendance', color: 'bg-pink-100 text-pink-600', path: '/admin/attendance' },
//     { icon: School, label: 'Add Class', color: 'bg-red-100 text-red-600', path: '/admin/classes/create' },
//     { icon: Book, label: 'Add Subject', color: 'bg-indigo-100 text-indigo-600', path: '/admin/subjects/create' },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with Account Status */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
//       >
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Administrator'}!</h1>
//             <p className="text-primary-100 mt-2">
//               Here's what's happening with your school today.
//             </p>
//           </div>
//           {user && !user.is_active && (
//             <div className="bg-amber-500 text-white px-4 py-2 rounded-lg">
//               <span className="font-medium">⚠️ Account Inactive</span>
//               <p className="text-sm mt-1">Some actions are disabled</p>
//             </div>
//           )}
//         </div>
//       </motion.div>

//       {/* Stats Grid - Now 6 cards in 3 columns on large screens */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {statCards.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <StatCard 
//               {...stat}
//               disabledAction={user && !user.is_active}
//             />
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts and Recent Data */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Charts */}
//         <div className="space-y-6">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="card"
//           >
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
//             <AttendanceChart />
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="card"
//           >
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Fees Collection</h3>
//             <FeesChart />
//           </motion.div>
//         </div>

//         {/* Recent Data Section */}
//         <div className="space-y-6">
//           {/* Recent Students */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="card"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
//               <a 
//                 href="/admin/students" 
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 View All →
//               </a>
//             </div>
            
//             <div className="space-y-3">
//               {recentStudents.map((student, index) => (
//                 <motion.div
//                   key={student.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <span className="text-blue-600 font-semibold">
//                         {student.first_name?.[0] || 'S'}
//                       </span>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         {student.first_name} {student.last_name}
//                       </h4>
//                       <p className="text-sm text-gray-500">
//                         {student.class || 'Class not assigned'}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     student.is_active 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {student.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Recent Teachers */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="card"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Teachers</h3>
//               <a 
//                 href="/admin/teachers" 
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 View All →
//               </a>
//             </div>
            
//             <div className="space-y-3">
//               {recentTeachers.map((teacher, index) => (
//                 <motion.div
//                   key={teacher.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <span className="text-green-600 font-semibold">
//                         {teacher.first_name?.[0] || 'T'}
//                       </span>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         {teacher.first_name} {teacher.last_name}
//                       </h4>
//                       <p className="text-sm text-gray-500 truncate max-w-[200px]">
//                         {teacher.subjects?.slice(0, 2).join(', ') || 'No subjects assigned'}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     teacher.is_active 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {teacher.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="card"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
//           {user && !user.is_active && (
//             <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
//               Some actions disabled due to inactive account
//             </span>
//           )}
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//           {quickActions.map((action, index) => (
//             <motion.a
//               key={action.label}
//               href={action.path}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: index * 0.05 }}
//               whileHover={{ scale: 1.05 }}
//               className={`flex flex-col items-center justify-center p-4 rounded-xl hover:shadow-md transition-all ${
//                 user && !user.is_active ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               onClick={(e) => {
//                 if (user && !user.is_active) {
//                   e.preventDefault();
//                   toast.error('Your account is inactive. Please contact super admin.');
//                 }
//               }}
//             >
//               <div className={`p-3 rounded-lg ${action.color} mb-2`}>
//                 <action.icon className="w-6 h-6" />
//               </div>
//               <span className="text-sm font-medium text-gray-700 text-center">
//                 {action.label}
//               </span>
//             </motion.a>
//           ))}
//         </div>
//       </motion.div>

//       {/* Academic Performance */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="card"
//       >
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
//         <AcademicsChart />
//       </motion.div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { studentsAPI, teachersAPI, schoolsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SchoolAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, teachersResponse] = await Promise.all([
        studentsAPI.getStudents(),
        teachersAPI.getTeachers(),
      ]);
      
      const students = studentsResponse.data || [];
      const teachers = teachersResponse.data || [];
      
      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: 10, // This would come from classes API
        totalSubjects: 15, // This would come from subjects API
      });
      
      setRecentStudents(students.slice(0, 5));
      setRecentTeachers(teachers.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch data');
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
      action: '/school-admin/create-student',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: <PeopleIcon />,
      color: '#2e7d32',
      action: '/school-admin/create-teacher',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: <SchoolIcon />,
      color: '#ed6c02',
      action: '/school-admin/classes',
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects,
      icon: <BookIcon />,
      color: '#9c27b0',
      action: '/school-admin/subjects',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        School Admin Dashboard
      </Typography>
      
      {user && !user.is_active && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
          <Typography color="warning.contrastText">
            ⚠️ Your account is inactive. You cannot perform creation actions until activated by super admin.
          </Typography>
        </Paper>
      )}
      
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
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  href={card.action}
                  disabled={user && !user.is_active}
                >
                  Add New
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Students</Typography>
              <Button
                size="small"
                href="/school-admin/students"
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {student.first_name?.[0]}
                          </Avatar>
                          {student.first_name} {student.last_name}
                        </Box>
                      </TableCell>
                      <TableCell>{student.class || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.is_active ? 'Active' : 'Inactive'}
                          color={student.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Teachers</Typography>
              <Button
                size="small"
                href="/school-admin/teachers"
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Subjects</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {teacher.first_name?.[0]}
                          </Avatar>
                          {teacher.first_name} {teacher.last_name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {teacher.subjects?.slice(0, 2).join(', ') || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={teacher.is_active ? 'Active' : 'Inactive'}
                          color={teacher.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchoolAdminDashboard;