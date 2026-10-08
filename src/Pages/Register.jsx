import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:8081/api/users/register",
                formData
            );

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            console.error("Registration error:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Registration failed"
                );
            } else {
                alert("Unable to connect to the server");
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

                <Link to="/" className="register-logo">

                    <span className="logo-symbol">
                        S
                    </span>

                    <span>
                        SmartHire
                    </span>

                </Link>


                {/* Registration Card */}

                <div className="register-card">

                    <div className="register-header">

                        <div className="header-icon">
                            ✦
                        </div>

                        <h1>
                            Create Your Account
                        </h1>

                        <p>
                            Join SmartHire and start your career journey
                        </p>

                    </div>


                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Register As
                            </label>

                            <select
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
                                : "Create Account"
                            }

                            {!loading && (
                                <span className="arrow">
                                    →
                                </span>
                            )}

                        </button>

                    </form>


                    <div className="login-section">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>

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