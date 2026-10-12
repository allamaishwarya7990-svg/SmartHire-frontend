import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

import JobSeekerDashboard from "./Pages/JobSeekerDashboard";
import JobSeekerProfile from "./Pages/JobSeekerProfile";
import FindJobs from "./Pages/FindJobs";
import JobDetails from "./Pages/JobDetails";
import EligibilityAnalysis from "./Pages/EligibilityAnalysis";
import ApplyJob from "./Pages/ApplyJob";
import MyApplications from "./Pages/MyApplications";
import ApplicationDetails from "./Pages/ApplicationDetails";
import SavedJobs from "./Pages/SavedJobs";
import JobSeekerSettings from "./Pages/JobSeekerSettings";

import RecruiterDashboard from "./Pages/RecruiterDashboard";
import PostJob from "./Pages/PostJob";
import RecruiterJobs from "./Pages/RecruiterJobs";
import RecruiterApplication from "./Pages/RecruiterApplication";
import RecruiterApplicationDetails from "./Pages/RecruiterApplicationDetails";
import RecruiterCompanyProfile from "./Pages/RecruiterCompanyProfile";
import RecruiterJobDetails from "./Pages/RecruiterJobDetails";
import RecruiterSettings from "./Pages/RecruiterSettings";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminJobSeekers from "./Pages/Admin/AdminJobSeekers";
import AdminRecruiters from "./Pages/Admin/AdminRecruiters";
import AdminJobs from "./Pages/Admin/AdminJobs";
import AdminApplications from "./Pages/Admin/AdminApplications";
import AdminReports from "./Pages/Admin/AdminReports";
import AdminProfile from "./Pages/Admin/AdminProfile";
import AdminSettings from "./Pages/Admin/AdminSettings";

import ProtectedRoute from "./Pages/ProtectedRoute";
import EditRecruiterJob from "./Pages/EditRecruiterJob";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/jobs" element={<FindJobs />} />
                <Route path="/find-jobs" element={<FindJobs />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/job/:id/eligibility" element={<EligibilityAnalysis />} />

                {/* Job Seeker Protected Routes */}
                <Route
                    path="/jobseeker-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <JobSeekerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/job/:id/apply"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <ApplyJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications/:id"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <ApplicationDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <SavedJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <JobSeekerProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobseeker-profile"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <JobSeekerProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/job-seeker/settings"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <JobSeekerSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobseeker-settings"
                    element={
                        <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                            <JobSeekerSettings />
                        </ProtectedRoute>
                    }
                />

                {/* Recruiter Protected Routes */}
                <Route
                    path="/recruiter-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/post-job"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <PostJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterApplication />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/applications/:id"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterApplicationDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/profile"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterCompanyProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/company-profile"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterCompanyProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/job/:id"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterJobDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/settings"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterSettings />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Protected Routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/jobseekers"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminJobSeekers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/recruiters"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminRecruiters />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/jobs"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/applications"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminReports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <EditRecruiterJob />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;