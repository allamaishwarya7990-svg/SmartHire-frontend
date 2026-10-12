import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FileText, 
    Clock, 
    CheckCircle2, 
    MapPin, 
    Calendar, 
    Sparkles, 
    ArrowRight,
    Search,
    Inbox
} from "lucide-react";
import { jobSeekerApi } from "../services/api";
import JobSeekerSidebar from "../Components/JobSeekerSidebar";
import "../CSS/MyApplications.css";
import "../CSS/theme.css";

const fallbackApplications = [
    {
        id: "1",
        jobId: "1",
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        appliedDate: "Recently",
        status: "Under Review",
        eligibility: "85%"
    }
];

function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const res = await jobSeekerApi.getApplications();
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((app) => ({
                    id: String(app.id),
                    jobId: String(app.jobId),
                    title: app.jobTitle,
                    company: app.companyName,
                    location: app.jobLocation || "Hybrid",
                    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent",
                    status: app.status || "Application Submitted",
                    eligibility: app.eligibilityScore ? `${app.eligibilityScore}%` : "80%"
                }));
                setApplications(mapped);
            } else {
                setApplications(fallbackApplications);
            }
        } catch (err) {
            console.warn("Could not load applications from API, using fallback:", err);
            setApplications(fallbackApplications);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("shortlist")) return "status-shortlisted";
        if (s.includes("review")) return "status-review";
        if (s.includes("reject")) return "status-rejected";
        return "status-submitted";
    };

    const underReviewCount = applications.filter((a) => (a.status || "").toLowerCase().includes("review")).length;
    const shortlistedCount = applications.filter((a) => (a.status || "").toLowerCase().includes("shortlist")).length;

    return (
        <div className="applications-page">
            <JobSeekerSidebar />

            <main className="applications-main">
                {/* Topbar */}
                <header className="applications-topbar">
                    <div>
                        <h2>My Applications</h2>
                        <p>Track and manage all the positions you have submitted applications for.</p>
                    </div>

                    <button className="sh-btn sh-btn-primary sh-btn-sm" onClick={() => navigate("/jobs")} style={{ gap: "6px" }}>
                        <Search size={14} />
                        <span>Find More Jobs</span>
                    </button>
                </header>

                <div className="applications-container">
                    {/* Summary Metrics */}
                    <div className="application-summary">
                        <div className="summary-card">
                            <div className="summary-icon blue">
                                <FileText size={20} />
                            </div>
                            <div>
                                <span>Total Applications</span>
                                <strong>{applications.length}</strong>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon warning">
                                <Clock size={20} />
                            </div>
                            <div>
                                <span>Under Review</span>
                                <strong>{underReviewCount}</strong>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon green">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <span>Shortlisted</span>
                                <strong>{shortlistedCount}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Applications List */}
                    <section className="applications-section">
                        <div className="applications-section-header">
                            <div>
                                <h2>Submitted Applications</h2>
                                <p>Real-time status tracking updated directly by verified employers.</p>
                            </div>
                            <span className="application-count">
                                {applications.length} Applications
                            </span>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                                Loading your applications...
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="sh-empty-state">
                                <div className="sh-empty-icon">
                                    <Inbox size={32} />
                                </div>
                                <h3 className="sh-empty-title">No applications submitted yet</h3>
                                <p className="sh-empty-desc">Explore open jobs and submit your first application today!</p>
                                <button className="sh-btn sh-btn-primary" onClick={() => navigate("/jobs")}>
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="applications-list">
                                {applications.map((application) => (
                                    <div className="application-card" key={application.id}>
                                        <div className="application-company-icon">
                                            {application.company.charAt(0)}
                                        </div>

                                        <div className="application-main">
                                            <div className="application-title-row">
                                                <div>
                                                    <h3>{application.title}</h3>
                                                    <p>{application.company}</p>
                                                </div>

                                                <span className={`application-status ${getStatusClass(application.status)}`}>
                                                    {application.status}
                                                </span>
                                            </div>

                                            <div className="application-meta">
                                                <span><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{application.location}</span>
                                                <span><Calendar size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />Applied {application.appliedDate}</span>
                                                <span><Sparkles size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{application.eligibility} Match</span>
                                            </div>

                                            <div className="application-bottom">
                                                <span className="application-number">
                                                    Application ID: <strong>#APP-{application.id}</strong>
                                                </span>

                                                <button
                                                    className="view-application-btn"
                                                    onClick={() => navigate(`/applications/${application.id}`)}
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                                >
                                                    <span>View Details</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default MyApplications;