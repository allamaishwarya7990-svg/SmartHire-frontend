import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import { Plus, Briefcase, CheckCircle2, FileText, XCircle, Search, X, MapPin, Users } from "lucide-react";
import "../CSS/RecruiterJobs.css";
import "../CSS/theme.css";

function RecruiterJobs() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        loadRecruiterJobs();
    }, []);

    const loadRecruiterJobs = async () => {
        try {
            setLoading(true);
            const res = await recruiterApi.getJobs();
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((j) => ({
                    id: String(j.id),
                    title: j.title,
                    location: j.location,
                    type: j.type,
                    experience: j.experience,
                    salary: j.salary || "Competitive",
                    applications: j.applicantsCount || 0,
                    posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recent",
                    status: j.status || "Active"
                }));
                setJobs(mapped);
            } else {
                setJobs([
                    {
                        id: "1",
                        title: "Software Developer",
                        location: "Hyderabad, Telangana",
                        type: "Full Time",
                        experience: "0-2 Years",
                        salary: "₹5 - ₹8 LPA",
                        applications: 1,
                        posted: "Recent",
                        status: "Active"
                    }
                ]);
            }
        } catch (err) {
            console.warn("Could not load recruiter jobs from API:", err);
            setJobs([
                {
                    id: "1",
                    title: "Software Developer",
                    location: "Hyderabad, Telangana",
                    type: "Full Time",
                    experience: "0-2 Years",
                    salary: "₹5 - ₹8 LPA",
                    applications: 1,
                    posted: "Recent",
                    status: "Active"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        return status === "Active"
            ? "recruiter-job-status-active"
            : "recruiter-job-status-closed";
    };

    /* ================================
       FILTER JOBS
       ================================ */

    const filteredJobs = jobs.filter((job) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            job.title.toLowerCase().includes(search) ||
            job.location.toLowerCase().includes(search) ||
            job.type.toLowerCase().includes(search) ||
            job.experience.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            job.status.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    /* ================================
       CLOSE / REOPEN / DELETE JOB
       ================================ */

    const handleCloseJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to close this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await recruiterApi.closeJob(jobId);
            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job.id === jobId
                        ? { ...job, status: "Closed" }
                        : job
                )
            );
        } catch (err) {
            console.error("Close job error:", err);
            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job.id === jobId
                        ? { ...job, status: "Closed" }
                        : job
                )
            );
        }
    };

    /* ================================
       LOGOUT
       ================================ */

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="recruiter-jobs-page">

            {/* ================================
                SIDEBAR
                ================================ */}

            <RecruiterSidebar />

            {/* ================================
                MAIN
                ================================ */}

            <main className="recruiter-jobs-main">

                {/* TOPBAR */}

                <header className="recruiter-jobs-topbar">

                    <div className="recruiter-jobs-topbar-title">

                        <span>
                            RECRUITER PORTAL
                        </span>

                        <h1>
                            My Jobs
                        </h1>

                    </div>

                    <button
                        type="button"
                        className="recruiter-jobs-post-button"
                        onClick={() =>
                            navigate("/recruiter/post-job")
                        }
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <Plus size={16} />
                        Post New Job
                    </button>

                </header>

                <div className="recruiter-jobs-content">

                    {/* ================================
                        PAGE HEADING
                        ================================ */}

                    <section className="recruiter-jobs-heading">

                        <div>

                            <span className="recruiter-jobs-label">
                                JOB MANAGEMENT
                            </span>

                            <h2>
                                Your Posted Jobs
                            </h2>

                            <p>
                                View and manage all the job openings
                                posted by your organization.
                            </p>

                        </div>

                    </section>

                    {/* ================================
                        STATS
                        ================================ */}

                    <section className="recruiter-jobs-stats">

                        <div className="recruiter-jobs-stat-card">

                            <div className="jobs-stat-icon purple">
                                <Briefcase size={20} />
                            </div>

                            <div>
                                <span>Total Jobs</span>

                                <strong>
                                    {jobs.length}
                                </strong>
                            </div>

                        </div>

                        <div className="recruiter-jobs-stat-card">

                            <div className="jobs-stat-icon green">
                                <CheckCircle2 size={20} />
                            </div>

                            <div>
                                <span>Active Jobs</span>

                                <strong>
                                    {
                                        jobs.filter(
                                            (job) =>
                                                job.status === "Active"
                                        ).length
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="recruiter-jobs-stat-card">

                            <div className="jobs-stat-icon blue">
                                <FileText size={20} />
                            </div>

                            <div>
                                <span>Total Applications</span>

                                <strong>
                                    {
                                        jobs.reduce(
                                            (total, job) =>
                                                total +
                                                job.applications,
                                            0
                                        )
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="recruiter-jobs-stat-card">

                            <div className="jobs-stat-icon orange">
                                <XCircle size={20} />
                            </div>

                            <div>
                                <span>Closed Jobs</span>

                                <strong>
                                    {
                                        jobs.filter(
                                            (job) =>
                                                job.status === "Closed"
                                        ).length
                                    }
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* ================================
                        JOB SECTION
                        ================================ */}

                    <section className="recruiter-jobs-section">

                        <div className="recruiter-jobs-section-header">

                            <div>

                                <h3>
                                    All Job Openings
                                </h3>

                                <p>
                                    Manage your current and previous
                                    job postings.
                                </p>

                            </div>

                            <span className="recruiter-jobs-count">
                                {filteredJobs.length}{" "}
                                {filteredJobs.length === 1
                                    ? "Job"
                                    : "Jobs"}
                            </span>

                        </div>

                        {/* ================================
                            TOOLBAR
                            ================================ */}

                        <div className="recruiter-jobs-toolbar">

                            <div className="recruiter-jobs-search">

                                <span className="search-icon">
                                    <Search size={16} />
                                </span>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search jobs..."
                                />

                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="clear-search"
                                        onClick={() =>
                                            setSearchTerm("")
                                        }
                                        style={{ display: "inline-flex", alignItems: "center" }}
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                            </div>

                            <select
                                className="recruiter-jobs-filter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="closed">
                                    Closed
                                </option>
                            </select>

                        </div>

                        {/* ================================
                            JOB LIST
                            ================================ */}

                        <div className="recruiter-jobs-list">

                            {filteredJobs.length > 0 ? (

                                filteredJobs.map((job, index) => (

                                    <div
                                        className="recruiter-job-card"
                                        key={job.id}
                                        style={{
                                            "--card-delay": `${index * 0.06}s`
                                        }}
                                    >

                                        {/* JOB TOP */}

                                        <div className="recruiter-job-card-top">

                                            <div className="recruiter-job-icon">
                                                {job.title.charAt(0)}
                                            </div>

                                            <div className="recruiter-job-title">

                                                <div className="recruiter-job-title-row">

                                                    <h3>
                                                        {job.title}
                                                    </h3>

                                                    <span
                                                        className={`recruiter-job-status ${getStatusClass(
                                                            job.status
                                                        )}`}
                                                    >
                                                        <span className="status-dot"></span>
                                                        {job.status}
                                                    </span>

                                                </div>

                                                <p>
                                                    <span className="location-icon" style={{ display: "inline-flex", alignItems: "center", marginRight: "4px" }}>
                                                        <MapPin size={13} />
                                                    </span>
                                                    {job.location}
                                                </p>

                                            </div>

                                        </div>

                                        {/* JOB DETAILS */}

                                        <div className="recruiter-job-details">

                                            <div className="job-detail-item">
                                                <span>
                                                    Job Type
                                                </span>
                                                <strong>
                                                    {job.type}
                                                </strong>
                                            </div>

                                            <div className="job-detail-item">
                                                <span>
                                                    Experience
                                                </span>
                                                <strong>
                                                    {job.experience}
                                                </strong>
                                            </div>

                                            <div className="job-detail-item">
                                                <span>
                                                    Salary
                                                </span>
                                                <strong>
                                                    {job.salary}
                                                </strong>
                                            </div>

                                            <div className="job-detail-item">
                                                <span>
                                                    Applications
                                                </span>
                                                <strong>
                                                    {job.applications}
                                                </strong>
                                            </div>

                                            <div className="job-detail-item">
                                                <span>
                                                    Posted
                                                </span>
                                                <strong>
                                                    {job.posted}
                                                </strong>
                                            </div>

                                        </div>

                                        {/* BOTTOM */}

                                        <div className="recruiter-job-card-bottom">

                                            <span className="job-id">
                                                Job ID:{" "}
                                                <strong>
                                                    JOB-{job.id}
                                                </strong>
                                            </span>

                                            <div className="recruiter-job-actions">

                                                <button
                                                    type="button"
                                                    className="view-job-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/job/${job.id}`
                                                        )
                                                    }
                                                >
                                                    View Job
                                                </button>

                                                <button
                                                    type="button"
                                                    className="edit-job-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/recruiter/jobs/edit/${job.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="applications-job-button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/recruiter/applications"
                                                        )
                                                    }
                                                >
                                                    Applications
                                                    <span>
                                                        {job.applications}
                                                    </span>
                                                </button>

                                                {job.status === "Active" && (
                                                    <button
                                                        type="button"
                                                        className="close-job-button"
                                                        onClick={() =>
                                                            handleCloseJob(
                                                                job.id
                                                            )
                                                        }
                                                    >
                                                        Close Job
                                                    </button>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="recruiter-no-jobs">

                                    <div className="no-jobs-icon">
                                        <Search size={36} />
                                    </div>

                                    <h3>
                                        No jobs found
                                    </h3>

                                    <p>
                                        Try changing your search
                                        or status filter.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                        }}
                                    >
                                        Clear Filters
                                    </button>

                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default RecruiterJobs;