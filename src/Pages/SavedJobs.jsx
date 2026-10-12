import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    MapPin, 
    Briefcase, 
    Clock, 
    Coins, 
    Bookmark, 
    Trash2, 
    ArrowRight,
    Search
} from "lucide-react";
import { jobSeekerApi } from "../services/api";
import JobSeekerSidebar from "../Components/JobSeekerSidebar";
import "../CSS/SavedJobs.css";
import "../CSS/theme.css";

const fallbackSavedJobs = [
    {
        id: "1",
        jobId: "1",
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        type: "Full Time",
        experience: "0-2 Years",
        salary: "INR 5 - 8 LPA",
        skills: ["Java", "Spring Boot", "MySQL"],
        eligibility: "85%"
    }
];

function SavedJobs() {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadSavedJobs();
    }, []);

    const loadSavedJobs = async () => {
        try {
            setLoading(true);
            const res = await jobSeekerApi.getSavedJobs();
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((s) => ({
                    id: String(s.id),
                    jobId: String(s.jobId),
                    title: s.jobTitle,
                    company: s.companyName,
                    location: s.jobLocation || "Hyderabad, Telangana",
                    type: s.jobType || "Full Time",
                    experience: s.jobExperience || "0-2 Years",
                    salary: s.jobSalary || "Competitive",
                    skills: typeof s.jobSkills === "string" ? s.jobSkills.split(",").map((sk) => sk.trim()) : ["Java", "React"],
                    eligibility: "85%"
                }));
                setSavedJobs(mapped);
            } else {
                setSavedJobs(fallbackSavedJobs);
            }
        } catch (err) {
            console.warn("Could not load saved jobs from API, using fallback:", err);
            setSavedJobs(fallbackSavedJobs);
        } finally {
            setLoading(false);
        }
    };

    const removeSavedJob = async (jobId) => {
        try {
            await jobSeekerApi.unsaveJob(jobId);
            setSavedJobs((prev) => prev.filter((j) => String(j.jobId) !== String(jobId)));
            setMessage("Position removed from saved bookmarks.");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Failed to remove saved job:", err);
            setSavedJobs((prev) => prev.filter((j) => String(j.jobId) !== String(jobId)));
        }
    };

    return (
        <div className="saved-jobs-page">
            <JobSeekerSidebar />

            <main className="saved-jobs-main">
                <header className="saved-jobs-topbar">
                    <div>
                        <h2>Saved Opportunities</h2>
                        <p>Bookmark jobs to review, analyze eligibility, and apply at your convenience.</p>
                    </div>
                    <button className="sh-btn sh-btn-primary sh-btn-sm" onClick={() => navigate("/jobs")} style={{ gap: "6px" }}>
                        <Search size={14} />
                        <span>Find More Jobs</span>
                    </button>
                </header>

                <div className="saved-jobs-container">
                    {message && (
                        <div className="sh-alert sh-alert-info" style={{ marginBottom: "20px" }}>
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="saved-summary-card">
                        <div className="saved-summary-icon">
                            <Bookmark size={20} />
                        </div>
                        <div>
                            <span>Total Bookmarked Jobs</span>
                            <strong>{savedJobs.length} Positions</strong>
                        </div>
                    </div>

                    <section className="saved-jobs-section">
                        <div className="saved-section-header">
                            <h2>Saved Position List</h2>
                            <span className="saved-count-pill">{savedJobs.length} Saved</span>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                                Loading bookmarked jobs...
                            </div>
                        ) : savedJobs.length === 0 ? (
                            <div className="sh-empty-state">
                                <div className="sh-empty-icon">
                                    <Bookmark size={32} />
                                </div>
                                <h3 className="sh-empty-title">No saved jobs yet</h3>
                                <p className="sh-empty-desc">Browse jobs and click the bookmark icon to save listings for later.</p>
                                <button className="sh-btn sh-btn-primary" onClick={() => navigate("/jobs")}>
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="saved-cards-list">
                                {savedJobs.map((job) => (
                                    <div className="saved-job-card" key={job.id}>
                                        <div className="saved-card-logo">
                                            {job.company.charAt(0)}
                                        </div>

                                        <div className="saved-card-content">
                                            <div className="saved-title-row">
                                                <div>
                                                    <h3>{job.title}</h3>
                                                    <p>{job.company}</p>
                                                </div>
                                                <span className="saved-badge">Saved</span>
                                            </div>

                                            <div className="saved-meta-row">
                                                <span><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.location}</span>
                                                <span><Briefcase size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.type}</span>
                                                <span><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.experience}</span>
                                                <span><Coins size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{job.salary}</span>
                                            </div>

                                            <div className="saved-skills-row">
                                                {job.skills.map((skill, idx) => (
                                                    <span key={idx} className="saved-skill-chip">{skill}</span>
                                                ))}
                                            </div>

                                            <div className="saved-card-footer">
                                                <div className="saved-match-box">
                                                    <span>Skill Alignment</span>
                                                    <strong>{job.eligibility} Match</strong>
                                                </div>

                                                <div className="saved-actions">
                                                    <button
                                                        className="remove-saved-btn"
                                                        onClick={() => removeSavedJob(job.jobId)}
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Remove</span>
                                                    </button>
                                                    <button
                                                        className="apply-saved-btn"
                                                        onClick={() => navigate(`/job/${job.jobId}`)}
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                                    >
                                                        <span>View & Apply</span>
                                                        <ArrowRight size={13} />
                                                    </button>
                                                </div>
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

export default SavedJobs;