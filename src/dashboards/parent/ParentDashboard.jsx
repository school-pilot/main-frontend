import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentsAPI, resultsAPI, attendanceAPI, feesAPI } from "../../services/api";

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childResults, setChildResults] = useState([]);
  const [childAttendance, setChildAttendance] = useState([]);
  const [childFees, setChildFees] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch children linked to the parent
      // For now, we'll use mock data
      setChildren([
        { id: 1, name: "Child 1", class: "JSS 1", school: "Sample School" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (childId) => {
    setLoading(true);
    try {
      const [resultsRes, attendanceRes, feesRes] = await Promise.all([
        resultsAPI.studentResults(childId),
        attendanceAPI.getAll({ student_id: childId }),
        feesAPI.invoices(),
      ]);
      setChildResults(resultsRes.data || []);
      setChildAttendance(attendanceRes.data || []);
      setChildFees(feesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (child) => {
    setSelectedChild(child);
    fetchChildData(child.id);
  };

  const getAttendancePercentage = () => {
    if (childAttendance.length === 0) return 0;
    const present = childAttendance.filter(a => a.status === "present").length;
    return Math.round((present / childAttendance.length) * 100);
  };

  const getTotalFees = () => {
    return childFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  };

  const getPaidFees = () => {
    return childFees.filter(f => f.status === "paid").reduce((sum, fee) => sum + (fee.amount || 0), 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>

      {/* Children Selection */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">My Children</h2>
        <div className="flex gap-4 flex-wrap">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelectChild(child)}
              className={`p-3 rounded border ${
                selectedChild?.id === child.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="font-semibold">{child.name}</div>
              <div className="text-sm text-gray-500">{child.class}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedChild && (
        <>
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {["overview", "results", "attendance", "fees"].map((tab) => (
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

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Attendance</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {getAttendancePercentage()}%
                </div>
                <p className="text-sm text-gray-500">This term</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Academic Performance</h3>
                <div className="text-3xl font-bold text-green-600">
                  {childResults.length > 0 ? "Good" : "N/A"}
                </div>
                <p className="text-sm text-gray-500">Current standing</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Fees Status</h3>
                <div className="text-3xl font-bold text-orange-600">
                  ${getPaidFees()}/{getTotalFees()}
                </div>
                <p className="text-sm text-gray-500">Paid / Total</p>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3 text-left">Subject</th>
                    <th className="border p-3 text-left">Score</th>
                    <th className="border p-3 text-left">Grade</th>
                    <th className="border p-3 text-left">Term</th>
                  </tr>
                </thead>
                <tbody>
                  {childResults.map((result, idx) => (
                    <tr key={idx}>
                      <td className="border p-3">{result.subject || "N/A"}</td>
                      <td className="border p-3">{result.score || "N/A"}</td>
                      <td className="border p-3">{result.grade || "N/A"}</td>
                      <td className="border p-3">{result.term || "N/A"}</td>
                    </tr>
                  ))}
                  {childResults.length === 0 && (
                    <tr>
                      <td colSpan="4" className="border p-3 text-center text-gray-500">
                        No results available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3 text-left">Date</th>
                    <th className="border p-3 text-left">Status</th>
                    <th className="border p-3 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {childAttendance.map((att, idx) => (
                    <tr key={idx}>
                      <td className="border p-3">{att.date || "N/A"}</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          att.status === "present" 
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {att.status || "N/A"}
                        </span>
                      </td>
                      <td className="border p-3">{att.remark || "N/A"}</td>
                    </tr>
                  ))}
                  {childAttendance.length === 0 && (
                    <tr>
                      <td colSpan="3" className="border p-3 text-center text-gray-500">
                        No attendance records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === "fees" && (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3 text-left">Description</th>
                    <th className="border p-3 text-left">Amount</th>
                    <th className="border p-3 text-left">Due Date</th>
                    <th className="border p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {childFees.map((fee, idx) => (
                    <tr key={idx}>
                      <td className="border p-3">{fee.description || "N/A"}</td>
                      <td className="border p-3">${fee.amount || 0}</td>
                      <td className="border p-3">{fee.due_date || "N/A"}</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          fee.status === "paid" 
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {fee.status || "unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {childFees.length === 0 && (
                    <tr>
                      <td colSpan="4" className="border p-3 text-center text-gray-500">
                        No fee records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!selectedChild && (
        <div className="bg-white p-4 rounded shadow text-center text-gray-500">
          Select a child to view their information
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;