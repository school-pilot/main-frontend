import { Routes, Route } from "react-router-dom";

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
import MyProfile from "../pages/MyProfile";
import AccountSettings from "../pages/AccountSettings";
import HelpSupport from "../pages/HelpSupport";

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
import SchoolSettings from "../dashboards/admin/SchoolSetting";
import AcademicsManagement from "../dashboards/admin/AcademicsManagement";
import SessionTermManagement from "../dashboards/admin/SessionTermManagement";
import AnnouncementsManagement from "../dashboards/admin/AnnouncementsManagement";
import SubscriptionPlans from "../dashboards/admin/SubscriptionPlans";
import BulkStudentUpload from "../dashboards/admin/BulkStudentUpload";
import ResultApproval from "../dashboards/admin/ResultApproval";

/* Admin (Legacy) */
import Fees from "../dashboards/admin/Fees";
import Reports from "../dashboards/admin/Reports";
import TimetableAdmin from "../dashboards/admin/TimetableAdmin";

/* Teacher */
import TeacherDashboard from "../dashboards/teacher/TeacherDashboard";
import Attendance from "../dashboards/teacher/Attendance";
import EnterScores from "../dashboards/teacher/EnterScores";
import MyClasses from "../dashboards/teacher/MyClasses";
import TeacherTimetable from "../dashboards/teacher/TeacherTimetable";
import SubjectManagement from "../components/SubjectManagement";

/* Student */
import StudentDashboard from "../dashboards/student/StudentDashboard";
import MyResults from "../dashboards/student/MyResults";
import Timetable from "../dashboards/student/Timetable";
import Profile from "../dashboards/student/Profile";
import Notifications from "../dashboards/student/Notifications";
import StudentFees from "../dashboards/student/StudentFees";
import StudentAttendance from "../dashboards/student/Attendance";

/* Parent */
import ParentDashboard from "../dashboards/parent/ParentDashboard";

import Home from "../pages/Home";
import CreateNotification from "../pages/CreateNotification";
import TimetableManagement from "../components/TimetableManagement";
import AttendanceManagement from "../components/AttendanceManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route index path="/" element={<Home />} />

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= ALL PAGES ACCESSIBLE ================= */}
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="account-settings" element={<AccountSettings />} />
        <Route path="help" element={<HelpSupport />} />

        {/* ===== SUPER ADMIN ===== */}
        <Route path="super-admin">
          <Route index element={<SuperAdminDashboard />} />
          <Route path="create-school" element={<CreateSchool />} />
          <Route path="activate-accounts" element={<ActivateAccounts />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>

        {/* ===== SCHOOL ADMIN ===== */}
        <Route path="school-admin">
          <Route index element={<SchoolAdminDashboard />} />
          <Route path="create-teacher" element={<CreateTeacher />} />
          <Route path="create-notification" element={<CreateNotification />} />
          <Route path="create-student" element={<CreateStudent />} />
          <Route path="school-settings" element={<SchoolSettings />} />
          <Route path="academics" element={<AcademicsManagement />} />
          <Route path="sessions-terms" element={<SessionTermManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="announcements" element={<AnnouncementsManagement />} />
          <Route path="subscriptions" element={<SubscriptionPlans />} />
          <Route path="timetable" element={<TimetableManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="bulk-upload" element={<BulkStudentUpload />} />
          <Route path="result-approval" element={<ResultApproval />} />
          <Route path="classes" element={<MyClasses />} />
        </Route>

        {/* ===== ADMIN (LEGACY) ===== */}
        <Route path="admin">
          <Route path="fees" element={<Fees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="timetable" element={<TimetableAdmin />} />
        </Route>

        {/* ===== TEACHER ===== */}
        <Route path="teacher">
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="enter-scores" element={<EnterScores />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="timetable" element={<TeacherTimetable />} />
        </Route>

        {/* ===== STUDENT ===== */}
        <Route path="student">
          <Route index element={<StudentDashboard />} />
          <Route path="results" element={<MyResults />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="StudentFees" element={<StudentFees />} />
          <Route path="attendance" element={<StudentAttendance />} />
        </Route>

        {/* ===== PARENT ===== */}
        <Route path="parent">
          <Route index element={<ParentDashboard />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
