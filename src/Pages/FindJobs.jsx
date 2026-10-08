import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/FindJobs.css";

function FindJobs() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("All");
    const [experience, setExperience] = useState("All");
    const [sortBy, setSortBy] = useState("Recommended");

    const [savedJobs, setSavedJobs] = useState([]);

    const jobs = [
        {
            id: 1,
            title: "Software Developer",
            company: "TechNova Solutions",
            location: "Hyderabad, Telangana",
            type: "Full Time",
            experience: "0-2 Years",
            salary: "₹4.5 - 7 LPA",
            posted: "2 days ago",
            skills: ["Java", "Spring Boot", "MySQL", "React"],
            eligibility: 85,
            applicants: 42,
            description:
                "Looking for a motivated software developer to build scalable web applications using Java and modern technologies."
        },
        {
            id: 2,
            title: "Frontend Developer",
            company: "PixelCraft Technologies",
            location: "Hyderabad, Telangana",
            type: "Full Time",
            experience: "0-2 Years",
            salary: "₹4 - 6.5 LPA",
            posted: "1 day ago",
            skills: ["React", "JavaScript", "HTML", "CSS"],
            eligibility: 80,
            applicants: 31,
            description:
                "Join our frontend team to develop responsive and interactive web applications using React."
        },
        {
            id: 3,
            title: "Java Developer",
            company: "CodeSphere Pvt Ltd",
            location: "Bengaluru, Karnataka",
            type: "Full Time",
            experience: "1-3 Years",
            salary: "₹5 - 8 LPA",
            posted: "3 days ago",
            skills: ["Java", "Spring Boot", "REST API", "MySQL"],
            eligibility: 78,
            applicants: 56,
            description:
                "We are looking for a Java developer with strong backend development and database skills."
        },
        {
            id: 4,
            title: "Full Stack Developer",
            company: "InnovateHub",
            location: "Remote",
            type: "Full Time",
            experience: "1-3 Years",
            salary: "₹6 - 10 LPA",
            posted: "4 days ago",
            skills: ["React", "Java", "Spring Boot", "MongoDB"],
            eligibility: 74,
            applicants: 63,
            description:
                "Work across frontend and backend technologies to build complete and scalable applications."
        },
        {
            id: 5,
            title: "Backend Developer",
            company: "CloudMatrix Systems",
            location: "Pune, Maharashtra",
            type: "Full Time",
            experience: "0-2 Years",
            salary: "₹4.5 - 7.5 LPA",
            posted: "5 days ago",
            skills: ["Java", "Spring Boot", "SQL", "REST API"],
            eligibility: 72,
            applicants: 38,
            description:
                "Develop reliable backend services and REST APIs for enterprise applications."
        },
        {
            id: 6,
            title: "React Developer Intern",
            company: "WebWorks India",
            location: "Hyderabad, Telangana",
            type: "Internship",
            experience: "Fresher",
            salary: "₹15,000 - ₹25,000 / month",
            posted: "6 days ago",
            skills: ["React", "JavaScript", "HTML", "CSS"],
            eligibility: 68,
            applicants: 29,
            description:
                "An internship opportunity for students interested in frontend development and React."
        }
    ];

    // =========================================================
    // FILTER JOBS
    // =========================================================

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        const searchText = search.toLowerCase().trim();
        const locationText = location.toLowerCase().trim();

        if (searchText) {
            result = result.filter((job) => {
                const searchableText = [
                    job.title,
                    job.company,
                    job.location,
                    ...job.skills
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(searchText);
            });
        }

        if (locationText) {
            result = result.filter((job) =>
                job.location.toLowerCase().includes(locationText)
            );
        }

        if (jobType !== "All") {
            result = result.filter((job) => job.type === jobType);
        }

        if (experience !== "All") {
            result = result.filter(
                (job) => job.experience === experience
            );
        }

        if (sortBy === "Highest Eligibility") {
            result.sort((a, b) => b.eligibility - a.eligibility);
        }

        if (sortBy === "Newest") {
            result.reverse();
        }

        return result;
    }, [search, location, jobType, experience, sortBy]);

    // =========================================================
    // SAVE / UNSAVE JOB
    // =========================================================

    const toggleSaveJob = (jobId) => {
        setSavedJobs((prev) => {
            if (prev.includes(jobId)) {
                return prev.filter((id) => id !== jobId);
            }

            return [...prev, jobId];
        });
    };

    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setJobType("All");
        setExperience("All");
        setSortBy("Recommended");
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="find-jobs-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="find-jobs-sidebar">

                <Link
                    to="/jobseeker-dashboard"
                    className="find-jobs-logo"
                >
                    <span className="find-jobs-logo-symbol">
                        S
                    </span>

                    <span>
                        SmartHire
                    </span>
                </Link>

                <div className="find-jobs-user">

                    <div className="find-jobs-avatar">
                        {localStorage.getItem("email")
                            ? localStorage
                                .getItem("email")
                                .charAt(0)
                                .toUpperCase()
                            : "U"}
                    </div>

                    <div>
                        <h4>
                            Job Seeker
                        </h4>

                        <span>
                            Candidate
                        </span>
                    </div>

                </div>

                <nav className="find-jobs-navigation">

                    <p className="find-jobs-menu-title">
                        MAIN MENU
                    </p>

                    <Link
                        to="/jobseeker-dashboard"
                        className="find-jobs-menu-link"
                    >
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/jobs"
                        className="find-jobs-menu-link active"
                    >
                        <span>⌕</span>
                        Find Jobs
                    </Link>

                    <Link
                        to="/applications"
                        className="find-jobs-menu-link"
                    >
                        <span>▣</span>
                        My Applications
                    </Link>

                    <Link
                        to="/saved-jobs"
                        className="find-jobs-menu-link"
                    >
                        <span>♡</span>
                        Saved Jobs
                    </Link>

                    <p className="find-jobs-menu-title account-title">
                        ACCOUNT
                    </p>

                    <Link
                        to="/profile"
                        className="find-jobs-menu-link"
                    >
                        <span>◉</span>
                        My Profile
                    </Link>

                </nav>

                <button
                    className="find-jobs-logout"
                    onClick={logout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="find-jobs-content">

                {/* TOPBAR */}

                <header className="find-jobs-topbar">

                    <div>
                        <h2>
                            Find Jobs
                        </h2>

                        <p>
                            Discover opportunities that match your skills
                        </p>
                    </div>

                    <div className="find-jobs-topbar-user">

                        <div className="find-jobs-top-avatar">
                            {localStorage.getItem("email")
                                ? localStorage
                                    .getItem("email")
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <strong>
                                Job Seeker
                            </strong>

                            <span>
                                {localStorage.getItem("email") ||
                                    "candidate@example.com"}
                            </span>
                        </div>

                    </div>

                </header>


                {/* MAIN */}

                <main className="find-jobs-main">

                    {/* HERO */}

                    <section className="find-jobs-hero">

                        <div className="find-jobs-hero-content">

                            <span className="find-jobs-eyebrow">
                                OPPORTUNITY AWAITS
                            </span>

                            <h1>
                                Find a job that
                                <br />
                                <span>fits your skills.</span>
                            </h1>

                            <p>
                                Explore jobs matched to your skills,
                                education and experience.
                            </p>

                        </div>

                        <div className="find-jobs-hero-decoration">
                            <div className="hero-circle hero-circle-one"></div>
                            <div className="hero-circle hero-circle-two"></div>
                            <div className="hero-search-icon">
                                ⌕
                            </div>
                        </div>

                    </section>


                    {/* SEARCH AREA */}

                    <section className="find-jobs-search-card">

                        <div className="search-input-wrapper">

                            <span className="search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search by job title, company or skill..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <div className="location-input-wrapper">

                            <span className="location-icon">
                                ◎
                            </span>

                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) =>
                                    setLocation(e.target.value)
                                }
                            />

                        </div>

                        <button
                            className="search-jobs-button"
                            onClick={() => {}}
                        >
                            Search Jobs
                        </button>

                    </section>


                    {/* BODY */}

                    <div className="find-jobs-body">

                        {/* FILTERS */}

                        <aside className="jobs-filter-panel">

                            <div className="filter-header">

                                <div>
                                    <h3>
                                        Filters
                                    </h3>

                                    <p>
                                        Refine your search
                                    </p>
                                </div>

                                <button
                                    onClick={clearFilters}
                                >
                                    Clear
                                </button>

                            </div>


                            {/* JOB TYPE */}

                            <div className="filter-group">

                                <label>
                                    Job Type
                                </label>

                                <div className="filter-options">

                                    {[
                                        "All",
                                        "Full Time",
                                        "Internship"
                                    ].map((type) => (
                                        <label
                                            className="filter-radio"
                                            key={type}
                                        >

                                            <input
                                                type="radio"
                                                name="jobType"
                                                value={type}
                                                checked={
                                                    jobType === type
                                                }
                                                onChange={(e) =>
                                                    setJobType(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span>
                                                {type}
                                            </span>

                                        </label>
                                    ))}

                                </div>

                            </div>


                            {/* EXPERIENCE */}

                            <div className="filter-group">

                                <label>
                                    Experience
                                </label>

                                <select
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="All">
                                        All Experience
                                    </option>

                                    <option value="Fresher">
                                        Fresher
                                    </option>

                                    <option value="0-2 Years">
                                        0 - 2 Years
                                    </option>

                                    <option value="1-3 Years">
                                        1 - 3 Years
                                    </option>

                                </select>

                            </div>


                            {/* ELIGIBILITY */}

                            <div className="filter-info-card">

                                <div className="filter-info-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Smart Matching
                                    </strong>

                                    <p>
                                        Jobs are ranked based on
                                        your profile eligibility.
                                    </p>
                                </div>

                            </div>

                        </aside>


                        {/* JOB RESULTS */}

                        <section className="jobs-results">

                            <div className="jobs-results-header">

                                <div>
                                    <h2>
                                        Recommended Jobs
                                    </h2>

                                    <p>
                                        {filteredJobs.length}{" "}
                                        opportunities found
                                    </p>
                                </div>

                                <div className="sort-wrapper">

                                    <label>
                                        Sort by
                                    </label>

                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Recommended">
                                            Recommended
                                        </option>

                                        <option value="Highest Eligibility">
                                            Highest Eligibility
                                        </option>

                                        <option value="Newest">
                                            Newest
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* JOB CARDS */}

                            <div className="job-cards">

                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (

                                        <article
                                            className="job-card"
                                            key={job.id}
                                        >

                                            <div className="job-card-top">

                                                <div className="company-logo">
                                                    {job.company
                                                        .charAt(0)}
                                                </div>

                                                <button
                                                    className={`save-job-button ${
                                                        savedJobs.includes(
                                                            job.id
                                                        )
                                                            ? "saved"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        toggleSaveJob(
                                                            job.id
                                                        )
                                                    }
                                                    aria-label="Save job"
                                                >
                                                    {savedJobs.includes(
                                                        job.id
                                                    )
                                                        ? "♥"
                                                        : "♡"}
                                                </button>

                                            </div>


                                            <div className="job-card-content">

                                                <span className="job-posted">
                                                    {job.posted}
                                                </span>

                                                <h3>
                                                    {job.title}
                                                </h3>

                                                <p className="job-company">
                                                    {job.company}
                                                </p>


                                                <div className="job-meta">

                                                    <span>
                                                        ◎{" "}
                                                        {job.location}
                                                    </span>

                                                    <span>
                                                        ◷{" "}
                                                        {job.type}
                                                    </span>

                                                </div>


                                                <div className="job-tags">

                                                    {job.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={
                                                                    skill
                                                                }
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}

                                                </div>


                                                {/* ELIGIBILITY */}

                                                <div className="eligibility-section">

                                                    <div className="eligibility-header">

                                                        <span>
                                                            Your Eligibility
                                                        </span>

                                                        <strong>
                                                            {
                                                                job.eligibility
                                                            }
                                                            %
                                                        </strong>

                                                    </div>

                                                    <div className="eligibility-bar">

                                                        <div
                                                            className="eligibility-progress"
                                                            style={{
                                                                width: `${job.eligibility}%`
                                                            }}
                                                        ></div>

                                                    </div>

                                                </div>


                                                <div className="job-card-bottom">

                                                    <div>
                                                        <strong>
                                                            {job.salary}
                                                        </strong>

                                                        <span>
                                                            {job.applicants}{" "}
                                                            applicants
                                                        </span>
                                                    </div>

                                                    <button
                                                        className="view-job-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/job/${job.id}`
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                        <span>
                                                            →
                                                        </span>
                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    ))
                                ) : (

                                    <div className="no-jobs">

                                        <div className="no-jobs-icon">
                                            ⌕
                                        </div>

                                        <h3>
                                            No jobs found
                                        </h3>

                                        <p>
                                            Try changing your search
                                            or clearing the filters.
                                        </p>

                                        <button
                                            onClick={clearFilters}
                                        >
                                            Clear Filters
                                        </button>

                                    </div>

                                )}

                            </div>

                        </section>

                    </div>

                </main>


                {/* FOOTER */}

                <footer className="find-jobs-footer">

                    <span>
                        © 2026 SmartHire. All rights reserved.
                    </span>

                    <span>
                        Skill-Based Job Matching Platform
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default FindJobs;