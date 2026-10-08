import { useParams, useNavigate } from "react-router-dom";
import "../CSS/EligibilityAnalysis.css";

function EligibilityAnalysis() {
    const { id } = useParams();
    const navigate = useNavigate();

    const job = {
        id: id,
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        requiredSkills: [
            "Java",
            "Spring Boot",
            "MySQL",
            "React",
            "REST API"
        ],
        candidateSkills: [
            "Java",
            "Spring Boot",
            "MySQL",
            "React"
        ],
        education: "B.Tech / B.E in Computer Science",
        experience: "0-2 Years"
    };

    const matchedSkills = job.requiredSkills.filter(skill =>
        job.candidateSkills.includes(skill)
    );

    const eligibility = Math.round(
        (matchedSkills.length / job.requiredSkills.length) * 100
    );

    return (
        <div className="eligibility-page">

            {/* Top Bar */}
            <header className="eligibility-topbar">
                <div
                    className="eligibility-logo"
                    onClick={() => navigate("/jobseeker-dashboard")}
                >
                    <span>Smart</span>Hire
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/jobs")}
                >
                    ← Back to Jobs
                </button>
            </header>

            {/* Main Content */}
            <main className="eligibility-container">

                <div className="page-heading">
                    <span className="heading-icon">📊</span>

                    <div>
                        <h1>Eligibility Analysis</h1>
                        <p>
                            See how well your profile matches this job.
                        </p>
                    </div>
                </div>

                {/* Job Information */}
                <section className="job-summary-card">

                    <div>
                        <h2>{job.title}</h2>
                        <p className="company-name">{job.company}</p>
                        <p className="job-location">
                            📍 {job.location}
                        </p>
                    </div>

                    <div className="experience-box">
                        <span>Experience</span>
                        <strong>{job.experience}</strong>
                    </div>

                </section>

                {/* Eligibility Score */}
                <section className="eligibility-score-card">

                    <div className="score-left">
                        <div className="score-circle">
                            <span>{eligibility}%</span>
                        </div>
                    </div>

                    <div className="score-content">
                        <span className="score-label">
                            Overall Eligibility
                        </span>

                        <h2>
                            {eligibility >= 80
                                ? "Excellent Match"
                                : eligibility >= 60
                                    ? "Good Match"
                                    : "Needs Improvement"}
                        </h2>

                        <p>
                            Your profile matches{" "}
                            <strong>
                                {matchedSkills.length} out of{" "}
                                {job.requiredSkills.length}
                            </strong>{" "}
                            required skills for this position.
                        </p>

                        <div className="score-progress">
                            <div
                                className="score-progress-fill"
                                style={{ width: `${eligibility}%` }}
                            ></div>
                        </div>
                    </div>

                </section>

                {/* Skills Analysis */}
                <section className="analysis-card">

                    <div className="section-title">
                        <h2>Skills Analysis</h2>
                        <span>
                            {matchedSkills.length}/
                            {job.requiredSkills.length} Matched
                        </span>
                    </div>

                    <div className="skills-list">

                        {job.requiredSkills.map((skill) => {

                            const matched =
                                job.candidateSkills.includes(skill);

                            return (
                                <div
                                    className={`skill-row ${
                                        matched
                                            ? "skill-matched"
                                            : "skill-missing"
                                    }`}
                                    key={skill}
                                >

                                    <div className="skill-info">
                                        <div className="skill-icon">
                                            {matched ? "✓" : "!"}
                                        </div>

                                        <span>{skill}</span>
                                    </div>

                                    <span className="skill-status">
                                        {matched
                                            ? "Matched"
                                            : "Missing"}
                                    </span>

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Education & Experience */}
                <section className="requirements-grid">

                    <div className="requirement-card">

                        <div className="requirement-icon">
                            🎓
                        </div>

                        <div>
                            <span>Education Requirement</span>
                            <h3>{job.education}</h3>

                            <p className="requirement-success">
                                ✓ Profile requirement satisfied
                            </p>
                        </div>

                    </div>

                    <div className="requirement-card">

                        <div className="requirement-icon">
                            💼
                        </div>

                        <div>
                            <span>Experience Requirement</span>
                            <h3>{job.experience}</h3>

                            <p className="requirement-success">
                                ✓ Experience requirement satisfied
                            </p>
                        </div>

                    </div>

                </section>

                {/* Recommendation */}
                <section className="recommendation-card">

                    <div className="recommendation-icon">
                        💡
                    </div>

                    <div>
                        <h2>SmartHire Recommendation</h2>

                        <p>
                            You are eligible for this position based on
                            your current profile. You can improve your
                            eligibility by adding the missing skills to
                            your profile.
                        </p>
                    </div>

                </section>

                {/* Actions */}
                <div className="eligibility-actions">

                    <button
                        className="secondary-action"
                        onClick={() => navigate(`/job/${id}`)}
                    >
                        ← Back to Job Details
                    </button>

                    <button
                        className="primary-action"
                       onClick={() => navigate(`/job/${id}/apply`)}
                    >
                        Apply for this Job →
                    </button>

                </div>

            </main>

        </div>
    );
}

export default EligibilityAnalysis;