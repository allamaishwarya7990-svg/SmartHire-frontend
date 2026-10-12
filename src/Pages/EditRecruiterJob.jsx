import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
ArrowLeft,
Save,
LoaderCircle,
AlertCircle,
CheckCircle2,
} from "lucide-react";

import { recruiterApi } from "../services/api";
import RecruiterSidebar from "../Components/RecruiterSidebar";
import "../CSS/theme.css";
import "../CSS/EditRecruiterJobs.css";

const EMPTY_FORM = {
title: "",
location: "",
type: "",
experience: "",
salary: "",
description: "",
requirements: "",
};

function getErrorMessage(error) {
const data = error?.response?.data;

if (typeof data === "string") return data;
if (data?.message) return data.message;
if (data?.error) return data.error;

if (error?.response?.status === 403) {
return "You do not have permission to edit this job.";
}

if (error?.response?.status === 404) {
return "Job not found. It may have been deleted.";
}

return "Something went wrong. Please try again.";
}

function EditRecruiterJobs() {
const { id } = useParams();
const navigate = useNavigate();

const [form, setForm] = useState(EMPTY_FORM);
const [originalJob, setOriginalJob] = useState(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
let cancelled = false;

async function loadJob() {
  setLoading(true);
  setError("");
  setOriginalJob(null);

  try {
    const response = await recruiterApi.getJobs();

    const jobs = Array.isArray(response.data)
      ? response.data
      : response.data?.content;

    if (!Array.isArray(jobs)) {
      throw new Error("The jobs API returned an unexpected response.");
    }

    const selectedJob = jobs.find(
      (job) => String(job.id) === String(id)
    );

    if (!selectedJob) {
      throw new Error(
        "This job was not found in your recruiter job list."
      );
    }

    if (cancelled) return;

    setOriginalJob(selectedJob);

    setForm({
      title: selectedJob.title ?? "",
      location: selectedJob.location ?? "",
      type: selectedJob.type ?? "",
      experience: selectedJob.experience ?? "",
      salary: selectedJob.salary ?? "",
      description: selectedJob.description ?? "",
      requirements: Array.isArray(selectedJob.requirements)
        ? selectedJob.requirements.join("\n")
        : selectedJob.requirements ?? "",
    });
  } catch (err) {
    if (!cancelled) {
      setError(getErrorMessage(err));
      console.error("Failed to load job for editing:", err);
    }
  } finally {
    if (!cancelled) setLoading(false);
  }
}

loadJob();

return () => {
  cancelled = true;
};

}, [id]);

function handleChange(event) {
const { name, value } = event.target;

setForm((current) => ({
  ...current,
  [name]: value,
}));

setError("");
setSuccess("");

}

async function handleSubmit(event) {
event.preventDefault();

if (!originalJob) {
  setError("Job details have not loaded. Please reload the page.");
  return;
}

if (!form.title.trim() || !form.location.trim()) {
  setError("Job title and location are required.");
  return;
}

setSaving(true);
setError("");
setSuccess("");

try {
  /*
   * Keep existing job fields so fields not shown in this form
   * are not accidentally discarded.
   */
  const payload = {
    ...originalJob,
    title: form.title.trim(),
    location: form.location.trim(),
    type: form.type.trim(),
    experience: form.experience.trim(),
    salary: form.salary.trim(),
    description: form.description.trim(),
    requirements:
      typeof originalJob.requirements === "string" ||
      originalJob.requirements == null
        ? form.requirements.trim()
        : form.requirements
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
  };

  /*
   * The URL ID identifies the job. Do not change its ID here.
   * The backend should validate recruiter ownership.
   */
  await recruiterApi.updateJob(id, payload);

  setSuccess("Job updated successfully.");

  navigate("/recruiter/jobs", {
    state: { message: "Job updated successfully." },
  });
} catch (err) {
  setError(getErrorMessage(err));
  console.error("Failed to update recruiter job:", err);
} finally {
  setSaving(false);
}

}

