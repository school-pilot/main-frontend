import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* Guards */
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";

/* Layouts */
import DashboardLayout from "../Layouts/DashboardLayout";
import AuthLayout from "../Layouts/AuthLayout";

/* Public Pages */
import NotFound from "../pages/NotFound";

/* Auth Pages */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";

/* Shared Pages */
import Dashboard from "../pages/Dashboard";
import NotificationsPage from "../pages/NotificationsPage";

/* Super Admin */
import SuperAdminDashboard from "../dashboards/superAdmin/SuperAdminDashboard";
import CreateSchool from "../dashboards/superAdmin/CreateSchool";
import ActivateAccounts from "../dashboards/superAdmin/ActivateAccounts";
import AuditLogs from "../dashboards/superAdmin/AuditLogs";
import SuperAdminSettings from "../dashboards/superAdmin/SuperAdminSettings";

/* School Admin */
import SchoolAdminDashboard from "../dashboards/admin/SchoolAdminDashboard";
import CreateTeacher from "../dashboards/admin/Teachers";
import CreateStudent from "../dashboards/admin/Students";
import CreateParent from "../dashboards/admin/CreateParent";
import SchoolSettings from "../dashboards/admin/SchoolSetting";

/* Admin (Legacy) */
import Students from "../dashboards/admin/Students";
import Teachers from "../dashboards/admin/Teachers";
import Fees from "../dashboards/admin/Fees";
import Reports from "../dashboards/admin/Reports";
import TimetableAdmin from "../dashboards/admin/TimetableAdmin";

/* Teacher */
import TeacherDashboard from "../dashboards/teacher/TeacherDashboard";
import Attendance from "../dashboards/teacher/Attendance";
import EnterScores from "../dashboards/teacher/EnterScores";
import MyClasses from "../dashboards/teacher/MyClasses";
import TeacherTimetable from "../dashboards/teacher/TeacherTimetable";

/* Student */
import StudentDashboard from "../dashboards/student/StudentDashboard";
import MyResults from "../dashboards/student/MyResults";
import Timetable from "../dashboards/student/Timetable";
import Profile from "../dashboards/student/Profile";
import Notifications from "../dashboards/student/Notifications";
import StudentFees from "../dashboards/student/StudentFees";

import Home from "../pages/Home";
import AttendanceChart from "../dashboards/admin/analytics/AttendanceChart";


const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return "/";

    switch (user.role) {
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
      {/* ================= PUBLIC ================= */}
      <Route
        index
        path="/"
        element={
          !isAuthenticated ? (
            <Home />
          ) : (
            <Navigate to={getDefaultRoute()} replace />
          )
        }
      />



      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROTECTED ================= */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="change-password" element={<ChangePassword />} />

          {/* ===== SUPER ADMIN ===== */}
          <Route element={<RequireRole allowedRoles={["super_admin"]} />}>
            <Route path="super-admin">
              <Route index element={<SuperAdminDashboard />} />
              <Route path="create-school" element={<CreateSchool />} />
              <Route path="activate-accounts" element={<ActivateAccounts />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="settings" element={<SuperAdminSettings />} />
            </Route>
          </Route>

          {/* ===== SCHOOL ADMIN ===== */}
          <Route element={<RequireRole allowedRoles={["school_admin"]} />}>
            <Route path="school-admin">
              <Route index element={<SchoolAdminDashboard />} />
              <Route path="create-teacher" element={<CreateTeacher />} />
              <Route path="create-student" element={<CreateStudent />} />
              <Route path="create-parent" element={<CreateParent />} />
              <Route path="school-settings" element={<SchoolSettings />} />
            </Route>
          </Route>

          {/* ===== ADMIN (LEGACY) ===== */}
          <Route
            element={
              <RequireRole
                allowedRoles={["super_admin", "school_admin", "admin"]}
              />
            }
          >
            <Route path="admin">
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="fees" element={<Fees />} />
              <Route path="reports" element={<Reports />} />
              <Route path="timetable" element={<TimetableAdmin />} />
            </Route>
          </Route>

          {/* ===== TEACHER ===== */}
          <Route element={<RequireRole allowedRoles={["teacher"]} />}>
            <Route path="teacher">
              <Route index element={<TeacherDashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="enter-scores" element={<EnterScores />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="timetable" element={<TeacherTimetable />} />
            </Route>
          </Route>

          {/* ===== STUDENT ===== */}
          <Route element={<RequireRole allowedRoles={["student"]} />}>
            <Route path="student">
              <Route index element={<StudentDashboard />} />
              <Route path="results" element={<MyResults />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="StudentFees" element={<StudentFees />} />
              <Route path="attendance" element={<AttendanceChart />} />
            </Route>
          </Route>

          {/* ===== PARENT ===== */}
          <Route element={<RequireRole allowedRoles={["parent"]} />}>
            <Route path="parent">
              <Route index element={<StudentDashboard />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
