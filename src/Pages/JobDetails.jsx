import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../CSS/JobDetails.css";

const jobs = [
    {
        id: 1,
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad",
        type: "Full Time",
        experience: "0-2 Years",
        salary: "₹4.5 - 7 LPA",
        posted: "2 days ago",
        eligibility: 85,
        description:
            "We are looking for a motivated Software Developer to join our engineering team. You will work on scalable applications, REST APIs, database integration and modern web technologies.",
        skills: ["Java", "Spring Boot", "MySQL", "React"],
        education: "B.Tech / B.E. in Computer Science or related field",
        responsibilities: [
            "Develop and maintain web applications",
            "Build REST APIs using Spring Boot",
            "Work with MySQL databases",
            "Collaborate with frontend and backend teams",
            "Write clean and maintainable code"
        ]
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "PixelCraft Technologies",
        location: "Hyderabad",
        type: "Full Time",
        experience: "0-2 Years",
        salary: "₹4 - 6.5 LPA",
        posted: "3 days ago",
        eligibility: 80,
        description:
            "Join our frontend development team and create responsive, modern and user-friendly web applications using React and JavaScript.",
        skills: ["React", "JavaScript", "HTML", "CSS"],
        education: "B.Tech / B.E. / B.Sc. in Computer Science or related field",
        responsibilities: [
            "Build responsive React applications",
            "Create reusable UI components",
            "Integrate frontend applications with APIs",
            "Optimize application performance",
            "Work closely with UI/UX designers"
        ]
    },
    {
        id: 3,
        title: "Java Developer",
        company: "CodeSphere Pvt Ltd",
        location: "Bengaluru",
        type: "Full Time",
        experience: "1-3 Years",
        salary: "₹5 - 8 LPA",
        posted: "5 days ago",
        eligibility: 78,
        description:
            "We are hiring a Java Developer to build reliable backend services and enterprise applications using Java and Spring Boot.",
        skills: ["Java", "Spring Boot", "REST API", "MySQL"],
        education: "B.Tech / B.E. in Computer Science or related field",
        responsibilities: [
            "Develop backend services using Java",
            "Design RESTful APIs",
            "Work with relational databases",
            "Debug and optimize applications",
            "Participate in code reviews"
        ]
    },
    {
        id: 4,
        title: "Full Stack Developer",
        company: "InnovateHub",
        location: "Remote",
        type: "Full Time",
        experience: "1-3 Years",
        salary: "₹6 - 10 LPA",
        posted: "1 week ago",
        eligibility: 74,
        description:
            "Looking for a Full Stack Developer who can contribute to both frontend and backend development of modern web applications.",
        skills: ["React", "Java", "Spring Boot", "MongoDB"],
        education: "B.Tech / B.E. in Computer Science or related field",
        responsibilities: [
            "Develop frontend applications using React",
            "Create backend APIs",
            "Integrate databases",
            "Implement application features",
            "Collaborate with development teams"
        ]
    },
    {
        id: 5,
        title: "Backend Developer",
        company: "CloudMatrix Systems",
        location: "Pune",
        type: "Full Time",
        experience: "0-2 Years",
        salary: "₹4.5 - 7.5 LPA",
        posted: "1 week ago",
        eligibility: 72,
        description:
            "Work with our backend engineering team to develop scalable APIs and database-driven applications.",
        skills: ["Java", "Spring Boot", "SQL", "REST API"],
        education: "B.Tech / B.E. in Computer Science or related field",
        responsibilities: [
            "Develop backend APIs",
            "Design database queries",
            "Implement business logic",
            "Test backend services",
            "Maintain application performance"
        ]
    },
    {
        id: 6,
        title: "React Developer Intern",
        company: "WebWorks India",
        location: "Hyderabad",
        type: "Internship",
        experience: "Fresher",
        salary: "₹15k - 25k/month",
        posted: "4 days ago",
        eligibility: 68,
        description:
            "An exciting internship opportunity for students interested in frontend development and React applications.",
        skills: ["React", "JavaScript", "HTML", "CSS"],
        education: "Currently pursuing B.Tech / B.E. / B.Sc.",
        responsibilities: [
            "Develop React components",
            "Fix UI issues",
            "Learn frontend development practices",
            "Work with REST APIs",
            "Assist senior developers"
        ]
    }
];

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const job = jobs.find((item) => item.id === Number(id));

    const [saved, setSaved] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (!job) {
        return (
            <div className="job-details-not-found">
                <div className="not-found-icon">!</div>
                <h2>Job Not Found</h2>
                <p>The job you are looking for does not exist.</p>
                <button onClick={() => navigate("/jobs")}>
                    Back to Find Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="job-details-page">

            {/* Sidebar */}
            <aside className="job-details-sidebar">

                <div className="sidebar-logo">
                    <div className="logo-icon">S</div>
                    <div>
                        <h2>SmartHire</h2>
                        <span>Career Portal</span>
                    </div>
                </div>

                <nav className="job-details-nav">

                    <Link to="/jobseeker-dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/profile">
                        <span>◉</span>
                        My Profile
                    </Link>

                    <Link to="/jobs" className="active">
                        <span>⌕</span>
                        Find Jobs
                    </Link>

                    <Link to="/applications">
                        <span>▣</span>
                        My Applications
                    </Link>

                    <Link to="/saved-jobs">
                        <span>♡</span>
                        Saved Jobs
                    </Link>

                </nav>

                <div className="sidebar-bottom">
                    <div className="career-card">
                        <div className="career-card-icon">✦</div>
                        <h4>Smart Matching</h4>
                        <p>
                            Find opportunities that match your skills and
                            qualifications.
                        </p>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        <span>↪</span>
                        Logout
                    </button>
                </div>

            </aside>

            {/* Main */}
            <main className="job-details-main">

                {/* Topbar */}
                <header className="job-details-topbar">

                    <div>
                        <span className="breadcrumb">
                            Find Jobs / Job Details
                        </span>
                        <h3>Job Details</h3>
                    </div>

                    <div className="topbar-profile">
                        <div className="notification-icon">
                            ♢
                        </div>

                        <div className="profile-mini">
                            <div className="profile-avatar">
                                AS
                            </div>

                            <div>
                                <strong>
                                    {localStorage.getItem("email") || "Job Seeker"}
                                </strong>
                                <span>Job Seeker</span>
                            </div>
                        </div>
                    </div>

                </header>

                {/* Content */}
                <section className="job-details-content">

                    {/* Back */}
                    <button
                        className="back-to-jobs"
                        onClick={() => navigate("/jobs")}
                    >
                        ← Back to Jobs
                    </button>

                    {/* Job Header */}
                    <div className="job-details-header">

                        <div className="company-logo-large">
                            {job.company.charAt(0)}
                        </div>

                        <div className="job-header-info">

                            <div className="job-header-title-row">
                                <div>
                                    <span className="job-label">
                                        {job.type}
                                    </span>

                                    <h1>{job.title}</h1>

                                    <p className="company-name">
                                        {job.company}
                                    </p>
                                </div>

                                <button
                                    className={`save-job-details ${
                                        saved ? "saved" : ""
                                    }`}
                                    onClick={() => setSaved(!saved)}
                                >
                                    {saved ? "♥ Saved" : "♡ Save Job"}
                                </button>
                            </div>

                            <div className="job-meta-details">

                                <span>
                                    <b>⌖</b>
                                    {job.location}
                                </span>

                                <span>
                                    <b>◷</b>
                                    {job.experience}
                                </span>

                                <span>
                                    <b>₹</b>
                                    {job.salary}
                                </span>

                                <span>
                                    <b>◴</b>
                                    {job.posted}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Main Grid */}
                    <div className="job-details-grid">

                        {/* Left */}
                        <div className="job-details-left">

                            <section className="details-card">

                                <div className="section-heading">
                                    <div className="heading-number">01</div>
                                    <div>
                                        <span>ROLE OVERVIEW</span>
                                        <h2>About the Job</h2>
                                    </div>
                                </div>

                                <p className="job-description">
                                    {job.description}
                                </p>

                            </section>

                            <section className="details-card">

                                <div className="section-heading">
                                    <div className="heading-number">02</div>
                                    <div>
                                        <span>REQUIREMENTS</span>
                                        <h2>Required Skills</h2>
                                    </div>
                                </div>

                                <div className="skills-list">
                                    {job.skills.map((skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                            </section>

                            <section className="details-card">

                                <div className="section-heading">
                                    <div className="heading-number">03</div>
                                    <div>
                                        <span>EDUCATION</span>
                                        <h2>Educational Qualification</h2>
                                    </div>
                                </div>

                                <div className="education-box">
                                    <div className="education-icon">
                                        🎓
                                    </div>

                                    <div>
                                        <strong>Minimum Qualification</strong>
                                        <p>{job.education}</p>
                                    </div>
                                </div>

                            </section>

                            <section className="details-card">

                                <div className="section-heading">
                                    <div className="heading-number">04</div>
                                    <div>
                                        <span>RESPONSIBILITIES</span>
                                        <h2>What You Will Do</h2>
                                    </div>
                                </div>

                                <ul className="responsibility-list">
                                    {job.responsibilities.map(
                                        (responsibility, index) => (
                                            <li key={index}>
                                                <span>✓</span>
                                                {responsibility}
                                            </li>
                                        )
                                    )}
                                </ul>

                            </section>

                        </div>

                        {/* Right */}
                        <aside className="job-details-right">

                            {/* Eligibility */}
                            <div className="eligibility-card">

                                <div className="eligibility-top">
                                    <div>
                                        <span>Your Match</span>
                                        <h2>Eligibility Score</h2>
                                    </div>

                                    <div className="eligibility-score">
                                        {job.eligibility}%
                                    </div>
                                </div>

                                <div className="eligibility-progress">
                                    <div
                                        style={{
                                            width: `${job.eligibility}%`
                                        }}
                                    ></div>
                                </div>

                                <p>
                                    Based on your current skills,
                                    education and experience.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(`/job/${job.id}/eligibility`)
                                    }
                                >
                                    View Eligibility Analysis →
                                </button>

                            </div>

                            {/* Apply */}
                            <div className="apply-card">

                                <div className="apply-icon">
                                    ✓
                                </div>

                                <h3>Interested in this job?</h3>

                                <p>
                                    Check your eligibility and submit your
                                    application.
                                </p>

                                <button
                                    className="apply-button"
                                    onClick={() =>
                                        navigate(`/job/${job.id}/eligibility`)
                                    }
                                >
                                    Check Eligibility
                                    <span>→</span>
                                </button>

                            </div>

                            {/* Job Summary */}
                            <div className="summary-card">

                                <h3>Job Summary</h3>

                                <div className="summary-item">
                                    <span>Job Type</span>
                                    <strong>{job.type}</strong>
                                </div>

                                <div className="summary-item">
                                    <span>Experience</span>
                                    <strong>{job.experience}</strong>
                                </div>

                                <div className="summary-item">
                                    <span>Salary</span>
                                    <strong>{job.salary}</strong>
                                </div>

                                <div className="summary-item">
                                    <span>Location</span>
                                    <strong>{job.location}</strong>
                                </div>

                            </div>

                        </aside>

                    </div>

                </section>

                <footer className="job-details-footer">
                    <p>© 2026 SmartHire. Smart careers start here.</p>
                    <div>
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Help</span>
                    </div>
                </footer>

            </main>

        </div>
    );
}

export default JobDetails;