import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Mail,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";

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

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

/* ================= Component ================= */

const ThankYouWaitlist = () => {
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  useEffect(() => {
    // Calculate days until next quarter launch (example: next quarter start)
    const today = new Date();
    const currentQuarter = Math.floor((today.getMonth() / 3));
    const nextQuarterStart = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 1);
    const daysLeft = Math.ceil((nextQuarterStart - today) / (1000 * 60 * 60 * 24));
    setDaysUntilLaunch(daysLeft);

    // Random waitlist position for demo (in real app, this would come from API)
    setWaitlistPosition(Math.floor(Math.random() * 500) + 1);
  }, []);

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
            <span className="text-sm font-semibold">Successfully Joined</span>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          {/* Header Section with Confetti Effect */}
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
              Thank you for joining our waitlist. We're thrilled to have you on
              board for this exciting journey!
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
                    Confirmation Email Sent
                  </span>
                </div>
                <p className="text-gray-700">
                  We've sent a confirmation email to your inbox. Please check
                  your email and confirm your subscription to stay updated on
                  our launch progress.
                </p>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    📫 Didn't receive the email? Check your spam folder or{" "}
                    <button className="text-blue-600 hover:underline font-semibold">
                      click here to resend
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>

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
                      Confirmation Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      Verify your email address to stay updated
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-indigo-50 rounded-xl p-6 text-center h-full">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Early Access Updates
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive exclusive updates about our launch progress
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

            {/* Share Section */}
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
                Invite other schools to join the waitlist and unlock exclusive
                rewards
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Linkedin className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Twitter className="w-4 h-4" />
                  Tweet
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#E4405F] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Instagram className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Globe className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-6 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </motion.button>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Start Registration
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            © 2024 SchoolPilot. All rights reserved. |{" "}
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouWaitlist;