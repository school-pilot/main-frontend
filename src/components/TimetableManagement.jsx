import { useState, useEffect } from "react";
import { timetableAPI, academicsAPI } from "../services/api";

const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassTimetable(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await academicsAPI.classes();
      setClasses(response.data.classes || response.data);
    } catch (err) {
      console.error("Failed to load classes:", err);
    }
  };

  const fetchClassTimetable = async (classId) => {
    setLoading(true);
    try {
      const response = await timetableAPI.class(classId);
      setTimetable(response.data.timetable || []);
    } catch (err) {
      setError("Failed to load timetable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.target);
    const data = {
      class_id: selectedClass,
      day: formData.get("day"),
      period: formData.get("period"),
      subject: formData.get("subject"),
      teacher: formData.get("teacher"),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
    };
    
    try {
      await timetableAPI.create(data);
      setSuccess("Timetable entry created successfully");
      fetchClassTimetable(selectedClass);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create timetable entry");
    } finally {
      setLoading(false);
    }
  };

  // Group timetable by day
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const getTimetableByDay = (day) => {
    return timetable.filter(entry => entry.day === day);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Timetable Management</h1>

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

      {/* Class Selection */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <label className="block text-sm font-medium mb-2">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        >
          <option value="">-- Select a class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Timetable Entry */}
      {selectedClass && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Timetable Entry</h2>
          <form onSubmit={handleCreateTimetable} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day *</label>
              <select name="day" required className="border p-2 rounded w-full">
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period *</label>
              <input type="text" name="period" required placeholder="e.g. Period 1" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <input type="text" name="subject" required placeholder="e.g. Mathematics" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <input type="text" name="teacher" placeholder="Teacher name" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input type="time" name="start_time" required className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input type="time" name="end_time" required className="border p-2 rounded w-full" />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetable Display */}
      {selectedClass && !loading && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Class Timetable</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Day</th>
                  <th className="border p-2 text-left">Period</th>
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2 text-left">Teacher</th>
                  <th className="border p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {timetable.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="border p-4 text-center text-gray-500">
                      No timetable entries yet. Add one above.
                    </td>
                  </tr>
                ) : (
                  timetable.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{entry.day}</td>
                      <td className="border p-2">{entry.period}</td>
                      <td className="border p-2">{entry.subject}</td>
                      <td className="border p-2">{entry.teacher || "-"}</td>
                      <td className="border p-2">
                        {entry.start_time} - {entry.end_time}
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

export default TimetableManagement;