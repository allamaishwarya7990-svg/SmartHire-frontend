import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import { ArrowRight, X } from "lucide-react";
import "../CSS/PostJob.css";
import "../CSS/theme.css";

function PostJob() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        type: "Full Time",
        workMode: "Hybrid",
        experience: "0 - 1 Years",
        education: "B.Tech / B.E",
        skills: "",
        salary: "",
        openings: 1,
        description: "",
        responsibilities: "",
        requirements: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSubmitting(true);

        try {
            await recruiterApi.createJob(formData);
            navigate("/recruiter/jobs");
        } catch (err) {
            console.error("Failed to post job:", err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to publish job. Please ensure you are logged in as a recruiter.";
            setErrorMessage(typeof msg === "string" ? msg : "Error publishing job.");
        } finally {
            setSubmitting(false);
        }
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="post-job-page">
            <RecruiterSidebar />

            {/* Main Content Area */}
            <main className="post-job-main">
                <header className="post-job-header">
                    <div>
                        <span className="post-job-badge">EMPLOYER PORTAL</span>
                        <h1>Publish a New Opening</h1>
                    </div>
                </header>

                <section className="post-job-content">
                    <div className="post-job-form-header">
                        <div>
                            <h2>Create Job Posting</h2>
                            <p>Add the job details, requirements and skills to find and evaluate qualified candidates.</p>
                        </div>
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

                    <form className="post-job-form" onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-number">01</div>
                                <div>
                                    <h3>Basic Information</h3>
                                    <p>Provide the core title and location details.</p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Job Title <span>*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Senior Software Developer"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Company Name <span>*</span></label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="e.g. TechNova Solutions"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location <span>*</span></label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Hyderabad, Telangana"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Job Type <span>*</span></label>
                                    <select
                                        name="type"
                                        required
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Work Mode <span>*</span></label>
                                    <select
                                        name="workMode"
                                        required
                                        value={formData.workMode}
                                        onChange={handleChange}
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-number">02</div>
                                <div>
                                    <h3>Job Requirements & Compensation</h3>
                                    <p>Define candidate qualification criteria.</p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Experience <span>*</span></label>
                                    <select
                                        name="experience"
                                        required
                                        value={formData.experience}
                                        onChange={handleChange}
                                    >
                                        <option value="Fresher">Fresher</option>
                                        <option value="0 - 1 Years">0 - 1 Years</option>
                                        <option value="1 - 2 Years">1 - 2 Years</option>
                                        <option value="2 - 3 Years">2 - 3 Years</option>
                                        <option value="3 - 5 Years">3 - 5 Years</option>
                                        <option value="5+ Years">5+ Years</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Education <span>*</span></label>
                                    <select
                                        name="education"
                                        required
                                        value={formData.education}
                                        onChange={handleChange}
                                    >
                                        <option value="B.Tech / B.E">B.Tech / B.E</option>
                                        <option value="BCA">BCA</option>
                                        <option value="M.Tech / M.E">M.Tech / M.E</option>
                                        <option value="MCA">MCA</option>
                                        <option value="Any Graduate">Any Graduate</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Required Skills (Comma-separated) <span>*</span></label>
                                    <input
                                        type="text"
                                        name="skills"
                                        placeholder="e.g. Java, Spring Boot, MySQL, React"
                                        required
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                    <small>Skills will be used for automated qualification match scoring.</small>
                                </div>

                                <div className="form-group">
                                    <label>Compensation / Salary Package</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        placeholder="e.g. ₹6 - ₹10 LPA"
                                        value={formData.salary}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Number of Openings</label>
                                    <input
                                        type="number"
                                        name="openings"
                                        min="1"
                                        value={formData.openings}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description & Responsibilities */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-number">03</div>
                                <div>
                                    <h3>Role Description & Responsibilities</h3>
                                    <p>Comprehensive description of responsibilities.</p>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Job Description <span>*</span></label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    placeholder="Describe the mission, scope of work, and project context..."
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width" style={{ marginTop: "16px" }}>
                                <label>Key Responsibilities</label>
                                <textarea
                                    name="responsibilities"
                                    rows="4"
                                    placeholder="• Build scalable microservices\n• Optimize SQL query latency\n• Collaborate in sprint planning"
                                    value={formData.responsibilities}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="post-job-actions">
                            <button
                                type="button"
                                className="cancel-job-button"
                                onClick={() => navigate("/recruiter/jobs")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="publish-job-button"
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                {submitting ? "Publishing..." : <><span>Publish Job</span> <ArrowRight size={15} /></>}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default PostJob;