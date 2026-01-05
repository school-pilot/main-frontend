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
} from 'lucide-react';
import { resultsAPI, attendanceAPI } from '../../services/api';
import Loader from '../../components/Loader';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [stats, setStats] = useState({
    averageScore: 0,
    attendanceRate: 0,
    totalSubjects: 0,
    rank: 0,
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Mock data for demonstration
      setStudentData({
        name: 'Alex Johnson',
        class: 'Grade 10A',
        admission_number: 'S001',
        guardian: 'Mary Johnson',
        guardian_phone: '+1234567890',
      });

      setUpcomingClasses([
        { time: '08:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '09:00 AM', subject: 'Physics', teacher: 'Ms. Davis', room: 'Lab 2' },
        { time: '11:00 AM', subject: 'English', teacher: 'Mr. Brown', room: '203' },
        { time: '02:00 PM', subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab 1' },
      ]);

      setRecentResults([
        { subject: 'Mathematics', score: 85, grade: 'A', date: '2024-01-15' },
        { subject: 'Physics', score: 78, grade: 'B', date: '2024-01-14' },
        { subject: 'English', score: 92, grade: 'A', date: '2024-01-13' },
        { subject: 'Chemistry', score: 81, grade: 'B+', date: '2024-01-12' },
      ]);

      setAttendance({
        present: 45,
        absent: 2,
        late: 1,
        rate: 94,
      });

      setStats({
        averageScore: 84,
        attendanceRate: 94,
        totalSubjects: 8,
        rank: 5,
      });
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    } finally {
      setLoading(false);
    }
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
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {studentData.name}!</h1>
            <p className="text-primary-100 mt-2">
              {studentData.class} • {studentData.admission_number}
            </p>
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
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Average Score',
            value: `${stats.averageScore}%`,
            icon: TrendingUp,
            color: 'bg-blue-500',
            change: '+2%',
          },
          {
            title: 'Attendance Rate',
            value: `${stats.attendanceRate}%`,
            icon: Users,
            color: 'bg-green-500',
            change: '+1%',
          },
          {
            title: 'Class Rank',
            value: `#${stats.rank}`,
            icon: Award,
            color: 'bg-orange-500',
            change: '+1',
          },
          {
            title: 'Total Subjects',
            value: stats.totalSubjects,
            icon: BookOpen,
            color: 'bg-purple-500',
            change: '',
          },
        ].map((stat, index) => (
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
                {stat.change && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">this month</span>
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

      {/* Today's Schedule & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View Full Timetable →
            </button>
          </div>

          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                    <p className="text-sm text-gray-600">{classItem.teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{classItem.time}</p>
                  <p className="text-sm text-gray-600">Room {classItem.room}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                <span>My Results</span>
              </div>
              <TrendingUp className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" />
                <span>Timetable</span>
              </div>
              <Clock className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Study Materials</span>
              </div>
              <BookOpen className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-3" />
                <span>Notifications</span>
              </div>
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Results
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Subject</th>
                <th className="table-header">Score</th>
                <th className="table-header">Grade</th>
                <th className="table-header">Date</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentResults.map((result, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="table-cell font-medium">{result.subject}</td>
                  <td className="table-cell">
                    <span className="text-2xl font-bold text-gray-900">
                      {result.score}
                    </span>
                    <span className="text-gray-500">/100</span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.grade === 'A'
                          ? 'bg-green-100 text-green-800'
                          : result.grade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.grade}
                    </span>
                  </td>
                  <td className="table-cell">
                    {new Date(result.date).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        result.score >= 50
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.score >= 50 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Attendance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Attendance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {attendance.present}
            </p>
            <p className="text-sm text-green-600">Present</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">
              {attendance.absent}
            </p>
            <p className="text-sm text-red-600">Absent</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">
              {attendance.late}
            </p>
            <p className="text-sm text-yellow-600">Late</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">
              {attendance.rate}%
            </p>
            <p className="text-sm text-blue-600">Attendance Rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;