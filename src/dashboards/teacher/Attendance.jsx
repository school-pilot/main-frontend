import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Filter,
} from 'lucide-react';
import { attendanceAPI, teachersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      // Assuming teacher ID is 1 for demo
      const response = await teachersAPI.getClasses(1);
      setClasses(response.data);
      if (response.data.length > 0) {
        setSelectedClass(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const fetchStudents = async () => {
    // In a real app, fetch students for the selected class
    // For demo, use mock data
    setStudents([
      { id: 1, name: 'John Doe', admission_number: 'S001' },
      { id: 2, name: 'Jane Smith', admission_number: 'S002' },
      { id: 3, name: 'Bob Johnson', admission_number: 'S003' },
      { id: 4, name: 'Alice Brown', admission_number: 'S004' },
      { id: 5, name: 'Charlie Wilson', admission_number: 'S005' },
    ]);
  };

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPI.getAll({
        class_id: selectedClass,
        date: selectedDate,
      });
      // Transform attendance records
      const records = {};
      response.data.forEach(record => {
        records[record.student_id] = record.status;
      });
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setSaving(true);
    try {
      const attendanceData = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        student_id: studentId,
        class_id: selectedClass,
        date: selectedDate,
        status,
      }));

      await attendanceAPI.mark({ records: attendanceData });
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Mark and manage student attendance</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Attendance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Attendance Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {Object.values(attendanceRecords).filter(v => v === 'present').length}
            </p>
            <p className="text-sm text-green-600">Present</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">
              {Object.values(attendanceRecords).filter(v => v === 'absent').length}
            </p>
            <p className="text-sm text-red-600">Absent</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">
              {Object.values(attendanceRecords).filter(v => v === 'late').length}
            </p>
            <p className="text-sm text-yellow-600">Late</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">
              {students.length}
            </p>
            <p className="text-sm text-blue-600">Total Students</p>
          </div>
        </div>
      </motion.div>

      {/* Attendance Sheet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance Sheet
          </h2>
          <p className="text-gray-600">
            Click on status to change attendance status
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">#</th>
                <th className="table-header">Admission No.</th>
                <th className="table-header">Student Name</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell font-medium">
                    {student.admission_number}
                  </td>
                  <td className="table-cell">{student.name}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {['present', 'absent', 'late', 'excused'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, status)}
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            attendanceRecords[student.id] === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => {
                        // Handle remarks
                        const remark = prompt('Enter remark for this student:');
                        if (remark) {
                          toast.success('Remark added');
                        }
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Add Remark
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Mark All Present</p>
                <p className="text-sm">Set all students as present</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">View Attendance History</p>
                <p className="text-sm">Check previous records</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Generate Report</p>
                <p className="text-sm">Export attendance data</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Attendance;