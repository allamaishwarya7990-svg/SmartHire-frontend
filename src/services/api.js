import axios from "axios";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.PROD) {
  throw new Error("VITE_API_BASE_URL is missing in production");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
// Response interceptor: distinguish expired sessions from permission errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      // A 401 means the request was not authenticated.
      const publicPaths = ["/login", "/register", "/"];

      const isPublicPath = publicPaths.includes(currentPath);

      // Avoid redirect loops on public pages.
      if (!isPublicPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        window.location.replace("/login");
      }
    }

    // A 403 is a permission error. Do not automatically erase the session.
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
    login: (credentials) => apiClient.post("/api/users/login", credentials),
    register: (userData) => apiClient.post("/api/users/register", userData),
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        window.location.href = "/login";
    },
    getCurrentUser: () => ({
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role")
    })
};

// ==========================================
// JOBS API (Public & Seeker)
// ==========================================
export const jobApi = {
    searchJobs: (params = {}) => apiClient.get("/api/jobs/public", { params }),
    getJobById: (id) => apiClient.get(`/api/jobs/public/${id}`)
};

// ==========================================
// JOB SEEKER API
// ==========================================
export const jobSeekerApi = {
    getProfile: () => apiClient.get("/api/jobseeker/profile"),
    saveProfile: (data) => apiClient.post("/api/jobseeker/profile", data),
    getApplications: () => apiClient.get("/api/jobseeker/applications"),
    getApplicationById: (id) => apiClient.get(`/api/jobseeker/applications/${id}`),
    applyForJob: (applicationData) => apiClient.post("/api/jobseeker/applications", applicationData),
    getSavedJobs: () => apiClient.get("/api/jobseeker/saved-jobs"),
    saveJob: (jobId) => apiClient.post("/api/jobseeker/saved-jobs", { jobId }),
    unsaveJob: (jobId) => apiClient.delete(`/api/jobseeker/saved-jobs/${jobId}`)
};

// ==========================================
// RECRUITER API
// ==========================================
export const recruiterApi = {
    getCompanyProfile: () => apiClient.get("/api/recruiter/company"),
    saveCompanyProfile: (data) => apiClient.put("/api/recruiter/company", data),
    getJobs: () => apiClient.get("/api/recruiter/jobs"),
    createJob: (jobData) => apiClient.post("/api/recruiter/jobs", jobData),
    updateJob: (id, jobData) => apiClient.put(`/api/recruiter/jobs/${id}`, jobData),
    closeJob: (id) => apiClient.put(`/api/recruiter/jobs/${id}/close`),
    reopenJob: (id) => apiClient.put(`/api/recruiter/jobs/${id}/reopen`),
    deleteJob: (id) => apiClient.delete(`/api/recruiter/jobs/${id}`),
    getApplications: (params = {}) => apiClient.get("/api/recruiter/applications", { params }),
    getApplicationById: (id) => apiClient.get(`/api/recruiter/applications/${id}`),
    updateApplicationStatus: (id, status) => apiClient.put(`/api/recruiter/applications/${id}/status`, { status })
};

// ==========================================
// SETTINGS API
// ==========================================
export const settingsApi = {
    getSettings: () => apiClient.get("/api/settings"),
    updateSettings: (data) => apiClient.put("/api/settings", data),
    changePassword: (passwordData) => apiClient.post("/api/settings/password", passwordData)
};

// ==========================================
// ADMIN API
// ==========================================
export const adminApi = {
    getStats: () => apiClient.get("/api/admin/dashboard/stats"),
    getJobSeekers: () => apiClient.get("/api/admin/jobseekers"),
    updateUserStatus: (id, status) => apiClient.put(`/api/admin/users/${id}/status`, { status }),
    deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`),
    getRecruiters: () => apiClient.get("/api/admin/recruiters"),
    updateRecruiterApproval: (id, isVerified) => apiClient.put(`/api/admin/recruiters/${id}/approval`, { isVerified }),
    getJobs: () => apiClient.get("/api/admin/jobs"),
    updateJobStatus: (id, status) => apiClient.put(`/api/admin/jobs/${id}/status`, { status }),
    getApplications: () => apiClient.get("/api/admin/applications"),
    getReports: () => apiClient.get("/api/admin/reports"),
    resolveReport: (id, status, resolutionNotes) => apiClient.put(`/api/admin/reports/${id}/resolve`, { status, resolutionNotes })
};

// ==========================================
// REPORTS API
// ==========================================
export const reportApi = {
    submitReport: (data) => apiClient.post("/api/reports", data),
    getMyReports: () => apiClient.get("/api/reports/my")
};

export default apiClient;
