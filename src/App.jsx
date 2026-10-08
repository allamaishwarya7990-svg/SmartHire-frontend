import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import JobSeekerDashboard from "./Pages/JobSeekerDashboard";
import JobSeekerProfile from "./Pages/JobSeekerProfile";
import FindJobs from "./Pages/FindJobs";
import JobDetails from "./Pages/JobDetails";
import EligibilityAnalysis from "./Pages/EligibilityAnalysis";
import ApplyJob from "./Pages/ApplyJob";
import MyApplications from "./Pages/MyApplications";


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
                    element={<FindJobs />}
                />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route
                    path="/job/:id/eligibility"
                    element={<EligibilityAnalysis />}
                />
                <Route
                    path="/job/:id/apply"
                    element={<ApplyJob />}
                />

                <Route
                    path="/applications"
                    element={<MyApplications />}
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