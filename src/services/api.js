import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://school-pilot-api.vercel.app";
console.log("🌐 API Configuration - Base URL:", API_BASE_URL);
console.log("Environment Mode:", import.meta.env.MODE);

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/api/accounts/register/",
  "/api/accounts/token/",
  "/api/accounts/token/refresh/",
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url.includes(endpoint)
    );

    console.log("➡️ Outgoing Request:", {
      method: config.method?.toUpperCase(),
      url: `${API_BASE_URL}${config.url}`,
      fullUrl: config.url,
      isPublic: isPublicEndpoint,
      hasToken: !!token,
      timestamp: new Date().toISOString(),
    });

    // Only add token if it's NOT a public endpoint and token exists
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header added");
    } else if (isPublicEndpoint) {
      console.log("⚠️ Public endpoint - No auth header needed");
    } else {
      console.log("⚠️ No token available for protected endpoint");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Setup Error:", error);
    return Promise.reject(error);
  }
);

// Debug response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("⬅️ Incoming Response:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("❌ API Call Failed:", {
      url: originalRequest?.url
        ? `${API_BASE_URL}${originalRequest.url}`
        : "Unknown URL",
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        headers: originalRequest?.headers,
        data: originalRequest?.data,
      },
      timestamp: new Date().toISOString(),
    });

    // Don't retry public endpoints (like register)
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log("⚠️ Public endpoint error - No token refresh attempted");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Attempting token refresh for 401...");

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        console.log("Refresh Token Present:", !!refreshToken);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/accounts/token/refresh/`,
          {
            refresh: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newToken = response.data.access;
        console.log("🆕 New Access Token Received");
        localStorage.setItem("access_token", newToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        console.log("🔄 Retrying original request with new token");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token Refresh Failed:", {
          error: refreshError.response?.data || refreshError.message,
          status: refreshError.response?.status,
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints with debug logging
export const authAPI = {
  login: (credentials) => {
    console.log("🔐 Login attempt with:", {
      email: credentials.email,
      password: credentials.password ? "[HIDDEN]" : "Missing",
    });
    return api.post("/api/accounts/token/", credentials);
  },
  register: (userData) => {
    console.log("📝 Registration attempt with:", {
      email: userData.email,
      username: userData.username,
    });
    return api.post("/api/accounts/register/", userData);
  },
  refresh: (refreshToken) => {
    console.log("🔄 Token refresh attempt");
    return api.post("/api/accounts/token/refresh/", { refresh: refreshToken });
  },
  changePassword: (data) => {
    console.log("🔑 Password change attempt");
    return api.post("/api/accounts/users/change-password/", data);
  },
  getProfile: (userId) => {
    console.log("👤 Get profile for user:", userId);
    return api.get(`/api/accounts/users/${userId}/`);
  },
  updateProfile: (userId, data) => {
    console.log("📋 Update profile for user:", userId, "with data:", data);
    return api.patch(`/api/accounts/users/${userId}/update/`, data);
  },
};

// Schools endpoints
export const schoolsAPI = {
  create: (data) => {
    console.log("🏫 Create school:", data);
    return api.post("/api/schools/add/", data);
  },
  get: (schoolId) => {
    console.log("🏫 Get school:", schoolId);
    return api.get(`/api/schools/view/${schoolId}/`);
  },
  update: (schoolId, data) => {
    console.log("🏫 Update school:", schoolId, "with data:", data);
    return api.patch(`/api/schools/update/${schoolId}/`, data);
  },
  createSession: (data) => {
    console.log("📅 Create session:", data);
    return api.post("/api/schools/session/create/", data);
  },
  getSessions: (schoolId) => {
    console.log("📅 Get sessions for school:", schoolId);
    return api.get(`/api/schools/session/view/${schoolId}/`);
  },
  updateSession: (sessionId, data) => {
    console.log("📅 Update session:", sessionId, "with data:", data);
    return api.patch(`/api/schools/session/update/${sessionId}/`, data);
  },
  createTerm: (data) => {
    console.log("📚 Create term:", data);
    return api.post("/api/schools/term/create/", data);
  },
  getTerms: (schoolId) => {
    console.log("📚 Get terms for school:", schoolId);
    return api.get(`/api/schools/term/view/${schoolId}/`);
  },
  getCurrentTerm: (schoolId) => {
    console.log("📚 Get current term for school:", schoolId);
    return api.get(`/api/schools/term/current/${schoolId}/`);
  },
  updateTerm: (termId, data) => {
    console.log("📚 Update term:", termId, "with data:", data);
    return api.patch(`/api/schools/term/update/${termId}/`, data);
  },
};

// Students endpoints
export const studentsAPI = {
  getAll: () => {
    console.log("👨‍🎓 Get all students");
    return api.get("/api/students/");
  },
  create: (data) => {
    console.log("👨‍🎓 Create student:", data);
    return api.post("/api/students/", data);
  },
  get: (studentId) => {
    console.log("👨‍🎓 Get student:", studentId);
    return api.get(`/api/students/${studentId}/`);
  },
  update: (studentId, data) => {
    console.log("👨‍🎓 Update student:", studentId, "with data:", data);
    return api.patch(`/api/students/${studentId}/`, data);
  },
  delete: (studentId) => {
    console.log("👨‍🎓 Delete student:", studentId);
    return api.delete(`/api/students/${studentId}/`);
  },
  promote: (studentId) => {
    console.log("👨‍🎓 Promote student:", studentId);
    return api.post(`/api/students/${studentId}/promote/`);
  },
  getProfile: (studentId) => {
    console.log("👨‍🎓 Get student profile:", studentId);
    return api.get(`/api/students/${studentId}/profile/`);
  },
  bulkUpload: (csvData) => {
    console.log("👨‍🎓 Bulk upload students");
    const formData = new FormData();
    formData.append("file", csvData);
    return api.post("/api/students/bulk-upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Teachers endpoints
export const teachersAPI = {
  getAll: () => {
    console.log("👨‍🏫 Get all teachers");
    return api.get("/api/teachers/");
  },
  create: (data) => {
    console.log("👨‍🏫 Create teacher:", data);
    return api.post("/api/teachers/", data);
  },
  get: (teacherId) => {
    console.log("👨‍🏫 Get teacher:", teacherId);
    return api.get(`/api/teachers/${teacherId}/`);
  },
  update: (teacherId, data) => {
    console.log("👨‍🏫 Update teacher:", teacherId, "with data:", data);
    return api.patch(`/api/teachers/${teacherId}/`, data);
  },
  assignSubjects: (teacherId, subjects) => {
    console.log(
      "👨‍🏫 Assign subjects to teacher:",
      teacherId,
      "subjects:",
      subjects
    );
    return api.post(`/api/teachers/${teacherId}/assign-subjects/`, {
      subjects,
    });
  },
  getClasses: (teacherId) => {
    console.log("👨‍🏫 Get classes for teacher:", teacherId);
    return api.get(`/api/teachers/${teacherId}/classes/`);
  },
};

// Academics endpoints
export const academicsAPI = {
  getClasses: () => {
    console.log("📚 Get all classes");
    return api.get("/api/academics/classes/");
  },
  createArm: (data) => {
    console.log("📚 Create class arm:", data);
    return api.post("/api/academics/arms/", data);
  },
  getSubjects: () => {
    console.log("📚 Get all subjects");
    return api.get("/api/academics/subjects/");
  },
  assignSubjects: (data) => {
    console.log("📚 Assign subjects to class:", data);
    return api.post("/api/academics/subjects/assign/", data);
  },
};

// Attendance endpoints
export const attendanceAPI = {
  mark: (data) => {
    console.log("📝 Mark attendance:", data);
    return api.post("/api/attendance/mark/", data);
  },
  update: (attendanceId, data) => {
    console.log("📝 Update attendance:", attendanceId, "with data:", data);
    return api.patch(`/api/attendance/${attendanceId}/`, data);
  },
  getAll: (params) => {
    console.log("📝 Get all attendance with params:", params);
    return api.get("/api/attendance/", { params });
  },
  getSummary: () => {
    console.log("📝 Get attendance summary");
    return api.get("/api/attendance/summary/");
  },
};

// Results endpoints
export const resultsAPI = {
  getAssessments: () => {
    console.log("📊 Get all assessments");
    return api.get("/api/results/assessments/");
  },
  enterScores: (data) => {
    console.log("📊 Enter scores:", data);
    return api.post("/api/results/scores/", data);
  },
  updateScore: (scoreId, data) => {
    console.log("📊 Update score:", scoreId, "with data:", data);
    return api.patch(`/api/results/scores/${scoreId}/`, data);
  },
  getClassResults: (params) => {
    console.log("📊 Get class results with params:", params);
    return api.get("/api/results/class/", { params });
  },
  approveResults: (data) => {
    console.log("📊 Approve results:", data);
    return api.post("/api/results/approve/", data);
  },
  getStudentResults: (studentId) => {
    console.log("📊 Get student results:", studentId);
    return api.get(`/api/results/student/${studentId}/`);
  },
};

// Fees endpoints
export const feesAPI = {
  createCategory: (data) => {
    console.log("💰 Create fee category:", data);
    return api.post("/api/fees/categories/", data);
  },
  createStructure: (data) => {
    console.log("💰 Create fee structure:", data);
    return api.post("/api/fees/structures/", data);
  },
  getInvoices: () => {
    console.log("💰 Get all invoices");
    return api.get("/api/fees/invoices/");
  },
  getInvoice: (invoiceId) => {
    console.log("💰 Get invoice:", invoiceId);
    return api.get(`/api/fees/invoices/${invoiceId}/`);
  },
  recordPayment: (data) => {
    console.log("💰 Record payment:", data);
    return api.post("/api/fees/payments/", data);
  },
  getPaymentHistory: () => {
    console.log("💰 Get payment history");
    return api.get("/api/fees/payments/history/");
  },
};

// Communications endpoints
export const communicationsAPI = {
  getAnnouncements: () => {
    console.log("📢 Get all announcements");
    return api.get("/api/communications/announcements/");
  },
  createAnnouncement: (data) => {
    console.log("📢 Create announcement:", data);
    return api.post("/api/communications/announcements/", data);
  },
  getNotifications: () => {
    console.log("🔔 Get all notifications");
    return api.get("/api/communications/notifications/");
  },
  markAsRead: (notificationId) => {
    console.log("🔔 Mark notification as read:", notificationId);
    return api.patch(
      `/api/communications/notifications/${notificationId}/read/`
    );
  },
};

// Timetable endpoints
export const timetableAPI = {
  create: (data) => {
    console.log("📅 Create timetable:", data);
    return api.post("/api/timetable/", data);
  },
  getClassTimetable: (classId) => {
    console.log("📅 Get class timetable:", classId);
    return api.get(`/api/timetable/class/${classId}/`);
  },
  getTeacherTimetable: (teacherId) => {
    console.log("📅 Get teacher timetable:", teacherId);
    return api.get(`/api/timetable/teacher/${teacherId}/`);
  },
};

// Reports endpoints
export const reportsAPI = {
  getAttendanceReports: () => {
    console.log("📈 Get attendance reports");
    return api.get("/api/reports/attendance/");
  },
  getFeesReports: () => {
    console.log("📈 Get fees reports");
    return api.get("/api/reports/fees/");
  },
  getAcademicsReports: () => {
    console.log("📈 Get academics reports");
    return api.get("/api/reports/academics/");
  },
};

// Subscriptions endpoints
export const subscriptionsAPI = {
  getPlans: () => {
    console.log("💎 Get subscription plans");
    return api.get("/api/subscriptions/plans/");
  },
  getCurrent: () => {
    console.log("💎 Get current subscription");
    return api.get("/api/subscriptions/current/");
  },
  upgrade: (data) => {
    console.log("💎 Upgrade subscription:", data);
    return api.post("/api/subscriptions/upgrade/", data);
  },
};

// Audit endpoints
export const auditAPI = {
  getLogs: () => {
    console.log("📋 Get audit logs");
    return api.get("/api/audit/logs/");
  },
};

// Export default api for direct use
export default api;

// Helper function to test API connection
export const testApiConnection = async () => {
  try {
    console.log("🔍 Testing API connection...");
    const response = await axios.get(`${API_BASE_URL}/api/accounts/register/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("✅ API Connection Test:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    return true;
  } catch (error) {
    console.error("❌ API Connection Failed:", {
      error: error.message,
      code: error.code,
      status: error.response?.status,
    });
    return false;
  }
};

// Call on import to check connection
testApiConnection();