if (loading) {
return (
<div className="edit-recruiter-page">
<RecruiterSidebar />

    <main className="edit-recruiter-main">
      <div className="edit-recruiter-loading">
        <LoaderCircle className="edit-recruiter-spinner" size={28} />
        <p>Loading job details...</p>
      </div>
    </main>
  </div>
);

}

return (
<div className="edit-recruiter-page">
<RecruiterSidebar />

  <main className="edit-recruiter-main">
    <header className="edit-recruiter-topbar">
      <button
        type="button"
        className="edit-recruiter-back"
        onClick={() => navigate("/recruiter/jobs")}
      >
        <ArrowLeft size={18} />
        <span>Back to My Jobs</span>
      </button>

      <span className="edit-recruiter-topbar-label">
        RECRUITER PORTAL
      </span>
    </header>

    <div className="edit-recruiter-content">
      <div className="edit-recruiter-heading">
        <span className="edit-recruiter-eyebrow">
          JOB MANAGEMENT
        </span>

        <h1>Edit Job</h1>

        <p>
          Update your job posting details and save your changes.
        </p>

        {originalJob && (
          <span className="edit-recruiter-job-id">
            Job ID: {originalJob.id}
          </span>
        )}
      </div>

      {error && (
        <div className="edit-recruiter-alert edit-recruiter-alert-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="edit-recruiter-alert edit-recruiter-alert-success" role="status">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      {!originalJob ? (
        <section className="edit-recruiter-card edit-recruiter-not-found">
          <h2>Unable to load this job</h2>
          <p>
            Check that the job exists and that you are logged in with
            the correct recruiter account.
          </p>

          <button
            type="button"
            className="edit-recruiter-button edit-recruiter-button-primary"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Return to My Jobs
          </button>
        </section>
      ) : (
        <form className="edit-recruiter-card" onSubmit={handleSubmit}>
          <div className="edit-recruiter-card-heading">
            <div>
              <h2>Job Information</h2>
              <p>Fields marked with * are required.</p>
            </div>
          </div>

          <div className="edit-recruiter-form-grid">
            <div className="edit-recruiter-field">
              <label htmlFor="edit-job-title">Job Title *</label>
              <input
                id="edit-job-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
                required
                maxLength={150}
              />
            </div>

            <div className="edit-recruiter-field">
              <label htmlFor="edit-job-location">Location *</label>
              <input
                id="edit-job-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Telangana"
                required
                maxLength={200}
              />
            </div>

            <div className="edit-recruiter-field">
              <label htmlFor="edit-job-type">Employment Type</label>
              <input
                id="edit-job-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Full Time"
                maxLength={100}
              />
            </div>

            <div className="edit-recruiter-field">
              <label htmlFor="edit-job-experience">Experience</label>
              <input
                id="edit-job-experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 0–2 Years"
                maxLength={100}
              />
            </div>

            <div className="edit-recruiter-field edit-recruiter-field-full">
              <label htmlFor="edit-job-salary">Salary</label>
              <input
                id="edit-job-salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. ₹5–8 LPA"
                maxLength={100}
              />
            </div>

            <div className="edit-recruiter-field edit-recruiter-field-full">
              <label htmlFor="edit-job-description">
                Job Description
              </label>
              <textarea
                id="edit-job-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and expectations."
                rows={6}
              />
            </div>

            <div className="edit-recruiter-field edit-recruiter-field-full">
              <label htmlFor="edit-job-requirements">
                Requirements
              </label>
              <textarea
                id="edit-job-requirements"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Enter the required skills and qualifications."
                rows={5}
              />
              <span className="edit-recruiter-help">
                If your backend stores requirements as a list, enter
                one requirement per line.
              </span>
            </div>
          </div>

          <div className="edit-recruiter-form-actions">
            <button
              type="button"
              className="edit-recruiter-button edit-recruiter-button-secondary"
              disabled={saving}
              onClick={() => navigate("/recruiter/jobs")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-recruiter-button edit-recruiter-button-primary"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle
                  size={17}
                  className="edit-recruiter-spinner"
                />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  </main>
</div>

);
}

export default EditRecruiterJobs;