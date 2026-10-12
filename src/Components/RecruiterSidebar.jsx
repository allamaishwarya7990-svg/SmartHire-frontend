import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Briefcase, 
    PlusCircle, 
    Users, 
    Building2, 
    Settings, 
    LogOut 
} from "lucide-react";
import { authApi } from "../services/api";
import SmartHireLogo from "./SmartHireLogo";
import "../CSS/theme.css";

const recruiterNavItems = [
    { label: "Dashboard", path: "/recruiter-dashboard", Icon: LayoutDashboard },
    { label: "My Jobs", path: "/recruiter/jobs", Icon: Briefcase },
    { label: "Post a Job", path: "/recruiter/post-job", Icon: PlusCircle },
    { label: "Applications", path: "/recruiter/applications", Icon: Users },
    { label: "Company Profile", path: "/recruiter/company-profile", Icon: Building2 },
    { label: "Settings", path: "/recruiter/settings", Icon: Settings },
];

export default function RecruiterSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = authApi.getCurrentUser();
    const email = currentUser.email || "Recruiter";

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <aside className="sh-sidebar">
            <Link to="/recruiter-dashboard" className="sh-sidebar-brand" style={{ border: "none", padding: "20px 20px 14px" }}>
                <SmartHireLogo size="md" />
            </Link>

            <div className="sh-sidebar-role-badge">RECRUITER</div>

            <nav className="sh-nav-group" aria-label="Recruiter Navigation">
                <div className="sh-nav-section-title">HIRING CONSOLE</div>
                {recruiterNavItems.map((item) => {
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
                    <div className="sh-avatar" style={{ background: "linear-gradient(135deg, #00C98B, #087C60)", color: "#080B12" }}>
                        {email.charAt(0).toUpperCase()}
                    </div>
                    <div className="sh-user-meta">
                        <strong>Recruiter</strong>
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
