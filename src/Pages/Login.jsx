import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../CSS/Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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

            const response = await axios.post(
                "http://localhost:8081/api/users/login",
                formData
            );

            console.log("Login response:", response.data);

            // Store login information
            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "email",
                response.data.email
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            alert("Login successful!");

            // Redirect based on role
            if (response.data.role === "JOB_SEEKER") {

                navigate("/jobseeker-dashboard");

            } else if (response.data.role === "RECRUITER") {

                navigate("/recruiter-dashboard");

            } else if (response.data.role === "ADMIN") {

                navigate("/admin-dashboard");

            } else {

                console.error(
                    "Unknown role:",
                    response.data.role
                );

                alert("Unknown user role");
            }

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Invalid email or password"
                );

            } else {

                alert(
                    "Unable to connect to the server"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="login-page">

            <div className="login-container">

                <Link to="/" className="login-logo">
                    <span className="login-logo-symbol">S</span>
                    <span>SmartHire</span>
                </Link>

                <h2 className="login-title">
                    Welcome Back
                </h2>

                <p className="login-subtitle">
                    Login to your SmartHire account
                </p>


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                </form>


                <p className="register-link">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create Account
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;