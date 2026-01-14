import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

/* =====================================================
   BASE CONFIG
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://school-pilot-api.vercel.app";

const PUBLIC_ENDPOINTS = [
  "/api/accounts/register/",
  "/api/accounts/token/",
  "/api/accounts/token/refresh/",
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* =====================================================
   REQUEST INTERCEPTOR
===================================================== */

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, Promise.reject);

/* =====================================================
   RESPONSE INTERCEPTOR (AUTO REFRESH)
===================================================== */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.includes(url)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic
    ) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(
          `${API_BASE_URL}/api/accounts/token/refresh/`,
          { refresh }
        );

        setTokens({ access: res.data.access });

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/* =====================================================
   AUTH / ACCOUNTS
===================================================== */

export const authAPI = {
  register: (data) => api.post("/api/accounts/register/", data),
  refreshToken: (data) => api.post("/api/accounts/token/refresh/", data),
  login: (data) => api.post("/api/accounts/token/", data),
  changePassword: (data) =>
    api.post("/api/accounts/users/change-password/", data),
  getUsers: () => api.get("/api/accounts/users/"),
  getUser: (id) => api.get(`/api/accounts/users/${id}/`),
  updateUser: (userId, data) =>
    api.patch(`/api/accounts/users/${userId}/update/`, data),
  getUserProfile: (userId) => API.get(`/api/accounts/users/${userId}/profile/`),
};

/* =====================================================
   SCHOOLS
===================================================== */

export const schoolsAPI = {
  create: (data) => api.post("/api/schools/add/", data),
  get: (id) => api.get(`/api/schools/view/${id}/`),
  update: (id, data) => api.patch(`/api/schools/update/${id}/`, data),

  createSession: (data) => api.post("/api/schools/session/create/", data),
  getSessions: (schoolId) => api.get(`/api/schools/session/view/${schoolId}/`),
  updateSession: (id, data) =>
    api.patch(`/api/schools/session/update/${id}/`, data),

  createTerm: (data) => api.post("/api/schools/term/create/", data),
  getTerms: (schoolId) => api.get(`/api/schools/term/view/${schoolId}/`),
  getCurrentTerm: (schoolId) =>
    api.get(`/api/schools/term/current/${schoolId}/`),
  updateTerm: (id, data) => api.patch(`/api/schools/term/update/${id}/`, data),
};

/* =====================================================
   STUDENTS
===================================================== */

export const studentsAPI = {
  getAll: () => api.get("/api/students/"),
  create: (data) => api.post("/api/students/", data),
  get: (id) => api.get(`/api/students/${id}/`),
  update: (id, data) => api.patch(`/api/students/${id}/`, data),
  delete: (id) => api.delete(`/api/students/${id}/`),
  promote: (id) => api.post(`/api/students/${id}/promote/`),
  profile: (id) => api.get(`/api/students/${id}/profile/`),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/students/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

/* =====================================================
   TEACHERS
===================================================== */

export const teachersAPI = {
  getAll: () => api.get("/api/teachers/"),
  create: (data) => api.post("/api/teachers/", data),
  get: (id) => api.get(`/api/teachers/${id}/`),
  update: (id, data) => api.patch(`/api/teachers/${id}/`, data),
  assignSubjects: (id, subjects) =>
    api.post(`/api/teachers/${id}/assign-subjects/`, {
      subjects,
    }),
  classes: (id) => api.get(`/api/teachers/${id}/classes/`),
};

/* =====================================================
   ACADEMICS
===================================================== */

export const academicsAPI = {
  classes: () => api.get("/api/academics/classes/"),
  createArm: (data) => api.post("/api/academics/arms/", data),
  subjects: () => api.get("/api/academics/subjects/"),
  assignSubjects: (data) => api.post("/api/academics/subjects/assign/", data),
};

/* =====================================================
   ATTENDANCE
===================================================== */

export const attendanceAPI = {
  mark: (data) => api.post("/api/attendance/mark/", data),
  update: (id, data) => api.patch(`/api/attendance/${id}/`, data),
  getAll: (params) => api.get("/api/attendance/", { params }),
  summary: () => api.get("/api/attendance/summary/"),
};

/* =====================================================
   RESULTS
===================================================== */

export const resultsAPI = {
  assessments: () => api.get("/api/results/assessments/"),
  enterScores: (data) => api.post("/api/results/scores/", data),
  updateScore: (id, data) => api.patch(`/api/results/scores/${id}/`, data),
  classResults: (params) => api.get("/api/results/class/", { params }),
  approve: (data) => api.post("/api/results/approve/", data),
  studentResults: (id) => api.get(`/api/results/student/${id}/`),
};

/* =====================================================
   FEES
===================================================== */

export const feesAPI = {
  createCategory: (data) => api.post("/api/fees/categories/", data),
  createStructure: (data) => api.post("/api/fees/structures/", data),
  invoices: () => api.get("/api/fees/invoices/"),
  invoice: (id) => api.get(`/api/fees/invoices/${id}/`),
  payment: (data) => api.post("/api/fees/payments/", data),
  paymentHistory: () => api.get("/api/fees/payments/history/"),
};

/* =====================================================
   COMMUNICATIONS
===================================================== */

export const communicationsAPI = {
  announcements: () => api.get("/api/communications/announcements/"),
  createAnnouncement: (data) =>
    api.post("/api/communications/announcements/", data),
  notifications: () => api.get("/api/communications/notifications/"),
  markRead: (id) => api.patch(`/api/communications/notifications/${id}/read/`),
};

/* =====================================================
   TIMETABLE
===================================================== */

export const timetableAPI = {
  create: (data) => api.post("/api/timetable/", data),
  class: (id) => api.get(`/api/timetable/class/${id}/`),
  teacher: (id) => api.get(`/api/timetable/teacher/${id}/`),
};

/* =====================================================
   REPORTS
===================================================== */

export const reportsAPI = {
  attendance: () => api.get("/api/reports/attendance/"),
  fees: () => api.get("/api/reports/fees/"),
  academics: () => api.get("/api/reports/academics/"),
};

/* =====================================================
   SUBSCRIPTIONS
===================================================== */

export const subscriptionsAPI = {
  plans: () => api.get("/api/subscriptions/plans/"),
  current: () => api.get("/api/subscriptions/current/"),
  upgrade: (data) => api.post("/api/subscriptions/upgrade/", data),
};

/* =====================================================
   AUDIT
===================================================== */

export const auditAPI = {
  logs: () => api.get("/api/audit/logs/"),
};

export default api;
