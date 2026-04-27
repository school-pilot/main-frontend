import { useState, useEffect } from "react";
import { attendanceAPI, academicsAPI } from "../services/api";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchClasses();
    fetchSummary();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance(selectedClass, date);
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const response = await academicsAPI.classes();
      setClasses(response.data.classes || response.data);
    } catch (err) {
      console.error("Failed to load classes:", err);
    }
  };

  const fetchAttendance = async (classId, date) => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getAll({ class_id: classId, date });
      setAttendance(response.data.attendance || response.data);
    } catch (err) {
      setError("Failed to load attendance");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await attendanceAPI.summary();
      setSummary(response.data.summary || response.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await attendanceAPI.mark({
        student_id: studentId,
        class_id: selectedClass,
        date,
        status,
      });
      fetchAttendance(selectedClass, date);
      setSuccess(`Attendance marked as ${status}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="text-2xl font-bold">{summary.total_students || 0}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Present Today</div>
            <div className="text-2xl font-bold text-green-600">{summary.present || 0}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Absent Today</div>
            <div className="text-2xl font-bold text-red-600">{summary.absent || 0}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Attendance Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {summary.attendance_rate || 0}%
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- Select a class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      {selectedClass && !loading && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Attendance for {date}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Student Name</th>
                  <th className="border p-2 text-left">Admission No.</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="border p-4 text-center text-gray-500">
                      No attendance records found for this class and date.
                    </td>
                  </tr>
                ) : (
                  attendance.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{record.student_name}</td>
                      <td className="border p-2">{record.admission_no}</td>
                      <td className="border p-2">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleMarkAttendance(record.student_id, "present")}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(record.student_id, "absent")}
                          className="text-red-600 hover:text-red-800"
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default AttendanceManagement;