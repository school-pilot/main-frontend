import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Shield,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ================= Animations ================= */

const floatVariants = {
  slow: {
    y: [0, -20, 0],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
  medium: {
    y: [0, -15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
  },
  fast: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 },
  },
};

const bounceVariants = {
  slow: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  medium: {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ================= Component ================= */

const RegisterAnimation = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    school: "",
    password1: "",
    password2: "",
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password1 !== formData.password2) {
      toast.error("Passwords do not match!");
      return;
    }

    // Basic validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.username ||
      !formData.password1 ||
      !formData.password2
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    setSuccess(false); // Reset success state

    // Format data to match Django API expectations
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username,
      password: formData.password1,
      password2: formData.password2,
      role: "school_admin", // Set role to school_admin internally
      school: formData.school || "", // Might need to be school_id instead
    };

    try {
      console.log("🔄 Sending registration request...");

      // Call register and WAIT for response
      const result = await register(userData);
      console.log("📋 Registration result:", result);

      setLoading(false);

      // FIX: Only show success if backend actually succeeded
      if (result && result.success) {
        console.log("✅ Registration successful on backend");
        setSuccess(true);

        // Show success message
        toast.success(
          result.hasTokens
            ? "Registration successful! You are now logged in."
            : "Registration successful! Please login."
        );

        // Only navigate if we have tokens (auto-login)
        if (result.hasTokens) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        // Registration failed - show error
        const errorMsg =
          result?.error || "Registration failed. Please try again.";
        console.error("❌ Registration failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      setLoading(false);
      console.error("🔥 Registration error caught:", error);
      toast.error(
        "An unexpected error occurred. Please check your network connection."
      );
    }
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 sm:px-6 py-8 overflow-hidden">
      {/* Floating labels */}
      <div className="hidden sm:block">
        <motion.div
          className="absolute top-6 left-10"
          variants={bounceVariants}
          animate="slow"
        >
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
            Secure
          </span>
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-10 z-30"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full shadow-sm">
            Reliable
          </span>
        </motion.div>
        <motion.div
          className="absolute bottom-24 left-20 z-30"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
            Protected
          </span>
        </motion.div>
      </div>

      {/* Card with scrollable content */}
      <motion.div
        className="z-10 w-full max-w-md lg:max-w-2xl"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Back button for mobile */}
        <motion.button
          onClick={() => navigate(-1)}
          className="sm:hidden flex items-center gap-2 text-gray-600 mb-1 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <div className="rounded-xl shadow-xl bg-white/90 backdrop-blur border border-gray-100 overflow-hidden">
          {/* Logo and Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.div
                className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="Company Logo"
                  className="w-16 h-16 object-contain drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
                />
              </motion.div>

              <div className="text-center sm:text-left">
                <motion.h2
                  className="text-xl sm:text-2xl font-bold text-gray-800"
                  variants={itemVariants}
                >
                  Create Your School Account
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-600 mt-1"
                  variants={itemVariants}
                >
                  Please enter your details to get started
                </motion.p>
              </div>
            </div>
          </div>

          {/* Scrollable form container */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
            {success ? (
              <motion.div
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800">
                  Registration Successful!
                </h3>
                <p className="text-green-600 mt-1">
                  Your account has been created successfully. Redirecting to
                  login...
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Personal Information Section */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter first name"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Information Section */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <UserCircle className="w-5 h-5" />
                    <h3 className="font-semibold">Account Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Password Section */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-semibold">Password</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Password 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword1 ? "text" : "password"}
                          required
                          name="password1"
                          value={formData.password1}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm pr-10"
                          placeholder="Create a password"
                          minLength="8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword1(!showPassword1)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword1 ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    {/* Password 2 (Confirm) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword2 ? "text" : "password"}
                          required
                          name="password2"
                          value={formData.password2}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm pr-10"
                          placeholder="Confirm your password"
                          minLength="8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(!showPassword2)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword2 ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Show Password Toggle for password1 */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        id="showPassword1"
                        checked={showPassword1}
                        onChange={() => setShowPassword1(!showPassword1)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="showPassword1" className="cursor-pointer">
                        Show Password
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div className="pt-2" variants={itemVariants}>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div className="pt-4" variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Register Account</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterAnimation;
