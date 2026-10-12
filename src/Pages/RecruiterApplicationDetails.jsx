import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    ArrowLeft, 
    ArrowRight, 
    CheckCircle2, 
    GraduationCap, 
    FileText, 
    XCircle, 
    Clock 
} from "lucide-react";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import "../CSS/RecruiterApplicationDetails.css";
import "../CSS/theme.css";

function RecruiterApplicationDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const applications = {
        "APP-1001": {
            id: "APP-1001",
            jobId: "1",
            candidate: "Aishwarya",
            email: "aishwarya@example.com",
            phone: "+91 98765 43210",
            job: "Software Developer",
            location: "Hyderabad, Telangana",
            appliedDate: "08 Oct 2026",
            match: "90%",
            status: "Under Review",
            education: "B.Tech - Computer Science",
            university: "Anurag University",
            graduation: "2027",
            experience: "Fresher",
            skills: ["Java", "Spring Boot", "React", "MySQL", "HTML", "CSS"],
            resume: "Aishwarya_Resume.pdf",
            summary:
                "Computer Science student with strong interest in software development and full-stack web technologies."
        },

        "APP-1002": {
            id: "APP-1002",
            jobId: "2",
            candidate: "Rahul Kumar",
            email: "rahul@example.com",
            phone: "+91 98765 12345",
            job: "Java Developer",
            location: "Hyderabad, Telangana",
            appliedDate: "07 Oct 2026",
            match: "85%",
            status: "Shortlisted",
            education: "B.Tech - Computer Science",
            university: "JNTU Hyderabad",
            graduation: "2025",
            experience: "1 Year",
            skills: ["Java", "Spring Boot", "MySQL", "REST API", "Git"],
            resume: "Rahul_Kumar_Resume.pdf",
            summary:
                "Java developer with experience in Spring Boot, REST APIs and relational databases."
        },

        "APP-1003": {
            id: "APP-1003",
            jobId: "3",
            candidate: "Priya Sharma",
            email: "priya@example.com",
            phone: "+91 91234 56789",
            job: "Frontend Developer",
            location: "Remote",
            appliedDate: "05 Oct 2026",
            match: "78%",
            status: "Under Review",
            education: "B.Tech - Information Technology",
            university: "Osmania University",
            graduation: "2026",
            experience: "Fresher",
            skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
            resume: "Priya_Sharma_Resume.pdf",
            summary:
                "Frontend developer focused on building responsive and user-friendly React applications."
        },

        "APP-1004": {
            id: "APP-1004",
            jobId: "1",
            candidate: "Arjun Reddy",
            email: "arjun@example.com",
            phone: "+91 99887 66554",
            job: "Software Developer",
            location: "Hyderabad, Telangana",
            appliedDate: "04 Oct 2026",
            match: "72%",
            status: "Application Submitted",
            education: "B.Tech - Computer Science",
            university: "CBIT",
            graduation: "2026",
            experience: "Fresher",
            skills: ["Java", "Python", "MySQL", "HTML", "CSS"],
            resume: "Arjun_Reddy_Resume.pdf",
            summary:
                "Computer Science graduate interested in backend development and software engineering."
        },

        "APP-1005": {
            id: "APP-1005",
            jobId: "2",
            candidate: "Sneha Patel",
            email: "sneha@example.com",
            phone: "+91 90123 45678",
            job: "Java Developer",
            location: "Bangalore, Karnataka",
            appliedDate: "03 Oct 2026",
            match: "88%",
            status: "Shortlisted",
            education: "B.Tech - Computer Science",
            university: "Bangalore University",
            graduation: "2025",
            experience: "1 Year",
            skills: ["Java", "Spring Boot", "MySQL", "Hibernate", "REST API"],
            resume: "Sneha_Patel_Resume.pdf",
            summary:
                "Software developer with practical experience building Java and Spring Boot applications."
        },

        "APP-1006": {
            id: "APP-1006",
            jobId: "3",
            candidate: "Vikram Singh",
            email: "vikram@example.com",
            phone: "+91 93456 78901",
            job: "Frontend Developer",
            location: "Remote",
            appliedDate: "01 Oct 2026",
            match: "65%",
            status: "Rejected",
            education: "B.Tech - Information Technology",
            university: "Kakatiya University",
            graduation: "2026",
            experience: "Fresher",
            skills: ["HTML", "CSS", "JavaScript", "Bootstrap"],
            resume: "Vikram_Singh_Resume.pdf",
            summary:
                "Frontend development enthusiast with foundational knowledge of web technologies."
        }
    };

    const [application, setApplication] = useState(applications[id] || applications["APP-1001"]);
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        loadApplication();
    }, [id]);

    const loadApplication = async () => {
        try {
            const rawId = id ? id.replace("APP-", "") : "1";
            const res = await recruiterApi.getApplicationById(rawId);
            if (res.data) {
                const app = res.data;
                setApplication({
                    id: String(app.id),
                    jobId: String(app.jobId),
                    candidate: app.applicantName || "Candidate",
                    email: app.applicantEmail,
                    phone: app.applicantPhone || "+91 98765 43210",
                    job: app.jobTitle,
                    location: app.jobLocation || "Hyderabad, Telangana",
                    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent",
                    match: app.eligibilityScore ? `${app.eligibilityScore}%` : "85%",
                    status: app.status || "Under Review",
                    education: app.applicantEducation || "B.Tech Computer Science",
                    university: "Anurag University",
                    graduation: "2026",
                    experience: app.applicantExperience || "Fresher",
                    skills: app.applicantSkills ? app.applicantSkills.split(",").map((s) => s.trim()) : ["Java", "React"],
                    resume: app.resumePath || "Resume.pdf",
                    summary: app.coverMessage || "Candidate submitted resume for evaluation."
                });
            }
        } catch (err) {
            console.warn("Could not load application from API, using fallback:", err);
        }
    };

    const getStatusClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("shortlist")) {
            return "recruiter-details-status-shortlisted";
        }

        if (s.includes("review")) {
            return "recruiter-details-status-review";
        }

        if (s.includes("reject")) {
            return "recruiter-details-status-rejected";
        }

        return "recruiter-details-status-submitted";
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const rawId = id ? id.replace("APP-", "") : "1";
            await recruiterApi.updateApplicationStatus(rawId, newStatus);
            setApplication((prev) => ({ ...prev, status: newStatus }));
            setActionMessage(`Status updated to ${newStatus}`);
            setTimeout(() => setActionMessage(""), 3000);
        } catch (err) {
            console.error("Failed to update status on API:", err);
            setApplication((prev) => ({ ...prev, status: newStatus }));
            setActionMessage(`Status changed to ${newStatus}`);
            setTimeout(() => setActionMessage(""), 3000);
        }
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    if (!application) {
        return (
            <div className="recruiter-application-not-found">
                <div className="not-found-card">
                    <div className="not-found-icon">!</div>

                    <h1>Application Not Found</h1>

                    <p>
                        The application you are looking for does not
                        exist or is no longer available.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/recruiter/applications")
                        }
                    >
                        ← Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-application-details-page">

            {/* SIDEBAR */}

            <RecruiterSidebar />

            {/* MAIN */}

            <main className="recruiter-details-main">

                <header className="recruiter-details-topbar">

                    <div>
                        <span className="recruiter-details-topbar-label">
                            RECRUITER PORTAL
                        </span>

                        <h1>Application Details</h1>
                    </div>

                    <div className="recruiter-details-profile">

                        <div className="recruiter-details-profile-avatar">
                            R
                        </div>

                        <div className="recruiter-details-profile-info">
                            <strong>
                                {localStorage.getItem("email") ||
                                    "Recruiter"}
                            </strong>

                            <span>Recruiter</span>
                        </div>

                    </div>

                </header>

                <div className="recruiter-details-content">

                    <button
                        className="recruiter-details-back"
                        onClick={() =>
                            navigate("/recruiter/applications")
                        }
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Applications</span>
                    </button>

                    {/* APPLICATION HEADER */}

                    <section className="recruiter-details-header-card">

                        <div className="recruiter-details-candidate-avatar">
                            {application.candidate.charAt(0)}
                        </div>

                        <div className="recruiter-details-header-info">

                            <div className="recruiter-details-name-row">

                                <div>
                                    <span className="recruiter-details-label">
                                        CANDIDATE APPLICATION
                                    </span>

                                    <h2>
                                        {application.candidate}
                                    </h2>

                                    <p>
                                        {application.email}
                                    </p>
                                </div>

                                <span
                                    className={`recruiter-details-status ${getStatusClass(
                                        application.status
                                    )}`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            <div className="recruiter-details-header-meta">

                                <span>
                                    Application ID:
                                    <strong>
                                        {application.id}
                                    </strong>
                                </span>

                                <span>
                                    Applied:
                                    <strong>
                                        {application.appliedDate}
                                    </strong>
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* STATUS ACTIONS */}

                    <section className="recruiter-details-actions-card">

                        <div>
                            <span className="recruiter-details-action-label">
                                APPLICATION STATUS
                            </span>

                            <p>
                                Update the candidate's current
                                recruitment stage.
                            </p>
                        </div>

                        <div className="recruiter-details-action-buttons">

                            <button
                                className="recruiter-details-action-review"
                                onClick={() =>
                                    handleStatusChange(
                                        "Under Review"
                                    )
                                }
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Clock size={14} />
                                <span>Mark Under Review</span>
                            </button>

                            <button
                                className="recruiter-details-action-shortlist"
                                onClick={() =>
                                    handleStatusChange(
                                        "Shortlisted"
                                    )
                                }
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <CheckCircle2 size={14} />
                                <span>Shortlist Candidate</span>
                            </button>

                            <button
                                className="recruiter-details-action-reject"
                                onClick={() =>
                                    handleStatusChange("Rejected")
                                }
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <XCircle size={14} />
                                <span>Reject</span>
                            </button>

                        </div>

                    </section>

                    <div className="recruiter-details-grid">

                        <div className="recruiter-details-left">

                            {/* CANDIDATE */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">
                                    <div>
                                        <h3>
                                            Candidate Information
                                        </h3>

                                        <p>
                                            Personal information
                                            provided by the candidate.
                                        </p>
                                    </div>
                                </div>

                                <div className="recruiter-details-info-grid">

                                    <div className="recruiter-details-info-item">
                                        <span>Full Name</span>
                                        <strong>
                                            {application.candidate}
                                        </strong>
                                    </div>

                                    <div className="recruiter-details-info-item">
                                        <span>Email</span>
                                        <strong>
                                            {application.email}
                                        </strong>
                                    </div>

                                    <div className="recruiter-details-info-item">
                                        <span>Phone</span>
                                        <strong>
                                            {application.phone}
                                        </strong>
                                    </div>

                                    <div className="recruiter-details-info-item">
                                        <span>Location</span>
                                        <strong>
                                            {application.location}
                                        </strong>
                                    </div>

                                </div>

                            </section>

                            {/* EDUCATION */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">
                                    <div>
                                        <h3>Education</h3>

                                        <p>
                                            Candidate's academic
                                            background.
                                        </p>
                                    </div>
                                </div>

                                <div className="recruiter-details-education">

                                    <div className="recruiter-details-education-icon">
                                        <GraduationCap size={20} color="var(--primary-emerald)" />
                                    </div>

                                    <div>
                                        <h4>
                                            {application.education}
                                        </h4>

                                        <p>
                                            {application.university}
                                        </p>

                                        <span>
                                            Graduation:{" "}
                                            {application.graduation}
                                        </span>
                                    </div>

                                </div>

                            </section>

                            {/* SKILLS */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">
                                    <div>
                                        <h3>Skills</h3>

                                        <p>
                                            Skills listed by the
                                            candidate.
                                        </p>
                                    </div>
                                </div>

                                <div className="recruiter-details-skills">

                                    {application.skills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="recruiter-details-skill"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                                </div>

                            </section>

                            {/* SUMMARY */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">
                                    <div>
                                        <h3>
                                            Profile Summary
                                        </h3>

                                        <p>
                                            Candidate's professional
                                            summary.
                                        </p>
                                    </div>
                                </div>

                                <p className="recruiter-details-summary">
                                    {application.summary}
                                </p>

                            </section>

                        </div>

                        <aside className="recruiter-details-right">

                            {/* MATCH */}

                            <section className="recruiter-details-match-card">

                                <span className="recruiter-details-match-label">
                                    ELIGIBILITY MATCH
                                </span>

                                <div className="recruiter-details-match-score">
                                    {application.match}
                                </div>

                                <p>
                                    Candidate matches the requirements
                                    of this job.
                                </p>

                                <div className="recruiter-details-progress">

                                    <div
                                        className="recruiter-details-progress-fill"
                                        style={{
                                            width:
                                                application.match
                                        }}
                                    />

                                </div>

                            </section>

                            {/* JOB */}

                            <section className="recruiter-details-panel recruiter-details-job-panel">

                                <div className="recruiter-details-panel-heading">

                                    <div>
                                        <h3>Applied Job</h3>

                                        <p>
                                            Position the candidate
                                            applied for.
                                        </p>
                                    </div>

                                </div>

                                <div className="recruiter-details-job">

                                    <div className="recruiter-details-job-icon">
                                        {application.job.charAt(0)}
                                    </div>

                                    <div>
                                        <h4>
                                            {application.job}
                                        </h4>

                                        <p>
                                            {application.location}
                                        </p>
                                    </div>

                                </div>

                                {/* IMPORTANT FIX */}

                                <button
                                    className="recruiter-details-view-job"
                                    onClick={() => {
                                        if (application.jobId) {
                                            navigate(`/recruiter/job/${application.jobId}`);
                                        }
                                    }}
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                >
                                    <span>View Job Details</span>
                                    <ArrowRight size={14} />
                                </button>


                            </section>

                            {/* EXPERIENCE */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">
                                    <div>
                                        <h3>Experience</h3>

                                        <p>
                                            Candidate's experience
                                            level.
                                        </p>
                                    </div>
                                </div>

                                <div className="recruiter-details-experience">

                                    <span>
                                        Experience Level
                                    </span>

                                    <strong>
                                        {application.experience}
                                    </strong>

                                </div>

                            </section>

                            {/* RESUME */}

                            <section className="recruiter-details-panel">

                                <div className="recruiter-details-panel-heading">

                                    <div>
                                        <h3>Resume</h3>

                                        <p>
                                            Candidate's submitted
                                            resume.
                                        </p>
                                    </div>

                                </div>

                                <div className="recruiter-details-resume">

                                    <div className="recruiter-details-resume-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <FileText size={20} color="var(--primary-emerald)" />
                                    </div>

                                    <div className="recruiter-details-resume-info">

                                        <strong>
                                            {application.resume}
                                        </strong>

                                        <span>
                                            Candidate Resume
                                        </span>

                                    </div>

                                    <button
                                        className="recruiter-details-resume-btn"
                                        onClick={() =>
                                            alert(
                                                "Resume preview will be connected to the backend later."
                                            )
                                        }
                                    >
                                        View
                                    </button>

                                </div>

                            </section>

                        </aside>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default RecruiterApplicationDetails;