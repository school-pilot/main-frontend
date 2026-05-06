import { useState, useEffect } from "react";
import { academicsAPI } from "../../services/api";

const AcademicsManagement = () => {
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("classes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [className, setClassName] = useState("");
  const [armName, setArmName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        academicsAPI.classes(),
        academicsAPI.subjects(),
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError("Failed to load academic data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await academicsAPI.createClasses({ name: className });
      setSuccess("Class created successfully");
      setClassName("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await academicsAPI.createArm({ name: armName });
      setSuccess("Arm created successfully");
      setArmName("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create arm");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await academicsAPI.createSubject({ name: subjectName, code: subjectCode });
      setSuccess("Subject created successfully");
      setSubjectName("");
      setSubjectCode("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Academics Management</h1>
      
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
        {["classes", "arms", "subjects"].map((tab) => (
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

      {/* Classes Tab */}
      {activeTab === "classes" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Classes</h2>
          <form onSubmit={handleCreateClass} className="flex gap-2 mb-4">
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              className="border p-2 rounded flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Class"}
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="border p-3 rounded">
                {cls.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arms Tab */}
      {activeTab === "arms" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Arms</h2>
          <form onSubmit={handleCreateArm} className="flex gap-2 mb-4">
            <input
              type="text"
              value={armName}
              onChange={(e) => setArmName(e.target.value)}
              placeholder="Enter arm name"
              className="border p-2 rounded flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Arm"}
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {arms.map((arm) => (
              <div key={arm.id} className="border p-3 rounded">
                {arm.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === "subjects" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Subjects</h2>
          <form onSubmit={handleCreateSubject} className="flex gap-2 mb-4">
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Subject name"
              className="border p-2 rounded flex-1"
              required
            />
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Subject code"
              className="border p-2 rounded w-32"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Subject"}
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="border p-3 rounded">
                <div className="font-semibold">{sub.name}</div>
                <div className="text-sm text-gray-500">{sub.code}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicsManagement;