import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authApi } from "../services/api";
import SmartHireLogo from "../Components/SmartHireLogo";
import "../CSS/Login.css";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    // Read the returnTo param set by the 401 interceptor in api.js
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            const response = await authApi.login(formData);

            // Store login information
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);

            // Redirect to the originally intended page, or role dashboard
            if (returnTo) {
                navigate(decodeURIComponent(returnTo), { replace: true });
                return;
            }

            if (response.data.role === "JOB_SEEKER") {
                navigate("/jobseeker-dashboard");
            } else if (response.data.role === "RECRUITER") {
                navigate("/recruiter-dashboard");
            } else if (response.data.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else {
                setError("Unknown user role: " + response.data.role);
            }

        } catch (err) {

            console.error("Login error:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    err.response.data?.error ||
                    "Invalid email or password."
                );
            } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
                setError(
                    "Unable to connect to the server. " +
                    "Please check your internet connection or try again later."
                );
            } else {
                setError("Login failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-page">

            <div className="login-container">

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <SmartHireLogo />
                </div>

                <h2 className="login-title">
                    Welcome Back
                </h2>

                <p className="login-subtitle">
                    Login to your SmartHire account
                </p>

                {error && (
                    <div
                        role="alert"
                        style={{
                            background: "rgba(251,113,133,0.12)",
                            border: "1px solid rgba(251,113,133,0.35)",
                            borderRadius: "8px",
                            color: "#fb7185",
                            fontSize: "0.875rem",
                            padding: "0.75rem 1rem",
                            marginBottom: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </div>
                )}

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
                        id="login-submit"
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