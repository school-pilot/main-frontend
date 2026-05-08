// AuthLoader.jsx
import { motion } from "framer-motion";

const AuthLoader = ({ size = "md", fullScreen = false, text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-[3px]",
    lg: "w-14 h-14 border-4"
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      
      {/* Outer Glow Pulse */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute w-16 h-16 rounded-full bg-blue-100 opacity-40 blur-md"
      />

      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-gray-200 border-t-blue-600 rounded-full shadow-md`}
      />

      {/* Optional Text */}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default AuthLoader;