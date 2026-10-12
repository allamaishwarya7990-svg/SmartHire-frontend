import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
    CheckCircle2, 
    AlertCircle, 
    GraduationCap, 
    ArrowLeft, 
    ArrowRight,
    Sparkles,
    Check
} from "lucide-react";
import { jobApi, jobSeekerApi } from "../services/api";
import SmartHireLogo from "../Components/SmartHireLogo";
import "../CSS/EligibilityAnalysis.css";
import "../CSS/theme.css";

const fallbackJob = {
    id: 1,
    title: "Software Developer",
    company: "TechNova Solutions",
    location: "Hyderabad, Telangana",
    requiredSkills: ["Java", "Spring Boot", "MySQL", "React", "REST API"],
    candidateSkills: ["Java", "Spring Boot", "MySQL", "React"],
    education: "B.Tech / B.E in Computer Science",
    experience: "0-2 Years"
};

function EligibilityAnalysis() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(fallbackJob);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            let reqSkills = fallbackJob.requiredSkills;
            let candSkills = fallbackJob.candidateSkills;
            let jobData = fallbackJob;

            try {
                const jobRes = await jobApi.getJobById(id);
                if (jobRes.data) {
                    const j = jobRes.data;
                    reqSkills = typeof j.skills === "string" ? j.skills.split(",").map((s) => s.trim()) : j.skills;
                    jobData = {
                        id: j.id,
                        title: j.title,
                        company: j.companyName,
                        location: j.location,
                        education: j.education || "Graduate",
                        experience: j.experience || "0-2 Years",
                        requiredSkills: reqSkills,
                        candidateSkills: candSkills
                    };
                }
            } catch (e) {
                console.warn("Could not load job for eligibility:", e);
            }

            try {
                const profRes = await jobSeekerApi.getProfile();
                if (profRes.data && profRes.data.skills) {
                    candSkills = profRes.data.skills.split(",").map((s) => s.trim());
                    jobData.candidateSkills = candSkills;
                }
            } catch (e) {
                console.warn("Could not load candidate profile skills:", e);
            }

            setJob(jobData);
        } finally {
            setLoading(false);
        }
    };

    const normalize = (s) => (s || "").toLowerCase().trim();

    const matchedSkills = job.requiredSkills.filter((req) =>
        job.candidateSkills.some((cand) => normalize(cand) === normalize(req) || normalize(cand).includes(normalize(req)) || normalize(req).includes(normalize(cand)))
    );

    const missingSkills = job.requiredSkills.filter((req) =>
        !job.candidateSkills.some((cand) => normalize(cand) === normalize(req) || normalize(cand).includes(normalize(req)) || normalize(req).includes(normalize(cand)))
    );

    const eligibility = job.requiredSkills.length > 0
        ? Math.min(100, Math.max(40, Math.round((matchedSkills.length / job.requiredSkills.length) * 60 + 40)))
        : 85;

    return (
        <div className="eligibility-page">
            {/* Top Bar */}
            <header className="eligibility-topbar">
                <Link to="/jobseeker-dashboard" style={{ textDecoration: "none" }}>
                    <SmartHireLogo size="sm" />
                </Link>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate(`/job/${id}`)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                    <ArrowLeft size={14} />
                    <span>Back to Job Details</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="eligibility-container">
                <section className="eligibility-heading">
                    <span className="eligibility-label">AI QUALIFICATION AUDIT</span>
                    <h1>Eligibility & Match Analysis</h1>
                    <p>Comparison between your profile qualifications and job criteria for <strong>{job.title}</strong> at <strong>{job.company}</strong>.</p>
                </section>

                <div className="eligibility-grid">
                    {/* Score Card */}
                    <div className="eligibility-score-card">
                        <span className="score-label">MATCH SCORE</span>
                        <div className="score-circle">
                            <span className="score-number">{eligibility}%</span>
                        </div>
                        <h3>{eligibility >= 70 ? "Strong Candidate Match" : "Moderate Candidate Alignment"}</h3>
                        <p>
                            {eligibility >= 70
                                ? "You meet the core prerequisites and have high alignment with required skills."
                                : "You possess essential transferable skills, though additional technical criteria may apply."}
                        </p>

                        <button
                            className="sh-btn sh-btn-primary sh-btn-lg"
                            style={{ width: "100%", marginTop: "16px", gap: "6px" }}
                            onClick={() => navigate(`/job/${id}/apply`)}
                        >
                            <span>Proceed to Apply</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>

                    {/* Breakdown */}
                    <div className="eligibility-details-col">
                        {/* Matched Skills */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <span className="header-icon green">
                                    <CheckCircle2 size={18} />
                                </span>
                                <div>
                                    <h3>Verified Matched Skills ({matchedSkills.length})</h3>
                                    <p>Skills present on your candidate profile that directly fulfill job requirements.</p>
                                </div>
                            </div>
                            <div className="skills-badge-list">
                                {matchedSkills.length === 0 ? (
                                    <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>No direct keyword matches found.</span>
                                ) : (
                                    matchedSkills.map((s, idx) => (
                                        <span key={idx} className="skill-badge matched">
                                            <Check size={12} style={{ display: "inline-block", marginRight: "4px" }} />
                                            {s}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recommended Learning / Missing Skills */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <span className="header-icon orange">
                                    <AlertCircle size={18} />
                                </span>
                                <div>
                                    <h3>Growth Areas & Additional Criteria ({missingSkills.length})</h3>
                                    <p>Skills mentioned in employer posting that could increase your interview selection rate.</p>
                                </div>
                            </div>
                            <div className="skills-badge-list">
                                {missingSkills.length === 0 ? (
                                    <span style={{ color: "var(--primary-emerald)", fontSize: "13px" }}>You match all listed skills!</span>
                                ) : (
                                    missingSkills.map((s, idx) => (
                                        <span key={idx} className="skill-badge missing">
                                            + {s}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Education and Experience */}
                        <div className="analysis-card">
                            <div className="analysis-card-header">
                                <span className="header-icon blue">
                                    <GraduationCap size={18} />
                                </span>
                                <div>
                                    <h3>Experience & Academic Prerequisites</h3>
                                    <p>Standard qualification expectations for this hiring tier.</p>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                                <div style={{ background: "var(--bg-elevated)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Target Education</span>
                                    <div style={{ fontWeight: "600", marginTop: "4px", color: "var(--text-primary)" }}>{job.education}</div>
                                </div>
                                <div style={{ background: "var(--bg-elevated)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Experience Band</span>
                                    <div style={{ fontWeight: "600", marginTop: "4px", color: "var(--text-primary)" }}>{job.experience}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EligibilityAnalysis;