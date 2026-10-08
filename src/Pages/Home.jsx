import { Link } from "react-router-dom";
import "../CSS/Home.css";

function Home() {
    return (
        <div className="home-page">

            {/* Navbar */}
            <nav className="home-navbar">
                <div className="home-logo">
                    SmartHire
                </div>

                <div className="home-nav-links">
                    <Link to="/login" className="nav-login">
                        Login
                    </Link>

                    <Link to="/register" className="nav-register">
                        Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <h1>
                        Find the Right Job.
                        <br />
                        Build Your Future.
                    </h1>

                    <p>
                        SmartHire connects job seekers with the right
                        opportunities based on their skills, qualifications,
                        and experience.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="hero-register-button"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/login"
                            className="hero-login-button"
                        >
                            Login
                        </Link>

                    </div>

                </div>

                <div className="hero-card">

                    <div className="card-icon">
                        💼
                    </div>

                    <h3>
                        Skill-Based Job Matching
                    </h3>

                    <p>
                        Check your eligibility for jobs by comparing your
                        skills and qualifications with job requirements.
                    </p>

                    <div className="match-box">
                        <span>Eligibility</span>
                        <strong>80%</strong>
                    </div>

                </div>

            </section>

            {/* Features Section */}
            <section className="features-section">

                <h2>
                    Why Choose SmartHire?
                </h2>

                <p className="features-subtitle">
                    Everything you need to manage your job search and
                    recruitment process.
                </p>

                <div className="features-container">

                    <div className="feature-card">
                        <div className="feature-icon">
                            🔍
                        </div>

                        <h3>
                            Find Jobs
                        </h3>

                        <p>
                            Search and explore job opportunities that match
                            your interests and qualifications.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            🎯
                        </div>

                        <h3>
                            Check Eligibility
                        </h3>

                        <p>
                            Compare your skills with job requirements and
                            understand your eligibility percentage.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            📋
                        </div>

                        <h3>
                            Track Applications
                        </h3>

                        <p>
                            Keep track of your applications and monitor their
                            progress in one place.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            👥
                        </div>

                        <h3>
                            Recruit Smarter
                        </h3>

                        <p>
                            Recruiters can post jobs, review applicants,
                            shortlist candidates, and manage hiring.
                        </p>
                    </div>

                </div>

            </section>

            {/* Call To Action */}
            <section className="cta-section">

                <h2>
                    Start Your Career Journey Today
                </h2>

                <p>
                    Create your SmartHire account and discover opportunities
                    that match your skills.
                </p>

                <Link
                    to="/register"
                    className="cta-button"
                >
                    Create Account
                </Link>

            </section>

            {/* Footer */}
            <footer className="home-footer">

                <h3>
                    SmartHire
                </h3>

                <p>
                    A skill-based job portal for smarter recruitment.
                </p>

                <p className="copyright">
                    © 2026 SmartHire. All rights reserved.
                </p>

            </footer>

        </div>
    );
}

export default Home;