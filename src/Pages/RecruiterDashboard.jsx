import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import { Plus, Briefcase, CheckCircle2, FileText, Users, ArrowRight, Star } from "lucide-react";
import "../CSS/RecruiterDashboard.css";
import "../CSS/theme.css";

function RecruiterDashboard() {
    const navigate = useNavigate();

    const recruiterName = localStorage.getItem("email") || "Recruiter";
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [jobsRes, appsRes] = await Promise.allSettled([
                recruiterApi.getJobs(),
                recruiterApi.getApplications()
            ]);

            if (jobsRes.status === "fulfilled" && jobsRes.value.data) {
                const mappedJobs = jobsRes.value.data.map((j) => ({
                    id: String(j.id),
                    title: j.title,
                    location: j.location,
                    type: j.type,
                    applications: j.applicantsCount || 0,
                    status: j.status || "Active",
                    posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recent"
                }));
                setJobs(mappedJobs);
            }

            if (appsRes.status === "fulfilled" && appsRes.value.data) {
                const mappedApps = appsRes.value.data.map((a) => ({
                    id: String(a.id),
                    candidate: a.applicantName || a.applicantEmail || "Applicant",
                    job: a.jobTitle || "Position",
                    match: `${a.matchPercentage || 85}%`,
                    status: a.status || "APPLIED"
                }));
                setApplications(mappedApps);
            }
        } catch (err) {
            console.warn("Could not load recruiter dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === "Active" || j.status === "OPEN").length;
    const totalApps = applications.length;
    const shortlistedApps = applications.filter((a) => a.status === "SHORTLISTED" || a.status === "Shortlisted").length;

    const getStatusClass = (status) => {
        const s = String(status).toUpperCase();
        if (s === "ACTIVE" || s === "OPEN") {
            return "job-status-active";
        }
        if (s === "CLOSED") {
            return "job-status-closed";
        }
        if (s === "SHORTLISTED") {
            return "application-status-shortlisted";
        }
        if (s === "REVIEWING" || s === "UNDER REVIEW") {
            return "application-status-review";
        }
        return "application-status-submitted";
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="recruiter-dashboard">

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <RecruiterSidebar />


            {/* =====================================================
                MAIN AREA
            ====================================================== */}

            <main className="recruiter-main">

                {/* Topbar */}
                <header className="recruiter-topbar">

                    <div>
                        <span className="recruiter-topbar-label">
                            RECRUITER DASHBOARD
                        </span>

                        <h1>Dashboard</h1>
                    </div>

                    <div className="recruiter-profile">

                        <div className="recruiter-avatar">
                            {recruiterName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="recruiter-profile-info">
                            <strong>{recruiterName}</strong>
                            <span>Recruiter</span>
                        </div>

                    </div>

                </header>


                {/* Content */}
                <div className="recruiter-content">

                    {/* Welcome */}
                    <section className="recruiter-welcome">

                        <div>
                            <span className="welcome-small">
                                Welcome back
                            </span>

                            <h2>
                                Manage your hiring
                                <span> efficiently.</span>
                            </h2>

                            <p>
                                Post jobs, review applications and
                                find the right candidates for your
                                organization.
                            </p>
                        </div>

                        <button
                            className="post-job-primary"
                            onClick={() =>
                                navigate("/recruiter/post-job")
                            }
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                            <Plus size={15} /> Post New Job
                        </button>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================== */}

                    <section className="recruiter-stats">

                        <div className="recruiter-stat-card">

                            <div className="stat-icon purple">
                                <Briefcase size={20} />
                            </div>

                            <div>
                                <span>Total Jobs</span>
                                <strong>{totalJobs}</strong>
                                <small>All posted jobs</small>
                            </div>

                        </div>


                        <div className="recruiter-stat-card">

                            <div className="stat-icon green">
                                <CheckCircle2 size={20} />
                            </div>

                            <div>
                                <span>Active Jobs</span>
                                <strong>{activeJobs}</strong>
                                <small>Currently accepting applications</small>
                            </div>

                        </div>


                        <div className="recruiter-stat-card">

                            <div className="stat-icon blue">
                                <FileText size={20} />
                            </div>

                            <div>
                                <span>Applications</span>
                                <strong>{totalApps}</strong>
                                <small>Total received applications</small>
                            </div>

                        </div>


                        <div className="recruiter-stat-card">

                            <div className="stat-icon orange">
                                <Star size={20} />
                            </div>

                            <div>
                                <span>Shortlisted</span>
                                <strong>{shortlistedApps}</strong>
                                <small>Selected candidates</small>
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================== */}

                    <section className="quick-actions-section">

                        <div className="section-heading">
                            <div>
                                <h2>Quick Actions</h2>
                                <p>
                                    Manage your recruitment workflow.
                                </p>
                            </div>
                        </div>

                        <div className="quick-actions-grid">

                            <button
                                className="quick-action-card"
                                onClick={() =>
                                    navigate("/recruiter/post-job")
                                }
                            >
                                <div className="quick-action-icon purple">
                                    <Plus size={20} />
                                </div>

                                <div>
                                    <h3>Post a New Job</h3>
                                    <p>
                                        Create and publish a new
                                        job opening.
                                    </p>
                                </div>

                                <span className="quick-arrow">
                                    <ArrowRight size={16} />
                                </span>
                            </button>


                            <button
                                className="quick-action-card"
                                onClick={() =>
                                    navigate("/recruiter/jobs")
                                }
                            >
                                <div className="quick-action-icon blue">
                                    <Briefcase size={20} />
                                </div>

                                <div>
                                    <h3>Manage Jobs</h3>
                                    <p>
                                        View and manage your posted
                                        jobs.
                                    </p>
                                </div>

                                <span className="quick-arrow">
                                    <ArrowRight size={16} />
                                </span>
                            </button>


                            <button
                                className="quick-action-card"
                                onClick={() =>
                                    navigate(
                                        "/recruiter/applications"
                                    )
                                }
                            >
                                <div className="quick-action-icon green">
                                    <Users size={20} />
                                </div>

                                <div>
                                    <h3>Review Applications</h3>
                                    <p>
                                        Check candidate applications
                                        and matches.
                                    </p>
                                </div>

                                <span className="quick-arrow">
                                    <ArrowRight size={16} />
                                </span>
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        LOWER GRID
                    ================================================== */}

                    <div className="recruiter-lower-grid">


                        {/* Recent Jobs */}
                        <section className="dashboard-panel">

                            <div className="panel-header">

                                <div>
                                    <h2>Recent Job Posts</h2>
                                    <p>
                                        Your latest job openings.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/recruiter/jobs")
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="jobs-table">

                                {jobs.length === 0 ? (
                                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary)" }}>
                                        No jobs posted yet. Click "+ Post New Job" to create your first vacancy.
                                    </div>
                                ) : (
                                    jobs.slice(0, 4).map((job) => (
                                        <div
                                            className="job-row"
                                            key={job.id}
                                        >

                                            <div className="job-company-icon">
                                                {job.title.charAt(0)}
                                            </div>

                                            <div className="job-row-info">
                                                <h3>{job.title}</h3>

                                                <p>
                                                    {job.location}
                                                    {" · "}
                                                    {job.type}
                                                </p>
                                            </div>

                                            <div className="job-row-applications">
                                                <strong>
                                                    {job.applications}
                                                </strong>

                                                <span>
                                                    Applications
                                                </span>
                                            </div>

                                            <span
                                                className={`job-status ${getStatusClass(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status}
                                            </span>

                                        </div>
                                    ))
                                )}

                            </div>

                        </section>


                        {/* Recent Applications */}
                        <section className="dashboard-panel">

                            <div className="panel-header">

                                <div>
                                    <h2>Recent Applications</h2>
                                    <p>
                                        Latest candidate activity.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/recruiter/applications"
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="applications-table">

                                {applications.length === 0 ? (
                                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary)" }}>
                                        No candidate applications received yet.
                                    </div>
                                ) : (
                                    applications.slice(0, 4).map((application) => (
                                        <div
                                            className="candidate-row"
                                            key={application.id}
                                        >

                                            <div className="candidate-avatar">
                                                {application.candidate
                                                    .charAt(0)}
                                            </div>

                                            <div className="candidate-info">
                                                <h3>
                                                    {application.candidate}
                                                </h3>

                                                <p>
                                                    {application.job}
                                                </p>
                                            </div>

                                            <div className="candidate-match">
                                                <strong>
                                                    {application.match}
                                                </strong>

                                                <span>
                                                    Match
                                                </span>
                                            </div>

                                            <span
                                                className={`candidate-status ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >
                                                {application.status}
                                            </span>

                                        </div>
                                    ))
                                )}

                            </div>

                        </section>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default RecruiterDashboard;