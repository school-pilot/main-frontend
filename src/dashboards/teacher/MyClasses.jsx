import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  BarChart3,
  MessageSquare,
  Upload,
} from 'lucide-react';
import { teachersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const MyClasses = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // Assuming teacher ID is 1 for demo
      const response = await teachersAPI.getClasses(1);
      setClasses(response.data);
      if (response.data.length > 0) {
        setSelectedClass(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      // Mock data for demo
      setClasses([
        {
          id: 1,
          name: 'Grade 10A',
          subject: 'Mathematics',
          students_count: 35,
          schedule: 'Mon, Wed, Fri - 08:00-09:00',
          room: 'Room 101',
          attendance_rate: 92,
          average_score: 85,
        },
        {
          id: 2,
          name: 'Grade 11B',
          subject: 'Physics',
          students_count: 28,
          schedule: 'Tue, Thu - 10:00-11:00',
          room: 'Lab 2',
          attendance_rate: 88,
          average_score: 82,
        },
        {
          id: 3,
          name: 'Grade 9C',
          subject: 'Mathematics',
          students_count: 40,
          schedule: 'Mon, Wed, Fri - 13:00-14:00',
          room: 'Room 102',
          attendance_rate: 95,
          average_score: 78,
        },
      ]);
      if (response.data.length > 0) {
        setSelectedClass(response.data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getClassStats = (cls) => {
    return [
      { label: 'Students', value: cls.students_count, icon: Users, color: 'blue' },
      { label: 'Attendance Rate', value: `${cls.attendance_rate}%`, icon: Users, color: 'green' },
      { label: 'Average Score', value: `${cls.average_score}%`, icon: BarChart3, color: 'purple' },
      { label: 'Schedule', value: cls.schedule, icon: Calendar, color: 'orange' },
    ];
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">View and manage your assigned classes</p>
        </div>
      </motion.div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedClass(cls)}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer border-2 ${
              selectedClass?.id === cls.id
                ? 'border-primary-500'
                : 'border-transparent hover:border-primary-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                <p className="text-primary-600 font-medium">{cls.subject}</p>
              </div>
              <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {cls.room}
              </div>
            </div>

            <div className="space-y-3">
              {getClassStats(cls).map((stat, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <stat.icon className={`w-4 h-4 mr-2 text-${stat.color}-500`} />
                  <span className="text-gray-600">{stat.label}:</span>
                  <span className="ml-2 font-medium">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm hover:bg-primary-100">
                  View Students
                </button>
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100">
                  Take Attendance
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Class Details */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedClass.name} - {selectedClass.subject}
              </h2>
              <p className="text-gray-600">Detailed information and actions</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Send Announcement
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['Overview', 'Students', 'Materials', 'Assignments', 'Results'].map(
                (tab) => (
                  <button
                    key={tab}
                    className="px-1 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Class Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activities
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Mathematics Test',
                    description: 'First Term Exam conducted',
                    date: '2 hours ago',
                    type: 'exam',
                  },
                  {
                    title: 'Homework Assignment',
                    description: 'Chapter 3 exercises assigned',
                    date: '1 day ago',
                    type: 'assignment',
                  },
                  {
                    title: 'Class Announcement',
                    description: 'Parent-teacher meeting scheduled',
                    date: '2 days ago',
                    type: 'announcement',
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <Upload className="w-5 h-5 mr-3" />
                  <span>Upload Study Material</span>
                </button>
                <button className="w-full flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span>Create Assignment</span>
                </button>
                <button className="w-full flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span>View Class Performance</span>
                </button>
                <button className="w-full flex items-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Schedule Test</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Parent-Teacher Meeting',
              class: 'Grade 10A',
              date: 'Tomorrow, 2:00 PM',
              type: 'meeting',
            },
            {
              title: 'Mathematics Test',
              class: 'Grade 11B',
              date: 'Friday, 10:00 AM',
              type: 'exam',
            },
            {
              title: 'Submission Deadline',
              class: 'Grade 9C',
              date: 'Next Monday',
              type: 'deadline',
            },
          ].map((event, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.class}</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{event.date}</span>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MyClasses;