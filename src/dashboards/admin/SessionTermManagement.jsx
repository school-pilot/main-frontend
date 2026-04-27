import { useState, useEffect } from "react";
import { schoolsAPI } from "../../services/api";

const SessionTermManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [activeTab, setActiveTab] = useState("sessions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schoolId, setSchoolId] = useState("");

  // Form states
  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [termName, setTermName] = useState("");
  const [termStartDate, setTermStartDate] = useState("");
  const [termEndDate, setTermEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.school_id) {
      setSchoolId(user.school_id);
      fetchData(user.school_id);
    }
  }, []);

  const fetchData = async (sid) => {
    if (!sid) return;
    setLoading(true);
    try {
      const [sessionsRes, termsRes] = await Promise.all([
        schoolsAPI.getSessions(sid),
        schoolsAPI.getTerms(sid),
      ]);
      setSessions(sessionsRes.data);
      setTerms(termsRes.data);
    } catch (err) {
      setError("Failed to load session/term data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!schoolId) {
      setError("No school associated with this account");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("school", schoolId);
      formData.append("name", sessionName);
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);
      formData.append("is_current", isCurrent);
      
      await schoolsAPI.createSession(formData);
      setSuccess("Session created successfully");
      setSessionName("");
      setStartDate("");
      setEndDate("");
      setIsCurrent(false);
      fetchData(schoolId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    if (!schoolId) {
      setError("No school associated with this account");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("school", schoolId);
      formData.append("name", termName);
      formData.append("start_date", termStartDate);
      formData.append("end_date", termEndDate);
      formData.append("is_current", isCurrent);
      
      await schoolsAPI.createTerm(formData);
      setSuccess("Term created successfully");
      setTermName("");
      setTermStartDate("");
      setTermEndDate("");
      setIsCurrent(false);
      fetchData(schoolId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create term");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Session & Term Management</h1>
      
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

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["sessions", "terms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Academic Sessions</h2>
          <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Session name (e.g., 2024/2025)"
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4"
              />
              Current
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Session"}
            </button>
          </form>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Start Date</th>
                <th className="border p-2 text-left">End Date</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="border p-2">{session.name}</td>
                  <td className="border p-2">{session.start_date}</td>
                  <td className="border p-2">{session.end_date}</td>
                  <td className="border p-2">
                    {session.is_current ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Current</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Past</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Terms Tab */}
      {activeTab === "terms" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Terms</h2>
          <form onSubmit={handleCreateTerm} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              placeholder="Term name (e.g., First Term)"
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              value={termStartDate}
              onChange={(e) => setTermStartDate(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              value={termEndDate}
              onChange={(e) => setTermEndDate(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4"
              />
              Current
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Term"}
            </button>
          </form>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Start Date</th>
                <th className="border p-2 text-left">End Date</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term.id}>
                  <td className="border p-2">{term.name}</td>
                  <td className="border p-2">{term.start_date}</td>
                  <td className="border p-2">{term.end_date}</td>
                  <td className="border p-2">
                    {term.is_current ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Current</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Past</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionTermManagement;