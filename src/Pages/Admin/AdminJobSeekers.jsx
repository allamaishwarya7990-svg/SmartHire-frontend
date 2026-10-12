import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../services/api";
import { RotateCcw, Search, X } from "lucide-react";

export default function AdminJobSeekers() {
    const [seekers, setSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    // Load all jobseekers from the backend
    const loadJobSeekers = useCallback(async () => {
        try {
            setLoading(true);

            const res = await adminApi.getJobSeekers();
            const data = Array.isArray(res.data) ? res.data : [];

            setSeekers(data);
        } catch (err) {
            console.error(
                "Failed to fetch jobseekers:",
                err.response?.data || err.message
            );

            setMessage({
                type: "error",
                text: "Failed to load jobseekers. Please check your backend connection.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadJobSeekers();
    }, [loadJobSeekers]);

    // Suspend or reactivate a jobseeker
    const handleToggleStatus = async (seeker) => {
        if (!seeker?.id) {
            setMessage({
                type: "error",
                text: "Cannot update this account because its user ID is missing.",
            });
            return;
        }

        const currentStatus = String(
            seeker.status || "ACTIVE"
        ).toUpperCase();

        const nextStatus =
            currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

        const confirmed = window.confirm(
            nextStatus === "SUSPENDED"
                ? `Are you sure you want to suspend ${
                      seeker.fullName || seeker.name || seeker.email || "this jobseeker"
                  }?`
                : `Are you sure you want to reactivate ${
                      seeker.fullName || seeker.name || seeker.email || "this jobseeker"
                  }?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(seeker.id);
            setMessage({ type: "", text: "" });

            // This must match the endpoint and request format in services/api.js.
            await adminApi.updateUserStatus(seeker.id, nextStatus);

            // Reload the authoritative status from the backend.
            const res = await adminApi.getJobSeekers();
            const updatedSeekers = Array.isArray(res.data)
                ? res.data
                : [];

            setSeekers(updatedSeekers);

            const updatedSeeker = updatedSeekers.find(
                (item) => String(item.id) === String(seeker.id)
            );

            if (
                updatedSeeker &&
                String(updatedSeeker.status || "ACTIVE").toUpperCase() !==
                    nextStatus
            ) {
                setMessage({
                    type: "error",
                    text: "The server response does not show the expected status. Check the backend update endpoint.",
                });
                return;
            }

            setMessage({
                type: "success",
                text:
                    nextStatus === "SUSPENDED"
                        ? "Jobseeker suspended successfully."
                        : "Jobseeker reactivated successfully.",
            });
        } catch (err) {
            console.error(
                "Jobseeker status update failed:",
                err.response?.status,
                err.response?.data || err.message
            );

            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to update jobseeker status. Check the API endpoint and backend logs.",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    // Search by candidate name, email, or skills
    const filteredSeekers = seekers.filter((seeker) => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return true;

        const name = String(
            seeker.fullName || seeker.name || ""
        ).toLowerCase();

        const email = String(seeker.email || "").toLowerCase();

        const skills = Array.isArray(seeker.skills)
            ? seeker.skills.join(", ").toLowerCase()
            : String(seeker.skills || "").toLowerCase();

        return (
            name.includes(query) ||
            email.includes(query) ||
            skills.includes(query)
        );
    });

    const getStatus = (seeker) =>
        String(seeker.status || "ACTIVE").toUpperCase();

    return (
        <AdminLayout
            title="Job Seeker Candidates"
            subtitle="View, monitor, and regulate registered job seeker accounts."
            actions={
                <button
                    type="button"
                    onClick={loadJobSeekers}
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
            {/* Feedback message */}
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

            {/* Search bar */}
            <div className="sh-filter-bar">
                <div className="sh-search-box">
                    <span className="sh-search-icon">
                        <Search size={16} />
                    </span>

                    <input
                        type="text"
                        className="sh-input"
                        placeholder="Search candidate by name, email, or skills..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />
                </div>
            </div>

            {/* Jobseekers table */}
            <div className="sh-table-container">
                <table className="sh-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Contact</th>
                            <th>Key Skills</th>
                            <th>Experience / Title</th>
                            <th>Status</th>
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
                                    Loading candidate records...
                                </td>
                            </tr>
                        ) : filteredSeekers.length === 0 ? (
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
                                        ? "No candidates match your search."
                                        : "No candidate records found."}
                                </td>
                            </tr>
                        ) : (
                            filteredSeekers.map((seeker) => {
                                const status = getStatus(seeker);
                                const isSuspended =
                                    status === "SUSPENDED";
                                const isUpdating =
                                    updatingId === seeker.id;

                                return (
                                    <tr key={seeker.id}>
                                        {/* Candidate */}
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <div
                                                    className="sh-avatar"
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        fontSize: "12px",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {(
                                                        seeker.fullName ||
                                                        seeker.name ||
                                                        seeker.email ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {seeker.fullName ||
                                                            seeker.name ||
                                                            "Unnamed Candidate"}
                                                    </strong>

                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "var(--text-secondary)",
                                                        }}
                                                    >
                                                        {seeker.email ||
                                                            "No email provided"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td>
                                            {seeker.phone ||
                                                "Not provided"}
                                        </td>

                                        {/* Skills */}
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "4px",
                                                    maxWidth: "250px",
                                                }}
                                            >
                                                {seeker.skills ? (
                                                    (
                                                        Array.isArray(
                                                            seeker.skills
                                                        )
                                                            ? seeker.skills
                                                            : String(
                                                                  seeker.skills
                                                              ).split(",")
                                                    ).map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="sh-badge sh-badge-muted"
                                                            style={{
                                                                fontSize: "11px",
                                                            }}
                                                        >
                                                            {String(
                                                                skill
                                                            ).trim()}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span
                                                        style={{
                                                            color: "var(--text-muted)",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        None listed
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Experience / title */}
                                        <td>
                                            {seeker.experience ||
                                                seeker.title ||
                                                "Fresh Graduate / Entry"}
                                        </td>

                                        {/* Status */}
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
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        seeker
                                                    )
                                                }
                                                className={`sh-btn sh-btn-sm ${
                                                    isSuspended
                                                        ? "sh-btn-primary"
                                                        : "sh-btn-danger"
                                                }`}
                                                style={{
                                                    minWidth: "100px",
                                                    opacity: isUpdating
                                                        ? 0.6
                                                        : 1,
                                                    cursor: isUpdating
                                                        ? "wait"
                                                        : "pointer",
                                                }}
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : isSuspended
                                                    ? "Reactivate"
                                                    : "Suspend"}
                                            </button>
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
