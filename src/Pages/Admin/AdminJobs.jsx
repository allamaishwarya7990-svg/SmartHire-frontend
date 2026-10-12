import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../services/api";
import { RotateCcw, Search, X } from "lucide-react";

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getJobs();
            if (res.data) {
                setJobs(res.data);
            }
        } catch (err) {
            console.error("Failed to load admin jobs:", err);
            setMessage({ type: "error", text: "Failed to connect to backend for job postings." });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleJobStatus = async (jobId, currentStatus) => {
        const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
        try {
            await adminApi.updateJobStatus(jobId, nextStatus);
            setMessage({ type: "success", text: `Job listing status changed to ${nextStatus}.` });
            loadJobs();
        } catch (err) {
            console.error("Failed to update job status:", err);
            setMessage({ type: "error", text: "Failed to update job status." });
        }
    };

    const filtered = jobs.filter((j) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            (j.title && j.title.toLowerCase().includes(q)) ||
            (j.companyName && j.companyName.toLowerCase().includes(q)) ||
            (j.location && j.location.toLowerCase().includes(q)) ||
            (j.skills && j.skills.toLowerCase().includes(q));

        if (statusFilter === "ALL") return matchesSearch;
        return matchesSearch && j.status === statusFilter;
    });

    return (
        <AdminLayout
            title="Job Postings Moderation"
            subtitle="Review, approve, and moderate published employer job listings."
            actions={
                <button onClick={loadJobs} className="sh-btn sh-btn-secondary sh-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <RotateCcw size={14} /> Refresh Postings
                </button>
            }
        >
            {message.text && (
                <div className={`sh-alert sh-alert-${message.type}`}>
                    <span>{message.text}</span>
                    <button
                        onClick={() => setMessage({ type: "", text: "" })}
                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            <div className="sh-filter-bar">
                <div className="sh-search-box">
                    <span className="sh-search-icon"><Search size={16} /></span>
                    <input
                        type="text"
                        className="sh-input"
                        placeholder="Search by job title, company, skills, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="sh-select"
                    style={{ width: "180px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Closed">Closed Only</option>
                </select>
            </div>

            <div className="sh-table-container">
                <table className="sh-table">
                    <thead>
                        <tr>
                            <th>Job Title & Organization</th>
                            <th>Location & Mode</th>
                            <th>Compensation</th>
                            <th>Applicants</th>
                            <th>Status</th>
                            <th>Moderation Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                                    Loading platform job listings...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    No job postings match the criteria.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((job) => (
                                <tr key={job.id}>
                                    <td>
                                        <div>
                                            <strong style={{ fontSize: "15px" }}>{job.title}</strong>
                                            <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                                                {job.companyName} • Recruiter: {job.recruiterEmail || "Verified Employer"}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{job.location || "Flexible"}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                            {job.workMode || "On-Site"} • {job.type || "Full Time"}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: "var(--primary-emerald)", fontWeight: "600" }}>
                                            {job.salary || "Competitive"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="sh-badge sh-badge-blue">
                                            {job.applicantCount || 0} Submissions
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`sh-badge ${job.status === "Active" ? "sh-badge-emerald" : "sh-badge-danger"}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleJobStatus(job.id, job.status)}
                                            className={`sh-btn sh-btn-sm ${job.status === "Active" ? "sh-btn-danger" : "sh-btn-primary"}`}
                                        >
                                            {job.status === "Active" ? "Close Listing" : "Activate Listing"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
