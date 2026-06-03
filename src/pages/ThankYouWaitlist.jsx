import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Mail,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Star,
  School,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { authAPI } from "../services/api.js"; // Adjust import path as needed

/* ================= Animations ================= */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/* ================= Component ================= */

const ThankYouWaitlist = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getCurrentUser();
        
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Unable to load your information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Calculate days until next quarter launch (example: next quarter start)
    const today = new Date();
    const currentQuarter = Math.floor((today.getMonth() / 3));
    const nextQuarterStart = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 1);
    const daysLeft = Math.ceil((nextQuarterStart - today) / (1000 * 60 * 60 * 24));
    setDaysUntilLaunch(daysLeft);

    // Random waitlist position for demo (in real app, this would come from API)
    setWaitlistPosition(Math.floor(Math.random() * 500) + 1);
  }, []);

  const handleCopyLink = async () => {
    const currentUrl = window.location.origin + "/register";
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = currentUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const clearUserStorage = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if (window.caches && typeof window.caches.keys === "function") {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
      }
    } catch (err) {
      console.error("Failed to clear storage/cache:", err);
    }
  };

  const handleBackHome = async () => {
    await clearUserStorage();
    navigate("/", { replace: true });
  };

  const features = [
    {
      icon: Award,
      title: "Early Access Priority",
      description: "Be among the first 1000 schools to access our platform",
    },
    {
      icon: TrendingUp,
      title: "Exclusive Launch Discount",
      description: "Get 50% off for the first 6 months after launch",
    },
    {
      icon: Shield,
      title: "Premium Support",
      description: "Dedicated support team for early adopters",
    },
    {
      icon: Star,
      title: "Beta Tester Benefits",
      description: "Shape the product with your feedback and suggestions",
    },
  ];

  const stats = [
    { value: "500+", label: "Schools Joined", icon: Users },
    { value: daysUntilLaunch, label: "Days Until Launch", icon: Clock },
    { value: waitlistPosition, label: "Your Position", icon: TrendingUp },
    { value: "24/7", label: "Support Available", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={handleBackHome}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Success Badge */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Successfully Registered</span>
          </div>
        </motion.div>

        <div className="text-center mb-6">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>

        {/* Welcome Card with User Info */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center gap-4 flex-wrap">
            {userData?.image && (
              <img
                src={userData.image}
                alt={userData.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome, {userData?.firstName} {userData?.lastName}! 👋
              </h2>
              <p className="text-gray-600">{userData?.email}</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <School className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">
                {userData?.school?.schoolName}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-12 md:py-16 text-center overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                  initial={{ x: Math.random() * 100 + "%", y: -10 }}
                  animate={{
                    y: ["0%", "100%"],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                  style={{ left: Math.random() * 100 + "%" }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Mail className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              You're on the List! 🎉
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Thank you for joining our waitlist, {userData?.firstName}! We're thrilled to have {userData?.school?.schoolName} on board for this exciting journey!
            </motion.p>
          </div>

          {/* Confirmation Message */}
          <div className="px-6 py-8 border-b border-gray-100">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-semibold">
                    Keep Your Inbox Ready!
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  We'll send updates and exclusive content to <strong>{userData?.email}</strong> about our progress. 
                  You'll be the first to know when we're ready to launch!
                </p>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm text-yellow-800 font-semibold mb-1">
                        📧 Email Updates Coming Soon
                      </p>
                      <p className="text-sm text-yellow-700">
                        We won't spam you! You'll receive periodic updates about:
                      </p>
                      <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                        <li>Launch progress and milestones</li>
                        <li>Exclusive early access opportunities</li>
                        <li>Special discounts for waitlist members</li>
                        <li>Feature previews and beta testing invites</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    ✨ <strong>Good to know:</strong> We'll notify you via email when the system is ready. 
                    No immediate action needed - just sit back and watch your inbox for exciting updates!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* School Info Card */}
            {userData?.school && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8"
              >
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <School className="w-5 h-5 text-indigo-600" />
                  Your School Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">School Name</p>
                    <p className="font-medium text-gray-800">{userData.school.schoolName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-800">
                      {[userData.school.city, userData.school.state, userData.school.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{userData.school.schoolEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-800">{userData.school.address || "Not provided"}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Section */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-100 shadow-sm"
                  >
                    <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                What's Next?
              </h2>
              <p className="text-gray-600 mb-8">
                Here's what you can expect in the coming weeks
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative">
                  <div className="bg-blue-50 rounded-xl p-6 text-center h-full">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Registration Complete
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your school is now registered in our system
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-indigo-50 rounded-xl p-6 text-center h-full">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-gray-600">
                      We'll keep you posted on launch progress via email
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-purple-50 rounded-xl p-6 text-center h-full">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Launch Day Access
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get priority access when we go live
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Exclusive Benefits */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                Exclusive Waitlist Benefits
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Share Section - Updated with only Copy Link */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Share the Excitement!
              </h3>
              <p className="text-gray-600 mb-4">
                Invite other schools to join the waitlist and unlock exclusive rewards
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Copy Registration Link
                    </>
                  )}
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-600 mt-3"
                >
                  ✓ Link copied to clipboard!
                </motion.p>
              )}
            </motion.div>
          </div>

         
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            © 2024 SchoolPilot. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouWaitlist;