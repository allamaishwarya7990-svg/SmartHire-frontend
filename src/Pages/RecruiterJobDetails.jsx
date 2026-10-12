import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobApi, authApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import "../CSS/RecruiterJobDetails.css";
import "../CSS/theme.css";

const jobs = [
  {
    id: "1",
    title: "Software Developer",
    location: "Hyderabad, Telangana",
    type: "Full Time",
    experience: "0-2 Years",
    salary: "₹5 - ₹8 LPA",
    applications: 24,
    posted: "08 Oct 2026",
    status: "Active",
    description:
      "We are looking for a Software Developer to build, maintain and improve software applications.",
    responsibilities: [
      "Develop and maintain software applications.",
      "Write clean, reusable and efficient code.",
      "Collaborate with team members to solve technical problems.",
      "Test and debug application features."
    ],
    requirements: [
      "Knowledge of Java and programming fundamentals.",
      "Understanding of databases such as MySQL.",
      "Problem-solving and communication skills.",
      "Knowledge of web technologies is an advantage."
    ]
  },
  {
    id: "2",
    title: "Java Developer",
    location: "Hyderabad, Telangana",
    type: "Full Time",
    experience: "1-3 Years",
    salary: "₹6 - ₹10 LPA",
    applications: 18,
    posted: "05 Oct 2026",
    status: "Active",
    description:
      "We are looking for a Java Developer to develop backend services and reliable application features.",
    responsibilities: [
      "Develop Java and Spring Boot applications.",
      "Build and maintain REST APIs.",
      "Work with relational databases.",
      "Debug issues and improve application performance."
    ],
    requirements: [
      "Knowledge of Java and object-oriented programming.",
      "Experience with Spring Boot and REST APIs.",
      "Understanding of MySQL or similar databases.",
      "Familiarity with Git is beneficial."
    ]
  },
  {
    id: "3",
    title: "Frontend Developer",
    location: "Remote",
    type: "Full Time",
    experience: "0-2 Years",
    salary: "₹4 - ₹7 LPA",
    applications: 12,
    posted: "28 Sep 2026",
    status: "Closed",
    description:
      "We are looking for a Frontend Developer to build responsive and user-friendly web interfaces.",
    responsibilities: [
      "Build responsive user interfaces.",
      "Develop reusable React components.",
      "Work with designers and backend developers.",
      "Test and improve website usability."
    ],
    requirements: [
      "Knowledge of HTML, CSS and JavaScript.",
      "Understanding of React fundamentals.",
      "Knowledge of responsive web design.",
      "Familiarity with Git is an advantage."
    ]
  },
  {
    id: "4",
    title: "Spring Boot Developer",
    location: "Hyderabad, Telangana",
    type: "Full Time",
    experience: "1-2 Years",
    salary: "₹6 - ₹9 LPA",
    applications: 15,
    posted: "25 Sep 2026",
    status: "Active",
    description:
      "We are looking for a Spring Boot Developer to build backend services and scalable APIs.",
    responsibilities: [
      "Develop backend services using Spring Boot.",
      "Create and maintain REST APIs.",
      "Integrate databases and application services.",
      "Troubleshoot bugs and improve performance."
    ],
    requirements: [
      "Knowledge of Java and Spring Boot.",
      "Understanding of REST API development.",
      "Knowledge of SQL databases.",
      "Understanding of software development practices."
    ]
  }
];

function RecruiterJobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(jobs.find((item) => item.id === id) || jobs[0]);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const res = await jobApi.getJobById(id);
      if (res.data) {
        const j = res.data;
        setJob({
          id: String(j.id),
          title: j.title,
          location: j.location,
          type: j.type,
          experience: j.experience,
          salary: j.salary || "Competitive",
          applications: j.applicantsCount || 0,
          posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Active",
          status: j.status || "Active",
          description: j.description,
          responsibilities: j.responsibilities ? j.responsibilities.split("\n").filter(r => r.trim()) : jobs[0].responsibilities,
          requirements: j.requirements ? j.requirements.split("\n").filter(r => r.trim()) : jobs[0].requirements
        });
      }
    } catch (err) {
      console.warn("Could not load job by id:", err);
    }
  };

  const logout = () => {
    authApi.logout();
    navigate("/login");
  };

  if (!job) {
    return (
      <div className="rjd-not-found">
        <div className="rjd-not-found-card">
          <h2>Job Not Found</h2>
          <p>The requested job could not be found.</p>
          <button onClick={() => navigate("/recruiter/jobs")}>
            <ArrowLeft size={16} /> Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rjd-page">
      <RecruiterSidebar />

      <main className="rjd-main">
        <header className="rjd-topbar">
          <div>
            <span>RECRUITER PORTAL</span>
            <h1>Job Details</h1>
          </div>

          <div className="rjd-profile">
            <div className="rjd-avatar">R</div>
            <div>
              <strong>
                {localStorage.getItem("email") || "Recruiter"}
              </strong>
              <span>Recruiter</span>
            </div>
          </div>
        </header>

        <div className="rjd-content">
          <button
            className="rjd-back"
            onClick={() => navigate("/recruiter/jobs")}
          >
            <ArrowLeft size={16} /> Back to My Jobs
          </button>

          <section className="rjd-hero">
            <div className="rjd-job-icon">
              {job.title.charAt(0)}
            </div>

            <div className="rjd-hero-info">
              <span className="rjd-eyebrow">JOB SPECIFICATION</span>
              <h2>{job.title}</h2>
              <p><MapPin size={14} /> {job.location}</p>

              <div className="rjd-tags">
                <span><Briefcase size={13} /> {job.type}</span>
                <span><Clock size={13} /> {job.experience}</span>
                <span><DollarSign size={13} /> {job.salary}</span>
              </div>
            </div>

            <span
              className={`rjd-status ${
                job.status === "Active" ? "active" : "closed"
              }`}
            >
              {job.status === "Active" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              {job.status}
            </span>
          </section>

          <section className="rjd-stats">
            <div>
              <div className="rjd-stat-header">
                <FileText size={16} />
                <span>Job ID</span>
              </div>
              <strong>JOB-{job.id}</strong>
            </div>
            <div>
              <div className="rjd-stat-header">
                <Users size={16} />
                <span>Applications</span>
              </div>
              <strong>{job.applications}</strong>
            </div>
            <div>
              <div className="rjd-stat-header">
                <Calendar size={16} />
                <span>Date Posted</span>
              </div>
              <strong>{job.posted}</strong>
            </div>
            <div>
              <div className="rjd-stat-header">
                <CheckCircle2 size={16} />
                <span>Job Status</span>
              </div>
              <strong>{job.status}</strong>
            </div>
          </section>

          <section className="rjd-panel">
            <h3>About This Job</h3>
            <p>{job.description}</p>
          </section>

          <section className="rjd-panel">
            <h3>Key Responsibilities</h3>
            <ul>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rjd-panel">
            <h3>Requirements</h3>
            <ul>
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="rjd-actions">
            <button
              className="rjd-primary"
              onClick={() => navigate("/recruiter/applications")}
            >
              <Users size={16} /> View Applications ({job.applications})
            </button>

            <button
              className="rjd-secondary"
              onClick={() => navigate("/recruiter/jobs")}
            >
              <ArrowLeft size={16} /> Back to My Jobs
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterJobDetails;
