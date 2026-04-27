import { useState, useEffect } from "react";
import { resultsAPI } from "../../services/api";

const ResultApproval = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchResults();
  }, [selectedClass]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = selectedClass ? { class: selectedClass } : {};
      const res = await resultsAPI.classResults(params);
      setResults(res.data);
    } catch (err) {
      setError("Failed to load results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (resultId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resultsAPI.approve({ result_id: resultId });
      setSuccess("Result approved successfully");
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve result");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const pendingResults = results.filter(r => r.status === "pending");
      for (const result of pendingResults) {
        await resultsAPI.approve({ result_id: result.id });
      }
      setSuccess("All pending results approved successfully");
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Result Approval</h1>
      
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

      {/* Filter */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>
        
        <button
          onClick={handleApproveAll}
          disabled={loading || results.filter(r => r.status === "pending").length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Approve All Pending
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Student</th>
              <th className="border p-3 text-left">Subject</th>
              <th className="border p-3 text-left">Class</th>
              <th className="border p-3 text-left">Score</th>
              <th className="border p-3 text-left">Grade</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td className="border p-3">{result.student_name || "N/A"}</td>
                <td className="border p-3">{result.subject_name || "N/A"}</td>
                <td className="border p-3">{result.class_name || "N/A"}</td>
                <td className="border p-3">{result.score || "N/A"}</td>
                <td className="border p-3">{result.grade || "N/A"}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    result.status === "approved" 
                      ? "bg-green-100 text-green-800"
                      : result.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {result.status || "pending"}
                  </span>
                </td>
                <td className="border p-3">
                  {result.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(result.id)}
                      disabled={loading}
                      className="text-blue-500 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {results.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="border p-3 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultApproval;