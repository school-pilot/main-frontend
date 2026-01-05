import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

/* ================= Animations (UNCHANGED) ================= */

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ================= Component ================= */

const LoginAnimation = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle login logic here
      console.log("Login attempt:", formData);
    }, 1500);
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-white-500 to-white">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
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
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full shadow-sm">
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

      {/* Login Card */}
      <motion.div
        className="z-10 w-full max-w-sm sm:max-w-md p-5 sm:p-6 backdrop-blur-sm rounded-lg shadow-xl border border-gray-100"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center mb-3">
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
            <img   src="/logo.jpg"
            alt="Company Logo"
            className="w-20 h-20 object-contain drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]" />
          </motion.div>
        </div>

        <motion.div
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800"
            variants={itemVariants}
          >
            Welcome back
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-600 mt-1"
            variants={itemVariants}
          >
            Welcome back! Please enter your details
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={formData.email}
                name="email"
                onChange={handleChange}
                className="w-full bg-blue-50 px-10 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-blue-50 px-10 pr-12 py-2.5 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <a
              className="text-sm text-blue-600 hover:underline pointer"
              href="/change-password"
            >
              Forgot password?
            </a>
          </div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </motion.div>

          {/* for debugging */}
          {console.log(`${formData.email} ${formData.password}`)}
        </motion.form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginAnimation;