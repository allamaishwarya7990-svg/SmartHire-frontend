import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    Briefcase, 
    FileText, 
    AlertTriangle, 
    UserCheck, 
    Settings, 
    LogOut,
    ExternalLink 
} from "lucide-react";
import { authApi } from "../../services/api";
import SmartHireLogo from "../../Components/SmartHireLogo";
import "../../CSS/theme.css";

const navItems = [
    { label: "Dashboard", path: "/admin-dashboard", Icon: LayoutDashboard },
    { label: "Job Seekers", path: "/admin/jobseekers", Icon: Users },
    { label: "Recruiters", path: "/admin/recruiters", Icon: Building2 },
    { label: "Job Postings", path: "/admin/jobs", Icon: Briefcase },
    { label: "Applications", path: "/admin/applications", Icon: FileText },
    { label: "Reports & Flags", path: "/admin/reports", Icon: AlertTriangle },
    { label: "Admin Profile", path: "/admin/profile", Icon: UserCheck },
    { label: "System Settings", path: "/admin/settings", Icon: Settings },
];

export default function AdminLayout({ children, title, subtitle, actions }) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = authApi.getCurrentUser();
    const email = currentUser.email || "admin@smarthire.local";

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="sh-layout">
            {/* Sidebar */}
            <aside className="sh-sidebar">
                <Link to="/admin-dashboard" className="sh-sidebar-brand" style={{ border: "none", padding: "20px 20px 14px" }}>
                    <SmartHireLogo size="md" />
                </Link>

                <div className="sh-sidebar-role-badge">SYSTEM ADMIN</div>

                <div className="sh-nav-group">
                    <div className="sh-nav-section-title">ADMIN CONTROL</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const ItemIcon = item.Icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sh-nav-item ${isActive ? "active" : ""}`}
                            >
                                <span className="sh-nav-icon">
                                    <ItemIcon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="sh-sidebar-footer">
                    <div className="sh-user-profile-preview">
                        <div className="sh-avatar">A</div>
                        <div className="sh-user-meta">
                            <strong>Admin Console</strong>
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

            {/* Main Content Area */}
            <main className="sh-main">
                <header className="sh-topbar">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "var(--primary-emerald)", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary-emerald)", display: "inline-block", boxShadow: "0 0 8px var(--primary-emerald)" }} />
                            System Status: Online
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            Signed in as <strong>{email}</strong>
                        </span>
                        <Link to="/" className="sh-btn sh-btn-secondary sh-btn-sm" style={{ gap: "6px" }}>
                            <span>Public Portal</span>
                            <ExternalLink size={14} />
                        </Link>
                    </div>
                </header>

                <div className="sh-content">
                    {(title || subtitle || actions) && (
                        <div className="sh-page-header">
                            <div>
                                {title && <h1 className="sh-page-title">{title}</h1>}
                                {subtitle && <p className="sh-page-subtitle">{subtitle}</p>}
                            </div>
                            {actions && <div className="sh-header-actions">{actions}</div>}
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
