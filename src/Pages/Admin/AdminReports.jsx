import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../services/api";
import { RotateCcw, X, AlertTriangle } from "lucide-react";

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [actionStatus, setActionStatus] = useState("RESOLVED");
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getReports();
            if (res.data) {
                setReports(res.data);
            }
        } catch (err) {
            console.error("Failed to load reports:", err);
            setMessage({ type: "error", text: "Failed to connect to backend for reports." });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResolutionModal = (report, status) => {
        setSelectedReport(report);
        setActionStatus(status);
        setResolutionNotes("");
    };

    const handleSubmitResolution = async () => {
        if (!selectedReport) return;
        try {
            await adminApi.resolveReport(selectedReport.id, actionStatus, resolutionNotes || `Actioned by Admin as ${actionStatus}`);
            setMessage({ type: "success", text: `Report #${selectedReport.id} marked as ${actionStatus}.` });
            setSelectedReport(null);
            loadReports();
        } catch (err) {
            console.error("Resolution submit error:", err);
            setMessage({ type: "error", text: "Failed to resolve report." });
        }
    };

    return (
        <AdminLayout
            title="Reports & Moderation Flags"
            subtitle="Investigate user grievances, spam, offensive listings, and platform violations."
            actions={
                <button onClick={loadReports} className="sh-btn sh-btn-secondary sh-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <RotateCcw size={14} /> Refresh Reports
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

            <div className="sh-table-container">
                <table className="sh-table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Target Entity</th>
                            <th>Violation Reason</th>
                            <th>Reporter</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                                    Loading platform reports...
                                </td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    No open reports found. Platform is clean!
                                </td>
                            </tr>
                        ) : (
                            reports.map((rep) => (
                                <tr key={rep.id}>
                                    <td>
                                        <span style={{ fontFamily: "monospace", color: "var(--status-warning)", fontWeight: "600" }}>
                                            #REP-{rep.id}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{rep.targetType}</strong>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                                ID: {rep.targetId}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong style={{ color: "var(--text-primary)" }}>{rep.reason}</strong>
                                            {rep.description && (
                                                <div style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "260px" }}>
                                                    {rep.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{rep.reporterEmail || "Anonymous"}</td>
                                    <td>
                                        <span className={`sh-badge ${rep.status === "RESOLVED" ? "sh-badge-emerald" : rep.status === "DISMISSED" ? "sh-badge-muted" : "sh-badge-warning"}`}>
                                            {rep.status}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                                        {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "Recent"}
                                    </td>
                                    <td>
                                        {rep.status === "PENDING" ? (
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => handleOpenResolutionModal(rep, "RESOLVED")}
                                                    className="sh-btn sh-btn-primary sh-btn-sm"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => handleOpenResolutionModal(rep, "DISMISSED")}
                                                    className="sh-btn sh-btn-secondary sh-btn-sm"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                                {rep.resolutionNotes || "Completed"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for resolving/dismissing report */}
            {selectedReport && (
                <div className="sh-modal-overlay">
                    <div className="sh-modal">
                        <div className="sh-modal-header">
                            <h3 className="sh-modal-title">
                                {actionStatus === "RESOLVED" ? "Resolve Report" : "Dismiss Report"} #{selectedReport.id}
                            </h3>
                            <button onClick={() => setSelectedReport(null)} className="sh-modal-close" style={{ display: "inline-flex", alignItems: "center" }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="sh-modal-body">
                            <p style={{ marginBottom: "16px", color: "var(--text-secondary)", fontSize: "14px" }}>
                                Violation reported against <strong>{selectedReport.targetType} (#{selectedReport.targetId})</strong> for:
                                <br />
                                <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{selectedReport.reason}</span>
                            </p>
                            <div className="sh-form-group">
                                <label className="sh-form-label">Admin Resolution Notes & Justification</label>
                                <textarea
                                    className="sh-textarea"
                                    placeholder="Enter administrative reason or action taken..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sh-modal-footer">
                            <button onClick={() => setSelectedReport(null)} className="sh-btn sh-btn-secondary">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitResolution}
                                className={`sh-btn ${actionStatus === "RESOLVED" ? "sh-btn-primary" : "sh-btn-danger"}`}
                            >
                                Confirm {actionStatus}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
