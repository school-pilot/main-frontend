import { useState } from "react";
import { motion } from "framer-motion";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-white overflow-hidden">
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
          <span className="text-sm font-semibold text-green-300 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
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
          <span className="text-sm font-semibold text-yellow-500 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
            Fast
          </span>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-4 z-30"
          variants={bounceVariants}
          animate="medium"
        >
          <span className="text-sm font-semibold text-pink-500 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
            Easy
          </span>
        </motion.div>
      </div>
      {/* Card */}
      <motion.div
        className="z-10 w-full max-w-sm sm:max-w-md lg:max-w-2xl p-6 rounded-xl shadow-xl bg-white/90 backdrop-blur"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <div className="flex justify-center mb-1">
          <motion.img
            src="./src/assets/logo.jpg"
            alt="Company Logo"
            className="w-20 h-20 object-contain"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <div className="mb-2 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Your School Account
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Please enter your details
          </p>
        </div>

        {/* FORM */}
        <motion.form
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* First Name */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Username */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Role */}
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            >
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* School */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <label className="text-sm font-medium">School</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-blue-100 px-3 py-2 rounded-lg outline-none"
            />
          </motion.div>

          {/* Show Password */}
          <div className="flex items-center gap-2 text-sm lg:col-span-2">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>{showPassword ? "Hide Password" : "Show Password"}</span>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="lg:col-span-2 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
          >
            Register
          </motion.button>

          {/* Debug */}
          
            {console.log(JSON.stringify(formData, null, 2))}
          
        </motion.form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-semibold">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterAnimation;
