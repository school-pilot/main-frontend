import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Menu,
  HelpCircle,
  Sun,
  Moon,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import { AdminPanelSettings } from "@mui/icons-material";

const Navbar = ({ toggleSidebar, title, subtitle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        bg-gradient-to-r from-white via-white to-primary-50/30
        shadow-sm border-b border-gray-300
         backdrop-filter
        px-4 py-3
        z-[60]
      "
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="
              lg:hidden p-2 rounded-xl
              bg-primary-50 text-primary-600
              hover:bg-primary-100
              transition-colors duration-200
            "
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title Section */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <AdminPanelSettings className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-primary-600 font-medium">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div
              className="
              relative overflow-hidden rounded-xl
              bg-gradient-to-r from-primary-50/50 to-primary-100/20
              border border-gray-400
            "
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students, teachers, or resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  pl-10 pr-4 py-2 bg-transparent
                  w-64 lg:w-80 xl:w-96
                  focus:outline-none focus:ring-0
                  text-gray-700 placeholder-primary-400
                "
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Icon */}
          <Link
            to="/profile"
            className="
              flex items-center space-x-3 p-2 rounded-xl
              bg-gradient-to-r from-primary-50/50 to-primary-100/20
              hover:from-primary-100 hover:to-primary-200
              border border-gray-300/100
              transition-all duration-200
            "
          >
            <div className="relative">
              <div
                className="
                w-9 h-9 rounded-full
                bg-gradient-to-br from-primary-200 to-primary-300
                flex items-center justify-center
                shadow-sm
              "
              >
                <User className="w-5 h-5 text-primary-700" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2
              bg-gradient-to-r from-primary-50/50 to-primary-100/20
              border border-primary-100/50
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary-500/30
              text-gray-700 placeholder-primary-400
            "
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
