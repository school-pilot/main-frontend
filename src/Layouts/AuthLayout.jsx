// AuthLayout.jsx
import { motion } from "framer-motion";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const floatVariants = {
    slow: {
      y: [0, -20, 0],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
    medium: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      },
    },
    fast: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      },
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* REMOVE: bg-red-500 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl" // Increase max-width
      >
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
        {/* Logo - Keep this if you want it */}
        <div className="text-center mb-6">
          <div className="inline-flex rounded-2xl mb-1">
            <img
              src="/logo.jpg"
              alt="Company Logo"
              className="w-15 h-15 object-contain drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
            />
          </div>
          <h1 className=" mt-[-7px] text-3xl font-bold text-gray-900">
            SchoolPilot
          </h1>
          <p className="text-gray-600 mt-[-7px]">Education Management System</p>
        </div>

        {/* Form Container - Make it transparent */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="w-full" // REMOVE: bg-yellow-400, rounded-2xl, shadow-lg, p-8
        >
          <Outlet />
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-5">
          © {new Date().getFullYear()} SchoolPilot. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
