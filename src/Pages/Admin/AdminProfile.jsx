import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { authApi, settingsApi } from "../../services/api";
import { X } from "lucide-react";

export default function AdminProfile() {
    const currentUser = authApi.getCurrentUser();
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New password and confirmation do not match." });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: "error", text: "New password must be at least 8 characters long." });
            return;
        }

        try {
            setLoading(true);
            await settingsApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: "success", text: "Admin credentials successfully updated." });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Password update error:", err);
            const errDetail = err.response?.data?.message || "Failed to update password. Please check your current password.";
            setMessage({ type: "error", text: errDetail });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            title="Administrator Profile & Security"
            subtitle="Manage administrative privileges and update authentication credentials."
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
                {/* Account Details */}
                <div className="sh-card">
                    <div className="sh-card-header">
                        <h3 className="sh-card-title">Superuser Identity</h3>
                    </div>
                    <div className="sh-card-body">
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                            <div className="sh-avatar" style={{ width: "56px", height: "56px", fontSize: "22px" }}>
                                A
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "18px" }}>System Administrator</h4>
                                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                                    {currentUser.email || "admin@smarthire.local"}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Authorization Role</span>
                                <span className="sh-badge sh-badge-emerald">ADMIN (Full Access)</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Two-Factor Ready</span>
                                <span className="sh-badge sh-badge-blue">Enabled</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Audit Logging</span>
                                <span className="sh-badge sh-badge-emerald">Active</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Provisioning Model</span>
                                <span style={{ color: "var(--text-primary)" }}>Secure Random Bootstrapped</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="sh-card">
                    <div className="sh-card-header">
                        <h3 className="sh-card-title">Update Administrator Password</h3>
                    </div>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="sh-card-body">
                            <div className="sh-form-group">
                                <label className="sh-form-label">Current Admin Password <span className="required">*</span></label>
                                <input
                                    type="password"
                                    className="sh-input"
                                    placeholder="Enter current password"
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>

                            <div className="sh-form-group">
                                <label className="sh-form-label">New Password <span className="required">*</span></label>
                                <input
                                    type="password"
                                    className="sh-input"
                                    placeholder="Minimum 8 characters"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>

                            <div className="sh-form-group">
                                <label className="sh-form-label">Confirm New Password <span className="required">*</span></label>
                                <input
                                    type="password"
                                    className="sh-input"
                                    placeholder="Re-enter new password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="sh-card-footer">
                            <button type="submit" disabled={loading} className="sh-btn sh-btn-primary">
                                {loading ? "Updating..." : "Update Credentials"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
