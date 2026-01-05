import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Shield,
  UserCircle,
} from "lucide-react";
import Loader from "./Loader";
import { useNavigate  } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ================= Component ================= */

const RegisterAnimation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const UserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      school: formData.school,
      password: formData.password,
    };

    const successful = await register(UserData);
    setLoading(false);

    if (successful) {
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4  overflow-hidden">
      <div  className="sm:absolute sm:inset-0 hidden sm:block sm:overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400 sm:bg-blue-100 rounded-full opacity-20"
          variants={floatVariants}
          animate="slow"
        />
        <motion.div
          className="absolute top-1/4 -left-16 w-36 sm:w-48 h-36 sm:h-48 bg-indigo-500 sm:bg-indigo-100 rounded-full opacity-15"
          variants={floatVariants}
          animate="medium"
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-purple-600 sm:bg-purple-100 rounded-full opacity-10"
          variants={floatVariants}
          animate="fast"
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-gray-600 sm:bg-gray-100 rounded-full opacity-10"
          variants={floatVariants}
          animate="slow"
        />
      </div>

      {/* Floating labels (hidden on small screens) */}
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

        <motion.div
          className="absolute bottom-1/2 left-10"
          variants={bounceVariants}
          animate="slow"
        >
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full shadow-sm">
            Encrypted
          </span>
        </motion.div>

        <motion.div
          className="absolute top-6 right-6"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-green-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
            Education
          </span>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-6 z-30"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
            Fast
          </span>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-4 z-30"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full shadow-sm">
            Easy
          </span>
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        className="z-10 w-full max-w-sm sm:max-w-md lg:max-w-2xl p-6 rounded-xl shadow-xl bg-white/90 backdrop-blur border border-gray-100"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
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
              className="w-20 h-20 object-contain drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
            />
          </motion.div>
        </div>

        {/* Header */}
        <motion.div
          className="mb-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800"
            variants={itemVariants}
          >
            Create Your School Account
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-600 mt-1"
            variants={itemVariants}
          >
            Please enter your details to get started
          </motion.p>
        </motion.div>

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
              Your account has been created successfully.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* First Name */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                  placeholder="Enter first name"
                />
              </div>
            </motion.div>

            {/* Last Name */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </motion.div>

            {/* Username */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                  placeholder="Choose a username"
                />
              </div>
            </motion.div>

            {/* Role */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors appearance-none"
                >
                  <option value="">Select role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                  placeholder="Enter email address"
                />
              </div>
            </motion.div>

            {/* School */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700">
                School
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                  placeholder="Enter school name"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Password must be at least 8 characters long
              </p>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Show Password Toggle */}
            <div className="flex items-center gap-2 text-sm text-gray-700 lg:col-span-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showPassword" className="cursor-pointer">
                Show Password
              </label>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
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

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterAnimation;
