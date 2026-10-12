import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jobApi, jobSeekerApi, authApi } from "../services/api";
import { 
    MapPin, 
    Briefcase, 
    Clock, 
    Coins, 
    BarChart3, 
    Bookmark, 
    BookmarkCheck, 
    ArrowLeft, 
    ArrowRight 
} from "lucide-react";
import SmartHireLogo from "../Components/SmartHireLogo";
import "../CSS/JobDetails.css";
import "../CSS/theme.css";

const fallbackJob = {
    id: 1,
    title: "Software Developer",
    company: "TechNova Solutions",
    location: "Hyderabad, Telangana",
    type: "Full Time",
    workMode: "Hybrid",
    experience: "0-2 Years",
    salary: "₹5 - ₹8 LPA",
    posted: "Recently",
    eligibility: 85,
    description: "We are looking for a motivated Software Developer to join our engineering team. You will work on scalable applications, REST APIs, database integration and modern web technologies.",
    skills: ["Java", "Spring Boot", "MySQL", "React"],
    education: "B.Tech / B.E. in Computer Science or related field",
    responsibilities: [
        "Develop and maintain web applications",
        "Build REST APIs using Spring Boot",
        "Work with MySQL databases",
        "Collaborate with frontend and backend teams",
        "Write clean and maintainable code"
    ],
    requirements: [
        "Strong foundation in Java and Object Oriented Programming",
        "Experience with Spring Boot and relational databases",
        "Knowledge of React or modern frontend frameworks",
        "Familiarity with Git and version control"
    ]
};

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(fallbackJob);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        loadJobDetails();
        checkIfSaved();
    }, [id]);

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            const res = await jobApi.getJobById(id);
            if (res.data) {
                const j = res.data;
                setJob({
                    id: j.id,
                    title: j.title,
                    company: j.companyName,
                    location: j.location,
                    type: j.type,
                    workMode: j.workMode || "Hybrid",
                    experience: j.experience,
                    salary: j.salary || "Competitive",
                    posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Active",
                    eligibility: j.eligibilityScore || 80,
                    description: j.description,
                    skills: typeof j.skills === "string" ? j.skills.split(",").map((s) => s.trim()) : (j.skills || []),
                    education: j.education || "Any Graduate",
                    responsibilities: j.responsibilities ? j.responsibilities.split("\n").filter((r) => r.trim()) : fallbackJob.responsibilities,
                    requirements: j.requirements ? j.requirements.split("\n").filter((r) => r.trim()) : fallbackJob.requirements
                });
            }
        } catch (err) {
            console.warn("Could not load job by id from API, using fallback:", err);
            setJob({ ...fallbackJob, id: id || 1 });
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = async () => {
        const user = authApi.getCurrentUser();
        if (!user.token) return;
        try {
            const res = await jobSeekerApi.getSavedJobs();
            if (res.data) {
                const exists = res.data.some((s) => String(s.jobId) === String(id));
                setIsSaved(exists);
            }
        } catch (err) {
            console.warn("Could not check saved job status:", err);
        }
    };

    const toggleSave = async () => {
        const user = authApi.getCurrentUser();
        if (!user.token) {
            navigate("/login");
            return;
        }

        try {
            if (isSaved) {
                await jobSeekerApi.unsaveJob(id);
                setIsSaved(false);
            } else {
                await jobSeekerApi.saveJob(id);
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Toggle save error:", err);
            setIsSaved(!isSaved);
        }
    };

    return (
        <div className="job-details-page">
            {/* Header */}
            <header className="job-details-header">
                <Link to="/jobs" style={{ textDecoration: "none" }}>
                    <SmartHireLogo size="sm" />
                </Link>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button className="back-to-jobs-btn" onClick={() => navigate("/jobs")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <ArrowLeft size={14} />
                        <span>Back to Search</span>
                    </button>
                    <button
                        className="back-to-jobs-btn"
                        onClick={toggleSave}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: isSaved ? "var(--primary-emerald)" : "inherit" }}
                    >
                        {isSaved ? <BookmarkCheck size={14} color="var(--primary-emerald)" /> : <Bookmark size={14} />}
                        <span>{isSaved ? "Saved" : "Save Job"}</span>
                    </button>
                </div>
            </header>

            <main className="job-details-container">
                {/* Job Hero Banner */}
                <div className="job-hero-card">
                    <div className="hero-top">
                        <div className="hero-company-avatar">
                            {job.company.charAt(0)}
                        </div>
                        <div className="hero-info">
                            <span className="hero-company-name">{job.company}</span>
                            <h1 className="hero-job-title">{job.title}</h1>
                            <div className="hero-badges">
                                <span><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.location}</span>
                                <span><Briefcase size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.type} ({job.workMode})</span>
                                <span><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.experience}</span>
                                <span><Coins size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.salary}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="sh-btn sh-btn-secondary"
                            onClick={() => navigate(`/job/${id}/eligibility`)}
                            style={{ gap: "6px" }}
                        >
                            <BarChart3 size={15} />
                            <span>Match Score: {job.eligibility}%</span>
                        </button>
                        <button
                            className="sh-btn sh-btn-primary sh-btn-lg"
                            onClick={() => navigate(`/job/${id}/apply`)}
                            style={{ gap: "6px" }}
                        >
                            <span>Apply for Position</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="job-details-grid">
                    <div className="details-main-content">
                        {/* Description */}
                        <div className="details-section-card">
                            <h2>Role Overview</h2>
                            <p>{job.description}</p>
                        </div>

                        {/* Responsibilities */}
                        <div className="details-section-card">
                            <h2>Key Responsibilities</h2>
                            <ul>
                                {job.responsibilities.map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Requirements */}
                        <div className="details-section-card">
                            <h2>Candidate Requirements</h2>
                            <ul>
                                {job.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Information Card */}
                    <aside className="details-sidebar">
                        <div className="sidebar-info-card">
                            <h3>Key Requirements</h3>
                            <div className="info-item">
                                <span>Education Required</span>
                                <strong>{job.education}</strong>
                            </div>
                            <div className="info-item">
                                <span>Experience</span>
                                <strong>{job.experience}</strong>
                            </div>
                            <div className="info-item">
                                <span>Compensation</span>
                                <strong>{job.salary}</strong>
                            </div>
                            <div className="info-item">
                                <span>Work Location</span>
                                <strong>{job.location}</strong>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                                    TARGET SKILLS
                                </span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {job.skills.map((skill, idx) => (
                                        <span key={idx} className="sh-badge sh-badge-muted">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="sh-btn sh-btn-primary"
                                style={{ width: "100%", marginTop: "24px" }}
                                onClick={() => navigate(`/job/${id}/apply`)}
                            >
                                Apply Now
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default JobDetails;