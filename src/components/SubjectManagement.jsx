import { useState, useEffect } from "react";
import { academicsAPI } from "../services/api";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await academicsAPI.subjects();
      // Handle both { subjects: [...] } and [...] response formats
      const data = response.data.subjects || response.data;
      setSubjects(data);
    } catch (err) {
      setError("Failed to load subjects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (editingSubject) {
        // Update existing subject
        await academicsAPI.updateSubject(editingSubject.id, formData);
        setSuccess("Subject updated successfully");
      } else {
        // Create new subject
        await academicsAPI.createSubject(formData);
        setSuccess("Subject created successfully");
      }
      setShowModal(false);
      setFormData({ name: "", code: "", description: "" });
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await academicsAPI.deleteSubject(subjectId);
      setSuccess("Subject deleted successfully");
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", code: "", description: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({ name: "", code: "", description: "" });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <span>+</span> Add Subject
        </button>
      </div>

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}

      {/* Subjects Grid */}
      {!loading && subjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No subjects found. Click "Add Subject" to create one.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-lg">{subject.name}</div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {subject.code}
              </span>
            </div>
            
            {subject.description && (
              <p className="text-gray-600 text-sm mb-3">{subject.description}</p>
            )}
            
            <div className="text-xs text-gray-400 mb-3">
              Created: {new Date(subject.created_at).toLocaleDateString()}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(subject)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g. MATH101"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingSubject ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;