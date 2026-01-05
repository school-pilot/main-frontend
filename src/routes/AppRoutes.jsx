import { Routes, Route } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";

import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";

// Main Pages
import Dashboard from "../pages/Dashboard";
import NotificationsPage from "../pages/NotificationsPage";
import NotFound from "../pages/NotFound";

// Admin Pages
import Students from "../dashboards/admin/Students";
import Teachers from "../dashboards/admin/Teachers";
import Fees from "../dashboards/admin/Fees";
import Reports from "../dashboards/admin/Reports";
import TimetableAdmin from "../dashboards/admin/TimetableAdmin";

// Teacher Pages
import TeacherDashboard from "../dashboards/teacher/TeacherDashboard";
import Attendance from "../dashboards/teacher/Attendance";
import EnterScores from "../dashboards/teacher/EnterScores";
import MyClasses from "../dashboards/teacher/MyClasses";
import TeacherTimetable from "../dashboards/teacher/TeacherTimetable";

// Student Pages
import StudentDashboard from "../dashboards/student/StudentDashboard";
import MyResults from "../dashboards/student/MyResults";
import Timetable from "../dashboards/student/Timetable";
import Profile from "../dashboards/student/Profile";
import AuthLayout from "../Layouts/AuthLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes for all users */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Protected Routes */}
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
        <Route path="change-password" element={<ChangePassword />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <RequireRole
              allowedRoles={["super_admin", "school_admin", "admin"]}
            >
              <DashboardLayout />
            </RequireRole>
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
          element={
            <RequireRole allowedRoles={["teacher"]}>
              <DashboardLayout />
            </RequireRole>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="scores" element={<EnterScores />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="timetable" element={<TeacherTimetable />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="student"
          element={
            <RequireRole allowedRoles={["student"]}>
              <DashboardLayout />
            </RequireRole>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="results" element={<MyResults />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
