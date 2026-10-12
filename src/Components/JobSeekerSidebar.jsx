import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Search, 
    Bookmark, 
    FileText, 
    User, 
    Settings, 
    LogOut 
} from "lucide-react";
import { authApi } from "../services/api";
import SmartHireLogo from "./SmartHireLogo";
import "../CSS/theme.css";

const seekerNavItems = [
    { label: "Dashboard", path: "/jobseeker-dashboard", Icon: LayoutDashboard },
    { label: "Find Jobs", path: "/find-jobs", Icon: Search },
    { label: "Saved Jobs", path: "/saved-jobs", Icon: Bookmark },
    { label: "My Applications", path: "/my-applications", Icon: FileText },
    { label: "My Profile", path: "/jobseeker-profile", Icon: User },
    { label: "Settings", path: "/jobseeker-settings", Icon: Settings },
];

export default function JobSeekerSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = authApi.getCurrentUser();
    const email = currentUser.email || "Candidate";

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <aside className="sh-sidebar">
            <Link to="/jobseeker-dashboard" className="sh-sidebar-brand" style={{ border: "none", padding: "20px 20px 14px" }}>
                <SmartHireLogo size="md" />
            </Link>

            <div className="sh-sidebar-role-badge">JOB SEEKER</div>

            <nav className="sh-nav-group" aria-label="Job Seeker Navigation">
                <div className="sh-nav-section-title">CAREER PORTAL</div>
                {seekerNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.Icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sh-nav-item ${isActive ? "active" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className="sh-nav-icon">
                                <ItemIcon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sh-sidebar-footer">
                <div className="sh-user-profile-preview">
                    <div className="sh-avatar">{email.charAt(0).toUpperCase()}</div>
                    <div className="sh-user-meta">
                        <strong>Candidate</strong>
                        <span>{email}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="sh-btn sh-btn-secondary sh-btn-sm"
                    style={{ width: "100%", marginTop: "8px", gap: "8px" }}
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
