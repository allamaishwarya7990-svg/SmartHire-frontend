import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FileText, 
    Search, 
    CheckCircle2, 
    Award, 
    Briefcase, 
    MapPin, 
    Calendar, 
    ArrowRight 
} from "lucide-react";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import "../CSS/RecruiterApplication.css";
import "../CSS/theme.css";

function RecruiterApplication() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [jobFilter, setJobFilter] = useState("All Jobs");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [loading, setLoading] = useState(true);

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const res = await recruiterApi.getApplications();
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((app) => ({
                    id: String(app.id),
                    candidate: app.applicantName || "Candidate",
                    email: app.applicantEmail,
                    job: app.jobTitle,
                    location: app.jobLocation || "Hyderabad, Telangana",
                    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent",
                    match: app.eligibilityScore ? `${app.eligibilityScore}%` : "85%",
                    status: app.status || "Application Submitted"
                }));
                setApplications(mapped);
            } else {
                setApplications([
                    {
                        id: "1",
                        candidate: "Aishwarya Allam",
                        email: "aishwarya@example.com",
                        job: "Software Developer",
                        location: "Hyderabad, Telangana",
                        appliedDate: "Recent",
                        match: "85%",
                        status: "Under Review"
                    }
                ]);
            }
        } catch (err) {
            console.warn("Could not load recruiter applications:", err);
            setApplications([
                {
                    id: "1",
                    candidate: "Aishwarya Allam",
                    email: "aishwarya@example.com",
                    job: "Software Developer",
                    location: "Hyderabad, Telangana",
                    appliedDate: "Recent",
                    match: "85%",
                    status: "Under Review"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("shortlist")) {
            return "recruiter-app-status-shortlisted";
        }
        if (s.includes("review")) {
            return "recruiter-app-status-review";
        }
        if (s.includes("reject")) {
            return "recruiter-app-status-rejected";
        }
        return "recruiter-app-status-submitted";
    };

    /*
     * FILTER LOGIC
     *
     * Search:
     * Candidate name OR email
     *
     * Job:
     * Selected job
     *
     * Status:
     * Selected application status
     *
     * All conditions must match.
     */
    const filteredApplications = applications.filter((application) => {

        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            application.candidate.toLowerCase().includes(search) ||
            application.email.toLowerCase().includes(search);

        const matchesJob =
            jobFilter === "All Jobs" ||
            application.job === jobFilter;

        const matchesStatus =
            statusFilter === "All Status" ||
            application.status === statusFilter;

        return (
            matchesSearch &&
            matchesJob &&
            matchesStatus
        );
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="recruiter-applications-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <RecruiterSidebar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="recruiter-applications-main">

                {/* TOPBAR */}

                <header className="recruiter-applications-topbar">

                    <div>

                        <span className="recruiter-applications-topbar-label">
                            RECRUITER PORTAL
                        </span>

                        <h1>
                            Applications
                        </h1>

                    </div>

                    <div className="recruiter-applications-profile">

                        <div className="recruiter-applications-avatar">
                            R
                        </div>

                        <div className="recruiter-applications-profile-info">

                            <strong>
                                {localStorage.getItem("email") ||
                                    "Recruiter"}
                            </strong>

                            <span>
                                Recruiter
                            </span>

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="recruiter-applications-content">

                    {/* PAGE HEADING */}

                    <section className="recruiter-applications-heading">

                        <div>

                            <span className="recruiter-applications-label">
                                CANDIDATE MANAGEMENT
                            </span>

                            <h2>
                                Candidate Applications
                            </h2>

                            <p>
                                Review candidates and manage applications
                                received for your job openings.
                            </p>

                        </div>

                    </section>


                    {/* STATS */}

                    <section className="recruiter-applications-stats">

                        <div className="recruiter-applications-stat-card">

                            <div className="recruiter-applications-stat-icon purple">
                                <FileText size={20} />
                            </div>

                            <div>

                                <span>
                                    Total Applications
                                </span>

                                <strong>
                                    {applications.length}
                                </strong>

                                <small>
                                    All received applications
                                </small>

                            </div>

                        </div>


                        <div className="recruiter-applications-stat-card">

                            <div className="recruiter-applications-stat-icon blue">
                                <Search size={20} />
                            </div>

                            <div>

                                <span>
                                    Under Review
                                </span>

                                <strong>
                                    {
                                        applications.filter(
                                            (app) =>
                                                app.status ===
                                                "Under Review"
                                        ).length
                                    }
                                </strong>

                                <small>
                                    Applications being reviewed
                                </small>

                            </div>

                        </div>


                        <div className="recruiter-applications-stat-card">

                            <div className="recruiter-applications-stat-icon green">
                                <CheckCircle2 size={20} />
                            </div>

                            <div>

                                <span>
                                    Shortlisted
                                </span>

                                <strong>
                                    {
                                        applications.filter(
                                            (app) =>
                                                app.status ===
                                                "Shortlisted"
                                        ).length
                                    }
                                </strong>

                                <small>
                                    Selected candidates
                                </small>

                            </div>

                        </div>


                        <div className="recruiter-applications-stat-card">

                            <div className="recruiter-applications-stat-icon orange">
                                <Award size={20} />
                            </div>

                            <div>

                                <span>
                                    Average Match
                                </span>

                                <strong>
                                    80%
                                </strong>

                                <small>
                                    Candidate eligibility
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* APPLICATIONS SECTION */}

                    <section className="recruiter-applications-section">

                        <div className="recruiter-applications-section-header">

                            <div>

                                <h2>
                                    All Applications
                                </h2>

                                <p>
                                    Review candidate applications and
                                    eligibility matches.
                                </p>

                            </div>

                            <span className="recruiter-applications-count">
                                {filteredApplications.length} Applications
                            </span>

                        </div>


                        {/* =================================================
                            SEARCH + FILTERS
                        ================================================= */}

                        <div className="recruiter-applications-toolbar">

                            {/* SEARCH */}

                            <div className="recruiter-applications-search">

                                <span>
                                    <Search size={16} />
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />

                            </div>


                            {/* JOB FILTER */}

                            <select
                                className="recruiter-applications-filter"
                                value={jobFilter}
                                onChange={(e) =>
                                    setJobFilter(e.target.value)
                                }
                            >

                                <option value="All Jobs">
                                    All Jobs
                                </option>

                                <option value="Software Developer">
                                    Software Developer
                                </option>

                                <option value="Java Developer">
                                    Java Developer
                                </option>

                                <option value="Frontend Developer">
                                    Frontend Developer
                                </option>

                            </select>


                            {/* STATUS FILTER */}

                            <select
                                className="recruiter-applications-filter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >

                                <option value="All Status">
                                    All Status
                                </option>

                                <option value="Application Submitted">
                                    Application Submitted
                                </option>

                                <option value="Under Review">
                                    Under Review
                                </option>

                                <option value="Shortlisted">
                                    Shortlisted
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            FILTERED APPLICATION LIST
                        ================================================= */}

                        <div className="recruiter-applications-list">

                            {filteredApplications.length > 0 ? (

                                filteredApplications.map((application) => (

                                    <div
                                        className="recruiter-application-card"
                                        key={application.id}
                                    >

                                        <div className="recruiter-application-avatar">
                                            {application.candidate.charAt(0)}
                                        </div>


                                        <div className="recruiter-application-main">

                                            <div className="recruiter-application-title-row">

                                                <div>

                                                    <h3>
                                                        {application.candidate}
                                                    </h3>

                                                    <p>
                                                        {application.email}
                                                    </p>

                                                </div>


                                                <span
                                                    className={`recruiter-application-status ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    {application.status}
                                                </span>

                                            </div>


                                            <div className="recruiter-application-meta">

                                                <span>
                                                    <Briefcase size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                                    {application.job}
                                                </span>

                                                <span>
                                                    <MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                                    {application.location}
                                                </span>

                                                <span>
                                                    <Calendar size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                                    {application.appliedDate}
                                                </span>

                                            </div>


                                            <div className="recruiter-application-bottom">

                                                <div className="recruiter-application-match">

                                                    <span>
                                                        Eligibility Match
                                                    </span>

                                                    <strong>
                                                        {application.match}
                                                    </strong>

                                                </div>


                                                <div className="recruiter-application-actions">

                                                    <span className="recruiter-application-id">
                                                        #{application.id}
                                                    </span>

                                                    <button
                                                        className="recruiter-view-application-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/recruiter/applications/${application.id}`
                                                            )
                                                        }
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                                    >
                                                        <span>View Details</span>
                                                        <ArrowRight size={13} />
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="recruiter-no-applications">

                                    <div className="no-applications-icon">
                                        <Search size={32} />
                                    </div>

                                    <h3>
                                        No applications found
                                    </h3>

                                    <p>
                                        Try changing your search or filter
                                        options.
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default RecruiterApplication;