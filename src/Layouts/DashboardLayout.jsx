import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  School,
  Users,
  User,
  Settings,
  BarChart3,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bell,
  BookOpen,
  CreditCard,
  Home,
  Shield,
  UserPlus,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Clock,
  Building,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  Package,
  Layers,
  HelpCircle,
} from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { text: "Dashboard", icon: LayoutDashboard, path: "/" },
      { text: "Notifications", icon: Bell, path: "/notifications" },
    ];

    switch (user.role?.toLowerCase()) {
      case "super_admin":
        return [
          ...baseItems,
          {
            text: "Create School",
            icon: Building,
            path: "/super-admin/create-school",
          },
          {
            text: "Activate Accounts",
            icon: Shield,
            path: "/super-admin/activate-accounts",
          },
          {
            text: "Audit Logs",
            icon: History,
            path: "/super-admin/audit-logs",
          },
          {
            text: "System Settings",
            icon: Settings,
            path: "/super-admin/settings",
          },
        ];
      case "school_admin":
        return [
          ...baseItems,
          { text: "Schools", icon: School, path: "/admin/schools" },
          { text: "Students", icon: Users, path: "/admin/students" },
          { text: "Teachers", icon: UserPlus, path: "/admin/teachers" },
          { text: "Parents", icon: Users, path: "/admin/parents" },
          { text: "Classes", icon: GraduationCap, path: "/admin/classes" },
          { text: "Subjects", icon: BookOpen, path: "/admin/subjects" },
          { text: "Sessions", icon: Calendar, path: "/admin/sessions" },
          { text: "Timetable", icon: Clock, path: "/admin/timetable" },
          {
            text: "Attendance",
            icon: ClipboardCheck,
            path: "/admin/attendance",
          },
          { text: "Results", icon: FileText, path: "/admin/results" },
          { text: "Fees", icon: CreditCard, path: "/admin/fees" },
          { text: "Reports", icon: BarChart3, path: "/admin/reports" },
          {
            text: "School Settings",
            icon: Settings,
            path: "/school-admin/school-settings",
          },
        ];
      case "teacher":
        return [
          ...baseItems,
          {
            text: "Mark Attendance",
            icon: ClipboardCheck,
            path: "/teacher/attendance",
          },
          { text: "Enter Scores", icon: FileText, path: "/teacher/scores" },
          { text: "Timetable", icon: Clock, path: "/teacher/timetable" },
          { text: "My Classes", icon: School, path: "/teacher/classes" },
          {
            text: "Study Materials",
            icon: BookOpen,
            path: "/teacher/materials",
          },
        ];
      case "student":
        return [
          ...baseItems,
          { text: "My Results", icon: Award, path: "/student/results" },
          { text: "My Profile", icon: User, path: "/student/profile" },
          { text: "Timetable", icon: Clock, path: "/student/timetable" },
          { text: "Attendance", icon: TrendingUp, path: "/student/attendance" },
          { text: "Fee Statement", icon: CreditCard, path: "/student/fees" },
        ];
      case "parent":
        return [
          ...baseItems,
          { text: "My Children", icon: Users, path: "/parent/children" },
          { text: "Academic Results", icon: Award, path: "/parent/results" },
          { text: "Attendance", icon: TrendingUp, path: "/parent/attendance" },
          { text: "Fee Payments", icon: CreditCard, path: "/parent/fees" },
          { text: "School Calendar", icon: Calendar, path: "/parent/calendar" },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: "Super Admin",
      school_admin: "School Admin",
      teacher: "Teacher",
      student: "Student",
      parent: "Parent",
    };
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/20">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="
  fixed inset-0 
  bg-white/10 
  backdrop-blur-lg backdrop-saturate-200 backdrop-filter
  z-30 lg:hidden 
  transition-all duration-300
"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${collapsed ? "w-20" : "w-58"} lg:translate-x-0
            flex flex-col
            bg-gradient-to-b from-white via-white to-primary-50/30
            border-r border-gray-300
            shadow-lg shadow-primary-100/20
            backdrop-blur-sm backdrop-filter
          `}
        >
          {/* Logo Section */}
          <div
            className={`
            p-4 border-b border-gray-300
            bg-gradient-to-r from-primary-600/5 to-primary-500/5
            transition-all duration-300
            ${collapsed ? "px-2" : "px-4"}
          `}
          >
            <div
              className={`
              flex items-center justify-between
              ${collapsed ? "justify-center" : ""}
            `}
            >
              {!collapsed ? (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <img src="/logo.jpg" className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                      SchoolPilot
                    </h1>
                    <p className="text-xs text-primary-600 font-medium truncate">
                      {user?.school_name || "Education Management"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <img src="/logo.jpg" className="w-8 h-8" />
                </div>
              )}

              <button
                onClick={() => setCollapsed(!collapsed)}
                className={`
                  lg:flex items-center justify-center w-8 h-8 rounded-lg
                  bg-primary-50 text-primary-600 hover:bg-primary-100
                  hidden transition-all duration-300
                  ${collapsed ? "rotate-180" : ""}
                `}
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* User Info Section */}
          <div
            className={`
            p-4 border-b border-gray-200
            bg-gradient-to-r from-primary-50/30 to-transparent
            transition-all duration-300
            ${collapsed ? "px-2" : "px-4"}
          `}
          >
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <div className="relative">
                <div
                  className={`
                  rounded-full bg-gradient-to-br from-primary-100 to-primary-200
                  border-2 border-white shadow-sm
                  ${collapsed ? "w-10 h-10" : "w-12 h-12"}
                  flex items-center justify-center
                `}
                >
                  <User
                    className={`
                    text-indigo-500
                    ${collapsed ? "w-5 h-5" : "w-6 h-6"}
                  `}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white" />
              </div>

              {!collapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-primary-600 font-medium truncate">
                    {getRoleDisplayName(user?.role)}
                  </p>
                  {user?.school_name && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {user.school_name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.text}
                    onClick={() => {
                      navigate(item.path);
                      if (sidebarOpen) setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center rounded-xl
                      transition-all duration-200
                      group relative overflow-hidden cursor-pointer
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500/100 to-indigo-600/80 text-white"
                          : "text-gray-700 hover:bg-primary-50/50 hover:text-primary-600"
                      }
                      ${
                        collapsed
                          ? "justify-center px-2 py-3"
                          : "px-4 py-3 space-x-3"
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-indigo-500 rounded-r-full" />
                    )}

                    <div
                      className={`
                      flex items-center justify-center
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-primary-600"
                      }
                      transition-colors duration-200
                    `}
                    >
                      <item.icon
                        className={collapsed ? "w-5 h-5" : "w-5 h-5"}
                      />
                    </div>

                    {!collapsed && (
                      <span className="flex-1 text-sm font-medium text-left transition-all duration-200">
                        {item.text}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div
                        className="
                        absolute left-full ml-2 px-3 py-2
                        bg-gradient-to-r from-gray-900 to-gray-800
                        text-white text-xs rounded-lg
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-200
                        whitespace-nowrap
                        shadow-lg
                        z-50
                      "
                      >
                        {item.text}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div
            className={`
            p-4 border-t border-gray-300
            bg-gradient-to-r from-primary-50/20 to-transparent
            space-y-2
            transition-all duration-300
            ${collapsed ? "px-2" : "px-4"}
          `}
          >
            {/* Quick Actions */}

            {/* Settings & Logout */}
            <div className="space-y-1">
              <button
                onClick={() => navigate("/change-password")}
                className={`
                  w-full flex items-center rounded-xl
                  text-gray-700 hover:bg-primary-50/50 hover:text-primary-600
                  transition-all duration-200
                  ${
                    collapsed
                      ? "justify-center px-2 py-3"
                      : "px-4 py-3 space-x-3"
                  }
                `}
              >
                <Settings className={collapsed ? "w-5 h-5" : "w-5 h-5"} />
                {!collapsed && (
                  <span className="flex-1 text-sm font-medium text-left">
                    Change Password
                  </span>
                )}
              </button>

              <button
                onClick={logout}
                className={`
                  w-full flex items-center rounded-xl
                  text-red-600 hover:bg-red-50/50
                  transition-all duration-200
                  ${
                    collapsed
                      ? "justify-center px-2 py-3"
                      : "px-4 py-3 space-x-3"
                  }
                `}
              >
                <LogOut className={collapsed ? "w-5 h-5" : "w-5 h-5"} />
                {!collapsed && (
                  <span className="flex-1 text-sm font-medium text-left">
                    Logout
                  </span>
                )}
              </button>
            </div>

            {/* Version Info */}
            {!collapsed && (
              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-400 text-center">
                  v1.0.0 • SchoolPilot
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            title={`Welcome back, ${user?.first_name || "User"}!`}
            subtitle={getRoleDisplayName(user?.role)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
