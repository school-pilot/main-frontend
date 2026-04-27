import { useState, useEffect } from "react";
import { communicationsAPI } from "../../services/api";

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_audience: "all",
    priority: "normal",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await communicationsAPI.announcements();
      const data =
        res?.data?.data || 
        res?.data?.announcements || 
        res?.data || 
        [];

        setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load announcements");
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
      if (editingId) {
        await communicationsAPI.updateAnnouncement(editingId, formData);
        setSuccess("Announcement updated successfully");
      } else {
        await communicationsAPI.createAnnouncement(formData);
        setSuccess("Announcement created successfully");
      }
      setFormData({
        title: "",
        message: "",
        target_audience: "all",
        priority: "normal",
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      target_audience: announcement.target_audience || "all",
      priority: announcement.priority || "normal",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: "",
      message: "",
      target_audience: "all",
      priority: "normal",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Announcements Management</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full border p-2 rounded h-32"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Target Audience
              </label>
              <select
                value={formData.target_audience}
                onChange={(e) =>
                  setFormData({ ...formData, target_audience: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="staff">Staff</option>
                <option value="parents">Parents</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Announcements</h2>
          {loading && <p>Loading...</p>}
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.message}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {announcement.target_audience || "all"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          announcement.priority === "urgent" ||
                          announcement.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {announcement.priority || "normal"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && !loading && (
              <p className="text-gray-500">No announcements yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
