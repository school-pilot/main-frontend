import { useState } from "react";
import { BellPlus, Send, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import toast from "react-hot-toast";

const CreateNotification = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Role Restriction
  const allowedRoles = ["school_admin"];
  const isAuthorized = allowedRoles.includes(user?.role);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    const newNotification = {
      id: Date.now(), // temporary id
      title,
      message,
      read: false,
      created_at: new Date().toISOString(),
    };

    addNotification(newNotification);

    toast.success("Notification created successfully");

    setTitle("");
    setMessage("");
    setLoading(false);
  };

  // ❌ Unauthorized View
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
          <ShieldAlert className="mx-auto text-red-500 mb-3" size={40} />
          <h2 className="text-lg font-semibold text-red-600">
            Access Denied
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Only Super Admin or Admin can create notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <BellPlus className="text-blue-600" size={28} />
        <h2 className="text-xl font-bold text-gray-800">
          Create Notification
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter notification title"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            rows="4"
            placeholder="Enter notification message"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Send size={18} />
          {loading ? "Creating..." : "Create Notification"}
        </button>
      </form>
    </div>
  );
};

export default CreateNotification;