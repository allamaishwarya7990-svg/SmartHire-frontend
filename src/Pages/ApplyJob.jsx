import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jobApi, jobSeekerApi, authApi } from "../services/api";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, ArrowRight, UploadCloud, FileText, X } from "lucide-react";
import SmartHireLogo from "../Components/SmartHireLogo";
import "../CSS/ApplyJob.css";
import "../CSS/theme.css";

function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coverMessage, setCoverMessage] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [job, setJob] = useState({
        id: id,
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        experience: "0-2 Years",
        salary: "₹5 - ₹8 LPA",
        type: "Full Time"
    });

    const [candidate, setCandidate] = useState({
        name: "Aishwarya Allam",
        email: localStorage.getItem("email") || "aishwarya@example.com",
        phone: "+91 9876543210",
        education: "B.Tech - Computer Science",
        skills: ["Java", "Spring Boot", "MySQL", "React"]
    });

    useEffect(() => {
        loadJobAndProfile();
    }, [id]);

    const loadJobAndProfile = async () => {
        try {
            if (id) {
                const jobRes = await jobApi.getJobById(id);
                if (jobRes.data) {
                    setJob({
                        id: jobRes.data.id,
                        title: jobRes.data.title,
                        company: jobRes.data.companyName,
                        location: jobRes.data.location,
                        experience: jobRes.data.experience,
                        salary: jobRes.data.salary || "Competitive",
                        type: jobRes.data.type
                    });
                }
            }
        } catch (err) {
            console.warn("Could not load job details:", err);
        }

        try {
            const profileRes = await jobSeekerApi.getProfile();
            if (profileRes.data) {
                setCandidate({
                    name: profileRes.data.fullName || "Candidate",
                    email: profileRes.data.email || (localStorage.getItem("email") || ""),
                    phone: profileRes.data.phone || "+91 9876543210",
                    education: profileRes.data.degree || profileRes.data.qualification || "Graduate",
                    skills: profileRes.data.skills ? profileRes.data.skills.split(",").map((s) => s.trim()) : ["Java", "SQL"]
                });
            }
        } catch (err) {
            console.warn("Could not load profile:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSubmitting(true);

        try {
            const payload = {
                jobId: Number(id),
                coverMessage: coverMessage || "I am enthusiastic about this opportunity and look forward to contributing.",
                resumePath: resumeFile ? resumeFile.name : "Resume_Attached.pdf"
            };

            const res = await jobSeekerApi.applyForJob(payload);
            if (res.data) {
                setSubmittedData(res.data);
            }
        } catch (err) {
            console.error("Application submission failed:", err);
            const msg = err.response?.data?.message || err.response?.data || "You may have already submitted an application for this position or session expired.";
            setErrorMessage(typeof msg === "string" ? msg : "Failed to submit application.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submittedData) {
        return (
            <div className="application-success-page">
                <div className="success-card">
                    <div className="success-icon" style={{ background: "var(--soft-emerald)", color: "var(--primary-emerald)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 size={36} />
                    </div>
                    <h1>Application Submitted Successfully!</h1>
                    <p>
                        Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been transmitted to the recruiter.
                    </p>

                    <div className="application-number">
                        <span>Application Reference ID</span>
                        <strong>#APP-{submittedData.id || id}</strong>
                    </div>

                    <div className="success-actions">
                        <button
                            className="view-applications-btn"
                            onClick={() => navigate(`/applications/${submittedData.id || id}`)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                            <span>View Application Details</span>
                            <ArrowRight size={14} />
                        </button>
                        <button
                            className="back-jobs-btn"
                            onClick={() => navigate("/jobs")}
                        >
                            Explore More Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="apply-job-page">
            <header className="apply-job-header">
                <Link to="/jobseeker-dashboard" style={{ textDecoration: "none" }}>
                    <SmartHireLogo size="sm" />
                </Link>
                <button 
                    className="apply-back-btn" 
                    onClick={() => navigate(`/job/${id}`)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                    <ArrowLeft size={14} />
                    <span>Back to Job Details</span>
                </button>
            </header>

            <main className="apply-job-container">
                <div className="apply-job-heading">
                    <span className="apply-job-label">POSITION APPLICATION</span>
                    <h1>Apply for {job.title}</h1>
                    <p>{job.company} • {job.location} • {job.type}</p>
                </div>

                {errorMessage && (
                    <div className="sh-alert sh-alert-error" style={{ marginBottom: "20px" }}>
                        <span>{errorMessage}</span>
                        <button
                            onClick={() => setErrorMessage("")}
                            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="apply-job-grid">
                    {/* Left: Applicant Information */}
                    <div className="apply-left-col">
                        <div className="apply-card">
                            <h3>1. Applicant Verification</h3>
                            <div className="candidate-preview-box">
                                <div className="preview-field">
                                    <span>Full Name</span>
                                    <strong>{candidate.name}</strong>
                                </div>
                                <div className="preview-field">
                                    <span>Email Address</span>
                                    <strong>{candidate.email}</strong>
                                </div>
                                <div className="preview-field">
                                    <span>Contact Phone</span>
                                    <strong>{candidate.phone}</strong>
                                </div>
                                <div className="preview-field">
                                    <span>Education Background</span>
                                    <strong>{candidate.education}</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>SKILLS ON FILE</span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                                    {candidate.skills.map((s, idx) => (
                                        <span key={idx} className="sh-badge sh-badge-muted">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resume Attachment */}
                        <div className="apply-card">
                            <h3>2. Resume & Portfolio</h3>
                            <div className="resume-upload-zone">
                                <input
                                    type="file"
                                    id="resume-file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="resume-file" className="upload-box" style={{ cursor: "pointer" }}>
                                    <FileText size={32} color="var(--primary-emerald)" />
                                    <strong>{resumeFile ? resumeFile.name : "Attach Updated Resume (.pdf, .docx)"}</strong>
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                        {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : "Click to select file or leave default profile resume"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Cover Note & Submission */}
                    <div className="apply-right-col">
                        <div className="apply-card">
                            <h3>3. Cover Message to Recruiter</h3>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                                Highlight why you are a strong match for this position.
                            </p>
                            <textarea
                                className="sh-textarea"
                                style={{ minHeight: "140px" }}
                                placeholder="Explain your motivation, key achievements, and availability..."
                                value={coverMessage}
                                onChange={(e) => setCoverMessage(e.target.value)}
                            />

                            <div className="apply-summary-box" style={{ marginTop: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Target Position</span>
                                    <strong>{job.title}</strong>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Organization</span>
                                    <strong>{job.company}</strong>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Compensation</span>
                                    <strong style={{ color: "var(--primary-emerald)" }}>{job.salary}</strong>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="sh-btn sh-btn-primary sh-btn-lg"
                                style={{ width: "100%", marginTop: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                            >
                                {submitting ? "Submitting Application..." : <><span>Submit Application</span> <ArrowRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default ApplyJob;