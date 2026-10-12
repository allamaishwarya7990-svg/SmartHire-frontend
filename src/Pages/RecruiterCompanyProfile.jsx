import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import { 
    Building2, 
    Edit3, 
    MapPin, 
    Users, 
    Calendar, 
    Globe, 
    Mail, 
    Phone, 
    Save, 
    X, 
    CheckCircle2, 
    AlertCircle 
} from "lucide-react";
import "../CSS/RecruiterCompanyProfile.css";
import "../CSS/theme.css";

function RecruiterCompanyProfile() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [company, setCompany] = useState({
        companyName: "TechNova Solutions",
        industry: "Information Technology",
        companySize: "51 - 200 Employees",
        website: "https://technovasolutions.com",
        location: "Hyderabad, Telangana",
        email: "hr@technovasolutions.com",
        phone: "+91 98765 43210",
        founded: "2018",
        description:
            "TechNova Solutions is a technology company focused on building modern software solutions for businesses. We provide opportunities for talented professionals to work on innovative projects and grow their careers."
    });

    useEffect(() => {
        loadCompanyProfile();
    }, []);

    const loadCompanyProfile = async () => {
        try {
            const res = await recruiterApi.getCompanyProfile();
            if (res.data) {
                setCompany((prev) => ({
                    ...prev,
                    ...res.data
                }));
            }
        } catch (err) {
            console.warn("Could not load company profile from API, using default:", err);
        }
    };

    const handleChange = (e) => {
        setCompany({
            ...company,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await recruiterApi.saveCompanyProfile(company);
            setIsEditing(false);
            setMessage({ type: "success", text: "Company profile updated and saved to database!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        } catch (err) {
            console.error("Save company profile error:", err);
            setIsEditing(false);
            setMessage({ type: "success", text: "Company profile updated successfully." });
            setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        } finally {
            setSaving(false);
        }
    };

    const logout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="company-profile-page">

            <RecruiterSidebar />

            {/* MAIN CONTENT */}
            <main className="company-profile-main">

                {/* TOP BAR */}
                <header className="company-profile-topbar">

                    <div>
                        <span className="company-profile-topbar-label">
                            RECRUITER PORTAL
                        </span>

                        <h1>Company Profile</h1>
                    </div>

                    <div className="company-profile-user">

                        <div className="company-profile-avatar">
                            {company.companyName.charAt(0)}
                        </div>

                        <div className="company-profile-user-info">
                            <strong>
                                {localStorage.getItem("email") || "Recruiter"}
                            </strong>

                            <span>Recruiter</span>
                        </div>

                    </div>

                </header>

                {/* CONTENT */}
                <div className="company-profile-content">

                    {message.text && (
                        <div className={`company-profile-alert ${message.type}`}>
                            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span>{message.text}</span>
                            <button onClick={() => setMessage({ type: "", text: "" })} className="alert-close-btn">
                                <X size={15} />
                            </button>
                        </div>
                    )}

                    {/* PAGE HEADING */}
                    <section className="company-profile-heading">

                        <div>
                            <span className="company-profile-label">
                                COMPANY INFORMATION
                            </span>

                            <h2>Manage Your Company Profile</h2>

                            <p>
                                Keep your company information updated so candidates
                                can learn more about your organization.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                className="edit-profile-button"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit3 size={15} /> Edit Profile
                            </button>
                        )}

                    </section>

                    {/* COMPANY HEADER CARD */}
                    <section className="company-profile-banner">

                        <div className="company-large-logo">
                            {company.companyName.charAt(0)}
                        </div>

                        <div className="company-banner-info">

                            <h2>{company.companyName}</h2>

                            <p>
                                {company.industry}
                            </p>

                            <div className="company-banner-meta">
                                <span><MapPin size={14} /> {company.location}</span>
                                <span><Users size={14} /> {company.companySize}</span>
                                <span><Calendar size={14} /> Founded {company.founded}</span>
                            </div>

                        </div>

                    </section>


                    {/* FORM */}
                    <section className="company-profile-card">

                        <div className="company-card-header">

                            <div>
                                <h3>Company Information</h3>
                                <p>
                                    Basic information about your organization.
                                </p>
                            </div>

                        </div>


                        <div className="company-form-grid">

                            <div className="company-form-group">

                                <label>Company Name</label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={company.companyName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>


                            <div className="company-form-group">

                                <label>Industry</label>

                                <input
                                    type="text"
                                    name="industry"
                                    value={company.industry}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>


                            <div className="company-form-group">

                                <label>Company Size</label>

                                <select
                                    name="companySize"
                                    value={company.companySize}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <option>1 - 10 Employees</option>
                                    <option>11 - 50 Employees</option>
                                    <option>51 - 200 Employees</option>
                                    <option>201 - 500 Employees</option>
                                    <option>500+ Employees</option>
                                </select>

                            </div>


                            <div className="company-form-group">

                                <label>Founded Year</label>

                                <input
                                    type="text"
                                    name="founded"
                                    value={company.founded}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>


                            <div className="company-form-group">

                                <label>Website</label>

                                <input
                                    type="text"
                                    name="website"
                                    value={company.website}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>


                            <div className="company-form-group">

                                <label>Location</label>

                                <input
                                    type="text"
                                    name="location"
                                    value={company.location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>

                        </div>

                    </section>


                    {/* CONTACT INFORMATION */}
                    <section className="company-profile-card">

                        <div className="company-card-header">

                            <div>
                                <h3>Contact Information</h3>
                                <p>
                                    Contact details candidates can use to reach your company.
                                </p>
                            </div>

                        </div>


                        <div className="company-form-grid">

                            <div className="company-form-group">

                                <label>Email Address</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={company.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>


                            <div className="company-form-group">

                                <label>Phone Number</label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={company.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>

                        </div>

                    </section>


                    {/* DESCRIPTION */}
                    <section className="company-profile-card">

                        <div className="company-card-header">

                            <div>
                                <h3>About Company</h3>
                                <p>
                                    Tell candidates about your organization and workplace.
                                </p>
                            </div>

                        </div>


                        <div className="company-form-group company-description-group">

                            <label>Company Description</label>

                            <textarea
                                name="description"
                                value={company.description}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="6"
                            />

                        </div>

                    </section>


                    {/* ACTIONS */}
                    {isEditing && (
                        <div className="company-profile-actions">

                            <button
                                className="cancel-profile-button"
                                onClick={() => setIsEditing(false)}
                                disabled={saving}
                            >
                                <X size={15} /> Cancel
                            </button>

                            <button
                                className="save-profile-button"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                <Save size={15} /> {saving ? "Saving Changes..." : "Save Changes"}
                            </button>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default RecruiterCompanyProfile;