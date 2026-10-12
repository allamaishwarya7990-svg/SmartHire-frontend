import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobApi, jobSeekerApi, authApi } from "../services/api";
import JobSeekerSidebar from "../Components/JobSeekerSidebar";
import { Bell, ArrowRight, UserCheck, Bookmark, FileText, Sparkles, MapPin, Briefcase } from "lucide-react";
import "../CSS/JobSeekerDashboard.css";
import "../CSS/theme.css";

function JobSeekerDashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email") || "Job Seeker";

    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: "Software Developer",
            company: "TechNova Solutions",
            location: "Hyderabad, Telangana",
            type: "Full Time",
            skills: ["Java", "React", "SQL"],
            eligibility: 85
        },
        {
            id: 2,
            title: "Frontend Developer",
            company: "PixelCraft Technologies",
            location: "Remote",
            type: "Full Time",
            skills: ["React", "JavaScript", "CSS"],
            eligibility: 80
        }
    ]);
    const [appCount, setAppCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const jobsRes = await jobApi.searchJobs();
            if (jobsRes.data && jobsRes.data.length > 0) {
                const mapped = jobsRes.data.slice(0, 5).map((j) => ({
                    id: j.id,
                    title: j.title,
                    company: j.companyName,
                    location: j.location,
                    type: j.type,
                    skills: typeof j.skills === "string" ? j.skills.split(",").map((s) => s.trim()) : (j.skills || []),
                    eligibility: j.eligibilityScore || 80
                }));
                setJobs(mapped);
            }
        } catch (e) {
            console.warn("Could not load jobs for dashboard:", e);
        }

        try {
            const appsRes = await jobSeekerApi.getApplications();
            if (appsRes.data) {
                setAppCount(appsRes.data.length);
            }
        } catch (e) {
            console.warn("Could not load applications count:", e);
        }

        try {
            const savedRes = await jobSeekerApi.getSavedJobs();
            if (savedRes.data) {
                setSavedCount(savedRes.data.length);
            }
        } catch (e) {
            console.warn("Could not load saved jobs count:", e);
        }
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };


    return (

        <div className="jobseeker-page">


            <JobSeekerSidebar />



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

                        <button className="notification-button" title="Notifications">
                            <Bell size={18} />
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
                            <ArrowRight size={16} />
                        </Link>

                    </section>



                    {/* ================= STATS ================= */}

                    <section className="stats-section">


                        <div className="stat-card">

                            <div className="stat-icon">
                                <UserCheck size={20} />
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
                                <Bookmark size={20} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Saved Jobs
                                </span>

                                <strong>
                                    {savedCount}
                                </strong>

                                <small>
                                    Saved opportunities
                                </small>

                            </div>

                        </div>



                        <div className="stat-card">

                            <div className="stat-icon">
                                <FileText size={20} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Applications
                                </span>

                                <strong>
                                    {appCount}
                                </strong>

                                <small>
                                    Applications sent
                                </small>

                            </div>

                        </div>



                        <div className="stat-card">

                            <div className="stat-icon">
                                <Sparkles size={20} />
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
                                    View All <ArrowRight size={14} />
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
                                                <MapPin size={13} /> {job.location}
                                            </span>

                                            <span>
                                                <Briefcase size={13} /> {job.type}
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


                                            <button 
                                                className="view-job-button"
                                                onClick={() => navigate(`/job/${job.id}`)}
                                            >
                                                View Job
                                                <ArrowRight size={14} />
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
                                    <Sparkles size={24} />
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