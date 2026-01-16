import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Bell,
  Clock,
  Award,
  Users,
  FileText,
  Mail,
  Phone,
  User,
  Eye,
  ChevronRight,
  CalendarDays,
  Home
} from 'lucide-react';
import { studentsAPI, resultsAPI, communicationsAPI, timetableAPI, attendanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
    total: 0
  });
  const [stats, setStats] = useState({
    averageScore: 0,
    attendanceRate: 0,
    totalSubjects: 0,
    rank: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch student profile
      const profileResponse = await studentsAPI.get(user.id);
      setStudentData(profileResponse.data);
      
      // Fetch student timetable if class is available
      if (profileResponse.data.class_id) {
        try {
          const timetableResponse = await timetableAPI.class(profileResponse.data.class_id);
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const todayClasses = timetableResponse.data.filter(cls => cls.day === today);
          
          setUpcomingClasses(todayClasses.map(cls => ({
            time: cls.time_slot,
            subject: cls.subject_name || cls.subject,
            teacher: cls.teacher_name,
            room: cls.room
          })));
        } catch (error) {
          console.warn('Failed to fetch timetable:', error);
          // Fallback empty classes
          setUpcomingClasses([]);
        }
      }
      
      // Fetch student results
      const resultsResponse = await resultsAPI.studentResults(user.id);
      if (resultsResponse.data && resultsResponse.data.length > 0) {
        setRecentResults(resultsResponse.data.slice(0, 4));
        
        // Calculate average score
        const totalScore = resultsResponse.data.reduce((sum, result) => sum + result.score, 0);
        const averageScore = resultsResponse.data.length > 0 ? totalScore / resultsResponse.data.length : 0;
        
        // Get unique subjects count
        const subjects = [...new Set(resultsResponse.data.map(r => r.subject))];
        
        // Calculate rank (this would typically come from API)
        const rank = Math.floor(Math.random() * 10) + 1; // Mock rank calculation
        
        setStats(prev => ({
          ...prev,
          averageScore: Math.round(averageScore),
          totalSubjects: subjects.length,
          rank: rank
        }));
      }
      
      // Fetch notifications
      const notificationsResponse = await communicationsAPI.notifications();
      setNotifications(notificationsResponse.data.slice(0, 3) || []);
      
      // Fetch attendance summary
      const attendanceResponse = await attendanceAPI.getAll({ student_id: user.id });
      if (attendanceResponse.data && attendanceResponse.data.length > 0) {
        const attendanceData = attendanceResponse.data;
        const present = attendanceData.filter(a => a.status === 'present').length;
        const absent = attendanceData.filter(a => a.status === 'absent').length;
        const late = attendanceData.filter(a => a.status === 'late').length;
        const total = attendanceData.length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        setAttendance({
          present,
          absent,
          late,
          rate,
          total
        });
        
        setStats(prev => ({
          ...prev,
          attendanceRate: rate
        }));
      }
      
      // Fetch announcements as upcoming events
      const announcementsResponse = await communicationsAPI.announcements();
      if (announcementsResponse.data && announcementsResponse.data.length > 0) {
        const events = announcementsResponse.data.slice(0, 3).map(announcement => ({
          title: announcement.title,
          message: announcement.content,
          date: new Date(announcement.created_at).toLocaleDateString(),
          unread: !announcement.read
        }));
        setUpcomingEvents(events);
      }
      
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: stats.averageScore > 0 ? '+2%' : 'N/A',
      description: 'this term',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: Users,
      color: 'bg-green-500',
      change: stats.attendanceRate > 0 ? '+1%' : 'N/A',
      description: 'this month',
    },
    {
      title: 'Class Rank',
      value: stats.rank > 0 ? `#${stats.rank}` : 'N/A',
      icon: Award,
      color: 'bg-orange-500',
      change: stats.rank > 0 ? '+1' : '',
      description: 'improvement',
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '',
      description: 'enrolled',
    },
  ];

  const getGradeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {studentData?.first_name || user?.first_name}  {studentData?.last_name || user?.last_name} !
              </h1>
              <p className="text-white mt-1">
                {studentData?.class_name || studentData?.class || 'Student'} • 
                Roll No: {studentData?.roll_number || studentData?.admission_number || 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary-100">Today</p>
            <p className="text-xl font-bold">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-primary-200" />
            <span className="text-sm">{studentData?.email || user?.email || 'No email'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-primary-200" />
            <span className="text-sm">{studentData?.phone_number || studentData?.guardian_phone || 'No phone'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-primary-200" />
            <span className="text-sm">Guardian: {studentData?.guardian_name || 'N/A'}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                {stat.change && stat.change !== 'N/A' && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Schedule & Recent Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <a
                href="/student/timetable"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                View Full Timetable
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <Clock className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                        <p className="text-sm text-gray-600">{classItem.teacher}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{classItem.time}</p>
                      <p className="text-sm text-gray-600">{classItem.room}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            )}
          </motion.div>

          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
              <a
                href="/student/results"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All Results
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {recentResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Subject</th>
                      <th className="table-header">Assessment</th>
                      <th className="table-header">Score</th>
                      <th className="table-header">Grade</th>
                      <th className="table-header">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentResults.map((result, index) => (
                      <motion.tr
                        key={result.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="table-cell font-medium">{result.subject}</td>
                        <td className="table-cell">{result.assessment_type || 'Exam'}</td>
                        <td className="table-cell">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              {result.score}
                            </span>
                            <span className="text-gray-500 ml-1">/{result.total_score || 100}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                              result.score
                            )}`}
                          >
                            {getGrade(result.score)}
                          </span>
                        </td>
                        <td className="table-cell">
                          {result.exam_date ? new Date(result.exam_date).toLocaleDateString() : 
                           result.created_at ? new Date(result.created_at).toLocaleDateString() : 
                           'N/A'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No results available yet</p>
                <a
                  href="/student/results"
                  className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-700"
                >
                  Check all assessments →
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Notifications, Events, Quick Links */}
        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                {notifications.filter(n => n.unread).length} new
              </span>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id || index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      notification.unread
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Bell className={`w-5 h-5 mt-1 ${
                        notification.unread ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.created_at ? 
                            new Date(notification.created_at).toLocaleDateString() : 
                            'Recent'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No new notifications</p>
              </div>
            )}

            <a
              href="/notifications"
              className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700"
            >
              View All Notifications
            </a>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Latest Announcements</h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                      </div>
                      <Bell className={`w-5 h-5 ${event.unread ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No recent announcements</p>
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h2>
            
            <div className="space-y-3">
              <a
                href="/student/profile"
                className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 group"
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </div>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a
                href="/student/results"
                className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 group"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <span>My Results</span>
                </div>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a
                href="/student/timetable"
                className="flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 group"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Timetable</span>
                </div>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a
                href="/student/attendance"
                className="flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 group"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Attendance</span>
                </div>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Attendance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance Summary
          </h2>
          <a
            href="/student/attendance"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View Details →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {attendance.present}
            </p>
            <p className="text-sm text-green-600">Present</p>
            {attendance.total > 0 && (
              <p className="text-xs text-green-700 mt-1">
                {Math.round((attendance.present / attendance.total) * 100)}% of total
              </p>
            )}
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">
              {attendance.absent}
            </p>
            <p className="text-sm text-red-600">Absent</p>
            {attendance.total > 0 && (
              <p className="text-xs text-red-700 mt-1">
                {Math.round((attendance.absent / attendance.total) * 100)}% of total
              </p>
            )}
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">
              {attendance.late}
            </p>
            <p className="text-sm text-yellow-600">Late</p>
            {attendance.total > 0 && (
              <p className="text-xs text-yellow-700 mt-1">
                {Math.round((attendance.late / attendance.total) * 100)}% of total
              </p>
            )}
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">
              {attendance.rate}%
            </p>
            <p className="text-sm text-blue-600">Attendance Rate</p>
            <p className="text-xs text-blue-700 mt-1">
              Total: {attendance.total} days
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;