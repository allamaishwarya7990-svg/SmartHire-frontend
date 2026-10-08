import { useNavigate } from "react-router-dom";
import "../CSS/MyApplications.css";

function MyApplications() {
    const navigate = useNavigate();

    const applications = [
        {
            id: "APP-1001",
            jobId: "1",
            title: "Software Developer",
            company: "TechNova Solutions",
            location: "Hyderabad, Telangana",
            appliedDate: "08 Oct 2026",
            status: "Under Review",
            eligibility: "80%"
        },
        {
            id: "APP-1002",
            jobId: "2",
            title: "Java Developer",
            company: "CodeCraft Technologies",
            location: "Hyderabad, Telangana",
            appliedDate: "05 Oct 2026",
            status: "Shortlisted",
            eligibility: "90%"
        },
        {
            id: "APP-1003",
            jobId: "3",
            title: "Frontend Developer",
            company: "PixelSoft Pvt. Ltd.",
            location: "Remote",
            appliedDate: "02 Oct 2026",
            status: "Application Submitted",
            eligibility: "75%"
        }
    ];

    const getStatusClass = (status) => {
        if (status === "Shortlisted") {
            return "status-shortlisted";
        }

        if (status === "Under Review") {
            return "status-review";
        }

        if (status === "Rejected") {
            return "status-rejected";
        }

        return "status-submitted";
    };

    return (
        <div className="applications-page">

            {/* Header */}
            <header className="applications-header">

                <div
                    className="applications-logo"
                    onClick={() => navigate("/jobseeker-dashboard")}
                >
                    Smart<span>Hire</span>
                </div>

                <div className="applications-header-actions">
                    <button
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate("/jobseeker-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>
                </div>

            </header>

            {/* Main Content */}
            <main className="applications-container">

                <div className="applications-heading">
                    <div>
                        <span className="applications-label">
                            JOB SEEKER
                        </span>

                        <h1>My Applications</h1>

                        <p>
                            Track and manage all the jobs you have applied for.
                        </p>
                    </div>

                    <button
                        className="find-jobs-btn"
                        onClick={() => navigate("/jobs")}
                    >
                        Find More Jobs →
                    </button>
                </div>

                {/* Summary */}
                <div className="application-summary">

                    <div className="summary-card">
                        <div className="summary-icon purple">
                            📄
                        </div>

                        <div>
                            <span>Total Applications</span>
                            <strong>{applications.length}</strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon blue">
                            🔍
                        </div>

                        <div>
                            <span>Under Review</span>
                            <strong>
                                {
                                    applications.filter(
                                        (app) =>
                                            app.status === "Under Review"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon green">
                            ✓
                        </div>

                        <div>
                            <span>Shortlisted</span>
                            <strong>
                                {
                                    applications.filter(
                                        (app) =>
                                            app.status === "Shortlisted"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                </div>

                {/* Applications List */}
                <section className="applications-section">

                    <div className="applications-section-header">
                        <div>
                            <h2>Recent Applications</h2>
                            <p>
                                Your latest job applications and their current
                                status.
                            </p>
                        </div>

                        <span className="application-count">
                            {applications.length} Applications
                        </span>
                    </div>

                    <div className="applications-list">

                        {applications.map((application) => (
                            <div
                                className="application-card"
                                key={application.id}
                            >

                                {/* Company Icon */}
                                <div className="application-company-icon">
                                    {application.company.charAt(0)}
                                </div>

                                {/* Main Info */}
                                <div className="application-main">

                                    <div className="application-title-row">

                                        <div>
                                            <h3>
                                                {application.title}
                                            </h3>

                                            <p>
                                                {application.company}
                                            </p>
                                        </div>

                                        <span
                                            className={`application-status ${getStatusClass(
                                                application.status
                                            )}`}
                                        >
                                            {application.status}
                                        </span>

                                    </div>

                                    <div className="application-meta">

                                        <span>
                                            📍 {application.location}
                                        </span>

                                        <span>
                                            📅 Applied{" "}
                                            {application.appliedDate}
                                        </span>

                                        <span>
                                            ✓ {application.eligibility} Match
                                        </span>

                                    </div>

                                    <div className="application-bottom">

                                        <span className="application-number">
                                            Application ID:{" "}
                                            <strong>
                                                {application.id}
                                            </strong>
                                        </span>

                                        <button
                                            className="view-application-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/applications/${application.id}`
                                                )
                                            }
                                        >
                                            View Application →
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default MyApplications;