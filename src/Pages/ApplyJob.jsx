import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../CSS/ApplyJob.css";

function ApplyJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [coverMessage, setCoverMessage] = useState("");
    const [resume, setResume] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const job = {
        id: id,
        title: "Software Developer",
        company: "TechNova Solutions",
        location: "Hyderabad, Telangana",
        experience: "0-2 Years",
        salary: "₹4.5 - 7 LPA",
        type: "Full Time"
    };

    const candidate = {
        name: "Aishwarya",
        email: "aishwarya@example.com",
        phone: "+91 9876543210",
        education: "B.Tech - Computer Science",
        skills: [
            "Java",
            "Spring Boot",
            "MySQL",
            "React"
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="application-success-page">

                <div className="success-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>Application Submitted!</h1>

                    <p>
                        Your application for
                        <strong> {job.title} </strong>
                        at
                        <strong> {job.company} </strong>
                        has been submitted successfully.
                    </p>

                    <div className="application-number">
                        <span>Application ID</span>
                        <strong>APP-{Date.now()}</strong>
                    </div>

                    <div className="success-actions">

                        <button
                            className="view-application-btn"
                            onClick={() => navigate("/applications")}
                        >
                            View My Applications
                        </button>

                        <button
                            className="back-jobs-btn"
                            onClick={() => navigate("/jobs")}
                        >
                            Browse More Jobs
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="apply-job-page">

            {/* Header */}

            <header className="apply-header">

                <div
                    className="apply-logo"
                    onClick={() => navigate("/jobseeker-dashboard")}
                >
                    <span>Smart</span>Hire
                </div>

                <button
                    className="apply-back-btn"
                    onClick={() => navigate(`/job/${id}/eligibility`)}
                >
                    ← Back
                </button>

            </header>

            {/* Main */}

            <main className="apply-container">

                <div className="apply-heading">

                    <div>
                        <h1>Apply for Job</h1>
                        <p>
                            Review your information and submit your application.
                        </p>
                    </div>

                </div>

                {/* Job Card */}

                <section className="apply-job-card">

                    <div className="job-main-info">

                        <div className="company-logo">
                            T
                        </div>

                        <div>
                            <h2>{job.title}</h2>
                            <p>{job.company}</p>
                            <span>📍 {job.location}</span>
                        </div>

                    </div>

                    <div className="job-meta">

                        <div>
                            <span>Job Type</span>
                            <strong>{job.type}</strong>
                        </div>

                        <div>
                            <span>Experience</span>
                            <strong>{job.experience}</strong>
                        </div>

                        <div>
                            <span>Salary</span>
                            <strong>{job.salary}</strong>
                        </div>

                    </div>

                </section>

                <form
                    className="application-form"
                    onSubmit={handleSubmit}
                >

                    {/* Profile */}

                    <section className="form-section">

                        <div className="section-header">
                            <div>
                                <h2>Your Profile</h2>
                                <p>
                                    Information from your SmartHire profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="profile-grid">

                            <div className="profile-field">
                                <span>Full Name</span>
                                <strong>{candidate.name}</strong>
                            </div>

                            <div className="profile-field">
                                <span>Email</span>
                                <strong>{candidate.email}</strong>
                            </div>

                            <div className="profile-field">
                                <span>Phone</span>
                                <strong>{candidate.phone}</strong>
                            </div>

                            <div className="profile-field">
                                <span>Education</span>
                                <strong>{candidate.education}</strong>
                            </div>

                        </div>

                    </section>

                    {/* Skills */}

                    <section className="form-section">

                        <div className="section-header">
                            <div>
                                <h2>Your Skills</h2>
                                <p>
                                    Skills that will be included with your application.
                                </p>
                            </div>
                        </div>

                        <div className="candidate-skills">

                            {candidate.skills.map((skill) => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            ))}

                        </div>

                    </section>

                    {/* Resume */}

                    <section className="form-section">

                        <div className="section-header">
                            <div>
                                <h2>Resume</h2>
                                <p>
                                    Upload your latest resume.
                                </p>
                            </div>
                        </div>

                        <label className="resume-upload">

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>
                                    setResume(e.target.files[0])
                                }
                            />

                            <div className="upload-icon">
                                📄
                            </div>

                            {resume ? (
                                <>
                                    <strong>{resume.name}</strong>
                                    <span>
                                        Resume selected successfully
                                    </span>
                                </>
                            ) : (
                                <>
                                    <strong>
                                        Click to upload your resume
                                    </strong>

                                    <span>
                                        PDF, DOC or DOCX
                                    </span>
                                </>
                            )}

                        </label>

                    </section>

                    {/* Cover Message */}

                    <section className="form-section">

                        <div className="section-header">
                            <div>
                                <h2>Cover Message</h2>
                                <p>
                                    Tell the recruiter why you are suitable
                                    for this position.
                                </p>
                            </div>
                        </div>

                        <textarea
                            value={coverMessage}
                            onChange={(e) =>
                                setCoverMessage(e.target.value)
                            }
                            placeholder="Write a short message to the recruiter..."
                            rows="6"
                        />

                        <div className="character-count">
                            {coverMessage.length}/500
                        </div>

                    </section>

                    {/* Confirmation */}

                    <section className="confirmation-box">

                        <input
                            type="checkbox"
                            id="confirm"
                            required
                        />

                        <label htmlFor="confirm">
                            I confirm that the information provided in my
                            profile and application is accurate.
                        </label>

                    </section>

                    {/* Actions */}

                    <div className="application-actions">

                        <button
                            type="button"
                            className="cancel-application"
                            onClick={() => navigate(`/job/${id}`)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-application"
                        >
                            Submit Application →
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default ApplyJob;