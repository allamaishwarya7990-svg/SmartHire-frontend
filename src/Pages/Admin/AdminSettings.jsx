import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { settingsApi } from "../../services/api";
import { X } from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        theme: "dark",
        jobAlerts: true,
        visibility: "PUBLIC"
    });
    const [systemConfig, setSystemConfig] = useState({
        requireRecruiterApproval: true,
        allowPublicRegistrations: true,
        maintenanceMode: false,
        maxOpeningsPerJob: 50
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [saving, setSaving] = useState(false);

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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await settingsApi.updateSettings(settings);
            setMessage({ type: "success", text: "System preferences successfully updated and synchronized." });
        } catch (err) {
            console.error("Failed to save settings:", err);
            setMessage({ type: "error", text: "Failed to persist settings changes." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout
            title="System Configuration & Preferences"
            subtitle="Platform policies, automated verification rules, and administrator notification channels."
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

            <form onSubmit={handleSave}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
                    {/* Platform Governance Policies */}
                    <div className="sh-card">
                        <div className="sh-card-header">
                            <h3 className="sh-card-title">Governance & Access Control</h3>
                        </div>
                        <div className="sh-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>Require Recruiter Approval</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Require manual admin approval before recruiter job postings go live.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemConfig.requireRecruiterApproval}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, requireRecruiterApproval: e.target.checked })}
                                    style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                                <div>
                                    <strong>Public User Registration</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Allow new job seekers and recruiters to self-register via registration portal.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemConfig.allowPublicRegistrations}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, allowPublicRegistrations: e.target.checked })}
                                    style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                                <div>
                                    <strong>System Maintenance Mode</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Lock non-administrative actions for scheduled database maintenance.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={systemConfig.maintenanceMode}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.checked })}
                                    style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification & Communication Channels */}
                    <div className="sh-card">
                        <div className="sh-card-header">
                            <h3 className="sh-card-title">Administrative Alerts & Preferences</h3>
                        </div>
                        <div className="sh-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>Critical Security Emails</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Receive email notifications when critical system reports or errors arise.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                    style={{ width: "18px", height: "18px", accentColor: "var(--primary-emerald)", cursor: "pointer" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                                <div>
                                    <strong>New Job Flag Alerts</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Immediate notifications when listings are flagged by job seekers.
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
                                    <strong>Design System Theme</strong>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Enforced color palette standard across administrative views.
                                    </p>
                                </div>
                                <span className="sh-badge sh-badge-emerald">Unified Dark Mode</span>
                            </div>
                        </div>
                        <div className="sh-card-footer">
                            <button type="submit" disabled={saving} className="sh-btn sh-btn-primary">
                                {saving ? "Saving Changes..." : "Save Preferences"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
