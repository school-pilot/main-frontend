import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, Calendar, Download, Bell, BookOpen, Users } from 'lucide-react';
import { timetableAPI } from '../../services/api';
import Loader from '../../components/Loader';

const Timetable = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    fetchTimetable();
  }, [currentWeek]);

  const fetchTimetable = async () => {
    try {
      // Assuming student ID is 1 for demo
      // In real app, use student's class ID
      const response = await timetableAPI.getClassTimetable(1);
      setTimetable(response.data);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      // Mock data for demo
      setTimetable([
        {
          id: 1,
          day: 'Monday',
          time_slot: '08:00 - 09:00',
          subject: 'Mathematics',
          teacher: 'Mr. Smith',
          room: 'Room 101',
        },
        {
          id: 2,
          day: 'Monday',
          time_slot: '09:00 - 10:00',
          subject: 'Physics',
          teacher: 'Ms. Davis',
          room: 'Lab 2',
        },
        {
          id: 3,
          day: 'Monday',
          time_slot: '11:00 - 12:00',
          subject: 'English',
          teacher: 'Mr. Brown',
          room: 'Room 203',
        },
        {
          id: 4,
          day: 'Tuesday',
          time_slot: '08:00 - 09:00',
          subject: 'Chemistry',
          teacher: 'Dr. Wilson',
          room: 'Lab 1',
        },
        {
          id: 5,
          day: 'Tuesday',
          time_slot: '10:00 - 11:00',
          subject: 'Biology',
          teacher: 'Mrs. Taylor',
          room: 'Lab 3',
        },
        {
          id: 6,
          day: 'Wednesday',
          time_slot: '08:00 - 09:00',
          subject: 'Mathematics',
          teacher: 'Mr. Smith',
          room: 'Room 101',
        },
        {
          id: 7,
          day: 'Wednesday',
          time_slot: '02:00 - 03:00',
          subject: 'History',
          teacher: 'Mr. Johnson',
          room: 'Room 105',
        },
        {
          id: 8,
          day: 'Thursday',
          time_slot: '09:00 - 10:00',
          subject: 'Physics',
          teacher: 'Ms. Davis',
          room: 'Lab 2',
        },
        {
          id: 9,
          day: 'Friday',
          time_slot: '08:00 - 09:00',
          subject: 'Mathematics',
          teacher: 'Mr. Smith',
          room: 'Room 101',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  const getPeriodForSlot = (day, timeSlot) => {
    return timetable.find(
      (period) => period.day === day && period.time_slot === timeSlot
    );
  };

  const getTodaySchedule = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetable.filter((period) => period.day === today);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const todaySchedule = getTodaySchedule();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
          <p className="text-gray-600">View your weekly class schedule</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400 w-5 h-5" />
            <input
              type="week"
              className="input-field"
              value={currentWeek.toISOString().split('T')[0]}
              onChange={(e) => setCurrentWeek(new Date(e.target.value))}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </motion.div>

      {/* Today's Schedule */}
      {todaySchedule.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Today's Classes</h2>
              <p className="text-primary-100">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Bell className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            {todaySchedule.map((period, index) => (
              <motion.div
                key={period.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{period.subject}</h3>
                    <p className="text-primary-100 text-sm">
                      {period.teacher} • {period.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{period.time_slot}</p>
                    <p className="text-primary-100 text-sm">Duration: 1 hour</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Timetable */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Timetable</h2>
          <p className="text-gray-600">Your complete schedule for the week</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header bg-gray-50">Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="table-header bg-gray-50">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, timeIndex) => (
                <tr key={timeSlot}>
                  <td className="table-cell bg-gray-50 font-medium sticky left-0">
                    {timeSlot}
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    const period = getPeriodForSlot(day, timeSlot);
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="table-cell border border-gray-200 min-w-[200px] h-24"
                      >
                        {period ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full p-3 bg-primary-50 rounded-lg border border-primary-200"
                          >
                            <div className="space-y-1">
                              <h4 className="font-medium text-primary-900 text-sm">
                                {period.subject}
                              </h4>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center">
                                  <Users className="w-3 h-3 mr-1 text-gray-400" />
                                  <span>{period.teacher}</span>
                                </div>
                                <div className="flex items-center">
                                  <BookOpen className="w-3 h-3 mr-1 text-gray-400" />
                                  <span>{period.room}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full p-2 text-gray-400 text-sm flex items-center justify-center">
                            Free Period
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Timetable Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Timetable Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Core Subjects</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Science Labs</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Electives</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Free Periods</span>
          </div>
        </div>
      </motion.div>

      {/* Next Class Countdown */}
      {todaySchedule.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Next Class
          </h3>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  {todaySchedule[0]?.subject}
                </h4>
                <p className="text-sm text-gray-600">
                  {todaySchedule[0]?.teacher} • {todaySchedule[0]?.room}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {todaySchedule[0]?.time_slot}
              </p>
              <p className="text-sm text-gray-600">Starts in 15 minutes</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Timetable;