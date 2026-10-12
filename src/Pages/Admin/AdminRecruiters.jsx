import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../services/api";
import {
    RotateCcw,
    Search,
    X,
    CheckCircle2,
    Clock,
} from "lucide-react";

export default function AdminRecruiters() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [updatingCompanyId, setUpdatingCompanyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    // Load recruiters from the backend
    const loadRecruiters = useCallback(async () => {
        try {
            setLoading(true);

            const res = await adminApi.getRecruiters();
            setRecruiters(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(
                "Failed to load recruiters:",
                err.response?.data || err.message
            );

            setMessage({
                type: "error",
                text: "Failed to load recruiter records. Please check the backend connection.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecruiters();
    }, [loadRecruiters]);

    // Suspend or reactivate a recruiter account
    const handleStatusToggle = async (recruiter) => {
        const userId = recruiter.userId ?? recruiter.id;

        if (userId == null) {
            setMessage({
                type: "error",
                text: "Recruiter user ID is missing. Check the backend response.",
            });
            return;
        }

        const currentStatus = String(
            recruiter.userStatus || recruiter.status || "ACTIVE"
        ).toUpperCase();

        const nextStatus =
            currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

        const confirmed = window.confirm(
            nextStatus === "SUSPENDED"
                ? `Are you sure you want to suspend ${
                      recruiter.recruiterName ||
                      recruiter.fullName ||
                      recruiter.email ||
                      "this recruiter"
                  }?`
                : `Are you sure you want to reactivate ${
                      recruiter.recruiterName ||
                      recruiter.fullName ||
                      recruiter.email ||
                      "this recruiter"
                  }?`
        );

        if (!confirmed) return;

        try {
            setUpdatingUserId(userId);
            setMessage({ type: "", text: "" });

            await adminApi.updateUserStatus(userId, nextStatus);

            // Reload the latest status from the backend
            const res = await adminApi.getRecruiters();
            const updatedRecruiters = Array.isArray(res.data)
                ? res.data
                : [];

            setRecruiters(updatedRecruiters);

            const updatedRecruiter = updatedRecruiters.find(
                (item) =>
                    String(item.userId ?? item.id) === String(userId)
            );

            const actualStatus = String(
                updatedRecruiter?.userStatus ??
                    updatedRecruiter?.status ??
                    ""
            ).toUpperCase();

            if (
                updatedRecruiter &&
                actualStatus !== nextStatus
            ) {
                setMessage({
                    type: "error",
                    text: "The refreshed recruiter status does not match the requested status. Check the backend update and database.",
                });
                return;
            }

            setMessage({
                type: "success",
                text:
                    nextStatus === "SUSPENDED"
                        ? "Recruiter account suspended successfully."
                        : "Recruiter account reactivated successfully.",
            });
        } catch (err) {
            console.error(
                "Recruiter status update failed:",
                err.response?.status,
                err.response?.data || err.message
            );

            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to update recruiter status. Check the API endpoint and backend logs.",
            });
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Approve or revoke company verification
    const handleApprovalToggle = async (recruiter) => {
        const companyId = recruiter.companyId;

        if (companyId == null) {
            setMessage({
                type: "error",
                text: "This recruiter has no company profile to verify.",
            });
            return;
        }

        const nextApproval = !Boolean(recruiter.isVerified);

        try {
            setUpdatingCompanyId(companyId);
            setMessage({ type: "", text: "" });

            await adminApi.updateRecruiterApproval(
                companyId,
                nextApproval
            );

            await loadRecruiters();

            setMessage({
                type: "success",
                text: nextApproval
                    ? "Recruiter organization approved and verified."
                    : "Recruiter organization verification revoked.",
            });
        } catch (err) {
            console.error(
                "Recruiter approval failed:",
                err.response?.status,
                err.response?.data || err.message
            );

            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    "Failed to update recruiter verification.",
            });
        } finally {
            setUpdatingCompanyId(null);
        }
    };

    // Search recruiters by company, name, email, or industry
    const filteredRecruiters = recruiters.filter((recruiter) => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return true;

        const companyName = String(
            recruiter.companyName || ""
        ).toLowerCase();

        const recruiterName = String(
            recruiter.recruiterName ||
                recruiter.fullName ||
                ""
        ).toLowerCase();

        const email = String(
            recruiter.email || ""
        ).toLowerCase();

        const industry = String(
            recruiter.industry || ""
        ).toLowerCase();

        return (
            companyName.includes(query) ||
            recruiterName.includes(query) ||
            email.includes(query) ||
            industry.includes(query)
        );
    });

    return (
        <AdminLayout
            title="Recruiter & Employer Verification"
            subtitle="Validate employer credentials, company profiles, and authorization status."
            actions={
                <button
                    type="button"
                    onClick={loadRecruiters}
                    disabled={loading}
                    className="sh-btn sh-btn-secondary sh-btn-sm"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    <RotateCcw size={14} />
                    {loading ? "Refreshing..." : "Refresh List"}
                </button>
            }
        >
            {/* Feedback messages */}
            {message.text && (
                <div
                    className={`sh-alert sh-alert-${message.type}`}
                    role="alert"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "16px",
                    }}
                >
                    <span>{message.text}</span>

                    <button
                        type="button"
                        aria-label="Dismiss message"
                        onClick={() =>
                            setMessage({ type: "", text: "" })
                        }
                        style={{
                            background: "none",
                            border: "none",
                            color: "inherit",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="sh-filter-bar">
                <div className="sh-search-box">
                    <span className="sh-search-icon">
                        <Search size={16} />
                    </span>

                    <input
                        type="text"
                        className="sh-input"
                        placeholder="Search by company name, recruiter, email, or industry..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />
                </div>
            </div>

            {/* Recruiters table */}
            <div className="sh-table-container">
                <table className="sh-table">
                    <thead>
                        <tr>
                            <th>Company / Employer</th>
                            <th>Recruiter Contact</th>
                            <th>Industry & Location</th>
                            <th>Verification</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign: "center",
                                        padding: "40px",
                                    }}
                                >
                                    Loading recruiter records...
                                </td>
                            </tr>
                        ) : filteredRecruiters.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign: "center",
                                        padding: "40px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {searchTerm
                                        ? "No recruiters match your search."
                                        : "No recruiter records found."}
                                </td>
                            </tr>
                        ) : (
                            filteredRecruiters.map((item) => {
                                const userId = item.userId ?? item.id;

                                const status = String(
                                    item.userStatus ||
                                        item.status ||
                                        "ACTIVE"
                                ).toUpperCase();

                                const isSuspended =
                                    status === "SUSPENDED";

                                const isStatusUpdating =
                                    updatingUserId != null &&
                                    String(updatingUserId) ===
                                        String(userId);

                                const isApprovalUpdating =
                                    updatingCompanyId != null &&
                                    String(updatingCompanyId) ===
                                        String(item.companyId);

                                return (
                                    <tr
                                        key={
                                            userId ??
                                            item.email ??
                                            item.companyName
                                        }
                                    >
                                        {/* Company */}
                                        <td>
                                            <div>
                                                <strong>
                                                    {item.companyName ||
                                                        "Organization Profile"}
                                                </strong>

                                                {item.website && (
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        <a
                                                            href={item.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{
                                                                color: "var(--secondary-blue)",
                                                            }}
                                                        >
                                                            {item.website}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Recruiter contact */}
                                        <td>
                                            <div>
                                                <div>
                                                    {item.recruiterName ||
                                                        item.fullName ||
                                                        "Lead Recruiter"}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    {item.email ||
                                                        "No email provided"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Industry and location */}
                                        <td>
                                            <div>
                                                {item.industry ||
                                                    "General Industry"}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                {item.location ||
                                                    "Location not set"}
                                            </div>
                                        </td>

                                        {/* Company verification */}
                                        <td>
                                            <span
                                                className={`sh-badge ${
                                                    item.isVerified
                                                        ? "sh-badge-emerald"
                                                        : "sh-badge-warning"
                                                }`}
                                            >
                                                {item.isVerified ? (
                                                    <span
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                        }}
                                                    >
                                                        <CheckCircle2
                                                            size={13}
                                                        />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                        }}
                                                    >
                                                        <Clock size={13} />
                                                        Pending Review
                                                    </span>
                                                )}
                                            </span>
                                        </td>

                                        {/* Account status */}
                                        <td>
                                            <span
                                                className={`sh-badge ${
                                                    isSuspended
                                                        ? "sh-badge-danger"
                                                        : "sh-badge-emerald"
                                                }`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "8px",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !item.companyId ||
                                                        isApprovalUpdating
                                                    }
                                                    onClick={() =>
                                                        handleApprovalToggle(
                                                            item
                                                        )
                                                    }
                                                    className={`sh-btn sh-btn-sm ${
                                                        item.isVerified
                                                            ? "sh-btn-secondary"
                                                            : "sh-btn-primary"
                                                    }`}
                                                >
                                                    {isApprovalUpdating
                                                        ? "Updating..."
                                                        : item.isVerified
                                                        ? "Revoke"
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        userId == null ||
                                                        isStatusUpdating
                                                    }
                                                    onClick={() =>
                                                        handleStatusToggle(
                                                            item
                                                        )
                                                    }
                                                    className={`sh-btn sh-btn-sm ${
                                                        isSuspended
                                                            ? "sh-btn-blue"
                                                            : "sh-btn-danger"
                                                    }`}
                                                >
                                                    {isStatusUpdating
                                                        ? "Updating..."
                                                        : isSuspended
                                                        ? "Reactivate"
                                                        : "Suspend"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
