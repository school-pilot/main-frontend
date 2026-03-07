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

  // If sending FormData, remove Content-Type so browser sets the multipart boundary
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  } else {
    if (
      config.headers &&
      !config.headers["Content-Type"] &&
      !config.headers["content-type"]
    ) {
      config.headers["Content-Type"] = "application/json";
    }
  }

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
      originalRequest?.url?.includes(url),
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
          { refresh },
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
  },
);

/* =====================================================
   AUTH / ACCOUNTS
===================================================== */

export const authAPI = {
  register: (data) => api.post("/api/accounts/register/", data),
  login: (data) => api.post("/api/accounts/token/", data),
  refreshToken: (data) => api.post("/api/accounts/token/refresh/", data),
  getUsers: () => api.get("/api/accounts/users/"),
  changePassword: (data) =>
    api.post("/api/accounts/users/change-password/", data),
  getUser: (id) => api.get(`/api/accounts/users/${id}/`),
  updateUser: (userId, data) =>
    api.patch(`/api/accounts/users/${userId}/update/`, data),
  getUserProfile: (userId) => api.get(`/api/accounts/users/${userId}/profile/`),
  updateUserPartial: (user_Id, data) =>
    api.patch(`/api/accounts/users/${user_Id}/update/`, data),
};

/* =====================================================
   ACADEMICS
===================================================== */

export const academicsAPI = {
  createArm: (data) => api.post("/api/academics/arms/", data),
  classes: () => api.get("/api/academics/classes/"),
  createClasses: (data) => api.post("/api/academics/classes/", data),
  subjects: () => api.get("/api/academics/subjects/"),
  createSubject: (data) => api.post("/api/academics/subjects/", data),
  assignSubjects: (data) => api.post("/api/academics/subjects/assign/", data),
};

/* =====================================================
   ATTENDANCE
===================================================== */

export const attendanceAPI = {
  getAll: (params) => api.get("/api/attendance/", { params }),
  mark: (data) => api.post("/api/attendance/mark/", data),
  summary: () => api.get("/api/attendance/summary/"),
  update: (id, data) => api.patch(`/api/attendance/${id}/`, data),
};

/* =====================================================
   AUDIT
===================================================== */

export const auditAPI = {
  logs: () => api.get("/api/audit/logs/"),
};

/* =====================================================
   COMMUNICATIONS
===================================================== */

// In your api.js file, update the communicationsAPI section:

export const communicationsAPI = {
  announcements: () => api.get("/api/communications/announcements/"),
  createAnnouncement: (data) =>
    api.post("/api/communications/announcements/", data),
  notifications: async () => {
    try {
      const response = await api.get("/api/communications/notifications/");
      return response;
    } catch (error) {
      console.error("API Error in notifications:", error);
      throw error;
    }
  },
  markAsRead: (id) => api.patch(`/api/communications/notifications/${id}/read/`),
};

/* =====================================================
   FEES
===================================================== */

export const feesAPI = {
  createCategory: (data) => api.post("/api/fees/categories/", data),
  invoices: () => api.get("/api/fees/invoices/"),
  invoice: (id) => api.get(`/api/fees/invoices/${id}/`),
  payment: (data) => api.post("/api/fees/payments/", data),
  paymentHistory: () => api.get("/api/fees/payments/history/"),
  createStructure: (data) => api.post("/api/fees/structures/", data),
};

/* =====================================================
   REPORTS
===================================================== */

export const reportsAPI = {
  academics: () => api.get("/api/reports/academics/"),
  attendance: () => api.get("/api/reports/attendance/"),
  fees: () => api.get("/api/reports/fees/"),
};

/* =====================================================
   RESULTS
===================================================== */

export const resultsAPI = {
  approve: (data) => api.post("/api/results/approve/", data),
  assessments: () => api.get("/api/results/assessments/"),
  createAssessments: (data) => ("/api/results/assessments/", data),
  classResults: (params) => api.get("/api/results/class/", { params }),
  enterScores: (data) => api.post("/api/results/scores/", data),
  updateScore: (id, data) => api.patch(`/api/results/scores/${id}/`, data),
  studentResults: (id) => api.get(`/api/results/student/${id}/`),
};

/* =====================================================
   SCHOOLS
===================================================== */

export const schoolsAPI = {
  //  Create school with FormData (file upload)
  create: (formData) => api.post("/api/schools/add/", formData),
  // Sessions
  createSession: (formData) =>
    api.post("/api/schools/session/create/", formData),
  updateSession: (id, formData) =>
    api.put(`/api/schools/session/update/${id}/`, formData),
  updateSessionPartial: (id, formData) =>
    api.patch(`/api/schools/session/update/${id}/`, formData),
  getSessions: (schoolId) => api.get(`/api/schools/session/view/${schoolId}/`),
  // Terms
  createTerm: (formData) => api.post("/api/schools/term/create/", formData),
  getCurrentTerm: (schoolId) =>
    api.get(`/api/schools/term/current/${schoolId}/`),
  updateTerm: (id, formData) =>
    api.put(`/api/schools/term/update/${id}/`, formData),
  updateTermPartial: (id, formData) =>
    api.patch(`/api/schools/term/update/${id}/`, formData),
  getTerms: (schoolId) => api.get(`/api/schools/term/view/${schoolId}/`), // Update a school (can also send FormData if updating logo)
  update: (id, formData) => api.put(`/api/schools/update/${id}/`, formData),
  updatePartial: (id, formData) =>
    api.patch(`/api/schools/update/${id}/`, formData),
  // Get a single school
  get: (id) => api.get(`/api/schools/view/${id}/`),
};

/* =====================================================
   STUDENTS
===================================================== */

export const studentsAPI = {
  getAll: () => api.get("/api/students/"),
  create: (data) => api.post("/api/students/", data),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/students/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  get: (id) => api.get(`/api/students/${id}/`),
  update: (id, data) => api.patch(`/api/students/${id}/`, data),
  delete: (id) => api.delete(`/api/students/${id}/`),
  profile: (id) => api.get(`/api/students/${id}/profile/`),
  promote: (id) => api.post(`/api/students/${id}/promote/`),
};

/* =====================================================
   SUBSCRIPTIONS
===================================================== */

export const subscriptionsAPI = {
  current: () => api.get("/api/subscriptions/current/"),
  plans: () => api.get("/api/subscriptions/plans/"),
  upgrade: (data) => api.post("/api/subscriptions/upgrade/", data),
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
   TIMETABLE
===================================================== */

export const timetableAPI = {
  create: (data) => api.post("/api/timetable/", data),
  class: (id) => api.get(`/api/timetable/class/${id}/`),
  teacher: (id) => api.get(`/api/timetable/teacher/${id}/`),
};

export default api;
