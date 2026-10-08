import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobSeekerProfile from "./pages/JobSeekerProfile";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Job Seeker Routes */}
                <Route
                    path="/jobseeker-dashboard"
                    element={<JobSeekerDashboard />}
                />

                <Route
                    path="/jobs"
                    element={<div>Find Jobs Page</div>}
                />

                <Route
                    path="/applications"
                    element={<div>My Applications Page</div>}
                />

                <Route
                    path="/saved-jobs"
                    element={<div>Saved Jobs Page</div>}
                />

                <Route
                    path="/profile"
                    element={<JobSeekerProfile />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;                                                                                                                                     