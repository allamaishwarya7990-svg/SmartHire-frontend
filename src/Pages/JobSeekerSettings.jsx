import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { settingsApi, authApi } from "../services/api";
import JobSeekerSidebar from "../Components/JobSeekerSidebar";
import { ArrowUpRight, X, Shield, Sliders } from "lucide-react";
import "../CSS/theme.css";

export default function JobSeekerSettings() {
    const navigate = useNavigate();
    const currentUser = authApi.getCurrentUser();
    const email = currentUser.email || "Job Seeker";

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        theme: "dark",
        jobAlerts: true,
        visibility: "PUBLIC"
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [savingSettings, setSavingSettings] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsApi.getSettings();
            if (res.data) {
                setSettings((prev) => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.warn("Could not load backend user settings:", err);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            setSavingSettings(true);
            await settingsApi.updateSettings(settings);
            setMessage({ type: "success", text: "Settings and preferences saved successfully!" });
        } catch (err) {
            console.error("Save settings error:", err);
            setMessage({ type: "error", text: "Failed to save settings. Please try again." });
        } finally {
            setSavingSettings(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New password and confirm password do not match." });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters long." });
            return;
        }

        try {
            setSavingPassword(true);
            await settingsApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: "success", text: "Password updated successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Password update error:", err);
            const errDetail = err.response?.data?.message || "Failed to change password. Please check your current password.";
            setMessage({ type: "error", text: errDetail });
        } finally {
            setSavingPassword(false);
        }
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="sh-layout">
            <JobSeekerSidebar />

            {/* Main Area */}
            <main className="sh-main">
                <header className="sh-topbar">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>
                            Candidate Account Portal
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link to="/jobs" className="sh-btn sh-btn-primary sh-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            Browse Open Jobs <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </header>

                <div className="sh-content">
                    <div className="sh-page-header">
                        <div>
                            <h1 className="sh-page-title">Candidate Settings & Preferences</h1>
                            <p className="sh-page-subtitle">Configure your job search alerts, privacy options, and account security credentials.</p>
                        </div>
                    </div>

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
                        {/* Preferences & Notifications */}
                        <div className="sh-card">
                            <div className="sh-card-header">
                                <h3 className="sh-card-title">Job Alerts & Notifications</h3>
                            </div>
                            <form onSubmit={handleSaveSettings}>
                                <div className="sh-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <strong>New Job Alerts</strong>
                                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                                Receive recommendations matching your profile skills.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.jobAlerts}
                                            onChange={(e) => setSettings({ ...settings, jobAlerts: e.target.checked })}
                                            style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                                        <div>
                                            <strong>Application Status Updates</strong>
                                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                                Receive instant notifications when recruiters review your application.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                            style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                        />
                                    </div>

                                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                                        <label className="sh-form-label" style={{ marginBottom: "8px", display: "block" }}>
                                            Profile Visibility to Recruiters
                                        </label>
                                        <select
                                            className="sh-select"
                                            value={settings.visibility}
                                            onChange={(e) => setSettings({ ...settings, visibility: e.target.value })}
                                        >
                                            <option value="PUBLIC">Public — Visible to verified recruiters</option>
                                            <option value="PRIVATE">Private — Only visible when applying</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sh-card-footer">
                                    <button type="submit" disabled={savingSettings} className="sh-btn sh-btn-primary">
                                        {savingSettings ? "Saving..." : "Save Preferences"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password & Security */}
                        <div className="sh-card">
                            <div className="sh-card-header">
                                <h3 className="sh-card-title">Change Password</h3>
                            </div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="sh-card-body">
                                    <div className="sh-form-group">
                                        <label className="sh-form-label">Current Password <span className="required">*</span></label>
                                        <input
                                            type="password"
                                            className="sh-input"
                                            placeholder="Enter your current password"
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
                                            placeholder="Minimum 6 characters"
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
                                            placeholder="Re-enter your new password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="sh-card-footer">
                                    <button type="submit" disabled={savingPassword} className="sh-btn sh-btn-primary">
                                        {savingPassword ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
