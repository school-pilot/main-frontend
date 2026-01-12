import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://school-pilot-api.vercel.app";

console.log("🌐 API Configuration - Base URL:", API_BASE_URL);

// Create axios instance with CORS-friendly configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // CORS specific settings
  withCredentials: false, // Set to true only if backend supports credentials
});

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/api/accounts/register/",
  "/api/accounts/token/",
  "/api/accounts/token/refresh/",
];

// Simple request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add auth header for non-public endpoints
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Simple response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("API Error:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Attempt to refresh token
        const response = await api.post("/api/accounts/token/refresh/", {
          refresh: refreshToken,
        });

        const newToken = response.data.access;
        localStorage.setItem("access_token", newToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post("/api/accounts/token/", credentials),
  register: (userData) => api.post("/api/accounts/register/", userData),
  refresh: (refreshToken) => api.post("/api/accounts/token/refresh/", { refresh: refreshToken }),
  changePassword: (data) => api.post("/api/accounts/users/change-password/", data),
  getProfile: (userId) => api.get(`/api/accounts/users/${userId}/`),
  updateProfile: (userId, data) => api.patch(`/api/accounts/users/${userId}/update/`, data),
};

export const schoolsAPI = {
  create: (data) => api.post("/api/schools/add/", data),
  get: (schoolId) => api.get(`/api/schools/view/${schoolId}/`),
  update: (schoolId, data) => api.patch(`/api/schools/update/${schoolId}/`, data),
  createSession: (data) => api.post("/api/schools/session/create/", data),
  getSessions: (schoolId) => api.get(`/api/schools/session/view/${schoolId}/`),
  updateSession: (sessionId, data) => api.patch(`/api/schools/session/update/${sessionId}/`, data),
  createTerm: (data) => api.post("/api/schools/term/create/", data),
  getTerms: (schoolId) => api.get(`/api/schools/term/view/${schoolId}/`),
  getCurrentTerm: (schoolId) => api.get(`/api/schools/term/current/${schoolId}/`),
  updateTerm: (termId, data) => api.patch(`/api/schools/term/update/${termId}/`, data),
};

export const studentsAPI = {
  getAll: () => api.get("/api/students/"),
  create: (data) => api.post("/api/students/", data),
  get: (studentId) => api.get(`/api/students/${studentId}/`),
  update: (studentId, data) => api.patch(`/api/students/${studentId}/`, data),
  delete: (studentId) => api.delete(`/api/students/${studentId}/`),
  promote: (studentId) => api.post(`/api/students/${studentId}/promote/`),
  getProfile: (studentId) => api.get(`/api/students/${studentId}/profile/`),
  bulkUpload: (csvData) => {
    const formData = new FormData();
    formData.append("file", csvData);
    return api.post("/api/students/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const teachersAPI = {
  getAll: () => api.get("/api/teachers/"),
  create: (data) => api.post("/api/teachers/", data),
  get: (teacherId) => api.get(`/api/teachers/${teacherId}/`),
  update: (teacherId, data) => api.patch(`/api/teachers/${teacherId}/`, data),
  assignSubjects: (teacherId, subjects) => 
    api.post(`/api/teachers/${teacherId}/assign-subjects/`, { subjects }),
  getClasses: (teacherId) => api.get(`/api/teachers/${teacherId}/classes/`),
};

export const academicsAPI = {
  getClasses: () => api.get("/api/academics/classes/"),
  createArm: (data) => api.post("/api/academics/arms/", data),
  getSubjects: () => api.get("/api/academics/subjects/"),
  assignSubjects: (data) => api.post("/api/academics/subjects/assign/", data),
};

export const attendanceAPI = {
  mark: (data) => api.post("/api/attendance/mark/", data),
  update: (attendanceId, data) => api.patch(`/api/attendance/${attendanceId}/`, data),
  getAll: (params) => api.get("/api/attendance/", { params }),
  getSummary: () => api.get("/api/attendance/summary/"),
};

export const resultsAPI = {
  getAssessments: () => api.get("/api/results/assessments/"),
  enterScores: (data) => api.post("/api/results/scores/", data),
  updateScore: (scoreId, data) => api.patch(`/api/results/scores/${scoreId}/`, data),
  getClassResults: (params) => api.get("/api/results/class/", { params }),
  approveResults: (data) => api.post("/api/results/approve/", data),
  getStudentResults: (studentId) => api.get(`/api/results/student/${studentId}/`),
};

export const feesAPI = {
  createCategory: (data) => api.post("/api/fees/categories/", data),
  createStructure: (data) => api.post("/api/fees/structures/", data),
  getInvoices: () => api.get("/api/fees/invoices/"),
  getInvoice: (invoiceId) => api.get(`/api/fees/invoices/${invoiceId}/`),
  recordPayment: (data) => api.post("/api/fees/payments/", data),
  getPaymentHistory: () => api.get("/api/fees/payments/history/"),
};

export const communicationsAPI = {
  getAnnouncements: () => api.get("/api/communications/announcements/"),
  createAnnouncement: (data) => api.post("/api/communications/announcements/", data),
  getNotifications: () => api.get("/api/communications/notifications/"),
  markAsRead: (notificationId) => 
    api.patch(`/api/communications/notifications/${notificationId}/read/`),
};

export const timetableAPI = {
  create: (data) => api.post("/api/timetable/", data),
  getClassTimetable: (classId) => api.get(`/api/timetable/class/${classId}/`),
  getTeacherTimetable: (teacherId) => api.get(`/api/timetable/teacher/${teacherId}/`),
};

export const reportsAPI = {
  getAttendanceReports: () => api.get("/api/reports/attendance/"),
  getFeesReports: () => api.get("/api/reports/fees/"),
  getAcademicsReports: () => api.get("/api/reports/academics/"),
};

export const subscriptionsAPI = {
  getPlans: () => api.get("/api/subscriptions/plans/"),
  getCurrent: () => api.get("/api/subscriptions/current/"),
  upgrade: (data) => api.post("/api/subscriptions/upgrade/", data),
};

export const auditAPI = {
  getLogs: () => api.get("/api/audit/logs/"),
};

export default api;

// Test connection helper (call manually when needed)
export const testApiConnection = async () => {
  try {
    console.log("🔍 Testing API connection to:", API_BASE_URL);
    const response = await api.get("/api/accounts/register/");
    console.log("✅ API Connection Test Successful:", response.status);
    return true;
  } catch (error) {
    console.error("❌ API Connection Test Failed:", error.message);
    return false;
  }
};