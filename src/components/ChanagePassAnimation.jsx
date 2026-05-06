import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Key, Shield, CheckCircle, Eye, EyeOff } from "lucide-react";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ChangePassAnimation = () => {
  const { changePassword } = useAuth();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleAllPasswords = () => {
    const allVisible = Object.values(showPassword).every(Boolean);
    setShowPassword({
      current: !allVisible,
      new: !allVisible,
      confirm: !allVisible,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.new_password !== formData.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.old_password === formData.new_password) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const success = await changePassword({
        current_password: formData.old_password,
        new_password: formData.new_password,
      });

      if (success) {
        setSuccess(true);
        setFormData({
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        });
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <motion.div
        className="w-full max-w-lg" // Increased from max-w-md to max-w-lg
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
            <img
              src="/logo.jpg"
              alt="Company Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Update Password
          </h1>
          <p className="text-gray-600">
            Secure your account with a new password
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <motion.div
            className="p-6 bg-green-50 border border-green-200 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Password Updated Successfully
            </h3>
            <p className="text-green-600 mb-4">
              Your password has been changed. Please use your new password for future logins.
            </p>
            <a
              href="/"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </a>
          </motion.div>
        ) : (
          /* Form */
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" // Increased padding to p-8
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y to 6 */}
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirm_new_password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Show All Passwords Toggle */}
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  id="showAllPasswords"
                  checked={
                    showPassword.current &&
                    showPassword.new &&
                    showPassword.confirm
                  }
                  onChange={toggleAllPasswords}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="showAllPasswords"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show all passwords
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 pt-5 border-t border-gray-100 text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to Login
              </a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePassAnimation;