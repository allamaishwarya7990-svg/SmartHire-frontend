import { Link, useNavigate } from "react-router-dom";
import "../CSS/JobSeekerDashboard.css";

function JobSeekerDashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email") || "Job Seeker";

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };


    const jobs = [
        {
            id: 1,
            title: "Software Developer",
            company: "Technology Company",
            location: "Hyderabad",
            type: "Full Time",
            skills: ["Java", "React", "SQL"],
            eligibility: 80
        },
        {
            id: 2,
            title: "Frontend Developer",
            company: "Digital Solutions",
            location: "Hyderabad",
            type: "Full Time",
            skills: ["React", "JavaScript", "CSS"],
            eligibility: 75
        },
        {
            id: 3,
            title: "Java Developer",
            company: "Innovate Technologies",
            location: "Bangalore",
            type: "Full Time",
            skills: ["Java", "Spring Boot", "MySQL"],
            eligibility: 70
        }
    ];


    return (

        <div className="jobseeker-page">


            {/* ================= SIDEBAR ================= */}

            <aside className="dashboard-sidebar">

                <Link
                    to="/jobseeker-dashboard"
                    className="sidebar-logo"
                >
                    <span className="sidebar-logo-symbol">
                        S
                    </span>

                    <span>
                        SmartHire
                    </span>
                </Link>


                {/* USER */}

                <div className="sidebar-profile">

                    <div className="sidebar-avatar">
                        {email.charAt(0).toUpperCase()}
                    </div>

                    <div className="sidebar-user-info">

                        <strong>
                            Job Seeker
                        </strong>

                        <span>
                            Candidate
                        </span>

                    </div>

                </div>


                {/* MAIN MENU */}

                <div className="sidebar-section">

                    <p className="sidebar-heading">
                        MAIN MENU
                    </p>


                    <Link
                        to="/jobseeker-dashboard"
                        className="sidebar-link active"
                    >
                        <span className="sidebar-icon">
                            ⌂
                        </span>

                        <span>
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/jobs"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ◉
                        </span>

                        <span>
                            Find Jobs
                        </span>
                    </Link>


                    <Link
                        to="/applications"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ▣
                        </span>

                        <span>
                            My Applications
                        </span>
                    </Link>


                    <Link
                        to="/saved-jobs"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ♡
                        </span>

                        <span>
                            Saved Jobs
                        </span>
                    </Link>

                </div>


                {/* ACCOUNT */}

                <div className="sidebar-section">

                    <p className="sidebar-heading">
                        MY ACCOUNT
                    </p>


                    <Link
                        to="/profile"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ◯
                        </span>

                        <span>
                            My Profile
                        </span>
                    </Link>


                    <Link
                        to="/profile"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ⚙
                        </span>

                        <span>
                            Settings
                        </span>
                    </Link>

                </div>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="sidebar-help">

                        <div className="help-icon">
                            ?
                        </div>

                        <div>

                            <strong>
                                Need Help?
                            </strong>

                            <span>
                                We're here for you
                            </span>

                        </div>

                    </div>


                    <button
                        className="sidebar-logout"
                        onClick={logout}
                    >

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>



            {/* ================= MAIN CONTENT ================= */}

            <div className="dashboard-content">


                {/* TOP BAR */}

                <header className="dashboard-topbar">

                    <div className="topbar-left">

                        <p>
                            JOB SEEKER DASHBOARD
                        </p>

                        <h1>
                            Welcome back!
                        </h1>

                    </div>


                    <div className="topbar-right">

                        <button className="notification-button">
                            ♢
                        </button>


                        <div className="topbar-user">

                            <div className="topbar-avatar">
                                {email.charAt(0).toUpperCase()}
                            </div>

                            <div>

                                <strong>
                                    Job Seeker
                                </strong>

                                <span>
                                    {email}
                                </span>

                            </div>

                        </div>

                    </div>

                </header>



                {/* ================= DASHBOARD ================= */}

                <main className="dashboard-main">


                    {/* WELCOME BANNER */}

                    <section className="welcome-banner">

                        <div>

                            <span className="banner-label">
                                START YOUR JOURNEY
                            </span>

                            <h2>
                                Find the right opportunity
                                for your skills.
                            </h2>

                            <p>
                                Explore jobs, check your
                                eligibility, and take the
                                next step in your career.
                            </p>

                        </div>


                        <Link
                            to="/jobs"
                            className="banner-button"
                        >
                            Find Jobs
                            <span>→</span>
                        </Link>

                    </section>



                    {/* ================= STATS ================= */}

                    <section className="stats-section">


                        <div className="stat-card">

                            <div className="stat-icon">
                                ◯
                            </div>

                            <div className="stat-content">

                                <span>
                                    Profile
                                </span>

                                <strong>
                                    80%
                                </strong>

                                <small>
                                    Completed
                                </small>

                            </div>

                        </div>



                        <div className="stat-card">

                            <div className="stat-icon">
                                ♡
                            </div>

                            <div className="stat-content">

                                <span>
                                    Saved Jobs
                                </span>

                                <strong>
                                    5
                                </strong>

                                <small>
                                    Saved opportunities
                                </small>

                            </div>

                        </div>



                        <div className="stat-card">

                            <div className="stat-icon">
                                ▣
                            </div>

                            <div className="stat-content">

                                <span>
                                    Applications
                                </span>

                                <strong>
                                    3
                                </strong>

                                <small>
                                    Applications sent
                                </small>

                            </div>

                        </div>



                        <div className="stat-card">

                            <div className="stat-icon">
                                ✦
                            </div>

                            <div className="stat-content">

                                <span>
                                    Job Matches
                                </span>

                                <strong>
                                    8
                                </strong>

                                <small>
                                    Suitable jobs
                                </small>

                            </div>

                        </div>

                    </section>



                    {/* ================= LOWER CONTENT ================= */}

                    <section className="dashboard-grid">


                        {/* RECOMMENDED JOBS */}

                        <div className="jobs-section">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        Recommended Jobs
                                    </h2>

                                    <p>
                                        Opportunities based on
                                        your skills and qualifications
                                    </p>

                                </div>


                                <Link
                                    to="/jobs"
                                    className="view-all"
                                >
                                    View All →
                                </Link>

                            </div>



                            <div className="jobs-list">

                                {jobs.map((job) => (

                                    <div
                                        className="job-card"
                                        key={job.id}
                                    >

                                        <div className="job-top">

                                            <div className="company-icon">
                                                {job.title.charAt(0)}
                                            </div>


                                            <div className="job-title">

                                                <h3>
                                                    {job.title}
                                                </h3>

                                                <p>
                                                    {job.company}
                                                </p>

                                            </div>

                                        </div>



                                        <div className="job-details">

                                            <span>
                                                📍 {job.location}
                                            </span>

                                            <span>
                                                💼 {job.type}
                                            </span>

                                        </div>



                                        <div className="job-skills">

                                            {job.skills.map(
                                                (skill) => (

                                                    <span key={skill}>
                                                        {skill}
                                                    </span>

                                                )
                                            )}

                                        </div>



                                        <div className="job-bottom">

                                            <div className="eligibility">

                                                <div className="eligibility-header">

                                                    <span>
                                                        Eligibility
                                                    </span>

                                                    <strong>
                                                        {job.eligibility}%
                                                    </strong>

                                                </div>


                                                <div className="progress-bar">

                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width:
                                                                `${job.eligibility}%`
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>


                                            <button className="view-job-button">

                                                View Job
                                                <span>
                                                    →
                                                </span>

                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>



                        {/* RIGHT SIDE */}

                        <div className="dashboard-right">


                            {/* PROFILE */}

                            <div className="profile-card">

                                <div className="profile-card-title">

                                    <div className="profile-card-avatar">
                                        {email.charAt(0).toUpperCase()}
                                    </div>

                                    <div>

                                        <h3>
                                            Complete Your Profile
                                        </h3>

                                        <p>
                                            Improve your job matches
                                        </p>

                                    </div>

                                </div>



                                <div className="profile-progress">

                                    <div className="progress-ring">

                                        <span>
                                            80%
                                        </span>

                                    </div>


                                    <div className="profile-progress-info">

                                        <strong>
                                            Profile Strength
                                        </strong>

                                        <p>
                                            Add your remaining
                                            details to improve
                                            your profile.
                                        </p>

                                    </div>

                                </div>


                                <Link
                                    to="/profile"
                                    className="profile-button"
                                >
                                    Complete Profile
                                </Link>

                            </div>



                            {/* SMART ELIGIBILITY */}

                            <div className="smart-card">

                                <div className="smart-icon">
                                    ✦
                                </div>

                                <h3>
                                    Smart Eligibility
                                </h3>

                                <p>
                                    SmartHire compares your
                                    skills, education and
                                    experience with job
                                    requirements.
                                </p>

                                <span>
                                    Skill-based matching
                                </span>

                            </div>

                        </div>

                    </section>

                </main>



                {/* FOOTER */}

                <footer className="dashboard-footer">

                    <span>
                        © 2026 SmartHire
                    </span>

                    <span>
                        Skill-based job portal
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default JobSeekerDashboard;