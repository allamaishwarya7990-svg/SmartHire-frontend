import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../services/api";
import { RotateCcw, Search, X } from "lucide-react";

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getApplications();
            if (res.data) {
                setApplications(res.data);
            }
        } catch (err) {
            console.error("Failed to load admin applications:", err);
            setMessage({ type: "error", text: "Failed to connect to backend for application records." });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "SHORTLISTED":
                return "sh-badge-emerald";
            case "UNDER_REVIEW":
                return "sh-badge-blue";
            case "REJECTED":
                return "sh-badge-danger";
            default:
                return "sh-badge-warning";
        }
    };

    const filtered = applications.filter((app) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            (app.candidateName && app.candidateName.toLowerCase().includes(q)) ||
            (app.candidateEmail && app.candidateEmail.toLowerCase().includes(q)) ||
            (app.jobTitle && app.jobTitle.toLowerCase().includes(q)) ||
            (app.companyName && app.companyName.toLowerCase().includes(q));

        if (statusFilter === "ALL") return matchesSearch;
        return matchesSearch && app.status === statusFilter;
    });

    return (
        <AdminLayout
            title="Platform Job Applications"
            subtitle="Full lifecycle oversight of candidate submissions across all employers."
            actions={
                <button onClick={loadApplications} className="sh-btn sh-btn-secondary sh-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <RotateCcw size={14} /> Refresh Applications
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
                        placeholder="Search by candidate name, email, job title, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="sh-select"
                    style={{ width: "200px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Application Statuses</option>
                    <option value="APPLIED">Applied (New)</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <div className="sh-table-container">
                <table className="sh-table">
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Candidate</th>
                            <th>Applied Position</th>
                            <th>Hiring Company</th>
                            <th>Match Score</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                                    Loading platform applications...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    No applications match current filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((app) => (
                                <tr key={app.id}>
                                    <td>
                                        <span style={{ fontFamily: "monospace", color: "var(--secondary-blue)", fontWeight: "600" }}>
                                            #APP-{app.id}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{app.candidateName || "Candidate"}</strong>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                                {app.candidateEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{app.jobTitle}</strong>
                                    </td>
                                    <td>{app.companyName}</td>
                                    <td>
                                        <span style={{ fontWeight: "700", color: "var(--primary-emerald)" }}>
                                            {app.eligibilityScore ? `${app.eligibilityScore}%` : "75%"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`sh-badge ${getStatusBadge(app.status)}`}>
                                            {app.status ? app.status.replace("_", " ") : "APPLIED"}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "Recent"}
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
