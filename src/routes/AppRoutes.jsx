import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider, useAuth } from "../context/AuthContext";
import PrivateRoute from "../routes/PrivateRoute";
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";

import DashboardLayout from "../Layouts/DashboardLayout";
import AuthLayout from "../Layouts/AuthLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";

// Main Pages
import Dashboard from "../pages/Dashboard";
import NotificationsPage from "../pages/NotificationsPage";
import NotFound from "../pages/NotFound";
import Landing from "../components/Landing";

// Super Admin Components
import SuperAdminDashboard from "../dashboards/superAdmin/SuperAdminDashboard";
import CreateSchool from "../dashboards/superAdmin/CreateSchool";
import ActivateAccounts from "../dashboards/superAdmin/ActivateAccounts";
import AuditLogs from "../dashboards/superAdmin/AuditLogs";

// School Admin Components
import SchoolAdminDashboard from "../dashboards/admin/SchoolAdminDashboard";
import CreateTeacher from "../dashboards/admin/Teachers";
import CreateStudent from "../dashboards/admin/Students";
import CreateParent from "../dashboards/admin/CreateParent";
import SchoolSettings from "../dashboards/admin/SchoolSetting";

// Admin Pages (Original)
import Students from "../dashboards/admin/Students";
import Teachers from "../dashboards/admin/Teachers";
import Fees from "../dashboards/admin/Fees";
import Reports from "../dashboards/admin/Reports";
import TimetableAdmin from "../dashboards/admin/TimetableAdmin";

// Teacher Pages
import TeacherDashboard from "../dashboards/teacher/TeacherDashboard";
import EnterScores from "../dashboards/teacher/EnterScores";
import TeacherTimetable from "../dashboards/teacher/TeacherTimetable";
import Attendance from "../dashboards/teacher/Attendance";
import MyClasses from "../dashboards/teacher/MyClasses";

// Student Pages
import StudentDashboard from "../dashboards/student/StudentDashboard";
import MyResults from "../dashboards/student/MyResults";
import Timetable from "../dashboards/student/Timetable";
import Profile from "../dashboards/student/Profile";
import Notifications from "../dashboards/student/Notifications";
import SuperAdminSettings from "../dashboards/superAdmin/SuperAdminSettings";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return "/";
    if (!user) return "/";

    switch (user.role?.toLowerCase()) {
      case "super_admin":
        return "/super-admin";
      case "school_admin":
        return "/school-admin";
      case "teacher":
        return "/teacher";
      case "student":
        return "/student";
      case "parent":
        return "/parent";
      default:
        return "/";
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to={getDefaultRoute()} />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes - Using DashboardLayout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Super Admin Routes */}
        <Route
          path="super-admin"
          element={
            <RequireRole allowedRoles={["super_admin"]} />
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="create-school" element={<CreateSchool />} />
          <Route path="activate-accounts" element={<ActivateAccounts />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>

        {/* School Admin Routes */}
        <Route
          path="school-admin"
          element={
            <RequireRole allowedRoles={["school_admin"]} />
          }
        >
          <Route index element={<SchoolAdminDashboard />} />
          <Route path="create-teacher" element={<CreateTeacher />} />
          <Route path="create-student" element={<CreateStudent />} />
          <Route path="create-parent" element={<CreateParent />} />
          <Route path="settings" element={<SchoolSettings />} />
        </Route>

        {/* Admin Routes (Original) */}
        <Route
          path="admin"
          element={
            <RequireRole allowedRoles={["super_admin", "school_admin", "admin"]} />
          }
        >
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="fees" element={<Fees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="timetable" element={<TimetableAdmin />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="teacher"
          element={<RequireRole allowedRoles={["teacher"]} />}
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
        
     
          <Route path="enter-scores" element={<EnterScores />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="timetable" element={<TeacherTimetable />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="student"
          element={<RequireRole allowedRoles={["student"]} />}
        >
          <Route index element={<StudentDashboard />} />
          <Route path="results" element={<MyResults />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Parent Routes */}
        <Route
          path="parent"
          element={<RequireRole allowedRoles={["parent"]} />}
        >
          <Route index element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;