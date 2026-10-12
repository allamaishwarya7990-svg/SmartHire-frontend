import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobApi, jobSeekerApi, authApi } from "../services/api";
import JobSeekerSidebar from "../Components/JobSeekerSidebar";
import { Search, MapPin, Briefcase, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import "../CSS/FindJobs.css";
import "../CSS/theme.css";

const initialSampleJobs = [
    {
        id: 1,
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        type: "Full Time",
        experience: "0-2 Years",
        salary: "₹5 - ₹8 LPA",
        posted: "Recently",
        skills: ["Java", "Spring Boot", "MySQL", "React"],
        eligibility: 85,
        applicants: 42,
        description: "Looking for a motivated software developer to build scalable web applications using Java and modern technologies."
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "PixelCraft Technologies",
        location: "Remote",
        type: "Full Time",
        experience: "1-3 Years",
        salary: "₹6 - 9 LPA",
        posted: "Recently",
        skills: ["React", "JavaScript", "HTML", "CSS"],
        eligibility: 80,
        applicants: 31,
        description: "Join our frontend team to develop responsive and interactive web applications using React."
    }
];

function FindJobs() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("All");
    const [experience, setExperience] = useState("All");
    const [sortBy, setSortBy] = useState("Recommended");

    const [dbJobs, setDbJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadJobs();
        loadSavedJobIds();
    }, [search, location, jobType, experience]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.keyword = search;
            if (location) params.location = location;
            if (jobType && jobType !== "All") params.jobType = jobType;
            if (experience && experience !== "All") params.experience = experience;

            const res = await jobApi.searchJobs(params);
            if (res.data && res.data.length > 0) {
                // Map API response to match UI properties
                const mapped = res.data.map((j) => ({
                    id: j.id,
                    title: j.title,
                    company: j.companyName,
                    location: j.location,
                    type: j.type,
                    experience: j.experience,
                    salary: j.salary || "Competitive",
                    posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Active",
                    skills: typeof j.skills === "string" ? j.skills.split(",").map((s) => s.trim()) : (j.skills || []),
                    eligibility: j.eligibilityScore || 80,
                    applicants: j.applicantsCount || 0,
                    description: j.description
                }));
                setDbJobs(mapped);
            } else {
                setDbJobs(initialSampleJobs);
            }
        } catch (err) {
            console.warn("Could not fetch jobs from API, using fallback:", err);
            setDbJobs(initialSampleJobs);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedJobIds = async () => {
        const user = authApi.getCurrentUser();
        if (!user.token) return;
        try {
            const res = await jobSeekerApi.getSavedJobs();
            if (res.data) {
                const ids = res.data.map((s) => s.jobId);
                setSavedJobIds(ids);
            }
        } catch (err) {
            console.warn("Could not fetch saved jobs:", err);
        }
    };

    const toggleSaveJob = async (jobId) => {
        const user = authApi.getCurrentUser();
        if (!user.token) {
            navigate("/login");
            return;
        }

        const isSaved = savedJobIds.includes(jobId);
        try {
            if (isSaved) {
                await jobSeekerApi.unsaveJob(jobId);
                setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
            } else {
                await jobSeekerApi.saveJob(jobId);
                setSavedJobIds((prev) => [...prev, jobId]);
            }
        } catch (err) {
            console.error("Save/unsave toggle error:", err);
            // Optimistic toggle fallback
            setSavedJobIds((prev) => isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setJobType("All");
        setExperience("All");
        setSortBy("Recommended");
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    const email = localStorage.getItem("email") || "Candidate";

    // Sorted jobs
    const displayJobs = useMemo(() => {
        let result = [...dbJobs];
        if (sortBy === "Salary") {
            result.sort((a, b) => b.salary.localeCompare(a.salary));
        } else if (sortBy === "Applicants") {
            result.sort((a, b) => b.applicants - a.applicants);
        }
        return result;
    }, [dbJobs, sortBy]);

    return (
        <div className="find-jobs-page">
            <JobSeekerSidebar />

            {/* Main Content Area */}
            <main className="find-jobs-main">
                <header className="find-jobs-header">
                    <div>
                        <span className="find-jobs-badge">OPPORTUNITIES</span>
                        <h1>Discover Your Next Career Step</h1>
                        <p>Search through verified companies with live skill-match intelligence.</p>
                    </div>
                </header>

                {/* Filter Controls */}
                <section className="find-jobs-filter-panel">
                    <div className="find-jobs-search-row">
                        <div className="search-field main-search">
                            <span className="field-icon"><Search size={18} /></span>
                            <input
                                type="text"
                                placeholder="Job title, keywords, or required skills..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="search-field">
                            <span className="field-icon"><MapPin size={18} /></span>
                            <input
                                type="text"
                                placeholder="Location or Remote..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <button className="find-jobs-submit-btn" onClick={loadJobs}>
                            Search Jobs
                        </button>
                    </div>

                    <div className="filter-options-row">
                        <div className="select-wrapper">
                            <label>Job Type</label>
                            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                                <option value="All">All Types</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <label>Experience</label>
                            <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                                <option value="All">All Experience</option>
                                <option value="0-2 Years">0-2 Years</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <label>Sort By</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="Recommended">Recommended</option>
                                <option value="Salary">Highest Salary</option>
                                <option value="Applicants">Most Popular</option>
                            </select>
                        </div>

                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </section>

                {/* Listings Grid */}
                <section className="find-jobs-results-container">
                    <div className="results-header">
                        <h2>Available Positions ({displayJobs.length})</h2>
                        {loading && <span style={{ color: "var(--primary-emerald)", fontSize: "13px" }}>Loading live openings...</span>}
                    </div>

                    {displayJobs.length === 0 ? (
                        <div className="sh-empty-state">
                            <div className="sh-empty-icon"><Briefcase size={36} /></div>
                            <h3 className="sh-empty-title">No matching positions found</h3>
                            <p className="sh-empty-desc">Try clearing some filter criteria or adjusting keywords.</p>
                            <button onClick={clearFilters} className="sh-btn sh-btn-primary">
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {displayJobs.map((job) => {
                                const isSaved = savedJobIds.includes(job.id);
                                return (
                                    <div key={job.id} className="job-card">
                                        <div className="job-card-top">
                                            <div className="company-logo-badge">
                                                {job.company.charAt(0)}
                                            </div>
                                            <button
                                                className={`save-button ${isSaved ? "saved" : ""}`}
                                                onClick={() => toggleSaveJob(job.id)}
                                                title={isSaved ? "Remove from saved" : "Save job"}
                                            >
                                                {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                            </button>
                                        </div>

                                        <div className="job-card-content">
                                            <span className="job-company">{job.company}</span>
                                            <h3 className="job-title">{job.title}</h3>

                                            <div className="job-badges">
                                                <span className="job-badge">{job.location}</span>
                                                <span className="job-badge">{job.type}</span>
                                                <span className="job-badge">{job.experience}</span>
                                            </div>

                                            <p className="job-snippet">{job.description}</p>

                                            <div className="job-skills-row">
                                                {job.skills.map((skill, idx) => (
                                                    <span key={idx} className="skill-chip">{skill}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="job-card-footer">
                                            <div>
                                                <span className="salary-label">ESTIMATED SALARY</span>
                                                <strong className="salary-value">{job.salary}</strong>
                                            </div>

                                            <div className="job-actions">
                                                <button
                                                    className="eligibility-btn"
                                                    onClick={() => navigate(`/job/${job.id}/eligibility`)}
                                                >
                                                    {job.eligibility}% Match
                                                </button>
                                                <button
                                                    className="apply-btn"
                                                    onClick={() => navigate(`/job/${job.id}`)}
                                                >
                                                    View Details <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default FindJobs;