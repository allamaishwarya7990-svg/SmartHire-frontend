import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/JobSeekerProfile.css";

function JobSeekerProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        fullName: "",
        email: localStorage.getItem("email") || "",
        phone: "",
        location: "",
        qualification: "",
        degree: "",
        college: "",
        graduationYear: "",
        skills: "",
        experienceType: "",
        experienceYears: "",
        resume: null
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // ==============================
    // LOAD PROFILE
    // ==============================
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:8081/api/jobseeker/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Profile response:", response.data);

                setProfile((prev) => ({
                    ...prev,
                    ...response.data,
                    email: response.data.email || prev.email
                }));

            } catch (error) {
                console.error("Error loading profile:", error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.clear();
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==============================
    // HANDLE RESUME
    // ==============================
    const handleResumeChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfile((prev) => ({
                ...prev,
                resume: file
            }));
        }
    };

    // ==============================
    // SAVE PROFILE
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setSaving(true);

        try {
            const profileData = {
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                qualification: profile.qualification,
                degree: profile.degree,
                college: profile.college,
                graduationYear: profile.graduationYear
                    ? Number(profile.graduationYear)
                    : null,
                skills: profile.skills,
                experienceType: profile.experienceType,
                experienceYears: profile.experienceYears
                    ? Number(profile.experienceYears)
                    : null
            };

            const response = await axios.post(
                "http://localhost:8081/api/jobseeker/profile",
                profileData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Saved profile:", response.data);

            setProfile((prev) => ({
                ...prev,
                ...response.data
            }));

            alert("Profile saved successfully!");

        } catch (error) {
            console.error("Save profile error:", error);

            if (error.response?.status === 401) {
                alert("Your session has expired. Please login again.");
                localStorage.clear();
                navigate("/login");
            } else if (error.response?.status === 403) {
                alert("You are not authorized to save this profile.");
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // LOGOUT
    // ==============================
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    // ==============================
    // LOADING SCREEN
    // ==============================
    if (loading) {
        return (
            <div className="profile-loading">
                <div className="profile-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    // ==============================
    // PROFILE PAGE
    // ==============================
    return (
        <div className="profile-page">

            {/* ================= SIDEBAR ================= */}
            <aside className="profile-sidebar">

                <Link to="/jobseeker-dashboard" className="profile-sidebar-logo">
                    <span className="profile-logo-symbol">S</span>
                    <span>SmartHire</span>
                </Link>

                <div className="profile-sidebar-user">
                    <div className="profile-user-avatar">
                        {profile.fullName
                            ? profile.fullName.charAt(0).toUpperCase()
                            : "U"}
                    </div>

                    <div>
                        <h4>
                            {profile.fullName || "Job Seeker"}
                        </h4>

                        <span>Job Seeker</span>
                    </div>
                </div>

                <div className="profile-menu">

                    <p className="profile-menu-title">
                        MAIN MENU
                    </p>

                    <Link
                        to="/jobseeker-dashboard"
                        className="profile-menu-link"
                    >
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/jobs"
                        className="profile-menu-link"
                    >
                        <span>⌕</span>
                        Find Jobs
                    </Link>

                    <Link
                        to="/applications"
                        className="profile-menu-link"
                    >
                        <span>▣</span>
                        My Applications
                    </Link>

                    <Link
                        to="/saved-jobs"
                        className="profile-menu-link"
                    >
                        <span>♡</span>
                        Saved Jobs
                    </Link>

                    <p className="profile-menu-title">
                        ACCOUNT
                    </p>

                    <Link
                        to="/profile"
                        className="profile-menu-link active"
                    >
                        <span>◉</span>
                        My Profile
                    </Link>

                </div>

                <div className="profile-sidebar-bottom">

                    <button
                        type="button"
                        className="profile-logout"
                        onClick={logout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <div className="profile-content">

                {/* ================= TOPBAR ================= */}
                <header className="profile-topbar">

                    <div>
                        <h2>My Profile</h2>
                        <p>
                            Manage your personal and professional information
                        </p>
                    </div>

                    <div className="profile-topbar-user">
                        <div className="topbar-avatar">
                            {profile.fullName
                                ? profile.fullName.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <strong>
                                {profile.fullName || "Job Seeker"}
                            </strong>

                            <span>
                                {profile.email}
                            </span>
                        </div>
                    </div>

                </header>

                {/* ================= MAIN ================= */}
                <main className="profile-main">

                    {/* INTRO */}
                    <div className="profile-intro">

                        <div>
                            <span className="profile-label">
                                YOUR PROFILE
                            </span>

                            <h1>
                                Build your professional profile
                            </h1>

                            <p>
                                Keep your information updated to improve
                                your job matching and eligibility results.
                            </p>
                        </div>

                        <div className="profile-completion">

                            <div className="completion-header">
                                <span>Profile Completion</span>
                                <strong>80%</strong>
                            </div>

                            <div className="completion-bar">
                                <div
                                    className="completion-progress"
                                    style={{ width: "80%" }}
                                ></div>
                            </div>

                        </div>

                    </div>

                    {/* ================= FORM ================= */}
                    <form
                        className="profile-form"
                        onSubmit={handleSubmit}
                    >

                        {/* PERSONAL INFORMATION */}
                        <section className="profile-section">

                            <div className="section-title">

                                <span className="section-number">
                                    01
                                </span>

                                <div>
                                    <h2>Personal Information</h2>
                                    <p>
                                        Enter your basic personal details.
                                    </p>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="profile-form-group">
                                    <label htmlFor="fullName">
                                        Full Name
                                    </label>

                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        readOnly
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={profile.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="location">
                                        Location
                                    </label>

                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Hyderabad, Telangana"
                                        value={profile.location}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                        </section>

                        {/* EDUCATION */}
                        <section className="profile-section">

                            <div className="section-title">

                                <span className="section-number">
                                    02
                                </span>

                                <div>
                                    <h2>Education</h2>
                                    <p>
                                        Add your educational qualifications.
                                    </p>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="profile-form-group">
                                    <label htmlFor="qualification">
                                        Qualification
                                    </label>

                                    <select
                                        id="qualification"
                                        name="qualification"
                                        value={profile.qualification}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select qualification
                                        </option>

                                        <option value="Undergraduate">
                                            Undergraduate
                                        </option>

                                        <option value="Postgraduate">
                                            Postgraduate
                                        </option>

                                        <option value="Diploma">
                                            Diploma
                                        </option>

                                        <option value="PhD">
                                            PhD
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="degree">
                                        Degree / Specialization
                                    </label>

                                    <input
                                        id="degree"
                                        type="text"
                                        name="degree"
                                        placeholder="e.g. B.Tech Computer Science"
                                        value={profile.degree}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="college">
                                        College / University
                                    </label>

                                    <input
                                        id="college"
                                        type="text"
                                        name="college"
                                        placeholder="Enter college or university"
                                        value={profile.college}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="graduationYear">
                                        Graduation Year
                                    </label>

                                    <input
                                        id="graduationYear"
                                        type="number"
                                        name="graduationYear"
                                        placeholder="e.g. 2027"
                                        min="1950"
                                        max="2100"
                                        value={profile.graduationYear}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                        </section>

                        {/* SKILLS */}
                        <section className="profile-section">

                            <div className="section-title">

                                <span className="section-number">
                                    03
                                </span>

                                <div>
                                    <h2>Skills</h2>
                                    <p>
                                        Add the technical and professional
                                        skills you have.
                                    </p>
                                </div>

                            </div>

                            <div className="profile-form-group">

                                <label htmlFor="skills">
                                    Your Skills
                                </label>

                                <textarea
                                    id="skills"
                                    name="skills"
                                    rows="5"
                                    placeholder="e.g. Java, React, Spring Boot, MySQL, HTML, CSS"
                                    value={profile.skills}
                                    onChange={handleChange}
                                ></textarea>

                                <small>
                                    Separate multiple skills using commas.
                                </small>

                            </div>

                        </section>

                        {/* EXPERIENCE */}
                        <section className="profile-section">

                            <div className="section-title">

                                <span className="section-number">
                                    04
                                </span>

                                <div>
                                    <h2>Experience</h2>
                                    <p>
                                        Tell recruiters about your experience.
                                    </p>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="profile-form-group">
                                    <label htmlFor="experienceType">
                                        Experience Type
                                    </label>

                                    <select
                                        id="experienceType"
                                        name="experienceType"
                                        value={profile.experienceType}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select experience type
                                        </option>

                                        <option value="Fresher">
                                            Fresher
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>

                                        <option value="Full Time">
                                            Full Time
                                        </option>

                                        <option value="Part Time">
                                            Part Time
                                        </option>
                                    </select>
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="experienceYears">
                                        Years of Experience
                                    </label>

                                    <input
                                        id="experienceYears"
                                        type="number"
                                        name="experienceYears"
                                        placeholder="e.g. 1"
                                        min="0"
                                        step="0.1"
                                        value={profile.experienceYears}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                        </section>

                        {/* RESUME */}
                        <section className="profile-section">

                            <div className="section-title">

                                <span className="section-number">
                                    05
                                </span>

                                <div>
                                    <h2>Resume</h2>
                                    <p>
                                        Upload your latest resume.
                                    </p>
                                </div>

                            </div>

                            <div className="resume-upload">

                                <div className="resume-icon">
                                    📄
                                </div>

                                <div className="resume-text">
                                    <h3>
                                        Upload Resume
                                    </h3>

                                    <p>
                                        PDF, DOC or DOCX files
                                    </p>

                                    {profile.resume && (
                                        <span className="selected-file">
                                            Selected: {profile.resume.name}
                                        </span>
                                    )}
                                </div>

                                <label
                                    htmlFor="resume"
                                    className="resume-button"
                                >
                                    Choose File
                                </label>

                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    hidden
                                />

                            </div>

                        </section>

                        {/* ACTION BUTTONS */}
                        <div className="profile-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate("/jobseeker-dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-profile-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Profile"}
                            </button>

                        </div>

                    </form>

                </main>

                {/* FOOTER */}
                <footer className="profile-footer">
                    <p>
                        © 2026 SmartHire. All rights reserved.
                    </p>

                    <span>
                        Skill-Based Job Matching Platform
                    </span>
                </footer>

            </div>

        </div>
    );
}

export default JobSeekerProfile;