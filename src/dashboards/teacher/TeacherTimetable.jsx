// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { Clock, Calendar, Bell, BookOpen, Users } from 'lucide-react';
// import { timetableAPI } from '../../services/api';
// import Loader from '../../components/Loader';

// const TeacherTimetable = () => {
//   const [loading, setLoading] = useState(true);
//   const [timetable, setTimetable] = useState([]);
//   const [currentWeek, setCurrentWeek] = useState(new Date());

//   useEffect(() => {
//     fetchTimetable();
//   }, [currentWeek]);

//   const fetchTimetable = async () => {
//     try {
//       // Assuming teacher ID is 1 for demo
//       const response = await timetableAPI.getTeacherTimetable(1);
//       setTimetable(response.data);
//     } catch (error) {
//       console.error('Failed to fetch timetable:', error);
//       // Mock data for demo
//       setTimetable([
//         {
//           id: 1,
//           day: 'Monday',
//           time_slot: '08:00 - 09:00',
//           class: 'Grade 10A',
//           subject: 'Mathematics',
//           room: 'Room 101',
//         },
//         {
//           id: 2,
//           day: 'Monday',
//           time_slot: '10:00 - 11:00',
//           class: 'Grade 11B',
//           subject: 'Physics',
//           room: 'Lab 2',
//         },
//         {
//           id: 3,
//           day: 'Tuesday',
//           time_slot: '08:00 - 09:00',
//           class: 'Grade 9C',
//           subject: 'Mathematics',
//           room: 'Room 102',
//         },
//         {
//           id: 4,
//           day: 'Wednesday',
//           time_slot: '13:00 - 14:00',
//           class: 'Grade 10A',
//           subject: 'Mathematics',
//           room: 'Room 101',
//         },
//         {
//           id: 5,
//           day: 'Thursday',
//           time_slot: '10:00 - 11:00',
//           class: 'Grade 11B',
//           subject: 'Physics',
//           room: 'Lab 2',
//         },
//         {
//           id: 6,
//           day: 'Friday',
//           time_slot: '08:00 - 09:00',
//           class: 'Grade 9C',
//           subject: 'Mathematics',
//           room: 'Room 102',
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   const timeSlots = [
//     '08:00 - 09:00',
//     '09:00 - 10:00',
//     '10:00 - 11:00',
//     '11:00 - 12:00',
//     '12:00 - 13:00',
//     '13:00 - 14:00',
//     '14:00 - 15:00',
//     '15:00 - 16:00',
//   ];

//   const getPeriodForSlot = (day, timeSlot) => {
//     return timetable.find(
//       (period) => period.day === day && period.time_slot === timeSlot
//     );
//   };

//   const getTodaySchedule = () => {
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
//     return timetable.filter((period) => period.day === today);
//   };

//   if (loading) {
//     return <Loader fullScreen />;
//   }

//   const todaySchedule = getTodaySchedule();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col md:flex-row md:items-center justify-between gap-4"
//       >
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
//           <p className="text-gray-600">View your teaching schedule</p>
//         </div>

//         <div className="flex items-center space-x-3">
//           <div className="flex items-center space-x-2">
//             <Calendar className="text-gray-400 w-5 h-5" />
//             <input
//               type="week"
//               className="input-field"
//               value={currentWeek.toISOString().split('T')[0]}
//               onChange={(e) => setCurrentWeek(new Date(e.target.value))}
//             />
//           </div>
//           <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
//             Export
//           </button>
//         </div>
//       </motion.div>

//       {/* Today's Schedule */}
//       {todaySchedule.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-xl font-bold">Today's Schedule</h2>
//               <p className="text-primary-100">
//                 {new Date().toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   month: 'long',
//                   day: 'numeric',
//                 })}
//               </p>
//             </div>
//             <Bell className="w-6 h-6" />
//           </div>

//           <div className="space-y-3">
//             {todaySchedule.map((period, index) => (
//               <motion.div
//                 key={period.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white bg-opacity-20 p-4 rounded-lg"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-bold">{period.subject}</h3>
//                     <p className="text-primary-100 text-sm">
//                       {period.class} • {period.room}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold">{period.time_slot}</p>
//                     <p className="text-primary-100 text-sm">Duration: 1 hour</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       )}

//       {/* Full Timetable */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white rounded-xl shadow-sm overflow-hidden"
//       >
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">Weekly Timetable</h2>
//           <p className="text-gray-600">Your complete schedule for the week</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr>
//                 <th className="table-header bg-gray-50">Time</th>
//                 {daysOfWeek.map((day) => (
//                   <th key={day} className="table-header bg-gray-50">
//                     {day}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {timeSlots.map((timeSlot, timeIndex) => (
//                 <tr key={timeSlot}>
//                   <td className="table-cell bg-gray-50 font-medium sticky left-0">
//                     {timeSlot}
//                   </td>
//                   {daysOfWeek.map((day, dayIndex) => {
//                     const period = getPeriodForSlot(day, timeSlot);
//                     return (
//                       <td
//                         key={`${day}-${timeSlot}`}
//                         className="table-cell border border-gray-200 min-w-[200px] h-24"
//                       >
//                         {period ? (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="h-full p-3 bg-primary-50 rounded-lg border border-primary-200"
//                           >
//                             <div className="space-y-1">
//                               <h4 className="font-medium text-primary-900 text-sm">
//                                 {period.subject}
//                               </h4>
//                               <div className="text-xs space-y-1">
//                                 <div className="flex items-center">
//                                   <Users className="w-3 h-3 mr-1 text-gray-400" />
//                                   <span>{period.class}</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                   <BookOpen className="w-3 h-3 mr-1 text-gray-400" />
//                                   <span>{period.room}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ) : (
//                           <div className="h-full p-2 text-gray-400 text-sm flex items-center justify-center">
//                             Free Period
//                           </div>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Timetable Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Classes</p>
//               <h3 className="text-2xl font-bold text-gray-900 mt-2">
//                 {timetable.length}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">This week</p>
//             </div>
//             <BookOpen className="w-10 h-10 text-primary-500" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Teaching Hours</p>
//               <h3 className="text-2xl font-bold text-gray-900 mt-2">
//                 {timetable.length * 1}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">Hours per week</p>
//             </div>
//             <Clock className="w-10 h-10 text-green-500" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Different Classes</p>
//               <h3 className="text-2xl font-bold text-gray-900 mt-2">
//                 {[...new Set(timetable.map(p => p.class))].length}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">Classes taught</p>
//             </div>
//             <Users className="w-10 h-10 text-purple-500" />
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TeacherTimetable;



import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { timetableAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TeacherTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTimetable();
    }
  }, [user, selectedWeek]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await timetableAPI.getTeacherTimetable(user.id);
      setTimetable(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  // Mock timetable data structure
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { time: '8:00 - 8:45', period: 1 },
    { time: '8:45 - 9:30', period: 2 },
    { time: '9:30 - 10:15', period: 3 },
    { time: '10:15 - 11:00', period: 4 },
    { time: '11:15 - 12:00', period: 5 },
    { time: '12:00 - 12:45', period: 6 },
    { time: '1:30 - 2:15', period: 7 },
    { time: '2:15 - 3:00', period: 8 },
  ];

  const getClassForPeriod = (day, period) => {
    // In a real app, this would come from the API
    const mockData = {
      'Monday': {
        1: { class: '10A', subject: 'Mathematics', room: 'Room 101' },
        3: { class: '11B', subject: 'Physics', room: 'Lab 1' },
        5: { class: '9C', subject: 'Chemistry', room: 'Room 205' },
      },
      'Tuesday': {
        2: { class: '12A', subject: 'Biology', room: 'Lab 2' },
        4: { class: '10B', subject: 'English', room: 'Room 103' },
        6: { class: '11A', subject: 'Computer Science', room: 'Lab 3' },
      },
      'Wednesday': {
        1: { class: '9A', subject: 'History', room: 'Room 201' },
        3: { class: '12B', subject: 'Geography', room: 'Room 202' },
        7: { class: '10C', subject: 'Art', room: 'Art Room' },
      },
      'Thursday': {
        2: { class: '11C', subject: 'Physical Education', room: 'Ground' },
        4: { class: '9B', subject: 'Music', room: 'Music Room' },
        6: { class: '12C', subject: 'Economics', room: 'Room 203' },
      },
      'Friday': {
        1: { class: '10A', subject: 'Mathematics', room: 'Room 101' },
        5: { class: '11A', subject: 'Physics', room: 'Lab 1' },
        8: { class: '12A', subject: 'Computer Science', room: 'Lab 3' },
      },
    };
    
    return mockData[day]?.[period] || null;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Timetable</Typography>
        <Box>
          <Button
            startIcon={<PrintIcon />}
            sx={{ mr: 2 }}
          >
            Print
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
          >
            Download
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Teaching Hours
              </Typography>
              <Typography variant="h4">24 hrs/week</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Classes Assigned
              </Typography>
              <Typography variant="h4">6 classes</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Subjects
              </Typography>
              <Typography variant="h4">4 subjects</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, overflow: 'auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                {days.map((day) => (
                  <TableCell key={day} align="center">
                    <Typography fontWeight="bold">{day}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.period}>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {period.time}
                    </Typography>
                  </TableCell>
                  
                  {days.map((day) => {
                    const classInfo = getClassForPeriod(day, period.period);
                    
                    return (
                      <TableCell key={`${day}-${period.period}`} align="center">
                        {classInfo ? (
                          <Box
                            sx={{
                              p: 1,
                              bgcolor: 'primary.light',
                              borderRadius: 1,
                              color: 'primary.contrastText',
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {classInfo.class}
                            </Typography>
                            <Typography variant="caption">
                              {classInfo.subject}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {classInfo.room}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Free
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label="Mathematics" size="small" sx={{ bgcolor: '#1976d2', color: 'white' }} />
          <Chip label="Physics" size="small" sx={{ bgcolor: '#2e7d32', color: 'white' }} />
          <Chip label="Chemistry" size="small" sx={{ bgcolor: '#ed6c02', color: 'white' }} />
          <Chip label="Biology" size="small" sx={{ bgcolor: '#9c27b0', color: 'white' }} />
          <Chip label="English" size="small" sx={{ bgcolor: '#d32f2f', color: 'white' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherTimetable;