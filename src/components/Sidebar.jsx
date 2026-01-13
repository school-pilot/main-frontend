import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
  Clock,
  School,
  UserCircle,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const baseNavItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
  ];

  const adminNavItems = [
    { path: "/admin/students", icon: Users, label: "Students" },
    { path: "/admin/teachers", icon: UserCircle, label: "Teachers" },
    { path: "/admin/fees", icon: CreditCard, label: "Fees" },
    { path: "/admin/timetable", icon: Clock, label: "Timetable" },
    { path: "/admin/reports", icon: BarChart3, label: "Reports" },
  ];

  const teacherNavItems = [
    { path: "/teacher/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/teacher/scores", icon: BookOpen, label: "Enter Scores" },
    { path: "/teacher/classes", icon: School, label: "My Classes" },
    { path: "/teacher/timetable", icon: Clock, label: "My Timetable" },
  ];

  const studentNavItems = [
    { path: "/student/results", icon: FileText, label: "My Results" },
    { path: "/student/timetable", icon: Clock, label: "Timetable" },
    { path: "/student/profile", icon: UserCircle, label: "Profile" },
  ];

  const superAdminNavItems = [
    { path: "/super-admin/schools", icon: School, label: "Schools" },
    { path: "/super-admin/admins", icon: Users, label: "Admins" },
    { path: "/super-admin/settings", icon: Settings, label: "System Settings" },
  ];

  const academicNavItems = [
    { path: "/academics/classes", icon: School, label: "Classes" },
    { path: "/academics/subjects", icon: BookOpen, label: "Subjects" },
    { path: "/academics/calendar", icon: Calendar, label: "Calendar" },
  ];

  const getNavItems = () => {
    let items = [...baseNavItems];

    if (user?.role === "super_admin") {
      items = [...items, ...superAdminNavItems];
    }

    if (user?.role === "school_admin" || user?.role === "admin") {
      items = [...items, ...adminNavItems];
    }

    if (user?.role === "teacher") {
      items = [...items, ...teacherNavItems];
    }

    if (user?.role === "student") {
      items = [...items, ...studentNavItems];
    }

    // Add academics for appropriate roles
    if (
      ["admin", "teacher", "super_admin", "school_admin"].includes(user?.role)
    ) {
      items.push({
        path: "#",
        icon: GraduationCap,
        label: "Academics",
        children: academicNavItems,
      });
    }

    return items;
  };

  const navItems = getNavItems();

  const renderNavItem = (item) => {
    if (item.children) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            <motion.svg
              animate={{ rotate: expandedMenus[item.label] ? 180 : 0 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>

          {expandedMenus[item.label] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="ml-8 space-y-1"
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-lg text-sm ${
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <child.icon className="w-4 h-4" />
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center space-x-3 p-3 rounded-lg ${
            isActive
              ? "bg-primary-50 text-primary-600"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        className="
    fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
    lg:static lg:translate-x-0
  "
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SchoolPilot</h1>
              <p className="text-xs text-gray-500">Education Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(renderNavItem)}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
