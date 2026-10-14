import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import SmartHireLogo from "../Components/SmartHireLogo";
import { authApi } from "../api";
import "../CSS/Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "JOB_SEEKER"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            await authApi.register(formData);

            alert("Registration successful!");
            navigate("/login");

        } catch (error) {
            console.error("Registration error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response) {
                const responseData = error.response.data;

                const errorMessage =
                    typeof responseData === "string"
                        ? responseData
                        : responseData?.message ||
                          responseData?.error ||
                          `Registration failed (${error.response.status})`;

                alert(errorMessage);
            } else {
                alert(
                    "Unable to connect to the server. Please check your internet connection and try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            {/* Background animations */}
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>
            <div className="bg-circle bg-circle-3"></div>

            <div className="register-container">
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "1.25rem"
                    }}
                >
                    <SmartHireLogo />
                </div>

                {/* Registration Card */}
                <div className="register-card">
                    <div className="register-header">
                        <div className="header-icon">
                            <Sparkles
                                size={22}
                                color="var(--primary-emerald)"
                            />
                        </div>

                        <h1>Create Your Account</h1>

                        <p>
                            Join SmartHire and start your career journey
                        </p>
                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Register As</label>

                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="JOB_SEEKER">
                                    Job Seeker
                                </option>

                                <option value="RECRUITER">
                                    Recruiter
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}

                            {!loading && (
                                <ArrowRight
                                    size={18}
                                    style={{ marginLeft: "8px" }}
                                />
                            )}
                        </button>
                    </form>

                    <div className="login-section">
                        <span>Already have an account?</span>

                        <Link to="/login">Login</Link>
                    </div>
                </div>

                <p className="register-footer">
                    © 2026 SmartHire · Skill-based job portal
                </p>
            </div>
        </div>
    );
}

export default Register;