import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Calendar,
  Save,
  Trash2,
  Edit,
  Filter,
  Users,
  BookOpen,
} from 'lucide-react';
import { timetableAPI, academicsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const TimetableAdmin = () => {
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes] = await Promise.all([
        academicsAPI.getClasses(),
        academicsAPI.getSubjects(),
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      
      if (classesRes.data.length > 0) {
        setSelectedClass(classesRes.data[0].id);
        fetchTimetable(classesRes.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async (classId) => {
    try {
      const response = await timetableAPI.getClassTimetable(classId);
      setTimetable(response.data);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    }
  };

  const handleAddPeriod = async (periodData) => {
    try {
      await timetableAPI.create(periodData);
      toast.success('Period added successfully');
      fetchTimetable(selectedClass);
      setShowAddPeriod(false);
    } catch (error) {
      toast.error('Failed to add period');
    }
  };

  const handleUpdatePeriod = async (periodId, periodData) => {
    try {
      await timetableAPI.update(periodId, periodData);
      toast.success('Period updated successfully');
      fetchTimetable(selectedClass);
      setEditingPeriod(null);
    } catch (error) {
      toast.error('Failed to update period');
    }
  };

  const handleDeletePeriod = async (periodId) => {
    if (!window.confirm('Are you sure you want to delete this period?')) return;
    
    try {
      await timetableAPI.delete(periodId);
      toast.success('Period deleted successfully');
      fetchTimetable(selectedClass);
    } catch (error) {
      toast.error('Failed to delete period');
    }
  };

  const getPeriodForSlot = (day, timeSlot) => {
    return timetable.find(
      (period) => period.day === day && period.time_slot === timeSlot
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-600">Create and manage class timetables</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                fetchTimetable(e.target.value);
              }}
              className="input-field"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddPeriod(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Timetable */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
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
                        className="table-cell border border-gray-200 min-w-[200px]"
                      >
                        {period ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 bg-primary-50 rounded-lg border border-primary-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-primary-900">
                                {period.subject}
                              </h4>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => setEditingPeriod(period)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeletePeriod(period.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{period.teacher_name}</span>
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="w-3 h-3 mr-1 text-gray-400" />
                                <span>Room {period.room}</span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPeriod({
                                day,
                                time_slot: timeSlot,
                                class_id: selectedClass,
                              });
                            }}
                            className="w-full h-full p-4 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg border-2 border-dashed border-gray-300"
                          >
                            <Plus className="w-5 h-5 mx-auto" />
                          </button>
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

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary-100 border border-primary-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Scheduled Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Core Subjects</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Electives</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Lab Sessions</span>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {(showAddPeriod || editingPeriod) && (
          <PeriodModal
            period={editingPeriod}
            classId={selectedClass}
            subjects={subjects}
            onClose={() => {
              setShowAddPeriod(false);
              setEditingPeriod(null);
            }}
            onSubmit={editingPeriod?.id ? handleUpdatePeriod : handleAddPeriod}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PeriodModal = ({ period, classId, subjects, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    class_id: classId,
    subject_id: '',
    teacher_id: '',
    day: period?.day || 'Monday',
    time_slot: period?.time_slot || '08:00 - 09:00',
    room: '',
  });

  useEffect(() => {
    if (period?.id) {
      setFormData({
        class_id: period.class_id,
        subject_id: period.subject_id,
        teacher_id: period.teacher_id,
        day: period.day,
        time_slot: period.time_slot,
        room: period.room,
      });
    }
  }, [period]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (period?.id) {
      onSubmit(period.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {period?.id ? 'Edit Period' : 'Add New Period'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day *
              </label>
              <select
                required
                className="input-field"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slot *
              </label>
              <select
                required
                className="input-field"
                value={formData.time_slot}
                onChange={(e) =>
                  setFormData({ ...formData, time_slot: e.target.value })
                }
              >
                {[
                  '08:00 - 09:00',
                  '09:00 - 10:00',
                  '10:00 - 11:00',
                  '11:00 - 12:00',
                  '12:00 - 13:00',
                  '13:00 - 14:00',
                  '14:00 - 15:00',
                  '15:00 - 16:00',
                ].map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                required
                className="input-field"
                value={formData.subject_id}
                onChange={(e) =>
                  setFormData({ ...formData, subject_id: e.target.value })
                }
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., Room 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher ID
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.teacher_id}
                onChange={(e) =>
                  setFormData({ ...formData, teacher_id: e.target.value })
                }
                placeholder="Teacher's ID"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {period?.id ? 'Update Period' : 'Add Period'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TimetableAdmin;